---
title: "What we do to achieve latencies as low as 30ms for the Climatiq API"
permalink: '/how-we-keep-the-climatiq-api-fast'
---

[Climatiq](https://www.climatiq.io/) is an API designed to estimate greenhouse gas emissions for any given activity.
The API is meant both for batch processing large amounts of data in data pipelines, and for embedding into other software to inform decision-making.
In this post, we'll explore what Climatiq does to consistently achieve latencies under 100ms - sometimes as low as 30ms. I think that's pretty fast (maybe even blazing fast?).

<div class="img-div-tall">
<img src="{{site.url}}/assets/img/climatiq-latency.png"/>
17ms latency for an estimate performed via the Climatiq API. Not against a local server, but on an open connection.
</div>

## Why Performance matters

But first, let's disgress a bit and talk quickly about why we care about our API performance - and why you should too.
We don't just care because we’ve heard the old story about how much each millisecond of latency costs Amazon, but because we’d prefer for our API to feel instantaneous.
If our API feels instantaneous, users don't have to worry about loading states or their application seeming sluggish. Not to mention, that as a climate-focused company we should also walk the walk, and every CPU cycle we save, means less electricity used.

## The strategies we use

### Edge Computing
A primary driver of latency for API responses is the physical distance between servers and users. Climatiq addresses this issue by utilizing Fastly's Compute@Edge platform, which runs Rust code on a vast edge computing network. This approach allows Climatiq to deploy its code to multiple geographically distributed data centers, ensuring there's always an API instance nearby to serve requests.

### Leveraging Rust for High Performance
Rust also plays a crucial role in Climatiq's performance. Not only for meme-credit, but also for its safety and speed, Rust enables the API to run faster than many higher-level languages while still maintaining safety guarantees.
We compile Rust to WebAssembly to run on the Compute@Edge network. Even un-optimized Rust runs faster than many higher-level programming languages.
While Rust gives us great performance, the language is also expressive and high-level enough that we can quickly make changes and iterate on our codebase.

### Running the right code
Rust alone might help out, but you can still make your program plenty slow. At Climatiq we've spent quite a bit of time tweaking our code, to ensure that for our hot loops, we run the right code.

### Minimizing External Dependencies
Another larger driver of latency, is external dependencies. Perhaps the worst-case example of dependencies making you slow is the [n+1 problem](https://signoz.io/blog/N+1-query-distributed-tracing/).
Each time you have to reach out to an external service that's not co-located with yours, you have to wait for them to respond.

To avoid reaching out to a database as much as possible, Climatiq ships the vast majority of its emission factors as a binary blob along with our application.
Since these factors don't change frequently, this method allows them to be co-located with the code and accessed without any latency overhead.

For necessary external dependencies, Climatiq prioritizes using those that are geographically distributed, such as FaunaDB, which replicates data across multiple continents.

### Offloading Work Until After the Response

Another excellent way to make an API snappier, is to postpone work until you've returned the response tothe user.
Some tasks are very well suited for this, like shipping logs and recording metrics. Those types of tasks can easily be done after client receives their response.

Climatiq takes advantage of Fastly's fire-and-forget requests for these tasks, ensuring a faster response time without sacrificing data integrity.

### Aggressive Caching

In cases where third-party data is required for carbon calculations, Climatiq employs aggressive caching. The API uses the caching capabilities of the Fastly network along with the [stale-while-revalidate](https://web.dev/stale-while-revalidate/) caching strategy,  to store third-party responses and serve cached data, while new data is fetched in the background.
This approach keeps caching code simple and ensures minimal latency even when dealing with dynamic data, at the cost of serving stale data once in a while.

### Conclusion

Even though you might hear, and it might be true, that programmer-hours are less expensive than CPU-hours - speed does matter.
At least it does to us. By making our API fast, we make it easier to embed into other applications.
In the end that makes it easier for developers and businesses to calculate and minimize their carbon footprint and make climate-friendly choices in real-time.
