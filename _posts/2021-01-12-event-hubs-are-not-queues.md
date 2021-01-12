---
title: "Azure Event Hubs Are Not Queues"
permalink: "/event-hubs-are-not-queues"
short: |
    Unfortunately, I've seen quite a few people use Azure Event Hubs when what they really wanted was a queue.
    Event Hubs are great for large-scale data ingestion, but if you just need to pass messages between your services - use something else. Here's a few reasons why.
extra_sources: |
    https://hackernoon.com/azure-functions-choosing-between-queues-and-event-hubs-dac4157eee1c
---
Unfortunately, I've seen quite a few people use [Azure Event Hubs](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-about), when what they really wanted was a queue.

Event Hubs are great for large-scale data ingestion, but if you just need to pass messages between your services - use something else[^1]. Here's a few reasons why.

Messages Block The Queue
------------------------

Event Hubs uses a partitioning model where messages sent to it are distributed among partitions[^2].
Each partition has one reader that can read from concurrently, and the messages are always processed in order.

This means that if you have a message that's taking a while to process, the rest of the messages on that partition are delayed.
It means that if you have a message that's causing your application to crash, you can't process anything else on that partition until you somehow deal with that message. Either by waiting and retrying, dropping the message or perhaps saving it somewhere else.

Contrast this with something like the Azure Storage Queue where you can lock a message and attempt to process it.
If you can't process it or it takes a while you're not holding anyone up. Other consumers don't need to wait for you to process your message before they can continue.

Checkpointing Makes Error Handling Hard(er)
-------------------------------------------

Event Hubs are batch-oriented. You receive a batch of messages and then when you've processed enough you create what's called a [checkpoint](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-features#checkpointing).

A checkpoint is a way of writing down: This is how many messages I've processed. Checkpointing is something you do occasionally - it isn't meant to be something you do every message.[^3]
If your application crashes between checkpoints it'll start off at the last checkpoint and you'll reprocess each message until you're up-to-date again.
That means your systems have to be pretty durable to messages that are delivered multiple times.

While this is a problem with most queues (applications can always crash between receiving a message and processing it), often you'll only process one message at a time, so there's less harm done if something fails.

Event Hubs Require An Extra Storage Account
-------------------------------------------

The partitioned readers use an Azure Storage account to coordinate checkpointing and [partition ownership](https://docs.microsoft.com/en-us/azure/event-hubs/event-processor-balance-partition-load) between them.

This means that you can't read from an Event Hub without also having a storage account[^4]. It's not a big deal, but it does add an extra connection string to manage, and an extra Azure resource to deploy.

Local Development
-----------------

There is no way of running an Event Hub locally.
Contrast this with e.g. an Azure Storage Queue which you can run locally with [Azurite](https://github.com/Azure/Azurite), or many other queues which you can run in Docker.

Being able to run your dependencies locally is really nice. It means you don't have to deal with spinning up Event Hubs for each developer[^5].

Reasons to use Event Hub
------------------------

I don't hate Event Hubs. They're a good tool if you need what it offers, such as the [Event Capture Feature](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-capture-overview), or you have large amounts of data.

But if you just need to send messages between services? Use something else.

[^1]: Surprisingly you can actually tweak Azure Event Hubs to be very queue-like if you only use one partition and you use the Kafka-enabled interface. But still, it's a pretty mediocre queue.
[^2]: Technically you can choose a partition key or a specific partition to get your message where you want it, but there's some other tradeoffs involved in that.
[^3]: Although you can. It's recommended against by Microsoft and it'll be crazy slow and reasonably expensive.
[^4]: Unless you use the kafka-interface which for some reason doesn't require it. One of the big advantages of that interface in my book.
[^5]: You could of course just spin one event hub up for everyone to share, but then you start getting Joe's malformed messages and your computer starts smoking and you start to doubt your decision-making skills.