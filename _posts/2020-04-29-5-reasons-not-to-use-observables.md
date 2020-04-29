---
title: "5 Reasons Not to Use Observables in C#"
permalink: "/5-reasons-not-to-use-observables"
draft: true
---
https://stackoverflow.com/questions/8221097/tricks-for-debugging-with-reactive-extensions
https://blog.acolyer.org/2018/06/29/debugging-data-flows-in-reactive-programs/
https://staltz.com/how-to-debug-rxjs-code.html
https://dbj.org/reactive-programming-in-javascript/
https://news.ycombinator.com/item?id=15775118
https://news.ycombinator.com/item?id=9273744


When I was first introduced to Observables in C#, they sounded pretty damn good.
"They just model streams of data", "It's just data over time" and "It's just the push equivalent of an IEnumerable".

Needless to say, all of that sounded pretty good to me.
However after working with them for a little while, I don't think that the statements above are the whole truth.
While observables might be conceptually simple to grasp from a birds-eye perspective, it seems like there's a lot
of warts that aren't immediately obvious until they bite you in the ass.


# They Don't Have a Consistent Name 
Observables suffer from a bit of an interesting issue.
It's surprisingly hard to find very much documentation about them!
At first I thought I was just searching for the wrong things. Digging a little deeper it doesn't seem like there's very much agreement on a "right" name.

 In stackoverflow the most used tag is `system.reactive`, but looking official documentation and Stackoverflow questions people refer to it as:
 
- Reactive Extensions [1](https://docs.microsoft.com/en-us/previous-versions/dotnet/reactive-extensions/hh242985(v=vs.103)?redirectedfrom=MSDN)[2](https://github.com/dotnet/reactive)
- Rx (short for Reactive Extensions) [1](https://docs.microsoft.com/en-us/previous-versions/dotnet/reactive-extensions/hh242985(v=vs.103)?redirectedfrom=MSDN)[2])(https://github.com/dotnet/reactive)
- Rx.Net [1](https://github.com/dotnet/reactive#flavors-of-rx) [2](http://reactivex.io/languages.html)
- .NET Reactive Framework [1](https://stackoverflow.com/questions/1596158/good-introduction-to-the-net-reactive-framework/1749252#1749252)
- ReactiveX [1](http://reactivex.io/)

With all of these names that are subtly different - what am I supposed to put in my search queries to get the best results?

*We'll call it Rx.Net in the rest of the post - at least it's short* 

# The Documentation Is Hard To Find
It’s supremely hard to find documentation for Rx.Net.
Rx.Net is the .NET flavour of [ReactiveX](http://reactivex.io/) you can read the ReactiveX documentation.
Of course since they're not exactly the same thing you actually need to know quite a bit of stuff already to use the documentation.
If I want to read the documentation for how the C# `Select` works, I need to know that in ReactiveX lingo it's called a `Map`

Then I can go into the docs and find a basic explanation of what a `Map/Select` does. There's also language-specific documentation for each of the different flavours.

*image*
(tag: Just kidding) 


There's also no API/class documentation anywhere on the internet for Rx.Net. I can find the docs in my editor so I know they've been *written*, but it's apparently not hosted anywhere.
While researching for the article the closest I could find is documentation on MSDN [from 2011](https://docs.microsoft.com/en-us/previous-versions/dotnet/reactive-extensions/hh244252(v%3Dvs.103)
That doesn't particularly make it easy to get started. 



# Observables are hard to debug
Observables aren't particularly easy to debug.
Let's take a reasonably simple example that throws an error and look at the stack trace: 


#TODO gist and new code
```csharp
[Fact]
public void Foo1()
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
       Console.WriteLine(err.Demystify());
       throw err;
   });
}
```
The humongous Stacktrace is as follows:

```
Error Message:
   System.Exception : That's an illegally large number
  Stack Trace:
     at AIP.OperationalApi.Test.FooTest.<>c.<Foo1>b__0_3(Exception err) in /home/geewee/programming/OAI/OperationalApi.Test/FooTest.cs:line 30
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
   at AIP.OperationalApi.Test.FooTest.Foo1() in /home/geewee/programming/OAI/OperationalApi.Test/FooTest.cs:line 25
```

Let's try to dissect it a little bit, by first removing all of the stuff that's internal to Rx.net 

```
Error Message:
   System.Exception : That's an illegally large number
  Stack Trace:
     at AIP.OperationalApi.Test.FooTest.<>c.<Foo1>b__0_3(Exception err) in /home/geewee/programming/OAI/OperationalApi.Test/FooTest.cs:line 30
     at AIP.OperationalApi.Test.FooTest.Foo1() in /home/geewee/programming/OAI/OperationalApi.Test/FooTest.cs:line 25
        
```
That's what we get. The first information we get is the line number where we subscribed to the Observable, and the stack trace ends with the function where the error was thrown.
When I see this error, I have no idea what transformations the data has gone through. If the stream has been dynamically constructed I might not even know what it looks like or what
data has passed through it.

This isn't unique to Observables though. Long LINQ-expressions suffer from the same issues.
When composing several different functions together, the stack traces very quickly stop becoming meaningful.

# TOdo image with caption
```
  Error Message:
   System.Exception : That's an illegally large number
  Stack Trace:
     at AIP.OperationalApi.Test.ObservableTests.<>c.<TestLinq_StackTraces>b__2_1(Int32 i) in /home/geewee/programming/OAI/OperationalApi.Test/ObservableTests.cs:line 55
   at System.Linq.Utilities.<>c__DisplayClass2_0`3.<CombineSelectors>b__0(TSource x)
   at System.Linq.Enumerable.SelectRangeIterator`1.MoveNext()
   at AIP.OperationalApi.Test.ObservableTests.TestLinq_StackTraces() in /home/geewee/programming/OAI/OperationalApi.Test/ObservableTests.cs:line 60
   ```


Curiously though, I haven't considered this much of a problem with LINQ chains, while it's been a perpetual thorn in my side for Observables.
How come? I think it's because when working in Observables there's a very strong tendency to keep everything as an Observable stream, while people often 
drop in and out of LINQ statements. The longer your streams are, the harder debugging the stacktrace becomes.


# Hard to keep scope



# It never really took off
Looking at the timelines, it seems like Rx.net in the hype cycled peaked a few years ago. 


(img)
Google trends
rxJs

system.reactive


c# observable

rx.net



# Extra
For example did you know SelectMany has overloads for tasks? You can await a task in SelectMany, but not in a Select. Supremely useful, but I only managed to figure it out because a colleague told me.

Bonus: Most of the good things aren’t exclusive to it
[ https://github.com/MicrosoftDocs/feedback/issues/114 ]