---
title: "Rust Impressions: One Month In"
permalink: '/rust-impressions-one-month-in'
short: |
    I've been working with rust at for a little more than a month now.
    Here's my first impressions, from someone who's never seriously worked with a low-level language before.
---

I've been working with rust at [Climatiq](https://climatiq.io/) for a little more than a month now.
Here's my first impressions, from someone who's never seriously worked with a low-level language before.

It's actually been surprisingly easy to learn. The (freely available) "Rust Programming Language" book, Rust by Example and rustlings are all great resources to get started. The learning process is extremely streamlined - which is good because Rust has _a lot_ of different syntax.

Even with all the syntax, Rust feels a lot like a low level programming language that's disguised  as a high-level one.
Most of the conveniences you're used to from higher-level programming languages are available, such as iterators, closures, and a very functional programming style.

This means that I can _mostly_ write Rust like I would a high level programming language, guided by the really, really amazing compiler errors. I'd say that 80% of the mistakes I make the compiler seems to propose the correct solution.

In most cases all of my worrying about ownerships and borrowing boils down to "do what the compiler suggests". Then there's the 5% of time, where I actually do need to sit down and consider these things - but those cases are surprisingly rare.

Rust feels very ergonomic to use. Cargo is a wonderful package manager/build system, using the built-in Result and Option type for error/null handling also works very well. Strings are a little unwieldy, but that's primarily because Rust has decided to actually surface to the developer how complex utf-8 strings _really are.

The only large wart I've found on the ergonomics is that returning iterators from functions seem nigh-impossible. If you want to take in an iterator, do some operations on it, and return another iterator you have to jump through so many hoops you'd think you were a lion at the zoo.

It's not all roses though, and there's still some stuff I struggle with. I think converting between types (using the From/Into traits) is documented in a confusing way. It's something that should be pretty simple to understand, but for some reason it's been exceedingly hard to grasp.

Complicated references confuse me. I understand that prefixing `&` in front of `&myVar` means it's a reference to the variable that I don't own. However in some cases you end up with situations where you have two `&` in-front of your variable `&&myVar` - and I don't understand what that means, or why it matters how many `&`'s there are.
This generally happens when iterating over a vector of references, and I can't figure out why.

This is made worse by the fact that it's harder to google issues like that. Google seems to ignore syntax constructs like `&&`.
It also seems like there's less Rust questions on StackOverflow. Normally for most questions in other languages I can get answers reasonably quickly from SO - but in Rust the questions seems to be a split between reddit, the rust-forum and SO.

I also don't understand when I need to dereference stuff with the `*` operator, or even when I'm _allowed_ to dereference stuff. So far the compiler has been pretty good at telling me when I need to dereference to make things work.

There's also some stuff I wish the language had. Most notably, function overloading, and default function arguments would be pretty ergonomic to have in quite a few cases.

My only other issue with the stuff that's built-in, is that the test assertions aren't very good. We get a few macros like `assert_eq!(var1, var2)`, but the rich error messages I'm used to from C# and JavaScript aren't there at all.


Parts of the Rust ecosystem also feels a little JavaScript-y, where crates "you're supposed to use" has changed quite a bit.
I get the impression that particularly error handling has seen a few iterations (use anyhow, no use thiserror, no it depends on if you're a library or an application)

The logging ecosystem also seems like a bit of mess. Use log, no env_logger, no tokio/tracing (which seems really great but has terrible support for structured/json logging.)

I think some crate churn is probably to be expected as Rust is still a reasonably new language. But particularly for error handling I hope the community consensus stabilizes soon. I wish there had been a chapter in the learning materials talking about these third party error crates, but obviously that's not possible when people can't agree on what's the right way to do things.

In general, Rust has been much easier to learn than I thought it would be.
For a lot of the advanced stuff you can postpone really _getting_ it, as the compiler is so good at telling you what's going on. It's been much easier to learn than I had feared, and so far I definitely see why people who use it really, really like it.