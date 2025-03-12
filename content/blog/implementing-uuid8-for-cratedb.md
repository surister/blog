---
title: 'Implementing uuid8 for CrateDB'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Blueprint showcasing available components'
tags: [ 'python', 'Antlr4', 'software' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Software Engineer' }, ]
show_preview: true
#comment_links: [ { 'name': 'reddit', 'href': '' }, { 'name': 'hacker news', 'href': '' } ]
---

# The distributed nature of CrateDB.
CrateDB is a distributed SQL Database. This means that unlike your good old Postgres instance, which
only has one node, CrateDB forms clusters; two or more nodes will join up, communicate and work
together. Everytime you select data, the work will be split among the nodes, this and many other 
https://cratedb.com/docs/guide/feature/index.html features make queries in CrateDB extremely fast
on huge tables. 

One advantage of this is HA (High Availability) if a meteor hits the datacenter where you are hosting
a node, other nodes in other datacenters can survive and have its own copy of the data, your
application (with slower queries) will still work and still be able to make the Monday's deadline.

TIP: Don't let the end of the world mess with your sprint.

High Availability, fast queries, easy scalability (as you only need to add more nodes) all sound good,
but like everything, it comes with drawbacks. 

One common drawback of distributed databases is the lack of monotonically increasing ids, commonly known as  ed
AUTO-INCREMENT, that is a table's column which every time a new row is inserted, the column's value
gets incremented monotonically (usually by 1), it is extremely common in the SQL world.

One example you might be familiar with is the SERIAL datatype in postgres,

CREATE TABLE mytable
(
    id    serial primary key,
    data        VARCHAR(128) not null,
);

insert into mytable (id, data) values ('what is this')
insert into mytable (id, data) values ('what is this x2')

select * from mytable

results:

As you can see, id was incremented by one, every time we inserted. This is possible because the
database keeps track of the count, with a counter, (called sequences in Postgres), but in our distributed world, 
every node has a copy of the data that needs to keep in sync. This is often called the Data consistency / Replica synchronization issue.

Every time one insert is issued, it has to be executed by every node, in order for the nodes to 
increase the id correctly, they would need to communicate to keep their counters in sync,
in a read-heavy scenario would mean massive inter-node communication overhead and performance
would be impacted, defeating the purpose of using a distributed database.



# Understanding UUIDs
Uuids stand for Universal Unique Identifier; it's that long ID with dashes that you have probably seen many times,
it looks like this: `51000350-1197-4f2e-bcef-ca8bc5e11b51`{.h .text-subtitle-2} (uuid4).

There are eight versions of UUID, in May 2024 we finally
got published the latest stable version https://www.rfc-editor.org/rfc/rfc9562.html where version
7 and 8 were added, every version creates the UUID differently, and each version has different
use cases.

UUIDs has 128 bits.
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

The integer representation of the bits I just showed you is `164584730332688677464161912706729264512`{.h .text-subtitle-2}
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

Now, the difference between UUID versions is what we decide what these bits will be. 

UUIDs are split in five groups of bits (version 1 and 6 split the group Nº5 in two groups, making the total number of groups: six),
the commonality between versions is the position of the version bit (48 to 51) and variant (bit 65 to 65)

[UUID4]{.h} goes as follow:

::CustomImage
---
"src": "/img/uuid/all.svg"
"marginTop": "15"
---
::

1. 1 random_a (0, 47)
2. 2 version (48, 51)
3. 3 random_b (52, 63)
4. 4 variant (64, 65)
5. 5 random_c (66, 127)

In the image, the box of the 4th group (variant) is skewed since the number of bits is so small, it doesn't fully
reflect on hexadecimal.