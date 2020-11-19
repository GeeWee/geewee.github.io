---
title: "css in js"
permalink: "/css-in-js"
---

*This is a text version of a talk I did at the Aarhus React Meetup Group*

"Two CSS properties walk into a bar. A barstool in a completely different bar falls over."
https://twitter.com/thomasfuchs/status/493790680397803521?lang=da TODO embed tweet

CSS is a powerful language that we use to style our websites, but it doesn't come without a set of problems attached to it.
What I want to do in this article is talk about some of the problems with CSS, and how the ecosystem around CSS has evolved to
overcome some of these challenges, ending up with an overview of how Css-in-Js works. The Css-in-Js part will primarily use React as an example although I



 - Introduction. Structure of talk
    - It's about CSS in JS
     - What is it? Example 
   - This talk is an attempt to give context, rather than compare CSS in JS libraries
     - Cause as in all javascript, there's a billion
   - Part one will be problems with CSS and attempts to solve them
   - Part two will be about how CSS has evolved ending up with CSS in 
   - Part three will be about CSS in JS frameworks
- I'l be using button examples all the way through
- How many people know ES6?
- Please ask questions

 - Part one: What's wrong with just plain old CSS?
  - How many still write plain CSS?
  - There's some problems other than this, but these are the ones we'll focus on
  
  - Global Namespace
    - We learn fast that global variables make code hard to comprehend
    - How many of you have tried changing an existing css class with unexpected
    consequences?
    - Plain CSS solution: BEM

  - Sharing CSS
    - How do we ensure that our brand color is the same everywhere?
    - What if we have two components that look almost the same? << Maybe delete approaches
     - We could copypaste the CSS
       - Longs stylesheets
     - We could give one component the class from the first component and another class
       - Makes the first class harder to change
       - Now declaration order matters
    - Can be solved by something like SASS
  - Dynamic styles
    - How to show a style based on something in JSLand?
      - You can add different classes for each type
        - Sucks for extremely dynamic things
  - All of these things, along with the cascade, can easily lead to **append only css**

 - Part two: The evolution of CSS in JS
  - CSS modules
    - Intro to CSS modules
    - Solves global namespace by generating unique classnames
    - Example
  - Global namespace
    - Fixed - naming fatigue also
  - Sharing CSS
    - Solved with CSS modules through compose() or through a preprocessor
  - Dynamic styles 
    - Not fixed
  - Requires a build step
    - How many use CRA?
    - Not supported by Create React App currently <- TECHNICALLY
 - Inline Styles << Maybe delete
   - Example:
    - Global namespace fixed
      - Naming fatigue fixed, only need to name things that are exported    
    - Sharing CSS fixed - JS object
    - Dynamic styles is a lot easier
    - Requires no build step
    - The ability to keep everything in a single file
    - Does *however* not have any support for meta tags such as ':hover', selecting child elements or media queries < Media queries?
 
 - CSS in JS.
    - CSS in JS
     - Difference between it and inline styles
     - Example of using it via styled components
     - Fixes all of the issue inline styles and CSS modules also does
    - However it comes with extra advantages:
      - No build step required
      - Actually generates stylesheets, so we can use any regular CSS tags
      - The ability to add styles as components of to components
       - Both a blessing and a curse. Needs an example. << Maybe delete
    <? MORE ADVANTAGES?
   - Summarizing:
      - What does using CSS in JS give us?
        - Fixes global namespace by scoping & naming fatigue
        - Gives us really advanced ways of sharing CSS
        - Allows us to create dynamic styles easily
        - One file per component
        - Full power of both CSS and JS
        - React Native comment here?
        
 - Part three: Comparing two CSS in JS solutions
   - There are a billion frameworks out there. We'll compare two:
   - We'll create a Bootstrap Button with a title
   - To showcase things, we'll want
    - A dynamic color style for the button with a themed fallback
    - To automatically inherit font data
   - Glamorous and styled components
   - An example button in each framework
     - Objects vs template literal strings
