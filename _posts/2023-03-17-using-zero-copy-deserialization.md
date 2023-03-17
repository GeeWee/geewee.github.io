---
title: "Everyone who writes should have GPT 4"
permalink: '/gpt4-is-great'
---


### Benchmarking our hot loops

When I first started at Climatiq, we were worried about how our solutions would scale. At that point we had less than five thousand emission factors, that you can use to estimate the greenhouse-gasses emitted for a particular activity.
Now we have almost 50.000, and our API is much faster than it used to be.



To maintain high performance and ensure that new features and optimizations do not negatively impact response times, Climatiq employs rigorous benchmarking using the Criterion library. This powerful benchmarking tool allows the team to measure and compare the performance of different code changes effectively.

By frequently benchmarking the core code when making substantial changes, Climatiq can assess the trade-offs between new features and potential performance regressions. This process helps the team make informed decisions about which optimizations to implement and ensures that the API remains performant even as new features are added.

Criterion provides insightful statistics and visualizations, making it easier for the Climatiq team to identify bottlenecks and areas for improvement. With this data-driven approach, the team can continuously fine-tune the API's performance, delivering an exceptional experience for users and reinforcing Climatiq's commitment to fast, efficient, and eco-friendly operations.


hashmaps