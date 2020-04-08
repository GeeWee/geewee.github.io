---
title: "Our Decision Whether or Not To Use Serverless"
permalink: "/serverless-decision"
---

Internally at [SCADA MINDS](https://www.linkedin.com/company/scada-minds/), we've had to make a decision whether or not to use a Serverless architecture for
a large project. I wrote a post earlier on the general [pros and cons of Serverless,]({{ site.baseurl }}{% link _posts/2020-01-14-serverless-or-not.md %})
but like most projects, there are some unique circumstances that we need to consider.


Our project is essentially a data pipeline which takes a lot of data from wind fields, transforms it, and exposes it to a variety
of end-user applications
There are two major flows of data:

1. The first flow is for events. This is a continuous stream of events from the wind turbines through the pipeline.
The events are streamed every second, and should preferably have low latency through the pipeline.
2. The second flow is for high resolution data. Wind turbines generally give out more detailed data in ten minute intervals.
The data is sent to our service very ten minutes, where it needs to be transformed and saved in some sort of permanent storage.
This data is primarily used for analytics, so the latency isn't as important.

There's also an extra circumstance that further complicates the picture. Our production code has to run on a Kubernetes cluster.
We're able to do this using a framework called [Kubernetes Event Driven Autoscaling (KEDA)](https://keda.sh/). KEDA mimicks
a serverless runtime by automatically scheduling kubernetes pods when events happen that would normally trigger an Azure Function to run.


Let's try to take a look at how some of these factors change the potential benefits. What follows is a non-exhaustive list
of the discussion points that we considered when making our decision. 

## No managing servers manually
One of the nice wins of serverless is there's no managing servers manually. However when running the functions through KEDA,
we still have to manually manage the clusters, the virtual machines in the clusters etc. This means that this advantage is essentially non-existent.

## Easy to scale up and down
This is one of the main discussions we've had. It's been pretty unclear how much we'd win in the scaling department.
There's two things we need to consider here:

### Scaling up and down on Kubernetes
Since we'll be running these functions on Kubernetes, many of the scaling advantages
are nullified a little bit.
If we need to be able to scale up we'll have to overprovision the virtual machines, which means we'll have to pay the cost for full scaling at all times.

If we want to avoid that we can use something like the [Kubernetes Cluster Autoscaler](https://github.com/kubernetes/autoscaler), which should scale the amount of VMs in a cluster up and down
according to resource usage.
We haven't tested how fast these new virtual machines boot, but I have a sneaking suspicion that it might take a couple
of minutes, which could be a problem in a rapid ten-minute scale up/down cycle.


So while it should be possible to get the Serverless auto-scaling in a kubernetes cluster it does require some extra
kubernetes components, and there might be a delay while virtual machines spin up and down.

### Our scaling requirements
The next thing to consider is, how aggressively we need to be able to scale up and down.
We might have different scaling needs for each flow, so let's try to look at those independently.

#### The event flow
The first flow shouldn't have particular burst scaling requirements.
The amount of events should be pretty steady,
except it might potentially have periods of fewer events if a  wind field goes dark.
This means that we don't have a strong need for rapidly scaling up and down. Provisioning the right amount
of servers with a margin for error should be enough to handle this data flow.

#### High resolution flow
This was originally the flow where I expected serverless to make the most sense.
Getting in a large chunk of data every ten minutes and wanting to process it as fast as possible seemed like the perfect fit for rapidly scaling up and down.

It turns out that this isn't quite accurate for two different reasons. While every wind turbine emits this data every ten minutes, these ten minutes
aren't synchronized. Every turbine doesn't emit at 1410 and then 1420, etc.
Depending on a variety of factors, they emit approximately every ten minutes, but one
might emit at 1401, and the next at 1402.
This means that the flow isn't a large peak followed by silence but rather a series of much smaller peaks.

As the primary use-case for this data is analytics, latency isn't paramount here. It's not a big deal whether or not the data gets to you in 3, 5, or 10 minutes.
This means that even if the data flow is a large peak followed by silence, we don't need to process
it all at once. We simply need to have enough computing power to handle all the data before the next peak. 


### Summing up scaling
The rapid burst scaling you get out of the box with serverless, is made more complicated, but doable, running the whole thing on KEDA.
However, the bigger realisation here is, that due to the data flow patterns and latency requirements of each flow, there's no need for
rapid autoscaling where serverless really shines.

The main thing that a serverless architecture might give us, is "peace of mind" scaling, where we don't need to do any extra work when adding new wind fields to the pipeline.

# Different cost model
As mentioned in the scaling part, the regular cost-model for serverless architectures doesn't have too much impact here.
Our functions only costs money based on the virtual machines provisioned in the kubernetes cluster. This means that we don't have
to weight the cost-model in any meaningful way here. Running things through KEDA should cost the same as running them as regular Kubernetes pods.


# Bindings
The bindings to the different Azure services are still a large plus in our book. We expect the business logic in this project
to potentially be quite large. Unfortunately this means that the code saved due to the bindings potentially isn't that much in the big picture.


# Our conclusion
Serverless doesn't seem to be a great fit for our project. We don't have the scaling requirements, and our unique runtime makes
it harder to achieve even if we did.

The bindings to azure functions are very nice, and a huge plus. Unfortunately we don't think they're worth the potential risks.
There's not one specific downside that made us refrain from going serverless, it's more a "Death by a thousand cuts" situation.
Some of the things we're worried about are:

- Testing being harder. We're sure we'd manage, but is it worth the extra time?
- Monitoring and logging is harder, and while Azure Functions integrate nicely into Application Insights, we're not sure we're ready to get married to that particular monitoring service just yet.
- Immaturity is a large one. In particular KEDA only went GA about 2 months ago at the time of writing. Our appetite for risk isn't quite big enough to run that in an application that needs to be highly available.
Building on that Azure Functions v3 which we'd like to use, was only made GA around a month ago as well.

These things have made us opt to not use Azure Functions running on KEDA for production code. Our use-case doesn't fit well enough to tolerate the potential downsides.
We do still however have some "Data simulators", we use to performance-test the application. We want these to be able to scale rapidly up and down in data volume,
which makes running them as Azure Functions a great idea.
