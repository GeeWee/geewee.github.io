---
title: Thoughts on Product Roadmaps
short: |
  Some of my unstructured thoughts on product roadmaps.
---

*Caveat: While I consider myself a product-first engineer with solid product skills and an academic background partly founded in product design and UX, I have never worked as a full-time product manager. My experience only comes from "the other side of the table", i.e. working with product managers as an engineer.*

During my time at my current employer, I’ve spent a fair amount of time reflecting on product roadmaps—what they’re good for and what they might not be so good for. I think a shared understanding of priorities and collective ownership is important, and a roadmap can be a valuable tool for achieving that. Roadmaps also seem to be a reasonably standard industry practice, though there are [some notable holdouts](https://basecamp.com/articles/options-not-roadmaps).

## Categories of Roadmaps

[Roadmunk](https://roadmunk.com/guides/what-is-a-product-roadmap/) provides a solid overview of three overarching types of roadmaps:

1. **No-Dates Roadmap**: A prioritized list of features or problems agreed upon by the team. Priorities can be defined in many ways (e.g., ROI, urgency/priority matrices), but this type of roadmap deliberately avoids assigning deadlines or timeframes to specific items.
2. **Timeline-Based Roadmap**: A roadmap where each item has a defined duration or deadline.
3. **Hybrid Roadmap**: Combines the two approaches, with timeframes for near-term items (e.g., 1-3 months) and a prioritized list for tasks further out.

For my five cents, I think I believe the no-dates roadmap or a hybrid roadmap provides works the best. Let’s explore why.

---

## The Risk of Commitment

The moment you introduce dates or timeframes into your roadmap, people gravitate towards treating them as commitments. The software world is rife with stories about estimates being turned into promises. I often see it recommended to keep dates out of roadmaps shared outside the immediate team:

> *It is not uncommon for sales reps to share internal roadmaps with customers, as a way of closing a deal, generating interest, and keeping leads warm. Avoid having sales teams committing a product to a specific release date, by excluding release or launch dates in these roadmaps.* - [ProductPlan](https://www.productplan.com/learn/what-is-a-product-roadmap/)

> *An important note: avoid including hard dates in sales roadmaps to avoid tying internal teams to potentially unrealistic dates. Unless there’s certainty about the product’s availability date, it’s a good habit to avoid including dates in an external-facing roadmap.* - [Atlassian](https://www.atlassian.com/agile/product-management/product-roadmaps)

> *Some schools of thought around roadmaps believe that you should keep dates out of the roadmap due to the risk of committing to something that might not be delivered* - [also Roadmunk](https://roadmunk.com/guides/what-is-a-product-roadmap/)

There's two reasons why you might be hesitant to put deadlines on roadmap items (and by extension, make some sort of commitment):

1. **Unrealistic Deadlines**: Humans are notoriously bad at estimating software complexity. Unless you build in substantial slack into your timelines or do extensive time-consuming pre-planning, you’ll likely miss deadlines.
2. **Building the Wrong Thing**: Sometimes you realize that what you're building doesn't actually solve the problem you think, or even that you have another problem you'd rather focus your resources on. If you've commited to timeframes, you either have to renege on your promise or build the wrong thing.

> *Product managers rarely know what’s going to happen a year from now (market changes, discovery of new user needs, etc.), so planning for a one-year timeline doesn’t make sense. You only need the details of the who, what and how for the month and quarter, focused on working towards achieving a high-level goal or two (for agile teams and startups, even that time frame can be a stretch!)* - [Roadmunk](https://roadmunk.com/guides/what-is-a-product-roadmap/)


Both of these grow more likely the longer you try to plan your timeline, as delays in earlier tasks cascade. While you might hope to make up the difference with some tasks finishing ahead of schedule, in my experience, that’s exceedingly rare.


## Flexible Commitments & Appetite
There's a natural tension between the fact that often want to communicate timeframes, either internally or externally.

If you do have this desire, here are some strategies to make it work:

### 1. Limit the accuracy of commitments
"We'll be working on this in Q2 of next year" is a much weaker promise than "This will be done in April next year, with this functionality...", often a vague commitment is "good enough", while still leaving more room to maneuver.

### 2. Limit the timeframe for your commitments.
Limiting your commitments to X amount of weeks or months in the future is generally wise for two reasons. Planning enough to forecast anything with any amount of accuracy is fairly labour-intensive. I've seen people spend days or weeks on planning for the next 6 months, only to figure out later that they've been building the wrong thing and need to scrap it all.
Delays also tend to cascade. If you're only forecasting for a month, you might only be delayed for a week, while if you're forecasting for a year you could be entire quarters off.

### 3. Build plenty of slack into the system
Unexpected things crop up, things take longer than expected, people get sick. That's life. If you expect 100% utilization for the new features or roadmap items you're planning on, you're going to be in for either a world of pain when your timetable collides with the real world, or engineers cutting corners aggressively, leading to a product so filled with technical debt it'll remind you of the 2008 financial crisis. 

### 4. Be extremely flexible in scope
If you do need accuracy in time, you'll have to be flexible in the scope. Determine a few high priority items that are must-haves, and then a prioritized list further than that, that you're okay not delivering. Cutting down to must-haves is hard to do well, as there's a tendency to over-estimate how much can fit in there. The list of must-haves should be so short it makes you a little uncomfortable.

### 5. Use appetite rather than scope
Work with the concept of [appetite]((https://basecamp.com/shapeup/1.2-chapter-03)) rather than scope. Appetite is a concept that acknowledges that whether problems are worth solving depends on how hard they are to solve. Rather than starting with a set of features or scope, you start with a problem, and you dedicate "X weeks" of appetite to solving as much of this problem as you can. That is your appetite for the problem. It is then up to the team to try and do as much of possible to get something released for the given appetite, with whatever scope that fits into the given appetite.
Obviously not all issues lead well to appetite. If you have contractual obligations to keep e.g. your database up-to-date, you cannot simply disregard this task, if it takes longer than your appetite. But I believe for most feature-based work, appetite is a really great framework that allows you to forecast timelines well into the future, at the cost of not being able to forecast scope.

---

## Roadmap as an Internal Alignment Tool

It is important for teams and companies to agree on what problems are important to solve—and which are not. Creating a roadmap can be a catalyst for these discussions, even if the actual roadmap is never used afterward. The process of creating the roadmap creates alignment by encouraging collaboration and shared prioritization across teams.

As an example, sales might care more about shipping quickly to meet customer demands, while engineering often emphasizes reliability and long-term maintainability. By bringing these differing priorities to light, teams can find common ground and focus on achieving shared goals that take different priorities into account.

## When Roadmaps Become Adversarial 

Sometimes I see roadmaps created in isolation. One team creates the first draft (or even version!) entirely on their own, and then sends it to others for feedback. This has a high risk of the process becoming adversarial, as the teams not part of the initial process will feel like they have to fight for their goals and time. There is a significantly different emotional quality to creating a roadmap together, versus having to fight for your priorities by critiquing an existing roadmap.

As an example, in many companies, sales-driven roadmaps pressure engineering teams into accepting unrealistic deadlines, sacrificing code quality and long-term maintainability.
Situations like this, where the roadmap dictated solely by product teams or executive management can alienate stakeholders and engineers. This lack of buy-in can lead to two common reactions:

1. Indifference: Engineers may disengage, feeling no commitment or ownership over deadlines they had no role in setting. As a result, they might say, “If I didn’t have a say in the deadline, it’s not my problem if it isn’t met.”
2. Stress: Unrealistic deadlines can create intense pressure, leading engineers to cut corners or burn out trying to deliver on time. Over time, this can result in a toxic environment, driving away top performers who seek healthier workplaces.

In the end, roadmaps aren't just an artifact. The way they're created matters immensely for their effectiveness. As with so many other things that seem numbers and engineering-based in theory, they often end up being about those squishy humans in the end. I'll leave you with this last quote which I think underlines this point well.

> "Third, there’s the guilt. Yeah, guilt. Have you ever looked at a long list of things you said were you going to do but haven’t gotten around to yet? How does that list make you feel? The realities of life and uncertainty show us that 100% of the things on the roadmap are not going to happen on time the way we imagine." - [Basecamp](https://basecamp.com/articles/options-not-roadmaps)