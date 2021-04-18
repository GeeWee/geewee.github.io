---
title: "How to Optimize .NET Pipelines in Azure DevOps (Or how I made my pipeline 50% faster)"
permalink: "/optimize-dotnet-piplines-azure"
short: |
    I recently became frustrated with the speed of my Continuous Integration pipeline for .NET. I thought it was way slower than it should have been. I spent some hours debugging, and here's how I managed to make my continuous integration pipeline run faster.
---

I recently became frustrated with the speed of my C# Continuous Integration pipeline. I thought it was way slower than it should have been. I spent some hours tweaking and here's how I managed to make my continuous integration pipeline about 50% faster, taking it from 6 to 3 minutes.

The repository that the pipeline runs for is a decently large mono-repository with 20+ C# projects inside it.
Our tests also rely on a number of third party dependencies that we need to run as docker containers in our integration tests.

The original pipeline YAML looked like this:
```yaml
# Trigger this pipeline on all branches
trigger:
  branches:
    include:
      - "*"

### Create service containers for tests
resources:
  containers:
    - container: sql-server
      image: "mcr.microsoft.com/mssql/server:2019-CU10-ubuntu-20.04"
      ports:
        - 1433:1433
      env:
        ACCEPT_EULA: "Y"
        SA_PASSWORD: "SomePassword"
    - container: postgres
      image: "postgres:13-alpine"
      ports:
        - 5432:5432
      env:
        POSTGRES_USER: local
        POSTGRES_PASSWORD: SomePassword
    - container: azurite
      image: "mcr.microsoft.com/azure-storage/azurite"
      ports:
        - 10000:10000 # Storage
        - 10001:10001 # Queues

services:
  sql-server: sql-server
  postgres: postgres
  azurite: azurite

pool:
  vmImage: 'ubuntu-latest'

steps:
  - checkout: self
    lfs: true
  - task: UseDotNet@2
    displayName: 'Use .NET Core sdk'
    inputs:
      version: 3.1.x
  - task: DotNetCoreCLI@2
    displayName: ".NET Tests"
    inputs:
      command: "test"
```

And with timings:
<div class="img-div-skyscraper">
<img src="{{site.url}}/assets/img/azure-pipelines-pre-optimization.png"/>
</div>


It ran for a total of 6m40s minutes - whereas a clean dotnet test on my local machine could do the same in little more than a minute. I knew I probably couldn't make it as fast but I figured I'd see what I could do.

Cache NuGet packages [Impact: Negative?]
================================================

The first hammer you normally reach for in a situation like this is caching of external dependencies. Often it's much faster to fetch the third party dependencies from a cache rather than have to calculate it from scratch each time.

This didn't appear to be the case here though.

