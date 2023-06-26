---
title: "Serde Errors when deserializing untagged enums are bad - but we can make them better."
permalink: '/serde-untagged-enum-errors-are-bad'
---

# Serde Errors when deserializing untagged enums are bad - but we can make them better.

- Serde has this really cool feature called untagged enums.
- Untagged enums means you can specify a list of structs in an enum, and Serde will parse the first one that matches.
- In the example below, specifying JSON with either fruit_count or burger_count will automatically parse the right enum variant
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

And then parsing is as simple as:
```rust
let json = json!(
    {
        "fruit_count": 5
    }
)
.to_string();

let my_food: MyFood = serde_json::from_str(&json).unwrap();
// Now is MyFood::Fruit variant        
```
- The happy case is extremely attractive, and we use it a lot at Climatiq to take in several different parameters to our different endpoints.
- The unhappy path is not particularly friendly. Any of the following pieces of code will fail with an unhelpful error that simply states `data did not match any variant of untagged enum MyFood`

```rust
let json = json!(
    {
        "tacos": 5
    }
)
.to_string();

let my_food: MyFood = serde_json::from_str(&json).unwrap();
// Does not work because no enum variant matches "tacos" - returns Error("data did not match any variant of untagged enum MyFood")
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
// Does not work because Fruits has deny_unknown_fields and we have a field too much - returns Error("data did not match any variant of untagged enum MyFood")
```

```rust
let json = json!(
    {
        "fruit_count": "5",
    }
)
.to_string();

let my_food: MyFood = serde_json::from_str(&json).unwrap();
// Does not work because "fruit_count" is supposed to be an int, but found string - returns Error("data did not match any variant of untagged enum MyFood")
```

- Essentially the error messages aren't very useful as a developer because you don't know what's wrong - and they definitely can't be surfaced to any non-developer user.
- Currently we work around this using a pattern that looks something like this:
- 
```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum MaybeValid<U> {
    Valid(U),
    Invalid(serde_json::Value),
}

// First parse it to something that's either valid or not valid. (Simplified, obviously you wouldn't want to unwrap here)
let maybe_valid = MaybeValid<MyFood> = serde_json::from_str(my_string).unwrap();

match maybe_valid {
    UnvalidatedUnit::Valid(valid) => {
        // Yay! We can move on.
    }
    UnvalidatedUnit::Invalid(json_value) => {
        // Parse the string to JSON ourselves, and then attempt to build a sensible error message
    }
}
```
- We have thousands of lines of code doing something similar to this pattern, to provide a semblance of useful error messages.
- I think the correct error messages in a case like this, would be to aggregate errors for all enum variants it tried to parse.
- An example from above of what the error message could look like:
```
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
// Did not match Fruit because `fruit_count` was string but expected integer. Did not match burger because required property `burger_count` was missing.")
```

- This isn't particularly a new problem. dtolnay [created an issue back in 2017 about it](https://github.com/serde-rs/serde/issues/773), but decided it wasn't worth pursuing at that time, but that he would accept PR's. I [created an issue back at the start of 2022](https://github.com/serde-rs/serde/issues/2157). There's also [a PR from 2019](https://github.com/serde-rs/serde/pull/1544) with one person who's maintaining his own up-to-date fork of serde with these changes made - the last conflicts were fixed two weeks ago. The PR has over 50 like reactions.
- This post is my attempt to shout out this awesome PR. Can we somehow get this merged in? It'd make life using untagged enums much nicer.