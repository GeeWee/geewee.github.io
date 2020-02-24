---
title: "Observables or not: A case study"
permalink: "/csharp-observables-rewritten"
draft: true
---



```csharp

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Reactive.Threading.Tasks;
using System.Threading;
using System.Threading.Tasks;
using EventHarmonizer.Services;
using Microsoft.Azure.EventHubs;
using Microsoft.Azure.EventHubs.Processor;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Serilog;
using Serilog.Context;
using Shared;
using Shared.EventHub;
using Shared.Logging;
using Shared.Models;
using Shared.Options;

namespace EventHarmonizer.EventHub
{
    public class EventProcessorFactory : IEventProcessorFactory
    {
        private readonly IEventHubDispatcher _eventHubDispatcher;
        private readonly CheckPointerFactory _checkPointerFactory;
        private readonly IOptionsMonitor<DigestEventHubOptions> _digestOptionsMonitor;

        private readonly ITelemetry _telemetry;
        private readonly ITelemetryClient _telemetryClient;


        // This ThroughputCounter is thread-safe and shared among the EventProcessors to get an accurate
        // picture of how many events we actually process, in a multi-threaded context.
        // We add a GUID to it, so we can distinguish between the different harmonizer instances on Azure.
        private readonly ThroughputCounter _throughputCounter =
            new ThroughputCounter($"EventHarmonizerEvents");

        private readonly IUniformEventConverter _uniformEventConverter;

        public EventProcessorFactory(IUniformEventConverter uniformEventConverter,
            IEventHubDispatcher eventHubDispatcher,
            ITelemetry telemetry, ITelemetryClient telemetryClient, CheckPointerFactory checkPointerFactory,
            IOptionsMonitor<DigestEventHubOptions> digestOptionsMonitor)
        {
            _uniformEventConverter = uniformEventConverter;
            _eventHubDispatcher = eventHubDispatcher;
            _telemetry = telemetry;
            _telemetryClient = telemetryClient;
            _checkPointerFactory = checkPointerFactory;
            _digestOptionsMonitor = digestOptionsMonitor;
            _throughputCounter.Start();
        }


        public IEventProcessor CreateEventProcessor(PartitionContext context)
        {
            return new EventProcessor(_uniformEventConverter, _eventHubDispatcher, _telemetry,
                _checkPointerFactory.BuildCheckpointer(5000),
                _throughputCounter, _telemetryClient, _digestOptionsMonitor);
        }
    }

    public class EventProcessor : IEventProcessor
    {
        private readonly ICheckpointer _checkpointer;
        private readonly ThroughputCounter _counter;
        private readonly IEventHubDispatcher _eventHubDispatcher;

        private readonly ITelemetry _telemetry;
        private readonly ITelemetryClient _telemetryClient;
        private readonly IOptionsMonitor<DigestEventHubOptions> _digestEventHubOptions;
        private readonly IUniformEventConverter _uniformEventConverter;

        private readonly Subject<IEnumerable<EventData>> _subject = new Subject<IEnumerable<EventData>>();


        public EventProcessor(IUniformEventConverter uniformEventConverter, IEventHubDispatcher eventHubDispatcher,
            ITelemetry telemetry, ICheckpointer checkpointer, ThroughputCounter counter,
            ITelemetryClient telemetryClient, IOptionsMonitor<DigestEventHubOptions> digestEventHubOptions)
        {
            _uniformEventConverter = uniformEventConverter;
            _eventHubDispatcher = eventHubDispatcher;
            _telemetry = telemetry;
            _checkpointer = checkpointer;

            _counter = counter;
            _telemetryClient = telemetryClient;
            _digestEventHubOptions = digestEventHubOptions;
        }


        public Task CloseAsync(PartitionContext context, CloseReason reason)
        {
            return Task.CompletedTask;
        }

        public Task OpenAsync(PartitionContext context)
        {
            Log.Debug("Listening on partition {partitionId}", context.PartitionId);
            return Task.CompletedTask;
        }

        public Task ProcessErrorAsync(PartitionContext context, Exception error)
        {
            // Only for informational purposes, see https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor?view=azure-dotnet#methods
            Log.Error(
                $"Error on Partition: {context.PartitionId}, Error: {error.Message}, stack: {error.StackTrace}");
            return Task.CompletedTask;
        }
        
        



        public async Task ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
        {
            using var _operationHolder = _telemetryClient.StartRequestOperation("eventHarmonizerProcessEvents");
            _subject.OnNext(messages);

            
            async Task<UniformEventBatch> ConvertEventDataToUniform(RawEventBatch eventData)
            {
                using (LogContext.PushProperty(LoggingManager.EventIdContextName, eventData.Guid))
                {
                    try
                    {
                        return await _uniformEventConverter.ConvertRawEventToUniform(eventData);
                    }
                    catch (Exception e)
                    {
                        Log.Error(e, $"Error processing message on partition {context.PartitionId}");
                        return await Observable.Empty<UniformEventBatch>();
                    }
                }
            }

            ;

            EventHubClientAdapter client = null!;

            Stopwatch? stopwatch = null;
            
            _subject.SelectMany(i => i)
                
                .Do(_ => stopwatch = Stopwatch.StartNew())
                .Select(eventData => GZip.Decompress<RawEventBatch>(eventData.Body))
                // How to do logging scopes good here?
                
                .SelectMany(ConvertEventDataToUniform)
                
                // Compress
                .Select(objectToGzip => GZip.Compress(JsonConvert.SerializeObject(objectToGzip)))
                
                // Batch stuff 
                .Scan((send: false, buffer: new EventDataBatch(400_000), emit: new EventDataBatch(400_000)),
                    (accumulator, next) =>
                    {
                        var (send, buffer, emit) = accumulator;
                        // Try add to buffer
                        if (!buffer.TryAdd(new EventData(next)))
                        {
                            var newBuffer = new EventDataBatch(4);
                            newBuffer.TryAdd(new EventData(next));
                            return (send: true, buffer: newBuffer, emit: buffer);
                        }

                        return (send: false, buffer: buffer, emit: emit);
                    })
                
                .Where(s => s.send)
                
                .Select(s => s.buffer)
                
                .Do(async s => { await client.SendAsync(s); }) 
                
                .Select(s => s.ToEnumerable().ToList())
                .Do(async s =>
                {
                    // TODO what happens if it throws an exception 
                    await _checkpointer.Checkpoint(context, s.Count);
                    ReportMetrics(context, s.Last());
                    stopwatch.Stop();

                    var timePerMessage = stopwatch.ElapsedMilliseconds == 0
                        ? "NaN"
                        : (stopwatch.ElapsedMilliseconds / (float) s.Count).ToString();

                    Log.Debug(
                        "Finished processing {messages} messages on partition {partitionId}. {timePerMessage}ms/msg taken. Now at sequence number {sequenceNumber}",
                        s.Count, context.PartitionId, timePerMessage,
                        s.Last().SystemProperties.SequenceNumber);
                });
        }

        // Report metrics when sending these messages. This will probably change in the future, when we figure out exactly
        // what metrics we'll need.
        private void ReportMetrics(PartitionContext context, EventData lastEventProcessed)
        {
            // Calculate how far behind we are
            var systemProperties = lastEventProcessed.SystemProperties;
            var messageQueuedUpAt = systemProperties.EnqueuedTimeUtc;

            // This corresponds to the latency - how far has this message "waited" before being sent onwards
            var timeBehind = DateTime.UtcNow - messageQueuedUpAt;
            var messagesBehind = context.RuntimeInformation.LastSequenceNumber - systemProperties.SequenceNumber;

            Log.Debug(
                $"<Partition {context.PartitionId}> Last message processed was put on eventhub at: '{messageQueuedUpAt}'");
            _telemetry.TrackHarmonizerTelemetry(timeBehind, messagesBehind, context.PartitionId);
        }
    }
}

```