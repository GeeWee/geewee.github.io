---
title: "Converting a React Codebase to Typescript. Part 1: Getting it to compile"
draft: true
permalink: '/converting-typescript-to-javascript-part-1'
short: "This is the first in a series of blog post that will deal with gradually converting an existing React codebase to Typescript
        and ending up with a completely typechecked codebase. This part deals with getting the first TypeScript file to compile along with the rest of the application."
---

This is the first in a series of blog post that will deal with gradually converting an existing React codebase, [Flatris](https://github.com/skidding/flatris) by [@skidding](https://twitter.com/skidding) to Typescript
and ending up with a completely typechecked codebase. This part deals with getting the first TypeScript file to compile along with the rest of the application.

**_This part of the blog post has taken approximately four hours, including all the mistakes and dead-ends I didn't write about (but not including the writing)_**


I’ve recently become interested in the process of converting an existing javascript codebase to typescript.
Typescript and React play wonderfully together, and I’ve started quite a few projects with them, but I’ve never been in the situation of having to convert an already existing codebase.

Getting buy-in from your managers to convert an entire codebase at once is not always possible, so our goal is to do a *gradual* conversion, where we can keep Javascript and Typescript side by side until our conversion is complete.
This means that some parts of the team can work on the migration, while others can develop new features and fix bugs.

# Flatris

We’ll be porting [Flatris](https://github.com/skidding/flatris). Flatris is a tetris implementation in React and Redux, with full offline capabillities and autosave.

<div class="img-div">
<img src="{{site.url}}/assets/img/flatris.png"/>
It also shows you the entire state of the game - probably not safe to give to your grandma unless you're willing to answer <strong>a lot</strong> of questions
</div>

Flatris is a good pick to port, as it’s written in very idiomatic react/redux and of manageable size, about 2000 lines of code.


# Plugging in the Typescript compiler

Flatris uses **Create React App(CRA)**, which makes life easy for us. CRA works by having an internal module called "**react-scripts**"
that deal with most of the build configuration. Luckily someone’s made **react-scripts-ts (RST),** which is the typescript equivalent. 

## Copy-and-pasting our way to victory

I’ve experimented with a few different ways of doing the porting, and the easiest is to create a new project with react-scripts-ts, and then copy all the files from react-scripts-ts into the Flatris project.
We create the new app with the following commands:
```
npm install -g create-react-app # Or use yarn

create-react-app flatris --scripts-version=react-scripts-ts
```

This creates a repository that’s fully established with all the files needed to start a brand new Typescript project.
Now we’ll copy all files related to the typescript configuration to our old project.
The list of files we need to copy over is:
```
tsconfig.json
tsconfig.test.json
tslint.json
```

After copying the files, we’ll copy all the dependencies in our package.json from our new project into our old package.json, making sure to remove dependencies that are now listed twice.

After fixing the dependencies, we’ll want to change the scripts in our package.json

As RST is a drop-in replacement for react-scripts, we can simply change each occurrence of *"react-scripts"* to *“react-scripts-ts”* and it should work.

Now let’s install our dependencies and try running Flatris..
 
```
 yarn install
 yarn start
```

I can already tell you now, that it's not going to go well the first time around. It's time for a game of:

<div class="img-div">
<img src="{{site.url}}/assets/img/cat-whack-a-mole.gif"/>
</div>

## Error Whack-A-Mole

### Can't find index.tsx

```
Error: Can’t find index.tsx
```

RST expects our entry point to be a tsx file, so let’s go ahead and rename index.jsx it to index.tsx

### React has no default export

```
Error: (1,8): Module/flatris/node_modules/@types/react/index"' has no default export.
```

Now this is a bit of an interesting error. In the Javascript most if not all transpilation happens via babel, and babel has made some choices in regards to interoperabillity of the different module formats.

What babel does is, if there’s a module.exports defined in a module, but no default export, it automatically assigns the entirety of the module.exports to the default export as well.
[This is usually referred to as a fake or synthetic default export](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/5128#issuecomment-131638288)
This synthetic default export is what allows lines such as:

```
import React from "react";
```

That you’ll see in most React codebases. It means we’re importing the default export from the react package and naming it React.

The React package doesn’t actually have a default export, it just has a bunch of named ones, but this works because babel creates the synthetic default export out of all the named exports. [Typescript decided not to do this](https://github.com/Microsoft/TypeScript/issues/2719).

Luckily the fix is simple. In our index.tsx simply change:

```
import React from ‘react’
```
to
```
import * as React from ‘react’
```

### Could not find declaration file for module
**Error: (3,26): Could not find a declaration file for module 'react-redux'. ’flatris/node_modules/react-redux/lib/index.js' implicitly has an 'any' type.**

```
Try `npm install @types/react-redux` if it exists or add a new declaration (.d.ts) file containing `declare module 'react-redux';`
```

This is because we’re trying to import react-redux, but we don’t have any type files defined for the module. The right solution is to make sure we have type definitions for our modules, but right now we’re more interested in getting our project to compile.

Typescript normally allows us to use untyped javascript modules without any problems, but you can opt-in to more comprehensive checking. The tsconfig that was generated from us from RST has opted-in to some increased strictness for us. 

The extra strictness makes sense when you’re starting out on a new project, but right now we’ll want to opt out of it.

Let’s go to our **tsconfig.json** file and remove the following lines:

```
"noImplicitAny": true
"strictNullChecks": true
```

RST also refuses to compile if we get any TSLint errors - which isn’t what we want right now. We can also turn this off in the **tslint.json** file by adding the following line:

```
"defaultSeverity": "warning",
```

This will make TSLint only emit warnings instead of errors, which is the default.

### Type errors
```
Error: /flatris/src/index.tsx
(24,76): Property 'game' does not exist on type '{}'.
```

Now we’re past typescript not being able to find modules - we're at the type errors. Progress!

The culprit for this type error is this line:
```
localStorage.setItem('flatrisState', JSON.stringify(store.getState().game);
```

Typescript cannot properly infer the type of store.getState() so it says there is no property game on it.
This is a problem for another time, so let’s now let’s use Typescripts escape hatch - casting the object to `any`,
which completely opts out of typechecking. So the line is now:

```
localStorage.setItem('flatrisState', JSON.stringify((store.getState() as any).game));
```

Luckily that's the only type error in the index file. Let's move on!

### React components contain invalid characters
```
Error: InvalidCharacterError: String contains an invalid character
```
This was an interesting error to fix. If you look at the console the full error message is this:

```
Warning: </static/media/App.e52f775a.jsx /> is using uppercase HTML. Always use lowercase HTML tags in React.
```

That’s **not** what importing App.jsx html should look like - it should be a bunch of html tags.
Turns out RST doesn’t support loading js and jsx files, even though typescript does.

We can fix that though, but we’ll have to go into the tenth circle of hell - the `node_modules` folder.
Now generally changes you make inside `node_modules` aren’t permanent, as they get wiped on every `yarn install`
but they can be if you use the wonderful [patch-package](https://www.npmjs.com/package/patch-package).
Patch-package lets you make permanent changes to `node_modules` folder, and then after each yarn install the changes will be reapplied.

<div class="img-div">
<img src="{{site.url}}/assets/img/dante-inferno.jpeg"/>
Dante never got to write about it, but the tenth circle of hell primarily consists of monkey-patching minified javascript. 
</div>

Let’s try it out. Following the instructions on npm: Add this to your scripts in package.json:
```
"prepare": "patch-package"
```

And install the package.

```
yarn add --dev patch-package postinstall-prepare
```

Now we can make changes in `node_modules` and use patch-package to make them permanent.

Luckily this is an easy change, as typescript already supports parsing js/jsx files, we simply need to tell RST to also include js/jsx files. And luckily for us, RST doesn’t minify its javascript so it’s actually readable.

Let’s go to the development webpack configuration. It's at: `flatris\node_modules\react-scripts-ts\config\webpack.config.dev.js`

Starting at line 161 you’ll find this block:
```javascript
{
  test: /\.(ts|tsx)$/,
  include: paths.appSrc,
  use: [
    {
      loader: require.resolve('ts-loader'),
      options: {
        // disable type checker - we will use it in fork plugin
        transpileOnly: true,
      },
    },
  ],
},
```

This tells webpack to use the typescript loader for .ts and .tsx files. All we need to do is add .js and .jsx to that list, so that line 161 now reads:
```
test: /\.(ts|tsx|js|jsx)$/,
```

and then we run 

```
patch-package react-scripts-ts
```
to make the change permanent.

And of course as the good open source citizens we are, we create a [pull request to RST](https://github.com/wmonk/create-react-app-typescript/pull/242) so others can enjoy our changes.

Now let’s try running `yarn start` again:

<div class="img-div">
<img src="{{site.url}}/assets/img/flatris.png"/>
<strong>Hallelujah! No more errors!</strong>
</div>

The  javascript files now get properly parsed. Now we can slowly start converting our codebase to typescript, without necessarily having to do it all at once.

*This wraps up the first part of this blog series about gradually converting React codebases to Typescript.*
