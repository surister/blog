---
title: "Notes on a Database's ecosystem"
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: ''
tags: [ 'python', 'Antlr4', 'software' ]
authors: [{'name': 'Ivan', 'job_title': 'Database Ecosystem Engineer'}, {'name': 'Kenneth'}]
comment_links: [{'name': 'reddit', 'href': ''}, {'name': 'hacker news', 'href': ''}]
published: false
show_preview: false
date: "2025-01-01"
---

Databases are among one of the most complex pieces of software to develop, they overlap many
already complex domains in technology: Hardware, Query processing, Memory management, Concurrency,
Distributed computing, Data consistency, Durability.. while addressing the diverse and evolving use cases of
millions of users over time.

The modern world literally runs on data and thus we are not short of problems whose solution is a Database,
and there is a big market for it, according to Gartner :Ref{r="1"} DBMS market share is around 100 BN dollars.

While the development of the database itself is extremely critical, we argue that there is one 
extra key piece in the equation that often goes overlooked which plays a major role in the success of a Database: [The Ecosystem].

[Note: When we talk about 'Database(s)' we refer to a DBMS, like PostgreSQL or CrateDB]

## [Definition of a Database Ecosystem]{.text-h4}
The ecosystem of a database is the set of things that support and enables the user in the use of the database.
These things are external to the database itself. The database can exist without the ecosystem, but the ecosystem does
not make sense without the database.

It is composed of:
* Drivers.
* Connectors (often called 'adapters,' 'drivers,' 'plugins.')
* Extensions.
* Standards.
* Knowledge sharing (Conference talks, Videos, Documentation, example projects, articles, social media posts.)
* Communities.

Any company developing a database will have to invest in these points, often spanning several teams.
(Note: How many people are working in MongoDB in these?, mentioning it will be nice.)

## [Why is it important]{.text-h4}

A mature and wide ecosystem can be a proxy measurement for the success of a DBMS (We will later see why). 
An ecosystem is mature when its components have been around for years and wide when they are 
enough to supply the needs of the DBMS users.

The ecosystem is not only a proxy measurement, but part of the intrinsic success flywheel of the DBMS, and
arguably to any complex enough technological product.

There are two different flywheels, 'economic growth' and 'technical advancement.' Both exist whether the
product is open-source or not.

1. Person learns product
2. Person uses product
3. Person spreads product

[Economic Growth Flywheel]{.h}:

1. Person learns a product (In school, conference, blog post or any other way.)
2. Person solves a problem in a company.
3. Company spends money on product.
4. Product popularity grows.
5. Education entity (School or individual) creates content of the product.

[Technical Advancement Flywheel (More prevalent in Open-Source)]{.h}

1. Person learns a product.
2. Person likes product and contributes to the Ecosystem or the product itself.
3. Product value increases more rapidly.
4. Product popularity grows.

The key result of both flywheels, is that it popularity increases, through different but similar methods,
economic growth will depend on the economic model of the company or entity developing the product.

Companies with stronger ecosystems, will see faster adoption. An user is not only an user, but a potential
vector of growth.

### [User as a vector of growth.]{.text-h5 .mt-5}

It does not matter if the user does not directly contribute economically [now]{.h}, it might do it 
later (in a different company), or it might contribute in a different but meaningful way like teaching the 
product to other colleagues, writing a blog post, creating a tool, answering a question to another user
who might contribute economically, etc. A user, regardless of its economic contribution should
receive the same level of attention and respect as a paying user (saving contractual obligations.)
Some companies that understand that, have reward programs to prominent users.

TL;DR; When a DMBS ecosystem grows, popularity and adoption grow, in turn, making the ecosystem grow..

### [META NOTE HERE: PLEASE BE PENDANTIC, I'M TRYING TO DEFINE THINGS]
### [Drivers]{.text-h5}
[META NOTE: DEFINE WHAT A DRIVER IS AN TRY TO EXPLAIN IN A WAY THAT IT MAKES SENSE FOR SOMEONE WHO HAS NEVER DEVELOPED ONE] 
The driver is the component that implements the necessary mechanisms (via following a standard)
to talk to the database. It allows the programming language to communicate with it.

If we consider a database, a blackbox for a second, the driver would be the lowest level in the
application development. It usually does not implement complex features, such as pooling, and depending
on how it is developed and the features of the programming language, it might have features like system independency.

An example would be the postgresJDBC driver or cratedb python's `crate` driver.

To get a better sense of what a driver is, let's quickly create one driver to talk to CrateDB.

#### [Implementing a CrateDB driver.]{.text-h6}

CrateDB supports both the postgres wire protocol in port [5432]{.h} and http in port [4200]{.h} as 
communication protocols. To create an [http]{.h} driver, we would need to implement two things: the
communication protocol (http) and the database's specific API within the protocol.

[http]{.text-h6}

To implement the communication protocol, we would need to implement HTTP: connect over TCP/IP and send
the right body according to the HTTP :Ref{r="2"} specification, for example, for version 1: ["GET /path/to/resource HTTP/1.1"]{.h}.
Typically, libraries implementing the http specification are already shipped in most 
programming languages or available via user packages, we can reuse those implementations,
examples of this would be [http]{.h} for Python, [net/http]{.h} in Go
and [reqwest]{.h} in Rust (although not official.)

::Editor{lang="python"}

<pre>
import request

endpoint = "?/_sql"

class CrateError(Exception): pass

def parse_response(response) -> dict | CrateError:
    if response.ok:
        return response.data
    return CrateError(response.error)

def validate_crate_url(url: str):
    # Code to validate a valid CrateDB server URL
    ...


def send_request(crate_url: str, stmt: str) -> dict |  CrateError:
    validate(url)
    r = request.post(crate_url, json={'stmt': stmt})
    return parse_response(r)</pre>

::
[CrateDB HTTP API]{.text-h6}

CrateDB's http API is simple. Over port [4200]{.h} in path [/_sql]{.h}, [POST]{.h} requests 
are accepted with a body [{stmt: query}]{.h}



### [Connectors]{.text-h5}

### [Standards]{.text-h5}
 
### [Knowledge sharing]{.text-h5}

### [Communities]{.text-h5}

## [How does the ecosystem grow]
It depends on who is creating it and size of team.

### [The complexity of developing the ecosystem]{.text-h5}
The complexity of developing the ecosystem resides in on wide it is, it is not only an engineering
problem, but a marketing and people's problem. That's why several roles

### Artificially
The ecosystem can be developed artificially, by hiring engineers.

### Organically 
The community will develop it for you.

### Hybrid Approach.

### Small Size

### Big Size
## DevEx
## DevRel
## The Database environment engineer

### The desired profile

## References

:Der{r="1" link="https://www.gartner.com/en/documents/5525595"}
:Der{r="2" link="https://www.w3.org/Protocols/rfc2616/rfc2616.html"}
