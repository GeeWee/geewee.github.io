---
title: Don't implement equals because of tests
permalink: '/dont-implement-object-equals'
draft: True
short: You should rarely implement Object.Equals. And you should definitely never do it for testing purposes. Here's why.
---

Back in the days where I still wrote Java[^0] I was writing some tests where I needed to ensure that two objects were equal.
At the time it seemed obvious to me that the right call was just to implement `Object.Equals()` to allow for object comparison.

However, I now believe that this isn't the right call. I'd go so far as to say that you should *never* implement `Object.Equals` if all you need to do is compare two objects in a test.

# What is equality anyways?
What makes two objects equal? That seems like a simple question and for some objects it might be.

I think it's often a trickier question than we give it credit for - let me share a few examples:
```csharp
// We query the database for an object with the primary key 1
var objectFromDatabase = Database.QueryForId(1);

Thread.Sleep(50_000); // A lot of time passes, the row *in the database* is changed by someone else in this time

// We query the database again for the same row
var maybeSameObjectFromDatabase = Database.QueryForId(1);
```
Now - is `objectFromDatabase` and `maybeSameObjectFromDatabase` equivalent?
From the database point of view they are - they refer to the same row after all.
However they have different values for some of their fields, so in that way they aren't equivalent.

------
Let's try to look at another notoriously tricky examples - *time*.

Take the following example, where Nodatime and the built-in C# standard library disagree about when two times are equal.

```csharp
// Note this has hour: 12 and an offset of one hour
var date1 = new DateTimeOffset(year: 2020, month: 1, day: 12, hour: 12, minute: 00, second: 00,
    TimeSpan.FromHours(1));
// Note this has hour: 11 and no offset
var date2 = new DateTimeOffset(year: 2020, month: 1, day: 12, hour: 11, minute: 00, second: 00,
    TimeSpan.FromHours(0));
date1.Equals(date2); // Returns true
```
The C# standard library will tell you that these two datetimes are identical - and if you're asking whether or not these times represent the same instant in UTC-time, you'd be right.

The popular datetime library [Nodatime](https://nodatime.org/) disagrees though - look at the exact same example.
```csharp
// Note this has hour: 12 and an offset of one hour
var date1 = new OffsetDateTime(new LocalDateTime(year: 2002, month: 1, day: 12, hour: 12, minute: 00), Offset.FromHours(1));
// Note this has hour: 11 and no offset
var date2 = new OffsetDateTime(new LocalDateTime(year: 2002, month: 1, day: 12, hour: 11, minute: 00), Offset.FromHours(0));
date1.Equals(date2); // Returns false
```
So why doesn't Nodatime consider these times to be equal? Because NodaTime thinks that *the offset matters*.
It doesn't consider two times equal just because they map to the same instant in UTC time.
So which library is right? Confusingly enough I think they both are - they just have different concepts of equality.

I hope I've underlined how something that seems as simple as "are these two objects the same" can actually be pretty tricky:
 - It might not be completely clear-cut what it means for an object to be equal to another object
 - Depending on your use-case (and perspective) you might have *different ways* of considering whether two objects are equal.

If you implement `Equals()` in your code to compare objects in tests - you're banking on the fact that your tests and your production code is going to agree on what it means for two object to be equivalent - and that's a gamble.

# Test driven damage
I think that in the best of all worlds, we shouldn't ever have to change our production code to make it easier to test.
We would write the most straightforward code, and that code would be easily testable.
Now we obviously don't live in that world. We live in a world full of Dependency Injection and `FooFactoryFactory`'s.

However I think striving to have our tests complicate our production code as little as possible is a worthwhile goal.[^1]
That's why I don't feel like it's a good call to make a class significantly bigger, just to make it easier to test if we can avoid it.

# Maintenance cost
You're not even done after thinking about what equivalence means for this object, and having your IDE generate the `Equals()` method.
No the damnedest thing is you have to do it all again each time you change the class.
"Should this new field I added change the equality parameters of the class?" is something you have to ask yourself over and over again.

And if you forget to change your `Equals` (oh and your `GetHashCode` too), you can end up with some really, really subtle bugs.
So if you can, avoid implementing `Object.Equals` unless your objects have a really sturdy sense of what two objects being equal means.

And definitely don't do it just to compare objects in tests. [Use something reflection-based like FluentAssertions instead]({{site.url}}/use-fluentassertions)


[^0]: These principles still hold true for other object-oriented languages like C# though.
[^1]: Making code harder to read to make it easier to test is sometimes called test-driven damage <br> or [test-induced design damage](https://dhh.dk/2014/test-induced-design-damage.html).
