---
title: 'Understanding partitioned tables and sharding in CrateDB'
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
:alink{text="startree"} a company that builds data analytics on top of Apache Pinot.
We were talking about how sharding and partitioning worked in our respective distributed databases.
Pretty quickly into the conversation we realized that we were talking past each other, we
were using the same terminology (segments, shards and partitions) to describe similar concepts,
but they meant slightly different things in each system.

The phrase I said that I think sparked the most confusion was: "In CrateDB a partition is the
specialization of a shard, by the user specifying a 'rule' to route records/rows into a shard".

In this article, we will try to understand partitioning in CrateDB in depth and how it compares
to other systems like apache pinot or timescale.

## [The storage model]{ .text-red .text-h4 }
To understand why a partition is a [specialized]{.fm} shard, we first need to understand the storage
model of CrateDB.

:alink{text='Apache Lucene' url='https://lucene.apache.org/'} is the cornerstone of the data model.
A table is split is several chunks called [shards]{ .fm }, a shard is the same as a Lucene Index.
Every index is composed of [segments]{.fm}, segments are immutable and
write-only, akin to pages, and they are composed of [documents/rows]{.fm}. Segments can be
searched in sequence, as each segment is its own index.

::CustomImage
---
"src": "/img/partitions/node.svg"
"label": "Table divided in two shards"
"marginTop": "15"
---
::

The number of shards that a table will be divided into is calculated automatically using a simple
formula:

[max(4, num_data_nodes * 2)]{.h}

Alternatively, you can also decide in the DDL query how many shards a table will be split into:

::editor{lang='sql'}
<pre>
CREATE TABLE t (content TEXT)
CLUSTERED INTO 3 shards WITH (number_of_replicas = 0)</pre>
::

We can inspect how many shards a table has by querying [sys.shards]{.h}

::editor{hasResult="true" lang='sql'}
<pre>
SELECT
  id,
  num_docs,
  path
FROM
  sys.shards
WHERE
  table_name = 't'
ORDER BY id</pre>
::

::Sep
::

::MarkdownTable{type="table"  hasBottom=true}
<pre>
|id|num_docs|path|
 |-|-|-| 
|0|0|"/data/data/nodes/0/indices/woQjAWZHRLWO9hF17812ew/0"|
|1|0|"/data/data/nodes/0/indices/woQjAWZHRLWO9hF17812ew/1"|
|2|0|"/data/data/nodes/0/indices/woQjAWZHRLWO9hF17812ew/2"|
</pre>
::

An index has a path because it's a file, as we said before, composed of immutable segments, this 
allows for easy backup and synchronization between different nodes as it just needs to send and
receive files.

## [Operations of the storage models]{ .text-red .text-h4}

The fundamental part of CrateDB storage model is the [segment]{.fm}, and as operations
(read/write/update/delete) happen on node, segments are created and merged. They are merged
because performance decreases as segments pile up since each segment consumes file handles, memory
and CPU time.


### [Merging segments]{ .text-red .text-h5 }

Periodically segments are merged. In lucene, there are other merge strategies than time-based,
and CrateDB might change the policy in the future.

::CustomImage
---
"src": "/img/partitions/segment_merge.svg"
"label": "Merge of a segment"
"width": 400
"marginTop": "15"
---
::

You can also manually optimize the segments of a table explicitly by calling:

::editor{lang='sql'}
<pre>
OPTIMIZE TABLE table_name WITH (max_num_segments=1)</pre>
::

Michael Mccandless as a great :alink{text='post' url='https://blog.mikemccandless.com/2011/02/visualizing-lucenes-segment-merges.html'}
where you can visualize how merges can happen.

### [Deleting a record]{ .text-red .text-h5 }

When a record is deleted, it's not really deleted, the information stays on disk (in the segment),
and the record is marked as deleted/unavailable, when an [IndexReader]{.h} reads from the indexes,
it will skip these records.

::CustomImage
---
"src": "/img/partitions/record_delete.svg"
"label": "Deletion of a record"
"marginTop": "15"
---
::

When a merge occurs, the new segment will not contain the records that were marked as deleted.

::CustomImage
---
"src": "/img/partitions/node_record_deleted_merge.svg"
"label": "Merge of segments after deletion of a record"
"marginTop": "15"
---
::

### [Updating a record]{ .text-red .text-h5}

When a record is updated, it's marked as deleted and the new record is written to a new
segment, now the updated record is available in the new segment and will show up in searches,
eventually the segment will be merged and the resulting segment would be equal to an updated
version of it.

::CustomImage
---
"src": "/img/partitions/record_updated.svg"
"label": "Merge of segments after the update of a record"
"marginTop": "15"
---
::

### [Inserting a record]

When inserting records, they have to be approximately evenly [routed]{.fm} to the shards,
this is the used formula:

[shard number = hash(routing column) % total primary shards]{.h}.

1. If primary key in a table exists

one record:

::editor{hasResult="true" lang='sql'}
<pre>
SELECT
  id as shard_id,
  num_docs
FROM
  SYS.shards
WHERE
  table_name = 't'
ORDER BY
  id</pre>
::

::Sep
::

::MarkdownTable{type="table"  hasBottom=true}
<pre>
|shard_id|num_docs|
 |-|-| 
|0|1|
|1|0|
|2|0|
</pre>
::

after another insert 

::MarkdownTable{type="table"  hasBottom=true}
<pre>
|shard_id|num_docs|
 |-|-| 
|0|1|
|1|0|
|2|0|
</pre>
::

## Finally, partitioned tables

## 