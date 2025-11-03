---
title: 'Understanding partitioned tables and sharding in CrateDB'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'A deep dive into how sharding and partitioning works in CrateDB'
tags: [ 'CrateDB', 'sharding', 'databases' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Database Environment Engineer' } ]
show_preview: false
published: true
date: '2025-08-16'
comment_links: [ { 'name': 'reddit', 'href': 'https://www.reddit.com/r/databasedevelopment/comments/1mxff2a/post_understanding_partitioned_tables_and/' } ]
---

Earlier this summer (2025) I was in J on the Beach having a conversation with a very charming Staff Engineer from
:alink{text="startree" href="https://startree.ai/"} a company that builds data analytics on top of Apache Pinot.
We were talking about how sharding and partitioning worked in our respective distributed databases.
Pretty quickly into the conversation we realized that we were talking past each other, we
were using the same terminology (segments, shards and partitions) to describe similar concepts,
but they meant slightly different things in each system.

The phrase I said that I think sparked the most confusion was: "In CrateDB a partition is the
specialization of a shard(s), by the user specifying a 'rule' to route records/rows into a shard(s)".

In this article, I will try to shed some light on what sharding and partitioning is in CrateDB,
a feature that's used to maximize read operations performance. 

## [The storage model]
To understand why a partition is a [specialized]{.fm} shard, we first need to understand the storage
model of CrateDB.

[Apache Lucene](https://lucene.apache.org/) is the cornerstone of the data model.
A table is split is several chunks called [shards]{ .fm }, a shard is the same as a Lucene Index.
Every index is composed of [segments]{.fm}, segments are immutable and
write-only, akin to pages, and they are composed of [documents/rows]{.fm}. Segments can be
searched in sequence, as each segment is its own index.

A table clustered (or split) in 2 shards would look like:

![Table split in two shards](/img/partitions/node.svg)

The number of shards that a table will be divided into is calculated automatically using a simple
formula:

::Mathshy
<pre>
\textcolor{#6A5ACD}{\text{max\_number\_shards}}
=
\max\!\left(
\textcolor{#4682B4}{4},\;
\textcolor{#2E8B57}{\text{num\_data\_nodes}}
\times
\textcolor{#4682B4}{2}
\right)
</pre>
::


Alternatively, you can manually set in the DDL query how many shards a table will be split into:

```sql
CREATE TABLE t (content TEXT)
CLUSTERED INTO 3 shards WITH (number_of_replicas = 0)
```

We can inspect how many shards a table has by querying [sys.shards]{.h}

```sql true
SELECT
  id,
  num_docs,
  path
FROM
  sys.shards
WHERE
  table_name = 't'
ORDER BY id
```

::Sep
::

::MarkdownTable{type="table" hasTop=true}
<pre>
|id|num_docs|path|
 |-|-|-| 
|0|0|"/data/data/nodes/0/indices/woQjAWZHRLWO9hF17812ew/0"|
|1|0|"/data/data/nodes/0/indices/woQjAWZHRLWO9hF17812ew/1"|
|2|0|"/data/data/nodes/0/indices/woQjAWZHRLWO9hF17812ew/2"|
</pre>
::

An index has a path because it's a file, as we said before, composed of immutable segments, this 
allows for easy backup and synchronization between different nodes as the database just
needs to send and receive files.

## [Operations of the storage models]

The fundamental part of CrateDB storage model is the [segment]{.fm}, and as operations
(read/write/update/delete) happen on node, segments are created and merged. They are merged
because search performance decreases as segments pile up, also each segment consumes file handles,
memory and CPU time.

### [Merging segments]

Segments are merged periodically by default. In Lucene, there are other merge strategies than time-based,
and CrateDB might change the policy in the future.

When two segments are merged, all the 'valid' records of each segment are combined into a new one.

![Merge of two segments into one](/img/partitions/segment_merge.svg){maxwidth=600}

You can also manually merge the segments of a table explicitly by calling:

```sql
OPTIMIZE TABLE table_name WITH (max_num_segments=1)
```

This often results in less disk usage and faster search operations, it's typically best to let CrateDB
merge the segments since in some situations, mostly after heavy writes, it can be an expensive operation.

Michael McCandless as a great :alink{text='post' href='https://blog.mikemccandless.com/2011/02/visualizing-lucenes-segment-merges.html'}
where you can visualize how merges happen with different merge policies.

### [Deleting a record]
When a record is deleted, it's not really deleted, the information stays on disk (in the segment),
and the record is marked as deleted/invalid, when an [IndexReader]{.h} reads from the indexes,
it will skip these records.

![Deletion of a record](/img/partitions/record_delete.svg)

When a merge occurs, the new segment will not contain the records that were marked as deleted.

![Merge of segments after deletion of a record](/img/partitions/node_record_deleted_merge.svg)

### [Updating a record]

When a record is updated, a new segment with the updated record(s) is created, where the previous
version of the document(s) is marked as deleted.

After a refresh, the [IndexReader]{.h} will be aware of the new segment and the record will show
up in search results.Eventually, the segments will be merged and the resulting segment will be the
same as if we had updated the original segment.

![Merge of segments after the update of a record](/img/partitions/record_updated.svg)

### [Inserting a record (routing)]

When inserting records, they have to be approximately [evenly]{.fm} routed to the shards, otherwise
shard imbalance could degrade performance.

This is the used formula:

:MaT{text="\textcolor{#6A5ACD}{\text{shard\_number}} 
= 
\text{hash}\!\left(\textcolor{#4682B4}{\text{routing\_column}}\right)
\bmod 
\textcolor{#DAA520}{\text{total\_primary\_shards}}
" .mt-5}

If a primary key exists, that will be used as the routing column. The user can also specify an
explicit routing column with [CRATE TABLE t (a integer, b text) CLUSTERED BY (a)]{.h}, if no
primary key or explicit routing column exists, the internal column [_id]{.h} is used.

We can see the effect of routing after inserting a value and checking the shards system table.

After one insert:

```sql true
SELECT
  id as shard_id,
  num_docs
FROM
  sys.shards
WHERE
  table_name = 't'
ORDER BY
  id
```

::Sep
::

::MarkdownTable{type="table" hasTop=true}
<pre>
|shard_id|num_docs|
 |-|-| 
|0|1|
|1|0|
|2|0|</pre>
::

After another insert:



::MarkdownTable{type="table"}
<pre>
|shard_id|num_docs|
 |-|-| 
|0|1|
|1|0|
|2|1|</pre>
::

### [Inserting a record (segments)]

The record(s) is first committed to both the [translog]{.fm} and an [in-memory buffer]{.fm}, once
it's written to the translog we can ensure that the data will not be lost if a node failure happens
as we can recover and write the new segments from it.

When a refresh happens, the segment is created, still in memory, and it will now be available in
search results, after that at some point the in-memory segments will be committed to disk.

![Merge of segments after the update of a record](/img/partitions/insert.svg)

We can see this by checking the segments system table, after inserting a new record and manually
calling refresh:

```sql true
SELECT
  committed,
  deleted_docs,
  num_docs,
  search,
  shard_id
FROM
  sys.segments
WHERE
  table_name = 't'
```

::Sep
::

::MarkdownTable{type="table" hasTop=true}
<pre>
|committed|deleted_docs|num_docs|search|shard_id|
 |-|-|-|-|-| 
|true|0|1|true|2|
|false|0|1|true|2|
|true|0|1|true|0|</pre>
::

There are three segments, each with one record, all available for search, and the newly added
segment is still not committed to disk. If we call optimize to forcibly merge the segments:

::MarkdownTable{type="table"}
<pre>
|committed|deleted_docs|num_docs|search|shard_id|
 |-|-|-|-|-| 
|true|0|2|true|2|
|true|0|1|true|0|</pre>
::

Segments are now merged, if you are wondering why there are two instead of one, remember that the
segments belong to a shard, the merged segments were from the shard nº2.

## [Partitioned tables]

::Alert
---
"type": "info"
"icon": "mdi-lightbulb"
"title": "Remember what we said earlier"
"text": "In CrateDB a partition is the specialization of a shard(s), by specifying a 'rule' (partition column) that dictates record routing and shard creation."
---
::

<br>

A partitioned table is a table that has a defined [partition column]{.h}, for every unique value of that
partition column, a new partition for the table will be created.

Partitions are split into shards, the number of shards is calculated the same as before, either the
default formula or defined by the user. New records will be routed to its partition and then a shard, 
hence the _"a partition is the specialization of a shard(s)..."_.

To understand the concept better, let's look at this table:

```sql
CREATE TABLE t (
  "ts" TIMESTAMP,
  "ts_month" TIMESTAMP GENERATED ALWAYS AS date_trunc('month', "ts")
) 
CLUSTERED INTO 3 SHARDS
PARTITIONED BY ("ts_month")
WITH (number_of_replicas = 0)
```

[ts_month]{.h} will contain the month of [ts]{.h}, and the table is partitioned by it, so for
every unique value of the partition column (every month) a new partition will be created, furthermore
every partition will have 3 shards, therefore [12 months (and partitions) * 3 shards = 36 shards]{.h}
is the maximum number of shards that table can have (without replication).

The shard map of the table will look like this:

![Table partitioned by month](/img/partitions/partition_tables.svg)
 
As you can see, the structure of a table doesn't really change, it is still composed of shards and
segments, but when it has a [partition column]{.h}, the rule of creating shards and routing records
depends on that partition column.

As a rule of thumb:

* Unpartitioned tables: Number of shards is the default [formula]{.h} or defined in [clustered by n_shards]{.h}.
Routing is default [_id]{.h} column or primary key or explicit routing column if defined.
* Partitioned tables:  Number of shards is the default [formula]{.h} or defined in [clustered by n_shards]{.h} [multiplied]{.fm}
by the number of partitions, the number of partitions is equal to the count unique values of the [routing]{.h} column.

### [Why do we partition tables?]{.text-red .text-h5}

The answer to why sharding tables is easy, it allows for easy backup, replication and faster
queries, as different indexes can be searched concurrently,
but why partitioning or specializing sets of shards to a routing column?

Consider this situation similar to partitions in CrateDB, where we have a set of dates, grouped
by their months:

![Dates grouped by month](/img/partitions/months.svg)

When filtering values by month, months can be skipped to directly access the needed dates.
For example, to get the date [1994-03-26]{.fm .text-green}, it only requires scanning one group and 4 records
instead of scanning 12 records if the data is not grouped by month.

By grouping your data into buckets or partitions by a partition column, queries that filter
on that column will be faster, since the query engine can just skip entire partitions.
A very typical use case is time-series data, where there is a date or timestamp column and queries
usually filter on time.

Choosing the [partition_column]{.fm} is critical, a badly chosen column can result in a very high
number of shards and most likely hit the default limit of 1000 shards per table, imagine if we chose
[seconds]{.fm} as the partition column, if we added many timestamp records, very quickly we would
create many partitions, hurting performance and storage. The right partition column will depend
on the data, use case and requirements, you can read more about this in
[sharding and partitioning guide](https://cratedb.com/docs/guide/admin/sharding-partitioning.html).

## [Notes: Replication is turned off]

Sharding a table is part of the fundamental structure of the data model in CrateDB, another fundamental aspect
is [replication]{.fm}.

By default, tables have one replica, this multiplies the number of shards,
the total number of shards is: [primary shards + replica shards]{.h}. In this article, the replication was
turned off and the images showing shards do not show replica shards, only primary shards.

This was done to simplify the different explanations and query results.

## [Summary]

I hope that by the end of the article you have a deeper understanding of CrateDB's storage model and
partitioning: How every table in CrateDB is split into shards and how partitioning is just creating
and grouping shards depending on the values of a column. One could even think that an unpartitioned
table is just a partitioned table with only one partition and a static number of shards.

In other systems, a partition or segment would be the equivalent to a shard in CrateDB, hence the common 
misunderstanding when comparing systems.
