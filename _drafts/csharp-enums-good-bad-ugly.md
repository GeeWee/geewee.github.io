---
title: "C# Enums - The Good The Bad And The Ugly"
permalink: "/csharp-enums-good-bad-ugly"
draft: false
extra_sources: "
https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/enum#enumeration-types-as-bit-flags
"
---

TODO comprehensive guide?

C# is generally a pretty pleasant language to use. I often consider it *Java done right*.  
Except for enums.
I really think C# made some odd choices in regards to what Enums can and can't do. Let's try to explore what they're good
for and where they fall short.


An enum is a list of named integers[^0] where each integer also has a name:
```csharp
public enum FruitType
{
    Apple = 0,
    Pear = 1,
    Oranges = 2
}
```

In the example below `Apple` corresponds to the value `0`, `Pear` to the value `1` and so forth.  
Let's first work through what we *can* do with this `FruitType` enum.

## What You *Can* Do With An Enum
### Use it as a parameter or return value
This is handy if you want to signify
that a function will only return a specific set of choices, or if you want to restrict the choices that can be passed
into a function.
```csharp
public FruitType ExchangeFruit(FruitType originalFruit)
{
    // Exchange the FruitType you were given with another one
}
```

### You can convert them to strings
Calling `ToString()` on an enum member will return the name.
```csharp
FruitType.Apple.ToString() // Returns "Apple"
Console.WriteLine(FruitType.Pear) // Prints "Pear"
```

### You can cast an enum to the corresponding integer value
If you have an Enum and you want the corresponding integer value, you can explicitly cast it.
```csharp
int pearIntegerValue = (int) FruitType.Pear;
// pearIntegerValue is now 1
```

