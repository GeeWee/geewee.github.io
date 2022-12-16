---
title: "What logic should you not implement in your API?"
permalink: '/api-design-flags-are-bad'
short: "Recently I've been spending a lot of time discussing what good API design is.
        One of the discussions we often have is 'should we implement this logic inside our API or not?'.
        This post tries to give an overview of what to consider when discussing this."

---

At [Climatiq](https://climatiq.io/) our core product is an API. That means we spend a lot of time discussing what good API design is.
One of the discussions we often have is "should we implement _foo_ logic inside our API or not?"


In most software that humans are meant to use, you need to give the users what they need.
This is particularly true with GUI software. If your GUI software doesn't do what you need, you're outta luck.
This story isn't quite the same for an API or other programmatic interfaces, as the user can often build the logic or functionality themselves.

In metaphor, a program with a user interface is a workshop you rent. It's got the tools it's got and if it doesn't have what you want - you have to ask the owner to change something.
Programmatic interfaces are more like a specific tool in your toolbox. You're free to combine it with other tools, and it doesn't need to do _everything_.

So we often need to consider - what should our tool do, and what tools should we rely on the user bringing themselves?
For that, I think there's a few key points to take into consideration:

## How many would use it?
It can be tempting to not implement some logic and just think "the user can do this". It's not a bad first take, however if you have a functionality that you expect a majority of your users would like to use, perhaps implementing it inside the API rather than forcing each user to create their own implementation would be in their best interest. Another approach is to shape your API so that this particular logic is easy to implement on the user side, perhaps by returning error messages the user can handle and take corrective action on programmatically.

If you're unsure such as when launching a brand-new endpoint - you can always wait and see how people actually use it in practice, and if many people implement this logic, perhaps it's worth doing on the API side. 

## How hard is it to implement for the user?
Some things are trivial to implement for the user - and some are downright impossible. Perhaps you perform some intermediate calculations that the user would need to implement this feature - but they never see.
Obviously if information that the user doesn't have is required to implement something then they can't do it on their own.
If you want to support this feature, you'll either have to implement the logic on your side or expose more information to the user so they can do it themselves. 

## How trivial is it to implement
The easier something is to implement, the more you should lean on having the users do it themselves. To demonstrate: You would almost never see a function like this:
```typescript
function getListOfSomething(whatToGet: string, sortReturnList: boolean = false): string[]{
    // Do things
}
```

The `sortReturnList` parameter sticks out like a sore thumb. That's an extra parameter you need to understand what does, and specify.
When the alternative is just not having the parameter and calling `.sort()` on the result afterwards, the `sortReturnList` parameter only makes things more confusing.

What you're essentially doing by taking trivial functionality like this and implementing it, is replacing the things the user already knows how to do, with a new way of doing it that they now have to understand.

## What are the performance implications
This doesn't necessarily mean that everything that's trivial to implement should be dumped on the user.
As you have access to more information and a faster connection to your database, there's probably a fair deal of logic you could implement in a much more performant way - an archetypical example could be aggregating over a lot of data.

This isn't equally relevant for all programmatic interfaces - but particularly remote interfaces where calls have performance overheads need to think about this. If you can implement something with one call that might take the users tens (or hundreds) that might be a good candidate for some sort of logic to move into your API


---

I don't think there's a cut and dry answer about when to include something in your API or not. Hopefully this will give you a few things to consider when you're making that judgement call.
And perhaps if you're still in doubt, it might be wise to exclude the logic for now until you have a better idea of the usage patterns. It's always much easier to build logic on top of things than it is to remove it later - that tends to make the people who used it rather angry.