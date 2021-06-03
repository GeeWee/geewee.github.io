---
title: Handy links
permalink: '/bookmarks'
---

This is just a list of articles that I often need to find, because I need the content in them.

## [How to rebase from squash-merged branch](https://stackoverflow.com/questions/56804649/how-to-rebase-branch-against-master-after-parent-is-squashed-and-committed/56810435#56810435)
If you are in the following situation
- You've branched out from `develop` in `branch-a`
- You've branched out from `branch-a` to `branch-b`
- `branch-a` is squash-merged into `develop`
- You want to merge `branch-b` into `develop but you don't want any merge conflicts from changes from `branch-a`

You can do the following
```bash
# General principle
git checkout SECOND_BRANCH
git rebase --onto COMMON_BRANCH FIRST_BRANCH

# With branch names from above
git checkout `branch-b`
git rebase --onto origin/develop branch-a
```

a branch that's branched out from another branch, and the first branch has been squash-merged into master


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
