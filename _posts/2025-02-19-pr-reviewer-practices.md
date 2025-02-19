---
title: How I Review Pull Requests
short: |
  An unstructured list of things I do while reviewing pull requests
---
I've written quite a bit about pull requests before - covering everything from [how thoroughly you should review a pull request]({% post_url 2023-01-19-how-thoroughly-to-review %}) to strategies for [avoiding being blocked by waiting for reviews]({% post_url 2020-09-23-how-to-not-get-blocked-while-waiting-for-code-review %}) and making your [PR faster to review]({% post_url 2020-09-22-4-ways-to-make-your-prs-faster-to-review %}). This post builds on those, focusing specifically on what **I** do when reviewing PRs.

I spend a fair amount of time reviewing code, and I'd like to think I'm both reasonably fast and thorough. Over time, I've developed some habits, that I think make this more efficient. Not all of these habits might be relevant for everyone - we're all wired differently in our brains.

I also recommend checking out [Google's Engineering Practices](https://google.github.io/eng-practices), which provides a short, pragmatic take on code reviews.

## Read the PR Description First
The first thing I do when reviewing a PR is read the description. A good description should explain **what** is being changed and, more importantly, **why**. If I don't understand the intent behind a PR, I can't judge whether it's the right change to make.

A test I often use: if I revisit this PR in six months, will the git history tell me what I need to know? I prefer all relevant context to be included directly in the PR description rather than relying on external issue trackers like Linear, Jira, or GitHub issues. Git logs don’t decay over time, but if your company changes issue tracker - good luck finding out why the changes described in `JIRA-3481` were made.

If the PR description isn’t clear or doesn’t justify the change, that’s my first point of feedback. I also often check whether the code aligns with the description, and provide feedback on that.

## Keep a Notepad
While reviewing, I almost always have somewhere to jot down thoughts and questions—things like:

- "I don't understand how X works with Y."
- "This is different from how we normally do X - why?"
- "What happens if the user provides input X?"
- "This looks tricky - how well-tested is it?"

Mostly I keep these as a list in a separate text file. This helps because questions you think of, often aren't answered until later in the PR. Writing them down means you don't have to worry you'll forget them.

Once I finish reviewing, any unresolved notes become comments for the author—ranging from clarifying questions to suggestions for improvement.

## Some PRs Are Quick to Review

Not all PRs require deep scrutiny. Some are quick to review, especially if they involve:

- Small refactor-only changes (especially if no tests are modified).
- Renaming things across the codebase, e.g., renaming `energy` to `electricity`, streamlining capitalization or similar.
- PRs that only add additional tests or logging.
- Bugfix PRs that involve minimal changes and come with a test.

When a PR is well-scoped and self-contained, it can sometimes be reviewed in minutes.

## Some PRs Need to Be Split Up

PR review time scales exponentially with size. If a PR contains multiple unrelated changes, I have to manually untangle their interactions, which takes significantly more time. I often request that PRs be split, especially if they mix refactoring with feature work or if they are difficult to review in a single pass.

Spending the time as an author to split up a PR, can improve the overall time to ship, because the time you spend is often less than the extra time it would take your reviewer to review the larger PR.

## Pay Extra Attention to Module Boundaries
Code generally have parts that are public, and parts that are internal. You can consider the public part the "module boundaries": The parts where the module interacts with the outside world.
The module boundaries could be an end-user-facing HTTP API, or simply the methods your particular module exposes for other code to interact with.
Often, getting the module boundaries right is more important than getting the internal details perfect. If a module boundary is well-designed and its implementation is properly tested at the level of the module boundary, it is often easy to refactor the internals later if needed.

When reviewing module boundaries, I pay particular attention to:

- How easy it is to use from the perspective of other developers or API consumers.
- Whether the type system could enforce constraints that are currently left to developers to uphold manually.

## Evaluate the Author & Module Match
The level of scrutiny I apply depends on both **who wrote the PR** and **which module it touches**.

- If the author is experienced and has a strong track record, I will probably still comment on many things, but I will be quicker to accept their reasons for the way the code looks.
- For newer developers or those unfamiliar with a codebase or a module, I generally take a little more convincing that their approach is correct, and challenge them a bit more. Both because I can't take their good judgement for granted yet, and because I see it as a learning experience for them.
- If the author is the primary maintainer of a module, I often frame feedback as suggestions rather than things that must be fixed. They are the primary maintainer, so they often know best what constraints they are operating within.
- If the PR affects a critical or sensitive module, I generally invest more time in reviewing it thoroughly.
- If the module is experimental or still evolving, I'm okay with less than stellar code, since it will likely be refactored several times during development.

Based on the author, I also decide **when to insist on cleanup now vs. later**:
Some developers follow through on "I'll clean this up in a later PR," while others don’t.
For developers that reliably perform the follow-up, I'm generally pretty lenient about when cleanup appears, and for others, I normally insist on cleanup work being done in the same PR.

## Finding the Important Changes
Many PRs contain a mix of boilerplate updates and tricky changes. I generally start by skimming over the files and marking the boilerplate or irrelevant files as "viewed" so I can focus on the core modifications. If the author has left comments guiding the review, that’s always helpful.

Then I either start looking at the module boundaries or the tests for the given code, to get an idea of how the feature is used, before jumping into the implementation - but this is very much based on gut-feeling.

For complex PRs, I sometimes pull the code locally to explore it in an editor, but not that often.

## Things I Look for When Reviewing Production Code

Some issues are easy to spot with a fresh set of eyes—like leftover debug logs or unclear method names. Others require deeper thought. I generally focus on:

- When first evaluating a PR, I consider whether this code is performance-sensitive. If it isn't, I generally don't think too deeply about performance.
- Is there anything that's un-idiomatic or inconsistent for the codebase or the language? If so, I will generally ask for this to be corrected. I think conventions for how to do and name things are generally helpful, even if there are some I disagree with personally.
I generally think developers should err on the side of respecting convention, even ones they disagree with. I think having a sub-optimal convention is better than having no convention at all.
- I look at `//TODO` comments and often add a PR comment asking if we need to track this in an issue somewhere else, but I often leave it up to the developer if they think we need to.
- I try to pay particular attention to stuff that's not easily reversible, such as security issues, or bugs that would persist invalid data into the database.
- I'm a big fan of type systems, and if there is an invariant that needs to be upheld, I will often recommend relying on the type-system rather than relying on developer skills - we're only human after all. Examples of this could be using an ordered data structure for data that must be ordered, using a list that _cannot_ be empty, for lists that _should not_ be empty, and so forth.

## Things I Look for When Reviewing Test Code
I generally pay less attention to test code than production code. My main checks are:

- Do test names clearly describe what they’re testing?
- Do the tests cover both happy paths and unhappy paths that are either likely, or critical?
- Do they answer the questions in my notebook that I wrote down while reading through the implementation.

If the tests cover the key scenarios I was curious about, I make a point to mention it, so reviews don’t always feel like a list of negatives.

## Approve with Suggestions

In many cases, I like to "Approve with suggestions", or as Google calls it a [LGTM with comments](https://google.github.io/eng-practices/review/reviewer/speed.html#lgtm-with-comments).
That essentially means that I trust the author to correct the issues I pointed out. However, this depends on the fixes required, and my trust in the author to get them right without an additional review.