### You can assign an integer value to an Enum
If you have an integer, you can explicitly cast it to an enum. [see more](#enums-and-ordering) TODO
```csharp
FruitType pear = (FruitType) 1;
Console.WriteLine(pear); // Prints "Pear"
```

### You can list all names of a given Enum
The `System.Enum` class has a bunch of static methods that allow you to manipulate nums.
You can list all values or names of a given Enum
```csharp
string[] enumNames = Enum.GetNames(typeof(FruitType));
// Contains "Apple", "Pear", "Oranges"
``` 

### You can list all the values of a given Enum
You can also get all of the values of a given Enum. The API is wonky, as it doesn't
return a strongly typed array - so you have to cast it yourself.

```csharp
// This is the API to get the values.
// Notice that it returns an untyped array, which isn't very useful as that just
// returns object? if you try to get anything from it. 
Array fruitTypes = Enum.GetValues(typeof(FruitType));

// If you want an enumerable of the underlying type, you can do something like this
// which you expected that it would do in the first place.
IEnumerable<FruitType> fruitTypesWithActualType = Enum.GetValues(typeof(FruitType)).Cast<FruitType>();
```

### You can create extension methods
While enums are very restrictive in what you can and can't do with them, you can create extension methods that operate
on a specific Enum member. You create the extension method just like the enum was a regular class.
```csharp
public static class FruitTypeExtensions
{
    public static bool IsApple(this FruitType fruitToTest)
    {
        return fruitToTest == FruitType.Apple;
    }
}
```
and you can use it whenever you have any particular member of the Enum.

```csharp
var isAnOrangeAnApple = FruitType.Oranges.IsApple();
// False
var isAnAppleAnApple = FruitType.Apple.IsApple();
// True
```


## You can parse them from strings
If you have a string that you need to map to an Enum, you can do that via the `Enum` class, which exposes several different `Parse` methods.
Most of these methods take a second boolean parameter, whether or not the comparison should be case-sensitive or not.
```csharp
// Will throw an ArgumentException
FruitType automobileFruit = Enum.Parse<FruitType>("Automobile");

// Will return FruitType.Oranges
FruitType oranges = Enum.Parse<FruitType>("Oranges");

// Case-insensitive parse - will also return FruitType.Oranges
FruitType oranges = Enum.Parse<FruitType>("OrAnGeS", ignoreCase: true);

// There's also a TryParse
if (Enum.TryParse("OrAnGeS", ignoreCase: true, out FruitType fruit))
{
    Console.WriteLine(fruit); // Prints out "Oranges"
}
```


## You can sort them on their integer values
Enums are automatically orderable and sortable on their integer values. Enums implement `IComparable` and when
you call `Enum.GetValues` or `Enum.GetNames` they are always returned in sorted order.
This is a handy feature if you e.g. have a `LogLevel` enumerator, you can check where you are in the hierarchy

```csharp
public bool IsImportant(LogLevel logLevel){
    return logLevel >= LogLevel.Warning; 
}
```

## You can use them as bit flags
Enums have a pretty cool feature, where you can use them as bit flags. This means you can use bitwise logical operators
to combine choices, or get the difference of the choices.
You use the `[Flags]` attributes on the Enumerator to allow for this functionality. The integer values of the enumerator
has to be powers of two[^3].  

The `|` operator combines two choices `FruitTypes.Pear | FruitTypes.Apples` means either `Apples` or `Pears`  
The `&` operator finds the intersection of choices. `FruitTypes.Pear & FruitType.Apple` will return nothing[^4], while
the expression `(FruitType.Pear | FruitType.Apple) & FruitType.Apple` will return `FruitType.Apple`

# GOT TO HERE

A little more detailed example:
```csharp
[Flags]
public enum FruitType
{
    // Notice the values are powers of two
    Apple = 1,
    Pear = 2,
    Oranges = 4
}

Console.WriteLine(FruitType.Apple & FruitType.Oranges);
// My favourite fruits are either Apples or Oranges
var myFavouriteFruits = FruitType.Apple | FruitType.Oranges;
Console.WriteLine(myFavouriteFruits); // Outputs "Apple, Oranges"
 
// Does my favourite fruit include apples?
myFavouriteFruits.HasFlag(FruitType.Apple); // Returns true

// My friends favourite fruits are Pears and Oranges
var myFriendsFavouriteFruits = FruitType.Pear | FruitType.Oranges;
// Check which fruits exist in both sets
var favouriteFruitsWeHaveInCommon = myFavouriteFruits & myFriendsFavouriteFruits;
Console.WriteLine(favouriteFruitsWeHaveInCommon); // Outputs "Oranges"
```


## What You Can't Do
### You can only assign integer values
I think this is one of the biggest drawbacks - 90% of the enums I want to use are string-based.
I often don't want to assign "Apple" to the value `1` - I just want the value `Apple`.
I want it to be sorted as the value Apple, and I want to be able to customize the string representation of `Apple`

Proper string enums would also allow them to be used in databases, if you have a database convention that all enums
in the database are `UPPER_CASE`, and in C# you usually `PascalCase` your Enums. You could then do something like this.
```csharp
public Enum FruitType{
    Apple = "APPLE",
    // ... etc
}
```
Unfortunately I think C# really dropped the ball on this one. To me this is one of the most fundamental use-case of an Enum.

### You can't create static methods
C# enums don't allow us to define static methods.
Often static methods in Enums are used if you need to construct an enum in some other way than from a string
or the integer
```csharp
// A method like this can't be createdin FruitTypes.cs
public static IEnumerable<FruitType> FromFruitSalad(FruitSalad salad){
    //...
}
```
This isn't a big deal in most cases. The built-in parsing method are decent, and you can always create a static `FruitTypeUtils` class.


#### Enums cannot contain extra values
You can't specify any extra values or context an Enum member can contain.
You can't specify an alternative `toString` representation or keep an additional `DeliciousnessValue` in each Enum
member[^2].
You're strictly limited to a name and an integer.

## Enums and Ordering

## -> Enums and the zero value


## Enum Gotchas

### Implicit initialization
As we saw before, enums are ordered on their integer values.
If you don't provide integer values, C# will automatically generate some for you.
```csharp
public enum FruitType
{
    Apple,
    Pear,
    Oranges
}

// Is equivalent with

public enum FruitType
{
    Apple = 0,
    Pear = 1,
    Oranges = 2
}
```

While this might initially seem like a nice shorthand - it's really a footgun waiting to be fired. What if you 
save an enum value to a database (say `FruitType.Orange` which is equivalent to 3) in the database, and then later
on your enum has grown, so you decide to reorganize it

```csharp
public enum FruitTypes {
    // Citrus fruits
    Oranges,
    Lemons,
    
    // Melons
    Watermelon
    // ... 
}
```
Now when you retrieve your `2` from the Database, it's suddenly going to mean `Watermelon` instead of `Oranges`!
I don't think you should ever rely on implicit ordering, especially if you persist the enum somewhere.


## The zero value

There's also a `Enum.TryParse` method, but this one has a bit of a trick to it:
```csharp
// Succesful parsing example
if (Enum.TryParse("Oranges", out FruitType fruit))
{
    // Will print out "Oranges"
    Console.WriteLine(fruit);
}

// Wrong parsing example
if (Enum.TryParse("Train", out FruitType fruit))
{
}
// Will print out "Apples" 
Console.WriteLine(fruit);
```

What's going on here? The default value of the Enum is the same as the default value of the integer - in this case 0.
But zero is the value of `FruitType.Apple`! That's why a failed `TryParse` in our enum here, will always return an `Apple`.
This is worth noting when assigning values to your Enums.
A common practice I've seen to fix this is to have an `Unknown` member in each enum with the value 0.  


## Exhaustive switches (maybe not here)


## Summary
TODO consider splitting up into multiple articles
TODO enum casing
TODO streamline footnotes


[^0]: Technically any [integral type](https://docs.microsoft.com/da-dk/dotnet/csharp/language-reference/language-specification/types#integral-types) can be used as the values, such as `uint`, `byte`
and even `char` - but I'm sticking with `int` here, as that's what you mostly see.

[^1]: Technically an blablabla chars and stuff

[^2]: Not entirely true. You can via attributes add additional comments, such as the foo attributes, but you're limited to constants,
and consuming them requires reflection. 
You can specify how they are serialized ([Desscription], [EnumMember], [JsonConverter(StringEnumConverter)])

[^3]: and if it isn't you're in for a world of hurt


[^4]: and if it isn't you're in for a world of hurt