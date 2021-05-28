---
title: Just Use FluentAssertions
permalink: '/use-fluentassertions'
short: Testing frameworks in C# generally have some built-in way to do assertions. Don't use them - use FluentAssertions instead. Here's why.
---

Testing frameworks in C# generally come with a built-in way to do assertions. Today I'm here to argue that instead of using those, you should use [FluentAssertions](https://fluentassertions.com/) for all your test assertions.
FluentAssertions is a library that, well.. allows you to write fluent assertions. They look something like this:

```csharp
var someValue = 3;
someValue.Should().Be(3);
```
While you can feel whatever you want about the syntax, the real selling point is that FluentAssertions comes *packed* with features you don't get out-of-the-box.

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

Let's take a look at a little more complicated example - comparing two lists.
When comparing collections it can sometimes be hard to tell which elements aren't equal. Especially with long lists where the differences when printing them to the console might be subtle.

Let's try comparing these two lists that have a subtle difference - notice the whitespace after the `"3 "` in the `actual` list.
```csharp
var actual = new List<string> { "1", "2", "3 " };
var expected = new List<string> { "1", "2", "3" };
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
So what do we do? Well if we want to use the built-in assertions we have two options[^2]:

## Option 1: Implementing Object.Equals for use in tests
Now, I'm not a huge fan of implementing Object.Equals() in general, and [I've written about that before.]({{site.baseurl}}/dont-implement-object-equals).
To sum it up briefly:
- Object equivalence is harder than it seems, and your production code and your tests might not agree on what it means for two objects to be equal.
- It's a lot of extra lines of code you have to write and keep updated just to be able to test your code.

So what's our other option?

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
1. It's verbose. As your object grows, so does the amount of lines you'll need in each test to do assertions.
2. It doesn't force you to change your tests if you add a field to your class. In this case if we added an extra field our test would continue to pass.
We're not reminded that there's a new field to assert on.
3. Multiple test failures aren't aggregated - in the test case above both the second and the third asserts will fail - but we'll only get one error at a time. We want all errors at once, as these assertions are a single assertion on the object state - not 3 independent assertions[^3].


## The real solution - BeEquivalentTo
`BeEquivalentTo` is the real killer feature of FluentAssertions for me. It allows you to compare whether or not two object have equivalent fields.
It uses reflection to determine whether or not two objects are equal, without needing us to write multiple lines of assertions or implement any `Equals` methods.

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
It tells us which members are wrong, and the value of both the `actual` and the `expected` object.
It's concise, we get all of our errors at once and we don't have to write *any* extra code to make it work!


Testing for list content
=================================
I often I find myself wanting to assert that "This list has these 3 elements" but without caring what order the elements are in, for example when retrieving values from a database.

There isn't a good way to do this with xUnit's built-in asserts[^4] , but luckily `BeEquivalentTo()` has a few extra tricks up its sleeve.
It's not only for comparing objects - it can also be used to compare collections, and you get to tell it whether or not you care about the element order.
Take the example below.
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
    class2,
    class1
};

// This will pass - BeEquivalentTo ignores order by default
actual.Should().BeEquivalentTo(expected);

// This will not - we've specified we care about the ordering
actual.Should().BeEquivalentTo(expected, options => options.WithStrictOrdering());
```

You'll want to use parts of it anyways
==========================================
The power of `BeEquivalentTo` means that at some point you'll probably want to include FluentAssertions or a similar assertion library that gives you better assertions, and it's pretty nice to not have to remember the syntax for multiple assertion libraries[^5].
So if you're going to take a sip of the kool-aid anyways, you might as well down the whole bottle, and just use FluentAssertions for all your assertions. Forever.

[^0]: Happened while writing this post as a matter of fact.
[^1]: It does come at a cost of a slightly more unwieldy stacktrace though.
[^2]: Apart from just flipping the table over, and vowing to never write a test again.
[^3]: If you've asserted on HTTP responses, you might have tried your test failing on a non 2xx status code. Then the error message wouldn't contain the server response and you would have no idea why your test failed.
[^4]: Apart from either sorting the list, or manually selecting each entry through something like an ID and then asserting on it.
[^5]:  What was the difference between Assert.Equals vs Assert.Same again? <br> Is it Assert.Equals(actual, expected) or Assert.Equals(expected, actual)?
