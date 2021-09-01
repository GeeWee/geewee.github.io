---
title: OPC UA

---
OPC

Protocol for industrial automation

Long-ass-spec

Meant to model arbitrary data

*can* support a lot of stuff
defines different profiles

meant to be able to run on both embedded devices and full fledged computers


has different security options, signing, encryption, certificate pinning

has different protocols

Has different services
https://profiles.opcfoundation.org/v104/reporting/

Address Space Model
Base Information
Discovery Services
Session Services
View Services
Attribute Services
Subscription Services
Monitored Item Services
Method Services

Protocol and Encoding
Security


pub/sub

reverse connect


--- notes

(although the first 20 pages in each spec is always a glossary)
1000 + pages of spec, but readable



introduction


short summary of each spec file

# Questions
(WHAT IS THE DIFFERENCE BETWEEN AN OBJECT AND A NODE???)
 DIFFERENCE BETWEEN SUBSCRIPTION AND MonitoredItems??


# Bullet points
OPC UA is applicable to components in all industrial domains, such as industrial sensors and actuators, control systems, Manufacturing Execution Systems and Enterprise Resource Planning Systems, including the Industrial Internet of Things (IIoT), Machine To Machine (M2M) as well as Industrie 4.0 and China 2025. These systems are intended to exchange information and to use command and control for industrial processes. OPC UA defines a common infrastructure model to facilitate this information exchange OPC UA specifies the following:

    The information model to represent structure, behaviour and semantics.
    The message model to interact between applications.
    The communication model to transfer the data between end-points.
    The conformance model to guarantee interoperability between systems.

OPC UA is a platform-independent standard through which various kinds of systems and devices can communicate by sending request and response Messages between Clients and Servers or NetworkMessages between Publishers and Subscribers over various types of networks. It supports robust, secure communication that assures the identity of OPC UA Applications and resists attacks.

In the Client Server model OPC UA defines sets of Services that Servers may provide, and individual Servers specify to Clients what Service sets they support. Information is conveyed using OPC UA-defined and vendor-defined data types, and Servers define object models that Clients can dynamically discover. Servers can provide access to both current and historical data, as well as Alarms and Events to notify Clients of important changes. OPC UA can be mapped onto a variety of communication protocols and data can be encoded in various ways to trade off portability and efficiency.

In addition to the Client Server model, OPC UA defines a mechanism for Publishers to transfer the information to Subscribers using the PubSub model.

OPC UA is designed to support a wide range of Servers, from plant floor PLCs to enterprise Servers. These Servers are characterized by a broad scope of size, performance, execution platforms and functional capabilities. Therefore, OPC UA defines a comprehensive set of capabilities, and Servers may implement a subset of these capabilities. To promote interoperability, OPC UA defines subsets, referred to as Profiles, to which Servers may claim conformance. Clients can then discover the Profiles of a Server, and tailor their interactions with that Server based on the Profiles. Profiles are defined in OPC 10000-7.


OPC UA is designed as the migration path for OPC clients and servers that are based on Microsoft COM technology. Care has been taken in the design of OPC UA so that existing data exposed by OPC COM servers (DA, HDA and A&E) can easily be mapped and exposed via OPC UA

- OPC

- Stateful, session-based secure way of doing communication
- Supports a variety of encryption and service sets
- describe what service sets are here
- Is a strict way of modelling data
- Address Space

# Address Space Model

<div class="img-div-tall">
<img src="{{site.url}}/assets/img/opcua/opcua-server-architecture.png"/>
</div>

OPC UA adds support for many relationships between Nodes instead of being limited to just a single hierarchy. In this way, a Server may present data in a variety of hierarchies tailored to the way a set of Clients would typically like to view the data. This flexibility, combined with support for type definitions, makes OPC UA applicable to a wide array of problem domains. As illustrated in Figure 2, OPC UA is not targeted at just the SCADA, PLC and DCS interface, but also as a way to provide greater interoperability between higher level functions.

The set of Objects and related information that the Server makes available to Clients is referred to as its AddressSpace. The OPC UA AddressSpace represents its contents as a set of Nodes connected by References.

Primitive characteristics of Nodes are described by OPC-defined Attributes. Attributes are the only elements of a Server that have data values. Data types that define attribute values may be simple or complex.

Nodes in the AddressSpace are typed according to their use and their meaning. NodeClasses define the metadata for the OPC UA AddressSpace. OPC 10000-3 defines the OPC UA NodeClasses.

