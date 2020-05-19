---
title: "C# Enums - The Good The Bad And The Ugly"
permalink: "/csharp-enums-good-bad-ugly"
draft: true
extra_sources: "

"
---

https://stackoverflow.com/questions/19483975/jekyll-on-github-pages-any-way-to-add-footnotes-in-markdown


While C# is generally a pleasant language to use, I really dislike the way they've chosen to implement Enums.
An Enum is a way to enumerate and give name to a set of different values. Each of these values have an integer[^1]
assigned to them.

An enum is basically a named integer, example here. There's a few more things you can do in regards to the initialization,
but this is the basic example.[link]

Let's try to look at what they can and can't do.

## Basic Operations You Can Do

You can then require an enum for some method, if you want to limit the amount of choices that some function can take.

You can cast an enum to the corresponding integer value

You list all the values/names of an Enum

You can create extension methods

You can parse them from an int or a string (case sensitive or not)

You can create extension methods

You can sort them on their integral values


## Basic Operations you can't do

You can't disregard the order (in many cases)

You can't assign anything but ints

You can't implement your own toString method (without reflection or attribute)

You can't specify extra values enums can contain
(Except for reflection-based things like)
You can specify how they are serialized ([Desscription], [EnumMember], [JsonConverter(StringEnumConverter)])


## Enums and Ordering
Ordering matters
Enums implement sorting


## Advanced things
- You can assign any integer to an enum!
- You can use Enums as bit-flags
- Exhaustive switches


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