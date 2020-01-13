---
title: "To Serverless or Not To Serverless"
permalink: "/serverless-or-not"
draft: true
---

Internally at my company, we've had a lot of discussion whether or not to use serverless, Azure functions to be more specific,
for a large project. This is my attempt to give a balanced overview of the pros and cons, also regarding our choice.

ADD DISCLAIMER ABOUT YOUR EXPERIENCES


Our project takes a lot of data from wind turbines, transforms it, and exposes it to some end-users.
There's two major flows of data, which I'll describe here for some context.

1. The first flow is for events, this is a continuous stream of events from the wind turbines to the consumer. The events are
streamed every second, and should preferably have pretty low latency, as some of them require people to act on them
reasonably quickly.
2. The second flow is for high resolution data. Wind turbines generally give out more detailed data in ten minute intervals.
This data is sent to our service every ten minutes, and needs to be processed and saved in some sort of permanent storage
to allow for querying later.


There's also a slight hitch at least in our project, that further complicates the picture. We're not able to run
the functions on e.g. Azure cloud, we have to run them in Kubernetes, using Azure Kubernetes Service.
We would be using a framework called [Kubernetes Event Driven Autoscaling(KEDA)](https://keda.sh/), which automatically
scales out pods on the kubernetes cluster, when events happen, such as adding an item to a queue.
 

# Benefits of Serverless
### No managing servers manually
One of the primary proposed advantages of Serverless is that you don't have to care about provisioning physical servers,
and that your functions only run when they're called. I think this is a fair advantage, if you compare serverless
to actually maintaining your own physical server. However, most large cloud providers also offer services where you simply
host a container image, which they then run. Apart from scaling, you have to worry the same amount about the physical infrastructure.


### Forces your code to be stateless
Functions, being ephemeral, forces your code to be stateless. There's no saving things in-memory,
there's no debugging anything that only happens because you somehow end up saving with some internal state you shouldn't, and then you fail later on.
Serverless simply requires that your code contains no state. I think that's a best practice, and an architecture that enforces that, is in my opinion, a good thing.


### Easy to scale up and down
Now, what I think is probably the "real" benefit of a serverless architecture. The ability to scale up and down
at the blink of an eye is powerful. It means that you don't have to worry about scaling at all!
However, as with all good things, there's a catch. Many projects probably don't need to worry about scaling *all that much*.

There's two primary types of scaling problems you can have trouble with, as I see it.

1) Consistent scaling
This simply means, that as your application or project becomes more popular, it has to serve more users, or transfer more data.
The characteristica of this scaling is, that it is constant. You know you get 10% more users every month, or your traffic increases by that much.
You know how many machines you need to handle it - the scaling is consistent, without any large spikes.

There's two ways to handle this load, [scaling up or scaling out](https://packetpushers.net/scale-up-vs-scale-out/), e.g. either
putting your servers on a more powerful machine, or running more machines in parallel, behind something like a load balancer to 
divide the work.

Now, scaling up is usually easy. You just run the same server on a faster machine. However, at some point scaling up becomes problematic,
either because you can't get a bigger machine, or because you need to be able to continue processing, even if that machine fails.
For that, there's scaling out which means we run the same code on multiple machines.
However this has some requirements for the code. You need some sort of way to delegate your work across multiple instances.
For regular web services, this is usually a load balancer.
This also means that you normally can't expect your user to reach the same server instance multiple times, which means your code has to be stateless!
Scaling out, is what serverless environments do automatically. This means that scaling out manually imposes the same restrictions on your code, as writing functions does. 



2) Burst scaling
The second type of scaling is burst scaling.
Some systems have large spikes in daily traffic. Perhaps you run a shopping website, and on Black Friday you have 10x the normal traffic.
This is a kind of scaling where functions really shine, as regular scaling doesn't handle this situation particularly well.
If you need to occasionally scale up an order of magnitude, how do you do it?

1. You simply have enough servers to handle peak load. This is the naive solution, where you simply overprovision servers to such a degree
that you're able to handle these spikes in traffic. This works brilliantly, but depending on your volume and how large your spikes are, is potentially very expensive 

2. You provision extra servers when you know you're going to have spikes.
This is possible, if you know that e.g. you're going to have a fire sale, or you've sent out a newsletter.
It requires a lot of manual work though and is error prone. What if someone forgets to provision more servers, right before a big sale and your server crashes? 

3. Other auto-scaling solutions, like Kubernetes Horisontal Pod autoscaling, or Azure Autoscale where you specify some metrics, like response time or CPU usage, and you then scale on those.
This is usually a fine solution, but it requires you're on a technology stack where you have access to some of those capabilities.


