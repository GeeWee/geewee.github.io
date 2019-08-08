---
title: Optimizing Django REST Framework performance with django-auto-prefetching
short:
  "Django-auto-prefetching is a library that automatically prefetches data from the database when using the django-rest-framework"
permalink: "/introducing-django-auto-prefetching/"
draft: true
---
*tldr: django-auto-prefetching is a library that automatically optimizes your endpoints by using `prefetch_related` and `select_related` to fetch the correct objects
from the database when using django-rest-framework. You can find it on [PyPI](https://pypi.org/project/django-auto-prefetching/) and [Github](https://github.com/GeeWee/django-auto-prefetching)*

## Django REST Framework and the n+1 problem

The Django REST Framework(DRF) is a framework for quickly building robust REST API’s.
However when fetching models with nested relationships we run into performance issues. DRF becomes *slow*.

This isn’t due to DRF itself, but rather due to the n+1 problem.
When we have a model, say `ItalianChef` with a relationship like `FavouriteDish`, and we want to fetch all italian chefs with their corresponding favourite dishes.
This means we potentially make a lot of queries as DRF first goes to fetch all the Chefs, and then for each of those chefs, it separately fetches their favourite dish.
This means that if there’s twenty chefs, we’ll end up making twenty separate database calls for favourite dishes.

<script src="https://gist.github.com/GeeWee/ac12ec3e914ed5d8321bfa3059374350.js"></script>

Django has a built in solution to this problem, `select_related` and  `prefetch_related`,
which tells the ORM what related objects you’re going to need. This means instead of doing a bunch of database calls, we can just do one.

<script src="https://gist.github.com/GeeWee/2c8758fd833216447e3bd10425c48432.js"></script>

There’s two issues with this however - it’s can hard to track exactly what relationships you’ll end up traversing,
and it’s time consuming to manually write `select_related` and `prefetch_related` calls,
not to mention keeping them updated as code elsewhere changes.

##  Introducing django-auto-prefetching
The goal of this library is to, as effortlessly and as painlessly as possible, make sure you don’t suffer performance problems due to n+1 issues.
We’re starting in the small with automatic prefetching for DRF serializers.

### What does it do?
Django-auto-prefetching has a ModelViewSet mixin, which looks at the fields any given serializer uses, and automatically calculates the correct `select_related` and `prefetch_related` calls.

<script src="https://gist.github.com/GeeWee/2a413d19b13604aa017de5fb609985ce.js"></script>

This means that one line of code is all of the optimization many of your views will ever need!

## Is it production ready?
django-auto-prefetching is being used internally at the danish startup [reccoon](https://www.reccoon.dk/), in a Django codebase of about 20k lines of code.
We had a lot of endpoints that weren’t optimized, and we’ve seen a general 30-40% speedup in response times across our whole API, just by inheriting our ViewSets from AutoPrefetchMixin

But try it out for yourself. You can find it on [PyPI](https://pypi.org/project/django-auto-prefetching/), and make sure to report any issues you find on [Github](https://github.com/GeeWee/django-auto-prefetching)
