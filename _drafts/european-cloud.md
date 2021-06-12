---
title: "3 European clouds with data sovereignty"
permalink: "/european-clouds"
---

Storing european data in the US is a murky waters in regards to GDPR.
Storing data in the US is difficult due to FISA, and using american clouds with european datacenters is also murky waters,  as the american government could probably ask your cloud provider for all your sweet data without you being able  to do anything about it.

We have strict data sovereignty requirements. We have data about european citizens that we need to host in an european cloud. So I tried to find a solid european cloud. I googled everything from "european hosting", "european cloud provider", "eu cloud", "eu cloud eu infrastructure" and similar phrases, but all I found were "Top ten lists of european cloud providers" where more than half of them were american wordpress hosting providers. (todo insert keywords)

Even having an american company that owns the originating company is tricky.

I have however, managed to find 3 solid cloud providers located in the EU.
I've judged them on

1. Features
2. Compliance (data locality, sensible data processing agreement and ease of auditing) 
3. Pricing

The three clouds are:

- Hetzner
- Open Telekom Cloud
- Scaleway

# todo definitely add a table here

#Hetzner
[Hetzner](https://www.hetzner.com/cloud) is a german company and the cloud with the lowest initial price point by far of the three clouds. Their VPS's start at 2-5€/month which is a supremely impressive price point.

Apart from regular VPS' they have snapshots, backups, volumes and support a wide variety of linux-based operating systems.

Hetzner doesn't do *much* apart from having a real solid VPS service though. They have a storage solution, but apart from that there are no managed databases or additional features[^0]. 

Hetzner seems to be easy enough to audit. They have a dedicated [security page](https://www.hetzner.com/assets/Uploads/downloads/Sicherheit-en.pdf) and a valid [ISO27001:20013 certificate](https://www.hetzner.com/unternehmen/zertifizierung). Unfortunately their data processing agreement isn't publicly available, so you have to sign up with them first to be able to view it. 

# todo add compliance details after they respond

# Scaleway

- Feels very modern
  
Lots of nifty features in public beta like serverless containers
# Todo got to here

- Intro
- Additional features
- Drawbacks
- Data sovereignty
- Certification and ease of auditing


# Open Telekom cloud

- Has email capabilities


- Intro
- Additional features
- Drawbacks
- Data sovereignty
- Certification and ease of auditing


[^0]: They do have some managed servers, but that seems mainly to be a Wordpress/PHP sort of solution.
