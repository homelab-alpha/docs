---
title: "Markdown beheersen: de ultieme gids"
description:
  "Wil je beter worden in Markdown? Duik in deze uitgebreide spoedcursus, die je
  vaardigheden met Markdown een flinke boost geeft en alles uit de opmaak van je
  documenten haalt!"
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

weight: 2503

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## De ondersteuning van Markdown testen {#benchmark-markdown-support}

De ondersteuning van Markdown testen met een uitgebreide checklist

**Werk je aan een project met Markdown?**

Zet
[de bron van deze pagina](https://raw.githubusercontent.com/RoneoOrg/markdown/main/README.md)
waar je de ondersteuning van Markdown wilt testen _of laten zien_, en controleer
of elke functie goed wordt weergegeven.

## Basisopmaak {#basic-formatting}

### **Vette** tekst {#bold-text}

Syntaxis:

```plaintext
You can mark some text as bold with **two asterisks** or __two underscores__.
```

Uitvoer:

You can mark some text as bold with **two asterisks** or **two underscores**.

### _Cursief_ {#_italic_}

Syntaxis:

```plaintext
Use a *single asterisk* or a _single underscore_ for italic.
```

Uitvoer:

Use a _single asterisk_ or a _single underscore_ for italic.

### **_Vet en cursief_** {#_bold-and-italic_}

Syntaxis:

```plaintext
Three stars gives `***bold and italic***`
```

Three stars gives **_bold and italic_**

### ~~Doorgehaald~~ {#strikethrough}

Syntaxis:

```plaintext
By using \~~two tildes\~~ the text will be ~~striked through~~.
```

Uitvoer:

By using \~~two tildes\~~ the text will be ~~striked through~~.

## Citaatblokken {#blockquotes}

Syntaxis:

```plaintext
> blockquote
```

**Uitvoer**:

> blockquote

### Geneste citaatblokken {#nested-blockquotes}

Syntaxis:

```plaintext
> First level
>
>> Second level
```

Uitvoer:

> First level >
>
> > Second level

### Markdown in citaatblokken {#markdown-in-blockquotes}

Syntaxis:

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

Uitvoer:

> **Markdown** can be used _inside quotes_ >
>
> 1. This is the first list item.
> 1. This is the second list item. > ~~strikethrough~~ > Here's some example
>    code: > return shell_exec("echo $input | $markdown_script");

## Lijsten {#lists}

### Ongenummerde lijst {#unordered-list}

Kan worden gemarkeerd met `-`, `+` of `*`

Syntaxis:

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

Uitvoer:

- First item
- Second item
- Third item

* First item
* Second item
* Third item

- First item
- Second item
- Third item

### Genummerde lijsten {#ordered-lists}

Het nummeren gaat automatisch; je kunt overal gewoon `1.` gebruiken

Syntaxis:

```plaintext
1. First item
2. Second item
3. Third item
```

Uitvoer:

1. First item
2. Second item
3. Third item

### Geneste lijst {#nested-list}

**Ongenummerd**

Syntaxis:

```plaintext
- First item
- Second item
- Third item
  - Indented item
  - Indented item
- Fourth item
```

Uitvoer:

- First item
- Second item
- Third item
  - Indented item
  - Indented item
- Fourth item

**Genummerd**

Syntaxis:

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

Uitvoer:

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

**Gemengd**

Syntaxis:

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

Uitvoer:

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

## Regeleinden {#linebreaks}

**Druk je één keer op Enter** tussen twee regels, dan worden beide regels
samengevoegd tot één alinea.

Maar **laat je een lege regel ertussen**, dan worden het twee alinea's.

**Demonstratie**:

Syntaxis:

```plaintext
This text is a paragraph.
This won't be another paragraph, it will join the line above it.

This will be another paragraph, as it has a blank line above it.
```

Uitvoer:

This text is a paragraph. This won't be another paragraph, it will join the line
above it.

This will be another paragraph, as it has a blank line above it.

### Een regeleinde afdwingen {#force-line-breaks}

Om een regeleinde af te dwingen, **eindig je een regel met twee of meer
spaties** en druk je daarna op Enter.

Syntaxis:

```plaintext
This is the first line.··
Second line
```

Uitvoer:

This is the first line. Second line

### Horizontale lijnen {#horizontal-lines}

Syntaxis:

Kan worden ingevoegd met vier `*`, `-` of `_`

```plaintext
----

****

____
```

Uitvoer:

---

---

---

## Links

### Eenvoudige links {#basic-links}

Syntaxis:

```plaintext
[Semantic description](https://roneo.org/markdown)
<address@example.com>
<https://roneo.org/markdown> works too. Must be used for explicit links.
```

Uitvoer:

[Semantic description](https://roneo.org/markdown) <address@example.com>
<https://roneo.org/markdown> works too. Must be used for explicit links.

### Links met een tekstverwijzing {#links-using-text-reference}

Syntaxis:

```plaintext
[I'm a link][Reference text]

[This link] will do the same as well. It works as the identifier itself.


[reference text]: https://jamstack.club
[this link]: https://roneo.org/markdown
```

Uitvoer:

[I'm a link][Reference text]

[This link] will do the same as well. It works as the identifier itself.

[reference text]: https://jamstack.club
[this link]: https://roneo.org/markdown

**Let op:** de verwijzingstekst is _niet_ hoofdlettergevoelig

### Link met een titel bij aanwijzen {#link-with-a-title-on-hover}

Syntaxis:

```plaintext
[Random text][random-identifier].
Hover the mouse over it to see the title.

Several syntaxes are accepted:
[One](https://eff.org "First site")
[Two](https://example.com 'Second site')
[Three](https://example.com (Third site))

[random-identifier]: https://roneo.org/markdown "This example has a title"
```

Uitvoer:

[Random text][random-identifier]. Hover the mouse over it to see the title.

Several syntaxes are accepted: [One](https://eff.org "First site")
[Two](https://jamstack.club "Second site")
[Three](https://debian.org "Third site")

[random-identifier]: https://roneo.org/markdown "This example has a title"

### Links met Markdown-opmaak {#links-with-markdown-style}

Om links **_te benadrukken_**, zet je sterretjes voor en na de haken.

Syntaxis:

```plaintext
I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.

To denote links as `code`, add backticks _inside_ the brackets:

See the section on [`code`](#code).
```

Uitvoer:

I love supporting the **[EFF](https://eff.org)**. This is the
_[Markdown Guide](https://www.markdownguide.org)_. See the section on
[`code`](#code).

### Een eigen anker aan een kop geven {#attribute-a-custom-anchor-to-a-heading}

Ankers worden automatisch gemaakt op basis van de inhoud van de kop. Zo pas je
het anker aan:

Syntaxis:

```plaintext
### Heading {#custom-id}
```

Uitvoer:

#### Heading {#custom-id}

## Codeopmaak {#code-formatting}

### Inline

Omring tekst met enkele backticks om die als code te markeren: `` `code` `` →
`code`

### Codeblokken {#codeblocks}

Maak een codeblok met drie backticks ` ``` ` voor en na je code.

Syntaxis:

````plaintext
```bash
sudo apt hello
cat /etc/apt/sources.list
```
````

Uitvoer:

```bash
sudo apt hello
cat /etc/apt/sources.list
```

Het kan ook met een tab of vier spaties aan het begin van de regels:

**Tab**

Syntaxis:

````plaintext
```bash
sudo apt hello
echo "hi"

**Vier spaties**

sudo apt hello

Laten we het afbreken van een lange regel testen:

apt install test apt install test apt install test apt install test apt
install test apt install test apt install test apt install test apt install
test apt install test apt install test apt install test apt install test apt
install test
```
````

Uitvoer:

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

### Codeblokken met syntaxmarkering {#codeblocks-with-syntax-highlighting}

Zet de taal direct na de eerste backticks (bijvoorbeeld `html`) voor
syntaxmarkering

## Voorbeelden {#samples}

### HTML

Syntaxis:

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

Uitvoer:

```html
<!DOCTYPE html>
<html lang="fr" itemscope itemtype="https://schema.org/WebPage">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  </head>
</html>
```

### CSS

Syntaxis:

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

Uitvoer:

```css
/* Comment */
.blog-post h2,
h3 {
  margin-top: 1.6em;
  margin-bottom: 0.8em;
}
```

### Bash

Syntaxis:

````plaintext
```bash
# Comment

if [[ ! $system =~ Linux|MacOS|BSD ]]; then
	echo "This version of bashtop does not support $system platform."

sudo apt install test
```
````

Uitvoer:

```bash
# Comment

if [[ ! $system =~ Linux|MacOS|BSD ]]; then
	echo "This version of bashtop does not support $system platform."

sudo apt install test
```

### Diff

Syntaxis:

````plaintext
```diff
- delete
+ add
! test
# comment
```
````

Uitvoer:

```diff
- delete
+ add
! test
# comment
```

### Escapen met backslashes {#escaping-with-backslashes}

Elk ASCII-leesteken kan worden ge-escapet met één backslash.

Voorbeeld:

```plaintext
\*this is not italic*
```

Uitvoer:

\*this is not italic\*

Markdown biedt escapes met een backslash voor deze tekens:

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

## Afbeeldingen {#images}

### Basissyntaxis {#basic-syntax}

```markdown
![Semantic description of the image](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png)
```

![Semantic description of the image](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png)

**Let op: de tekst tussen de vierkante haken is belangrijk!**

Gebruikers van een schermlezer krijgen informatie over de afbeelding via dit
attribuut, `ALT`, de _alternatieve tekst_.

Een **beschrijvende** alt-tekst
[helpt de toegankelijkheid](https://webaim.org/techniques/alttext/) voor elke
bezoeker en hoort altijd bij een afbeelding. Beschrijf in de alt-tekst de inhoud
en de functie van de afbeelding. Naast de voordelen voor de toegankelijkheid is
`ALT` ook nuttig voor SEO. De tekst wordt ook getoond als de browser de
afbeelding om een of andere reden niet laadt.

### Afbeelding met titel en bijschrift {#image-with-title-and-caption}

```plaintext
![Semantic description](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png "Your title")*Your caption*
```

![Semantic description](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png "Your title")_Your
caption_

### Klikbare afbeeldingen {#clickable-images}

Voor klikbare afbeeldingen zet je de opmaak van de afbeelding gewoon in de
[opmaak van een link](#links):

```plaintext
[![Semantic description](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png "Your title")](https://homelab-alpha.nl)
```

Uitvoer:

[![Semantic description](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png "Your title")](https://homelab-alpha.nl)

### Afbeelding met een identifier {#image-with-an-identifier}

Je kunt de afbeelding aanroepen met een identifier, net als bij [links](#links)

```plaintext
![Semantic desc.][image identifier]

Lorem ipsum dolor sit amet consectetur adipisicing elit [...]

[image identifier]: https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png "Title"
```

![Semantic desc.][image identifier]

[image identifier]:
  https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/logos/logo.png
  "Title"

## Takenlijsten {#task-lists}

Syntaxis:

```plaintext
- [X] Write the press release
- [ ] Update the website
```

Uitvoer:

- [x] Write the press release
- [ ] Update the website

## Tabellen {#tables}

Syntaxis:

```plaintext
| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |
```

of

```plaintext
| Syntax | Description |
| - | --- |
| Header | Title |
| Paragraph | Text|
```

wordt op dezelfde manier weergegeven.

Uitvoer:

| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |

### Tekst uitlijnen in tabellen {#text-alignment-in-tables}

Syntaxis:

```plaintext
| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here's this |
| Paragraph |    Text     |    And more |
```

Zie hoe de tekst wordt uitgelijnd, afhankelijk van de positie van `':'`

Uitvoer:

| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here's this |
| Paragraph |    Text     |    And more |

## Voetnoten {#footnotes}

Syntaxis:

```plaintext
Here's a sentence with a footnote[^1].
(see the result at the bottom of the page)

[^1]: This is the first footnote.
```

Uitvoer:

Hier is een zin met een voetnoot[^1]. (zie het resultaat onderaan de pagina)

[^1]: Dit is de eerste voetnoot.

### Lange voetnoot {#long-footnote}

Syntaxis:

```plaintext
Here's a longer one.[^bignote]
(see the result at the bottom of the page)

[^bignote]: Here's one with multiple paragraphs and code.

	Indent paragraphs to include them in the footnote.

	`{ my code }`

	Note that you can place the footnote anywhere you want in your article
```

Uitvoer:

Hier is een langere.[^bignote] (zie het resultaat onderaan de pagina)

[^bignote]: Hier is er een met meerdere alinea's en code.

    Laat alinea's inspringen om ze in de voetnoot op te nemen.

    `{ my code }`

    Je kunt de voetnoot overal in je artikel plaatsen

## Definitielijst {#definition-list}

Syntaxis:

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

Uitvoer:

term : definition

second term : meaning

complex term : long definition including **bold text**. Velit tempor cillum aute
culpa pariatur enim laboris consectetur tempor. Aute elit non do ipsum. Nisi
quis culpa magna esse ipsum. Ad aliquip ullamco minim cillum in ullamco.

## Kopjes {#headings}

Zet `##` aan het begin van een regel om er een kop van te maken. Je kunt tot 6
tekens `#` gebruiken voor de bijbehorende niveaus van kopjes

Syntaxis:

```plaintext
## Heading 1
[...]

###### Heading 6
```

Uitvoer:

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

### Heading 3

pedit quia voluptates atque nobis, perspiciatis deserunt perferendis, nostrum,
voluptatem voluptas dolorem iure voluptatum? Accusantium a dolores dicta?
Pariatur voluptates quam ut, cum aliquid eum, officiis laudantium totam
suscipit, ducimus odit nobis! Corrupti, doloremque sed optio voluptatibus
deserunt quas repellat eius minus quasi, ipsam unde esse sequi deleniti.

#### Heading 4

pedit quia voluptates atque nobis, perspiciatis deserunt perferendis, nostrum,
voluptatem voluptas dolorem iure voluptatum? Accusantium a dolores dicta?
Pariatur voluptates quam ut, cum aliquid eum, officiis laudantium totam
suscipit, ducimus odit nobis! Corrupti, doloremque sed optio voluptatibus
deserunt quas repellat eius minus quasi, ipsam unde esse sequi deleniti.

##### Heading 5

pedit quia voluptates atque nobis, perspiciatis deserunt perferendis, nostrum,
voluptatem voluptas dolorem iure voluptatum? Accusantium a dolores dicta?
Pariatur voluptates quam ut, cum aliquid eum, officiis laudantium totam
suscipit, ducimus odit nobis! Corrupti, doloremque sed optio voluptatibus
deserunt quas repellat eius minus quasi, ipsam unde esse sequi deleniti.

###### Heading 6

pedit quia voluptates atque nobis, perspiciatis deserunt perferendis, nostrum,
voluptatem voluptas dolorem iure voluptatum? Accusantium a dolores dicta?
Pariatur voluptates quam ut, cum aliquid eum, officiis laudantium totam
suscipit, ducimus odit nobis! Corrupti, doloremque sed optio voluptatibus
deserunt quas repellat eius minus quasi, ipsam unde esse sequi deleniti.

## Bronnen {#references}

- Source of this page:
  [github.com/RoneoOrg/markdown](https://github.com/RoneoOrg/markdown)
- [Markdown Guide - Basic Syntax](https://www.markdownguide.org/basic-syntax)
- [Markdown Guide - Extended Syntax](https://www.markdownguide.org/extended-syntax)
- [Daring Fireball: Markdown Syntax Documentation](https://daringfireball.net/projects/markdown/syntax)
- [Markdown Guide at Gitlab.com](https://about.gitlab.com/handbook/markdown-guide/)
- [CommonMark Spec](https://spec.commonmark.org/0.31.2/)

## Verwante projecten {#related-projects}

- <https://github.com/ericwbailey/markdown-test-file>
- <https://scottspence.com/posts/writing-with-markdown>
- <https://codingnconcepts.com/markdown/markdown-syntax/>
- <https://codeit.suntprogramator.dev/basic-markdown-syntax/>
- <https://daringfireball.net/projects/markdown/syntax.text>
