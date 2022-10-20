---
title: "Defending your time"
permalink: '/defending-your-time'
short: |
    I've been working with rust at for a little more than a month now.
    Here's my first impressions, from someone who's never seriously worked with a low-level language before.
---

Recently at my company [Climatiq](https://climatiq.io/) we had discussions about time management. Many people seem to feel like they have too many meetings, and too many notifications.
I don't really feel like I have any of these issues. I've dug down a bit and looked into some time-management, or time defence strategies I use, and tried to formulate them.
I don't work a full 37-40 hour work-week, so I have to be even more careful about how I use my time, as every hour counts.

A lot of these strategies, particularly the meeting-related ones, assumes you're doing creative or deep work which requires focus time, and might not apply if you're the one creating the meetings.
The old Paul Graham blog post about [Makers Schedule, Managers Schedule](http://www.paulgraham.com/makersschedule.html) is still as true as ever, and is a short, great read for an introduction to the different types of work that exist.

## General strategies
### Don't spread yourself out too thin
Humans only have a limited capacity for doing things and keeping context in their heads. You have an even more limited capacity for doing things well.
While I personally have many areas of my work I'd be interested to participate in, such as strategy or sales, I've narrowed my focus down to two major areas and I try to avoid not participating in any other areas.

If I can see that I have enough areas that demand me, that I stop performing well in some of them, I prioritize and drop some areas.

The thinner you're spread, the more you'll have to remember, to context switch, to give status updates etc. There's a cost to being involved in different areas, and it's greater than just the work you have to do.

### Have a start-of-day tab list
Every day I start my work by opening the same few tabs, such as my mail, an issue tracker, our customer support tool, etc.
I stick all the tabs I have to use every day in a folder and right click and click "Open all in tabs" every morning.

<div class="img-div">
<img src="{{site.url}}/assets/img/defending-your-time/startup-tabs.png"/>
The tabs I open every morning.
</div>

It's my way to start the day - these are the things I need to go through during the day - and preferably in the morning to get it out of the way.
If there's something you have to remember to do every day, sticking it into these startup tabs works wonders.

### Cultivate no sense of urgency
I think to some extent the feeling of urgency can be a little addictive. I have to respond to this quickly! I'm important! There are so many people who need my input!
While short bursts of urgency might _feel_ great, urgency is a horrible strategy for deep work.
How are you expected to get any deep work in, if you've conditioned yourself to check Slack every five minutes?

Fight hard to maintain the sense that _nothing_ is urgent. Turn of all notification sounds. People will survive without you, even if you only check your notifications or messages once every couple of hours.
This in turn frees you up to do actual, deep, work.

### Direct messages are a last resort
Of course, work also involves talking to other people. Sometimes you need their help or input before you can proceed with something.

If you need people, I don't think your first approach should be a direct message, such as Slack. It should be through your project management tool, for several reasons:

- You help _them_ not to cultivate a sense of urgency. More formal messages feel less urgent in a way that direct messages do not. Perhaps they're extremely focused and the pressure to respond to your message will cost them all the mental context they've built up.
- You get the benefit that when a message is in a more permanent place, and you have to wait for longer for a response, you tend to spend a little more timing crafting the message. Often in the crafting of a message, you come up with a solution to your own problem.
- You can find the conversation later. Generally searching through message archives if you need to dig up old context is extremely hard.

Of course, not sending a direct message means you'll have to spend longer time before someone replies to you. That's annoying, but it's also the whole point.
I've written a few strategies about how to avoid being blocked by waiting on others, in the context of software development - [check that out here](/how-to-not-get-blocked-while-waiting-for-code-review)


## Meeting Strategies
### Ask before booking meetings
A short meeting can ruin a good afternoon of productive deep work. Some guides recommend that you block off "focus time" where people aren't supposed to invite you to things.
I think that's a band-aid solution to a systemic problem that is "people just grabbing your time whenever they want"

I'm not the only one who thinks this - Basecamp notoriously makes it really hard to book meetings, by e.g. [limiting other peoples view of your calendar](https://m.signalvnoise.com/wait-other-people-can-take-your-time/).

I'm not sure that I'd go that far, but if you want to have a meeting with someone, write them a message first asking when's good for them.
Adding a little more friction to the process of creating meetings is great - and you might be able to find a time that doesn't disturb them in the middle of a block of focused work.

### Don't go to meetings where you don't care about the outcome
In some cases you're invited to a meeting. You might not be particularly invested in the outcome, but you do have some information and knowledge that might be worthwhile adding.
Write down your thoughts, and send them to the participants of the meeting beforehand, and then don't attend the meeting.

### Don't go to meetings "just-in-case we have a question"
Many meetings, particularly in large companies have too many participants. Sometimes you get invited to a meeting "just in case you know something", or "if they have a question that only you can answer."

Never attend meetings like this. In most of them you will have nothing to say, and you will have wasted an hour, god forbid two.
If there's something the other people cannot answer, they can get back to the people they're meeting after having conferred with you asynchronously later.

### Don't go to meetings "just-in-case you need to know this"
Some meetings are the opposite. It's where you're invited "just in case you might need to know some of this stuff".
Information densities in meetings are often low, so that's not a great use of time.

If someone wants to invite you for a meeting like that, ask them to instead note down the things that are relevant for you to know, and send them to you after.
Often the stuff that's relevant for you can be summarized in a few lines.

## Notification management

### Unfollow notifications & Cards
Notion that we use for issue tracking at Climatiq decides to send you notifications on every edit to every page you've ever touched.
This is a garbage system, and you should unfollow [cards aggressively](https://www.notion.so/help/updates-and-notifications#follow-pages).
You will still get notifications when someone e.g. tags you in a comment.

In general, do not be afraid to unfollow notification streams, and trust that people will pull you in when you're needed.

### Use your email as a notification center
Most tool suites has an integration with email, where it will send you email updates. I prefer using these, as practically no tool is as versatile as email, allowing you to archive, postpone, or save tasks for later.
This is invaluable for not forgetting things, or having a notification being marked as read by mistake, but before you've had time to act on it. 

<div class="img-div">
<img src="{{site.url}}/assets/img/defending-your-time/email-tabs.png"/>
If you get a lot of emails, make sure to let Gmail categorize them so the important ones float to the surface.
</div>

Along with this, I've found that practicing something akin to [Inbox Zero](https://www.techtarget.com/whatis/definition/inbox-zero) works extremely well for me.
Not necessarily the weird "check your inbox every hour also if there's ever a message in there you're literally satan", but the sort where you end up with an empty inbox every few days, because you've gotten through it all.

Anything that I don't have to act on currently is archived (The shortcut to archive a message and move to a new one in Gmail is `E`).
If a larger part of my job was  handling emails and notifications, I would pay for something like [Simplify Gmail](https://chrome.google.com/webstore/detail/simplify-gmail/pbmlfaiicoikhdbjagjbglnbfcbcojpj) without a doubt. Having great keyboard shortcuts for your email is such a timesaver.

### Snooze notifications aggressively
Often there's some conversation in Slack that you need to follow up on, or something you need to check, or postpone to the next day or week.
Instead of just relying on your heroism and memory, snooze the notification for when you have the capacity to deal with it.
If it's a mail, snooze it for a day or a week, and if it's a slack thing or another task the `/remind me about X next week` is extremely powerful for clearing your head while not forgetting something you think is important.

### Consider keeping a physical todo list
Along with that, I often keep a physical todo list. It's not structured in any way - I just write stuff down when I remember I have to do them.
Then when I've done them I cross them off.
Sometimes, perhaps every week or so I go back into the list and see what I haven't managed to get done. Then I either write it up again in the todo list if it's still relevant, put it into a more organized issue tracker or decide that perhaps it wasn't actually that important.

## Detaching from work

### No meetings after hours
To perform your best at work, it's important to also not work.
Knowing when to stop working and responding to messages is hard, particularly when you're in a remote setup, and not everyone has the same timezone or working patterns.
I have a "Not available" in my calendar after 16, that automatically cancels any meetings with the message "I'm normally not available, but if you absolutely must have me, write me a message."

This filters out almost every meeting where you're not necessary, and often the friction of messaging you is less than the friction of finding another spot.

### Keep your phone work-free
When you're not working, just like you're not available for meetings, you're _definitely_ not available for responding to messages.
Have no work-related emails or program on your phone. This helps build a culture of no-urgency, while it allows you to take time off with a good conscience.
You're not choosing to not respond - you simply don't have the ability to!