This type of scaling is where Serverless shine though. Unless you're on a technology stack that gives you autoscaling abilities, accomodating traffic bursts is a 
pretty thorny problem to solve. 
 


### Lots of bindings
If you're alright with accepting the vendor lock-in there's a lot of bindings.
Lambda has bindings for lots of AWS services, and Azure Functions has the same for many of Azures. There's definitely 
something freeing in just stating you're interested in handling events from `Queue Foo` and then having the serverless runtime
deal with the nitty gritty of how to get those events to you, and how to get them into a database, or to your end-user.

Depending on your use-case, there's definitely some lines of code saved here. However, I think as/if your application grows in logic,
the savings here start to become smaller in comparison to the rest.

* comparison of listening on a queue and submitting to a queue in functions vs serverless *
 

### Cost model is different
The cost model for serverless is different.
Depending on your cloud-provider, there's probably also different ways to price the functions.
Often the principle is, you pay for what you use. So if you have little traffic, you pay less.
This often makes it a very good model for when you have large differences in peak and off-peak traffic.
However, I've heard multiple stories of people actually paying *more* with serverless environments, for functions where the peak
and off-peak traffic didn't differ that much.

Depending on your traffic model, the different cost model is either an advantage or a disadvantage.
However one thing is for sure - it's more confusing than regular per hour billing for a server.
You'll have to do some due dilligence, to ensure you're not paying too much for too little.


In our project however, the cost model is a non-issue. As we'll be running our functions on KEDA, under the hood they'll be run
on the machines in the kubernetes cluster, which means our cost model is stable. We'll pay for the kubernetes machines, and that's it.
However this also puts a limit to the upper bound of scale we can achieve, unless we enable something like the [AKS Cluster Autoscaler](https://docs.microsoft.com/en-us/azure/aks/cluster-autoscaler)
which should automatically provision more VMs, if your cluster needs additional scaling.


### High availabillity
Serverless environments should give you a high availabillity setup without having to worry about anything going down. Your application
will always scale to the amount of traffic required. This can definitely be a "peace of mind" thing, where you don't have to consider
how many servers you need to provision, if you can handle the traffic if a server fails, e.g.


# Drawbacks
Serverless comes with some advantages, but it also comes with some very real drawbacks. This is my attempt to list some of them.


### Testing 
Testing serverless code is (potentially) more challenging. In general, most people I've talked to tend to not test
the binding code, but extract the code that needs

1. Extract the logic into its own module or function
2. Make the actual function code a very thin wrapper around the function
3. Test only the function


### Debugging
Depending on the serverless stack, debugging can be harder. At least for Azure functions, you're able to run the functions locally and attach a debugger.
It's not quite as easy to debug them on the server. There's not necessarily a long-running process you can attach to, if you need to debug something on a server.


Especially in our case, I fear that the problem space is pretty wide. If we have to debug e.g. performance issues, we have much more to consider in regards to the issue.
Is the autoscaler scaling pods wrong? Is our application code too inefficient? Is something wrong with the kubernetes cluster, or the virtual machines underneath?
Regular web-services seems to be more predictable in that regards. I could be wrong in this though - and none of these issues ever happen. However, if they do - I have much less of an idea where to start.


### Vendor lock-in
This is often listed as a detriment. You're kind-of vendor locked-in. I say "kinda", because you can obviously run these functions on a kubernetes cluster, that potentially 
can be hosted anywhere. Many of our triggers are bound up on azure-specific bindings, but I don't think that matters that much.
I feel vendor lock-in isn't that big of a deal, because let's be honest, most projects never change databases, cloud providers or anything else.






### Monitoring is harder




### Maturity






- Testing and debugging is more challenging
- Cost (can cost more, can also be confusing)

- Potentially starving the k8s cloud
- Cold start issue?
- Vendor lockin?
- Changing landscape
- Lack of expertise
- Monitoring is harder
- Event hub checkpointing
- Harder to have a local dev environment
- Immature docs
- DI bugs
- Much higher problem space to debug if something goes wrong
azure functions Dependency injection
AI is expensive AF

"
Serverless architectures are not built for long-running processes

This limits the kinds of applications that can cost-effectively run in a serverless architecture. Because serverless providers charge for the amount of time code is running, it may cost more to run an application with long-running processes in a serverless infrastructure compared to a traditional one.
"


"
There are cases when it makes more sense, both from a cost perspective and from a system architecture perspective, to use dedicated servers that are either self-managed or offered as a service. For instance, large applications with a fairly constant, predictable workload may require a traditional setup, and in such cases the traditional setup is probably less expensive.
"