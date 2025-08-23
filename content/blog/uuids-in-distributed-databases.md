---
title: 'Unique identifiers in distributed databases'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Blueprint showcasing available components'
tags: [ 'UUID', 'Distributed Databases', 'Databases', 'CrateDB' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Database Environment Engineer' }, ]
show_preview: true
published: false
#comment_links: [ { 'name': 'reddit', 'href': '' }, { 'name': 'hacker news', 'href': '' } ]
---


## [Introduction]
In this post, we will explore some properties of unique identifiers in Distribute databases, use cases,
how the most popular unique id: [UUID]{.font-weight-medium} is composed and what CrateDB; a distributed
shared-nothing database uses.


## [About databases]
One challenge of distributed databases (specifically those with shared-nothing architecture) 
is data consistency, keeping all data consistent while staying performant is hard,
since insert/updates can happen at different rates in different nodes. 

One effect of this is the lack of monotonically increasing ids, commonly known as 
[AUTO-INCREMENT]{.font-weight-medium}; that is a table's column which every time a new row is
inserted, the column's value gets incremented monotonically (usually by 1).

One example you might be familiar with is the [SERIAL]{.fm} datatype in postgres:

```sql
CREATE TABLE mytable
(
    id    serial primary key,
    data  VARCHAR(128) not null
);

insert into mytable (data) values ('some data');
insert into mytable (data) values ('some data x2');
```

```sql true
SELECT * FROM sometable
```

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

As you can see, [id]{.h} was incremented by one every time we inserted a row.
This is possible because the database keeps track of the count with a counter
(called sequences in Postgres). This is effectively a unique id, [within]{.fm} the table,
and is commonly used as a primary key.

But in our distributed world every insert has to be executed in every node or instance of the database,
in order for the nodes to increase the id correctly; they would need to communicate to keep their
counters in sync, in a read-heavy scenario this would mean massive inter-node communication, locking
and decrease of write performance, defeating one of the nice characteristics of distributed databases.

### [The need for uniqueness]
In databases, we often need to uniquely identify rows. [Primary keys]{.fm} are used for that.
By definition, primary keys need to be unique and not null, and most distributed databases choose
not to implement auto-increment sequences. What should be used then?

Well, there are two different flavors to create ids, [coordinated]{.fm}; the one we said it is not usually
implemented in distribute databases, because coordination is expensive, and [uncoordinated]{.fm}.
Uncoordinated means that any database instance or node should be able to generate valid ids 
without talking to others, [without collisions]{.fm}, and that's one of the challenges: Not creating
the same id again, otherwise it wouldn't be unique.

We could create a massive blob of pseudo-random data that would assure us it would never be generated again
in the lifespan of the universe; avoiding collisions, but that'd be not efficient. 
Imagine generating a 1GB unique id for every row in your database, it's just not feasible. Like in 
encryption, there is a careful balance between how much uniqueness we want and how much we pay for it.

That's why there is not a single way of creating an uncoordinated identifier, and depending on its
components and how its created, it will have different uniqueness guarantees, and other properties.

Some common components are:

- just pseudo-random data
- timestamps
- metadata (thread number, MAC address, process id)
- counters

And some examples of uncoordinated unique ids:

- creation timestamp (simple [created_at]{.h} field in a table)
- random data (UUID4)
- creation timestamp + machine id + increment
(:alink{.fm text="Twitter's snowflake" href="https://github.com/twitter-archive/snowflake"})
- creation timestamp + random (:alink{.fm text="Ulid" href="https://github.com/ulid/spec"})

While many engineers and companies have developed their own way of creating unique IDs, the internet 
task force, the 'official' body that takes care of promoting and publishing RFCS (standards) have
their take on it: [UUID]{.h} (Universally Unique Identifier).


### [Sortable Ids are amazing]
Being unique is the bare minimum requirement for a primary key, but there is another property
that we lose by not being able to use a sequence, the capacity to [sort]{.fm}.

Having a column that is sortable makes aggregations more efficient and enables 
features like pagination, incremental queries or last-write detection. 

For example :alink{.fm text="connector-x" href="https://github.com/sfu-db/connector-x"} uses a
sorted column to do client side query partitioning, making loading data from a database to
a dataframe very fast. More specifically, it works by issuing [SELECT MIN(field), MAX(field) FROM table]{.h},
and computing different 'buckets.' It then issues several queries in different threads concurrently.

This is an example of a partition planner that I created in rust similar to connector-x's:

```rust
PartitionPlan(
    min_value=1,
    max_value=1200000,
    count=1199969,
    metadata_query='...omitted...',
    query_data=[
    'select * from (select l_orderkey from lineitem)'
    'where l_orderkey >= 1 and l_orderkey < 600001',
    'select * from (select l_orderkey from lineitem)'
    'where l_orderkey >= 600001 and l_orderkey < 1200000'],
    partition_config=PartitionConfig(
        queries=['select l_orderkey 'from lineitem'],
        partition_on='l_orderkey',
        partition_num=2,
        partition_range=None,
        needed_metadata_from_source='CountAndMinMax',
        query_partition_mode='OnePartitionedQuery')
    )
)
```

The original query is [select l_orderkey from lineitem]{.h} and we split the query in two:

[select l_orderkey from lineitem where l_orderkey >= 1 and l_orderkey < 600001]{.h}

and

[select l_orderkey from lineitem where l_orderkey >= 600001 and l_orderkey < 1200000]{.h}

But this only works if [l_orderkey]{.h} is of a datatype that can be sorted and therefore filtered.
We can use the same technique to create a client side pseudo-paginator for any table,
which can be useful when batch-processing large tables.

An example of this in Python:

```python
class BatchedTable:
    def __init__(self,
                 table_name: str,
                 id_column: str,
                 flat: bool,
                 chunk_size: int = 2048):
        self.table_name = table_name
        self.id_column = id_column

        self.flat = flat
        self.chunk_size = chunk_size
        self.chunk_bucket = 1
        self.connection = client.connect('http://localhost:4200')
        self.cursor = self.connection.cursor()

    def query_for(self):
        return (
          f'select * from {self.table_name}'
          f' where'
          f' {self.id_column} >'
          f' {(self.chunk_bucket - 1) * self.chunk_size} and'
          f' {self.id_column} <='
          f' {((self.chunk_bucket) * self.chunk_size)} order by'
          f' {self.id_column}'
        )

    def __iter__(self):
        while True:
            query = self.query_for()
            self.cursor.execute(query)
            self.chunk_bucket += 1
            result = self.cursor.fetchall()

            if len(result) < self.chunk_size:
                return

            if self.flat:
                for l in result:
                    yield l
            else:
                yield result


def table(table_name: str,
          batch_size: int = 10_000,
          id_column: str = 'row_number',
          flat: bool = True):
    return BatchedTable(table_name=table_name,
                        id_column=id_column,
                        flat=flat,
                        chunk_size=batch_size)

if __name__ == '__main__':
    for rows in table('search3', batch_size=1000, flat=False):
        print(rows)

    # [(...),...] 1k rows
    # [(...),...] 1k rows
    # [(...),...] 1k rows
    # [(...),...] 1k rows
    ...
```

[table]{.h} will exhaust the whole table without hitting an [out of memory]{.h} error on large tables.

All of this depend on a [sortable]{.h} id, achieving maximum efficiency when the ids are monotonically
increased by 1.

## [About unique IDs]
Now we have more context of uniquely identifying rows in distributed databases. 
Let's try to understand the most popular and used ones [UUIDs]{.h}.

If you understand them at a fundamental level, you will pretty much understand every form of unique 
IDs there is, it's all very similar at the core.

### [Understanding UUIDs]
There are eight versions of UUIDs, in May 2024 we finally got published the :alink{text="last stable version" href="https://www.rfc-editor.org/rfc/rfc9562.html"}
where version 7 and 8 were added, every version creates the UUID differently, and each version has different
use cases.

The first versions 1–4 have historically been used in distributed systems, as distributed system
evolved, so did the requirements for the IDs, hence the new variants. 

You’ve probably seen them many times already; they’re those long IDs separated by dashes that
look like `51000350-1197-4f2e-bcef-ca8bc5e11b51`{.h .text-subtitle-2} (UUID4).


### [Anatomy of an UUID]

The UUID has 128 bits.

![Bits of an UUID 4](/img/uuid/128.svg)

The 128 bits are grouped in 16 octets or bytes. Counting from 0 to 15.

![128 bits, grouped in octets](/img/uuid/octets.svg)

This is at the core, what an UUID is, and the different versions just dictate how we generate these octets.

We can represent an UUID in different data 'types', depending on the system, these types will 
typically be just the data represented in different numerical bases:

* Base 2 (binary): See image
* Base 10: `164584730332688677464161912706729264512`{.fm}
* Base 16: `0x7bd1ddb5b15c4b68a507fd4ceb984580`{.fm}
* Base 16 with dashes: `7bd1ddb5-b15c-4b68-a507-fd4ceb984580`{.fm}
* Base64: `e9HdtbFcS2ilB/1M65hFgA==`{.fm}

What's commonly used and the default representation implementation for UUIDs is base 16 with dashes.

To give you a clearer look at how everything comes together, let's see the base16 (hex) value of every octet,
you can try this yourself in Python with:

```python
>>> hex(0b1111011) # The first octet
'0x7b'
```

![](/img/uuid/uuid.svg)

Now, the difference between UUID versions is what we decide what these groups of bits will be. 

The bits are split in groups of bits, there are common groups between versions: the position of the version bit (48 to 51) and variant (bit 64 to 65)

### [UUID4]

[UUID4]{.h} has 5 groups of bits:

![](/img/uuid/all.svg)

1. [random_a]{.h} [0, 47\] is random data.
2. [version]{.h}  [48, 51\] is the version.
3. [random_b]{.h} [52, 63\] is random data.
4. [variant]{.h} [64, 65\] is the variant type.
5. [random_c]{.h} [66, 127\] is random data.

Another simple way to visualize it, is just to paint the inclusive first bit number of every group.

![](/img/uuid/groups.svg)

## [What UUIDs is CrateDB using?]
CrateDB; a shared-nothing distribute database in 5.10.2 uses three different kinds :Ref{r="1"} of unique IDs:
* [ElasticFlakes]{.h}
* [UUID4 in base64]{.h}
* [DirtyUUID]{.h}.


### [ElasticFlakes]
This implementation is inherited from the Open Source days of [elasticsearch]{.h} :Ref{r="2"}
they are a time based id optimized for [Apache Lucene]{.h}, the underlining library in which 
both CrateDB and Elasticsearch are based on.

The [elasticflake]{.h}, is used to generate a [_id]{.h} :Ref{r="3"} for every row, and for the scalar function
[gen_random_text_uuid()]{.h} :Ref{r='4'}. Interesting enough, the documentation for the scalar
says that it returns an 'ID' similar to flake IDs, but there are several differences to Flake IDs :Ref{r='5'}.

Flake Ids are 128 bits and k-ordered.

An elasticflake has 120 bits, divided in 15 octets or bytes.

It's composed of a [random data]{.h} + [timestamp]{.h} + [mac address]{.h}, divided in six groups:

1. [random_a]{.fm} [0, 15\] is random data, the LSB and MSF of a random long.
2. [timestamp_a]{.fm} [16, 47\] is timestamp, the minutes to year part of the timestamp.
3. [metadata_a]{.fm} [48, 95\] is randomized mac address (or better put, random data which source is the mac address of the node.)
4. [timestamp_b]{.fm} [96, 103\]  the seconds part of the timestamp in millis.
5. [random_b]{.fm} [104, 111\] the middle byte of the random long.
6. [timestamp_c]{.fm} [112, 119\] the LSB byte of the timestamp in millis, the milliseconds part.

![](/img/uuid/elasticflake.svg)

The flake is then converted to [base64]{.h} using an alphabet that is URL safe, the default
alphabet uses '/' as an encoding character, meaning you could not use it as an url query parameter.

Since they’re time-based ids, one would expect that you could sort and filter on them, but they aren’t. 

One can naively check this:

```sql
create table t (
  real_pos integer,
  uuid generated always as gen_random_text_uuid(),
  inserted_at generated always as now()
)
```

Then insert:

```sql
insert into t22 (real_pos)
values (1), (2), (3)... --up to 10k
```

Trying to filter by [_id]{.h}, and [uuid]{.h} have different results than ordering by [inserted_at]{.h}:

```sql true
select _id, * from t
order by _id
limit 10
```

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

```sql true
select _id, * from t
order by uuid
limit 10
```

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

```sql
select _id, * from t
order by inserted_at
limit 10
```

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

[inserted_at]{.h} returns the correct results, this is also observable in filtering as expected.

This happens for three reasons:

1. The used RFC Base64 doesn’t preserve sort order for unencoded strings, because of the alphabet it uses;
by pure randomness one could actually sort on a small set of elements though.

2. Because the implementation detail of how the random data is generated. A random integer is
generated like a seed and +1 is added every time a new id is created. So if we insert a few values,
restart the cluster and insert again, we will have different seeds.

3. Because we have random data before any sortable components (timestamp parts)

You can observe this by looking at the prefix of the `_id`, they’re similar because they’re sequential.
In setups with more than one node, this random seed gets refreshed more often, that's why you will only
see sequentiality in small groups. If you only use one node, it's very visible.

If you want to check some of these things, see:

* base32hex and a custom base64 are lexicographically sortable on uuid7 but base64 is not. :Ref{r="6"}
* elasticflake is still not lexicographically sortable in base32hex. :Ref{r="7"} 

### [UUID4]
A random UUID4 as per RFC 4122 (2005), in url safe Base64 encoding.

### [DirtyUUID]
Just two integers cobbled up together, not following the UUID rfc format.

## [References]

::divider{.my-6}
::

:Der{r="1" meta="GitHub, 2025-07-01" text="CrateDB UUIDs class" link="https://github.com/crate/crate/blob/master/server/src/main/java/org/elasticsearch/common/UUIDs.java"}
:Der{r="2" meta="Elastic blog." link="https://www.elastic.co/blog/elasticsearch-is-open-source-again" text="Elasticsearch Is Open Source. Again!"}
:Der{r="3" meta="GitHub, 2025-07-01" text="CrateDB Id class" link="https://github.com/crate/crate/blob/79ff2217dde45d6a748b0f31b36c95a7b252878c/server/src/main/java/io/crate/analyze/Id.java#L48"}
:Der{r="4" meta="GitHub, 2025-07-01" text="CrateDB GenRandomTextUUIDFunction class" link="https://github.com/crate/crate/blob/master/server/src/main/java/io/crate/expression/scalar/GenRandomTextUUIDFunction.java"}
:Der{r="5" meta="GitHub, 2025-07-01" text="Flake: A decentralized, k-ordered id generation service in Erlang" link="https://github.com/boundary/flake"}
:Der{r="6" meta="GitHub, 2025-07-01" text="surister sort script" link="https://github.com/surister/mylab/blob/master/crate_uuid/sort.py"}
:Der{r="7" meta="GitHub, 2025-07-01" text="surister elasticflaketest script" link="https://github.com/surister/mylab/blob/master/crate_uuid/elasticflaketest.py"}