The Base NodeClass defines Attributes common to all Nodes, allowing identification, classification and naming. Each NodeClass inherits these Attributes and may additionally define its own Attributes.

To promote interoperability of Clients and Servers, the OPC UA AddressSpace is structured hierarchically with the top levels the same for all Servers. Although Nodes in the AddressSpace are typically accessible via the hierarchy, they may have References to each other, allowing the AddressSpace to represent an interrelated network of Nodes. The model of the AddressSpace is defined in OPC 10000-3.

Servers may subset the AddressSpace into Views to simplify Client access. Subclause 6.3.4.3 describes AddressSpace Views in more detail.




# Service sets
Next

OPC UA Services are divided into Service Sets, each defining a logical grouping of Services used to access a particular aspect of the Server. The Service Sets are described below. The Service Sets and their Services are specified in OPC 10000-4. Whether or not a Server supports a Service Set, or a specific Service within a Service Set, is defined by its Profile. Profiles are described in OPC 10000-7.

This Service Set defines Services used to discover Servers that are available in a system. It also provides a manner in which clients can read the security configuration required for connection to the Server. The Discovery Services are implemented by individual Servers and by dedicated Discovery Servers. Well known dedicated Discovery Servers provide a way for clients to discover all registered Servers. OPC 10000-12 describes how to use the Discovery Services with dedicated Discovery Servers.

###  SecureChannel Service Set
This Service Set defines Services used to open a communication channel that ensures the confidentiality and integrity of all Messages exchanged with the Server. The base concepts for UA security are defined in OPC 10000-2.

The SecureChannel Services are unlike other Services because they are typically not implemented by the OPC UA Application directly. Instead, they are provided by the communication stack that the OPC UA Application is built on. OPC UA Applications simply need to verify that a SecureChannel is active whenever it receives a Message. OPC 10000-6 describes how the SecureChannel Services are implemented with different types of communication stacks.

A SecureChannel is a long-running logical connection between a single Client and a single Server. This channel maintains a set of keys that are known only to the Client and Server and that are used to authenticate and encrypt Messages sent across the network. The SecureChannel Services allow the Client and Server to securely negotiate the keys to use.

The exact algorithms used to authenticate and encrypt Messages are described in the security policies for a Server. These policies are exposed via the Discovery Service Set. A Client selects the appropriate endpoint that supports the desired security policy by the Server when it creates a SecureChannel.

When a Client and Server are communicating via a SecureChannel they verify that all incoming Messages have been signed and/or encrypted according to the security policy. A UA application is expected to ignore any Message that does not conform to the security policy for the channel.

A SecureChannel is separate from the UA Application Session; however, a single UA Application Session may only be accessed via a single SecureChannel. This implies that the UA application is able to determine what SecureChannel is associated with each Message. A communication stack that provides a SecureChannel mechanism but that does not allow the application to know what SecureChannel was used for a given Message cannot be used to implement the SecureChannel Service Set.

The relationship between the UA Application Session and the SecureChannel is illustrated in Figure 9. The UA applications use the communication stack to exchange Messages. First, the SecureChannel Services are used to establish a SecureChannel between the two communication stacks, allowing them to exchange Messages in a secure way. Second, the UA applications use the Session Service Set to establish a UA application Session.

<div class="img-div-tall">
<img src="{{site.url}}/assets/img/opcua/session-image.png"/>
</div>

### Session Service Set
This Service Set defines Services used to establish an application-layer connection in the context of a Session on behalf of a specific user.

### NodeManagement Service Set
The NodeManagement Service Set allows Clients to add, modify, and delete Nodes in the AddressSpace. These Services provide an interface for the configuration of Servers.

### View Service Set
Views are publicly defined, Server-created subsets of the AddressSpace. The entire AddressSpace is the default View, and therefore, the View Services are capable of operating on the entire AddressSpace. Future versions of this specification may also define Services to create Client defined Views.

The View Service Set allows Clients to discover Nodes in a View by browsing. Browsing allows Clients to navigate up and down the hierarchy, or to follow References between Nodes contained in the View. In this manner, browsing also allows Clients to discover the structure of the View.

### Query Service Set
The Query Service Set allows users to access the address space without browsing and without knowledge of the logical schema used for internal storage of the data.

Querying allows Clients to select a subset of the Nodes in a View based on some Client-provided filter criteria. The Nodes selected from the View by the query statement are called a result set.

Servers may find it difficult to process queries that require access to runtime data, such as device data, that involves resource intensive operations or significant delays. In these cases, the Server may find it necessary to reject the query.

