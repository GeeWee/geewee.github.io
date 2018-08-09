---
title: "How to Read Programming Error Messages"
permalink: "/googling-error-messages-1"
draft: true
short: "Much of modern development now is searching for the right things. Error messages can be tricky if you're new or working on a new stack.
This is a short guide about the anatomy of an error message - what parts there are, which are important and which can be ignored."
---

Maybe software-development used to be different.
Maybe you spent hours devising algorithms, huddled together over whiteboards until your markers ran out and you were covered in sweat and dried-out coffee spots.

For most of us, that’s not quite the case anymore - most of modern software development consists of googling the right terms.

<div class="img-div-skyscraper">
<img src="{{site.url}}/assets/img/err-msg/image_0.png"/>
Modern programming workflow. Google a problem, find a solution. Google the next problem.
</div>

Surprisingly, figuring out what "the right terms" are can be pretty difficult. Especially if you’re new to programming or the technology you’re currently using.

This is the first in a series about how to google Error Messages. However to find the right search terms, we first need to understand just how to read an error message, and what parts are relevant. I’ll try to use different programming languages throughout, so we can see the differences and the similarities between them. Let’s dive in!

## Anatomy of an Error Message

Error messages consist of two parts, the **error message** and the **stack trace**.

The error-message is "what’s wrong" - good error messages are helpful and tell you what you should do and bad error-messages sometimes look like something that could summon Cthulhu.

<div class="img-div-skyscraper">
<img src="{{site.url}}/assets/img/err-msg/image_1.png"/>
A wonderful error message from the Elm language
</div>


<div class="img-div-skyscraper">
<img src="{{site.url}}/assets/img/err-msg/image_2.png"/>
Undecipherable hieroglyphics, aka a bad Typescript error message.
</div>

The stack-trace on the other hand is "where it’s wrong."

Note that stack-traces have different names in different languages, Python calls them tracebacks - the core concept is the same however.

<div class="img-div-skyscraper">
<img src="{{site.url}}/assets/img/err-msg/image_3.png"/>
A stack trace, or a traceback as Python prefers to call it.
</div>


Now when googling what’s going wrong - you use the error message more often than the stack trace.
The stack trace is useful as it tells us all kinds of contextual information - e.g. which line you’re making a mistake, or what library is throwing an error.



## Anatomy of a Javascript Error Message

Let’s try to look at a very small Javascript program to see how we can use both the error message and the stack-trace.

This is the reasonably simple program. It consists of three files. The first `index.js` is where the application starts,
the next `some-random-file.js` doesn’t do much - it’s just there to make the stack-trace longer, and `server.js` starts an `express` server listening on port 3000.

<div class="img-div-skyscraper">
<img src="{{site.url}}/assets/img/err-msg/image_4.png"/>
</div>

If we accidentally run this program twice at the same time, we’ll get an error - as the port is already taken. We’ll get the following error message and stack trace.

<div class="img-div-skyscraper">
<img src="{{site.url}}/assets/img/err-msg/image_5.png"/>
EADDRINUSE? That's probably some sort of spell.
</div>

Stack-traces (often) go from the oldest entries in the bottom to the newest on the top. Let's see if we can split this one into into several parts.

### Startup-noise

These often happen when using frameworks. What they have in common, is that they’re usually runtime initialization logic, and most of the times they have nothing to do our actual error.

It can be hard to tell what’s startup-noise when starting out, but after having seen a few errors you usually learn to tune it out pretty quickly.
A good rule of thumb is that anything between the **first line of your code** and the start of the stack trace is potentially startup-noise.

In this particular example, the first line is startup-noise.

### Your code

This is the code you’ve written. You can usually tell what code is yours from the file names or paths.
In this case we can see: `"/home/geewee/WebstormProjects/myproject/index.js:5:1"`
which is the path to our `index.js` file.

There’s two parts of our code are a little more special than the others. The **first line of your code** is important, as the lines before it are often startup-noise.

The most important part however, is the last line of your code.

### Last line of your code.

This is often where the magic happens.
What you’re looking for is the last line of the stack trace that you wrote.
This means the last line that's not from the language runtime or libraries you’re using.
It's usually the most interesting line, as this is the last line where you could have made a mistake.

In this particular example, the last line of our code is:
`"module.exports.startServer (/home/geewee/WebstormProjects/myproject/server.js:8:9)"`

That means **server.js** line 8 is a good place to start looking for what we’re doing wrong.

### Line after the last line of your code

This line is important, if it exists because it usually tells us what library or third party code the error happens in. In this case, the line is:

`"Function.listen (/home/geewee/WebstormProjects/myproject/node_modules/express/lib/application.js:618:24)`"

