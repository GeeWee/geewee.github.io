---
title: "Flags are bad API design"
permalink: '/api-design-flags-are-bad'
---


At [Climatiq](https://climatiq.io/) our core product is an API.
That means we spend a lot of time discussing what good API design is. While APIs are primarily meant to be used by computers and are allowed to be a little cumbersome, you still want the person who has to read the documentation and implement the API to have a good time. That means caring about having understandable documentation where you can find what you're looking for. It also means designing your API in a way that it's easily understandable and leads users into the [pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/). 

We've had some discussions about how API endpoints can satisfy different several real use-cases at once, and whether flags are a good tool.
By flags, I mean boolean parameters you send to the API along with your request to change its behaviour.

I want to show you how adding flags leads you down a dark and dangerous path.
Let's take the fictional example of an API that "find the best restaurant within the region you specify" as an example.

Perhaps you'd send it a request like this:

```json
{
  "restaurant_type": "pizza",
  "region": "Within 5km of my home"
}
```

So far so good! But let's say that you can't find any pizza restaurants! And a user says "well okay fine if I can't get a pizza restaurant give me anything - I'm hungry!"
So you add a flag!

```json
{
  "restaurant_type": "pizza",
  "region": "Within 5km of my home",
  "allow_other_types_of_food": true
}
```

Alright! So now you can get a French restaurant if there's no pizza available! Yay!


Not so fast! Some users live in the countryside, and there are no restaurants close to them at all!
They're still hungry though - maybe you can just find the closest restaurant if there's nothing available?

So you add another flag.

```json
{
  "restaurant_type": "pizza",
  "region": "Within 5km of my home",
  "allow_other_types": true,
  "allow_a_bigger_region": true
}
```
Okay! So now the problem is solved right? Well, not quite. Let's take a few looks at what's wrong with flags using this API as an example.

## 1. Flags are hard to explain
The first thing is probably quite subjective, but I think API's that use multiple flags are harder to explain.
Your API doesn't "find the best restaurant within the region you specify" anymore.
It now "finds the best restaurant within the region you specify or a bigger region or another type of restaurant if we couldn't find the first one."

Perhaps this is a small thing, but as you continue to add functionality, the water gets murkier. Things that were once clear and easy to explain become harder and harder.

## 2. Flags don't compose well
Flags have the issue that they don't compose well. What happens with the above call if there's a pizza restaurant 8km away, but a French restaurant 3km away?
Will it expand the region first or show you different types of restaurants?
Based on the API call alone - you can't tell.
That's not great design. You can't make everything understandable by only the API calls, but hopefully you should have some idea of what it will do based on the call alone.


## 3. Flags don't evolve well 
With two flags you already have four states your API has to take into consideration.
With each new flag the amount of states doubles.
If in a month or two a user tells you they're okay seeing closed restaurants if they open within 30 minutes, so you add another flag, such as `allow_restaurants_that_open_soon`.

Now you have eight states! This means there's lots more for you to test as an API developer.
Each new feature you build in that's not a flag has to be tested in eight different configurations.

It's not only bad for the implementor but also the user. We've already demonstrated the problems understanding just how two flags interact - imagine how hard it is for users to understand what your API does when you add yet another!

---

Flags aren't always bad, but they need to be used with caution for the reasons above. You can't always foresee how your API will evolve, but if you ever feel like you can solve your problem by "just adding another flag" - you'll end up in a tight spot with time.

As a parting gift, let's look at some other way the above API can be implemented without flags that solves the issues.

```json
{
  "restaurant_type": "pizza",
  "region": "Within 5km of my home",
  "if_none_found": ["expand_type", "expand_opening_hours", "expand_region"]
}
```

Here we supply a prioritized list of ways to handle the fact that that nothing's been found! This means it's obvious what has an effect on eachother and how the precedence interacts. First we try expanding the type, and if that doesn't work, we allow for restaurants that open soon.
If all else fails, we expand the region we're searching.

That's one way. The other is simply to return a good error that the user can programmatically handle. The beauty of designing APIs is also that you don't have to do all the work yourself, but the user can implement logic on top of your API.
While APIs are meant to be understood by humans, they're used by other programs, and it's okay to delegate some logic to your users.