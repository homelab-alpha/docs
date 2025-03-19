---
title: "Mastering Markdown: Beyond the Basics"
description:
  "Take your Markdown skills to the next level with an in-depth exploration of
  syntax, philosophy, block elements, and span elements."
url: "back-to-basics/markdown/vanilla"
aliases: ""
icon: "icecream"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - MarkDown
tags:
  - Markdown
  - syntax
  - philosophy
  - block elements
  - span elements
keywords:
  - Markdown
  - syntax
  - philosophy
  - block elements
  - span elements
  - Markdown guide
  - Markdown basics
  - Markdown syntax
  - Markdown philosophy
  - Markdown block elements
  - Markdown span elements
  - Markdown formatting
  - Markdown examples

weight: 2500

toc: true
katex: true
---

<br />

## Markdown Syntax

<br />

## Philosophy

Markdown is intended to be as easy-to-read and easy-to-write as is feasible.

Readability, however, is emphasized above all else. A Markdown-formatted
document should be publishable as-is, as plain text, without looking like it's
been marked up with tags or formatting instructions. While Markdown's syntax has
been influenced by several existing text-to-HTML filters -- including
**Setext**, **atx**, **Textile**, **reStructuredText**, **Grutatext**,and
**EtText** -- the single biggest source of inspiration for Markdown's syntax is
the format of plain text email.

<br />

## Block Elements

### Paragraphs and Line Breaks

A paragraph is simply one or more consecutive lines of text, separated by one or
more blank lines. (A blank line is any line that looks like a blank line -- a
line containing nothing but spaces or tabs is considered blank.) Normal
paragraphs should not be indented with spaces or tabs.