### Attribute Service Set
The Attribute Service Set is used to read and write Attribute values. Attributes are primitive characteristics of Nodes that are defined by OPC UA. They may not be defined by Clients or Servers. Attributes are the only elements in the AddressSpace permitted to have data values. A special Attribute, the Value Attribute is used to define the value of Variables.

### Method Service Set
Methods represent the function calls of Objects. They are defined in OPC 10000-3. Methods are invoked and return after completion, whether successful or unsuccessful. Execution times for Methods may vary, depending on the function they are performing.

The Method Service Set defines the means to invoke Methods. A Method is always a component of an Object. Discovery is provided through the browse and query Services. Clients discover the Methods supported by a Server by browsing for the owning Objects that identify their supported Methods.

Because Methods may control some aspect of plant operations, method invocation may depend on environmental or other conditions. This may be especially true when attempting to re-invoke a Method immediately after it has completed execution. Conditions that are required to invoke the Method may not yet have returned to the state that permits the Method to start again. In addition, some Methods may be capable of supporting concurrent invocations, while others may have a single invocation executing at a given time.

### MonitoredItem Service Set
The MonitoredItem Service Set is used by the Client to create and maintain MonitoredItems. MonitoredItems monitor Variables, Attributes and EventNotifiers. They generate Notifications when they detect certain conditions. They monitor Variables for a change in value or status; Attributes for a change in value; and EventNotifiers for newly generated Alarm and Event reports.

Each MonitoredItem identifies the item to monitor and the Subscription to use to periodically publish Notifications to the Client (see 7.11). Each MonitoredItem also specifies the rate at which the item is to be monitored (sampled) and, for Variables and EventNotifiers, the filter criteria used to determine when a Notification is to be generated. Filter criteria for Attributes are specified by their Attribute definitions in OPC 10000-4.

The sample rate defined for a MonitoredItem may be faster than the publishing rate of the Subscription. For this reason, the MonitoredItem may be configured to either queue all Notifications or to queue only the latest Notification for transfer by the Subscription. In this latter case, the queue size is one.

MonitoredItem Services also define a monitoring mode. The monitoring mode is configured to disable sampling and reporting, to enable sampling only, or to enable both sampling and reporting. When sampling is enabled, the Server samples the item. In addition, each sample is evaluated to determine if a Notification should be generated. If so, the Notification is queued. If reporting is enabled, the queue is made available to the Subscription for transfer.

Finally, MonitoredItems can be configured to trigger the reporting of other MonitoredItems. In this case, the monitoring mode of the items to report is typically set to sampling only, and when the triggering item generates a Notification, any queued Notifications of the items to report are made available to the Subscription for transfer.

### Subscription Service Set
The Subscription Service Set is used by the Client to create and maintain Subscriptions. Subscriptions are entities that periodically publish NotificationMessages for the MonitoredItem assigned to them (see 7.9). The NotificationMessage contains a common header followed by a series of Notifications. The format of Notifications is specific to the type of item being monitored (i.e. Variables, Attributes, and EventNotifiers).

Once created, the existence of a Subscription is independent of the Client’s Session with the Server. This allows one Client to create a Subscription, and a second, possibly a redundant Client, to receive NotificationMessages from it.

To protect against non-use by Clients, Subscriptions have a configured lifetime that Clients periodically renew. If any Client fails to renew the lifetime, the lifetime expires and the Subscription is closed by the Server. When a Subscription is closed, all MonitoredItems assigned to the Subscription are deleted.

Subscriptions include features that support detection and recovery of lost Messages. Each NotificationMessage contains a sequence number that allows Clients to detect missed Messages. When there are no Notifications to send within the keep-alive time interval, the Server sends a keep-alive Message that contains the sequence number of the next NotificationMessage sent. If a Client fails to receive a Message after the keep-alive interval has expired, or if it determines that it has missed a Message, it can request the Server to resend one or more Messages.

# Connection Models and Sessions
The OPC UA specifications are layered to isolate the core design from the underlying computing technology and network transport. This allows OPC UA to be mapped to future technologies as necessary, without negating the basic design. Mappings and data encodings are described in OPC 10000-6. Three data encodings are defined:

    XML/text
    UA Binary

    JSON In addition, several protocols are defined:
    OPC UA TCP
    HTTPS
    WebSockets OPC UA Applications that support multiple transports and encodings will allow the end users to make decisions about trade-offs between performance and compatibility at the time of deployment, rather than having these trade-offs determined by the OPC vendor at the time of product definition.

