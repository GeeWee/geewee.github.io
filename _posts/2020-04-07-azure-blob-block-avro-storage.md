---
title: "Implementing fast timeseries storage with Apache Avro and Azure Block Blob Storage"
permalink: "/azure-blob-block-avro-storage"
draft: true
---


#TODO better title

At my employer [SCADA MINDS](https://www.scadaminds.com/) we're currently working on implementing a data pipeline for one of the larger wind companies
in the world. Wind turbines have _a lot_ of sensors, that generate, among others, a lot of timeseries data. 
For the amount of turbines we need to support, we need to be able to process upwards of 1GB/sec.

This is a blog post about how, using Azure Block blobs, we've made a performant API that can handle that
amount of data, and still maintain respectable (<500ms for most cases) queries.

We have a few criteria that we need to fulfill:
### Criteria 1: We need to allow querying on a given sensor for a given time interval
Each sensor on a wind turbine has a unique `sensor id`. When you're using this sensor data for something,
you're usually only interested in one specific `sensor id`, over a specific set of time.

Optimally we'd implement a solution that allowed us to do the minimum amount of work possible to get that data.
### Criteria 2: We need to allow incremental updates of the data
Sometimes sensors go offline or turbines are a little slow to catch up.
This means that for a given interval, we're not sure when we'll have all the given sensor data.
Our solution needs to be able to handle getting the data incrementally. 

### Criteria 3: We need to be able to know which sensor data is available for a given interval
We'd like to know which sensor data we have for a given interval.
If this isn't easy to read from the storage format, we'll need to keep an index of some sort. 

### Criteria 4: Cost efficient
We also need to keep an eye towards cost. While we could fulfill all the other criteria by dumping all of our data
inside a managed time-series database, it's going to end up being *very* expensive.  

### Our solution
We ended up with a solution where we store `.avro` files in [Azure blob storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
in a way that effectively allows us to only update and fetch parts of the file.
Let's zoom out a bit and look at the two major components of the solution.

# What's an Avro File
An `.avro` file is a row-based open source binary format developed by Apache, originally for use within the Hadoop.
The avro format is defined by the eminently readable [spec](https://avro.apache.org/docs/current/spec.html),
but here's the cliff notes:

An avro file (or an avro object container if you want to be precise), consists of two main parts:
The header and one or more data blocks
### Avro File Header
The file header generally consists of metadata describing the rest of the avro file.
It also contains the _avro schema_ which is JSON describing the format of the rest of the file.
The file header ends with a `sync marker`, which is a randomly generated block of sixteen bytes.
The `sync marker` is used internally in Avro files to denote the end of things.

The `sync marker` is generated randomly when writing the header. It's unique within the same file, but different
between files.

### Avro data block
After the header, the avro file consists of data blocks. Each data block contains encoded data as specified by the schema.
At the end of each block is the `sync marker` - so that we can tell where one block ends and another begins.

---

The fact that Avro files are designed this way means that they're very good at being sliced into pieces, and stitched back together again.
In fact, as long as you know the schema and the sync marker, the data blocks are completely independent.  

Summing up
- Avro data blocks can be _read_ independently, as long as you know the schema
- Avro data blocks can be _written_ indepedently, as long as you know the schema and the sync block.

We'll be using these two properties to construct a storage that efficiently handles handles both incremental updates,
and partial reads of these files.

But first, we need to know a little more about Azure Block Blobs:

# What's Azure Block Blobs?

The next component we're using is the Azure Blob Storage, which is a blob-based storage service.
However it has a few more tricks up its sleeve than just being able to upload and download arbitrary blobs.
It has [three different types of blobs](https://docs.microsoft.com/en-us/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs),
each with their own characteristics and strengths. The ones we'll be using are called `block blobs`

A block blob is a file, or blob, that consists of several different pieces, which are called blocks.
Each block consists of two things.
The first thing is a `block id`, which is a unique base64-encoded string, that we can use to refer to the blob later.
The second thing is the contents of the block, which is whatever you upload.

*insert image*

*A word on words: While the "official" terms are `blocks` and `blobs`, where one `blob` consists of multiple
`blocks`, I feel the two terms are a little too close to eachother, and I certainly often get confused.
From here-on I'll call the blobs `files`. It's less-correct, but hopefully easier to understand.*


### GOT TO HERE

## Writing block blobs
Block blobs has some pretty powerful ways you can upload, replace or re-order parts of a file.

### Stage your blocks
The first step is staging the new blocks you want to be part of your blob.
You upload some bytes, tag them with a `block id`, and you're golden.
You can upload any number of blocks, but they don't do anything until the next phase.


### Commit the blocks
The next step is committing the blocks, which creates a fully formed blob.
You commit the blocks by sending a list of `block ids` to be committed.
The blob then consists of these blocks, *in the order* that the block id's are provided.
The `block ids` can either be ids we've committed previously via the staging step, or blocks already in the current file.

This means that if we e.g. want to write a block and put it in the middle of a file, the process is as follows:
- Stage the block with a unique id
- Ask the blob for all the current block ids
- Put our new block id at the appropriate place in the list of current block ids
- Commit the list of block ids with our new block id in it


## Reading from block blobs
Out of the box, the `block blobs` don't give us that many ways to read individual blocks.
However, it does give us the ability to *query for the list of blocks, and how many byte is in each.*

The azure blob storage allows you to specify only a range of bytes to fetch.
This means that using the list of blocks, we can figure out what byte range a given block exists in.
Using these two mechanisms together, we're able to *fetch* any given block from a file, if we know its `block id`


# How did we solve it all
Reminder, what we need to do is:
    - Allow querying on a sensor for a given time interval
    - Allow incremental updates for a time interval
    - Allow querying for what sensor data is present at a given interval
    
The general structure is:
We have a blob storage, where for each 10 minute interval we have a new `.avro` file.
The files are named for the interval they consist of data from, so it could e.g. be `2020-01-01T13:30:00--2020-01-01T13:40:00`
for a ten minute interval from 13:30 to 13:40 on January 1st 2020.

The avro file consists of multiple rows. Each row corresponds to a `sensor id`, and has the time-series data
for the sensor in the given interval.

We split the avro file up into blocks as follows
- One block for the avro header. The `block id` is something unique such as `$$$_HEADER_$$$`
- One block for each row in the avro file. The `block id` here is the _sensor id_

## Writing
The first time we're writing to an interval is pretty straightforward. We generate a header, stage that in a block,
and then we stage each row of our avro file in another block. We then commit all the blocks we just staged.
 

Updating is a little more interesting.
When we get new data for a given interval, we have to stage a new block. As mentioned previously,
what we need when writing to an avro file, all we need is the `schema` and the `sync marker` - aka the header.

As we can read the blocks individually, and we know that the header has a unique predetermined `block id`, we can
fetch the header no problem.

We then write the files by
- Fetching the header block of the existing file, and extracting the schema and sync marker
- Stage each new row with the sensor id as the `block id`, using the schema and sync marker retrieved from above.
- Commit the old block ids, along with the newly staged ones, allowing us to create a new file from the new and old data
without ever touching the old data. 

 
## Querying for sensor data
We have a need to know which sensor data is available for a given interval. Previously this process consisted of 
fetching the entire `.avro` file, parsing each row and then looking for the sensor name.

However this has become very easy now. Seeing as we can query the list of blocks for a given file, and the unique
id for a block is the sensor name. The sensor data available then, is the same as the `block ids` for a given file.

## Querying for specific data
The next is querying for a specific amount of data. We allow querying for a time interval on a specific sensor id.
First of, we have to calculate which files are relevant, when given an interval to search for. Depending on the interval you
search for this could be one or many `.avro` files.

We do that by listing the file names and doing a bit of string manipulation magic, to find the relevant ones.
When we've found the relevant files, we use the block blob magic again, to figure out where to fetch.

As mentioned earlier, when reading an avro file you need:
- The schema and syncblock aka the header
- One or more data blocks

We know which sensor our consumer is looking for, so by querying the list of blocks in the file, we can figure out
specifically where that sensor data exists in the file. We then query for that specific block, along with the header
and we are then able to create a fully parse-able avro file consisting of only the relevant data.


## Summing up
Our old system was based on the same principles of saving avro files to a blob storage, but didn't use any of the fancy
block functionality. This meant that when we had to query for a specific tag, we had to fetch the entire file, and then
parse it on the client. 

It also meant that when we wanted to append to a file, we had to download the old file, and merge it with the new data,
taking much longer than it needs to.

Using some of the more advanced functions in the Azure blob storage allowed us to scale our API response time from 5s~ to 
less than 500ms, for large amounts of data, and at a reasonable cost.