After trying to follow instructions both from [official microsoft sources](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/caching?view=azure-devops#netnuget) and several guides([[1]](https://blog.soenneker.com/how-to-setup-nuget-caching-in-azure-devops-8d94c57b5321), [[2]](https://blog.soenneker.com/how-to-setup-nuget-caching-in-azure-devops-8d94c57b5321%20https://raunaknarooka.medium.com/make-your-build-pipelines-run-faster-pipeline-cache-part-1-853f18521828), [[3]](http://thecodemanual.pl/2020/03/11/caching-not-only-nuget-packages-on-azure-devops)) I managed to get caching to work. However downloading the cache was consistently slower than just running the "dotnet restore" command. Restoring the cache took approximately 45 seconds by itself, and a dotnet restore happens in under 30.

**Result: This made the pipeline slower by about 30 seconds.**

Configure checkout options [Impact: Large]
=========================================

If you'll notice our git checkout takes a long time. 2 minutes is an **eternity** for a checkout. This was due to two reasons.

The first one is we checked out all [git LFS](https://git-lfs.github.com/) files in each pipeline. We did this because we used some of the files for regression tests. We keep many files in git LFS but used only a few of them in the tests.

As Azure doesn't allow us to selectively pull git LFS files down (it's all or nothing) this meant that we pulled down a lot of extra files that we didn't need for these tests.

Taking the required files out of git LFS and putting them into the regular git repository meant that we didn't need to fetch all of the git LFS files saving us a chunk of time.

Doing this took our checkout time down from 2 minutes to 55 seconds.

We can do better. When pulling a repository azure pipelines generally pulls down the whole repository (with all commits) - however we only really care about the latest commit which is the one we test.

If this is the case we can set the fetch depth to 0 in the checkout step. This takes the checkout time further down from from 55s to 7s.

The full checkout step looks like this:
```yaml
    - checkout: self
      lfs: false
      fetchDepth: 1
```

**Result: Almost two minutes saved**


Segregate the slowest tests [Impact: Medium]
================================================

Some of the tests we were running were slow regression tests operating on a large amount of data.
Back when we wrote them our CI was still fast enough that we could easily run them as part of our "normal" test suite and not just in pipelines designated for slower integration testing.

However in the effort of speeding up the "regular" pipeline we decided to segregate these tests to only run with the rest of the integration tests.
We only had to segregate the slowest 3 tests to speed up our pipeline run by about 30 seconds.

**Result: 30 seconds saved**


Remove "Use .NET Core SDK Step" [Impact: Low]
================================================

Previously the Microsoft Hosted agents didn't have the version of .NET Core that we needed, so we had to install it ourselves.
This has changed since the pipeline was written, so we could remove this task. If you have a step like this, make sure it's still necessary.

**Result: 10 seconds saved**

Do not run pipeline on all commits [Impact: Low]
================================================

Previously we ran the pipelines on all commits on a branch, even if there was no currently active PR.

If you have an unlimited amount of build agents that's fine. As we're not made of money, we did not have unlimited build agents. This meant that we often ended up with a branch "stealing" the build agents from a branch that needed them to complete a pull request. We've done two things to prevent this from happening:

First, we've enabled batching, which means that only the newest commit on a branch is built and older commits are not.

The next change is that we've set the pipeline to only build on our main branches.
Apart from that we have configured it so that this pipeline must pass before merging in a pull request.

These two changes together means that the pipeline will run on our main branches and the tip of every pull request and on nothing else, freeing up our build agents to do the most important work.

The new trigger section looks like this.
```yaml
  trigger:
    batch: true
    branches:
      include:
        - "develop"
        - "master"
```


Unsuccessful Attempts
=====================

Here are a few things I considered or tried that had no impact

-   **Using `dotnet test` in bash vs the `DotNetCoreCLI@2` task from microsoft**
    The `DotNetCoreCLI@2` task does a little more than just running the bash commands, but not enough to make a difference.
-   **Implicit vs explicit restore**
    When running `dotnet test` and the packages have not been downloaded it automatically calls `dotnet restore`. I attempted to see whether or not this was more performant than calling `dotnet restore` manually first. There was no difference.
-   **Speeding up container builds**
    Almost 40 seconds to spin up the required containers is a long time. I looked into whether or not you could speed this up, by e.g. reusing docker layers but you can't [do that without a self-hosted agent.](https://docs.microsoft.com/en-us/azure/devops/pipelines/ecosystems/containers/build-image?view=azure-devops#is-reutilizing-layer-caching-during-builds-possible-on-azure-pipelines)

Result
====================

<div class="img-div-skyscraper">
<img src="{{site.url}}/assets/img/azure-pipelines-post-optimization.png"/>
</div>

Doing all of this I managed to take my pipeline down from almost 7 minutes to 3 minutes.
Not all of this advice is broadly applicable - but I'm certain other projects have similar idiosyncracies that can be tweaked to result in faster pipelines.

Also do note that for the microsoft hosted agents build times seem to vary quite a bit (sometimes up to 30-50%) so take the times with a grain of salt.

This is the final yaml file:

```yaml

  # Trigger this pipeline on pull requests and main branches
  trigger:
    batch: true
    branches:
      include:
        - "develop"
        - "master"

  ### Create service containers for tests
  resources:
    containers:
      - container: sql-server
        image: "mcr.microsoft.com/mssql/server:2019-CU10-ubuntu-20.04"
        ports:
          - 1433:1433
        env:
          ACCEPT_EULA: "Y"
          SA_PASSWORD: "SomePassword"
      - container: postgres
        image: "postgres:13-alpine"
        ports:
          - 5432:5432
        env:
          POSTGRES_USER: local
          POSTGRES_PASSWORD: SomePassword
      - container: azurite
        image: "mcr.microsoft.com/azure-storage/azurite"
        ports:
          - 10000:10000 # Storage
          - 10001:10001 # Queues

  services:
    sql-server: sql-server
    postgres: postgres
    azurite: azurite

  pool:
    vmImage: 'ubuntu-latest'

  steps:
    - checkout: self
      lfs: false
      fetchDepth: 1
    - task: DotNetCoreCLI@2
      displayName: ".NET Tests"
      inputs:
        command: "test"

```

Do you have any tips to make your pipelines even faster? Have you managed to get NuGet caching to work?
Hit me up on [twitter](https://twitter.com/GeeWengel).
