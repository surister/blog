---
title: 'How to make a sortable base64 encoding'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Blueprint showcasing available components'
tags: [ 'python', 'Antlr4', 'software' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Database Environment Engineer' } ]
show_preview: true
published: false
published_date: '2025-06-23'
---

## Introduction

**BASE64** as defined in [RFC4648](https://datatracker.ietf.org/doc/html/rfc4648) does not keep
lexicographical order, meaning that we cannot correctly sort text encoded in base64,
the closest encodings that do keep order is base32hex and base16.

There are many ways of sorting entities by: size, weight, numerical order, lexicographical order, 
random order, etc. When we say that lexicographical order is not maintained, we actually mean
that numerical order and lexicographical order are different.

To visualize this, consider these two numbers: **1** and **255**.

If we sort them, numerically, the order is **{1, 255}**, because 1 > 255. But in **BASE64** this order
is **different**, let's see why:

![](/img/base64_ordered/base64_1.svg){width=300}

When comparing strings, we compare the **value** of each character,
The value of one character is the Unicode code point.

![](/img/base64_ordered/base64_2.svg){maxwidth=600}

In the first character, the value of **A** is **65** and the value of **/** is **47**, so there
we have it, the base64 text representation of **1** is bigger than **255**, which is the complete 
opposite of numerical ordering.

Different bases can have different orderability properties depending on the chosen alphabet.

## Why do we care?

## Creating a sortable base64 encoding