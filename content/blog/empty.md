---
title: 'Blueprint'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Blueprint showcasing available components'
tags: [ 'python', 'Antlr4', 'software' ]
---
## [Text spices]{.text-red .text-h2}
[Antlr4]{.h} highlighted

[Big text]{.text-h1}

## Markdown tables (input has to be a valid markdown table)

<h3>Text table</h3>

::MarkdownTable{type="text" .my-5}
<pre>
| schema_name | table_name                                          | sum(num_docs) | (sum(size) / 1000000::bigint) | avg_size_in_bytes  |
|-------------|-----------------------------------------------------|---------------|-------------------------------|--------------------| 
| "doc"       | "taxi_january"                                      | 5929248       | 775                           | 130.74343390595232 |
| "doc"       | "taxi_january_bestcompresion"                       | 5929248       | 581                           | 98.15085909714014  |
| "doc"       | "taxi_january_nocolumnstore_bestcompression"        | 5929248       | 411                           | 69.34966845711294  |
| "doc"       | "taxi_january_nocolumnstore_noindex_bestcompresion" | 5929248       | 244                           | 41.172756140407685 |
| "doc"       | "taxi_january_noindex_bestcompression"              | 5929248       | 423                           | 71.48468304918264  |
| "doc"       | "taxi_january_nocolumnstore"                        | 5929248       | 639                           | 107.92968315712211 |
| "doc"       | "taxi_january_nocolumnstore_noindex"                | 5929248       | 474                           | 80.03273905898354  |
| "doc"       | "taxi_january_noindex"                              | 5929248       | 635                           | 107.13091457803755 |
</pre>
::

<h3>Normal table</h3>

::MarkdownTable{hasTop="true" type="table" .mt-5 }
<pre>
| schema_name | table_name                                          | sum(num_docs) | (sum(size) / 1000000::bigint) | avg_size_in_bytes  |
|-------------|-----------------------------------------------------|---------------|-------------------------------|--------------------| 
| "doc"       | "taxi_january"                                      | 5929248       | 775                           | 130.74343390595232 |
| "doc"       | "taxi_january_bestcompresion"                       | 5929248       | 581                           | 98.15085909714014  |
| "doc"       | "taxi_january_nocolumnstore_bestcompression"        | 5929248       | 411                           | 69.34966845711294  |
| "doc"       | "taxi_january_nocolumnstore_noindex_bestcompresion" | 5929248       | 244                           | 41.172756140407685 |
| "doc"       | "taxi_january_noindex_bestcompression"              | 5929248       | 423                           | 71.48468304918264  |
| "doc"       | "taxi_january_nocolumnstore"                        | 5929248       | 639                           | 107.92968315712211 |
| "doc"       | "taxi_january_nocolumnstore_noindex"                | 5929248       | 474                           | 80.03273905898354  |
| "doc"       | "taxi_january_noindex"                              | 5929248       | 635                           | 107.13091457803755 |
</pre>
::


## Images

::CustomImage{src="https://i.redd.it/cm3tsne35a5e1.jpeg" label="Label of meme" width="400" marginTop="15"}

::

## External link
type is mdi icon, type="star" is mdi-star<br>
:elink{type="language-python" text="antlr4-tools" url="https://github.com/antlr/antlr4/blob/master/doc/getting-started.md" .mt-5}

:elink{type="star" text="Nasa" url="https://nasa.gov" .ml-5 .mt-5}

## Editor with output
::Editor
<pre>
SELECT * FROM sometable</pre>
::

::Sep
::

::MarkdownTable{type="table"}
<pre>
| schema_name | table_name                                          | sum(num_docs) | (sum(size) / 1000000::bigint) | avg_size_in_bytes  |
|-------------|-----------------------------------------------------|---------------|-------------------------------|--------------------| 
| "doc"       | "taxi_january"                                      | 5929248       | 775                           | 130.74343390595232 |
| "doc"       | "taxi_january_bestcompresion"                       | 5929248       | 581                           | 98.15085909714014  |
| "doc"       | "taxi_january_nocolumnstore_bestcompression"        | 5929248       | 411                           | 69.34966845711294  |
| "doc"       | "taxi_january_nocolumnstore_noindex_bestcompresion" | 5929248       | 244                           | 41.172756140407685 |
| "doc"       | "taxi_january_noindex_bestcompression"              | 5929248       | 423                           | 71.48468304918264  |
| "doc"       | "taxi_january_nocolumnstore"                        | 5929248       | 639                           | 107.92968315712211 |
| "doc"       | "taxi_january_nocolumnstore_noindex"                | 5929248       | 474                           | 80.03273905898354  |
| "doc"       | "taxi_january_noindex"                              | 5929248       | 635                           | 107.13091457803755 |
</pre>
::

::Editor
<pre>
antrl4</pre>
::
::Sep
::
::EditorResult
<pre>
Downloading antlr4-4.13.2-complete.jar
ANTLR tool needs Java to run; install Java JRE 11 yes/no (default yes)? yes
Installed Java in /root/.jre/jdk-11.0.24+8-jre; remove that dir to uninstall
ANTLR Parser Generator  Version 4.13.2</pre>
::

## Math equations:

::Mathshy{.text-h3 .mt-5}
<pre>
RRF(d) =

\displaystyle\sum_{   d\in\\D\\}

\text{\(\dfrac {1} {r_i(d) + k}\)}
</pre>
::

## References

My first reference :Ref{r="1"}<br>
My second reference :Ref{r="2"}<br>
My third reference :Ref{r="3"}
I'm on a strike! :Ref{r="4"}





:Der{r="1" link="https://github.com/antlr/antlr4/blob/master/doc/targets.md"}
:Der{r="2" link="https://github.com/antlr/antlr4/blob/master/doc/targets.md"}
:Der{r="3" link="https://github.com/antlr/antlr4/blob/master/doc/targets.md"}
:Der{r="4" link="https://github.com/antlr/antlr4/blob/master/doc/targets.md"}

## Separator
::Sep