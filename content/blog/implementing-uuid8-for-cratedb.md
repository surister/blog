---
title: 'Implementing uuid8 for CrateDB'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Blueprint showcasing available components'
tags: [ 'python', 'Antlr4', 'software' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Software Engineer' }, ]
show_preview: true
published: false
#comment_links: [ { 'name': 'reddit', 'href': '' }, { 'name': 'hacker news', 'href': '' } ]
---

1. explain briefly distributed database/cratedb
2. explain why we need unique primary keys (also mention how nice it'd be to have sortable stuff)
3. explain what UUID is
4. limitations on cratedb _id field and generate_uuid4 (how can we sort/can we sort on _id? how is _id generated)
5. propose UUID7  or UUID8 as solutions
6. try UUID7/UUID8 IN CLIENT


## [The distributed nature of CrateDB.]{.text-h4}
CrateDB is a distributed SQL Database. This means that unlike your good old Postgres instance, which
only has one node, CrateDB forms clusters; two or more nodes will join up, communicate and work
together. Everytime you select data, the work will be split among the nodes, this and many other 
 :alink{text="features" url="https://cratedb.com/docs/guide/feature/index.html"} make queries in CrateDB extremely fast
on huge tables. 

CrateDB follows a shared nothing architecture, every node has its own copy of the data, one advantage of this is HA (High Availability.) 
If a meteor hits the datacenter where you are hosting a node, other nodes in other datacenters can survive, your
application (with slower queries) will still work and still be able to make the Monday's deadline.

::Alert
---
"alert_type": "success"
"icon": "mdi-lightbulb"
"text": "TIP: Don't let the end of the world mess with your sprint."
"alert_bd_color": "white"
---
::

High Availability, fast queries, easy scalability (as you only need to add more nodes) all sound good,
but like everything, it comes with drawbacks. 

One drawback of distributed databases (specifically those with share-nothing architecture) is data consistency,
keeping all data in sync is a challenge, since insert/updates can happen at different rates in different nodes.

One effect of this is the typical lack of monotonically increasing ids, commonly known as 
[AUTO-INCREMENT]{.h}; that is a table's column which every time a new row is inserted the column's value
gets incremented monotonically (usually by 1), it is extremely common in the SQL world.

One example you might be familiar with is the [SERIAL]{.h} datatype in postgres,

::Editor{lang='sql'}
<pre>
CREATE TABLE mytable
(
    id    serial primary key,
    data  VARCHAR(128) not null
);

insert into mytable (data) values ('what is this');
insert into mytable (data) values ('what is this x2');</pre>
::

::Editor{hasResult="true" lang='sql'}
<pre>
SELECT * FROM sometable</pre>
::

::Sep
::

::MarkdownTable{type="table"  hasBottom=true}
<pre>
| id | table_name        | 
|----|-------------------| 
| 1  | "what is this"    | 
| 2  | "what is this x2" |
</pre>
::

As you can see, id was incremented by one every time we inserted a row.
This is possible because the database keeps track of the count with a counter (called sequences in Postgres).

But in our distributed world every insert has to be executed in every node,
in order for the nodes to increase the id correctly, they would need to communicate to keep their
counters in sync, in a read-heavy scenario would mean massive inter-node communication overhead 
and performance would be impacted, defeating the purpose of using a distributed database.


## [Hunting for uniqueness in Primary Keys]{.text-h4}
By definition, primary keys need to be unique and not null since we need to identify every row uniquely,
and we cannot use one of the simplest and most effective ones: [AUTO-INCREMENT]{.h}. What do we use then?

Throughout the years, many different ways of creating uncoordinated unique IDs have been developed, mostly using a
combination of random data, timestamps, metadata (thread number, MAC address, proc id) and counters:

Creation timestamp (simple created_at), random data, creation timestamp + machine id + increment
(:alink{text="Twitter's snowflake" url="https://github.com/twitter-archive/snowflake"}), 
creation timestamp + random (:alink{text="Ulid" url="https://github.com/ulid/spec"})...

While many engineers and companies have developed their own way of creating unique IDs, the internet 
task force, the 'official' body that takes care of promoting and publishing RFCS (standards) has
their take on it: [UUID]{.h} (Universally Unique Identifier).


## [Sortable Ids are amazing]{.text-h4}
Okey, primary keys have to be unique, but there is another amazing property that we lose by not being
able to use auto-increment fields is [sortability]{.h} TODO EXPLAIN


## [Understanding UUIDs]{.text-h4}
There are eight versions of UUID, in May 2024 we finally got published the :alink{text="finished stable version" url="https://www.rfc-editor.org/rfc/rfc9562.html"}
where version 7 and 8 were added, every version creates the UUID differently, and each version has different
use cases.

The first versions 1-4 have historically been used in distributed systems but 
they were not enough for many systems, hence why we have so many variants. As the newest versions (7-8)
are pretty much based on these variants.

You have probably seen them many times already, they are those long IDs separated by dashes that look like `51000350-1197-4f2e-bcef-ca8bc5e11b51`{.h .text-subtitle-2} (uuid4).

A UUID has 128 bits.
::CustomImage
---
"src": "/img/uuid/128.svg"
"label": "Bits of an UUID"
"marginTop": "15"
---
::

The 128 bits are further split in 16 octets or bytes. Counting from 0 to 15.

::CustomImage
---
"src": "/img/uuid/octets.svg"
"label": "128 bits, separated in octets"
"marginTop": "15"
---
::

The UUID can be represented as binary data or integers.

The integer representation of the image's UUID is `164584730332688677464161912706729264512`{.h .text-subtitle-2}
(from base 2 to base 10). 

What you usually see is the base 16 of the integer (hex) with dashes.

Hex: `0x7bd1ddb5b15c4b68a507fd4ceb984580`{.h .text-subtitle-2}

Hex and dashes: `7bd1ddb5-b15c-4b68-a507-fd4ceb984580`{.h .text-subtitle-2}

To give you a clearer look at how everything comes together, let's see the hex value of every octet:

::CustomImage
---
"src": "/img/uuid/uuid.svg"
"marginTop": "15"
---
::

Now, the difference between UUID versions is what we decide what these groups of bits will be. 

The bits are split in five groups of bits (except version 1 and 6 that have 6 groups),
the commonality between versions is the position of the version bit (48 to 51) and variant (bit 64 to 65)

[UUID4]{.h} goes as follows:

::CustomImage
---
"src": "/img/uuid/all.svg"
"marginTop": "15"
---
::

1. 1 [random_a]{.h} [0, 47\] is random data.
2. 2 [version]{.h}  [48, 51\] is the version.
3. 3 [random_b]{.h} [52, 63\] is random data.
4. 4 [variant]{.h} [64, 65\] is the variant type.
5. 5 [random_c]{.h} [66, 127\] is random data.

Another simple way to visualize it, is just to paint the inclusive first bit number of every group.

::CustomImage
---
"src": "/img/uuid/groups.svg"
"marginTop": "15"
---
::

## [What UUIDs is CrateDB using?]{.text-h4}
CrateDB uses three different kinds :Ref{r="1"} of UUIDs in different places:
ElasticFlakes, UUID4 and DirtyUUID.

::Alert
---
"alert_type": "warning"
"icon": "mdi-alert"
"text": "Writing this for CrateDB 5.10.2"
"alert_bd_color": "white"
---
::

### [ElasticFlakes]{.text-h5}
As it names implies, this implementation is inherited from the Open Source days of elasticsearch :Ref{r="2"}
they are a time based id optimized for Apache Lucene, the underlining library in which both CrateDB and Elasticsearch are based on.

The [elasticflakes]{.h}, is used to generate a [_id]{.h} :Ref{r="3"} for every row, and for the scalar function
[gen_random_text_uuid()]{.h} :Ref{r='4'}. Interesting enough, the documentation for the scalar
says that it returns an 'ID' similar to flake IDs. Flake IDs :Ref{r='5'} are supposed to be time-based,
but the name of the function has 'random' in it, an unfortunate name.

An elasticflake has 120 bits, divided in 15 octets or bytes.

It's composed of a random data + timestamp + mac address, divided in 6 groups:

1. [random_a]{.h} [0, 15\] is random data, the LSB and MSF of the random long.
2. [timestamp_a]{.h} [16, 47\] is timestamp, the minutes-years part of the timestamp in millis, (also bits 16-40).
3. [metadata_a]{.h} [48, 95\] is randomized mac address.
4. [timestamp_b]{.h} [96, 103\] is timestamp, the seconds part of the timestamp in millis
5. [random_b]{.h} [104, 111\] is random data, the middle byte of the random long.
6. [timestamp_c]{.h} [112, 119\] is timestamp, the LSB byte of the timestamp in millis, the milliseconds part.

Resulting in:

::CustomImage
---
"src": "/img/uuid/elasticflake.svg"
"marginTop": "15"
---
::

The flake is then converted to [base64]{.h}.

Since they are time-based flakes, one would expect that you could sort and filter on them, but to my surprise, they are not. 

To test this I created the following table:

::Editor{lang='sql'}
<pre>
create table t (
  real_pos integer,
  uuid generated always as gen_random_text_uuid(),
  inserted_at generated always as now()
)</pre>
::

The insert is:

::Editor{lang='sql'}
<pre>insert into t22 (real_pos)
values (1), (2), (3)... --up to 10k</pre>
::

Trying to filter by [_id]{.h}, and [uuid]{.h} have different results than ordering by [inserted_at]{.h}:

::Editor{hasResult="true" lang='sql'}
<pre>
select _id, * from t
order by _id
limit 10</pre>
::

::Sep
::

::MarkdownTable{type="table"  hasBottom=true}
<pre>
|_id|real_pos|inserted_at|uuid|
 |-|-|-|-| 
|"-1FXkZUBNha00pvZ-xcJ"|641|1741900217097|"_VFXkZUBNha00pvZ-xcJ"|
|"-1FXkZUBNha00pvZ9BRZ"|177|1741900215385|"_VFXkZUBNha00pvZ9BRZ"|
|"-1FXkZUBNha00pvZ_RgJ"|789|1741900217609|"_VFXkZUBNha00pvZ_RgJ"|
|"-1FXkZUBNha00pvZ_xlf"|955|1741900218207|"6xFXkZUBiP2zR8B6_9Bf"|
|"-1FYkZUBNha00pvZ03Ht"|14491|1741900272621|"V4xYkZUB5Zpn6aZb0y3u"|
|"-1FYkZUBNha00pvZ13Jm"|14653|1741900273511|"-YxYkZUB5Zpn6aZb1y1n"|
|"-1FYkZUBNha00pvZ2nNJ"|14809|1741900274250|"g4xYkZUB5Zpn6aZb2i5K"|
|"-1FYkZUBNha00pvZ3HRq"|14939|1741900274794|"44xYkZUB5Zpn6aZb3C5q"|
|"-1FYkZUBNha00pvZ63rJ"|15861|1741900278729|"f4xYkZUB5Zpn6aZb6zLJ"|
|"-1FYkZUBNha00pvZ6nkO"|15705|1741900278287|"74xYkZUB5Zpn6aZb6jEP"|
</pre>
::

::Editor{hasResult="true" lang='sql'}
<pre>
select _id, * from t
order by uuid
limit 10</pre>
::

::Sep
::

::MarkdownTable{type="table"  hasBottom=true}
<pre>
|_id|real_pos|inserted_at|uuid|
 |-|-|-|-| 
|"-VFXkZUBNha00pvZ-RYI"|495|1741900216585|"-1FXkZUBNha00pvZ-RYJ"|
|"-VFXkZUBNha00pvZ8RNV"|11|1741900214613|"-1FXkZUBNha00pvZ8RNV"|
|"-VFXkZUBNha00pvZ9hXX"|343|1741900216023|"-1FXkZUBNha00pvZ9hXX"|
|"-VFYkZUBNha00pvZ-oDA"|16775|1741900282560|"-1FYkZUBNha00pvZ-oDA"|
|"-VFYkZUBNha00pvZ0XCd"|14325|1741900272029|"-1FYkZUBNha00pvZ0XCd"|
|"-VFYkZUBNha00pvZ33U-"|15093|1741900275518|"-1FYkZUBNha00pvZ33U-"|
|"-VFYkZUBNha00pvZ4nYv"|15245|1741900276271|"-1FYkZUBNha00pvZ4nYv"|
|"-VFYkZUBNha00pvZ53hl"|15549|1741900277605|"-1FYkZUBNha00pvZ53hl"|
|"-VFYkZUBNha00pvZ5Xdp"|15401|1741900277097|"-1FYkZUBNha00pvZ5Xdp"|
|"-VFYkZUBNha00pvZ8HyN"|16171|1741900279949|"-1FYkZUBNha00pvZ8HyN"|
</pre>
::

::Editor{hasResult="true" lang='sql'}
<pre>
select _id, * from t
order by inserted_at
limit 10</pre>
::

::Sep
::

::MarkdownTable{type="table"  hasBottom=true}
<pre>
|_id|real_pos|inserted_at|uuid|
 |-|-|-|-| 
|"6FFXkZUBNha00pvZ8RMV"|0|1741900214550|"gYtXkZUB5Zpn6aZb8fQW"|
|"6VFXkZUBNha00pvZ8RMc"|1|1741900214556|"61FXkZUBNha00pvZ8RMc"|
|"7FFXkZUBNha00pvZ8RMh"|2|1741900214562|"g4tXkZUB5Zpn6aZb8fQi"|
|"7VFXkZUBNha00pvZ8RMm"|3|1741900214566|"hYtXkZUB5Zpn6aZb8fQn"|
|"7lFXkZUBNha00pvZ8RMt"|4|1741900214573|"8FFXkZUBNha00pvZ8RMt"|
|"8VFXkZUBNha00pvZ8RM0"|5|1741900214580|"h4tXkZUB5Zpn6aZb8fQ0"|
|"8lFXkZUBNha00pvZ8RM6"|6|1741900214586|"9FFXkZUBNha00pvZ8RM6"|
|"9VFXkZUBNha00pvZ8RM-"|7|1741900214591|"iYtXkZUB5Zpn6aZb8fQ_"|
|"9lFXkZUBNha00pvZ8RNE"|8|1741900214596|"i4tXkZUB5Zpn6aZb8fRF"|
|"91FXkZUBNha00pvZ8RNJ"|9|1741900214601|"jYtXkZUB5Zpn6aZb8fRK"|
</pre>
::

Inserted at returns the correct results, this is repeatable in filtering, let's take for example the
row with [real_pos] 3.

["7VFXkZUBNha00pvZ8RMm" -	3	-  1741900214566	- "hYtXkZUB5Zpn6aZb8fQn"]{.h}

::Editor{hasResult="true" lang='sql'}
<pre>
select count(*) from t
where _id > '7VFXkZUBNha00pvZ8RMm'</pre>
::

::Sep
::

::MarkdownTable{type="table"  hasBottom=true}
<pre>
|count(*)|
 |-| 
|86732|
</pre>
::

::Editor{hasResult="true" lang='sql'}
<pre>
select count(*) from t
where uuid > 'hYtXkZUB5Zpn6aZb8fQn'</pre>
::

::Sep
::

::MarkdownTable{type="table"  hasBottom=true}
<pre>
|count(*)|
 |-| 
|28680|
</pre>
::

::Editor{hasResult="true" lang='sql'}
<pre>
select count(*) from t
where inserted_at > 1741900214566</pre>
::

::Sep
::

::MarkdownTable{type="table"  hasBottom=true}
<pre>
|count(*)|
 |-| 
|99996|
</pre>
::

We can clearly see that we cannot properly filter nor order by the elasticflakes. Digging in the git logs
I found a PR for https://github.com/crate/crate/issues/5845, so at least we know that at some point
in the past it was possible.

Probably the reason why it cannot be sorted, is that the flake is being transformed to base64, and
base64

# [Problems]{.text-h1}
# This one is very interesting on how it works:
# https://github.com/crate/crate/commit/c76a4a298de849be05b8c0a1b86b74a78b9a590c

- why almost all characters in the flake look identical but the first ones, thile the last three bytes should be different
if I manually create several flakes in another programs, the last parts of the flakes are different, as expected, why in cratedb are the same?
it it because the synchronized? Test: log in cratedb the different parts of the flake, and insert serveral
  - sequenceNumber is the same for the life of the program? i think so as its a class variable
- why can we sort in base64?
- why cant I sort on long tables?
  - small sized rows it seems to work, only not in long tables <- test this more
- elastic https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-id-field.html
- https://discuss.elastic.co/t/sort-by-id-field/169017/2


:Der{r="1" link="https://github.com/crate/crate/blob/master/server/src/main/java/org/elasticsearch/common/UUIDs.java"}
:Der{r="2" link="Elasticsearch used to be open source, they dropped the open source license and as of August 2024 they are back again."}
:Der{r="3" link="https://github.com/crate/crate/blob/79ff2217dde45d6a748b0f31b36c95a7b252878c/server/src/main/java/io/crate/analyze/Id.java#L48"}
:Der{r="4" link="https://github.com/crate/crate/blob/master/server/src/main/java/io/crate/expression/scalar/GenRandomTextUUIDFunction.java"}
:Der{r="5" link="https://github.com/boundary/flake"}

CREATE TABLE test (ts TIMESTAMP);
INSERT INTO test (ts) VALUES ('2017-01-01'), ('2017-01-02'), ('2017-01-03'), ('2017-01-04'), ('2017-01-05'), ('2017-01-06');
SELECT ts, _id FROM test ORDER BY _id LIMIT 1;