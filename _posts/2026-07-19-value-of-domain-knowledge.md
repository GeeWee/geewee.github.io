---
title: "The Value of Domain Knowledge in Software"
permalink: 'value-of-domain-knowledge'
short: |
  Something that I think is often overlooked by many software developers is the value of domain knowledge, i.e. understanding the industry you're in and the mindset of the end-users of your software I actually think that explicitly spending time to acquire domain knowledge might be one of the best uses of your time as a software developer.
---

Something that I think is often overlooked by many software developers is the value of [domain knowledge](https://en.wikipedia.org/wiki/Domain_knowledge), i.e. understanding the industry you're in and the mindset of the end-users of your software[^0].

I actually think that explicitly spending time to acquire domain knowledge might be one of the **best** uses of your time as a software developer for a few reasons:

- It allows you to act with significantly more autonomy. If you lack domain knowledge, it's hard to evaluate whether user-facing decisions are a good idea, so you'll have to get feedback from someone who does know.
If you live in a fairytale where all tasks are perfectly specified up front with no room for ambiguity this might not be a problem you have. For the rest of us, having domain knowledge allows skipping a lot of back and forth because you often already have the knowledge you need to make decisions.

- Domain knowledge is great when scoping new projects or features. Having both domain knowledge so you know what to build _and_ the technical experience to understand how to fit it into the existing product is a good skillset to have when figuring out what an MVP looks like.

- It's just plain fun. Getting to learn about a new industry and domain is one of the really cool things about building software in my opinion.

---

## Types of Knowledge

In my mind, you can split the knowledge required to be effective at building software into four (extremely coarse) categories: 

#### Foundational Knowledge
The foundational knowledge about how computers and their building blocks work. This could be about how processors work, about complexities of algorithms, client/server infrastructure, when and how to cache, etc.

This kind of knowledge is often something that's picked up via formal education, but can also be picked up via reading books, or sometimes by learning painful lessons on the job.
This kind of knowledge generally carries over across jobs, and is useful in almost all situations.

#### Stack-specific Knowledge
Then there's knowledge that's specific to your stack. How to make the best use of your programming language, what weird quirks or footguns it has[^1] or how to best make use of the framework on top of your programming language.
This knowledge generally carries over across jobs if you're using the same stack, but if you're starting over on a completely new stack you'll have to re-learn new stack-specific knowledge.

#### Product Knowledge
Next up is the knowledge about the product or service you're working on _right this moment_. This is generally always going to be job-specific and it means that when you switch jobs you'll always have to re-learn this.
Depending on how many products your company has, you might even have to learn this multiple times in the same job.

#### Domain Knowledge
Last is the knowledge about the domain your end-users are operating in. Personally I think domain knowledge is so broad that it's hard to define, but here's some examples:

- When working with wind turbine software it turned out to be really handy to know a lot about how wind turbines worked even, if I never had to interact with one physically.
I read the [Wind Energy Handbook](https://onlinelibrary.wiley.com/doi/book/10.1002/9781119992714) and actually ended up teaching a "Wind Turbine for Software Developers" course to other companies in the industry.
- When working with carbon emissions estimations at [Climatiq](https://www.climatiq.io/) reading the relevant standards, like the [Greenhouse Gas Protocol Corporate Standard](https://ghgprotocol.org/corporate-standard) about how carbon accounting works, helped me make lots of decisions much quicker than if I had needed someone to explain the relevant context to me each time.
- When I was doing a startup in the waste management industry we interviewed waste haulers, and actually also got to do a full work-day with one of them, to see what their day-to-day was like.

As you can see, domain knowledge can take many forms. The three example above cover physical/mechanical constraints, industry standards, and end-user behaviour / mindset.

In the end we're trying to get enough big-picture knowledge, that we can easily put ourselves in our users shoes and therefore make good decisions that takes them into account.

## How to learn domain knowledge

I think that we acquire the different types of knowledge differently.

I think it's fair to say that most of the product knowledge and stack knowledge comes from the day-to-day work.
When starting on a new stack or product, you might do some tutorials and read some guides, but afterward the learning comes naturally as part of the regular workflow.

On the opposite end of the spectrum, I think that both foundational knowledge and domain knowledge requires explicit "learning time".

This is because they often require stepping back from the task that's right ahead of us to look at the bigger picture.

While foundational knowledge is often something that you've been taught as part of an education, domain knowledge isn't, as it's well.. domain-specific.

Some ways to acquire domain knowledge is:
- Reading introductory textbooks in your domain
- Attending introductory courses in your domain
- Talking to end-users that are using your product.

I think many of us might feel we're too busy to take a step back and schedule time for getting the domain knowledge we need.
But we should take that time. It pays off in the long run.

[^0]: Depending on how large systems you're working with, you might have users of your software module, and those might have end-users. The distinction can get fairly blurry in large-enough systems, but let's consider understanding the final end-users along with any direct users, as part of relevant domain knowledge.
[^1]: [Python mutable default arguments](https://docs.python-guide.org/writing/gotchas/#mutable-default-arguments), I'm looking at you.
