---
title: "4 Ways To Make Your Pull Requests Faster To Review"
permalink: "/4-ways-to-make-your-pull-requests-faster-to-review"
draft: false
short: |
    It can be frustrating to wait for someone to review your pull request.
    While everyone is interested in pull requests getting reviewed as fast as possible, reviewing code takes time.
    Here’s 4 ways to make your pull request as easy to read, and as fast to review as possible.

---

It can be frustrating to wait for someone to review your pull request.
While everyone is interested in pull requests getting reviewed as fast as possible, reviewing code takes time.
Here's 4 ways to make your pull request as easy to read, and as fast to review as possible.

# 1. Keep It Short

Pull Requests that are shorter, are much faster to review.

The shorter your pull request is - the better:
-   It's easier to think through each change and how it interacts with the other changes. This means the review process will take less time.
-   It takes less time to review. While a short PR can be done when you have 20 minutes of downtime, a longer one might require finding several hours in the calendar.\
    Which one do you think will be looked at faster?
-   Studies indicate that shorter PR's lead to finding more issues - if your PR has 300 lines, the reviewer will read them carefully, but if it has 2000 they will skim it.\
    Shorter PR's make the reviews more impactful

# 2. Split Your Changes Up

To keep pull requests short, you'll often need to split the work you're doing up into multiple pull requests.\
While working, you might spot something that needs to be refactored, or a rename of a field that will touch many files.

Don't make the changes directly in your branch[^0] - instead:
1.  Branch out from main again and do the refactoring
2.  Create a PR with the refactoring into main
3.  Continue work on your original branch

Instead of having one PR that touches many files, you'll have two isolated PR's. Each which does only one thing.

# 3 Write A Good Description
The reviewer has to understand what was changed in the PR and why. The easier you make this - the faster the review.

You should add a clear description that tells the reviewers what changes the PR contains and the purpose of them - sort of like an introduction to the code.
This description can also help future-you. When you're looking at that code in six months, good commit messages and pull request descriptions are invaluable.

If anything needs to be manually tested by the reviewer to ensure that it works, make sure to  also include a short description on how the reviewer can test this. In complex cases, it might also be beneficial to describe what result the reviewer should expect from running it.

# 4. Leave Comments For The Reviewer

It's okay to write comments in the PR for the reviewer. 
These comments can be used to proactively describe file moves or other things, you might expect the reviewer to ask questions about.
Note that these comments are different from comments you'd normally leave in the code. They're codes that might not be relevant in six months, but which are relevant when the reviewer is looking at the code now. Examples could be:
-   When you've moved part of a file to somewhere else, leave a comment. This way the reviewer doesn't have to wonder why git has marked something as deleted, when in reality it has just moved.
-   When choosing a solution that doesn't seem obvious at first glance, you might want to note what other solutions you've tried and why they didn't work.[^1]

---

Doing all of these things might seem like extra work, but most times the 10 minutes you spend on creating a good, reviewable PR, are saved in terms of less back and forth with questions and discussions between you and the reviewer

[^0]: Definitely do make the changes though. Boy Scout Rule and all.
[^1]: Depending on the issue, this might actually be worth having as a code comment.