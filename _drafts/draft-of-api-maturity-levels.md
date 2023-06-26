```
# Thinking about Value in Calculation API's
- Here are my personal thoughts on how we should be thinking about MVP's and values.
- As we sell an API on a subscription basis, there's some things we need to take into account.
- Let's first introduce two axis' about how people use our functionality. These aren't a product of our API entirely, but rather the product of the use-case and the features we offer


## Continuity axis
- "How often do users need to call the API?"
- This is important because paying for an API subscription is a harder sell if they don't use it continuously, but only once every year as an example.
  - The higher you are on the continuity axis, the more obvious the value of your product as an API becomes.
  - However, selling annual subscriptions means that this isn't as terrible as it could be, because then people won't sign up for one month, do their reporting and then cancel. 
- This is primarily reliant on the use-case, and the worst possible use-case is probably annual corporate reporting where the company only needs to use the API once every year.

## Dynamicity axis
- "How varied is my input to the API, or the output?"
- The less varied the input and output is, the more the user will be asking themselves if they can't/shouldn't just replicate our calculations.
- If all you use Climatiq for is burning x litres of gasoline every day, do you really need an API for that?
  - However if you burn x litres of 6 different fuels over 15 different regions, it starts becoming prohibitive to do it yourself.
  - We've also mitigated parts of this by introducing the `audit_trail` feature, which means it's harder for the user to understand if/when they can cache stuff and replicate calculations. However the more we lock the calculations and the transparency down, the less transparent our product becomes.
- There's two aspects that depend on the dynamicity
  - The homogeneity of the input data. If you always perform the exact same calculations, that trends towards lower dynamicity
  - The homogeneity of the output data. If the same input can lead to different calculations, e.g. if you implement real-time grid carbon intensities, the same input will lead to different output.

If I was to draw a quadrant of the two axis:
Low continuity, low dynamicity:
  - Example use case: Annual reporting using /estimate or custom mappings
  - Thought: "Why am I paying for something I only use once a year when I could do these calculations myself?"

High continuity, low dynamicity:
  - This is honestly a weird quadrant, because I can't come up with realistic use-cases for us, but here's one I made up
  - Example use case: "My department has to report carbon emissions for our cloud computing every week"
  - Thought: "My cloud computing doesn't change that much every week, what do I really need an API for?"

- High dynamicity, low continuity:
  - Example use case: "Annual reporting for business travel. Destinations will vary, but it's not needed to do it very often"
  - Thought: "I only use this API once every year, do I really need to pay for it all the other months?"

- High dynamicity, high continuity
  - The golden spot!
  - Example use cases:
    - "When we ship cargo around the globe, I need to know the carbon emissions so I can decide between routes"
    - "I want to shift my compute around depending on how green the grid is every month" ( We can't do this at Climatiq currently)
  - Thought: "Wow, there's no way I could do this without an API"
```

The above bullet points are written regarding the Climatiq API, an API for performing carbon calculations for a wide variety of services and activities.
Turn the bullet points into text. You may expand upon the bullet points. You may assume the user is already familiar with Climatiq and what it does, and has a passing
understanding of what an API is.

---
# What should our MVP's look like

- An MVP can (and perhaps should be) reasonably dumb.
- The calculations will often be broad, simple and static (as that's what's quickest to implement and find data for)
- In employee commuting, this could e.g. be an endpoint that returns the "average emissions for a commuter to work, for X country"
- This endpoint will very likely be low on both the continuity and dynamicity axes

However, for several reasons, this level of fidelity is still worthwhile:
- This level works well to gauge interest. Someone might see it and use it and say "That's great, but we need X before we want to buy it". That's more information for us.
- It might also turn out that nobody cares very much about this functionality and it sees little use. Not building more than this level means we're not building something nobody wants.
- For someone who's been tasked to begin these calculations and might not have any idea where to begin, or need for exact calculations yet, this is better than nothing.
- Especially for large enterprises a lot of procurement is done with the help checklists. "Does the tool do X, Y and Z", even though they might not use Z, or care about the granularity, the simple fact that someone can check a box can mean something in sales situations.

