---
title: "We're shutting down Reccoon - here's what we learned along the way"
permalink: "/shutting-down-reccoon"
short: "The post-mortem of our startup Reccoon. The journey, and the mistakes we made along the way."
---

Today I'm sad to announce that we're shutting down our startup [Reccoon](https://reccoon.dk).
Reccoon was meant to be the future of waste management software, but
instead it's going to be the past.

About a year ago
[Silas Roswall](https://www.linkedin.com/in/silas-roswall-0a2a587a/),
[Jeppe Reinhold](https://www.linkedin.com/in/jeppereinhold/),
[Carsten Bo Larsen](https://www.linkedin.com/in/carsten-bo-larsen-8b578712b/)
and I started building a platform for businesses to get easy trash pickup,
discover their environmental impact and how well
they were recycling. It was hard to get traction for that idea on two
fronts. Most businesses didn't want to spend very much time thinking
about their trash, and the waste haulers weren't actually able to
provide any sort of meaningful data, as they were either using pen and
paper, or using very old systems with no way to export the data.

Even in spite of the fact that the businesses weren't that keen, we
believed that the future of waste management was more transparency. We
thought that if the waste haulers could give their customers rich data
about their waste usage, the customers would want it.
So we set out to digitalize the waste haulers' workflow,
in an effort to make that data available.

We expected that we could replace the pen and paper that most of the
smaller waste-haulers used, and then when we had battle-proven technology,
we could scale up to some of the bigger players.

Here, about 10 months later, we never really managed to nail that
properly, so we've made the decision to shut down while we still have
quite some runway left.
We'd rather be in the lifeboats now than in the
Titanic when it hits the iceberg.

While we've done a lot of things right, we've also made a lot of
mistakes, and we think we have a pretty good idea of what we could have
done differently. A lot of these are common mistakes, but some things
you don't really internalize properly before you've been personally
scarred.

### We should have been very cautious of going into this market with this product

A lot of startups have the luxury of being in a position where
their product can be imperfect or crash, and nothing terrible happens.
We didn't have that luxury. In the worst case, if Reccoon didn't work,
we would leave millions worth of waste-hauling equipment doing nothing,
as they would be left without a plan for the day.

Something that changes the entire daily structure of a business is hard
to sell.
People are understandably hesitant to change all of their daily
operations. We also had a mismatch between the price we could charge,
and the onboarding costs of a new customer. Waste haulers have a lot of
unstructured, hand-written, data lying around: customer lists, when to
pick up what, etc.
Onboarding a small waste-hauler could take up to a
week of full-time work. That was way too much work for the price we were
able to charge.

It also turned out (perhaps not unsurprisingly) that many small
waste-haulers aren't particularly keen on technology. It was difficult
to find enthusiastic early-adopters. We did find a few, but our product
wasn't 10X better than the alternatives, so it was only a few we were
able to convince to give it a shot.

This brings me to our next mistake:

### We mistook politeness for interest
Through our entire process we've been very good at mistaking politeness for
interest. We had a strong network in the waste hauling industry, and
quickly managed to get a few customers that were willing to help us with
feedback during the development process. We called around, and found 34
companies that were "interested in hearing more".

It turns out they weren't actually interested at all. When someone calls
you and asks if you think that *NewShiny* would be cool, and if you'd want
to hear more about it in six months, it's much easier to say yes than
no. There's no commitment required by you, and even if you don't really
have the problem *NewShiny* is solving, that's a problem for future you.
So the solid interest we thought we had, was really just people being
polite, and us being okay with that.

Because we thought there was a lot of interest, we didn't spend much
time actually observing the users' current practices to look for
problems. Why would we? They'd already said that they were very
interested! We practiced user centered design, and interviewed users
multiple times, but it was only in relation to our proposed solution,
and not in relation to their current problems. Had we spent more time
with the users before looking into solutions, we would probably have
realized that their problems weren't that big - meaning the value we
could generate wasn't that big either.

Misjudging the interest had several consequences - we vastly
overestimated the market size for our product. It
turns out that most smaller waste haulers are perfectly okay writing
things in a spreadsheet or on paper notes, and they don't actually care
much to change it.

That just left us with a few more technology-oriented waste-haulers, and
the large haulers, which were the ones most prominently being limited by
the software they were using. But enterprises are cautious, the sales
cycle is long, and the data migration required would be immense.

Slowly, those 34 interested companies dwindled to less than ten, the
potential market had more than halved, and our prospects were looking
grim.

### We did the easy things instead of the hard ones
We were not a team that enjoyed sales. We enjoyed building things.
People have a tendency to try and do things they like, and avoid things
they don't. We were no exception to this. As soon as we thought we had
enough market feedback, we started building. A lot. We didn't pick the
simple, bare-boned technology that would let us iterate the fastest, and
test out things. No, we wanted to Do It Right™

We wanted a polished product with a wonderful user experience. We wanted it to be prettier
and nicer to use than anything else out there.

The final result was pretty good, but at what cost? We spent a lot of
time building a wonderful product, to find out that nobody really wanted
to use it. We told ourselves we did this because “we cared about the
users” - but in reality, we did it *because it was enjoyable*. We did it
because while we were building, we didn't have to do the things we
disliked. Startups are often about doing the hard things, rather than
the easy - and we weren't good enough at that.

### Moving forward
Creating a startup is hard and exhausting, and closing
one potentially even more so. It's not easy giving something your all
for months or years, and realizing that it's not enough. However, if
you've been doing it for a while and realized you're not going to make
it, stopping is bittersweet. You've failed - but at least now it's over.
Time to take a deep breath, reorient ourselves and figure out what we're
going to do next. Whether we'll split up or try to do something together
as a team - time will tell. Even though we're down right now, we're
still looking up, excited about the future.

*I'd like to thank
[Silas](https://www.linkedin.com/in/silas-roswall-0a2a587a/),
[Jeppe](https://www.linkedin.com/in/jeppereinhold/) and
[Carsten](https://www.linkedin.com/in/carsten-bo-larsen-8b578712b/)
for going on this journey with me, and [Oliver Nørregaard](https://www.linkedin.com/in/oliverrepenning/),
[Nils Alm](https://www.linkedin.com/in/nils-alm-andersen-b249581a/),
[Torben Falck](https://www.linkedin.com/in/torbenfalck/) and
[Jan Bodilsen](https://www.linkedin.com/in/jan-kroll-bodilsen-a5b79884/)
for telling us the things we needed to hear, even when they weren't what
we wanted to hear.*
