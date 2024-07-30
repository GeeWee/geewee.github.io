---
title: What PRs are and aren't
---

## Goals
- Learning from one another
- Fix code
- Shared ownership



# Things to talk about

- Self review first

- How strict should the quality control be? Just bugs, imprecise typing, missing tests, code style etc?

- When to click "resolve" on comments

- When should PRs be approved?

- Are PRs urgent?

- What to do in case of disagreements?



## They should:
- Always include a self-review first, to catch obvious mistakes, such as typos or commented-out lines of code. Do so after taking a step away from the PR for a while so you can see it with fresh eyes.
- Include a good title and description for future reference, so people digging in the git log can figure out what (and why!) something was done.
- Include checks of whether something has breaking changes, conforms to spec etc.
- Include considerations of edge-cases

## They are (or should be):
- Ways to learn from one another. The reviewer can teach the author something, and the reviewer might learn something they didn't know already
- As small as possible to make them quicker and easier to review. Preferably scoped to just one cohesive change. This also means less back and forth before merging your changes in. I often hear 200-400 lines is a great size, e.g. see [here](https://linearb.io/blog/reducing-pr-review-time). [Some studies](https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/) suggest that the optimal reading time to find defects is at around 500 LOC per hour.
- Include comments guiding the reviewer

## They aren't:
- Rubberstamping to get stuff merged into `main` and released
- Necessarily urgent. I think PRs should be responded to in the same day, but they're not "drop stuff" urgent, and you should schedule your work to take that into account.


## Handling conflicts
- Generally I like that reviewers have the last word when people can't reach a solution - but they should also obviously be good at recognizing when they don't have the expertise to have strong opinions on something. This is because code is generally easier to write than it is to read, so the fresh reader perspective (is to me) more valuable in this kind of situation.


## What comments need to be handled
- I'd expect that unless a comment is explicitly marked as a `nit` or optional, each comment needs to be either changed, tracked in a separate issue, or argued against.
  - However if you do decide to track it in a separate issue - it *can't* go down into a black abyss of a backlog where it doesn't actually get fixed in time. You should do this pretty close after the original PR, or at a specific time (e.g. if you're planning on refactoring something as part of another piece of work).
- You should resolve comments when you've done _exactly_ as suggested so you're sure there's no further need for discussion. Otherwise make the change and respond, and let the comment author resolve it when they're happy.

## Approving PRs
### Approve with suggestions
I like "Approve with suggestions a lot", which means:
- When you've resolved all the comments as they're stated, feel free to merge.
- It means "If you're going to follow the comments, the changes aren't big enough that they need a second review"
- It doesn't mean "feel free to ignore any comments"
- It cuts down on the feedback cycle instead of having to click "Request changes", and then the author having to wait 2-3-4 hours for someone to look at their PR again after their fixes.
- It does however mean you can't click "Auto-merge" before fixing issues.

### How many approvals do you need?
- I dunno

## After PRs
- Many of us still finish conversations after a PR has been merged in if someone responds. I don't think this is a requirement though.

Really nice link:
https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/
https://opensource.com/article/18/6/anatomy-perfect-pull-request



# Pull request size
https://gist.github.com/mikepea/863f63d6e37281e329f8
https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/
https://opensource.com/article/18/6/anatomy-perfect-pull-request
https://smallbusinessprogramming.com/optimal-pull-request-size/#fn-352-2
https://smallbusinessprogramming.com/optimal-pull-request-size/#fn-352-2


# Against pull requests
Some interesting cases against pull requests
https://betterprogramming.pub/are-pull-requests-holding-back-your-team-e8aec48986c2
https://dev.to/shubhamjain/the-case-against-pull-requests-and-how-to-fix-it-533g
https://aboodman.medium.com/in-march-2011-i-drafted-an-article-explaining-how-the-team-responsible-for-google-chrome-ships-c479ba623a1b
