---
title: "5 Reasons To Not Use Observables in C#"
permalink: "/5-reasons-to-not-use-observables"
draft: false
extra_sources: "
https://stackoverflow.com/questions/8221097/tricks-for-debugging-with-reactive-extensions
https://blog.acolyer.org/2018/06/29/debugging-data-flows-in-reactive-programs/
https://staltz.com/how-to-debug-rxjs-code.html
https://dbj.org/reactive-programming-in-javascript/
https://news.ycombinator.com/item?id=15775118
https://news.ycombinator.com/item?id=9273744
https://github.com/dotnet/reactive/issues/1187
https://github.com/dotnet/reactive/issues/14
https://social.msdn.microsoft.com/Forums/en-US/9b96c83a-13ec-4943-80ca-df01f94df683/executioncontext-does-not-flow-consistently-through-observables?forum=rx
https://stackoverflow.com/questions/51279665/net-core-asynclocal-loses-context-with-system-reactive
"
---
When I was first introduced to Observables in C#, they sounded pretty damn good. "They just model streams of data", "It's just data over time" and "It's just the push equivalent of an IEnumerable". After working with them for a little while, I don't think they're as good as I was told.

The statements above might be true. Observables might be simple from a birds-eye perspective. Unfortunately simple doesn't always mean easy and there's are some things that will end up biting you in the ass. Here's five of them.


## The Framework Has No Consistent Name 
When searching for documentation and solutions to problems with Observables, I always felt like I didn't know what to search for. Previously I've always known the terms to use, `django {your-problem-here}`, `serilog {how-to-do-x}` `{framework}-{problem description}`   However with Observables I had a lot of problems finding people encountering similar issues, and I was never really sure what to put for the `{framework}` part of my queries.

I spent a little time trying to figure out what the right term is. Turns out - nobody seems to know.

