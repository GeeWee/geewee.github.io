---
title: "You Should Run Cleanup Code at the Start of Your Tests"
permalink: '/cleanup-at-the-start-of-tests'
short: |
  Some developers run cleanup code at the end of their tests or in an "afterEach" block - but there's a better way.
---

I recently came across an integration test that demonstrates what I believe is an antipattern.
This particular test was consistently failing at the start with a "Unique constraint violation" in the database when calling the `createUser` function.

The test, with irrelevant details omitted, looked like this:

```typescript
it(() => {
    // Setup
    someOtherSetupCode();
    createUser({id: "TEST_ID"});
    
    // Actual test code

    // Cleanup
    someOtherTeardownCode();
    deleteUser({id: "TEST_ID"});
})
```

This approach to organizing your test with some setup, some test code, and some cleanup at the end might seem logical.
However, there's a significant flaw: **The cleanup code might never run.**
When we put the cleanup code at the end of the test, it means it won't run if the test fails.

In this case, that meant we ended up in a particularly problematic loop: if the test failed once, it could never pass without human intervention. This was because `createUser` would throw a unique constraint error if the `id` had already been used, which meant the test would not proceed, preventing the cleanup code from ever running.

## First Alternative: beforeEach and afterEach
A better alternative, if your testing framework supports it, is to use hooks for running code before and after each test, such as `beforeEach` and `afterEach`. This would make the test code look like this:

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

However, this still isn't quite optimal for a few reasons:

- The `deleteUser` call is still not guaranteed to run. It might not run if, for example, `someOtherTeardownCode` fails, or if the programmer manually interrupts the test run. This is still better than the initial example because most test frameworks run `afterEach` even if the test fails, so we avoid a scenario where the test _never_ succeeds—eventually, the user model will be cleaned up.
- Debugging database state is challenging when you always delete models at the end. If the test fails and you suspect an issue with a database interaction, you can't inspect the database state after the test has failed because you've already deleted all the relevant data.
- Using `beforeEach` and `afterEach` requires that all of your tests share the same state. This may be fine in many cases, but if your tests have very different setup needs, it can become cumbersome.

## Best Alternative: Clean Up First

The best approach, in my opinion, is for each test to ensure that any data that should not exist is deleted at the _start_ of the test, leaving it in the database at the end. The code would look like this:

```typescript
it(() => {
    // Clean up any potential leftover state from previous test runs
    someOtherTeardownCode();
    deleteUser({id: "TEST_ID"});
    
    // Ensure consistent state
    someOtherSetupCode();
    createUser({id: "TEST_ID"});
    
    // Actual test code
})
```

This way, you guarantee that the cleanup always runs before the test, and if you need to debug anything in the database after a test failure, all relevant data is still available for inspection.
The only caveat is that your teardown code must handle both cases: when there is something to clean up and when there isn't.

