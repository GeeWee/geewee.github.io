---
title: "C# Enums - The Good The Bad And The Ugly"
permalink: "/csharp-enums-good-bad-ugly"
draft: true
extra_sources: "

"
---
C# is generally a pretty pleasant language to use. I often consider it *Java done right*. Except for Enums.
I really think C# made some odd choices in regards to what Enums can and can't do. Let's try to explore what they're good
for and where they fall short.

-> Some dubious decisions, some Clumsy

An enum is a list of named integers[^0], where each integer also has a name. 

```csharp
public enum FruitType
{
    Apple = 0,
    Pear = 1,
    Oranges = 3
}
```

In the example below `Apple` corresponds to the value `0`, `Pear` to the value 1 and so forth.
Let's first work through what we *can* do with this `FruitType` enum.

## Basic Operations You Can Do
#### You can use an enum type as a parameter or as a function return value.
This is handy if you want to signify
that a function will only return a specific set of choices, or if you want to restrict the choices that can be passed
into a function.
```csharp
public FruitType ExchangeFruit(FruitType originalFruit)
{
    // Pick a random FruitType here and return it
}
```

#### You can cast an enum to the corresponding integer value
If you have an Enum and you want the corresponding integer value, you can always explicitly cast it.
```csharp
int pearIntegerValue = (int) FruitType.Pear;
// pearIntegerValue is now 1
```

#### You can assign an integer value to an Enum
If you have an integer, you can explicitly cast it to an enum. [see more](#enums-and-ordering)
```csharp
FruitType pear = (FruitType) 1;
Console.WriteLine(pear == FruitType.Pear);
// Prints True
```

#### You can list all names of a given Enum
The `System.Enum` class has a bunch of static methods that allow you to manipulate nums.
You can list all values or names of a given Enum
```csharp
string[] enumNames = Enum.GetNames(typeof(FruitType));
// Contains "Apple", "Pear", "Oranges"
``` 

#### You can list all the values of a given Enum
You can also get all of the values of a given Enum, however the API is a little strange, since it doesn't
return a strongly typed array - you're going to have to cast it yourself.

```csharp
// This is the API to get the values. Notice that it returns an untyped array, which isn't very useful as that just
// returns object? if you try to get anything from it. 
Array fruitTypes = Enum.GetValues(typeof(FruitType));

// If you want an enumerable of the underlying type, you can do something like 
// which will do what you would expect the Enum.GetValues to do.
IEnumerable<FruitType> fruitTypesWithActualType = Enum.GetValues(typeof(FruitType)).Cast<FruitType>();
```

#### You can create extension methods
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


### You can parse them from a string
If you have a string that you need to map to an Enum, you can do that via the `Enum` class, which exposes several different `Parse` methods.
Most of these methods take a second boolean parameter, whether or not the comparison should be case-sensitive or not.
```csharp
// Will throw an ArgumentException
FruitType automobileFruit = Enum.Parse<FruitType>("Automobile");

// Will return FruitType.Oranges
FruitType oranges = Enum.Parse<FruitType>("Oranges");

// Case-insensitive parse - will also return FruitType.Oranges
FruitType oranges = Enum.Parse<FruitType>("OrAnGeS", ignoreCase: true);
```

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

### You can sort them on their integral values
Enums are automatically orderable and sortable on their integral values. Enums implement `IComparable` and when
you call `Enum.GetValues` or `Enum.GetNames` they are always returned in sorted order.
This is a handy feature if you e.g. have a `LogLevel` enumerator, you can check where you are in the hierarchy

```csharp
public bool IsImportant(LogLevel logLevel){
    return logLevel >= LogLeve.Warning; 
}
```

## Basic Operations you can't do

You can't create static methods

You can't disregard the order (in many cases)

You can't assign anything but ints

You can't implement your own toString method (without reflection or attribute)

You can't specify extra values enums can contain
(Except for reflection-based things like)
You can specify how they are serialized ([Desscription], [EnumMember], [JsonConverter(StringEnumConverter)])


## Enums and initialization


## Enums and Ordering
Ordering matters
Enums implement sorting


## Bit flags
- You can assign any integer to an enum!
- You can use Enums as bit-flags
- Exhaustive switches (maybe not here)


```csharp
    [JsonConverter(typeof(StringEnumConverter))]
    public enum FruitTypes
    {
        // Json serialization?
        [EnumMember(Value = "AppLe!!!")]
        APPLE, // Has the value 0
        PEAR, // Has the value 1
        ORANGES // Has the value 2
    }

    public static class FruitTypesExtension
    {
        public static string ToCoolString(this FruitTypes fruitType)
        {
            return fruitType.ToString() + "Cool";
        }
    }

    public class FooTest
    {
        private void DoSomethingWithAString(string s)
        {
            // ..
        }
        
        [Fact]
        public void TestFruitTypes()
        {
            
            // Can serialize it to a custom enum like this..
            Console.WriteLine(JsonConvert.SerializeObject(FruitTypes.APPLE));
            
            // DoSomethingWithAString(FruitTypes.PEAR.ToString());
            
            
            // Get all FruitTypes
            Console.WriteLine(
                Enum.GetValues(typeof(FruitTypes))
            );
            
            // Get the names of all FruitTypes
            Console.WriteLine(
                Enum.GetNames(typeof(FruitTypes)));

            
            // Get the values
            Enum.GetValues(typeof(FruitTypes));
            
            
            // Get name from value
            Console.WriteLine(Enum.GetName(typeof(FruitTypes), 1));

            // Parse - returns FruitTypes.Apple
            Console.WriteLine(Enum.Parse<FruitTypes>("APPLE"));
            Console.WriteLine(Enum.Parse<FruitTypes>("aPpLe", true));
            
            // Sortable
            Console.WriteLine($"Is bigger than: {FruitTypes.APPLE > FruitTypes.PEAR}");
            
            // Will print out "PEAR"
            Console.WriteLine(FruitTypes.PEAR);
            // Will print out 1
            Console.WriteLine((int) FruitTypes.PEAR);
            
            // You can compare Enums. Enums will always be identical to itself
            // and never to any other enum
            // Console.WriteLine(FruitTypes.PEAR == FruitTypes.PEAR);
            Console.WriteLine(FruitTypes.PEAR == FruitTypes.APPLE);

            Console.WriteLine(
                FruitTypes.PEAR.ToCoolString());
            
            // No exhaustive switch
            // Any int can be cast to it,
            FruitTypes f = (FruitTypes) 999;
            Console.WriteLine("cast equal..?");
            Console.WriteLine(FruitTypes.PEAR == f);
            
            Console.WriteLine(f);


            // Arrange

            // Act

            // Assert
        }
    }

```

[^1]: Technically an blablabla chars and stuff