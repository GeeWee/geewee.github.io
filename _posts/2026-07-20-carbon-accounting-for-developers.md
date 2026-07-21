---
title: "Carbon Accounting for Software Developers"
permalink: 'carbon-accounting-for-software-developers'
---

I've previously written about that I think having [domain knowledge]({% post_url 2026-07-19-value-of-domain-knowledge %}) as a software developer is tremendously important, and really helps you be effective in your role.
As I currently work with carbon emissions and carbon accounting at [Climatiq](https://www.climatiq.io/), I figured I'd put together a little reading list of what to read in this space if you're a software developer / software engineer looking to get a little more domain knowledge.

# Carbon Accounting

For corporate carbon accounting, the standard to read is the [Greenhouse Gas Protocol Corporate Standard](https://ghgprotocol.org/corporate-standard). This standard explains the different reasons behind doing corporate carbon accounting, and sets out guidelines and requirements for doing so. I would recommend reading (or at least skimming) the entire thing in full. This is _the_ text to read when understanding the carbon accounting space.

Greenhouse Gas Protocol (GHGP) also publishes [other standards & guidance documents](https://ghgprotocol.org/standards-guidance), like guidance for calculating Scope 2 and 3. I have not read all of these myself, but I'd consider them relevant to skim if you're doing work that deals with one of those areas in particular. In particular I think the [Corporate Value Chain (Scope 3)](https://ghgprotocol.org/corporate-value-chain-scope-3-standard) standard is worth skimming.

Here's also a few notes of things I thought were particularly interesting or important regarding corporate carbon accounting.

## General
- The GHGP starts with a section about why businesses should do carbon accounting, and what outcomes they might be interested in. In my mind, of course companies should care about sustainability, but I think it's important to remember that in many cases sustainability teams have to fight for budget and demonstrate their work is worth doing.
- In general, carbon accounting is significantly more.. imprecise than I originally thought. There's _a lot_ of assumptions that goes into carbon accounting, simply because not making a lot of assumptions is going to be very expensive.
  - This is also why you cannot compare the carbon accounting of companies. The GHGP is pretty clear that carbon accounting for a company, is to track reductions _for that company only_, and should not be compared with other companies.[^0]
  - In carbon accounting, the concept of "baseline year" exists, which is the year when you start your carbon accounting baseline from. You then compare yourself with your baselines year to track reductions.
  - Surprisingly, the CO2e number from the base year is not set in stone. If you e.g. do a corporate re-structure, or change calculation methodology, you have to do "rebaselining", which is essentially re-calculating the emissions from your baseline year so they're still comparable with the current year. This makes sense, but it's fairly unintuitive if you don't know about it.

---

- There's a distinction between primary data and secondary data. Secondary data is generally emission factors compiled from industry averages, where primary data is when _your_ supplier says how much emissions a product emitted during production.
  - Depending on your supplier, they might be calculating that information primarily from secondary data themselves (hopefully enriched with _some_ data like their own fuel and electricity usage). This means that results calculated primarily from secondary data can _become_ primary data, which seems a bit odd.

---

- Generally, it seems like carbon accounting is a journey. You often tend to go wide to get an overview of where your emissions are, often with something like spend-based data first, and then you identify hotspots where it's worth to get more granular data.
  - Spend-based data is where you know how much money you spent on e.g. electronics, and then you multiply that with an extremely rough emission factor, to figure out your emissions. This is extremely inaccurate, but good to get a first picture of where it's worth looking deeper.
- Then, when you know where to dive deeper, you have to get more data, e.g. litres of fuel consumed, kg of product bought, etc. This is generally talked about as activity-based data, and considered higher accuracy, but also more time-consuming to calculate and acquire the data for.
- In later stages of the journey you might start swapping secondary out for primary data, if you can get your suppliers to give you the primary data. This is often something people struggle with getting out of their suppliers.


## Scopes
- Corporate Carbon Accounting it split up into three scopes.
  - Scope 1 (the fuel you burn in stuff you own, or emissions from chemical processes under your control)
  - Scope 2 (emissions from the electricity you purchase)
  - Scope 3 (everything else really). 
- Under the GHGP Scope 1 and 2 reporting is mandatory, while Scope 3 is optional.
- The scopes seem primarily designed to avoid double-counting, which is when multiple companies count the same carbon emissions. Scope 1 and 2 are designed so that they cannot be double-counted, while your scope 3 is by nature someone else's scope 1 & 2.
- Double counting is defined as:
_"Double counting or double claiming occurs when two or more companies claim ownership for a single GHG reduction within the same scope."_
It makes sense that it's important to avoid double counting if you e.g. do trading with carbon credits, but if you're "just" disclosing it probably doesn't matter all that much.

- Scopes are primarily designed based on company structure - there's a lot of rules about how you determine if something counts as your scope 1 & 2, especially if your company owns (parts of) other companies.
- Scopes seem very game-able if you want to make your carbon accounting look good. If all your scope 1 comes from burning gasoline in cars your company owns, you can just sell the cars and lease identical cars. 
Now the gasoline suddenly counts as scope 3 emissions instead. And you don't _have_ to report on those, so your carbon accounting disclosure looks great, with no change in actual emissions anywhere.


## Allocations

- It seems to me like Carbon Accounting is kind of like trying to model the physical world. You want to know how much stuff you emit in the end, and you might need to trace the path of your products all the way down across multiple companies, to figure out the final emissions.
- This becomes particularly tricky if you need to do *allocation* at one point in the journey.
- Allocation means, that if you have a system that produces multiple things in the same process, you'll need to figure out how to allocate the shared emissions to each part.
- An example: You have a factory that various items. You only have a power meter for the entire factory. This means you only know the overall emissions for the whole factory, which you'll need to allocate out across the products.
  - The best thing to do, is do no allocation, which means installing e.g. electricity meters on each manufacturing line if possible.
- Often allocation cannot be solved by e.g. adding more monitoring:
- If you raise and slaughter a dairy cow you get many products. Milk during it's lifetime, and meat and leather after the slaughter. Cows emit carbon from food and methane from the digestion. Should those emissions count towards the milk? The leather? Everything equally?
  - In cases like that you'll need to do explicit allocation. The GHGP has some different strategies and a "hierarchy" for when different kinds are good to use, but in the end it becomes a question of judgment.

# Electricity
- Accounting for electricity when doing scope 2 has more nuances than you might immediately expect.
- You do two types of accounting and report on both of them; location-based and market-based.
  - Location based is the actual emissions of the grid energy you're using. The emissions will vary depending on what the grid makeup is, the percentage of renewables etc.
  - Then there's market-based, which exists because you can sell renewable energy certificates. So someone can buy renewable energy certificates to get a certification that their electricity is 100% renewable.
  But in practice the grid mix is what it is, so the certificates essentially means _someone_ gets the green energy and you get to take credit for it.
  The market based approach takes this into account, so if you don't have any energy certificates, you're supposed to calculate using the "residual mix", which is the emission factor of the energy after all the green energy with certificates have been taken out of it. These generally come with fairly high emissions, as most/all of the renewables have been taken out.
- Even though you have to account for electricity in scope 2, this is only part of the picture. There's parts of the electricity that's not covered, such as:
  - The transmission & distribution losses when transporting the electricity. These hover between 4 and 20% [depending on the country](https://data.worldbank.org/indicator/EG.ELC.LOSS.ZS).
  - The extraction of the fuel. The fuel extraction might particularly be relevant for fuels like natural gas, where methane leaks make [up more than 30% of the direct CO2e emissions](https://www.nature.com/articles/s41467-023-41527-9), which wouldn't go into your Scope 2, which makes Natural gas seem significantly more climate-friendly than it is.
- These additional emissions from electricity consumption go into your scope 3.


# Product Carbon Footprints

Corporate Carbon Accounting is one thing, that works at a corporate level. Another area is Product Carbon Footprints (PCF) which tries to calculate the carbon emissions of a single product.

Product Carbon Footprint is governed by multiple different standards that agree on _most_ things but not all things, which is a royal pain in the ass. 

- The [Greenhouse Gas Protocol Standard](https://ghgprotocol.org/product-standard), I think is worth reading. It has the advantages of being commonly used, and very easy to read.
- ISO 14067 which is built on top of ISO 14040 and ISO 14044. I don't think these standards are worth reading, they're hairy, you have to purchase them, and they're hard to read. Unless you really know you need these, skip 'em.
  - Fun side-note: The ISO standards call it "The Carbon Footprint of a Product (CFP)" but the rest of the world seems to call it a "Product Carbon Footprint". 
- The [PACT Methodology](https://www.carbon-transparency.org/), which is really more of a project that aims to enable interoperability and easy sharing of PCFs[^1], but comes with methodological guidance as well. This isn't as widely used and known as the other two standards, but it has the advantage of being pragmatic and very well-written, which means it's a great introduction to the concept of a PCF, and how those calculations work.

As before, here are a few of my personal notes:

- The standards don't agree on everything. ISO and GHGP agrees on most things, but e.g. PACT has very different ideas of how data quality works (data quality is qualitative in the other standards, but quantitative in PACT)
- PCFs come in two variants. Cradle-to-gate, which is the production of something, and cradle-to-grave, which also encompasses the use of the product, and the disposal. The disposal generally doesn't contribute hugely to emissions, but the use-phase might, particularly for products that use electricity.
  - In some cases a use-phase might also be something you don't expect. E.g. you can include the energy costs to wash a piece of clothing in the use-phase of that clothing. This might make sense if you e.g. are creating odor-resistant clothing that needs less washing.
- Product Carbon Footprints are often not created based on an end-product - they're calculated based on a "Functional unit", which is what _function_ the product serves. Examples of functional units:
  - "Washing 5kg of laundry every week for 10 years" ( A laundry machine )
  - "Provide covering for the torso for five years" ( A t-shirt )
  - "Provide color and environmental protection for five years for 50m2" ( A liter of paint )
- The functional units might seem silly at first, but they make sense, as they allow for capturing e.g. upgrades to product durability, and can help compare products, so you don't accidentally end up comparing paint that lasts 1 year with paint that lasts 15 years.
- Product Carbon Footprints, frustratingly enough, are also not comparable. This is the same as Corporate Carbon Accounting, even though intuitively you'd expect two PCFs for different kinds of screws to be comparable, they're not.
  - For PCFs to be comparable, they need to make the same assumptions. For some sectors there exists "Sector-specific guidelines", which is the list of agreed upon assumptions to make. Two PCFs calculated under the same sector-specific guidelines *are* comparable.
  - For PCFs to be comparable they also need the same functional unit. That way you don't naively compare a liter of paint that covers 40m2 with one that covers 60m2.


[^0]: Quote from the Greenhouse gas protocol: Use of this standard is intended to enable comparisons of a company’s GHG emissions over time. It is not designed to support comparisons between companies based on their scope 3 emissions. Differences in reported emissions may be a result of differences in inventory methodology or differences in company size or structure. Additional measures are necessary to enable valid comparisons across companies. Such measures include consistency in methodology and data used to calculate the inventory, and reporting of additional information such as intensity ratios or performance metrics. Additional consistency can be provided through GHG reporting programs or sector- specific guidance 
[^1]: Remember when I said that carbon accounting was like modeling the world? Turns out that's a lot harder if you have to do it through sending PDFs in emails.