While this level of fidelity probably won't convince a savvy sustainability engineer that Climatiq is worth purchasing, if they're just looking for this feature, it might help start the conversation with these, and help with the purchasing decisions for less savvy customers.

Note that an MVP here is for something we don't have strong customer demand for.

## Executing the MVP
I think the easiest way to figure out what this MVP should look like is to take an appetite-driven approach with the people who would end up implementing it.
Figure out our methodology and then talk with the people doing the engineering and data work and say:
- What would this endpoint look like if we had to build it in one week? 2? 3?
- Determine which of these week cut-off points that would be "good enough" to fulfill the criteria above for an MVP. This might take three weeks, but it also might take 2. If it could be both 2 and 3 weeks, go for the 2-week project instead.

## Iterating on the endpoint
- After the MVP's been launched, we should wait some months and see what the customers say. Do we get good feedback? What's missing in it? Is anyone actually using it?
- If after a few months we can see it has uptake, and we have ideas on how to improve it, we can create another iteration to improve on it
- The only con of this approach is that we're generally very hesitant to break endpoints in Climatiq (even those labelled Alpha where we explicitly say we'll break them without warning), which makes iterating in backwards-compatible ways harder. I think we should just look at our company culture, bite the sour apple and break these endpoints in these situations, which we also very publicly say we will.


----

## Level 1: "I have no clue, and I must estimate"
- This is the first level of creating an endpoint that generates value.
- The calculations will often be broad, simple and static (as that's what's quickest to generate)
- In employee commuting, this could e.g. be an endpoint that returns the "average emissions for a commuter to work, for X country"
- This endpoint will very likely be low on both the continuity and dynamicity axes

However, this level of MVP can still be worthwhile:
  - This level works well to gauge interest. Someone might see it and use it and say "That's great, but we need X before we want to buy it". That's more information for us. 
  - It might also turn out that nobody cares very much about this functionality and it sees little use. Not building more than this level means we're not building something nobody wants.
  - For someone who's been tasked to begin these calculations and might not have any idea where to begin, or need for exact calculations yet, this level will still help them.
  - Especially for large enterprises a lot of procurement is done with the help checklists. "Does the tool do X, Y and Z", even though they might not use Z, or care about the granularity, the simple fact that someone can check a box can mean something in sales situations.

So while an endpoint like this can provide some value, if this is the only endpoint someone is interested in, it doesn't answer the questions that savvy sustainability engineers or PM's will have like:
- "Why is this an API"
- "Why shouldn't we just save this calculation"
It doesn't necessarily convince someone that this is something they should implement in their software, even if the price was not an issue. Of course this assumes perfect knowledge of the system so they know how simple or complex the calculations are.

## Level 2: "This is easier than doing it myself"
- This is the next level, where it's generally obvious that using our functionality would be easier than implementing it yourself.
- The value this endpoint demonstrates can either be:
  - Due to placing higher on the dynamicity axis, such as by incorporating real-time data (such as real-time electricity), or heterogenous input (such as business travel)
- Users at this point could still cache calculation values:
    - They could call our cloud endpoint once and save the value for running their VM for a day, and then add this information up and use it for the next two years.
    - If they do some trips more commonly, they could save the CO2e for that trip, and use it.
- However either the input space starts becoming large enough that this isn't feasible, or the calculations are potentially complex (or opaque) enough that this isn't "worth the effort"
- When people start seeing calculations that they can't easily replicate, then Climatiq starts to seem like a good option

## Level 3: I couldn't do this myself
- Endpoints like this is where we really wow people. If the user sees and endpoint and thinks: "Wow there's no way I could do this myself", then we're in a really good spot.
- This is most clearly if we use dynamic data. If our electricity endpoint uses current grid data, the user _needs_ to call our endpoint each time, because the data will change.
- The same with routing
- It takes a fair amount of time to get here

