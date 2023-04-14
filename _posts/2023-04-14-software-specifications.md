---
title: "Crafting the Ideal Specifications for Software Developers"
permalink: '/software-specifications'
short:
    "At Climatiq, we practice a dual-track agile approach, dedicating time to discover and conceptualize parts of our product before implementing them in code. A colleague asked me about the best way to write a specification for the engineering team to effectively implement a conceptual design."
---

At Climatiq, we practice a [dual-track agile](https://www.productboard.com/glossary/dual-track-agile/) approach, dedicating time to discover and conceptualize parts of our product before implementing them in code. A colleague asked me about the best way to write a specification for the engineering team to effectively implement a conceptual design. The title of the post is a bit of trickery, because the ideal specification in this case is probably "no specification"[^0]. Creating a specification for a large piece of software isn't worth the time, and it's probably not even possible. Here's why:

## Code **is** a Specification

Code **is** a specification for what the machine should do. To write a specification thorough enough for a developer to implement it exactly, you're essentially writing the entire program. Historically, programming was viewed as a manufacturing activity - take in some specifications and spit out code. However coding is actually [primarily a design activity](https://wiki.c2.com/?TheSourceCodeIsTheDesign).

This means you can't craft a specification and just toss it over the fence. What you can do is give the developers the best possible conditions for performing this design activity.
You do that by ensuring they understand the problem. That leads me to my next point.

## Focus on the Problem, Not the Solution

The most crucial aspect of handing over a project to developers is providing them with the necessary context, such as how the project fits into existing products, who the users are, and what they're trying to accomplish. Communicate this information using user stories or another method that clearly conveys the user's needs and limitations.

Instead of prescribing exactly what something should do, you should first explain why it is necessary. By doing so, developers can act independently, removing many rounds of feedback loops and making the questions they ask more well-informed.

## Prototype
Though the solution isn't the most important part of the handover, you should share any thoughts you have on it. One great way to do this is by sharing a prototype that demonstrates your proposed solution. Prototypes can range in fidelity from sketches and bullet points to interactive user interface prototypes or Excel-based prototypes demonstrating the functionality.

Prototyping also helps you refine your thinking about the solution. If you struggle to express your logic, it could be because you haven't considered all the edge cases.

Remember not to go overboard with the prototype. If you're working with higher fidelity materials, you might not need to complete more than 50-60% of it. Use the prototype as a tool for discussion and further collaboration, not necessarily as the final blueprint for developers to replicate.

## Identify Rabbit Holes and Risks

Before you hand over a project, think about any risks and "rabbit holes." Rabbit holes refer to situations where there are technical unknowns or unsolved design problems that can significantly extend the project's completion time. By being upfront about these uncertainties, you can initiate a discussion about how to handle them early on.

Be prepared for developers to have their own assessments of risks and rabbit holes, based on the underlying program architecture or challenges they haven't faced before.

## Clarify What's Not Being Done

Outline what you are not tackling in the project proposal to set boundaries and prevent developers from spending time on unrelated tasks. This clarity will help developers understand where their focus should be and where rough edges are acceptable.

## Create an Artifact
A good handover should result in one or more artifacts that capture relevant information at a high level. A prototype you've developed or collaborated on is one such artifact.

Whether you have a prototype, you should also create a document explaining the high-level problem and solution proposal. You can create this document yourself or in collaboration with an engineer while discussing the problem. Producing a document during the conversation helps clear up any potential misunderstandings, as you'll need to agree on what's written on the page.

The purpose of these artifacts is to serve as a reference for both you and the developers, allowing you to make adjustments and corrections when necessary. A shared, collaborative document is ideal, as it enables developers to ask questions and you can edit the document to provide answers.

---



When working with software developers, the key to success isn't writing detailed specifications. Instead, it's about empowering the engineering team to understand the problem and the proposed solution well enough that they can work independently and only need to clarify major questions with you. The more developers can work independently, the less time you need to spend in back-and-forth communication, and the higher the [effective work absorption rate of the project will be]({% post_url 2023-03-22-rules-of-thumb-for-personal-project-management %}). Communication is important, but focusing on the problem is much more critical than dwelling on the exact solution.

[^0]: This doesn't apply for cases when e.g. a senior developer is breaking down tasks to help a junior developer, only for handing over larger projects.