The implication of the "one or more consecutive lines of text" rule is that
Markdown supports "hard-wrapped" text paragraphs. This differs significantly
from most other text-to-HTML formatters (including Movable Type's "Convert Line
Breaks" option) which translate every line break character in a paragraph into a
`<br />` tag.

When you _do_ want to insert a `<br />` break tag using Markdown, you end a line
with two or more spaces, then type return.

<br />

### Headers

Markdown supports two styles of headers, **Setext** and **atx**.

Optionally, you may close atx-style headers. This is purely cosmetic -- you
can use this if you think it looks better. The closing hashes don't even need to
match the number of hashes used to open the header. (The number of opening
hashes determines the header level.)

<br />

### Blockquotes

Markdown uses email-style `>` characters for blockquoting. If you're familiar
with quoting passages of text in an email message, then you know how to create a
blockquote in Markdown. It looks best if you hard wrap the text and put a `>`
before every line:

Syntax:

```plaintext
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum
> enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem
> consectetuer libero luctus adipiscing.
```

Output:

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum
> enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem
> consectetuer libero luctus adipiscing.

Markdown allows you to be lazy and only put the `>` before the first line of a
hard-wrapped paragraph:

Syntax:

```plaintext
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum
> enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem
> consectetuer libero luctus adipiscing.
```

Output:

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum
> enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem
> consectetuer libero luctus adipiscing.

Blockquotes can be nested (i.e. a blockquote-in-a-blockquote) by adding
additional levels of `>`:

Syntax:

```plaintext
> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.
```

Output:

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

Blockquotes can contain other Markdown elements, including headers, lists, and
code blocks:

Syntax:

```plaintext
> ## This is a header
>
> 1. This is the first list item.
> 2. This is the second list item.
>
> Here's some example code:
>
> ```bash
> return shell_exec("echo $input | $markdown_script");
> ```
```

Output:

> ## This is a header
>
> 1. This is the first list item.
> 2. This is the second list item.
>
> Here's some example code:
>
> ```bash
> return shell_exec("echo $input | $markdown_script");
> ```

Any decent text editor should make email-style quoting easy for example, with
BBEdit, you can make a selection and choose Increase Quote Level from the Text
menu.

<br />

### Lists

Markdown supports ordered (numbered) and unordered (bulleted) lists.

Unordered lists use asterisks, pluses, and hyphens -- interchangably -- as list
markers:

Syntax:

```plaintext
- Red
- Green
- Blue
```

Output:

- Red
- Green
- Blue

is equivalent to:

Syntax:

```plaintext
+ Red
+ Green
+ Blue
```

Output:

+ Red
+ Green
+ Blue

and:

Syntax:

```plaintext
* Red
* Green
* Blue
```

Output:

* Red
* Green
* Blue

Ordered lists use numbers followed by periods:

Syntax:

```plaintext
1. Bird
2. McHale
3. Parish
```

Output:

1. Bird
2. McHale
3. Parish

It's important to note that the actual numbers you use to mark the list have no
effect on the HTML output Markdown produces. The HTML Markdown produces from the
above list is:

If you instead wrote the list in Markdown like this:

Syntax:

```plaintext
1. Bird
1. McHale
1. Parish
```

Output:

1. Bird
1. McHale
1. Parish

or even:

Syntax:

```plaintext
3. Bird
1. McHale
1. Parish
```

Output:

3. Bird
1. McHale
1. Parish

<br />

You'd get the exact same HTML output. The point is, if you want to, you can use
ordinal numbers in your ordered Markdown lists, so that the numbers in your
source match the numbers in your published HTML. But if you want to be lazy, you
don't have to.

To make lists look nice, you can wrap items with hanging indents:

Syntax:

```plaintext
- Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi
  posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet
  vitae, risus.
- Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem
  consectetuer libero luctus adipiscing.
```

Output:

- Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi
  posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet
  vitae, risus.
- Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem
  consectetuer libero luctus adipiscing.

List items may consist of multiple paragraphs. Each subsequent paragraph in a
list item must be indented by either 4 spaces or one tab:

Syntax:

```plaintext
1. This is a list item with two paragraphs. Lorem ipsum dolor sit amet,
   consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.

   Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec
   sit amet nisl. Aliquam semper ipsum sit amet velit.

2. Suspendisse ID sem consectetuer libero luctus adipiscing.
```

Output:

1. This is a list item with two paragraphs. Lorem ipsum dolor sit amet,
   consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.

   Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec
   sit amet nisl. Aliquam semper ipsum sit amet velit.

2. Suspendisse ID sem consectetuer libero luctus adipiscing.

It looks nice if you indent every line of the subsequent paragraphs, but here
again, Markdown will allow you to be lazy:

Syntax:

````plaintext
- This is a list item with two paragraphs.

  ```plaintext
  This is the second paragraph in the list item. You're
  ```

  only required to indent the first line. Lorem ipsum dolor sit amet,
  consectetuer adipiscing elit.

- Another item in the same list.
````

Output:

- This is a list item with two paragraphs.

  ```plaintext
  This is the second paragraph in the list item. You're
  ```

  only required to indent the first line. Lorem ipsum dolor sit amet,
  consectetuer adipiscing elit.

- Another item in the same list.

To put a blockquote within a list item, the blockquote's `>` delimiters need to
be indented:

Syntax:

````plaintext
- A list item with a blockquote:

  > This is a blockquote inside a list item.

To put a code block within a list item, the code block needs to be indented
_twice_ -- 8 spaces or two tabs:

- A list item with a code block:

  ```plaintext
  <code goes here>
  ```
````

Output:

- A list item with a blockquote:

  > This is a blockquote inside a list item.

To put a code block within a list item, the code block needs to be indented
_twice_ -- 8 spaces or two tabs:

- A list item with a code block:

  ```plaintext
  <code goes here>
  ```

<br />

### Code Blocks

Pre-formatted code blocks are used for writing about programming or markup
source code. Rather than forming normal paragraphs, the lines of a code block
are interpreted literally. Markdown wraps a code block in both `<pre>` and
`<code>` tags.

To produce a code block in Markdown, simply indent every line of the block by at
least 4 spaces or 1 tab.

This is a normal paragraph:

Syntax:

````plaintext
```
This is a code block.
```
````

Output:

```plaintext
This is a code block.
```

Here is an example of AppleScript:

Syntax:

````plaintext
```AppleScript
tell application "Foo"
    beep
end tell
```
````

Output:

```AppleScript
tell application "Foo"
    beep
end tell
```

A code block continues until it reaches a line that is not indented (or the end
of the article).

Within a code block, ampersands (`&`) and angle brackets (`<` and `>`) are
automatically converted into HTML entities. This makes it very easy to include
example HTML source code using Markdown -- just paste it and indent it, and
Markdown will handle the hassle of encoding the ampersands and angle brackets.
for example, this:

Syntax:

````plaintext
```HTML
<div class="footer">
    &copy; 2004 Foo Corporation
</div>
```
````

Output:

```HTML
<div class="footer">
    &copy; 2004 Foo Corporation
</div>
```

Regular Markdown syntax is not processed within code blocks. E.g., asterisks are
just literal asterisks within a code block. This means it's also easy to use
Markdown to write about Markdown's own syntax.

Syntax:

````plaintext
```Markdown
tell application "Foo"
    beep
end tell
```
````

Output:

```Markdown
tell application "Foo"
    beep
end tell
```

<br />

## Span Elements

### Links

Markdown supports two style of links: _inline_ and _reference_.

In both styles, the link text is delimited by [square brackets].

To create an inline link, use a set of regular parentheses immediately after the
link text's closing square bracket. Inside the parentheses, put the URL where
you want the link to point, along with an _optional_ title for the link,
surrounded in quotes for example:

Syntax:

```plaintext
This is [an example](http://example.com/ "This is a link title") inline link.

[This link](http://example.net/) has no title attribute.
```

Output:

This is [an example](http://example.com/ "This is a link title") inline link.

[This link](http://example.net/) has no title attribute.

<br />

### Emphasis

Markdown treats asterisks (`*`) and underscores (`_`) as indicators of emphasis.
Text wrapped with one `*` or `_` will be wrapped with an HTML `<em>` tag; double
`*`'s or `_`'s will be wrapped with an HTML `<strong>` tag. E.g., this input:

Syntax:

```plaintext
*single asterisks*

_single underscores_

**double asterisks**

__double underscores__
```

Output:

*single asterisks*

_single underscores_

**double asterisks**

__double underscores__

<br />

### Code

To indicate a span of code, wrap it with backtick quotes (`` ` ``). Unlike a
pre-formatted code block, a code span indicates code within a normal paragraph.
for example:

Use the `printf()` function. `"type": "sepa_debit"`
