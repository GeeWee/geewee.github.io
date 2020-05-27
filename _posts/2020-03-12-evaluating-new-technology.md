---
title: "A Checklist For Evaluating New Technology"
permalink: "/evaluating-new-technology"
draft: false
---
New technology often comes along with a lot of promises. All the hard things? They're *easy* now.
All of your troubles? *Shh, they're all better now.*

The reality is, of course different. New technology sometimes solve problems in wonderful ways, but just as often it doesn't live up to the hype.
It can be hard to determine whether something looks great because it solves a real problem or just because it's new and shiny. 

I work at [SCADA MINDS](https://www.linkedin.com/company/scada-minds/), a consultancy company primarily doing green-energy software projects.
We're in the process of streamlining how we evaluate when to adopt new technology.
We've created a checklist for evaluating the pros/cons of new technology and I've added my personal thoughts about each point.


## Does it solve a problem you're actually having *right* now?
Many goats have been sacrificed on the altar of "We absolutely need this in the future."

I've seen enough things we need in the future, never being needed at all.
[You ain't gonna need it](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it),
is as true as ever. Both for actual code, but also for new technology. 
There's a value in **defaulting to dull.** Go for the battle-tested un-sexy technologies until they fail you.
The best time to adopt a new technology is when you *need* it - not before.

## Does it come with any advantages?
New technology often promises many things that might, or might not, turn out to be true.
It might solve the simple cases, but have issues with the more complex scenarios you'll actually encounter
in daily life.

Of course, consider the advantages new technology gives you. Just keep in mind they are much fluffier and harder to evaluate than the
point above. It's always easier to evaluate whether or not the technology solves a problem you have currently, than how much
any "new advantages" are worth.

## Does it come with any downsides?
It's easy to only think about what you can get out of something new - but you often lose something as well. Does this new
technology lack integrations with the services you use? Is it opinionated in a way that doesn't align with how you already do things?
Is it really time-consuming to learn?
We should always consider both the downsides and the upsides of the new technology.

## Is it easily replaced?
If it turns out your bet on this technology is wrong - how easy is it to replace it? Is it contained in one part of your
application or does it leak into every part?
 
If you find a new cool in-memory caching library, there's a pretty good chance it'll be easy to rip out and replace with something else.
Libraries like that rarely leak into much of the code.

It's a little different if you decide to adopt a new web framework, a new database system or perhaps a reactive library
that'll be used everywhere. 
Things like that leak. They become entangled with every part of your application, and almost impossible to replace. 

Be careful when adopting things that are hard to replace. They're a lot more expensive to get wrong.

## Can it be evaluated quickly?
Some technology is reasonably quick to evaluate. If you're evaluating a new templating language, you can reasonably
quickly determine whether it'll do the things you need.

This isn't true for all technology though.
I know people who have favourably evaluated [Serverless]({% post_url 2020-01-14-serverless-or-not %}) frameworks and used
them for many months, only to run into some major scalability and pricing problems months down the road. 

The technologies you can evaluate in two weeks are mostly harmless. It quickly becomes apparent whether or not they'll work for you.
It's the technologies that you have to use for six months before you find the pointy edges that are dangerous.  


## Is the project/technology popular and well maintained?
There's a certain charm to being bleeding edge. There's less charm in being being stuck with a technology nobody uses and nobody can help you with.
When evaluating a project, check whether or not it's still active. Does it have many answered questions on StackOverflow?
If it's on Github - when was the last commit? Are issues resolved?

A project that isn't super active doesn't necessarily make it bad. However if you find a two-star project on Github that was
last updated in 2016 but promises you the world - you might want to tread carefully.  


## How mature is it?
New technologies often showcase very compelling happy-paths. Then you start tweaking it and everything falls apart.
Evaluating how mature a technology is, particularly in a field you don't know much about is hard.

I've used and evaluated a lot of ORMs, so I know some of the things that indicate if it's immature.
I know to look for how they handle migrations, what their transaction support is like and how they deal with lazyloading and complex queries.
I know this because I've used a lot of immature ORMs, and I've been bitten in the ass by each one of these things.

Being able to evaluate technology often comes with experience in a particular domain. That's how you know where the pointy edges are.
But you can often use age as a proxy for maturity. A technology that has been used and updated over two years, is usually
more mature than one that has only been out for six months.


## Can we scale this effectively inside the company?
This is probably more specific towards consultancies or teams that juggle many projects and technology stacks at once.
Sometimes there's a technology that solves a problem really well in your particular project, but which is really hard to understand or learn.

You might have a few developers that's proficient in it. However if you don't succeed in making these skills common-place,
you'll essentially end up with areas of your applications that only a few people dare touch. You're going to have a low [bus-factor](https://en.wikipedia.org/wiki/Bus_factor),
and you're going to have developers grumbling about *"that stupid thing that is way too complex for the problem it's solving"*

It's also worth keeping in mind that software projects usually live for years, and someone else might have to maintain them.
This means the time to learn something new will probably have to be paid many times over.
We should balance the rewards new technology gives us with paying the price of learning it many times over.


## Can it be maintained?
We often have to write code that our clients have to maintain in the end. When you know someone else has to take
over a project it can be important in writing something they can understand. If your client works primarily with Java,
they probably wouldn't appreciate a project written in OCaml very much.


## Can you afford it?
Does it have a permissive license both for development and production usage? If it costs money, are the potential
advantages worth the cost?