---
title: "Prettier for C# - Developing an auto-formatting pre-commit hook"
permalink: "/csharp-prettier"
short: |
        Many programming languages have automatic formatters. Go has `gofmt`, Rust has `rustfmt`, JavaScript has `prettier`
        and python has `black`.
        
        Being able to, in an editor-independent way, have your code automatically formatted without having to worry about it,
        is extremely freeing. It means there's a whole slew of religious wars you don't have to fight, and it means
        you never have to review a pull request with a bunch of noise, because *this* particular editor or user thinks the braces
        belong on some other line than they were.
        
        Unfortunately C# doesn't really have an equivalent, but here's my attempt at making one.
---

Many programming languages have automatic formatters. Go has `gofmt`, Rust has `rustfmt`, JavaScript has `prettier`
and python has `black`.

Being able to, in an editor-independent way, have your code automatically formatted without having to worry about it,
is extremely freeing. It means there's a whole slew of religious wars you don't have to fight, and it means
you never have to review a pull request with a bunch of noise, because *this* particular editor or user thinks the braces
belong on some other line than they were.

Unfortunately C# doesn't really have an equivalent. This has probably been mostly fine in the past, as everyone used
Visual Studio, so could be configured to follow the same styling guidelines. I don't think this is fine anymore.
.NET Development is cross-platform now, but Visual Studio doesn't exist on Linux. Light-weight editors like VSCode are
winning ground in many places, and Jetbrains are making the excellent [Rider IDE](https://www.jetbrains.com/rider/)

What used to be just one editor, with one formatting preference, is now multiple editors across multiple platforms,
each with different formatting preferences. We need a C# autoformatter.

# ReSharper CLI Tools
ReSharper, which is a Jetbrains plugin for Visual Studio, has for quite a while released some of their tools as command
line interfaces. This includes things like Code Inspections, Duplicate Finders,
and the most important one for us, `CleanupCode` - which among other things, formats code.

Now these tools used to be windows only, but with the advent of Rider, they've slowly been ported to become cross platform,
and with the release of Rider 2019.3, they're in general availability. This means we now have the tools we need, to create
a fully cross-platform auto-formatter, and that's what I've done.

# The pre-commit hook
I've created a pre-commit hook that uses the Resharper auto-formatter to automatically format files you commit,
so you don't have to think about it. It should work with any editor, and any platform. 
If you simply want to try it out for yourself, there's a git hook located [here](https://github.com/GeeWee/reshaper-pre-commit-hook).
Installing it is a one-liner, and I've tested it on both Windows and Linux (but not MacOS).
Follow the instructions in the repository, and please submit an issue if there's anything that's broken.


Unfortunately, it's not all sunshine and rainbows.
The Resharper CLI doesn't have the fastest boot time, so it does add a significant, but bearable, delay when comitting.
Expect your commits to take up to five seconds longer than they normally do. I hope this is something Jetbrains will improve on
in the future.

