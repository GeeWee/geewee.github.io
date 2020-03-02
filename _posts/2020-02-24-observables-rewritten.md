---
title: "Observables or not: A case study"
permalink: "/csharp-observables-rewritten"
draft: true
---
```csharp

// ----------------- Section - start logging -----------------------
            using var _operationHolder = _telemetryClient.StartRequestOperation("eventHarmonizerProcessEvents");
            var stopwatch = Stopwatch.StartNew();
            
            // ----------------- Section - convert to a different type -----------------------
            var messageList = messages.ToList();
            var uniformEventList = new List<UniformEventBatch>(messageList.Count);
            foreach (var eventHubEvent in messageList)
                try
                {
                    var rawEventBatch = GZip.Decompress<RawEventBatch>(eventHubEvent.Body);
                    using (LogContext.PushProperty(LoggingManager.EventIdContextName, rawEventBatch.Guid))
                    {
                        var uniformEventBatch = await _uniformEventConverter.ConvertRawEventToUniform(rawEventBatch);
                        uniformEventList.Add(uniformEventBatch);
                    }
                }
                catch (Exception e)
                {
                    Log.Error(e, $"Error processing message on partition {context.PartitionId}");
                }
            
            // ----------------- Section - send off to the next eventhub -----------------------
            using var _ =
                LogContext.PushProperty(LoggingManager.EventIdContextName, uniformEventList.Select(u => u.Guid));
            await _eventHubDispatcher.SendToEventHub(uniformEventList,
                IEventHubDispatcher.FourHundredKiloBytesInBytes,
                _digestEventHubOptions.CurrentValue.WtgEventHubName,
                _digestEventHubOptions.CurrentValue.EventHubConnectionString
            );

            // ----------------- Section - logging and metrics -----------------------
            stopwatch.Stop();
            ReportMetrics(context, messageList.Last(), stopwatch, messageList);

            await _checkpointer.Checkpoint(context, messageList.Count);
        }

```


```csharp
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


# Round two

```csharp

// EXTENSION METHOD
public static IObservable<EventDataBatch> Batch<T>(this IObservable<T> source, int maxBatchSizeInBytes)
        {
            return source.Materialize()
                .Scan(
                    (emit: Enumerable.Empty<Notification<EventDataBatch>>(),
                        currentBatch: new EventDataBatch(maxBatchSizeInBytes)),
                    (acc, next) =>
                    {
                        acc.emit = Enumerable.Empty<Notification<EventDataBatch>>();

                        next.Accept(
                            // If we get a new element, try adding it to our currentbatch 
                            onNext: (currentObjectToSend) =>
                            {
                                var gzippedObjectToSend =
                                    GZip.Compress(JsonConvert.SerializeObject(currentObjectToSend));
                                // LONG TAKES 21 byte

                                var eventData = new EventData(gzippedObjectToSend);

                                // If we can add it, do that and do nothing else.
                                if (acc.currentBatch.TryAdd(eventData))
                                {
                                    Console.WriteLine("Succesfully added eventData");
                                    // return acc;
                                }

                                // If we can't emit anymore. 
                                else
                                {
                                    Console.WriteLine("Had to start a new batch");
                                    // Emit the Current batch

                                    // TODO acc.emit is never reset..??
                                    acc.emit = Notification.CreateOnNext(acc.currentBatch).Yield();
                                    acc.currentBatch = new EventDataBatch(maxBatchSizeInBytes);
                                }
                            },
                            onError: exception =>
                            {
                                Console.WriteLine("Onerror");
                                acc.emit = Notification.CreateOnError<EventDataBatch>(exception).Yield();
                            },
                            onCompleted: () =>
                            {
                                Console.WriteLine("Stream finished, emitting last");
                                acc.emit = new Notification<EventDataBatch>[]
                                {
                                    Notification.CreateOnNext(acc.currentBatch),
                                    Notification.CreateOnCompleted<EventDataBatch>(),
                                };
                            }
                        );

                        return acc;
                    })
                .SelectMany(acc => acc.emit)
                .Dematerialize();
        }
        
// METHOD CALL
public async Task ProcessEventsAsyncObservable(PartitionContext context, IEnumerable<EventData> messages)
        {
            using var _operationHolder = _telemetryClient.StartRequestOperation("eventHarmonizerProcessEvents");
            Stopwatch? stopwatch = Stopwatch.StartNew();

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

            await messages.ToObservable()
                // .SelectMany(i => i)
                .Do(_ => stopwatch = Stopwatch.StartNew()) // done for each element currently
                .Select(eventData => GZip.Decompress<RawEventBatch>(eventData.Body))
                .SelectMany(ConvertEventDataToUniform)
                // Compress
                .Select(objectToGzip => GZip.Compress(JsonConvert.SerializeObject(objectToGzip)))
                // Batch stuff 
                .Batch(maxBatchSizeInBytes: 400_000)
                .Do(async s => { await _eventHubClientAdapter.SendAsync(s); })
                .Select(s => s.ToEnumerable().ToList())
                .Do(async s =>
                {
                    // TODO what happens if it throws an exception 
                    await _checkpointer.Checkpoint(context, s.Count);
                    stopwatch.Stop();
                    ReportMetrics(context, s.Last(), stopwatch, messages.ToList());
                }).ToTask();
            
            // TODO how to return a TASK??

            await Task.CompletedTask;
        }

```