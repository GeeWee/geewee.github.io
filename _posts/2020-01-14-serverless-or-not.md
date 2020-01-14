---
title: "To Serverless or Not To Serverless"
permalink: "/serverless-or-not"
draft: true
---

Internally at my company, we've had a lot of discussion whether or not to use serverless, Azure functions to be more specific,
for a large project. This is my attempt to give a balanced overview of the pros and cons of Serverless, to help us make the right decision.

A disclaimer: I haven't actually worked with serverless for long at all.
Most of the information here is synthesized from reading, talking to co-workers, and tech leads from other companies about their experiences.


### TODO consider removing
Our project takes a lot of data from wind turbines, transforms it, and exposes it to some end-users.
There's two major flows of data, which I'll describe here for some context.

1. The first flow is for events, this is a continuous stream of events from the wind turbines to the consumer. The events are
streamed every second, and should preferably have pretty low latency, as some of them require people to act on them
reasonably quickly.
2. The second flow is for high resolution data. Wind turbines generally give out more detailed data in ten minute intervals.
This data is sent to our service every ten minutes, and needs to be processed and saved in some sort of permanent storage
to allow for querying later.

###todo end

There's also a slight hitch at least in our project, that further complicates the picture. We're not able to run
the functions on e.g. Azure cloud, we have to run them in Kubernetes, using Azure Kubernetes Service.
We would be using a framework called [Kubernetes Event Driven Autoscaling(KEDA)](https://keda.sh/), which automatically
scales out pods on the kubernetes cluster, when events happen, such as adding an item to a queue.
 

# Benefits of Serverless
### No managing servers manually
One of the primary proposed advantages of Serverless is that you don't have to care about provisioning physical servers.
I'm a little skeptical here, as I think this only holds true if you compare serverless
to actually maintaining your own physical server or VM. However, most large cloud providers also offer services where you simply
provide a binary or a container, which they then host. I think if you compare those two types services, you'll find that the worrying
about physical infrastructure is much the same.


### Forces your code to be stateless
Functions, being short-lived, forces your code to be stateless. There's no saving things in-memory,
there's no need to debug anything that only happens because you somehow end up saving with some internal state you shouldn't, and then you fail later on.

Serverless simply requires that your code contains no state. I think that's a best practice anyway, and an architecture that enforces that, is a good thing. 
Note that this doesn't mean that only serverless can be stateless. You can achieve the same with a regular application, it just requires a little more dilligence.


### Easy to scale up and down
Now, what I think is probably the "real" benefit of a serverless architecture. The ability to scale up and down
at the blink of an eye is powerful. It means that you don't have to worry about scaling at all!
However, as with all good things, there's a catch. Many projects probably don't need to worry about scaling *all that much*.

There's two primary types of scaling problems as I see it. Note that I wasn't able to find any terminology that described
this dichotomy, so I made up my own words. If you know the "right" words, [tweet at me](https://twitter.com/GeeWengel).

#### Steady state scaling
Steady state scaling means that as your application or project becomes more popular, it has to serve more users, or transfer more data.
The characteristics of steady state scaling is that traffic grows at a constant pace.
You know you get 10% more users every month, or your traffic increases by 15% year over year.
You can calculate how many machines you need to handle the load next month, or next year. The scaling is constantly growing, without large spikes.


There's two classical ways to handle this, [scaling up or scaling out](https://packetpushers.net/scale-up-vs-scale-out/), e.g. either
putting your servers on a more powerful machine, or running more machines in parallel, behind something like a load balancer to 
divide the work.

Scaling up is usually the easiest. You run the same server on a faster machine. At some point this becomes a problem,
either because you can't get a bigger machine or because you need to be able to stay alive, even if that machine fails.

This is usually solved by scaling out. Running the same code on multiple machines puts some requirements on the code.
You need some sort of way to delegate your work across multiple instances, this can be a load balancer, a queue etc.
You also normally can't expect your user to reach the same server instance multiple times. This means for most intents and purposes, your code has to be stateless!
Scaling out is how Serverless architectures handle scaling. This means that scaling out imposes the same restrictions on your code as a serverless architecture does.

The way I see it, Serverless doesn't have many advantages in comparison to traditional applications, when it comes to handle steady state scaling, except not having
to think about it.


#### Peak scaling
The second type of scaling is peak scaling. This is when your system has large spikes in traffic.
Perhaps you run a shopping website and on Black Friday you have 10x the normal traffic, or you run a website with funny cats images,
and your traffic doubles over lunch break.


<div class="img-div">
<a href="https://www.pexels.com/photo/adorable-animal-cat-cute-384555/">
<img src="{{site.url}}/assets/img/funny-cat.jpg"/>
</a>
If you're not on your lunch break, you're not legally allowed to view this cat.
</div>

This is a kind of scaling where functions really shine, as regular scaling doesn't handle this situation particularly well.
So if you occasionally need to scale up to an order of magnitude - what are the possible solutions?

1. You simply have enough servers to handle peak load. This is the naive solution, where you simply overprovision servers to such a degree
that you're able to handle these spikes in traffic. This works brilliantly, but depending on your volume and how large your spikes are, is potentially very expensive 

2. You provision extra servers when you know you're going to have spikes.
This is possible, if you know that e.g. you're going to have a fire sale, or you've sent out a newsletter.
It requires a lot of manual work though and is error prone. What if someone forgets to provision more servers, right before a big sale and your server crashes? 

3. Other auto-scaling solutions, like Kubernetes Horisontal Pod autoscaling, or Azure Autoscale where you specify some metrics, like response time or CPU usage, and you then scale on those.
This is usually a fine solution, but it requires you're on a technology stack where you have access to some of those capabilities.


This type of scaling is where Serverless shine though. Unless you're on a technology stack that gives you autoscaling abilities, accomodating traffic peaks is a 
pretty thorny problem to solve. If this is your case, then Serverless might be a great fit. However, as we also mention below, functions can be pricier. You need some reasonably
tall peaks, for it to make financial sense to run functions. 


### Lots of bindings
If you're alright with accepting the vendor lock-in there's a lot of bindings.
Lambda has bindings for lots of AWS services, and Azure Functions has the same for many of Azures. There's definitely 
something freeing in just stating you're interested in handling events from `EventHub Foo` and then having the serverless runtime
deal with the nitty gritty of how to get those events to you, and how to get them into a database, or to your end-user.

Depending on your use-case, there's definitely some lines of code saved here. However, the saving here is a constant lines of `n` code. If you have a business logic that's a thousand
lines, saving 200 lines of code is a solid chunk. If you have 10.000 lines of business logic, saving 200 lines doesn't look all that appealing anymore.

Let's compare an Azure function to a regular ASP.NET Core app. We want to read events from one event hub, process them somehow and send them to another. This is how the function looks.
```csharp
[FunctionName("EventHub2EventHub")]
public static async Task Run(
    [EventHubTrigger("source", Connection = "EventHubConnectionAppSetting")] EventData[] events,
    [EventHub("dest", Connection = "EventHubConnectionAppSetting")]IAsyncCollector<string> outputEvents,
    ILogger log)
{
    foreach (EventData eventData in events)
    {
        // do some processing:
        var myProcessedEvent = DoSomething(eventData);

        // then send the message
        await outputEvents.AddAsync(JsonConvert.SerializeObject(myProcessedEvent));
    }
}
```
Apart from that, all we need is a few files with instrumentation keys and some settings for how to read from the event hub.

If we compare that with the non-function equivalent we currently have in our project: There's around 150 lines of code that configures how to read from the event hub,
and around 100 lines of ceremony to launch an ASP.NET Core application.
It's always nice to save some code, but 2-300 lines of code in a large application isn't that much.
For smaller applications and initial developer velocity though, the bindings that come with most serverless environments are awesome. 


### Cost model is different
The cost model for serverless is different. It depends on your cloud-provider but often you pay for what you use.
So if you have little traffic, you run less functions and you pay less.
This often makes it a very good model for when you have large differences in peak and off-peak traffic.
However, I've heard multiple stories of people actually paying *more* with serverless environments than they would with a regular server,
particularly when peak and off-peak traffic didn't matter that much.

Depending on your traffic model, the different cost model is either an advantage or a disadvantage.
However one thing is for sure - it's more confusing than regular per hour billing for a server.
You'll have to do some due dilligence, to ensure you're not paying too much for too little.


In our project however, the cost model is a non-issue. As we'll be running our functions on KEDA, under the hood they'll be run
on the machines in the kubernetes cluster, which means our cost model is stable. We'll pay for the kubernetes machines, and that's it.
However this also puts a limit to the upper bound of scale we can achieve, unless we enable something like the [AKS Cluster Autoscaler](https://docs.microsoft.com/en-us/azure/aks/cluster-autoscaler)
which should automatically provision more VMs, if the cluster needs additional scaling.


### High availability
Serverless environments should give you a high availability setup without having to worry about anything. Your application
will always scale to the amount of traffic required. High-availability can also be achieved by scaling out normally,
but serverless definitely buys you "peace of mind" scaling, where you never have to worry about if you can handle the traffic.


# Drawbacks
Serverless comes with some advantages, but it also comes with some very real drawbacks. This is my attempt to list some of them.


### Testing 
Testing serverless code is (potentially) more challenging. In general, most people I've talked to tend to not test
the binding code, but extract the business logic, usually following steps that look something like this:

1. Extract the logic into its own module or function
2. Make the actual function code a very thin wrapper around the function
3. Test only the function


### Debugging
Depending on the serverless stack, debugging can be harder. You can run Azure Functions locally and attach a debugger,
but it's not quite as easy to debug them server-side, as there's not necessarily a long-running process you can attach a remote debugger to.


Especially in our case, I fear that the potential problem space is pretty wide. If we have to debug e.g. performance issues, we have much more to consider in regards to the issue.
Is the KEDA autoscaler scaling pods wrong? Is our application code too inefficient? Is something wrong with the kubernetes cluster, or the virtual machines underneath?
Regular web-services seems to be more predictable in that regards.
I could be wrong and none of these issues ever happen. But if they do, it's going to be much harder to figure out where to start.


### Vendor lock-in
This is often listed as a detriment.
You're kind-of vendor locked-in. I say "kinda", because you can run these functions on a kubernetes cluster that potentially 
can be hosted anywhere. Many of our triggers are bound up on azure-specific bindings, but I don't think that matters that much.
In general if you tend to separate your bindings and your business logic, migrating to a different vendor isn't that much of a herculean task. 
However, I've always felt vendor lock-in hasn't been that big of a deal. Most projects never change databases, cloud providers or anything else,
so worrying about being portable is wasted effort.


### Monitoring is harder
In general, distributed monitoring is much harder than monitoring a single applications.
Monitoring functions isn't harder in itself, than than monitoring the equivalent amount of microservices would be.
But I think when evaluating a technology stack, you need to consider the patterns the technology encourages.
Serverless make it very easy to create many small functions, which might make your logging and monitoring "more distributed" than
it would tend to be, by using a more classical approach.

### Maturity
Serverless is still a (reasonably new) player on the market. KEDA is approximately a year old, and only had 1.0 release a few months ago.
Azure Functions was made Generally Available in 2016, and their version 3, which we'd like to use, has only been live since December of 2019, around a month at the time of writing.

While we haven't encountered that many actual bugs (only one, having to do with dependency injection), we have encountered many times where we felt like the documentation
was out-of-date, inaccurate or simply missing. I think this depends a lot on the Serverless vendor you use, but at least for Azure Functions, we haven't been impressed with 
the maturity of the platform.


### Loss of control
You lose some control, and you're more at the mercy of the bindings. For example, there's some reasonably advanced optiosn
we'd like to configure in regards to how we read events from our Event Hubs. However these configurations aren't exposed
by the Azure Functions runtime, so if we end up using Functions, we'll have to live with not being able to configure that.

I think for most use-cases, giving up control is worth the bindings you get, but usually giving up control to some framework also
has downsides when it doesn't do what you want it to do.


### It's a different skill set
There's a different skill set to learn when using functions. While much of the business logic might be the same,
the way you architect systems doesn't necessarily carry over. This can either be nice, you get to learn something new, or a hassle,
you can't use some of the skills you've previously acquired. I don't think this is a big for us, as most of our team is new
to both C# and ASP.NET Core, so we don't have to acquire much new knowledge.


### Caching is harder
If you have a system that relies heavily on caches, that's harder to do using Functions. In regular applications you can cache things in-memory,
but that's not always possible with functions, as you have no knowledge of how often a function is discarded and re-created. Optimally you would
use some third party cache-provider like Redis or Memcached, instead of caching in-memory.


# For our project


# Summing up
Todo...