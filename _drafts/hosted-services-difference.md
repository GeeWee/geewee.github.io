-------------------------------
title: The difference between an IHostedService and BackgroundService
permalink: '/difference-between-hostedservice-and-backgroundservice'
-------------------------------

When I first started learning about ASP.NET Core, the `IHostedService` and the `BackgroundService` was a mystery to me. I wasn't quite clear on how to use the, what the difference between an `IHostedService` and a `BackgroundService` was, and when I should use which.

# TODO a little extra intro here


# IHostedService
An `IHostedService` is a service that allows for running code _before_ the rest of your ASP.NET Core application starts.

The interface has two methods, a `StartAsync` that is run on application start and `StopAsync` that is run on application exit.

When your application starts up, the framework awaits the `StartAsync` method of each `IHostedService` in the [order they are configured](https://andrewlock.net/controlling-ihostedservice-execution-order-in-aspnetcore-3/) in your `Startup.cs`
The `StopAsync` is called in the opposite order on application shutdown.

This means that the following `IHostedService`s.
```csharp
    public class IHostedService1 : IHostedService
    {
        public Task StartAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("1");
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("exit 1");
            return Task.CompletedTask;
        }
    }

    public class IHostedService2 : IHostedService
    {
        public Task StartAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("2");
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("exit 2");
            return Task.CompletedTask;
        }
    }
```
And the following `Startup.cs`
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddHostedService<IHostedService1>();
    services.AddHostedService<IHostedService2>();
}
```
Will output the following console output:

```
1
2
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: https://localhost:5001
...
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
exit 2
exit 1
```

Seeing as the ASP.NET Core runtime awaits the call to `StartAsync` before starting the next `IHostedService`, this means that you can't do any  sort of longer-lasting work inside `StartAsync` without your application never starting.

That means if you have a `StartAsync` that looks like this:

```csharp
public async Task StartAsync(CancellationToken cancellationToken)
{
    while (true)
    {
        // do something on a timer
        await Task.Delay(1000);
    }
}
```
Your application will never start,  as the runtime will wait for the method to finish which it never does.

So how do you handle long-running tasks inside an `IHostedService`? You generally start a new thread, which you do not await.
```csharp
public Task StartAsync(CancellationToken cancellationToken)
{
    // Note that this Task is *not* returned
    Task.Run(async () =>
    {
        while (true)
        {
            // do something on a timer
            await Task.Delay(1000);
        }
    });

    return Task.CompletedTask;
}
```

Note one important thing here - if you use this pattern and the code inside Task.Run throws an exception - *you will never know*! As the Task is not awaited, the exception will not bubble to the surface.
This is, to put it mildly, a problem. We'll get back to it.

Because Microsoft in their infinite wisdom realized that this was a pattern that people were going to often use, they baked it into the framework.
Meet the `BackgroundService`.

{% capture accordion_1_content %}
<p>
You might look at the CancellationToken parameter of the StartAsync method and think it's meant so you can cancel your long-running operations when the application is shutting down. <br>
However that doesn't work like you would expect. <br>

The CancellationToken is only used during the startup process, and not used when the application exits.
So if you do longer-running work in your StartAsync, and someone pressed CTRL+C during it, the cancellation token will be triggered. <br>
However as soon as your method returns, the cancellation token is never used again.
</p>
{% endcapture %}

{% include accordion.html title="Extra info: CancellationTokens in IHostedServices" content=accordion_1_content %}

# BackgroundService
A BackgroundService is a very small HostedService that basically implements the pattern above.
If you're interested you [can view the source on GitHub](https://github.com/aspnet/Hosting/blob/master/src/Microsoft.Extensions.Hosting.Abstractions/BackgroundService.cs) - it's less than 100 lines.

It has one method you can implement `ExecuteAsync` - and this method *is not* awaited. 
This means that code like the below works without blocking the application:

```csharp
public class BackgroundService1 : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (true)
        {
            // do something on a timer
            await Task.Delay(1000, stoppingToken);
        }
    }
}
```
That's a nice improvement! Let's see how this class handles exceptions being thrown. What if  our method looked like this?
```csharp
public class BackgroundService1 : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        throw new Exception("oh noooo");
    }
}
```
It will bubble the exception up, and your application will not start. That makes sense.
We would expect the same thing to happen with a method like this:
```csharp
protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    await Task.Delay(1000);
    throw new Exception("oh nooo");
}
```
It doesn't behave though. In this case, the exception is silently swallowed, and the application continues without so much as the dignity of writing any log output telling us that something went wrong.
```
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /home/geewee/programming/Blogproject/BlogProject/HostedServiceAsp
```
This is because there's fundamentally two paths a `BackgroundService` can take in regards to exceptions. If it throws one before yielding control (by e.g. awaiting something), the exception bubbles up, but as soon as there's an `await` call before the exception, the service will just die silently.
It seems like Microsoft has realized that this is weird behaviour, because in .NET 6 we'll at least [get some log output if the service dies](https://github.com/dotnet/runtime/issues/43637
).

In the meantime, I have written a tiny library `BetterHostedServices` that allow you to inherit from a `CriticalBackgroundService`, which will crash the application if an uncaught error happens in your `BackgroundService` - no matter if you've yielded first.

{% capture accordion_2_content %}
<p>
CancellationTokens in BackgroundServices on the other hand, work exactly like you would expect them to. 
On application shutdown, no matter at what point, the CancellationToken will signal that the operation should be cancelled.
<br>
This means you can rely on it for knowing when you need to clean-up your long running operations.
</p>
{% endcapture %}

{% include accordion.html title="Extra info: CancellationTokens in BackgroundServices" content=accordion_2_content %}
