---
title: "How To Not Get Blocked While You’re Waiting For A Code Review"
permalink: "/how-to-not-get-blocked-while-waiting-for-code-review"
draft: false
short: |
    You’ve made your awesome new Pull Request, but the person who has to review it won’t have time for several hours.
    While we all strive to review code as fast as possible, there’s always going to be delays.
    So what do you do while you’re waiting for that review?
---
You've made your awesome new Pull Request, but the person who has to review it[^0] won't have time for several hours.
While we all strive to review code as fast as possible, there's always going to be delays.
So what do you do while you're waiting for that review?
There's always the coffee machine, but if you're going to be hanging out there for hours, people might start asking questions like _"Why are you here all the time?"_, _"Is that much coffee healthy for you"_ and _"Please stop staring at me"_

Here's three ways to avoid those comments and keep working, while you're waiting for a code review

Work On Something Else In The Codebase
--------------------------------------
A good strategy is to always have at least two tasks you can work on - preferably tasks that have as little as possible to do with each other.
That way, when you're done with your first task, you can branch out from your main branch again to do some completely unrelated work.

Examples of this:
-   If your first PR was on the backend, start working on something in the frontend or vice versa.
-   After your PR, find a juicy bug to hunt down and fix. Generally switching between developing new features and bug-fixing works well.
-   Or just find another issue to solve that doesn't have any overlap in the codebase.


<div class="img-div">
<img src="{{site.url}}/assets/img/git-diagrams/simultaneous-branches.svg"/>
Here we see two branches branch out from main. When your first branch is ready for review, start the second branch and keep working.
</div>

To me this is one of the most effective ways to keep your velocity up, but it requires that you can juggle multiple tasks (and that there are multiple tasks to juggle)


Do Something Non Code-Related
-----------------------------
There's a lot to do in software development that isn't just software development. There's a lot of possible tasks we can do that don't have anything to do with the code. These tasks are perfect to spend time on while waiting for review. Some examples:
-   Answer emails
-   Review a pull request from someone else
-   Write documentation
-   Write or break down tasks
-   Help a co-worker with something


Or just take a break so you're ready to start working again afterwards.


Continue Working From The Same Code
------------------
Unfortunately it's not always feasible to do something else.
Sometimes there's only one thing to work on - and you have to base your work on the stuff you've just submitted in your PR.
You can branch out from the branch you're looking to merge into master.
This means that while you're waiting for the branch, you can simply continue working. You can then merge in the first branch, and later on the second one.

<div class="img-div">
<img src="{{site.url}}/assets/img/git-diagrams/branch-from-branch.svg"/>
An example of this workflow. When you're done with your first branch, you create a PR, but also a new branch, based on the first branch.
Then you can keep working, while keeping all your original changes.
</div>


Some caveats:
-   If you're expecting to get a lot of feedback in your original Pull Request, you will probably have to deal with some merge conflicts when merging your second branch in.
-   If you squash your commits when merging PR's in - this becomes quite a bit more problematic. You're going to have to do a few merges or rebases to make your second branch merge cleanly. However usually for large branches, this doesn't take more than a few minutes.

[^0]: More like _gets_ to review it, knowwhatimsayin?