-------------------------------
title: Just Use FluentAssertions
permalink: '/remarkable-2setup'
-------------------------------

Testing frameworks in C# generally come with a built-in way to do assertions. Today I'm here to argue that instead of using those, you should use [FluentAssertions](https://fluentassertions.com/) for all your test assertions.
FluentAssertions is a library that, well.. allows you to write fluent assertions. They look something like this:

```csharp
var someValue = 3;
someValue.Should().Be(3);
```
While the name `FluentAssertions` talks about the style you write the assertions in - that's not a big selling point for me personally. FluentAssertion does however come *packed* with features you don't get out-of-the-box.

In this post I'm going to compare FluentAssertions to the built-in xUnit assertions, and hopefully convince you to just use FluentAssertions for your next (or current) project.

FluentAssertion has great assertion messages
====================================================
If you're anything like me you've tried looking at a failing failing test assertion and being unable to figure out why it was failing. [^0]
FluentAssertion doesn't eliminate this, but it does have some really, really good error messages when assertions fail.

Let's compare two examples where we try to validate that two different numbers are the same.
This seems like something that would be pretty easy to get right, so let's see how the frameworks do:

## xUnit
```csharp
var someIntFromAMethod = 23;

var expectedInt = 24;

// Expected, actual
Assert.Equal(expectedInt, someIntFromAMethod);
```
It returns the following error message:
```
Error Message:
Assert.Equal() Failure
Expected: 23
Actual:   24
Stack Trace:
at TestProject.FluentAssertionsTest.simpletestxunit() in /home/geewee/Programming/BlogProjects/BlogProject/FluentAssertionsTest.cs:line 25
```
Pretty good! It tells us both values, and via the stacktrace it tells us on which line the assertion went wrong.