On Stack Overflow the most used tag is `system.reactive`, but looking official documentation and Stack Overflow questions, I've seen it referred to as:
- Reactive Extensions [[1]](https://docs.microsoft.com/en-us/previous-versions/dotnet/reactive-extensions/hh242985(v=vs.103)?redirectedfrom=MSDN) [[2]](https://github.com/dotnet/reactive)
- Rx (short for Reactive Extensions) [[1]](https://docs.microsoft.com/en-us/previous-versions/dotnet/reactive-extensions/hh242985(v=vs.103)?redirectedfrom=MSDN) [[2]](https://github.com/dotnet/reactive)
- Rx.Net [[1]](https://github.com/dotnet/reactive#flavors-of-rx) [[2]](http://reactivex.io/languages.html)
- .NET Reactive Framework [[1]](https://stackoverflow.com/questions/1596158/good-introduction-to-the-net-reactive-framework/1749252#1749252)
- ReactiveX [[1]](http://reactivex.io/)

With all of these names that are subtly different - what am I supposed to search for?

*We'll call it Rx.Net in the rest of the post - at least it's short* 

## The Documentation Is Hard To Find
Finding documentation online for Rx.Net is pretty close to impossible. While figuring out the search terms to use is hard, finding comprehensive documentation is much, much harder. 

Rx.Net is the .NET flavour of [ReactiveX](http://reactivex.io/), which luckily seems to have quite a bit of documentation! Unfortunately you pretty much have to know what you're looking for already. If I want to read the documentation for how the C# `Select` works, I need to know that in ReactiveX, `Select` is called `Map`

When I know that, in the ReactiveX documentation I can find a language-agnostic explanation of what a `Map/Select` does. There's also language-specific documentation for each of the different flavours, including Rx.Net!

<div class="img-div">
<img src="{{site.url}}/assets/img/observable/reactivex-docs.png" />
Just kidding
</div>

There's also no API reference online anywhere. I can find the documentation in the editor, so I know it's been *written* - but it isn't hosted anywhere. The closest we get is this API reference from [MSDN](https://docs.microsoft.com/en-us/previous-versions/dotnet/reactive-extensions/hh244252(v%3Dvs.103)). From 2011.


## Observables are hard to debug
Observables can be a pain to debug. Most debuggers aren't particularly suited for tracing streams of data, and the stack traces you get are unimpressive. Let's dive a little deeper into the stack traces. Take this piece of code which throws an error after a few integers have passed through the stream.

```csharp
[Fact]
public void ObservableTest()
{
   IObservable<int> observable = Observable.Range(0, 5)
       .Select(i => i * 2)
       .Do(i =>
       {
           if (i > 5)
           {
               throw new Exception("That's an illegally large number");
           }
       });

   observable.Subscribe(
       onNext: (i) => Console.WriteLine(i),
       onError: (err) =>
   {
       throw err;
   });
}
```
The humongous Stacktrace is as follows:

```
Error Message:
   System.Exception : That's an illegally large number
  Stack Trace:
     at MyProject.Test.ObservableTest.<>c.<Foo1>b__0_3(Exception err) in /home/geewee/programming/MyProject.Test/ObservableTest.cs:line 30
   at System.Reactive.AnonymousSafeObserver`1.OnError(Exception error) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\AnonymousSafeObserver.cs:line 62
   at System.Reactive.Sink`1.ForwardOnError(Exception error) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Internal\Sink.cs:line 61
   at System.Reactive.Linq.ObservableImpl.Do`1.OnNext._.OnNext(TSource value) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Linq\Observable\Do.cs:line 42
   at System.Reactive.Sink`1.ForwardOnNext(TTarget value) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Internal\Sink.cs:line 50
   at System.Reactive.Linq.ObservableImpl.Select`2.Selector._.OnNext(TSource value) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Linq\Observable\Select.cs:line 48
   at System.Reactive.Sink`1.ForwardOnNext(TTarget value) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Internal\Sink.cs:line 50
   at System.Reactive.Linq.ObservableImpl.RangeRecursive.RangeSink.LoopRec(IScheduler scheduler) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Linq\Observable\Range.cs:line 62
   at System.Reactive.Linq.ObservableImpl.RangeRecursive.RangeSink.<>c.<LoopRec>b__6_0(IScheduler innerScheduler, RangeSink this) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Linq\Observable\Range.cs:line 62
   at System.Reactive.Concurrency.ScheduledItem`2.InvokeCore() in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Concurrency\ScheduledItem.cs:line 208
   at System.Reactive.Concurrency.CurrentThreadScheduler.Trampoline.Run(SchedulerQueue`1 queue) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Concurrency\CurrentThreadScheduler.cs:line 168
   at System.Reactive.Concurrency.CurrentThreadScheduler.Schedule[TState](TState state, TimeSpan dueTime, Func`3 action) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Concurrency\CurrentThreadScheduler.cs:line 118
   at System.Reactive.Concurrency.LocalScheduler.Schedule[TState](TState state, Func`3 action) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Concurrency\LocalScheduler.cs:line 32
   at System.Reactive.Concurrency.Scheduler.ScheduleAction[TState](IScheduler scheduler, TState state, Action`1 action) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Concurrency\Scheduler.Simple.cs:line 61
   at System.Reactive.Producer`2.SubscribeRaw(IObserver`1 observer, Boolean enableSafeguard) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Internal\Producer.cs:line 119
   at System.Reactive.Producer`2.Subscribe(IObserver`1 observer) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Internal\Producer.cs:line 97
   at System.ObservableExtensions.Subscribe[T](IObservable`1 source, Action`1 onNext, Action`1 onError) in D:\a\1\s\Rx.NET\Source\src\System.Reactive\Observable.Extensions.cs:line 95
   at MyProject.Test.ObservableTest.ObservableTest() in /home/geewee/programming/OAI/MyProject.Test/ObservableTest.cs:line 25
```

Removing all the Rx.Net internal stuff, this is the only information in the stack trace we care about:

```
Error Message:
   System.Exception : That's an illegally large number
  Stack Trace:
     at MyProject.Test.ObservableTest.<>c.<ObservableTest>b__0_3(Exception err) in /home/geewee/programming/MyProject.Test/ObservableTests.cs:line 30
     at MyProject.Test.ObservableTest.ObservableTest() in /home/geewee/programming/OAI/MyProject.Test/ObservableTests.cs:line 25
        
```
We get the line number where we subscribed to the observable, and the function inside the chain where the error was thrown. I have no idea what transformations the data has gone through. If the stream has been dynamically constructed I might not even know what it looks like.

These issues aren't unique to observables. Composing long LINQ-expressions suffer from the same issues. When composing several different functions together, the stack traces very quickly stop becoming meaningful. The below is the complete stack trace the Enumerable/LINQ version of the Observable code. 

```
  Error Message:
   System.Exception : That's an illegally large number
  Stack Trace:
     at MyProject.Tests.ObservableTests.<>c.<TestLinq_StackTraces>b__2_1(Int32 i) in /home/geewee/programming/MyProject.Test/ObservableTests.cs:line 55
   at System.Linq.Utilities.<>c__DisplayClass2_0`3.<CombineSelectors>b__0(TSource x)
   at System.Linq.Enumerable.SelectRangeIterator`1.MoveNext()
   at MyProject.Tests.ObservableTests.TestLinq_StackTraces() in /home/geewee/programming/MyProject.Test/ObservableTests.cs:line 60
   ```

It's much cleaner, but it doesn't give us any more information than the observable version. 

The poor debugging and stack-traces are a perpetual thorn in my side when working with Observables. But if the same issues exist with long chains of Enumerable, why is that less of an issue? The short answer - I don't know.

My best guess is that when using Observables there's a strong tendency to keep everything as an Observable stream. The longer your streams are the harder debugging with a minuscule stack trace becomes.

## It's Hard To Use Scopes
A very common thing I need to do is attach some sort of context to a request or a series of events. 

```csharp
var id = "myCoolId"
using (LogContext.PushProperty("id", id))
{
    // Every log statement in here will have the `id=myCoolId` attached 
    await DoSomething(id);
}
```
This is a very common usage patterns for logging, for example in Web Apps if you want to attach a specific GUID to a Request, so you can later correlate all logs for that specific request. 

Something like this isn't possible when using Rx.Net, as it's threading model doesn't carry over the ExecutionContext. [[1]](https://github.com/dotnet/reactive/issues/14) [[2]](https://stackoverflow.com/questions/51279665/net-core-asynclocal-loses-context-with-system-reactive) This means that we can't use something like an `AsyncLocal` or a `ThreadLocal` to keep context for a specific piece of data or stream. If we want the `myCoolId` to be attached to all of the logs, we'll need to pass it into every step of our observable chain, and manually pass it to every logging call. I know there's a value in being explicit, but this is a time where choosing Rx.Net locks you out of some pretty handy language features.


## It never really took off
Looking at the timelines, it seems like Rx.net in the hype cycled peaked a few years ago. If it ever really took off. 

<div class="img-div">
<img src="{{site.url}}/assets/img/observable/google-trends.png" />
Google Trends for system.reactive compared to the Javascript version of the ReactiveX framework.
</div>

Comparing it in google searches to RxJS it seems much less widely used. Looking at the Stack Overflow trends reveals a little more nuanced picture however:

<div class="img-div">
<img src="{{site.url}}/assets/img/observable/stackoverflow-trends.png" />
Stack Overflow trends for system.reactive compared to the Javascript and Java versions of the ReactiveX framework.
</div>

While still much less popular than RxJS and the Java ReactiveX version, Rx.Net does seem to predate their popularity by quite a few years. Microsoft was out early with the reactive paradigm but never really seemed to manage to make it take off.

Now while your technology choices shouldn't be about how hyped something is - the popularity is always worth taking into account. Some old technologies are sturdy, battle-tested and well-documented. Then they don't have to be shiny.

However with some of the pitfalls, particularly around the documentation issues, Rx.Net feels neither robust or shiny to me.

---

While this is a negative article, I'm not saying Rx.Net or the Reactive paradigm is _always_ bad. Some of the issues are about the tooling and documentation. I mention that most debuggers aren't suited for debugging streams, but this is a tooling problem and not inherent to the reactive paradigm. E.g. Jetbrains has an excellent [Java Stream Debugger](https://plugins.jetbrains.com/plugin/9696-java-stream-debugger).


Observables seems like a very natural fit for some languages and domains, like reacting to user interactions in JavaScript, as the large adoption of RxJs suggests. I'm just saying that it doesn't feel like a particularly natural fit for C#, and if you have some data that can be modelled as either Enumerables or Observables, I would think twice about using Observables.