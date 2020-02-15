---
title: "Static Factory Methods vs Constructors In C#"
permalink: "/csharp-static-factory-vs-constructor"
draft: false
---

Recently while pair programming with a colleague, we got into discussing the best way to initialize new objects in C#.
I've always just implemented constructors and left it at that, while he tended to favour static factory methods. This
led to a lot of discussion and back-and-forth about the pros and cons of each type.

Just to clarify what I'm talking about, here's an example of both

```csharp
// Using the constructor
SqlConnection myConnection = new SqlConnection(connectionString);

// Using a static factory method
IDbConnection myConnection = SqlConnection.FromConnectionString(connectionString);
```

I've never considered implementing these static factory methods before and I naturally
scorned what I didn't understand. I've since changed my mind - let's dive into the pros & cons.


## Pros of Static Factory Methods
### No need to return a new instance
In constructors you always have to return a *new* object.

You can't use a cached object or return `null` if the object creation fails.
I think for most application code, you probably don't need to do this, but the ability is certainly nice.
Particularly if you're writing library code, you might
appreciate the flexibility in the future.

### You can use method references
If you're inclined to write your C# more in a functional way - you might appreciate that you can pass a reference
to the method (or "method group" as they're officially called) in your code. Contrast this:

```csharp
// Static factory method - the method group can be passed in directly as a function reference
var IEnumerable<Bar> bars = myFoo
    .Select(bar.FromFoo)

// Constructors - you have to pass in a lambda that constructs the instance via new.
var IEnumerable<Bar> = myFoo
    .Select(f => new Bar(f));
```
There's no functional difference in this code - it's only a matter of taste in code style, so it probably shouldn't
weight *too* heavily into the decision.


### You can name 'em
For some objects, particularly objects that can be constructed in multiple similar ways - being able to put a name
on the way you construct your objects can be a huge benefit. Let's take an example of a `Color` class than can be
constructed both via CMYK and RGB parameters.

```csharp
// With constructors
var color = new Color(25, 25, 5, 80);
var color = new Color(100, 150, 50);

// With static factory methods
var color = Color.FromCMYK(25, 25, 5, 80);
var color = Color.FromRGB(100, 150, 50);
```
Unless you *know* that the four value constructor of Color is CMYK and the three value constructor is RGB, it's impossible to tell
by reading the code. Contrast that with the static factory methods which are much more descriptive.

I think if you have different ways to construct an object, particularly ones where the parameters resemble each other,
there's a strong case for using the static factory methods.

### Factory Methods can return a different class
While `New Foo()` always has to return a new instance of the `Foo` class, `Foo.FromBar` can easily return an `IFoo` interface,
or a subclass of `Foo`.
A real-world example where this could be relevant:

```csharp
// This could create an IpV4IpAddress that implements IIpAddress 
IIpAddress ipv4Address = IpAddress.FromString("127.0.0.1");

// This could create an IpV6IpAddress that implements IIpAddress 
IpAddress ipv6Address = IpAddress.FromString("2001:0db8:0a0b:12f0:0000:0000:0000:0001")
```
Being able to return a different actual type depending on the input is probably pretty valuable when providing public APIs, such
as in library contexts. Particularly because it means you can hide some implementation details behind an interface or a base class.

I'm not sure the value is as great in application code, where you control the whole codebase and can make large-scale refactorings much easier. 


### There Are Things You Shouldn't Do In Constructors
Generally people don't expect constructors to do much of anything but construct an object.
While you can do I/O, database access etc in constructors, most people don't expect it.
Convention-wise you're free to do more work in a static factory method without anyone raising any eyebrows.

Some people also don't think you should throw exceptions in constructors. Perhaps it depends on the language,
but in C# [it's totally fine](https://docs.microsoft.com/en-us/cpp/mfc/exceptions-exceptions-in-constructors?view=vs-2019), with
some caveats if you're [creating umanaged resources in your constructor](https://stackoverflow.com/questions/926362/throwing-exceptions-from-a-constructor-in-net).  


## Cons of Static Factory Methods
Let's look at the flip side of the coin

### There Are Things You Shouldn't Do In Constructors
Constructors are usually simpler by convention. When I call a constructor, I generally don't expect it to do I/O or anything fancier than
return a plain vanilla object with the properties I gave it.
This makes constructors much less flexible as a construct, which can be both a blessing and a curse.

### There's more code
No matter what, you're still going to need a constructor to actually construct the objects.
The static factory method is more code, and [code is a liabillity.](https://chrismdp.com/2012/09/code-is-a-liability/)
It's usually not very complex code, and usually the static factory methods aren't particularly long either - so this
is probably not a huge con.

### They're harder to find
Usually when I try to construct a new object, I look for the constructor first.
It's a little harder to find a static method via autocomplete - as they're usually not distinguishable from
other static methods.

I think my biggest issue I have with the static factory methods is the discoverability
you lose.


---

After doing the research and thinking about it, I think my opinion is this currently:

- You should always create one constructor that maps 1:1 to the fields internally in the class.
- If you need to do anything fancy to create the object, such as IO, or you're interested in caching objects and reusing them, use a static factory method.
- If you need API stability, such as for library development, hide that constructor and use a static factory method because
 of the implementation flexibility it gives you.
- If you have multiple different ways to create your class, create static factory methods and use those, because of the descriptiveness
they give you.

