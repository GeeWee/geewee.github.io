---
title: An in-depth walkthrough to Djangos default mdidleware
short:
  "This is a very in-depth walkthrough of what the different pieces of Djangos default MiddleWare does, and how it relates to django-rest-framework.
  Most of this isn’t particularly relevant to know unless you’re debugging a Middleware issue - in that case it’s invaluable information. "
permalink: "/django-middleware-walkthrough/"
draft: true
---
This is a very in-depth walkthrough of what the different pieces of Djangos default MiddleWare does,
and how it relates to django-rest-framework. Most of this isn’t particularly relevant to know unless
you’re debugging a Middleware issue - in that case it’s invaluable information. Middleware issues
can be tricky to debug, especially if the issue changes, depending on the order of the MiddleWare.
We’ll also go over how the Middleware interacts with Django-rest-framework, when there’s a
difference between that and vanilla Django.

## How does Middleware work?
Django’s middleware is an onion-y layer that’s around the actual view-code you write. It has the ability to alter the request going in, such as setting properties on it, or issuing redirects.
It also has the ability to alter the response going out, such as adding headers to it, or modifying the response body. 

They also have another ability, which is where the onion metaphor kind of breaks down, but Middleware can also intercept a response right before control is handed to a view, if the decorator needs to do view specific actions. We’ll see this used primarily in the CSRFMiddleware.
 https://docs.djangoproject.com/en/2.2/topics/http/middleware/#process-view

## Django’s built-in middleware
This is the stack of middleware that a Django project comes with by default, the first middleware is the first one that gets to modify the request, and the last one that gets to modify the response.
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
We’ll go through each of these pieces of middleware in order, and describe what they do on the way In - meaning how it modifies the request, and on the way out, aka how it modifies the response.
If the Middleware does something before control is handed to the view, we’ll also look at that.

