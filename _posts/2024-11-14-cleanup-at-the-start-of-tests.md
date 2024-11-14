---
title: "You should run cleanup code at the start of your tests"
permalink: '/cleanup-at-the-start-of-tests'
short: |
  Some developers run cleanup code at the end of their tests or in an "afterEach" block - but there's a better way.
---

I recently came across an integration test that demonstrates what I believe is an antipattern.
This particular test was consistently failing at the start of the test with a "Unique constraint violation" in the database, when calling the `createUser` function.

The test with the irrelevant details omitted looked like this:

```typescript
it(() => {
    // Setup
    someOtherSetupCode();
    createUser({id: "TEST_ID"});
    
    // Actual test code

    // Cleanup
    someOtherTeardownCode()
    deleteUser({id: "TEST_ID"})
})
```

Some test setup, some test code and some cleanup at the end. I think this is a reasonably standard (even logical) way to organize your tests.
However, I think this isn't a great way to organize your tests, for one reason in particular: **The cleanup code might never run.**

Putting test cleanup code at the end of the test generally means it won't run if the test fails.

In this case that meant we ended up in a particularly insidious loop, where if the test failed once it could never pass without human intervention.
This is because `createUser` would throw a unique constraint error if the `id` had already been used, which meant the test would never run, which meant we could never reach the cleanup code.

## First alternative: beforeEach and afterEach
A better alternative if your testing framework supports it, is to use hooks for running code before and after each test, such as `beforeEach` and `afterEach`.
This would make the test code look like this:

```typescript
beforeEach(() => {
    someOtherSetupCode();
    createUser({id: "TEST_ID"});
})

it(() => {
    // Actual test code
})

afterEach(() => {
    someOtherTeardownCode();
    deleteUser({id: "TEST_ID"});
})
```

However, I still think this isn't quite optimal for a couple of reasons:

The first reason being that we 

However, this still isn't optimal for a couple of reasons.

- The `deleteUser` call is still not guaranteed to run. It might not run if e.g. `someOtherTeardownCode` fails, or if the programmer manually interrupts the test run. This is still better than the first example, because most test frameworks run `afterEach` even if the test fails, so we're not going to end up in a spiral where the test _never_ succeeds, as the user model will be cleaned up eventually.
- Debugging database state is really hard when you always delete the models. If the test fails and you think the issue might be in some database interaction, you're not able to inspect the database state after the test has failed, because you've just deleted all the relevant state.
- Using `afterEach` and `beforeEach` requires that all of your tests share the same state. In many cases this might be perfectly fine, but if your tests have very different setup needs, this might get cumbersome.

# Best Alternative: Clean Up First

I think the very best alternative is that each test ensures that any data that should not exist is deleted at the _start_ of the test, leaving it in the database at the end. The code then looks like this.
```typescript
it(() => {
    // Clean up any potential previous test runs
    someOtherTeardownCode();
    deleteUser({id: "TEST_ID"});
    
    // Ensure consistent state
    someOtherSetupCode();
    createUser({id: "TEST_ID"});
    
    // Actual test code
})
```

This way you are guaranteed your cleanup will always have run before your tests, and if you need to debug anything in the database after the test has failed, it's all still here for inspection.
The only caveat is that you will need your teardown code to work in both the case where there is something to teardown or delete, and in the case where there is not.