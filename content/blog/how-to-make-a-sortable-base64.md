---
title: 'How to make a sortable BASE64 encoding'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'How to make a base64 encoding'
tags: [ 'base64', 'encoding', 'databases', 'python', 'tutorial', 'order' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Database Environment Engineer' } ]
show_preview: false
published: true
date: '2025-09-09'
---

## Introduction

**BASE64** as defined in [RFC4648](https://datatracker.ietf.org/doc/html/rfc4648) does not keep
lexicographical order, meaning that we cannot correctly sort text encoded in BASE64,
the closest encodings that do keep order are base32hex and base16.

There are many ways of sorting things: by size, weight, numerical order, lexicographical order, 
random order, etc. When we say that lexicographical order is not kept, we actually mean
that the **numerical order and lexicographical order** of the same set of things **are different**.

To visualize this, consider these two numbers: **1** and **255** (that are in **BASE10**).

If we order them numerically, the order is **{1, 255}**, because 1 < 255, but in **BASE64** the result
is **different**, let's see why.

First, we encode the two numbers:

![](/img/base64_ordered/base64_1.svg){maxwidth=400}

Now we have strings, not numbers. When comparing strings, we compare the **value** of each character,
and the value of one character is the **Unicode code point**.

![](/img/base64_ordered/base64_2.svg){maxwidth=600}

Looking at the first character, the value of **'A'** is **64** and the value of **'/'** is **47**.

Since 64 > 47: [base64(1)]{.h} > [base64(255)]{.h}, which is the complete opposite of numerical ordering.

You can test this in Python:

```python
import base64 as b
print(1 > 255)
# False
print(b.b64encode((1).to_bytes()) > b.b64encode((255).to_bytes()))
# True
```

Different encodings can have different order properties depending on the chosen alphabet and
implementation details.

## Why do we care?
If you are reading this, you may have your reasons to care. In my case, I care because if we create k-ordered unique ids and encode them with BASE64, we would lose order,
meaning that we would not be able to filter or sort on that id, that happens at CrateDB where
every row has an internal [_id]{.h} column :Ref{r="1"}, for example: [rzgvqZgBaSrfdxrm5nDA]{.h} which is a k-ordered (time-based)
unique id, inherited from Elasticsearch.
If the encoding maintained order and some other implementation details changed, we wouldn't need to
have columns like [created_at]{.h}, which are typical in time-series use cases. Also, indexing and
filtering are typically on orderable datasets.

## Why does it happen?
As we saw in the introduction, the core of the issue is the Unicode code point of the characters
that the encoding spouts, because the code points of the **alphabet** as defined in RFC4648 are **not ordered**.

This is the default alphabet :ref{r=2}: [ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/]{.h} 

If we compute every Unicode value: 

[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47]{.h}

We can see that it's not ordered, at the tail of the list there are values that are smaller
than the head's.

## Creating a sortable BASE64 encoding
Creating a BASE64 that maintains order is not hard, as you might already imagine, just pick an 
alphabet that is ordered by Unicode code points, there are a myriad of possible combinations.
In fact, you can do this in any encoding, the ultimate difference between encodings is the size and
the alphabet used.

For example:

[*+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]{.h}

Where the code points are:

[42, 43, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]{.h}

See how all the values are ordered. There are already non-compatible RFC4638 encodings that maintain order out there, which I would recommend
to use:

B64 (used by unix) :Ref{r="3"}:

[./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]{.h}

Xxencoding :Ref{r="3"}

[+-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]{.h}

Now, different alphabets have different properties that you will have to pick depending on your use case,
for example, **B64** is not URL friendly because it contains the character **'/'**, neither is the RFC one,
but it has a alternative URL friendly alphabet in the spec.

### The challenge

The real challenge is implementing this in the target language, most if not all languages
have already a builtin BASE64 implementation, and in some of these you cannot trivially change the
alphabet. For example, in Python, the package that implements several encodings is [base64]{.h}.
You cannot override the alphabet used in BASE64, since the actual implementation is hidden behind
[binascii]{.h} C api :ref{r="4"} for performance reasons. Ironically, you could override
the [base64._b32hexalphabet]{.h} and [base64._b32alphabet]{.h} variables since they are implemented
in Python, not C :Ref{r="5"}.

In Python, we are left with two options: to use [maketrans]{.h} to translate between characters of
different alphabets, which would be a performance nightmare or implement base64 encoding ourselves:

```python
def to_base64n(input: bytes,
               pad: bool = True,
               alphabet=BASE_64_ORDERED_ALPHABET):
    final = ""
    for i in range(0, len(input), 3):
        
        # get groups of up to three bytes
        three_bytes_group = input[i:i + 3]  

        bits = int.from_bytes(three_bytes_group)
        
        # how many bytes we have.
        valid_bytes = len(three_bytes_group)
        
        # how many bytes are we missing to have 3.
        # any 'missing' bytes will be padded.
        padding = (3 - valid_bytes)  
        
        # we push to the left how many bytes 
        # we are missing to have 3 bytes (24bits)
        bits <<= padding * 8  
        
        # bin returns one extra character 'b' hence the + 1
        # assert len(bin(bits)) == 24 + 1 
    
        # the valid bytes we have.
        for i in range(valid_bytes + 1):
            
            # extract 6 bits from the left.
            # stack overflow: 45220959
            final += alphabet[
                bits >> (18 - (i * 6)) & 0x3F  
                ]  
        if pad:
            final += '=' * padding
            
    return final
```

```python
print(to_base64n((1).to_bytes()) > to_base64n((255).to_bytes()))
# False
```

Now it orders correctly!

Overriding or choosing the alphabet is trivial in other languages like Rust, where 
the cargo package [base64](https://docs.rs/base64/latest/base64/) supports arbitrary customization.

```rust
use base64::{engine, alphabet, Engine as _};

let alph = "
+-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
"
let alphabet =
    alphabet::Alphabet::new(alph)
    .unwrap();
    
let config = engine::GeneralPurposeConfig::default()
let engine = engine::GeneralPurpose::new(&alphabet, config);
let encoded = engine.encode(b"abc 123");
```


## Wrapping up
Depending on your use case, the tricky part will be supplying your encode/decode functions to the applications 
using it, in my case, if CrateDB adopts this, we'd only have to write an encoder in the JAVA core
code and that's it, we'd never expect a user to need to decode the data.

So, pick an alphabet thoughtfully, write an encode/decode method as needed, and test very well. 
Then think about the supply chain of your encode/decode code, the repercussions of it tall in your ecosystem 
(who will maintain/own this, can you patch/update easily if needed downstream?...).

Once you have all of these figured out, **think again**, this is one 'small' system design detail 
that could haunt your application for years to come, you don't want to get it wrong.

## References
:Der{r="1" link="https://cratedb.com/docs/crate/reference/en/5.10/general/ddl/system-columns.html" text="System columns" meta="CrateDB documentation, version 5.10"}
:Der{r="2" link="https://datatracker.ietf.org/doc/html/rfc4648#section-4" text="Table 1: The Base 64 Alphabet" meta="RFC4648 section-4, 2006"}
:Der{r="3" link="https://en.wikipedia.org/wiki/Base64#Applications_not_compatible_with_RFC_4648_Base64" text="Applications not compatible with RFC 4648 Base64" meta="Wikipedia, Base64"}
:Der{r="4" link="https://github.com/python/cpython/blob/c625839237b85b16f6e6d00d0af5e50849003706/Modules/binascii.c#L104" text="binascii.c" meta="Github, CPython repository, 3.14, binascii.c, L104"}
:Der{r="5" link="https://github.com/python/cpython/blob/c625839237b85b16f6e6d00d0af5e50849003706/Lib/base64.py#L159" text="base64.py" meta="Github, CPython repository, 3.14, base64.py, L159"}