Worth noting here, is that the path is from our project directory into `node_modules\express\`.

Now `node_modules/` is the directory where Javascript stores libraries. This means that the error is happening within the `express` library. This is useful because we want to know this when figuring out what we should search for later.

### Internal third party calls

If the actual error happens in a third party library, there will often be some internal calls before the actual error is thrown. The internal third party calls are the lines between the last lines of your code and the actual error message. They sometimes give more context as to what exactly is going wrong, but often they’re not that important.

### The actual error message:

The last important part is the actual error message. It’s not necessarily at the very top of the stack trace, but it’s usually pretty close. In this case it’s this part:

`Error: listen EADDRINUSE :::3000`

This is the part we’ll be using in our search queries. In this case the error message can roughly be translated to "Address 3000 in use" - but you would be excused for not knowing that. It’s not a very good error message.

Looking at the entire error message again, with the different parts annotated, it looks like this:

ADD IMAGEEEE

## Anatomy of a Python Error Message

Let’s try to look at the same situation in Python, to see how stack-traces vary from language to language.
This is mostly the same program as before with the same files.
The only difference is, that it uses the Python framework called `bottle` instead of `express` to listen to port 3000.

<div class="img-div-skyscraper">
<img src="{{site.url}}/assets/img/err-msg/image_6.png"/>
</div>

Just as before, if we run multiple instances of the program, we get an error:

<div class="img-div-skyscraper">
<img src="{{site.url}}/assets/img/err-msg/image_7.png"/>
</div>

There’s a few notable differences to this stack-trace (which Python prefers to call a trace-back.)
The most obvious one is, that it’s in a different order.

In the Javascript example, the oldest calls were at the bottom, but as this python example helpfully points out, here the most recent calls are at the bottom instead.

There’s also no startup-noise, the stack-trace starts right at the line of our code where the error happens.

Apart from that, the rest of the parts are the same, let's take a closer look.

There’s "our code" - both first and last line. The first line is also the first line of the stack trace:

```
File "index.py", line 5, in <module> 
    some_random_function_that_starts_a_server()
```

and there’s the last line of our code:

```
File "/home/geewee/PycharmProjects/myproject/server.py", line 12, in start_server
	run(host='localhost', port=3000)
```

Then there’s the first line of the third-party code:

```
File "/home/geewee/PycharmProjects/myproject/venv/lib64/python3.7/site-packages/bottle.py", line 3127, in run
	server.run(app)
