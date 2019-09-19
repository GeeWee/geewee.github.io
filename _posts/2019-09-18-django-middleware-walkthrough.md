---
title: An In-Depth walkthrough of Djangos Default Middleware
short:
  "This is a very in-depth walkthrough of what the different pieces of Djangos default MiddleWare does, and how it relates to django-rest-framework.
  Most of this isn’t particularly relevant to know unless you’re debugging a Middleware issue - in that case it’s invaluable information. "
permalink: "/django-middleware-walkthrough/"
---

This is a very in-depth walkthrough of what the different pieces of Djangos default MiddleWare does,
and how it relates to django-rest-framework. Most of this isn’t particularly relevant to know unless
you’re debugging a Middleware issue - in that case it’s invaluable information. Middleware issues
can be tricky to debug, especially if the issue changes, depending on the order of the MiddleWare.
We’ll also go over how the Middleware interacts with Django-rest-framework, when there’s a
difference between that and vanilla Django.

## How does Middleware work?
Django’s middleware is an onion-y layer that’s around the actual view code you write. It has the ability to alter the request going in, such as setting properties on it or issuing redirects.
It also has the ability to alter the response going out, such as adding headers to it, or modifying the response body. 

They also have another ability, which is where the onion metaphor kind of breaks down. Middleware
can also intercept a request [right before control is handed to a view](https://docs.djangoproject.com/en/2.2/topics/http/middleware/#process-view).
This is used if the Middleware needs to perform different actions, depending on the actual view being served. We’ll see this used primarily in the
`CSRFMiddleware`.

## Django's built-in middleware
This is the stack of middleware that a Django project comes with by default. A request is passed *down* the line, and a response is passed *up.*
This means, that the topmost middleware gets to modify the request first, and the response last.
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```
We’ll go through each of these pieces of middleware in order, and describe what they do on the way **in** - meaning how it modifies the request, and on the way **out**, aka how it modifies the response.
If the Middleware does something before control is handed to the view, we’ll also look at that.

## SecurityMiddleware \[ [docs](https://docs.djangoproject.com/en/2.2/ref/middleware/#django.middleware.security.SecurityMiddleware) \] \[ [source](https://github.com/django/django/blob/master/django/middleware/security.py) \] 
The SecurityMiddleware provides several independent security enhancements, like HTTPS redirect, and a bunch of security headers.

### On the way in
Checks whether or not the response should be a HTTPS response, and if it should be, and isn’t, it returns a redirect instead of the regular response.

### On the way out
Sets a bunch of security based headers, like `Strict-Transport-Security`, XSS protection headers and so forth.

## SessionMiddleware \[[docs](https://docs.djangoproject.com/en/2.2/ref/middleware/#module-django.contrib.sessions.middleware)\] \[[source](https://docs.djangoproject.com/en/2.2/_modules/django/contrib/sessions/middleware/#SessionMiddleware)\]
The SessionMiddleware is the middleware that allows Django to hold persistent Sessions for each user.

### On the way in
Fetches the `sessionid` cookie from `request.cookies` and asks the [SessionEngine](https://docs.djangoproject.com/en/2.2/topics/http/sessions/#configuring-sessions) for any data related to this session id.
It then assigns this retrieved session data to `request.session`

### On the way out
The Middleware checks whether or not the session needs to be deleted or updated in the database. It
checks whether or not the session is completely empty, in which case it deletes the sessionId
cookie. If the session has been modified, or
[SESSION_SAVE_EVERY_REQUEST](https://docs.djangoproject.com/en/2.2/ref/settings/#std:setting-SESSION_SAVE_EVERY_REQUEST)
is set, it updates the session in the database, and gives the client a new cookie to use for the next
request.

## CommonMiddleware \[[docs](https://docs.djangoproject.com/en/2.2/ref/middleware/#django.middleware.common.CommonMiddleware)\] \[[source](https://docs.djangoproject.com/en/2.2/_modules/django/middleware/common/#CommonMiddleware)\]
CommonMiddleware combines different unrelated functionality. It does URL rewriting based on the
`PREPEND_WWW` and `APPEND_SLASH` settings. It blocks access to `DISALLOWED_USER_AGENTS` and sets the
`Content-Length` header for responses

### On the way in
Checks for forbidden user agents in `settings.DISALLOWED_USER_AGENTS`, and if it finds a match, it
simply returns a 403.

If `APPEND_SLASH` is set to true, it adds a trailing slash to a request and
redirects, if doing so turns an invalid path into a valid one.

If `PREPEND_WWW` is set to true, it
prepends `www.` to the URL and issues a redirect.

### On the way out
For 404 pages, it checks whether or not the 404 url needs an appended slash, and appends it if it
does. For non-streaming responses, it adds the
[Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header.


### CsrfViewMiddleware \[[docs](https://docs.djangoproject.com/en/2.2/ref/csrf/)\] \[[source](https://docs.djangoproject.com/en/2.2/_modules/django/middleware/csrf/#CommonMiddleware)\]
This is probably the most complex middleware that comes with Django. Its purpose is to prevent against Cross Site Request Forgery.

### On the way in
Gets the csrf token for the current request. This can either be from a cookie or, if `CSRF_USE_SESSIONS` is set to true, from the SessionStorage.
Sets `request.META[‘csrf_cookie’]` to the token, if it exists.

### Before the view is processed
First it checks whether or not the request has `csrf_processing_done` set to `True`. If it is, it skips validation.
`csrf_processing_done` is set to `True` after a Request has passed through the CsrfViewMiddleware.
Django has decorators that also provide csrf protection, such as
[csrf_protect](https://docs.djangoproject.com/en/2.2/ref/csrf/#django.views.decorators.csrf.csrf_protect).
To avoid doing csrf checks twice, the middleware and the decorator both set `csrf_processing_done`
to `True`.

Next it handles the [@csrf_exempt decorator](https://docs.djangoproject.com/en/2.2/ref/csrf/#django.views.decorators.csrf.csrf_exempt).
This decorator can be applied to a view, to ignore CSRF
protections for this view. The decorator simply sets the attribute `csrf_exempt` on the view.
The Middleware then checks for this attribute on the view, and if it exists, it lets the request through.

At this point the Middleware has decided whether or not it needs to do Csrf validation. The actual Csrf validation 
is as follows:

If the request uses a “safe” verb such as `GET`, there’s no further validation needed.
But for “unsafe” HTTP methods such as `POST`, `PUT` or `PATCH` additional validation is done.

The first thing it does, is check whether or not the request has the attribute `_dont_enforce_csrf_checks`.
This attribute is set by the Django testing framework, where the Django Test Client marks requests with
this attribute, so you don’t have to deal with CSRF in tests.

Next up, if you're on a SSL connection, it does some `HTTP_REFERER` checks, such as detecting
whether we were redirected from a unsecure site to a secure one, and rejects the request if that's
the case.

If we pass here, we retrieve the `csrf_token` from `request.META` where we previously set it.
If there’s no `csrf_token`, we reject the request.

The next thing it does is, it compares the `csrf_token` cookie with the `csrfmiddlewaretoken` that
you must provide in forms. It does this by reading request.POST, with all of the
[implications this entails](https://docs.djangoproject.com/en/2.2/topics/http/file-uploads/#modifying-upload-handlers-on-the-fly).
If it can't find the `csrf_token` in the POST payload, it tries to get it from the
[X-CSRFToken header](https://docs.djangoproject.com/en/2.2/ref/csrf/#ajax). It then compares the
cookie token with the token from the header or the `POST` payload. If the csrf tokens are identical,
it will let the request through, if not, it will reject it.

### On the way out
It does some check to figure out whether or not it should set a new `CSRF_TOKEN` cookie.
Primarily it checks for request.META[‘CSRF_COOKIE_USED’] - and if it has been used, we renew it.

`META[‘CSRF_COOKIE_USED’]` is set when a CSRF token is used, such as when using the {% raw %}{% csrf_token %}{% endraw %} tag amongst others.


### Integration with Django-Rest-Framework
`django-rest-framework` has an interesting integration with the CsrfViewMiddleware.
It wraps every view in the `@csrf_exempt` decorator, meaning the CsrfViewMiddleware ignores it.
This is so DRF can support multiple authentication backends. In session-based authentications, DRF then
runs its own copy of CsrfViewMiddleware to ensure that the Csrf tokens are as they should be.


## AuthenticationMiddleware \[[docs](https://docs.djangoproject.com/en/2.2/ref/middleware/#module-django.contrib.auth.middleware)\] \[[source](https://github.com/django/django/blob/master/django/contrib/auth/middleware.py#L16)\]
The AuthenticationMiddleware sets the `request.user` property on an incoming request, to either an
`AnonymousUser`, or a logged in-user, fetched from an Authentication Backend.

### On the way in
It sets `request.user` to a LazyObject - meaning it's never instantiated before it’s read.

When request.user is evaluated, it’s fetched from an `AUTHENTICATION_BACKEND` via a session key based on
the users primary key.
When the user logs in, these keys are saved in the `SessionStorage.`
Django validates that the session hash matches the `session_auth_hash`, this hash changes when the user changes password,
meaning that when the user changes password, [the session is invalidated](https://docs.djangoproject.com/en/2.1/topics/auth/default/#session-invalidation-on-password-change).

### On the way out
It does nothing.


## MessageMiddleware \[[docs](https://docs.djangoproject.com/en/2.2/ref/contrib/messages/)\] \[[source](https://docs.djangoproject.com/en/2.2/_modules/django/contrib/messages/middleware/#MessageMiddleware#L16)\]


### On the way in
This sets `request._messages` to an instance of whatever `settings.MESSAGE_STORAGE` is.
By default this is the SessionStorage.
In your code, when you call `messages.info` or similar methods, these just add the messages to `request._messages`

### On the way out
This takes any messages that have been stored on the request, but not yet "used" and saves them to the `MESSAGE_STORAGE` backend.
The `MESSAGE_STORAGE` backend is usually the `SessionStorage`, but it can also be cookie-based, which means the messages are saved
on the `response` object.

## XFrameOptionsMiddleware \[[docs](https://docs.djangoproject.com/en/2.2/ref/middleware/#django.middleware.clickjacking.XFrameOptionsMiddleware)\] \[[source](https://docs.djangoproject.com/en/2.2/_modules/django/middleware/clickjacking/#XFrameOptionsMiddleware)\]
### On the way in
It does nothing.

### On the way out
This sets some `X-Frame-Options` headers which prevent clickjacking.
It only sets the header if it's not already set, or the view has not been wrapped in the `@xframe_options_exempt` decorator.
This decorator works the same way as `@csrf_exempt` , by setting an attribute on the view, that the middleware checks for.
