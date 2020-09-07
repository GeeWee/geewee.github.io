---
title: "4 Things I wish I had known before starting my first larger project"
permalink: /4-things-before-large-project
---

Recently we created a placemat game-controller and a game for a university project. The goal was to help users eat slower in an engaging way. These are the four things I wish I had known before starting.

<div class="yt-div">
<iframe width="720" height="500" src="https://www.youtube.com/embed/-kpaPoEZ8UM" frameborder="0" allowfullscreen></iframe>
</div>

We had five weeks to build it and we ended up with a codebase a little larger than 6000LOC, which is not a lot by industry standards, but it was our first larger project. Reflecting on the project, here’s a few things I wish I had known before I started this project.
### 1. You can’t just “wing” concurrency.
A few days before we needed to demo the game, it suddenly started crashing a few minutes in, every time. The issue turned out to be a race condition in some code we had written weeks previously.

Concurrency is tricky especially because you can write something that works just fine for weeks or months, and when things stop working, the first place you start looking is where you've changed things recently. You don't necessarily start looking at old code, because it worked fine before, right? Concurrency demands respect and careful planning.

### 2. Inconsistent errors
Having never used multiple threads in anything but the simplest of applications, I have never had to solve a thread-related bugs. We had errors that generally happened around the same place in execution, but not at the exact same place. After some errors the program kept running for a little while before failing completely. In hindsight these are telltale signs that these were errors stemming from misuse of threads.

### 3. Refactoring saves you more time than it costs.
In our game we started up with one class that held all behaviour for the levels. As we added functionality that was only present in one level, we would turn the behaviour on and off with booleans for different modes.

The cohesion of the class started to crumble. At one point for every hour we’d spend adding features, we’d spend another one hunting down bugs. We finally bowed our heads and refactored the class into multiple classes. We should have done that a lot earlier.

Software changes. Sometimes adding a new feature just requires this little hack to make it work. There’s a value in efficiency, but hack upon hack leaves you with a codebase you can’t comprehend. You can’t modify codebases you can’t comprehend. Refactor as soon as you see that your needs are no longer met by the current way the program is designed. It’ll save you time in the long run.

### 4. Making a game is a lot of work
This was the first game any of us made, and it was a lot harder than we thought it’d be. There’s a lot of different things to consider. Handling user input and giving the user feedback is complex. It has to be quickly understandable, and it also has to *feel* good. We didn't end up with a completely satisfying result even after working on it for a long time.

You also have to strike a balance between making the game so simple that the player can pick it up quickly, but also complex enough that it doesn't get boring.

There’s also quite a lot of graphical work. If you’re creating a game, postpone the graphical work until the end. Otherwise you might end up spending a lot of time polishing something that won’t make it to the final iteration. I know we did.