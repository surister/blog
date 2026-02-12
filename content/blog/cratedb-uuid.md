---
title: 'Unique ids in CrateDB'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Explanation of all different unique ids that are used in CrateDB'
tags: [ 'CrateDB', 'UUID', 'software engineering' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Database Environment Engineer' } ]
show_preview: false
published: true
date: '2026-01-07'
comment_links: [ ]
---

## Introduction

CrateDB in 5.10.2 (and in most versions) uses three different kinds :Ref{r="1"}
of unique IDs:

* [ElasticFlakes]{.h}
* [UUID4]{.h}
* [DirtyUUID]{.h}.

## [ElasticFlakes]

This implementation is inherited from the Open Source days of Elasticsearch 
:Ref{r="2"} they are a time-based id optimized for [Apache Lucene](https://lucene.apacheorg/),
the underlining library in which both CrateDB and Elasticsearch base their
storage.

The elasticflake, is used to generate a column named [_id]{.h} :Ref{r="3"} for
every row, and for the scalar function
[gen_random_text_uuid()]{.h} :Ref{r='4'}.

### Structure

An elasticflake has **120 bits** and is divided in 15 octets or bytes.

It's composed of a [sequence]{.h} + [timestamp]{.h} + [mac address]{.h},
divided in six groups:

| # | Field           | Range      | Description                                                             |
|---|-----------------|------------|-------------------------------------------------------------------------|
| 1 | **sequence_a**  | [0, 15]    | A sequence that increments, based on a random long; the LSB and MSF.    |
| 2 | **timestamp_a** | [16, 47]   | Timestamp; the minutes-to-year part of the timestamp.                   |
| 3 | **metadata_a**  | [48, 95]   | Randomized MAC address (random data sourced from the node MAC address). |
| 4 | **timestamp_b** | [96, 103]  | Seconds part of the timestamp in milliseconds.                          |
| 5 | **sequence_b**  | [104, 111] | The middle byte of the random based sequence.                           |
| 6 | **timestamp_c** | [112, 119] | LSB byte of the timestamp in milliseconds; the milliseconds part.       |

Structured as follows:

![](/img/crate_uuid/elasticflake_structure.svg)

The id is then converted to [base64]{.h} using an alphabet that is URL safe,
resulting in a string that has 20 characters.

```sql
>>> select gen_random_text_uuid();
b8V2a5sBnHiLIAB_yCXG
```

### Sortability

Since they’re time-based ids, one would expect that you could sort and filter on
them, but they aren’t.

One can naively check this:

```sql
create table t
(
    real_pos    INTEGER,
    uuid        TEXT      DEFAULT gen_random_text_uuid(),
    inserted_at TIMESTAMP DEFAULT now()
)
```

Then insert several values:

```sql
insert into t (real_pos)
values (1) -- up to n
```

Trying to filter by [_id]{.h}, and [uuid]{.h} have different results than
ordering by [inserted_at]{.h}:

```sql true
select _id, *
from t
order by _id
limit 10
```

---
::MarkdownTable{type="table" hasTop=true :rowHighlight='[ {"from": 7, "to":7,"color": "#F54927"} ]'}
<pre>
|_id|real_pos|uuid|inserted_at|
 |-|-|-|-| 
|"gMUab5sBnHiLIAB_IyVC"|1|"2dYab5sBB8EWMoDKI2FD"|1767095542595|
|"gcUab5sBnHiLIAB_KyUs"|2|"29Yab5sBB8EWMoDKK2Eu"|1767095544621|
|"gsUab5sBnHiLIAB_NCVi"|3|"hMUab5sBnHiLIAB_NCVi"|1767095546978|
|"hcUab5sBnHiLIAB_OSW5"|4|"h8Uab5sBnHiLIAB_OSW6"|1767095548346|
|"iMUab5sBnHiLIAB_RCVs"|5|"3dYab5sBB8EWMoDKRGFt"|1767095551085|
|"icUab5sBnHiLIAB_SiU-"|6|"i8Uab5sBnHiLIAB_SiU_"|1767095552575|
|"j8Uab5sBnHiLIAB_YiXv"|10|"4dYab5sBB8EWMoDKYmHx"|1767095558897|
|"jMUab5sBnHiLIAB_VCU_"|7|"39Yab5sBB8EWMoDKVGFA"|1767095555136|
|"jcUab5sBnHiLIAB_WSWp"|8|"t84ab5sBP3MoMmUXWZWq"|1767095556522|
|"jsUab5sBnHiLIAB_XyUC"|9|"uc4ab5sBP3MoMmUXX5UE"|1767095557892|
</pre>
::

Notice how everything seems sorted but the row with real_pos 10. There will 
always be some order maintained within small buckets of ids, this is because
the first group (sequence_a) is a sequence. However, this sequence resets
every time the [int]{.h} overflows or every time you restart the node. The
sequence will also be different if another node generates the id. Since
they all hold different sequences.

```sql true
select _id, * from t
order by inserted_at
limit 10
```
---
::MarkdownTable{type="table"  hasTop=true}
<pre>
|_id|real_pos|uuid|inserted_at|
 |-|-|-|-| 
|"gMUab5sBnHiLIAB_IyVC"|1|"2dYab5sBB8EWMoDKI2FD"|1767095542595|
|"gcUab5sBnHiLIAB_KyUs"|2|"29Yab5sBB8EWMoDKK2Eu"|1767095544621|
|"gsUab5sBnHiLIAB_NCVi"|3|"hMUab5sBnHiLIAB_NCVi"|1767095546978|
|"hcUab5sBnHiLIAB_OSW5"|4|"h8Uab5sBnHiLIAB_OSW6"|1767095548346|
|"iMUab5sBnHiLIAB_RCVs"|5|"3dYab5sBB8EWMoDKRGFt"|1767095551085|
|"icUab5sBnHiLIAB_SiU-"|6|"i8Uab5sBnHiLIAB_SiU_"|1767095552575|
|"jMUab5sBnHiLIAB_VCU_"|7|"39Yab5sBB8EWMoDKVGFA"|1767095555136|
|"jcUab5sBnHiLIAB_WSWp"|8|"t84ab5sBP3MoMmUXWZWq"|1767095556522|
|"jsUab5sBnHiLIAB_XyUC"|9|"uc4ab5sBP3MoMmUXX5UE"|1767095557892|
|"j8Uab5sBnHiLIAB_YiXv"|10|"4dYab5sBB8EWMoDKYmHx"|1767095558897|
</pre>
::
[inserted_at]{.h} returns the correct results, this is also observable in 
filtering as expected.

Additionally, Base64 doesn’t preserve lexicographical order for encoded 
strings, because of the alphabet it uses, by chance some buckets of elements 
can maintain orderability if the range of the alphabet's character is ordered.
To dive deeper into this see [How to make a sortable BASE64 encoding](blog/how-to-make-a-sortable-base64)

### Recap

* The Elasticflake is a time-based 120 bit wide unique id that is encoded 
  into a url-safe base64 resulting in a 20 character string.

* It does not maintain lexicographical order, only in small buckets.

Furthermore:

* base32hex and a custom base64 are lexicographically sortable on uuid7 but 
  base64 is not. :Ref{r="5"}
* Elasticflake is still not lexicographically sortable in base32hex. :Ref{r="6"} 

## UUID4
A random UUID4 as per RFC 4122 (2005), in url safe Base64 encoding.

This unique id is not exposed to the user and is used in internal database
operations.

## DirtyUUID

It is just two random integers cobbled up together, not following the UUID RFC 
format. 

This is also not exposed to the user, it is used in internal database 
operations and is more efficient to generate than the UUID4. 

## References
:Der{r="1" authors="CrateDB GitBub" link="https://github.com/crate/crate/blob/master/server/src/main/java/org/elasticsearch/common/UUIDs.java"}
:Der{r="2" link="https://www.elastic.co/blog/elasticsearch-is-open-source-again" authors="S. Banon" pageTitle="Elasticsearch Is Open Source. Again!," websiteTitle="Elastic Blog" dateAccessed="Dec. 30, 2025."}
:Der{r="3" authors="CrateDB GitHub" text="CrateDB ID class" link="https://github.com/crate/crate/blob/79ff2217dde45d6a748b0f31b36c95a7b252878c/server/src/main/java/io/crate/analyze/Id.java#L48"}
:Der{r="4" authors="CrateDB GitHub" text="CrateDB GenRandomTextUUIDFunction class" link="https://github.com/crate/crate/blob/master/server/src/main/java/io/crate/expression/scalar/GenRandomTextUUIDFunction.java"}
:Der{r="5" authors="surister GitHub" link="https://github.com/surister/mylab/blob/master/crate_uuid/sort.py"}
:Der{r="6" authors="surister GitHub"  link="https://github.com/surister/mylab/blob/master/crate_uuid/elasticflaketest.py"}
