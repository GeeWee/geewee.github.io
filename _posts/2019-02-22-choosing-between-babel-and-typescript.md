---
title: "Choosing between Babel and TypeScript"
short: "Projects using babel can now use TypeScript without having to include the typescript compiler. But should you? We look
at the pros and cons of each."
permalink: "/babel-vs-typescript"
---

Babel 7 shipped about six months ago with built-in TypeScript syntax support.
This means that projects using Babel can now use TypeScript, without ever needing to complicate their builds with the TypeScript compiler.

But what are the differences between using Babel and the TypeScript compiler? And should you use Babel or TypeScript for your next project?

## The differences between Babel and TypeScript

There are some major differences between using TypeScript and using TypeScript with Babel.

In this post, we’ll look at the four most important differences.

### 1. No type checking

Babel doesn’t care about your fancy TypeScript types. It just throws them in the trash, without checking that they’re right.
The example below compiles without any errors or warnings with Babel, but not with TypeScript:

```typescript
const myCoolString: string = 9;
```

<div class="code-caption">9 is definitely not a string Babel.</div>

Removing the types can be excellent for quick prototyping where you want the code to compile, even if your types aren’t on-point.

If you’re going through the effort of typing things, at some point you’ll probably want to check that they’re right.
Luckily it’s not a big deal. You can either let your editor take care of it, or run `tsc --noEmit` which typechecks your project, without compiling anything.

### 2. Const enums

TypeScript by default compiles an entire project at once, while Babel only compiles one file at a time.

This means that Babel doesn’t support TypeScript features that require reading multiple files. The good news is that’s not a lot of features.
The most widespread is probably `const enums`.

A `const enum`is an enum that TypeScript compiles away to nothing. Let’s take a look at how to use it, and what the transpiled code is:

```typescript
// This is the const enum. Notice the const in front.
const enum FRUITS {
   APPLE = 'APPLE',
   PEAR = 'PEAR',
}

if (someString === FRUITS.APPLE){
   console.log("This is an apple!"
}
```

The transpiled code is this very short snippet:

```typescript
if (someString === "APPLE" /* APPLE */) {
  console.log("This is an apple!");
}
```

Bam! The entire enum construct is gone, and TypeScript simply inlines `FRUITS.APPLE` to the value of `“APPLE”`.

But what happens if we export this `const enum` and try to use it in another file? Babel isn’t able to inline `FRUITS.APPLE` from another file, as it only has access to one file at a time. Instead, it’ll simply throw an error.

This isn’t too grave of a limitation. Const enums are usually only used to performance optimize regular enums, which Babel supports just fine.  
Unless you’re absolutely sure you need that extra juice, I wouldn’t worry too much about this.

### 3. Decorators & metadata

TypeScript was a bit early to the decorator party (if you’re unsure what a decorator is, [this](https://www.sitepoint.com/javascript-decorators-what-they-are/) is a fine introduction). After TypeScript implemented decorators the decorator proposal has changed multiple times and is still not finalized.

What that means is that currently the ECMAScript spec and TypeScript don’t quite see eye-to-eye on how decorators should behave. Babel's plugins follow the ECMAScript spec, which means that Babel doesn’t compile decorators the same way that TypeScript does. Luckily for us, Babel has a `legacy` mode, to compile decorators with the old behaviour.

Simply add the babel plugin

`“@babel/plugin-proposal-decorators”`

with the `legacy` option set to **`true`**

However, there’s one decorator feature that TypeScript provides, that Babel does not: **`emitDecoratorMetadata`**.

TypeScript normally erases all type information so it doesn’t exist at runtime. `emitDecoratorMetadata` is a feature that keeps the types around for classes and methods that have a decorator applied to them.

Having the type at runtime allows us to do all sorts of fancy things, such as Dependency Injection, and mapping the TypeScript types, to types in an SQL Database.

The feature sees reasonably heavy use in those two areas, with libraries such as TypeORM, TypeGoose, inversifyJS, and even Angular’s dependency-injection system depending on this feature.

The lack of `emitDecoratorMetadata` is probably my biggest issue with using Babel. Some of the libraries that depend on this feature are tremendously useful, but you can’t use them with Babel.

### 4. Custom transformations

Babel is much more extensible than TypeScript. There’s plenty of plugins that optimize your code, helps you strip out unused imports, inlines constants and much more.

While TypeScript has its own Transformer API which allows for custom transformations, the Babel ecosystem is both richer in plugin-choices, and much more accessible.

If you need custom transformations you’ll need to use Babel. The good news is that most TypeScript tools allow you to both use TypeScript, and then run the code through babel afterwards, to get the best of both worlds. But this obviously comes with additional complexity in your build-chain. 
### Other incompatibilities & inconsistencies

There are a few other incompatibilities, mostly related to syntax restrictions and legacy TypeScript features. They shouldn’t be a blocker for anyone, but they’re listed in the announcement [here](https://blogs.msdn.microsoft.com/typescript/2018/08/27/typescript-and-babel-7/).

### Performance

I’ve tried to compile a React app with both TypeScript and Babel 7, and I’ve been unable to tell any significant difference, both when live-reloading and from a warm cache. The benchmark was made against [ts-loader](https://github.com/TypeStrong/ts-loader), which historically has been the slowest of the two webpack loaders for TypeScript (the other one being [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)).

Of course, as anyone who’s tried to configure webpack knows, JavaScript toolchains feel immensely complicated. You have source-map plugins, caching, choices between how many threads you should use — the list goes on. No simple benchmark can take the full story into account, but if you’re expecting a many-fold increase using Babel over the TypeScript compiler, you’ll have to look for your performance gains elsewhere.

### What should you choose

As many JavaScript developers, I like shiny new things. When I started writing this article, I hoped that switching to Babel would both simplify our build-chain, and provide a more performant build, with very few downsides.

Unfortunately, my conclusions were quite the opposite. There are no notable performance improvements, and the downsides are also much larger than I originally anticipated. 

In particular, Babel not emitting decorator metadata is a huge deal breaker for me. For that reason alone, I wouldn’t recommend switching to Babel, if you have a working TypeScript project.

Babel can be fine as training-wheels if you’re just starting out with TypeScript or you’re looking to migrate a project gradually. At some point, you’ll probably want to take the training wheels off though. If you need some of the custom transformations that only Babel provides, the best build pipeline is still to pass the TypeScript files to the TypeScript compiler and then to Babel afterwards.

It’s a little too complicated for my tastes but hey — nobody ever said JavaScript build toolchains were easy.

Do you have any experiences with TypeScript and Babel? I’d love to hear them._ [_@GeeWengel_](https://twitter.com/GeeWengel) 