```

Worth noting here is that `/site-packages/` is where python stores third-party libraries. So based on that directory we know the next call is to a third party library.
Reading the directory name, `bottle/` - we can guess that the error is coming from the `bottle` library.

Then there’s internal third party calls in the bottle library, and at the end, the actual error message:

`"OSError: [Errno 98] Address already in use"`

A little better than the one from express, but still not as good as it could have been.

If we annotate the stack-trace with the different parts, it looks like this:

TODOOOO

## Fifty Shades of Stack Traces

Now, the two stack traces we’ve seen here are reasonably identical - there’s potentially some startup noise, some of our code and an error thrown in a third party library. Now not all error conditions are like that, so not all stack traces are like that either.

### Third Parties Not Allowed

Sometimes there’s no **third-party** calls, as this Java example shows us:

**public class ****Main {**

**   ****public static void ****main****(String[] args) {**

**       ****// Program starts here**

**       ****_randomFunction_****()****;**

**   ****}**

**   ****public static void ****randomFunction****(){**

**       String s = ****null;**

**       ****// Program crashes here**

**       ****int ****lengthOfNullString = s.length()****;**

**   ****}**

**}**

This program tries to figure out the length of a java **String, **which has been assigned to null. Running this program gives us a very minimal stack-trace:

**Exception in thread "main" java.lang.NullPointerException**

**    at Main.randomFunction(Main.java:9)**

**    at Main.main(Main.java:4)**

Note there’s no startup-noise, no third party code. There’s only our code, ending at the exact line where we’ve made our mistake. If there’s no third-party code, the "last line of our code" is often the first place to go.

### But where’s my code?

Now let’s look at an example using a large framework where we’ll cause an error without really having any of our code in the stack-trace. This is an example using the kotlin language, and the very popular Spring Boot library which works with both Java and Kotlin. We’ll define a very small application with two classes that both want to listen to the same endpoint - and that just can’t be.

**@SpringBootApplication**

**class ****MyprojectApplication**

**// This is the main function, this is where the application kicks off.**

**fun ****main****(args: Array<String>) {**

**   ****_runApplication_****<MyprojectApplication>(*args)**

**}**

**// This is a controller that responds to web requests**

**@RestController**

**class ****RestController {**

**   ****// This means that this controller will respond to the /hello endpoint**

**   ****@RequestMapping****(****"/hello"****)**

**   ****fun ****helloWorld****() = ****"Hello world!"**

**}**

**@RestController**

**class ****IdenticalRestController {**

**   ****// This controller will also respond to the /hello endpoint, oops!**

**   ****@RequestMapping****(****"/hello"****)**

**   ****fun ****helloWorldNumberTwo****() = ****"I want to be a REST controller too!"**

**}**

The stack-trace we’ll get is this behemoth:

org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'requestMappingHandlerMapping' defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class]: Invocation of init method failed; nested exception is java.lang.IllegalStateException: Ambiguous mapping. Cannot map 'restController' method

public java.lang.String dk.gustavwengel.myproject.RestController.helloWorld()

to {[/hello]}: There is already 'identicalRestController' bean method

public java.lang.String dk.gustavwengel.myproject.IdenticalRestController.helloWorldNumberTwo() mapped.

    at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1699) ~[spring-beans-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:573) ~[spring-beans-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:495) ~[spring-beans-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:317) ~[spring-beans-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:222) ~[spring-beans-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:315) ~[spring-beans-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199) ~[spring-beans-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.beans.factory.support.DefaultListableBeanFactory.preInstantiateSingletons(DefaultListableBeanFactory.java:759) ~[spring-beans-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:869) ~[spring-context-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:550) ~[spring-context-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:140) ~[spring-boot-2.0.4.RELEASE.jar:2.0.4.RELEASE]

    at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:762) [spring-boot-2.0.4.RELEASE.jar:2.0.4.RELEASE]

    at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:398) [spring-boot-2.0.4.RELEASE.jar:2.0.4.RELEASE]

    at org.springframework.boot.SpringApplication.run(SpringApplication.java:330) [spring-boot-2.0.4.RELEASE.jar:2.0.4.RELEASE]

    at org.springframework.boot.SpringApplication.run(SpringApplication.java:1258) [spring-boot-2.0.4.RELEASE.jar:2.0.4.RELEASE]

    at org.springframework.boot.SpringApplication.run(SpringApplication.java:1246) [spring-boot-2.0.4.RELEASE.jar:2.0.4.RELEASE]

    at dk.gustavwengel.myproject.MyprojectApplicationKt.main(MyprojectApplication.kt:26) [main/:na]

    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:1.8.0_181]

    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[na:1.8.0_181]

    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[na:1.8.0_181]

    at java.lang.reflect.Method.invoke(Method.java:498) ~[na:1.8.0_181]

    at org.springframework.boot.devtools.restart.RestartLauncher.run(RestartLauncher.java:49) [spring-boot-devtools-2.0.4.RELEASE.jar:2.0.4.RELEASE]

Caused by: java.lang.IllegalStateException: Ambiguous mapping. Cannot map 'restController' method

public java.lang.String dk.gustavwengel.myproject.RestController.helloWorld()

to {[/hello]}: There is already 'identicalRestController' bean method

public java.lang.String dk.gustavwengel.myproject.IdenticalRestController.helloWorldNumberTwo() mapped.

    at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping$MappingRegistry.assertUniqueMethodMapping(AbstractHandlerMethodMapping.java:580) ~[spring-webmvc-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping$MappingRegistry.register(AbstractHandlerMethodMapping.java:544) ~[spring-webmvc-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.registerHandlerMethod(AbstractHandlerMethodMapping.java:265) ~[spring-webmvc-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.lambda$detectHandlerMethods$1(AbstractHandlerMethodMapping.java:250) ~[spring-webmvc-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at java.util.LinkedHashMap.forEach(LinkedHashMap.java:684) ~[na:1.8.0_181]

    at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.detectHandlerMethods(AbstractHandlerMethodMapping.java:248) ~[spring-webmvc-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.initHandlerMethods(AbstractHandlerMethodMapping.java:218) ~[spring-webmvc-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.afterPropertiesSet(AbstractHandlerMethodMapping.java:188) ~[spring-webmvc-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping.afterPropertiesSet(RequestMappingHandlerMapping.java:136) ~[spring-webmvc-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1758) ~[spring-beans-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1695) ~[spring-beans-5.0.8.RELEASE.jar:5.0.8.RELEASE]

    ... 21 common frames omitted

There’s no reason to dissect it, but it starts with our main method and then there’s nothing of our code after that. Luckily if we can find the error message in all the clutter, it’s reasonably good:

**Ambiguous mapping. Cannot map 'restController' method**

**public java.lang.String dk.gustavwengel.myproject.RestController.helloWorld()**

**to {[/hello]}: There is already 'identicalRestController' bean method**

Often if there’s no code of yours in the stack-trace, there’s some configuration that’s gone wrong in a framework. These errors can be hard to debug - especially if you’re new to the framework or the error message is bad.

## Summary

We’ve seen how we can take an error message and divide it into different parts. We’ve discussed what parts are important, and what parts can usually be ignored. In the next part we’ll talk about how to select the right terms when searching, and how googling error messages is actually a process where you learn as you go, not just one where you find answers.

*Are you excited for the next part? Did you have any thoughts on this one, or do you just want to gush about how that Elm error message was really great? Reach out to me on twitter at **[@GeeWenge*l](https://twitter.com/GeeWengel)
