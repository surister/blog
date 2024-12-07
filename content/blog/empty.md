---
title: 'Blueprint'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Blueprint showcasing available components'
tags: [ 'python', 'Antlr4', 'software' ]
---
## [Text spices]{.text-red .text-h2}
[Antlr4]{.h} highlighted

[Big text]{.text-h1}

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
pip install antlr4-tools</pre>
::
::EditorResult
<pre>Collecting antlr4-tools
  Downloading antlr4_tools-0.2.1-py3-none-any.whl (4.3 kB)
Collecting install-jdk
  Downloading install_jdk-1.1.0-py3-none-any.whl (15 kB)
Installing collected packages: install-jdk, antlr4-tools
Successfully installed antlr4-tools-0.2.1 install-jdk-1.1.0</pre>
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