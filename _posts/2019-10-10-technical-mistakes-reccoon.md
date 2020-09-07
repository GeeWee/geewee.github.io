---
title: "The 3 technical mistakes we made while building our startup"
permalink: "/reccoon-3-technical-mistakes"
short: "Looking back at our failed startup Reccoon, we made a bunch of technical mistakes, that meant we weren't able to execute as succesfully as we'd like. Here are the three major ones."
draft: false
---

A few weeks we shut-down our startup Reccoon, a startup building waste management software for small-to medium sized waste haulers. We've learned a lot about the business-side of startups, which I've written about [earlier]({% post_url 2019-10-09-shutting-down-reccoon %}), but we've also made some mistakes while building the actual product. Some of these mistakes surprised us in hindsight, but some of them are “classic” mistakes, that we should have avoided but, for one reason or another, didn't. Let's jump into it.

## 1) We Didn't Build an MVP
When you're primarily a technical founder team, you're probably really eager to start building things. But hold your horses. Startups aren't about building shiny things, they're about solving problems.

While we *knew* that, we just, really *liked building things* y'know? So naturally, as soon as we *thought* we had a problem worth solving, we went all in. We spent many months building a full-fledged product.

If we instead had narrowed our scope and presented it to users quickly to get feedback, we would have been in a much better spot.

The question you should be asking yourself is “How can I solve this business problem with the *least* amount of technology?” Working with this question in mind, hopefully you'll be able to get quicker feedback, and counteract the natural tendency some of us might have to just keep building.

## 2) We chose the wrong technology
After some long talks about how to build Reccoon, we chose to create a Single Page Application, as some of our workflows were pretty complicated.

We had some forms with autocomplete which depended both on values in the database, but also on other values in the form. They were complicated enough that building them in jQuery could get messy, which is why we settled on a Single Page Application.

This was the wrong choice. Perhaps only 2-3 of our forms were bordering on being too complicated for jQuery, but most were not. We should have chosen the simplest solution, server rendered templates with a dash of JavaScript. For the complex parts, we could always have selectively pulled in technologies like [React](https://reactjs.org/), [Vue](https://vuejs.org/) or [Stimulus](https://stimulusjs.org/).

It probably wouldn't have been as nice to use, but nobody thinks “Well this doesn't really solve a problem I have, but it sure looks sexy! I'll buy that.”

Sleek design and user experience is the frosting on top of the cake. You should add it last.

## 3) We spent too much time on code quality
This was it - our chance for an awesome greenfield project. No legacy code or design decisions we didn't agree with! This time we were in charge - and we were going to do it *right!*

We spent time writing tests. Lot of ‘em. Our backend had a test coverage of about 90%. Which was great, except six months in we realize that we've implemented a major feature wrong. As in “delete most of it and rewrite it” wrong. 90% test coverage doesn't matter when you're testing the wrong thing.

Our front-end testing story was much pragmatic. We wrote a Quality Assurance checklist: “When releasing, do these things in this order, and expect these things to happen”

This took about an hour to complete, tested both the frontend and the backend, and the integration between them. In the start, this should have been the majority of the testing we did. Combine that with a few extra integration tests, and unit tests for things like scheduled jobs, and you're good to go.

## Summing up
Early phase startups aren't the time to go bonanza writing lots of code, because there's a chance you might have to pivot multiple times - and then most of the code you'll have written is going straight to the garbage. Write as little as possible.

They're not the time to chose shiny new technologies either. They're the time to choose the simplest, and most productive technology you can get away with. Often that's older technology, that's stood the test of time.

The code you do write shouldn't be polished. Come back and refactor it, when you're sure you've built the right thing, for the right problem. Because in the end, most startups aren't about shiny tech or pristine code, they're just about solving problems.

