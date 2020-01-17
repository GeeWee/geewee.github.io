---
title: "To Serverless or Not To Serverless"
permalink: "/serverless-decision"
draft: true
---


# Describe project and two data flows:
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



# Particular project constraints
Talk about how every project is different

# Cost Model is different
In our project however, the cost model is a non-issue. As we'll be running our functions on KEDA, under the hood they'll be run
on the machines in the kubernetes cluster, which means our cost model is stable. We'll pay for the kubernetes machines, and that's it.
However this also puts a limit to the upper bound of scale we can achieve, unless we enable something like the [AKS Cluster Autoscaler](https://docs.microsoft.com/en-us/azure/aks/cluster-autoscaler)
which should automatically provision more VMs, if the cluster needs additional scaling.


# The two things we potentially win

# 1) Scaling

# Our scaling characteristica


# Peak scaling and KEDA

talk about how we still have to manage scale and we still have to do that manually


talk about scaling and potential resource starvation

2) Bindings

# What do we win?

# How much do we actually win?


# Biggest drawbacks
Death by a thousand papercuts.
The testing can get harder, but we're sure we'd get that under control
The monitoring and logging isn't too bad, but we'd end up being completely married to Application Insights, which we haven't had the best of experiences with
Immaturity is the best one. There's a lot of things we're not sure about, with this technology, and for us, the gains aren't huge enough to tacke the potential downsides.
The bindings aren't that big a deal, and particularly when running the functions on KEDA, we unfortunately don't get the pain-free scaling we would be hoping for


# Immaturity
Talk about how KEDA is still pretty young

 
 Serverless is still a (reasonably new) player on the market. KEDA is approximately a year old, and only had 1.0 release a few months ago.
 Azure Functions was made Generally Available in 2016, and their version 3, which we'd like to use, has only been live since December of 2019, around a month at the time of writing.
