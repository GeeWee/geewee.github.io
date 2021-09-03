---
title: Testing and scope management in ASP.NET Core BackgroundServices
permalink: '/testing-and-scope-management-aspnetcore-backgroundservices'
---
# TODO split up into scope management and testing?
# TODO update previous post

_This is part 2 of my series about ASP.NET Core series about BackgroundServices and IHostedService. Previous part can be found [here]({% post_url 2021-09-02-hosted-services-difference %})_


BackgroundServices in ASP.NET Core is a broad topic which I could write much about (and previously have). They can be tricky to use right, so here I'm going to try to answer the following questions: "How do I test my BackgroundServices", and "How do I manage scope inside my BackgroundServices". Let's go. 

# BackgroundService
A BackgroundService is a service for running longer-lasting or periodic tasks in the background. It has one method `ExecuteAsync`.

I would say that 90% of the BackgroundServices I've written or seen are more advanced versions of this:
```csharp
public class BackgroundService1 : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            DoSomePeriodicTask();
            await Task.Delay(1000, stoppingToken);
        }
    }
}
```

As we've talked about previously, this will fail silently if `DoSomePeriodicTask()` ends up throwing an error.
That means you'll need some sort of top-level error handling, so nothing bubbles all the way up. You should also consider using [BetterHostedServices](https://github.com/GeeWee/BetterHostedServices) to crash the application on uncaught exceptions as an extra precaution.

So with some extra error handling and a little more realistic business logic a BackgroundService that processes something from a queue every second could look like this:
```csharp
public class QueueProcessingBackgroundService : BackgroundService
{
    private ILogger<QueueProcessingBackgroundService> _logger;
    private IQueue _queue;
    private IBusinessLogicService _businessLogicService;

    public QueueProcessingBackgroundService(IQueue queue,
        IBusinessLogicService businessLogicService,
        ILogger<QueueProcessingBackgroundService> logger)
    {
        _queue = queue;
        _businessLogicService = businessLogicService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Try to dequeue a message, process it, and respond every 1 second
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var message = await _queue.ReadNextMessage();
                // If there is a message, handle it.
                if (message != null)
                {
                    var response = _businessLogicService.CalculateResponse(message);
                    _queue.PostMessage(response);
                }
            }
            catch (Exception e)
            {
                // On exception - log and retry
                _logger.LogError(e, "Exception while processing queue message");
            }
                            
            // Wait one second before trying to read from the queue again
            await Task.Delay(1000, stoppingToken);
        }
    }
}
```

You take in some parameters, you do some work every _x_ seconds, and then you make sure to not throw any errors.

Now there's a few issues with services looking like this.


    - They're extremely difficult to test. 
You'll have to mock everything, if you need to test multiple calls you'll need to wait in your test 


There's issues with scoping. HostedServices don't get their own scope.
All of your dependencies need to be good at handling state for this. If you have a single `Scoped` bean
inside the dependencies you use (such as an EfCore DbContext), this won't work.

If you have transient beans with state you also have issues - you'll end up with Captured dependencies and potentially hard to track
bugs.

What you can (and should do) is split up the responsibilities. The goal is that your BackgroundService only does error handling, scope management and scheduling.
It should be so simple that there's no need to test it.

Everything else is delegated to a service that you recreate each time.
Splitting the BackgroundService from before out into two services, it would look like this. Let's take a look at it first, and then
discuss it afterwards.

```csharp
public class QueueProcessingBackgroundService : BackgroundService
{
    private ILogger<QueueProcessingBackgroundService> _logger;
    private IServiceProvider _serviceProvider;

    public QueueProcessingBackgroundService(
        ILogger<QueueProcessingBackgroundService> logger,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var processor = _serviceProvider.GetRequiredService<QueueProcessor>();
                await processor.ProcessMessage();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Exception while processing queue message");
            }

            await Task.Delay(1000, stoppingToken);
        }
    }

public class QueueProcessor
{
    private IQueue _queue;
    private IBusinessLogicService _businessLogicService;

    public QueueProcessor(IQueue queue, IBusinessLogicService businessLogicService)
    {
        _queue = queue;
        _businessLogicService = businessLogicService;
    }

    public async Task ProcessMessage()
    {
        var message = await _queue.ReadNextMessage();
        if (message != null)
        {
            var response = _businessLogicService.CalculateResponse(message);
            _queue.PostMessage(response);
        }
    }
}
```

This gives us several advantages.
- We get a new, *consistent* scope for each time we want to process something. This is just like when we use a Controller and we
  get a fresh scope for each request, and the mental model maps 1:1.
- There's no captured dependencies
- The BackgroundService is dead simple, and there isn't really anything that's worth testing inside it.
- The actual service is easy to test. You don't need to worry about timers, handling errors that never bubble up or anything like that. 


aside: Service locator antipattern


https://odetocode.com/blogs/scott/archive/2016/02/18/avoiding-the-service-locator-pattern-in-asp-net-core.aspx
https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/
https://docs.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-5.0&tabs=visual-studio#consuming-a-scoped-service-in-a-background-task