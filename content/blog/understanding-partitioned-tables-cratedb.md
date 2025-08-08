---
title: 'Understanding partitioned tables in CrateDB'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Blueprint showcasing available components'
tags: [ 'python', 'Antlr4', 'software' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Monologue Expert' }, { 'name': 'Anon' } ]
show_preview: true  
published: false
published_date: '2025-06-23'
comment_links: [ { 'name': 'reddit', 'href': '' }, { 'name': 'hacker news', 'href': '' } ]
---

Earlier this summer (2025) I was in J on the Beach having a conversation with a very charming Staff Engineer from
[startree]{ .text-red } a company that builds upon Apache Pinot. We were talking about how sharding and partitioned worked
in our respective databases which are both distributed, quickly into the conversation we were a bit confused,
We understood things differently and rightly so! We use the same terminology (segments, shards and partitions)
for similar but different things.

When I arrived home that day I quicly checked the documentation and did some testing to confirm a phrase I said 
that I think sparked the most confusion: "In CrateDB a partition is the specialization of a shard defined by the user,
the user can specify the 'rule' to route records/rows into that shard".

In this article we will try to understand partitioning in CrateDB in depth and how it compares to other systems like 
apache pinot or timescale.

## [Data in CrateDB, the basics]{ .text-red .text-h5 }
To understand partitioning and why a partition is a 'specialized' shard, we first need to understand how data
is stored in CrateDB. 

Apache lucene is the central piece of CrateDB's data storage, so we share a lot of the same terms.
In SQL terms, a table is split is several chunks, called [indexes]{ .fm }. Every index is composed of 
[segments], segments that are immutable and write-only, akin to pages they are composed of records or
in SQL terms, rows.




