---
title: 'Generating TPC-H data for PostgreSQL'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Getting TPC-H data in PostgreSQL can sometimes be unnecessarily difficult, until this tutorial showed up!'
tags: [ 'postgres', 'tpc-h', 'benchmark' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Database Environment Engineer' }]
show_preview: false
published: true
date: '2025-09-22'
---

## Introduction

[TPC-H](https://www.tpc.org/tpch/) is a popular performance benchmark for database systems. It's
composed of several tables that follow a specification. It's also very useful to test data load/write
integrations with databases.

Setting it up the data can be confusing, so in this guide we'll see how to generate and load
different sizes of TPC-H data to PostgreSQL.

## Setting up tpchgen-cli

We will use [tpch-rs](https://github.com/clflushopt/tpchgen-rs) to generate the dataset. There
are several ways to install the library, the easiest ones are using *python* and *docker*.
Pick the option that best fits your current working system.

### Python
Using python's package manager **pip**:

```shell true
pip install tpchgen-cli
```
---
::EditorResult
<pre>Collecting tpchgen-cli
  Downloading tpchgen_cli-2.0.1-py3-none-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (3.4 kB)
Downloading tpchgen_cli-2.0.1-py3-none-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (5.5 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 5.5/5.5 MB 5.9 MB/s eta 0:00:00
Installing collected packages: tpchgen-cli
Successfully installed tpchgen-cli-2.0.1</pre>
::

```shell true
tpchgen-cli --version
```
---
::EditorResult
<pre>tpchgen 2.0.1</pre>
::

Using **uv**

```shell true
uv run --with tpchgen-cli tpchgen-cli --version
```
---
::EditorResult
<pre>tpchgen 2.0.1</pre>
::

### Docker

```shell true
docker run -it \
  ghcr.io/astral-sh/uv:python3.14-rc-bookworm \
  uv run --with tpchgen-cli \
  tpchgen-cli --version
```
---
::EditorResult
<pre>tpchgen 2.0.1</pre>
::

## Generating data

The following command will generate all the tables data in **csv** format, in the [/data]{.h} directory.
```shell
tpchgen-cli -s 1 -f csv -o /data 
```

The [-s]{.h} option specifies the scale factor, [1]{.h} is 1x, [10]{.h} is 10x, to give you an idea a 10x factor will
make the [lineitem]{.h} table have ~60 million rows.

After running the command you should have several files; each a table, in the directory.

```shell true
ls /data
```
---
::EditorResult
<pre>customer.csv  lineitem.csv  nation.csv  orders.csv  part.csv  partsupp.csv  region.csv  supplier.csv</pre>
::

### Python

```shell
uv run --with tpchgen-cli tpchgen-cli -s 1 -f csv -o /data
```

### Docker

```shell
docker run -it --rm -v /data/:/data \
  ghcr.io/astral-sh/uv:python3.14-rc-bookworm \
  uv run --with tpchgen-cli \
    tpchgen-cli -s 1 -f csv -o /data
```

## Loading data

Your PostgreSQL instance needs to have access to the [/data]{.h} directory.

### Create the table(s)

There are 8 tables, one of the most used ones is [lineitem]{.h}, since it's the biggest one.

```sql
CREATE TABLE IF NOT EXISTS "lineitem"(
  "l_orderkey"          INT,
  "l_partkey"           INT,
  "l_suppkey"           INT,
  "l_linenumber"        INT,
  "l_quantity"          DECIMAL(15,2),
  "l_extendedprice"     DECIMAL(15,2),
  "l_discount"          DECIMAL(15,2),
  "l_tax"               DECIMAL(15,2),
  "l_returnflag"        CHAR(1),
  "l_linestatus"        CHAR(1),
  "l_shipdate"          DATE,
  "l_commitdate"        DATE,
  "l_receiptdate"       DATE,
  "l_shipinstruct"      CHAR(25),
  "l_shipmode"          CHAR(10),
  "l_comment"           VARCHAR(44),
  "l_dummy"             VARCHAR(10));
```

### Load csv

```sql
COPY lineitem (
    l_orderkey,
    l_partkey,
    l_suppkey,
    l_linenumber,
    l_quantity,
    l_extendedprice,
    l_discount,
    l_tax,
    l_returnflag,
    l_linestatus,
    l_shipdate,
    l_commitdate,
    l_receiptdate,
    l_shipinstruct,
    l_shipmode,
    l_comment
)
FROM '/data/lineitem.csv'
DELIMITER ','
CSV HEADER;
```

## Wrap up

There are 8 tables, in this guide we will only see how to load [lineitem]{.h}, you can easily find the DDL for
the other tables in Google.
