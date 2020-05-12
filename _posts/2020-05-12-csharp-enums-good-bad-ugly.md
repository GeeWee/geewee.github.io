---
title: "C# Enums - The Good The Bad And The Ugly"
permalink: "/csharp-enums-good-bad-ugly"
draft: true
extra_sources: "

"
---

# Todo update jekyll and add footnotes
https://stackoverflow.com/questions/19483975/jekyll-on-github-pages-any-way-to-add-footnotes-in-markdown


While C# is generally a pleasant language to use, I really dislike the way they've chosen to implement Enums.
An Enum is a way to enumerate and give name to a set of different values. Each of these values have an integer[^0]
assigned to them.

- They're basically named ints
- Can't distinguish between the Name of the Enum and the toString() value. (You can do some hacky stuff w/ attributes though)
- Can't save arbitrary metadata (only name and integer) (unless you implement your own attributes)
- TryParse
- Order matters
- Serialization ?
- You might not *want* an integer value
- Weird casting behaviour
- Bit flags are cool
- Extension methods
- Sorted by their integral values
- Bit flags


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