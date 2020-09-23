---
title: "How To Work Efficiently With Pull Requests"
permalink: "/efficient-pull-requests"
draft: false
short: |
    Describes an efficient way of doing Pull Requests called the two pass pull request
---

I've experimented a bit with different kinds of pull requests during the years - and I think this way of doing them is the Two Pass Pull Request. I like to name it that - because there's one pass made by you, and one pass made by the reviewer. Let's take a look at how, and why, it works.

First Pass
==========
You've branched out, made some changes and you're ready to get them merged in.
The first thing you do is to create a Pull Request just for your eyes - a Draft PR.
You can do this by marking the PR as a draft or prefixing the title with _[WIP]_.


Make sure to write a good, but short description for the PR. Explain both what changes have been made and why. This will help both the reviewer look at the changes, but will also help future-you when you look back through the history.

The description should also describe how the reviewer can validate that the code works as it should. This can be as complex as "Do X and Y, and then validate that Z happens", or it can be as simple as "See the tests"

After you've created the draft PR, this is your time to go through it and make sure your code is up to snuff.
Go through each file. If something needs changing, change it immediately before moving onto the next file.

Things you might want to look for / change in the code
-   Remove any code you've commented out instead of deleting
-   Change names so they're descriptive
-   Refactor code if necessary
-   Add comments to code that are not self-explanatory, such as complex workarounds or reasons WHY some code does what it does


While reviewing the code, there's a few other tasks you might want to do:
-   Update the PR description if you've made more changes than you first thought
-   Leave thoughtful comments for your reviewer. If you've moved some stuff from one file to another, git will mark it as added/deleted. If you leave a comment saying "Moved to X" you save the reviewer from wondering why something was deleted and then having to review the moved code.

Unless you've made large changes, you don't need to check the PR again.
You might have missed a few things, but that's fine. It's hard to keep re-reading the same PR without just skimming over it, so it's not worth the time. Anything you've missed will be caught in the next pass.
After this first pass, you've looked at the Pull Request, and made any changes you needed. This Pull Request is now no longer a draft. Remove the [WIP] or draft status. 

Second Pass
-----------
This is the second pass - by someone else than you.[^0]
Inform the reviewer about the PR, either through a direct message or through tagging them as a reviewer.

The reviewer will look at the description, and validate that the code works as it should, based on the description.
After that, the reviewer looks at the code, to find errors or possible refactorings. There are many articles describing what a good review is, so I'm not going to recap them here.

The reviewer should leave comments/suggestions that are detailed enough, that y
ou can resolve the issues without asking them for further clarification.

The reviewer should write what is needed for the pull request to be approved. This can range from: _"You can merge this in once you've fixed X"_ to _"I'd like to discuss X with you before we merge this in"_
Azure DevOps has a handy "Approve with suggestions" feature, that essentially makes the reviewer say "I can approve everything here as is, but I have  some suggestions I believe you can handle yourself".

Sometimes the reviewer might suggest changes that mainly differ in style, rather than substance, often phrased as _"This is good, but if it was me, I would change it to X instead, because Y."_
In these situations, you decide whether or not to go with the suggestion - it is an optional suggestion. It can be beneficial to prepend such comments with a pre-approved-upon word that clearly states that it is optional, such as "optional" or "nitpick".

After the second pass, you can go through your PR and fix the issues that the reviewer has flagged. If the issues are small enough and the comments are good enough, you should be able to do this without asking the reviewer again.

However, if there are comments that are hard to understand, you disagree about something, or there's something you need to discuss about how to best solve - you should answer the comments, or reach out to the reviewer so you can find a proper conclusion.

When you think the issues have been resolved, you merge the PR into the main branch yourself. The reviewer never does it for you.

[^0]: If you're working solo on a project, the second pass can also be done by yourself after letting the PR lie for a few days. It's remarkable how many of our own mistakes we spot with fresh eyes.