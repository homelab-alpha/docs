---
title: "Master Markdown: Your Ultimate Guide"
description:
  "Are you ready to elevate your Markdown game? Dive into this comprehensive
  crash course designed to supercharge your Markdown skills and unleash your
  document formatting potential!"
url: "back-to-basics/markdown/crash-course"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Markdown
tags:
  - Markdown
  - Crash Course
  - Formatting
  - Syntax
  - Guide
  - Documentation
  - Writing
keywords:
  - Markdown syntax
  - Markdown formatting
  - Markdown guide
  - Markdown documentation
  - Markdown basics
  - Markdown crash course

weight: 104002

toc: true
katex: true
---

<br />

## Benchmark Markdown Support

Benchmarking the support of Markdown with a comprehensive checklist

**Are you working on a project featuring Markdown?**

Drop
[the source of this page](https://raw.githubusercontent.com/RoneoOrg/markdown/main/README.md)
wherever you want to test _or showcase_ the support of Markdown, and check that
every single feature is properly rendered.

<br />

## Basic formatting

### **Bold** text

Syntax:

```plaintext
You can mark some text as bold with **two asterisks** or __two underscores__.
```

Output:

You can mark some text as bold with **two asterisks** or **two underscores**.

<br />

### _Italic_

Syntax:

```plaintext
Use a *single asterisk* or a _single underscore_ for italic.
```

Output:

Use a _single asterisk_ or a _single underscore_ for italic.

<br />

### **_Bold and italic_**

Syntax:

```plaintext
Three stars gives `***bold and italic***`
```

Three stars gives **_bold and italic_**

<br />

### ~~Strikethrough~~

Syntax:

```plaintext
By using \~~two tildes\~~ the text will be ~~striked through~~.
```

Output:

By using \~~two tildes\~~ the text will be ~~striked through~~.


<br />

## Blockquotes

Syntax:

```plaintext
> blockquote
```

**Output**:

> blockquote

<br />

### Nested blockquotes

Syntax:

```plaintext
> First level
>
>> Second level
```

Output:

> First level
>
> > Second level

<br />

### Markdown in blockquotes

Syntax:

```plaintext
> **Markdown** can be used *inside quotes*
>
> 1.   This is the first list item.
> 1.   This is the second list item.
>
> ~~strikethrough~~
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");
```

Output:

> **Markdown** can be used _inside quotes_
>
> 1. This is the first list item.
> 1. This is the second list item.
>
> ~~strikethrough~~
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");

<br />

## Lists

### Unordered list

Cant be marked with `-`, `+` or `*`

Syntax:

```plaintext
- First item
- Second item
- Third item
```

```plaintext
+ First item
+ Second item
+ Third item
```

```plaintext
* First item
* Second item
* Third item
```

Output:

- First item
- Second item
- Third item

* First item
* Second item
* Third item

- First item
- Second item
- Third item

<br />

### Ordered lists

Incrementation is automatic, you can simply use `1.` everywhere

Syntax:

```plaintext
1. First item
2. Second item
3. Third item
```

Output:

1. First item
2. Second item
3. Third item

<br />

### Nested list

**Unordered**

Syntax:

```plaintext
- First item
- Second item
- Third item
  - Indented item
  - Indented item
- Fourth item
```

Output:

- First item
- Second item
- Third item
  - Indented item
  - Indented item
- Fourth item

**Ordered**

Syntax:

```plaintext
1. First item
1. Second item
1. Third item
    1. Indented item
    1. Indented item
1. Fourth item
1. Fifth item
    1. Indented item
    1. Indented item
        1. Indented item
```

Output:

1. First item
1. Second item
1. Third item
   1. Indented item
   1. Indented item
1. Fourth item
1. Fifth item
   1. Indented item
   1. Indented item
      1. Indented item

**Mixed**

Syntax:

```plaintext
1. First item
1. Second item
1. Third item
    * Indented item
    * Indented item
1. Fourth item
1. Fifth item
    1. Indented item
    1. Indented item
        1. Indented item
        1. Indented item
            * Indented
                1. Indented item
                    * Indented
                1. Indented item
            * Indented
        1. Indented item
1. Sixth item
```

Output:

1. First item
1. Second item
1. Third item
   - Indented item
   - Indented item
1. Fourth item
1. Fifth item
   1. Indented item
   1. Indented item
      1. Indented item
      1. Indented item
         - Indented
           1. Indented item
              - Indented
           1. Indented item
         - Indented
      1. Indented item
1. Sixth item

<br />

## Linebreaks

**When you hit enter just once** between two lines, both lines are joined into a
single paragraph.

But, if you **leave a blank line between them**, they will split into two
paragraphs.

**Demonstration**:

Syntax:

```plaintext
This text is a paragraph.
This won't be another paragraph, it will join the line above it.

This will be another paragraph, as it has a blank line above it.
```

Output:

This text is a paragraph. This won't be another paragraph, it will join the line
above it.

This will be another paragraph, as it has a blank line above it.

<br />

### Force line breaks

To force a line break, **end a line with two or more whitespaces**, and then
type return.

Syntax:

```plaintext
This is the first line.··
Second line
```

Output:

This is the first line. Second line

<br />

### Horizontal lines

Syntax:

Can be inserted with four `*`, `-` or `_`

```plaintext
----

****

____
```

Output:

---

---

---

<br />

## Links

### Basic links

Syntax:

```plaintext
[Semantic description](https://roneo.org/markdown)
<address@example.com>
<https://roneo.org/markdown> works too. Must be used for explicit links.
```

Output:

[Semantic description](https://roneo.org/markdown) <address@example.com>
<https://roneo.org/markdown> works too. Must be used for explicit links.

<br />

### Links using text reference

Syntax:

```plaintext
[I'm a link][Reference text]

[This link] will do the same as well. It works as the identifier itself.


[reference text]: https://jamstack.club
[this link]: https://roneo.org/markdown
```

Output:

[I'm a link][Reference text]

[This link] will do the same as well. It works as the identifier itself.

[reference text]: https://jamstack.club
[this link]: https://roneo.org/markdown

**Note:** The reference text is _not_ case sensitive

<br />

### Link with a title on hover

Syntax:

```plaintext
[Random text][random-identifier].
Hover the mouse over it to see the title.

Several syntaxes are accepted:
[One](https://eff.org "First site")
[Two](https://example.com 'Second site')
[Three](https://example.com (Third site))

[random-identifier]: https://roneo.org/markdown "This example has a title"
```

Output:

[Random text][random-identifier]. Hover the mouse over it to see the title.

Several syntaxes are accepted: [One](https://eff.org "First site")
[Two](https://jamstack.club "Second site")
[Three](https://debian.org "Third site")

[random-identifier]: https://roneo.org/markdown "This example has a title"

<br />

### Links with Markdown style

To **_emphasize_** links, add asterisks before and after the brackets and
parentheses.

Syntax:

```plaintext
I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.

To denote links as `code`, add backticks _inside_ the brackets:

See the section on [`code`](#code).
```

Output:

I love supporting the **[EFF](https://eff.org)**. This is the
_[Markdown Guide](https://www.markdownguide.org)_. See the section on
[`code`](#code).

<br />

### Attribute a custom anchor to a heading

Anchors are automatically generated based on the heading's content. You can
customize the anchor this way:

Syntax:

```plaintext
### Heading {#custom-id}
```

Output:

#### Heading {#custom-id}

<br />

## Code formatting

### Inline

Wrap with single backticks to highlight as`` `code` `` → `code`

<br />

### Codeblocks

Create a code block with three backticks ` ``` ` before and after your block of
code.

Syntax:

````plaintext
```bash
sudo apt hello
cat /etc/apt/sources.list
```
````

Output:

```bash
sudo apt hello
cat /etc/apt/sources.list
```

Also possible with a tabulation or four empty spaces at the beginning of the
lines:

**Tabulation**

Syntax:

````plaintext
```bash
sudo apt hello
echo "hi"

**Four whitespaces**

sudo apt hello

Let's test the wrapping of a long line:

apt install test apt install test apt install test apt install test apt
install test apt install test apt install test apt install test apt install
test apt install test apt install test apt install test apt install test apt
install test
```
````

Output:

```bash
sudo apt hello
echo "hi"

**Four whitespaces**

sudo apt hello

Let's test the wrapping of a long line:

apt install test apt install test apt install test apt install test apt
install test apt install test apt install test apt install test apt install
test apt install test apt install test apt install test apt install test apt
install test
```

<br />

### Codeblocks with syntax highlighting

Set the language right after the first backticks (for example `html`) to get
syntax highlighting

<br />

## Samples

<br />

### HTML

Syntax:

````plaintext
```html
<!DOCTYPE html>
<html lang="fr" itemscope itemtype="https://schema.org/WebPage">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
    />
  </head>
</html>
```
````

Output:

```html
<!DOCTYPE html>
<html lang="fr" itemscope itemtype="https://schema.org/WebPage">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
    />
  </head>
</html>
```

<br />

### CSS

Syntax:

````plaintext
```css
/* Comment */
.blog-post h2,
h3 {
  margin-top: 1.6em;
  margin-bottom: 0.8em;
}
```
````

Output:

```css
/* Comment */
.blog-post h2,
h3 {
  margin-top: 1.6em;
  margin-bottom: 0.8em;
}
```

<br />

### Bash

Syntax:

````plaintext
```bash
# Comment

if [[ ! $system =~ Linux|MacOS|BSD ]]; then
	echo "This version of bashtop does not support $system platform."

sudo apt install test
```
````

Output:

```bash
# Comment

if [[ ! $system =~ Linux|MacOS|BSD ]]; then
	echo "This version of bashtop does not support $system platform."

sudo apt install test
```

<br />

### Diff

Syntax:

````plaintext
```diff
- delete
+ add
! test
# comment
```
````

Output:

```diff
- delete
+ add
! test
# comment
```

<br />

### Escaping with backslashes

Any ASCII punctuation character may be escaped using a single backslash.

Example:

```plaintext
\*this is not italic*
```

Output:

\*this is not italic\*

Markdown provides backslash escapes for the following characters:

```plaintext
\   backslash
`   backtick
*   asterisk
_   underscore
{}  curly braces
[]  square brackets
()  parentheses
#   hash mark
+	plus sign
-	minus sign (hyphen)
.   dot
!   exclamation mark
```

<br />

## Images

### Basic syntax

```markdown
![Semantic description of the image](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png)
```

![Semantic description of the image](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png)

**Note: The text inside the square brackets is important!**

Screen reader users get informations about the image with this attribute called
`ALT`, for _alternative text_.

Including **descriptive** alt text
[helps maintain accessibility](https://webaim.org/techniques/alttext/) for every
visitor and should always be included with an image. When you add alt text be
sure to describe the content and function of the picture. In addition to the
accessibility benefits, `ALT` is useful for SEO. It's also displayed when, for
some reason, the picture is not loaded by the browser.

<br />

### Image with title and caption

```plaintext
![Semantic description](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png "Your title")*Your caption*
```

![Semantic description](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png "Your title")_Your
caption_

<br />

### Clickable images

For clickable images, simply wrap the image markup into a [link markup](#links):

```plaintext
[![Semantic description](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png "Your title")](https://homelab-alpha.nl)
```

Output:

[![Semantic description](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png "Your title")](https://homelab-alpha.nl)

### Image with an identifier

You can call the image with an identifier as we do for [links](#links)

```plaintext
![Semantic desc.][image identifier]

Lorem ipsum dolor sit amet consectetur adipisicing elit [...]

[image identifier]: https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png "Title"
```

![Semantic desc.][image identifier]

[image identifier]:
  https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png
  "Title"

<br />

## Task lists

Syntax:

```plaintext
- [X] Write the press release
- [ ] Update the website
```

Output:

- [x] Write the press release
- [ ] Update the website

<br />

## Tables

Syntax:

```plaintext
| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |
```

or

```plaintext
| Syntax | Description |
| - | --- |
| Header | Title |
| Paragraph | Text|
```

will render the same way.

Output:

| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |

<br />

### Text alignment in tables

Syntax:

```plaintext
| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here's this |
| Paragraph |    Text     |    And more |
```

See the way the text is aligned, depending on the position of `':'`

Output:

| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here's this |
| Paragraph |    Text     |    And more |

<br />

## Footnotes

Syntax:

```plaintext
Here's a sentence with a footnote[^1].
(see the result at the bottom of the page)

[^1]: This is the first footnote.
```

Output:

Here's a sentence with a footnote[^1]. (see the result at the bottom of the
page)

[^1]: This is the first footnote.

<br />

### Long footnote

Syntax:

```plaintext
Here's a longer one.[^bignote]
(see the result at the bottom of the page)

[^bignote]: Here's one with multiple paragraphs and code.

	Indent paragraphs to include them in the footnote.

	`{ my code }`

	Note that you can place the footnote anywhere you want in your article
```

Output:

Here's a longer one.[^bignote] (see the result at the bottom of the page)

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Note that you can place the footnote anywhere you want in your article

<br />

## Definition List

Syntax:

```plaintext
term
: definition

second term
: meaning

complex term
: long definition including **bold text**. Velit tempor cillum aute culpa
pariatur enim laboris consectetur tempor. Aute elit non do ipsum. Nisi quis
culpa magna esse ipsum. Ad aliquip ullamco minim cillum in ullamco.
```

Output:

term : definition

second term : meaning

complex term : long definition including **bold text**. Velit tempor cillum aute
culpa pariatur enim laboris consectetur tempor. Aute elit non do ipsum. Nisi
quis culpa magna esse ipsum. Ad aliquip ullamco minim cillum in ullamco.

<br />

## Headings

Add `##` at the beginning of a line to set as Heading. You can use up to 6 `#`
symbols for the corresponding Heading levels

Syntax:

```plaintext
## Heading 1
[...]

###### Heading 6
```

Output:

# Heading 1

pedit quia voluptates atque nobis, perspiciatis deserunt perferendis, nostrum,
voluptatem voluptas dolorem iure voluptatum? Accusantium a dolores dicta?
Pariatur voluptates quam ut, cum aliquid eum, officiis laudantium totam
suscipit, ducimus odit nobis! Corrupti, doloremque sed optio voluptatibus
deserunt quas repellat eius minus quasi, ipsam unde esse sequi deleniti.

## Heading 2

pedit quia voluptates atque nobis, perspiciatis deserunt perferendis, nostrum,
voluptatem voluptas dolorem iure voluptatum? Accusantium a dolores dicta?
Pariatur voluptates quam ut, cum aliquid eum, officiis laudantium totam
suscipit, ducimus odit nobis! Corrupti, doloremque sed optio voluptatibus
deserunt quas repellat eius minus quasi, ipsam unde esse sequi deleniti.

<br />

### Heading 3

pedit quia voluptates atque nobis, perspiciatis deserunt perferendis, nostrum,
voluptatem voluptas dolorem iure voluptatum? Accusantium a dolores dicta?
Pariatur voluptates quam ut, cum aliquid eum, officiis laudantium totam
suscipit, ducimus odit nobis! Corrupti, doloremque sed optio voluptatibus
deserunt quas repellat eius minus quasi, ipsam unde esse sequi deleniti.

<br />

#### Heading 4

pedit quia voluptates atque nobis, perspiciatis deserunt perferendis, nostrum,
voluptatem voluptas dolorem iure voluptatum? Accusantium a dolores dicta?
Pariatur voluptates quam ut, cum aliquid eum, officiis laudantium totam
suscipit, ducimus odit nobis! Corrupti, doloremque sed optio voluptatibus
deserunt quas repellat eius minus quasi, ipsam unde esse sequi deleniti.

<br />

##### Heading 5

pedit quia voluptates atque nobis, perspiciatis deserunt perferendis, nostrum,
voluptatem voluptas dolorem iure voluptatum? Accusantium a dolores dicta?
Pariatur voluptates quam ut, cum aliquid eum, officiis laudantium totam
suscipit, ducimus odit nobis! Corrupti, doloremque sed optio voluptatibus
deserunt quas repellat eius minus quasi, ipsam unde esse sequi deleniti.

<br />

###### Heading 6

pedit quia voluptates atque nobis, perspiciatis deserunt perferendis, nostrum,
voluptatem voluptas dolorem iure voluptatum? Accusantium a dolores dicta?
Pariatur voluptates quam ut, cum aliquid eum, officiis laudantium totam
suscipit, ducimus odit nobis! Corrupti, doloremque sed optio voluptatibus
deserunt quas repellat eius minus quasi, ipsam unde esse sequi deleniti.

<br />

## References

- Source of this page:
  [github.com/RoneoOrg/markdown](https://github.com/RoneoOrg/markdown)
- [Markdown Guide - Basic Syntax](https://www.markdownguide.org/basic-syntax)
- [Markdown Guide - Extended Syntax](https://www.markdownguide.org/extended-syntax)
- [Daring Fireball: Markdown Syntax Documentation](https://daringfireball.net/projects/markdown/syntax)
- [Markdown Guide at Gitlab.com](https://about.gitlab.com/handbook/markdown-guide/)
- [CommonMark Spec](https://spec.commonmark.org/0.29/)

<br />

## Related projects

- <https://github.com/ericwbailey/markdown-test-file>
- <https://scottspence.com/posts/writing-with-markdown>
- <https://codingnconcepts.com/markdown/markdown-syntax/>
- <https://codeit.suntprogramator.dev/basic-markdown-syntax/>
- <https://daringfireball.net/projects/markdown/syntax.text>
