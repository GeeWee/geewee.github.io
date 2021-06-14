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

The three clouds I've considered is listed in the table below.

| Cloud Provider     | European company | Data sovereignty                        | Certificates                   | Easily-accessible DPA                                          | Features                                                                               | Pricing                                 |
|--------------------|------------------|-----------------------------------------|--------------------------------|----------------------------------------------------------------|----------------------------------------------------------------------------------------|-----------------------------------------|
| Hetzner            | Yes, German      | TODO                                    | Yes, ISO 27001                 | Not via public facing web                                      | VPS’s, firewalls and storage                                                           | Cheapest to get started with            |
| Scaleway           | Yes, French      | Yes                                     | Yes, ISO 27001 and many others | Not via public facing web, it is sent to you when you register | VPS’s, bare metal servers, managed databases, serverless functions (in beta), and more | Not as cheap as Hetzner but competitive |
| Open Telekon Cloud | Yes, German      | Yes, and configurable between countries | Yes, ISO 27001 and many others | Not via public facing web                                      | VPS’s, bare metal servers, managed databases, storage and more                         | The most expensive of the clouds        |


#Hetzner
[Hetzner](https://www.hetzner.com/cloud) is a german company and the cloud with the lowest initial price point by far of the three clouds. Their VPS's start at 2-5€/month which is a supremely impressive price point.

Apart from regular VPS' they have snapshots, backups, volumes and support a wide variety of linux-based operating systems.
They also have a [Terraform provider](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs)

Hetzner doesn't do *much* apart from having a real solid VPS service though. They have a storage solution, but apart from that there are no managed databases or additional features[^0]. 

Hetzner seems to be easy enough to audit. They have a dedicated [security page](https://www.hetzner.com/assets/Uploads/downloads/Sicherheit-en.pdf) and a valid [ISO27001:20013 certificate](https://www.hetzner.com/unternehmen/zertifizierung). Unfortunately their data processing agreement isn't publicly available, so you have to sign up with them first to be able to view it. 

# todo add compliance details after they respond


# Scaleway
Scaleway is a french cloud, which feels very modern in both its pricing, and the features it offers.
It's not on par with the big US cloud providers, but it seems to be getting there.
The list of features it offers are: 
- VPS's (prices start from 7€ a month for their cheapest development instance, and at 60€ a month for their cheapest production grade instance)
- Bare metal servers
- Object and file storage
- Kubernetes hosting
- Managed databases (Postgres and MySQL). Starts at 7.30€/month for standalone nodes and 18€/month for high-availability setups, which seems extremely cheap.
- Object and block storages. They have an S3 alternative where the first 75GB is free.
- [Terraform provider](https://registry.terraform.io/providers/scaleway/scaleway/latest/docs)

They also have some nifty features in open beta like serverless functions and a container runtime where you just provide a docker image for them to run. I haven't tested out the stability or the startup time of those features yet.

I haven't found any major drawbacks, except that some people say that the support can be a tad slow, particularly if you don't spend a lot of money there.

Scaleway sends you a DPA when you sign up which says Scaleway will:
> refrain from transmitting, disseminating or storing Personal Data to or in a non-EU country 
> without the Client’s prior and express consent. In the event that Online is required to  transfer Personal Data to a third country or international organisation under EU law or the  law of the Member State to which it is subject, it must notify the Client of this prior to  processing and provide proof of the mandatory nature of this obligation, unless the  applicable law prohibits such notification for important reasons in the public interest;

Scaleway has a lot of [certifications](https://www.scaleway.com/en/about-us/our-certifications/) which also should make auditing them a painless process.


# Open Telekom cloud
I stumbled across this cloud provider on [twitter](https://twitter.com/dalbuschat/status/1403662955238105090)[^1], and it seems like a very sophisticated german cloud, born out of the german telecommunications industry. 

They have a pretty expensive set of features including:
- VPS's - goes from 10€ if you run `Open Linux` as your operating system (whatever that means) to around 40€/month for things like Windows or RHEL servers. 
- Managed redis instances
- Managed databases - a single instance of postgres will run you around 30€/month, doubling that if you want a primary/standby setup
- [Container hosting in the cloud](https://open-telekom-cloud.com/en/products-services/cloud-container-engine)
- Object and file storage
- [Email gateways](https://open-telekom-cloud.com/en/solutions/mailing-services/secure-mail-gateway)
- [Terraform provider](https://registry.terraform.io/providers/opentelekomcloud/opentelekomcloud/latest/docs)

Generally Open Telekom cloud seems to be a tad on the pricier side of the other cloud providers, but it seems to have some very solid features as well. I've heard rumors that support isn't [particularly responsive](https://twitter.com/dalbuschat/status/1403662955238105090).

Open Telekom Cloud have data sovereignty in the EU, and you can even lock it into a specific country (germany or netherlands) - and [they make a big deal out of it](https://open-telekom-cloud.com/en/security/data-protection-and-compliance) 

They also have every certification you could possibly dream of, so auditing them should be painless. This cloud definitely seems like the heavyweight in regard to compliance.

-------

While the cloud game in the European Union is still lagging behind its US counterparts, some really solid cloud providers are definitely starting to crop up.

Personally, I think these three cloud providers are good bets.
You can choose Hetzner if you want to get started for cheap, and you dont' need e.g. managed databases. Scaleway seems to be a reasonably priced cloud that can be used for a wide variety of usecases. And Open Telekom Cloud is the way to go if you have more strict compliance needs, and you're willing to pay a little extra for them.

While writing this article I also stumbled upon [eucloud.tech](https://www.eucloud.tech/) which seems to be a legitimate resource for finding european cloud providers. Check that out for some other alternatives.


[^0]: They do have some managed servers, but that seems mainly to be a Wordpress/PHP sort of solution.
[^1]: The whole thread is worth reading. Some good experiences and pros/cons are listed.
