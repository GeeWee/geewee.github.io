---
title: "Crafting the Ideal Specifications for Software Developers"
permalink: '/software-specifications'
---

In Climatiq we do something like [dual-track agile](https://www.productboard.com/glossary/dual-track-agile/), where we often spend some dedicated time discovering and figuring out what a part of our product should do on a conceptual level, and then some time after that, implementing that product part in code.

I was asked earlier by a colleague at [Climatiq](https://www.climatiq.io/), what the best way was to write a specification, so the engineering team could effectively take the conceptual design work and start implementing. This is my attempt to answer that question. The title of the article is a bit of a trick, because the ideal specification is no specification. While this doesn't apply if you're a senior developer breaking down tasks to help a junior developer out - creating a specification for any large piece of software isn't worth the time - it's probably not even possible. This is because:

## Code **is** a Specification

Code is essentially a specification of behaviour. If this, do that. This means that to write a specification that's thorough enough for a software developer to take it and implement it exactly as-is - you essentially need to write the entire program.
There's been a historical view that viewed programming more of a manufacturing activity - take in specs and spit out code. However software development is [primarily a design activity](https://wiki.c2.com/?TheSourceCodeIsTheDesignhttps://wiki.c2.com/?TheSourceCodeIsTheDesign).

This means you can't craft a specification and just toss it over the fence - you'd essentially have to write the program. What you can do however, is to help the developers along and give them the best possible conditions for performing the design activity. You do that by ensuring they understand the problem. That leads me to my next point.

## The Problem Is More Important Than The Solution

The most crucial aspect of handing over a project to developers is providing them with all the necessary context.
This includes how the project fits into existing products, who the users are, and what they're trying to accomplish. You can use user stories to communicate this information, but it's not mandatory as long as the user's needs and limitations are clear.

Instead of telling the developers exactly what something ought to do, you should first explain to them why. Because when you haven't managed to think through all of the edge-cases (and you haven't until you start coding), the developers won't need to ask you about every single one. Enough context enables the developers to act independently, removing many rounds of feedback loops. It also means when you do need to answer questions, the questions will be more well-informed.

## Prototype
Although the solution isn't the most important part of the handover, if you've done some thoughts about the solution - you should absolutely share them.
A great way to do that is share a prototype that demonstrates your proposed solution thoughts. This can range in fidelity from sketches and bullet points to interactive user interface prototypes, or Excel-based prototypes demonstrating the functionality.

A great thing about prototyping, especially using tools like Excel is that it also helps you shape your thinking about it. If you're trying to replicate the logic you want, but you can't quite express it - perhaps it's because you haven't quite covered all the edge cases in your mind.

Don't go overboard with the prototype. If you're working with higher fidelity stuff, you might not need to finish more than 50-60% of it. Use it as a tool for discussion and further collaboration, not necessarily the holy grail developers should replicate.

## Spotting Rabbit Holes and Risks

Before you hand over a project, you should have a think about any risks and "rabbit holes." Rabbit holes refer to situations where there are technical unknowns or unsolved design problems that can significantly extend the project's completion time.
By being up-front about the things we don't know yet, we can spark the discussion about how to handle those things early on.

Expect that the developers might have their own assessment of risks and rabbit holes, based on the underlying program architecture, or challenges we haven't faced before.

## Explicitly Identify What You're Not Doing

Clearly outline what you are not tackling in the project proposal to set boundaries and prevent developers from spending time on unrelated tasks. This clarity will help developers understand where their focus should lie, and where rough edges are accepted.

## Create an Artifact

A good handover should result in one or more artifacts that captures relevant information at a high level. A prototype you've developed or you're collaborating on is one such artifact.

Regardless of whether you have a prototype or not, you should also seek to create a document explaining the high level problem and solution proposal.
You can create this document yourself or in collaboration with an engineer, while talking through the problem.
Producing a document while talking, also helps to clear up any potential misunderstandings, as you'll need to agree what's written on the page. 

The purpose of these artifacts are to serve as a reference for both you and the developers, allowing you to make adjustments and corrections when necessary. A shared, collaborative document is ideal as it enables developers to ask questions, and you can edit the document to provide answers.

---

When working with software developers, the key to success isn't in writing detailed specification. It's to empower the engineering team to understand enough of the problem and the proposed solution, that they can work independently, and only need to clarify major questions with you. The more developers can work independently, the less time you need to spend talking back and forth, and the higher the effective work absorption rate of the project is. Communication is important, but communication on the problem is much important than communication on the exact solution.