## FluentAssertion
```csharp
var someIntFromAMethod = 23;
var expectedInt = 24;
someIntFromAMethod.Should().Be(expectedInt);
```
Gives us the following error message:
```
Error Message:
Expected someIntFromAMethod to be 24, but found 23.
Stack Trace:
    at FluentAssertions.Execution.XUnit2TestFramework.Throw(String message)
    at FluentAssertions.Execution.TestFrameworkProvider.Throw(String message)
    at FluentAssertions.Execution.DefaultAssertionStrategy.HandleFailure(String message)
    at FluentAssertions.Execution.AssertionScope.FailWith(Func`1 failReasonFunc)
    at FluentAssertions.Execution.AssertionScope.FailWith(Func`1 failReasonFunc)
    at FluentAssertions.Execution.AssertionScope.FailWith(String message, Object[] args)
    at FluentAssertions.Numeric.NumericAssertions`1.Be(T expected, String because, Object[] becauseArgs)
    at TestProject.FluentAssertionsTest.simplestestfluent() in /home/geewee/Programming/BlogProjects/BlogProject/FluentAssertionsTest.cs:line 48
```
FluentAssertion gives you the same information as xUnit, but it *also gives you the name of the variable that's failing*! That's handy![^1]

----

Let's take a look at a little more complicated example - comparing two lists. I think these are some of the harder assertion errors to spot - because sometimes these lists are pretty long,
and the differences when printing them to the console might be subtle.

Let's try comparing these two lists that have a subtle difference - notice the whitespace after the `"3 "` in the first list.
```csharp
var actual = new List<string>
{
    "1", "2", "3 "
};

var expected = new List<string>
{
    "1", "2", "3"
};
```
### XUnit
```
Assert.Equal() Failure
Expected: List<String> ["1", "2", "3"]
Actual:   List<String> ["1", "2", "3 "]
```
Alright, so not bad - it prints out both lists. It doesn't tell us *where* the error is, but it does at least give us something.

### FluentAssertions
```
Error Message:
Expected item[2] to be "3", but it has unexpected whitespace at the end.
```
FluentAssertion tells you what item in the list is wrong, and it even points out the hard-to-see difference of trailing whitespace.
If that ain't some good error messages I don't know what is.


Testing for object equivalency
==========================================
I think about half of my test assertions are that one object equals another.

For value-types like strings and numbers, using the built-in assertion libraries work great.
But as soon as we want to assert that two of our own classes are equal, we start running into issues.
Seeing as our classes don't implement `Equals()` there's not really any good way for the built-in libraries to see if they're equal to one another.
So what do we do? Well we have two options[^2]:

For value-types such as integers or strings this works fine using the "regular" assertion libraries, but as soon as we want to do assertion on most classes we start running into issues - they don't implement Equals so we don't have a "good" way to compare them to an actual value.

This leaves us with two options:
## Option 1: Implementing Object.Equals for use in tests
Now, I'm not a huge fan of implementing Object.Equals() in general for the following reason.

### What is equality anyways?
A great of objects don't have *one* stable way to consider whether or not they're equivalent. Take the following example.
```csharp
// We query the database for an object with the primary key 1
var objectFromDatabase = Database.QueryForId(1);

Thread.Sleep(50_000); // A lot of time passes, the row *in the database* is changed by someone else in this time

// We query the database again for the same row
var maybeSameObjectFromDatabase = Database.QueryForId(1);
```
Now - is `objectFromDatabase` and `maybeSameObjectFromDatabase` equivalent?
From the database point of view they might be because they refer to the same row.
However they have different fields, so they don't have the same in-memory representation currently.

All I'm saying is that object equivalence is hard the way you compare them in your tests might not be the same way you would in application code.

### Test driven damage
I'm of the firm belief that, as much as possible, we shouldn't change our code to make it easier to test.
The "optimal" world is one where you'd write the most straightforward code - and that would be testable.
The real isn't quite like that - but I still think we should resist making our code more unwieldy, just so we can test it.

So obviously I'm not a huge fan of implementing object.equals just to compare objects in tests.

### Maintenance cost
When an object has an `Equals()` defined, each update to it triggers a maintenance cost. If you add a field, you have to remember to add it in both your `Equals` and your `Hashcode`, otherwise you'll end up with some potentially hard
to catch bugs.


Okay, so maybe implementing object.equals isn't the best idea - what's our other alternative?

## Option 2: Testing for each property individually

We can test for each property individually like this:

```csharp
public class MyCustomClass
{
    public string Parameter1 { get; }
    public string Parameter2 { get; }
    public string Parameter3 { get; }

    public MyCustomClass(string parameter1, string parameter2, string parameter3)
    {
        Parameter1 = parameter1;
        Parameter2 = parameter2;
        Parameter3 = parameter3;
    }
}

[Fact]
public void Test()
{
    var actual = new MyCustomClass("hello", "world", "goodbye");
    var expected = new MyCustomClass("hello", "earth", "not bye");

    // Test for each property individually
    Assert.Equal(expected.Parameter1, actual.Parameter1);
    Assert.Equal(expected.Parameter2, actual.Parameter2);
    Assert.Equal(expected.Parameter3, actual.Parameter3);
}
```

However this has three drawbacks:
1. It's verbose - that's a lot of lines, and if your objects grow so will the amount of lines
2. It doesn't force you to change your tests if your object gains a property. If we add an extra field to the object this test will continue to pass. We're not reminded that there's a new field to assert on, even if we wanted to assert on all the fields.
3. Multiple test failures aren't aggregated - e.g. in this case the second assert will fail. After we fix that, the third assert will fail. Conceptually all of these assertions are a single assertion on the object state - not 3 independent assertions[^3].


## The real solution - BeEquivalentTo
This is the real killer feature of `FluentAssertions` for me. It allows you to compare whether or not two object have equivalent fields.
It uses reflection to determine whether or not two objects are equal, without us having to write multiple lines of assertions or implement any `Equals` methods.

The test above becomes:
```csharp
var actual = new MyCustomClass("hello", "world", "goodbye");
var expected = new MyCustomClass("hello", "earth", "not bye");

actual.Should().BeEquivalentTo(expected);
```
And the assertion error message:
```
Error Message:
Expected member Parameter2 to be "earth", but "world" differs near "wor" (index 0).
Expected member Parameter3 to be "not bye", but "goodbye" differs near "goo" (index 0).
```
It tells us which members are wrong, and the value of both the actual and the expected object!
We get all of our errors at once, it's concise and we don't have to write *any* extra code to make it work!


Testing for list content
=================================
I often I find myself wanting to assert that "This list has these 3 elements" but without caring what order the elements are in.

There isn't really a good way to do this with xUnit's built-in asserts[^5].
Luckily FluentAssertions `BeEquivalentTo()`` has a few extra tricks up its sleeve!
It can't only be used to compare objects - it can also be used to compare collections, and you can tell it whether or not you care about the element order!

```csharp
var class1 = new MyCustomClass("hello", "world", "goodbye");
var class2 = new MyCustomClass("hello", "earth", "not bye");

var actual = new List<MyCustomClass>
{
    class1,
    class2,
};
var expected = new List<MyCustomClass>
{
    class2, class1
};

// This will pass
actual.Should().BeEquivalentTo(expected);

// This will not
actual.Should().BeEquivalentTo(expected, options => options.WithStrictOrdering());
```

Now ain't that much easier than sorting lists?


You'll want to use parts of it anyways
==========================================
The power of `BeEquivalentTo` means that at some point you'll probably want to include FluentAssertions or a similar assertion library that gives you better assertions.
So if you have to use it anyways - you might as well go all the way and use it for everything. That way you won't need to remember the syntax and conventions of two assertion libraries.[^6]

So if you're going to take a sip of the kool-aid anyways, you might as well down the whole bottle, and just use FluentAssertions for all your assertions. Forever.


# todo write footnotes
#todo shorter example, and structure it a little better

[^5:]: Apart from either sorting the list, or manually selecting each entry through something like an ID and then asserting on it.
[^6]:  What was the difference between Assert.Equals vs Assert.Same again? <br> Is it Assert.Equals(actual, expected) or Assert.Equals(expected, actual)?