### SecurityMiddleware 
(https://docs.djangoproject.com/en/2.2/ref/middleware/#django.middleware.security.SecurityMiddleware)
(https://github.com/django/django/blob/master/django/middleware/security.py)
The SecurityMiddleware provides several independent security enhancements, like HTTPS redirect, and a bunch of security headers.

On the way in:
Checks whether or not the response should be a HTTPS response, and if it should be, and isn’t, it returns a redirect instead of the regular response.

On the way out:
Sets a bunch of security based headers, like Strict-Transport-Security, XSS protection headers and so forth.

### SessionMiddleware
https://docs.djangoproject.com/en/2.2/ref/middleware/#module-django.contrib.sessions.middleware
https://docs.djangoproject.com/en/2.2/_modules/django/contrib/sessions/middleware/#SessionMiddleware

The SessionMiddleware is the middleware that allows Django to hold persistent Sessions for each user.

On the way in:
Fetches the sessionid cookie from the request.cookies and asks the SessionEngine(link) for any data related to this session id. It then assigns the session data to request.session
https://docs.djangoproject.com/en/2.1/topics/http/sessions/#configuring-sessions

On the way Out:
The Middleware checks whether or not the session needs to be deleted or updated in the database.
It checks whether or not the session is completely empty, in which case it deletes the sessionId cookie. If the session has been modified, or SESSION_SAVE_EVERY_REQUEST(https://docs.djangoproject.com/en/2.2/ref/settings/#std:setting-SESSION_SAVE_EVERY_REQUEST) is set, it updates the session in the database, and gives the client a new cookie to use for the next request.

https://docs.djangoproject.com/en/2.1/topics/http/sessions/

### CommonMiddleware
https://docs.djangoproject.com/en/2.2/ref/middleware/#django.middleware.common.CommonMiddleware
https://docs.djangoproject.com/en/2.2/_modules/django/middleware/common/#CommonMiddleware
CommonMiddleware has a few different functionalities. It does URL rewriting based on the PREPEND_WWW and APPEND_SLASH settings. It blocks access to DISALLOWED_USER_AGENTS and sets the Content-Length header for responses

In:
Checks for forbidden user agents in settings.DISALLOWED_USER_AGENTS, and if it finds a match, it simply returns a 403.
If APPEND_SLASH is set to true, it adds a trailing slash to a request and redirects, if doing so turns an invalid path into a valid one. 
If PREPEND_WWW is set to true, it prepends www. to the URL and issues a redirect.

Prepends url rewriting, to write www in front of urls if it’s not there. Adds www if it’s not there
 or add trailing slashes / if needed / configured. Adds / if it’s not there, and adding it would turn an invalid path into a valid one.
Changed by APPEND_SLASH and PREPEND_WWW settings

Out:
For 404 pages, it checks whether or not the 404 url needs an appended slash, and appends it if it does.
For non-streaming responses, it adds the Content-Length(link) header, depending on the size of the response


#### CsrfViewMiddleware
https://docs.djangoproject.com/en/2.2/_modules/django/middleware/csrf/
This is probably the most complex middleware that comes with Django. Its purpose is to prevent against Cross Site Request Forgery.

In:
Gets the csrf token for the current request, this can either be from a cookie or from the SessionStorage, if CSRF_USE_SESSIONS is set to true.
Sets request.META[‘csrf_cookie’] to the token, if it exists.

In-View:
Describe why this is a process_view thing

First it checks whether or not the request has csrf_processing_done set to true. If it is set to true, it does no more validation. After a request has succesfully passed through the CsrfViewMiddleWare, this attribute is set to true on the request. It does this because Django has some decorators that also provide csrf protection, 
and to make those work together with the middleware without having to do the CSRF check twice, all the decorators and the middleware set the csrf_processing_done attribute.

Next it handles the @csrf_exempt decorator. This decorator can be applied to a view, to ignore CSRF protections for this view. The decorator simply sets an attribute csrf_exempt, on the view, and the Middleware checks for it. If it exists, the view does not require csrf protection, and the middleware simply lets the request through.

After this, if the request uses a “safe” verb such as GET, there’s no further validation needed. But for “unsafe” HTTP methods such as POST, PUT or PATCH additional validation is done.
The first thing it does, is check whether or not the request has the attribute “_dont_enforce_csrf_checks”, this attribute is set by the Django testing framework, where the Django Test Client marks requests with this attribute, so you don’t have to deal with CSRF in tests.

TODO check exactly where the request.is

It then has some HTTP_REFERRER checks that’s only enabled for SSL connections, where we do a lot of REFERRER checks, among others, whether we were redirected from a unsecure site to a secure one.

If we pass here, we get the csrf_token from request.META where we set it before.
If there’s no csrf_token, we reject the request.

This reads request.POST..?!
https://docs.djangoproject.com/en/2.2/topics/http/file-uploads/#modifying-upload-handlers-on-the-fly
For POST requests, we check if there’s a “csrfmiddleware” in request.POST, and it must match the request_csrf token. If either of these fails, we’ll reject the request as well.

If nothing here rejects the request, we accept it.

Out:
It does some check to figure out whether or not it should set a new CSRF_TOKEN. Primarily it checks for request.META[‘CSRF_COOKIE_USED’] - and if it has been used, we renew it.

META[‘CSRF_COOKIE_USED’] is set when get_token is called, which django calls when using the \{\% csrf_token \%\} tag amongst others.


https://medium.com/@polyglot_factotum/django-and-the-story-of-a-crsf-cookie-b9384baf2db1

django-rest-framework has an interesting integration with the CsrfViewMiddleware. It wraps every view in the @csrf_exempt, meaning the CsrfViewMiddleware ignores it. This is so it can support multiple authentication backends. It then does its own Csrf cookie validation inside the SessionAuthentication authentication backend

### AuthenticationMiddleware https://github.com/django/django/blob/master/django/contrib/auth/middleware.py
https://github.com/django/django/blob/master/django/contrib/auth/__init__.py#L165
The AuthenticationMiddleware sets the request.user property on an incoming request, to either an AnonymousUser, or a logged in-user, fetched from an Authentication Backend.

In:
It sets request.user to a LazyObject - meaning it’s never instantiated before it’s read. 
When request.user is evaluated, it’s fetched from an AUTHENTICATION_BACKEND via a session key based on the user PK. When the user logs in, these keys are set in request.session
Django validates that the session hash matches the session_auth_hash, this hash changes when the user changes password, meaning that when the user changes password, the session is invalidated.

DRF hooks into this via the SessionAuthentication, which simply asks if request.user is active, and enforce CSRF manually afterwards by wrapping the CSRFVIEWMIDDLEWARE

Out: nothing

https://docs.djangoproject.com/en/2.1/topics/auth/default/#session-invalidation-on-password-change

### MessageMiddleware
https://docs.djangoproject.com/en/2.2/_modules/django/contrib/messages/middleware/#MessageMiddleware

In.
This sets request._messages to an instance of whatever settings.MESSAGE_STORAGE is, by default the SessionStorage. When you call messages.info and other methods, these just set properties on request._messages

Out
This takes any messages that have been stored on the request via `messages.info`, and attaches saves them to the MESSAGE_STORAGE backend, which can either hold them in the session storage, or perhaps as a cookie, depending on its value.

### XFrameOptionsMiddleware
In:
This does nothing here

Out
This sets some X-Frame options which prevent clickjacking. It only sets the header if it’s not already set, or the view has not been wrapped in the xframe_options_exempt
 decorator. This decorator works the same way as “csrf_exempt” , by setting an attribute on the view, that the middleware checks for.
