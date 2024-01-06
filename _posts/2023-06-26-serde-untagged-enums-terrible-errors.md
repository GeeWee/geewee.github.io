---
title: "Serde Errors When Deserializing Untagged Enums Are Bad - But Easy to Make Better"
permalink: '/serde-untagged-enum-errors-are-bad'
short: |
  Serde is a powerful Rust library for serializing and deserializing data structures efficiently and generically. One of the cooler features is itssupport for untagged enums, which allow us to specify a list of structs in an enum, and Serde will parse the first one that matches. Unfortunately the error messages if it fails aren't great.
---

**Update 01/06/2023: Unfortunately the approach at the bottom of this article has been rejected, and how to get good error messages with untagged enums is currently in stasis**

[Serde](https://serde.rs/) is a powerful Rust library for serializing and deserializing data structures efficiently and generically. One of the cooler features is itssupport for untagged enums, which allow us to specify a list of structs in an enum, and Serde will parse the first one that matches. Here's an example demonstrating this:

```rust
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Fruits {
    fruit_count: i32,
}

#[derive(Deserialize)]
pub struct Burgers {
    burger_count: i32,
}

#[derive(Deserialize)]
#[serde(untagged)]
pub enum MyFood {
    Fruits(Fruits),
    Burgers(Burgers),
}
```

Parsing JSON[^0] with either `fruit_count` or `burger_count` automatically parses the corresponding enum variant:

```rust
let json = json!(
    {
        "fruit_count": 5
    }
)
.to_string();

let my_food: MyFood = serde_json::from_str(&json).unwrap();
// my_food is now the MyFood::Fruit variant
```

While this feature is quite attractive and  the happy path works great, it has an unfriendly downside. The error messages when failing to parse are often unclear, stating only that "data did not match any variant of your untagged enum". Examples of problematic code are as follows:

```rust
let json = json!(
    {
        "tacos": 5
    }
)
.to_string();

let my_food: MyFood = serde_json::from_str(&json).unwrap();
// Does not work because no enum variant matches "tacos"
// Error returned is: Error("data did not match any variant of untagged enum MyFood")c
```

```rust
let json = json!(
    {
        "fruit_count": 5,
        "foo": 3
    }
)
.to_string();

let my_food: MyFood = serde_json::from_str(&json).unwrap();
// Does not work because Fruits has `deny_unknown_fields` and we have a field too much
// Error returned is: Error("data did not match any variant of untagged enum MyFood")c
```

```rust
let json = json!(
    {
        "fruit_count": "5",
    }
)
.to_string();

let my_food: MyFood = serde_json::from_str(&json).unwrap();
// Does not work because "fruit_count" is supposed to be an int, but found string
// Error returned is: Error("data did not match any variant of untagged enum MyFood")c
```

These errors are not very informative for developers, and certainly can't be forwarded to end-users. To mitigate this, we've adopted a workaround pattern that involves a custom `MaybeValid` untagged enum[^1]:
 
```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum MaybeValid<U> {
    Valid(U),
    Invalid(serde_json::Value),
}

// First parse it to something that's either valid or not valid.
// This is simplified for the sake of brevity - in production code you wouldn't unwrap here
let maybe_valid = MaybeValid<MyFood> = serde_json::from_str(my_string).unwrap();

match maybe_valid {
    MaybeValid::Valid(valid) => {
        // Yay! We can move on.
    }
    MaybeValid::Invalid(json_value) => {
        // Parse the string to JSON ourselves, and then attempt to build a sensible error message
    }
}
```

This pattern, while not ideal, gives us the ability to construct somewhat useful error messages. We have thousands of lines doing this parsing and error construction.

There's a better way though. We could aggregate errors for all enum variants tried during parsing, resulting in more informative errors:

```rust
let json = json!(
    {
        "fruit_count": "5",
    }
)
.to_string();

let my_food: MyFood = serde_json::from_str(&json).unwrap();
// Does not work because "fruit_count" is supposed to be an int, but found string.
// It could return something like: 
// Error("data did not match any variant of untagged enum MyFood.
// Did not match Fruit because `fruit_count` was string but expected integer.
// Did not match burger because required property `burger_count` was missing.")
```

This isn't a new problem, and has several issues ranging from [2019](https://github.com/serde-rs/serde/issues/773) to [2022](https://github.com/serde-rs/serde/issues/2157). There's even [a Pull Request from 2019](https://github.com/serde-rs/serde/pull/1544) with one person who's been maintaining his own up-to-date fork of serde that aggregates untagged enum errors. The last conflicts with the main serde branch were fixed two weeks ago. The PR has over 50 like reactions.

This PR is an excellent contribution, and I want to take this opportunity to bring it to attention. Merging this could greatly enhance the experience of using untagged enums in Serde.

[^0]: Or any other supported serde format such as yaml, postcard, bincode or others
[^1]: It's untagged enums all the way down.
