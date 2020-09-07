---
title: Programming by voice in 2019
short:
  "In this post we’ll look at what it means to program by voice in 2019 as well
  as what the future may bring."
permalink: "/state-of-voice-coding-2019/"
---

Some software developers may not have the full use of their hands, whether due to a condition like carpal tunnel syndrome or another reason. For these developers, using a keyboard and mouse may be difficult or even impossible. I’ve written about where the state of coding by voice was at [in 2017](https://medium.com/bambuu/state-of-voice-coding-2017-3d2ff41c5015), and unfortunately, most of the things in the article haven’t changed. Voice coding is not a fast-moving field.

If this is your first article looking at voice coding, I’d advise you to read that article, as it covers many of the fundamental technologies and aspects of the field.

Even though things move slowly, they’re not at a standstill. Let’s take a look at some of the highlights from the last two years, and what the future might bring.

## The technology is improving

### Speech recognition accuracy

There are some fundamental requirements to control your computer via your voice.
One of these requirements is that your computer can understand you. Previously it’s been difficult to get speech accuracy to a level where it didn’t hinder the experience of voice coding. If that hasn’t changed already, it’s about to.

As digital assistants you can speak to (like Siri, Cortana, Alexa and Google Assistant) gain popularity, we’re going to keep seeing improvements in the accuracy of which computers can recognize our voices, even in noisy environments.

To get an accuracy that was good enough, voice coding has traditionally needed pretty expensive microphones. My recommendation has been a \$300 [Audix OM7](https://audixusa.com/docs_12/units/OM7.shtml) stage microphone — but it’s large, unwieldy, and requires an amplifier.

Digital assistants use a different strategy to reduce noise. They use multiple microphones, and some [hefty machine learning](https://www.forbes.com/sites/quora/2017/05/18/with-the-expansion-of-google-assistant-google-home-is-about-to-get-a-lot-more-powerful/), to distinguish noise from voice.

Currently, I’m not aware of any headsets you can buy with multiple microphones, but it won’t be long before we see some inexpensive headsets that let us dictate with a high accuracy in any environment. If you’re looking for something now, apart from the Audix, I’ve been recommended the [d:fine](https://www.dpamicrophones.com/dfine-headsets-and-earsets) headset and the [Steno SR](https://talktech.com/stenomask-steno-sr/) microphone.

This technology is evolving fast, and I predict that within five years, we’ll end up with what is essentially close-to perfect speech recognition.

### Fundamental software improvements

Today, most of the voice coding software available relies on the [Dragon](https://www.nuance.com/dragon.html) voice-recognition software from Nuance, and the open-source Dragonfly framework.

Dragonfly was previously unmaintained (the last commit was three years ago) — but currently a [fork is picking up steam](https://github.com/dictation-toolbox/dragonfly), and has been actively maintained for quite a while.

Dragonfly used to only work with older versions of Dragon, but due to some other recent developments, it now works with the newest versions. That means that we get all of the previously mentioned improvements in speech recognition accuracy.

These updates might not sound particularly interesting, but the reality is that almost all voice-coding technologies I’ve been able to find are built upon Dragon and Dragonfly. Any improvements to those libraries can potentially ripple through the entire ecosystem, providing everyone with a better experience.

## A challenger appears — an introduction to Talon

[Talon](https://talonvoice.com/) is currently the most promising project for hands-free coding.   It allows you to control your computer in a variety of ways. Talon’s out-of-the-box voice coding is very reminiscent of how [Tavis Rudd does it](https://www.youtube.com/watch?v=8SkdfdXWYaI).

Lots of short words map to letters and syntax, which provides good efficiency, but can be hard to learn. Talon also comes with the ability to define your own rules (when I say “X” do “Y”).

If that’s all it was, it would be much like using many of the Dragonfly-based solutions that are already out there. Talon goes beyond that. For one, it allows you to control your mouse via eye-tracking. While normally eye-tracking has issues replacing the mouse, as eyes have a hard time focusing on small objects, such as links or tiny buttons.

Talon fixes this by combining the eye-tracking mouse with a voice-controlled zoom, or head tracking for precision movements. You can see the zoom [here](https://www.youtube.com/watch?v=VMNsU7rrjRI&list=PL2wTcyeSmhsbPZYt65mRiKSeuq6WU-rXZ&index=1).

The later releases also come with a built-in speech-recognition engine, so you don’t have to shell out the big bucks for a Dragon license. [Ryan Hileman](https://twitter.com/lunixbochs), who is the creator, is working on Talon full-time.

Like anything, Talon has downsides. It’s currently MacOS only, and it’s not as well-documented as I’d like. It does, however, come with a very active [Slack community](https://talonvoice.slack.com/messages) where you can ask questions.

Right now, Talon is definitely the project to watch going forward. You can see it in action [here](https://www.youtube.com/watch?v=HsodtJY0BX8&list=PL2wTcyeSmhsZuHqbSlLAxkroWIuIpExwx).

## What about the rest of my tasks?

Inputting text into an editor is only a small part of coding. We also need to search the web, send mail, open programs and control terminals. These things aren’t as niche as programming, so there are a few different solutions out there to manage this.
Let’s have a look at some of the different tools available.

<div class="img-div">
<img src="{{site.url}}/assets/img/stackoverflow-bar.png" />
Of course the real question is, which one will let you search fastest on
stackoverflow 
</div>

[**KnowBrainer**](http://www.knowbrainer.com/) is a layer on top of Dragon that allows us to extend it with commands to e.g. interact with GUI programs. It allows for very impressive mouse and keyboard simulation. Watch it in action [here](https://www.youtube.com/watch?v=IswK9r3KjRA).

[**Utter command**](http://redstartsystems.com/uttercommand) allows you to efficiently navigate in the Windows file system and applications. It’s a reasonably old product, but it’s completely flown under my radar. I’m not sure whether it still works on modern versions of windows, but their website is a goldmine for knowledge related to speech input.

[**Intag Speech Interface**](http://voicecomputer.com/a-game-changing-speech-interface/) for [VoiceComputer](http://voicecomputer.com/) is one of the most promising things I’ve seen yet. It superimposes numbers on top of regular buttons in Windows programs, which means that you’re able to interact with almost anything.   Mouse control is generally one of the weaker points of hands-free computing, but this could be a game-changer for that. Check out the demo [here](https://youtu.be/yq2zXvLQXB0?t=50).  

[**Dragon**](https://www.nuance.com/dragon.html) ships with browser plugins that allow you to remote control your browser.

If you’re not using Dragon or you’re looking for something that builds on top of their browser plugins, there’s this wonderful browser plugin by James Stout, of [handsfreecoding.org](http://handsfreecoding.org/). It’s called [modeless-keyboard-navigation](https://addons.mozilla.org/en-US/firefox/addon/modeless-keyboard-navigation/), and it lets you control much of your browser with shortcuts.   You can then hook your voice commands up to these shortcuts to control your browser via voice. 
## Editor & language support

You generally see a lot of voice coding being demonstrated with Python. Python has a lot of very strong points as a language. It’s concise and the syntax is reasonably human readable. 

In my opinion, any language well suited for voice coding needs two different qualities, and as we’ll see, python only has one of them.

### Conventions for naming things with human-readable names

The first thing that’s needed is strong conventions. We want a language where there’s a convention for the variable casing, but also where there’s a convention for using “real” words for variable names. Let’s take a look at why. 
Let’s say we want to declare a variable:
```c#
var clientContextId = // whatever
```

An example of a voice command that would declare this could be the following:  
_“variable client context id”_

<div class="img-div">
<img src="{{site.url}}/assets/img/voice-coding-2019-voice-example-1.png" />
</div>

This can “just work” because of these two aspects. A convention for capitalization means we know the variable name will be in camelCase. The convention for using real words for variable names means there’s no friction where we have to spell things out. We just say what we want, and we can let the computer figure out the rest. 

Let’s take a look at the same example, but where we use abbreviations instead of
real words.
We want to define a variable:
```c#
var client_ctx_id = // whatever
```

Here **_ctx_** is an abbreviation for **context**. Now things get a little tricky, as we’ll need to dive into manually spelling it out. An example voice command could be, _“variable client underscore c, t, x, underscore, id”._
Much more cumbersome, and much less elegant. The moment we start using names that we can’t pronounce as words — we lose.

### Static type systems

Python is a very dynamic language — we don’t always know (or care) what type our variables have. However knowing the types of our variables while writing the code, allows for smarter coding by voice.
Let’s take another hypothetical example, of adding a number to a list, in two different languages. C#, which has a static type system, and Python, which does not.
```c#
// C#  
// the 'list' variable is defined somewhere else  
list.add(5)
```

One way of accomplishing this could be to say the following: _“call list add five”_

<div class="img-div">
<img src="{{site.url}}/assets/img/voice-coding-2019-voice-example-2.png" />
</div>

Which the computer will understand as “call the add method on the list variable, with the number five (5) as a parameter”

This is pretty pleasant, but it requires that our editor understands where we are in our code right now. It needs to understand what variables are in scope, what methods exist on them, and what parameters they take. 
Let’s try the same with a Python example:
```python
#python  
#list is defined somewhere else  
list.append(5)
```

If we say _“call list append five”_ as above, we’re unable to figure out whether or not there’s a method called `append` that takes five as a parameter, or whether there’s a method called `append_five`or even whether “five” is a number or the literal word "five".
 
<div class="img-div">
<img src="{{site.url}}/assets/img/voice-coding-2019-voice-example-3.png" />
</div>

We’ll end up needing to add some extra words, to explain where the function name stops, and the arguments begin. An example of this slightly longer command could be, _“call list append parameters five”._ 

These examples are all hypothetical. Unfortunately, there’s no editor that works together with voice-coding software right now. But in the future, I think we’ll be able to get a much better experience out of languages that are more analyzable.  

We’re also much more resistant to errors in the speech recognition. Even if the computer heard “**call list bat**” instead of “**call list add**” in the C# example above, it would be able to call the right method as “bat” is reasonably close to “add”. 

## Conclusion
Voice-coding is still progressing at a reasonable pace. We are about to reach the point where voice recognition is as good as it gets, and then we’ll only be limited by our editors.

At some point, voice-coding is going to transcend simply pretending our mouth is a keyboard. But one of the prerequisites for this is that our editor, and by extension our languages, are smart enough to let that happen.

<div id="mc_embed_signup">
<form action="https://gustavwengel.us17.list-manage.com/subscribe/post?u=4665de11d74ac82100225dbce&amp;id=7b0d34b957" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
    <div id="mc_embed_signup_scroll">
	<label for="mce-EMAIL">Sign up for news about RSI and Voice Coding</label>
	<input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required>
    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_4665de11d74ac82100225dbce_7b0d34b957" tabindex="-1" value=""></div>
    <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
    </div>
</form>
</div>