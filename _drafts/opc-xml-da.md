-------------------------------
title: OPC XML DA
permalink: '/opc-xml-da'
-------------------------------

SOAP 1.1 (but some versions also support 1.0)

Supports Localization which might be relevant for:
error information
strings (server specific)

subscription architecture is polled pull where you create a subscription with an id and then ask for that id
later on.

they do polled refresh and they use some http knobs to get efficient responses, such as
- Holdtime - instructs the server to hold off returning from the SubscriptionPolledRefresh call
until the specified absolute server time is reached.
- Waittime -instructs the server to wait the specified duration (number of milliseconds) after the
Holdtime is reached before returning if there are no changes to report. A change in one of the
subscribed items, during this wait period, will result in the server returning immediately rather
than completing the wait time.

client has to delete and recreate subscription on errors.0


# Data management optimization for subscriptions
requestedsamplerate
    hierarchical parameter that telsl how often server should try to poll devices
    Server returns RevisedSamplingRate if it can't or wont do it.

enablebuffering
    Server keeps buffer of changed values between each poll

deadband
    How much does the values need to change from the first one before emitting a new value?


# Timestamps
Timestamps are the last time a value was updated from the device, or validated as accurate.

Special case for arrays - server tries to determine which timestamp is most accurate

Special cases for refresh and ReturnAllItems.

# Faults and return codes
When operation fails entirely return SOAP Fault

However individual items might errors. Then you getan E_RESULTID and some block of errors.

# Data types
There are a lot of data types yoyo.poll

# Enumeration
(I don't quite understand this part)

“XML Schema Part 2: Datatypes” found at http://www.w3.org/TR/xmlschema-2/ defines
enumerations, and SOAP directly adopts the defined mechanism. Enumeration as defined is a data
type constraining facet which means that all data types except Boolean may have associated
enumerated values. OPC recommends against these defined enumerations as item values, but instead
recommends the use of the enumeration methodology as described in the OPC DA Specification.
Servers may return either the string representation or the integer representation of the enumeration
value. The type of returned value will be based on the client’s requested type, with the default being
the string representation of the enumeration.
The OPC Enumeration methodology provides two Item Properties: euType, and euInfo to let the client
be aware of whether the values are enumerated and if so, then euInfo would provide an array of strings
which represents the textual representation of the elements of the enumeration. See the ItemProperty
description in Section 3.1.10 for further details.

# Arrays
There are arrays too!


# Security
Handled at the protocl level, such as HTTPS

# Section 3: Schema references

### Hierarchical
Lot of stuff is hierarchical that can be both on list and item level

### Null parameters
Null and "" are identical for string attributes, but XML-DA specification allows for null values so we can do the hierarchcial params.pol
"Servers and clients should support null parameters by intelligently ignoring them."

## Containers

### RequestList
A list of stuff to request. Not quite sure where this is used.

### RequestItem
An item to be requested. ItemPath, ReqType, ItemName, ClientItemHandle

### ItemValue
Container for itemValue. Lots of stuff here likie diagnostics, itemanem, handle, quality etc.

### RequestOptions
Options that are available to clients in most requests

### ServerState
How's the server doing?

### OpcError
What went wrong? List of errors.

### ItemProperty
Some property of the item you can get through browse and GetProperties
THere' s a large list of "canonical" properties and then some vendor-specific ones.
I think most/all of the properties are optional


# Calls

## Status: GetStatus, GetStatusResponse
How's the server doing?

## Read: Read, ReadResponse
Read current value for one or more items. Can contain maxAge to force device reads.

## Write: Write, WriteResponse
Write to one or more items. Can potentially also write quality, limit and vendor etc.
Can optionally also return a list of the updated values post-write

## Subscription: Subscribe, SubscribeResponse
Creates a subscription. You send off a list of items you'd like to subscribe to and a lot of data about
how the subscription will work, and then it will send you a list of errors which is hopefully empty.
It will send you a subscription id which is what you use when doing polled refreshes

Yoy can also ask for the current values of all the items when creating the subscription - in that case you get those
back.

## Subscription Polled Refresh: SubscriptionPolledRefresh, SubscriptionPolledRefreshResponse
Now that you've created your cool subscription and gotten an ID, you can make a request with that id
to see what's changed since last. You can also supply multiple IDs if you have more than one subscription.
I'm not sure when you'd want to do this unless you want to optimize holdtimes or hierarchical parameters on multiple subscriptions
I guess.


## Subscription Cancel: SubscriptionCancel, SubscriptionCancelResponse
You're done with this subscription. Send off the ID and call adios.


## Browse: Browse, BrowseResponse
Yo gimme dat tag. Optionally specify if you also want the properties  and so forth.

Supports pagination via a ContinuationPoint if there are too many browserequests.

The Browse service only supports a single level of browsing. If the user wishes to recursively browse
a hierachy, then the user will use the returned ItemPaths of elements with children for that purpose.
If the client specifies a null string for ItemPath and ItemName, then the server will do a Browse
beginning at the top level.
The server will do a Browse from the level specified by the combination of ItemPath and ItemName.

You can have both IsItem and HasChildren properties so you can have nodes and edges. Some nodes are also edges.
See the diagram in 3.8.1

## Get Properties: GetProperties, GetPropertiesResponse
Get a big fat list of properties for an item. You can either specify specific properties to return, or just ask for all of them.
