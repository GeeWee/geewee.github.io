---
title: Testing and scope management in ASP.NET Core BackgroundServices
permalink: '/testing-and-scope-management-aspnetcore-backgroundservices'
---
_This is part 2 of my series about ASP.NET Core series about BackgroundServices and IHostedService. Part 1 can be found [here]({% post_url 2021-09-02-hosted-services-difference %})_.

BackgroundServices in ASP.NET Core seem simple but can be tricky to get right. Here I'm going to try to write down what I wish I had known when I started, by answering the following questions: "How do I test my BackgroundServices", and "How do I manage scope inside my BackgroundServices"

# BackgroundService
A BackgroundService is a service for running longer-lasting or periodic tasks in the background. It has one method `ExecuteAsync`.

I would say that 90% of the BackgroundServices I've written or seen are more advanced versions of this:
```csharp
public class BackgroundService1 : BackgroundService
{
    // Call DoSomething() every second
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            DoSomething();
            await Task.Delay(1000, stoppingToken);
        }
    }
}
```

As we've talked about previously, this will fail silently if `DoSomething()` ends up throwing an error.
That means you'll need some sort of top-level error handling, so nothing bubbles all the way up. You should also consider using [BetterHostedServices](https://github.com/GeeWee/BetterHostedServices) to crash the application on uncaught exceptions as an extra precaution.

With some extra error handling and a little more realistic business logic a BackgroundService that periodically processes something from a queue might look like this:
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

This looks pretty sensible, but there's a few issues with this sort of construction that might not be obvious at the start.

#### 1. They're difficult to test.
   Anything that never returns and runs on a timer is generally hard to test. You'll need to rely extensively on mocks and you can't really test any error handling (as they are swallowed). Generally the more logic that ends up inside this service the harder it will get to test

#### 2. They don't handle scope well
HostedServices (and by extension, BackgroundServices) [don't get their own scope](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-5.0&tabs=visual-studio#consuming-a-scoped-service-in-a-background-task).

This means that you cannot access any scoped beans like Entity Framework's `DbContext`, and you'll get an error instead. Without managing scope manually, you won't be able to use a `DbContext` at all.

Potentially worse than an error, you could end up with a [Captive Dependency](https://ankitvijay.net/2020/03/17/net-core-and-di-beware-of-captive-dependency/). This leads to issues if your BackgroundService relies on a transient dependency that holds state and expects to be re-created between uses.
That dependency will only be instantiated once at the start of the application, and thus might fail in subtle ways a little into the program. 

---

What you can and should do to solve both of these issues is to split up the responsibilities. Your BackgroundService should only do error handling, scope management and scheduling. It should be so simple there's no need to test it.
All of the actual work is delegated to a service that you recreate each time.

If we take the BackgroundService from before and split it into two services it looks like this:

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
                using (var scope = _serviceProvider.CreateScope()){
                    var processor = scope.ServiceProvider.GetRequiredService<QueueProcessor>();
                    await processor.ProcessMessage();
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Exception while processing queue message");
            }

            await Task.Delay(1000, stoppingToken);
        }
    }
}
```

```csharp
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
The background service does no actual business logic. The only thing it does is every x second, create a scope and a new service, and have _that_ service do something.
Doing it this way gives us a lot of advantages, both regards to testing and scope management.

- We get a new, consistent scope each time we perform our task. This is just like when a request comes in and a new scope and controller is instantiated. This means that the classes we already use and the way we think about them are exactly the same between requests and our BackgroundService
- As we get a fresh scope each time, the BackgroundService doesn't lead to captured dependencies
- The BackgroundService is dead simple, and there isn't really anything that's worth testing inside it.
- That means we can focus all of our testing on the actual business logic (the QueueProcessor in our example). We can simply test that like any other service, without having to consider the fact that it's used inside a BackgroundService.

Next time you're struggling with a BackgroundService, try adopting this pattern. I think you'll find that both scope management and testing becomes much, much easier.

{% capture accordion_1_content %}
<p>
You might look at the pattern above and wonder: "Isn't that the <a href="https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/
">service locator antipattern?</a>" <br>
While this class certainly uses a service locator I don't think this particular use is an antipattern for a couple of reasons. <br>
1. The only responsibility of the BackgroundService is to instantiate/require the one class, and the BackgroundService is very close to the composition root. <br>
2. It happens on the start of the application, so you will quickly find out if you've forgotten to add the required service. <br>
3. It is true though, that it is hard to see exactly what dependencies the BackgroundService uses. If you'd like to rectify that, you can use something like this <a href="https://gist.github.com/GeeWee/97b29e21a8dea7e88ec0792ab76d335d">ScopedServiceProvider</a> class which allows you to be more explicit about which dependencies you're requiring.
</p>
{% endcapture %}

{% include accordion.html title="Additional note on the Service Locator pattern" content=accordion_1_content %}