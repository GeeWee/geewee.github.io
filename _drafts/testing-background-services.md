-------------------------------
title: Testing ASP.NET Core BackgroundServices
permalink: '/testing-aspnetcore-backgroundservices'
-------------------------------

(note all of this is .net 5) ??

# Todo figure out how to do foldable sections for e.g. error handling?

SEO-y intro. Why does my BackgroundService stop running. What are the differences between an IHostedService and an BackgroundService,
when should I use which. Best practices for BackgroundService, blabla.


{% capture accordion_1_content %}
<p>
This is some really cool accordion stuff
</p>
{% endcapture %}

{% include accordion.html title="Read more about error handling" content=accordion_1_content %}


# IHostedService
An `IHostedService` is a service that allows for some sort of synchronous or asynchronous startup when running your .NET application.

They have two methods, a `StartAsync` that is run on application start and `StopAsync` that is run on application exit.

However it doesn't behave quite as you'd think. The `IHostedService`s are awaited before anything else happens, and they are run in order.

Let's take an example about the ordering. Let's say we have two `IHostedService`

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
And the following ConfigureService
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddHostedService<IHostedService1>();
    services.AddHostedService<IHostedService2>();
}
```

In what order will the output come out if we run it?

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

They're not randomly interspersed. `IHostedService` are always run in order, and in [reverse order when the application exits](https://andrewlock.net/controlling-ihostedservice-execution-order-in-aspnetcore-3/
).

This is because the ASP.NET runtime awaits the call to `StartAsync` before starting the next IHostedService.
This also means that you can't do any sort of longer-lasting work inside `StartAsync` without your application never being able to start.

So if you have some background work you'd like to do, and you try to do it like this:

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
Your application will never start, as the runtime will wait for this `StartAsync` to finish, and it never does.

So how do you handle long-running tasks inside an `IHostedService`? You generally tend to start a new thread, and then return the method.
Something like.
```csharp
public Task StartAsync(CancellationToken cancellationToken)
{
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
(in regards to error handling if this throws an error you'll never know!)

# Cancellationtokens in IHostedService
weird cus it only happens on startup

However Microsoft in their infinite wisdom realized that this was a pattern that people were going to use often, so they baked it into the framework.
Meet the `BackgroundService`.

# BackgroundService
A BackgroundService is a HostedService that basically implements the pattern above.
It has one method you can implement `ExecuteAsync` - and this method is not awaited.
The `BackgroundService` assigns it to a Task it keeps track of, but does not await. This means you can do patterns like the below and have it work, and not block the application.

```csharp
protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    while (true)
    {
        // do something on a timer
        await Task.Delay(1000, stoppingToken);
        Console.WriteLine("1");
    }
}
```




# Error handling (mbe separate post)
However because this `StartAsync` is awaited it also means that if you throw an error from the method
```csharp
public async Task StartAsync(CancellationToken cancellationToken)
{
    throw new Exception("oh no something went horribly wrong");
}
```
your application will crash at the start. That seems rather obvious it would, but what happens if we do this instead:

```csharp
public async Task StartAsync(CancellationToken cancellationToken)
{
    await Task.Yield();
    throw new Exception("oh no something went horribly wrong");
}
```
Would you like to guess?
Nothing at all happens.
The BackgroundService fails silently


# Testing IHostedervices


# Cancellationtokens in IHostedService


https://github.com/dotnet/core/issues/6098
https://github.com/dotnet/runtime/issues/43637
https://andrewlock.net/controlling-ihostedservice-execution-order-in-aspnetcore-3/