-- Session based (but can do sessionless calls too)


# Security [overview](https://reference.opcfoundation.org/v104/Core/docs/Part1/5.4.1/)
Most OPC communications happen in a session-based environment.



(todo collapse)
Security objectives:
- Authentication
- Authorization
- Confidentiality
- Integrity
- Non-repudiation
- Auditability
- Availability

Threats modelled:
- Denial of Service
- Eavesdropping
- Message Spoofing
- Message alteration
- Message replay
- Malformed messages
- Server profiling
- Session hijacking
- Rogue Server
- Rogue Publisher
- Compromising user credentials
- Repudiation
  


When a client wants to connect to a server it goes through a `Discovery` process where the client figures out what sort of security the server supports.

### SecurityPolicies

OPC Servers and clients usually support multiple different cryptographic algorithms at the same time. This is so that you can swap out algorithms as better ones become available, and due to some resource-constrained devices not being able to support the most secure algorithms.

```
algorithms for signing and encryption
    algorithm for key derivation The choice of allowed SecurityPolicies is normally made by the administrator typically when the OPC UA Applications are installed. The available security policies are specified in OPC 10000-7. The Administrator can at a later time also change or modify the selection of allowed SecurityPolicies as circumstances dictate.
```

The list of what encryption and signing a server supports is called a [SecurityPolicy](https://reference.opcfoundation.org/v104/Core/docs/Part2/4.6/)

<div class="img-div-tall">
<img src="{{site.url}}/assets/img/opcua/signing.png"/>
Example of how a commercial client looks when connecting to a server
</div>

After the server and client has agreed on a security policy there is a "Key Exchange Algorithm" similar in function to an SSL handshake. The client and the server each exchange public keys in classic asymmetric cryptography-style.
Based on these public keys, the servers exchange a shared key, and then use symmetric encryption afterwards.

In the Client Server communications pattern, each Client can select a policy independent of the policy selected by other Clients.



However, how do you know that the application is one you trust?
There are two aspects to this: Can I trust the `application`, and can I trust the `user` using the application?

### Application Authentication
OPC UA uses a concept conveying Application Authentication to allow applications that intend to
communicate to identify each other. Each OPC UA Application Instance has a Certificate (Application
Instance Certificate) assigned that is exchanged during Secure Channel establishment. The receiver
of the Certificate checks whether it trusts the Certificate and based on this check it accepts or rejects
the request or response Message from the sender. This trust check is accomplished using the concept
of TrustLists. TrustLists are implemented as a CertificateStore designated by an administrator. An
administrator determines if the Certificate is signed, validated and trustworthy before placing it in a
TrustList. A TrustList also stores Certificate Authorities (CA). TrustLists that include CAs, also include
Certificate Revocation Lists (CRLs). OPC UA makes use of these industry standard concepts as
defined by other organizations.
In OPC UA, HTTPS can be used to create Secure Channels, however, these channels do not provide
Application Authentication. If Authentication is required, it is based on user credentials (User
Authentication see 4.9). More details on Application Authentication can be found in OPC 10000-4.

### User authentication
OPC UA provides user authorization based on the authenticated user (see 4.9). OPC UA Applications
may determine in their own way what data is accessible and what operations are authorized or they
may use Roles (see 4.12). Profiles exist to indicate the support of user credentials to restrict or control
access to the address space.



### Auditability
auditability




# Tour de force of the specifications
OPC UA is split up in multiple specifications each dealing with a particulary subject.
1-8 are the "core" specifications, and it's recommended you read 1-5 before diving into the later specifications. They are pretty abstract and how they map is defined in 6 and 7?
(For some reason 6 and 7 don't matter?)


8-11 are the Access Type Specifications, which describe different ways to access/use OPC.

12-14 are "Utility specs" which describe stuff like service discovery, optional PubSub implementations etc.


## Core specifications
- Part 1 (OPC 10000-1) – Overview and Concepts 
  Presents the concepts and overview of OPC UA.

- Part 2 (OPC 10000-2) – Security Model
  Describes the model for securing interactions between OPC UA Applications.
  
- Part 3 (OPC 10000-3) – Address Space Model
  Describes the contents and structure of the Server’s AddressSpace.

- Part 4 (OPC 10000-4) – Services
  Specifies the Services provided by Servers.

- Part 5 (OPC 10000-5) – Information Model
  Specifies the types and their relationships defined for Servers.

# TODO why aren't these mandatory
- Part 6 (OPC 10000-6) – Mappings
  Specifies the mappings to transport protocols and data encodings supported by OPC UA.

- Part 7 (OPC 10000-7) – Profiles
  Specifies the Profiles that are available for OPC UA Applications. These Profiles provide groupings of functionality that can be used for conformance level certification. OPC UA Applications will be tested against the Profiles.

## Access Type Specifications
- Part 8 (OPC 10000-8) – Data Access
  Specifies the use of OPC UA for data access.
  
- Part 9 (OPC 10000-9) – Alarms and Conditions
  Specifies use of OPC UA support for access to Alarms and Conditions. The base system includes support for simple Events; this specification extends that support to include support for Alarms and Conditions.

- Part 10 (OPC 10000-10) – Programs
  Specifies OPC UA support for access to Programs.

- Part 11 (OPC 10000-11) – Historical Access
  Specifies use of OPC UA for historical access. This access includes both historical data and historical Events.

## Utility specifications
- Part 12 (OPC 10000-12) – Discovery
  Specifies how Discovery Servers operate in different scenarios and describes how UA Clients and Servers should interact with them. It also defines how UA related information should be accessed using common directory service protocols such as LDAP.

- Part 13 (OPC 10000-13) – Aggregates
  Specifies how to compute and return aggregates like minimum, maximum, average etc. Aggregates can be used with current and historical data.

- Part 14 (OPC 10000-14) – PubSub
  Specifies the PubSub communication model. The PubSub communication model defines an OPC UA publish subscribe pattern in addition to the Client Server pattern defined by the Services in OPC 10000-4.


# Notes


Real objects
Real objects are physical or software objects that are accessible by the Server application or that it
maintains internally. Examples include physical devices and diagnostics counters.



6.3.4 OPC UA AddressSpace ToC Previous Next
6.3.4.1 AddressSpace Nodes ToC

The AddressSpace is modelled as a set of Nodes accessible by Clients using OPC UA Services (interfaces and methods). Nodes in the AddressSpace are used to represent real objects, their definitions and their References to each other.
6.3.4.2 AddressSpace organization ToC

OPC 10000-3 contains the details of the meta model “building blocks” used to create an AddressSpace out of interconnected Nodes in a consistent manner. Servers are free to organize their Nodes within the AddressSpace as they choose. The use of References between Nodes permits Servers to organize the AddressSpace into hierarchies, a full mesh network of Nodes, or any possible mix.

OPC 10000-5 defines OPC UA Nodes and References and their expected organization in the AddressSpace. Some Profiles will not require that all of the UA Nodes be implemented.
6.3.4.3 AddressSpace Views ToC

A View is a subset of the AddressSpace. Views are used to restrict the Nodes that the Server makes visible to the Client, thus restricting the size of the AddressSpace for the Service requests submitted by the Client. The default View is the entire AddressSpace. Servers may optionally define other Views. Views hide some of the Nodes or References in the AddressSpace. Views are visible via the AddressSpace and Clients are able to browse Views to determine their structure. Views are often hierarchies, which are easier for Clients to navigate and represent in a tree.
6.3.4.4 Support for information models ToC

The OPC UA AddressSpace supports information models. This support is provided through:

    Node References that allow Objects in the AddressSpace to be related to each other.
    ObjectType Nodes that provide semantic information for real Objects (type definitions).
    ObjectType Nodes to support subclassing of type definitions.
    Data type definitions exposed in the AddressSpace that allow industry specific data types to be used.
    OPC UA companion standards that permit industry groups to define how their specific information models are to be represented in Server AddressSpace.



---

6.3.5.1
MonitoredItems
MonitoredItems are entities in the Server created by the Client that monitor AddressSpace Nodes and
their real-world counterparts. When they detect a data change or an event/alarm occurrence, they
generate a Notification that is transferred to the Client by a Subscription.
6.3.5.2
Subscriptions
A Subscription is an endpoint in the Server that publishes Notifications to Clients. Clients control the
rate at which publishing occurs by sending Publish Messages.


6.3.6.1
General
The Services defined for OPC UA are described in Clause 6.4, and specified in OPC 10000-4.
6.3.6.2
Request/response Services
Request/response Services are Services invoked by the Client through the OPC UA Service Interface
to perform a specific task on one or more Nodes in the AddressSpace and to return a response.
6.3.6.3
Subscription Services
The Publish Service is invoked through the OPC UA Service Interface for the purpose of periodically
sending Notifications to Clients. Notifications include Events, Alarms, data changes and Program
outputs.
