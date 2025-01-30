---
title: 'Blueprint /  Demo'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Blueprint showcasing available components'
tags: [ 'python', 'Antlr4', 'software' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Monologue Expert' }, { 'name': 'Anon' } ]
comment_links: [ { 'name': 'reddit', 'href': '' }, { 'name': 'hacker news', 'href': '' } ]
---

## [- Text]{.text-red .text-h2}

[Antlr4]{.h} highlighted

[Big text]{.text-h1}

## [- Tables]{.text-red .text-h2}

Markdown Table

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

Normal table

<br>

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

:MaT{text="R(\name, \age, \isalive)" .text-h6 .mt-5}

<div class="text-h6 ct">

| Syntax                                   | SQL          | EXAMPLE                                          | Example SQL                          |
|------------------------------------------|--------------|--------------------------------------------------|--------------------------------------|
| :MaT{text="\sigma_{predicate}(R)"}       | WHERE        | :MaT{text="\sigma_{{age > 20} ∧ name=json}(R)"}  | ... WHERE age > 20 AND name = 'JSON' |
| :MaT{text="\pi_{a_i, a_2, ..., a_n}(R)"} | SELECT       | :MaT{text="\pi_{name, age - 1}(R)"}              | SELECT name, age - 1 FROM R          
| :MaT{text="A \cup B"}                    | UNION        | (SELECT * FROM R) UNION (SELECT * FROM S)        |
| :MaT{text="A \cup B"}                    | INTERSECTION | (SELECT * FROM R) INTERSECT (SELECT * FROM S)    |
| :MaT{text="A \cup B"}                    | DIFERENCE    | (SELECT * FROM R) EXCEPT (SELECT * FROM S)       |
| :MaT{text="A x B"}                       | PRODUCT      | SELECT * FROM R CROSS JOIN S; SELECT * FROM R, S |
</div>

:Der{r="4" link="https://github.com/antlr/antlr4/blob/master/doc/targets.md"}

## [- Images]{.text-red .text-h2}

::CustomImage
---
"src": "https://deadline.com/wp-content/uploads/2024/07/MCDSHRE_EC025.jpg?w=681&h=383&crop=1"
"label": "Better to read"
"width": "400"
"marginTop": "15"
---
::

## [- External link]{.text-red .text-h2}

:elink{type="language-python" text="antlr4-tools" url="https://github.com/antlr/antlr4/blob/master/doc/getting-started.md" .mt-5}
:elink{type="star" text="Nasa" url="https://nasa.gov" .ml-5 .mt-5 color="yellow"}

## [- Editor with output]{.text-red .text-h2}

::Editor{hasResult="true"}
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

::Editor{hasResult="true"}
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

## [- Math equations]{.text-red .text-h2}

::Mathshy{.text-h3 .mt-5}
<pre>
RRF(d) =

\displaystyle\sum_{   d\in\\D\\}

\text{\(\dfrac {1} {r_i(d) + k}\)}
</pre>
::

## [- References]{.text-red .text-h2}

My first reference :Ref{r="1"}<br>
My second reference :Ref{r="2"}<br>
My third reference :Ref{r="3"}
I'm on a strike! :Ref{r="4"}

:Der{r="1" link="https://github.com/antlr/antlr4/blob/master/doc/targets.md"}
:Der{r="2" link="https://github.com/antlr/antlr4/blob/master/doc/targets.md"}
:Der{r="3" link="https://github.com/antlr/antlr4/blob/master/doc/targets.md"}
:Der{r="4" link="https://github.com/antlr/antlr4/blob/master/doc/targets.md"}

## [- Separator]{.text-red .text-h2}

::Sep
::

## [- Alerts and quotes]{.text-red .text-h2}

::Alert
---
"alert_type": "info"
"icon": "mdi-format-quote-close"
"author": "@ritchie46"
"text": "...I would advice against using multiprocessing for this. Polars already paralellizes the work for you. Trying to parallelize more would hurt Polars' performance."
"src": "https://github.com/pola-rs/polars/issues/14219#issuecomment-1925326705"
"alert_bd_color": "white"
---
::

## [- Charts]{.text-red .text-h2}

::line{.pt-5}
---
"chartProps": {"labels": [481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0, 481841.0], "datasets": [{"data": [0.91, 0.91, 0.91, 0.92, 0.92, 0.89, 0.92, 0.92, 0.92, 0.92, 0.92, 0.9, 0.9, 0.93, 0.93, 0.93, 0.93, 0.91, 0.91, 0.93, 0.93, 0.93, 0.93, 0.93, 0.91, 0.94, 0.94, 0.94, 0.94, 0.94, 0.92, 0.92, 0.94, 0.94, 0.95, 0.95, 0.92, 0.92, 0.95, 0.95, 0.93, 0.95, 0.95, 0.93, 0.95, 0.95, 0.95, 0.95, 0.95, 0.93, 0.93, 0.95, 0.95, 0.96, 0.96, 0.94, 0.94, 0.96, 0.96, 0.95, 0.96, 0.96, 0.94, 0.94, 0.96, 0.96, 0.96, 0.96, 0.96, 0.96, 0.96, 0.95, 0.96, 0.96, 0.95, 0.96, 0.96, 0.95, 0.96, 0.96, 0.96, 0.96, 0.96, 0.95, 0.95, 0.96, 0.96, 0.96, 0.96, 0.95, 0.95, 0.95, 0.96, 0.96, 0.96, 0.95, 0.96, 0.96, 0.95, 0.95, 0.96, 0.96, 0.96, 0.96, 0.95, 0.95, 0.96, 0.96, 0.96, 0.96, 0.96, 0.95, 0.97, 0.97, 0.95, 0.97, 0.97, 0.95, 0.95, 0.97, 0.97, 0.97, 0.97, 0.97, 0.96, 0.96, 0.96, 0.96, 0.97, 0.97, 0.97, 0.97, 0.97, 0.96, 0.97, 0.97, 0.96, 0.97, 0.97, 0.96, 0.96, 0.97, 0.97, 0.97, 0.97, 0.96, 0.96, 0.97, 0.97, 0.97, 0.96, 0.96, 0.96], "borderColor": "rgb(255, 99, 132)", "label": "Memory (Gb)", "color": "white"}, {"data": [0.0, 2.05, 2.39, 1.86, 2.26, 2.08, 2.24, 1.98, 2.18, 1.97, 2.25, 2.46, 2.05, 1.87, 2.37, 2.17, 2.03, 2.27, 1.97, 2.07, 2.27, 2.16, 1.96, 2.26, 2.1, 2.44, 1.88, 2.15, 1.66, 2.38, 2.37, 2.0, 2.02, 2.36, 2.15, 1.86, 2.26, 1.97, 2.27, 1.75, 2.47, 1.87, 2.27, 2.04, 2.42, 1.83, 2.37, 1.97, 2.37, 2.46, 1.94, 1.86, 2.16, 2.37, 1.85, 2.38, 2.01, 2.1, 2.08, 2.26, 1.85, 1.94, 2.17, 2.27, 1.87, 2.47, 1.95, 1.66, 0.93, 0.57, 0.83, 2.04, 2.33, 2.0, 2.36, 1.95, 2.36, 2.13, 2.33, 2.05, 2.37, 1.85, 2.37, 2.17, 2.34, 1.84, 2.48, 1.99, 2.31, 2.36, 1.65, 1.02, 0.75, 1.04, 1.03, 2.08, 1.87, 2.36, 2.02, 2.29, 1.78, 2.27, 1.94, 2.17, 2.36, 1.86, 1.97, 2.37, 2.33, 1.92, 2.46, 1.95, 2.48, 1.87, 2.36, 1.76, 2.15, 2.17, 2.27, 1.85, 2.25, 1.95, 2.07, 1.64, 1.03, 0.91, 0.13, 1.04, 1.88, 2.26, 2.35, 1.77, 2.27, 2.06, 2.5, 2.03, 2.17, 1.87, 2.26, 2.14, 2.26, 1.88, 2.27, 1.86, 2.41, 2.59, 2.15, 2.05, 2.59, 1.41, 0.86, 1.08, 1.19], "borderColor": "rgb(54, 162, 235)", "label": "Upload speed (Mb/s)"}, {"data": [0.0, 1.9, 4.2, 2.3, 4.9, 7.7, 6.5, 5.8, 5.1, 1.3, 2.8, 5.0, 5.6, 3.6, 9.5, 3.2, 2.6, 3.8, 1.7, 4.5, 6.9, 4.2, 5.3, 9.6, 2.9, 4.3, 2.6, 3.9, 1.9, 2.6, 3.1, 3.5, 5.8, 6.4, 3.6, 7.2, 3.5, 3.9, 6.2, 6.8, 5.1, 2.5, 2.2, 6.2, 4.8, 1.9, 2.1, 1.9, 2.2, 2.4, 1.8, 1.5, 2.8, 4.5, 2.1, 2.0, 1.5, 3.0, 1.5, 3.4, 2.4, 2.0, 6.0, 7.1, 8.4, 5.7, 5.7, 5.7, 4.5, 3.8, 9.4, 7.7, 7.3, 5.9, 5.6, 5.1, 3.7, 2.9, 3.7, 4.7, 3.2, 2.7, 6.3, 4.8, 5.7, 7.5, 9.3, 7.1, 2.7, 2.2, 1.7, 1.6, 2.5, 3.1, 4.3, 4.9, 2.5, 2.3, 2.4, 2.3, 1.5, 1.6, 2.9, 2.2, 2.5, 3.8, 2.7, 3.0, 6.3, 5.4, 4.7, 4.8, 7.4, 2.7, 7.0, 4.5, 2.0, 1.9, 2.7, 1.3, 2.8, 2.6, 2.6, 3.8, 4.0, 2.1, 4.7, 11.4, 3.6, 4.1, 4.4, 2.7, 5.0, 5.6, 7.6, 7.0, 3.8, 3.1, 5.1, 4.9, 5.2, 2.6, 3.1, 1.5, 1.8, 4.4, 3.6, 2.2, 3.1, 4.2, 3.7, 1.1, 4.9], "borderColor": "rgb(255, 205, 86)", "label": "CPU (%)"}]}
---
::

## [- Code]{.text-red .text-h2}

::Editor{lang='rust' codeFontSize=13}
<pre>    async fn send_batch(&amp;self, schema: &amp;str, table_name: &amp;str, columns: &amp;Vec&lt;String&gt;, buffer: Vec&lt;Vec&lt;CValue&gt;&gt;) {
        let mut query_builder = self.build_insert_values_statement(&amp;schema, &amp;table_name, &amp;columns);
        query_builder.push_values(&amp;buffer, |mut separated, x| {
            for value in x {
                match value {
                    CValue::None =&gt; separated.push_bind::&lt;Option&lt;String&gt;&gt;(None),
                    CValue::Bool(v) =&gt; separated.push_bind(v),
                    CValue::String(v) =&gt; separated.push_bind(v),
                    CValue::I16(v) =&gt; separated.push_bind(v),
                    CValue::I32(v) =&gt; separated.push_bind(v),
                    CValue::I64(v) =&gt; separated.push_bind(v),
                    CValue::Double32(v) =&gt; separated.push_bind(v),
                    CValue::Double64(v) =&gt; separated.push_bind(v),
                    CValue::VecF32(v) =&gt; separated.push_bind(v),
                    CValue::VecF64(v) =&gt; separated.push_bind(v),
                    CValue::VecI32(v) =&gt; separated.push_bind(v),
                    CValue::VecI64(v) =&gt; separated.push_bind(v),
                    CValue::VecString(v) =&gt; separated.push_bind(v),
                    _ =&gt; {
                        println!(&quot;unknown value&quot;, );
                        separated.push_bind(&quot;CVALUE_ERROR_REPORT_CRATEDB&quot;)
                    }
                };
            }
        });

        let pool = self.get_pool().await.expect(&quot;Couldn't connect to CrateDB&quot;);
        query_builder.build().execute(&amp;pool).await.expect(&quot;Could not send batch&quot;);
    }</pre>
::

## [- Lists]{.text-red .text-h2}

* One
* Two
* Third