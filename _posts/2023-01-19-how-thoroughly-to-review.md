---
title: "How Thoroughly Should You Review Pull Requests?"
permalink: '/how-thoroughly-should-you-review-pull-requests'
---

Reviewing pull requests can take a short time or a very long time, depending on the size, complexity and how diligently you go about it.
I don't think all pull requests demand the same level of rigour. If you have a skilled team and a high level of trust, I think  you can leave it up to the author to have an idea of how thorough a review needs to be, and communicate that.

I think most of us have tried to send off pull requests where we're uncertain if our understanding of the problem or solution is right.
We've probably also tried the opposite where you're sure what you're doing is right, and you've spent significant time thinking about edge cases.

The amount a reviewer ought to spend on the pull request in the first case is probably significantly higher than in the second case.

With that in mind, I propose a taxonomy of review thoroughness. When submitting a pull request the reviewer can ask for a specific level of thoroughness. The requested level should be considered the minimum level of thoroughness and the reviewer should be free to be more thorough if they have time or decide it's warranted.

Let's go through the different levels, from least time-consuming to most time-consuming.

## Comments-only review
An author might not be ready with their entire implementation, but partway through they might already have some things they know they're unsure about.
If so, they might ask for some answers to specific comments, or a "comments only review", where the reviewer doesn't look at the entirety of the code, but only answers specific comments/questions the author has left.

This type of review is a bit of an outlier as it generally doesn't end in an approved pull request. However, it's a great tool in your toolkit. Asking for a "comments only" review while working on something else is generally a good strategy.
By the time you're done with whatever else you were working on, you will have gotten outside input allowing you to continue your work.

Even for the other types of reviews, it's also a good habit to add comments to your pull requests to [guide the reviewer]({% post_url 2020-09-22-4-ways-to-make-your-prs-faster-to-review %}) and highlight things that you'd like them to pay extra attention to. 


## Skimming
The first and quickest level of reviews that can actually end in an approval is "skimming".
It consists of reading through the code in Github or your diff UI of choice and seeing if anything catches your eye.

The sort of feedback skimming normally results in:
- "There's a smarter way to implement X method"
- "Have you tried using X method from Y library here?"
- "There's an edge case here - are we sure we handle that correctly?"
- "The tests you've written here fails to cover this edge case"

Skimming explicitly doesn't look at anything but the diff, so it generally won't be able to give feedback like:
- Is this refactor adequately covered by our existing tests (under assumptions that the tests haven't been changed)
- How does this feature or modification fit into the larger picture?

Skimming in general is useful for
- A first look at a large PR if you expect multiple rounds of reviews
- If you have someone who is proficient with the given tech stack but not necessarily the codebase in question.
- Changes to non-critical systems, or where the author has a large amount of confidence that the changes fit well into the big-picture


## Regular
This is the level of thoroughness where you not only look at the changed code, but also that everything fits well into the big picture. Generally this includes checking out the code locally so you can jump between methods and look at more code than just the diff.
For code with UI it will generally also include running the code and trying out the new interface, perhaps also trying to break it for a few minutes.

In a regular review you would consider these things (in addition to what you considered in skimming):
- Are there any pieces of logic already in the codebase that the reviewer is re-implementing
- Does the code fit well into the rest of the code in style?
- Should new abstractions be created in light of the new additions?
- Is the refactoring or features adequately covered by tests?


Regular reviews take longer than skims. Pulling down the code and trying it out takes time. Ensuring things fit into the big picture also takes more thought and time, especially if the reviewer isn't as familiar with the given codebase.


## Thorough
Thorough reviews are for critical or security-related code. It's for code that's extremely important to get right for one reason or another, and should probably be used sparingly.

A thorough review essentially does the same thing as a regular review, but spends longer on it. It might consist of:
- Thinking of edge cases, and actively trying to see if you can provoke or exploit them
- Seeing if some feature or functionality needs to be implemented in other files or subsystems
- Spending time attempting to break a user interface
- Considering whether or not this code comes with a heavier maintenance burden than usual and strategies to mitigate it.
- Trying out webpages in different browsers
- For performance critical code, comparing or creating benchmarks and providing suggestions for more performant implementations

---

As you can see, this isn't a hard taxonomy but rather a sliding scale that depends on both the reviewer and the reviewer of the pull request. A few examples where it slides:
- If the reviewer is intimately familiar with a codebase or subsystem, there might not be much difference between a skim and a normal pull request, as skimming for this reviewer would be enough to determine how everything fits into the big picture
- If you're building an entirely new codebase skimming and regular reviews also become much closer, as all the context needed is inside the diff view
- If you have comments and questions about specific parts of your code, the review of those parts might become more like a thorough review, even if the rest of the review is skimming or regular.

Even if this is a rather fluid scale, I still think it might serve as a sensible starting point to adjust your expectations and communicate what sort of review you're expecting.

I'm not sure what should be the standard level of thoroughness. We do have some scientific studies that say you need to be rather thorough for code reviews to catch all of your defects, but I think the cost-benefit analysis probably varies depending on the tech you use, the area of the codebase, your test coverage and the criticality of your systems.

Anecdotally most pull requests I perform are skimming with diving into a "regular" level of thoroughness only for a few files here and there where I don't have enough context based on skimming. Personally, I rarely dive into thorough reviews unless it's very critical or security-related code.

