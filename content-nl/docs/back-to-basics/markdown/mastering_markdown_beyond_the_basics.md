---
title: "Markdown beheersen: verder dan de basis"
description:
  "Breng je vaardigheden met Markdown naar een hoger niveau met een diepgaande
  verkenning van de syntaxis, de filosofie, blokelementen en inline-elementen."
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

weight: 2504

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Syntaxis van Markdown {#markdown-syntax}

## Filosofie {#philosophy}

Markdown is bedoeld om zo makkelijk mogelijk te lezen en te schrijven te zijn.

Leesbaarheid gaat echter boven alles. Een document in Markdown moet zo, als
platte tekst, te publiceren zijn, zonder dat het eruitziet alsof het vol tags of
opmaakinstructies staat. De syntaxis van Markdown is beïnvloed door
verschillende bestaande filters van tekst naar HTML, waaronder **Setext**,
**atx**, **Textile**, **reStructuredText**, **Grutatext** en **EtText**, maar de
grootste bron van inspiratie is de vorm van e-mail in platte tekst.

## Blokelementen {#block-elements}

### Alinea's en regeleinden {#paragraphs-and-line-breaks}

Een alinea is gewoon een of meer opeenvolgende regels tekst, gescheiden door een
of meer lege regels. (Een lege regel is elke regel die er leeg uitziet: een
regel met alleen spaties of tabs geldt als leeg.) Gewone alinea's horen niet in
te springen met spaties of tabs.

De regel "een of meer opeenvolgende regels tekst" betekent dat Markdown alinea's
met harde regeleinden ondersteunt. Dat is heel anders dan bij de meeste andere
omzetters van tekst naar HTML (zoals de optie "Convert Line Breaks" van Movable
Type), die elk regeleinde in een alinea omzetten naar een tag `<br />`.

Wil je _wel_ een tag `<br />` invoegen met Markdown, dan eindig je een regel met
twee of meer spaties en druk je op Enter.

### Kopjes {#headers}

Markdown ondersteunt twee stijlen van kopjes: **Setext** en **atx**.

Je kunt kopjes in atx-stijl eventueel ook afsluiten. Dat is puur cosmetisch;
gebruik het als je het mooier vindt. Het aantal hekjes aan het eind hoeft niet
eens gelijk te zijn aan het aantal aan het begin. (Het aantal hekjes aan het
begin bepaalt het niveau van de kop.)

### Citaatblokken {#blockquotes}

Markdown gebruikt tekens `>` zoals in e-mail voor citaatblokken. Weet je hoe je
in een e-mail tekst citeert, dan weet je ook hoe je in Markdown een citaatblok
maakt. Het ziet er het mooist uit als je de tekst zelf afbreekt en voor elke
regel een `>` zet:

Syntaxis:

```plaintext
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum
> enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem
> consectetuer libero luctus adipiscing.
```

Uitvoer:

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum
> enim wisi, viverra nec, fringilla in, laoreet vitae, risus. > Donec sit amet
> nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem consectetuer
> libero luctus adipiscing.

Markdown laat je lui zijn: je mag de `>` alleen voor de eerste regel van een
afgebroken alinea zetten:

Syntaxis:

```plaintext
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum
> enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem
> consectetuer libero luctus adipiscing.
```

Uitvoer:

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum
> enim wisi, viverra nec, fringilla in, laoreet vitae, risus. > Donec sit amet
> nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem consectetuer
> libero luctus adipiscing.

Citaatblokken kunnen worden genest (een citaatblok in een citaatblok) door extra
niveaus van `>` toe te voegen:

Syntaxis:

```plaintext
> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.
```

Uitvoer:

> This is the first level of quoting. >
>
> > This is nested blockquote. > Back to the first level.

Citaatblokken kunnen andere elementen van Markdown bevatten, zoals kopjes,
lijsten en codeblokken:

Syntaxis:

````plaintext
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
````

Uitvoer:

> ## This is a header >
>
> 1. This is the first list item.
> 2. This is the second list item. > Here's some example code: >
>
> ```bash
> return shell_exec("echo $input | $markdown_script");
> ```

Elke goede teksteditor maakt citeren in de stijl van e-mail eenvoudig. In BBEdit
selecteer je bijvoorbeeld tekst en kies je Increase Quote Level in het menu
Text.

### Lijsten {#lists}

Markdown ondersteunt genummerde en ongenummerde lijsten (met opsommingstekens).

Ongenummerde lijsten gebruiken sterretjes, plustekens en koppeltekens door
elkaar als opsommingsteken:

Syntaxis:

```plaintext
- Red
- Green
- Blue
```

Uitvoer:

- Red
- Green
- Blue

is hetzelfde als:

Syntaxis:

```plaintext
+ Red
+ Green
+ Blue
```

Uitvoer:

- Red
- Green
- Blue

en:

Syntaxis:

```plaintext
* Red
* Green
* Blue
```

Uitvoer:

- Red
- Green
- Blue

Genummerde lijsten gebruiken getallen gevolgd door een punt:

Syntaxis:

```plaintext
1. Bird
2. McHale
3. Parish
```

Uitvoer:

1. Bird
2. McHale
3. Parish

Let op: de getallen die je gebruikt hebben geen invloed op de HTML die Markdown
maakt. De HTML die Markdown van de lijst hierboven maakt, is:

Schrijf je de lijst in Markdown zo:

Syntaxis:

```plaintext
1. Bird
1. McHale
1. Parish
```

Uitvoer:

1. Bird
1. McHale
1. Parish

of zelfs:

Syntaxis:

```plaintext
3. Bird
1. McHale
1. Parish
```

Uitvoer:

3. Bird
1. McHale
1. Parish

Dan krijg je precies dezelfde HTML. Het punt is: als je wilt, gebruik je
oplopende nummers in je genummerde lijsten in Markdown, zodat de nummers in je
bron gelijk zijn aan die in de gepubliceerde HTML. Maar als je lui wilt zijn,
hoeft dat niet.

Voor mooie lijsten kun je items afbreken met een hangende inspringing:

Syntaxis:

```plaintext
- Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi
  posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet
  vitae, risus.
- Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem
  consectetuer libero luctus adipiscing.
```

Uitvoer:

- Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi
  posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet
  vitae, risus.
- Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse ID sem
  consectetuer libero luctus adipiscing.

Lijstitems kunnen uit meerdere alinea's bestaan. Elke volgende alinea in een
lijstitem moet 4 spaties of één tab inspringen:

Syntaxis:

```plaintext
1. This is a list item with two paragraphs. Lorem ipsum dolor sit amet,
   consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.

   Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec
   sit amet nisl. Aliquam semper ipsum sit amet velit.

2. Suspendisse ID sem consectetuer libero luctus adipiscing.
```

Uitvoer:

1. This is a list item with two paragraphs. Lorem ipsum dolor sit amet,
   consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.

   Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec
   sit amet nisl. Aliquam semper ipsum sit amet velit.

2. Suspendisse ID sem consectetuer libero luctus adipiscing.

Het ziet er mooi uit als je elke regel van de volgende alinea's laat inspringen,
maar ook hier laat Markdown je lui zijn:

Syntaxis:

````plaintext
- This is a list item with two paragraphs.

  ```plaintext
  This is the second paragraph in the list item. You're
  ```

  only required to indent the first line. Lorem ipsum dolor sit amet,
  consectetuer adipiscing elit.

- Another item in the same list.
````

Uitvoer:

- This is a list item with two paragraphs.

  ```plaintext
  This is the second paragraph in the list item. You're
  ```

  only required to indent the first line. Lorem ipsum dolor sit amet,
  consectetuer adipiscing elit.

- Another item in the same list.

Om een citaatblok in een lijstitem te zetten, moeten de tekens `>` van het
citaatblok inspringen:

Syntaxis:

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

Uitvoer:

- A list item with a blockquote:

  > This is a blockquote inside a list item.

Om een codeblok in een lijstitem te zetten, moet het codeblok _twee keer_
inspringen: 8 spaties of twee tabs:

- A list item with a code block:

  ```plaintext
  <code goes here>
  ```

### Codeblokken {#code-blocks}

Vooraf opgemaakte codeblokken gebruik je om te schrijven over broncode van
programma's of opmaak. In plaats van gewone alinea's worden de regels van een
codeblok letterlijk genomen. Markdown zet een codeblok in de tags `<pre>` en
`<code>`.

Om in Markdown een codeblok te maken, laat je elke regel van het blok minstens 4
spaties of 1 tab inspringen.

Dit is een gewone alinea:

Syntaxis:

````plaintext
```
This is a code block.
```
````

Uitvoer:

```plaintext
This is a code block.
```

Hier is een voorbeeld van AppleScript:

Syntaxis:

````plaintext
```AppleScript
tell application "Foo" beep end tell
```
````

Uitvoer:

```AppleScript
tell application "Foo"
    beep
end tell
```

Een codeblok loopt door tot een regel die niet inspringt (of tot het eind van
het artikel).

In een codeblok worden ampersands (`&`) en punthaken (`<` en `>`) automatisch
omgezet naar HTML-entiteiten. Zo neem je met Markdown heel eenvoudig
voorbeeldcode in HTML op: plak de code, laat die inspringen, en Markdown regelt
het coderen van de ampersands en punthaken. Bijvoorbeeld dit:

Syntaxis:

````plaintext
```HTML
<div class="footer"> &copy; 2004 Foo Corporation </div>
```
````

Uitvoer:

```HTML
<div class="footer">
    &copy; 2004 Foo Corporation
</div>
```

Gewone syntaxis van Markdown wordt in codeblokken niet verwerkt. Sterretjes zijn
in een codeblok bijvoorbeeld gewoon sterretjes. Zo kun je met Markdown ook
makkelijk over de syntaxis van Markdown zelf schrijven.

Syntaxis:

````plaintext
```Markdown
tell application "Foo" beep end tell
```
````

Uitvoer:

```Markdown
tell application "Foo"
    beep
end tell
```

## Inline-elementen {#span-elements}

### Links

Markdown ondersteunt twee stijlen van links: _inline_ en _met verwijzing_.

In beide stijlen staat de linktekst tussen [vierkante haken].

Voor een inline-link zet je direct na de sluitende vierkante haak van de
linktekst een paar gewone haakjes. Zet tussen de haakjes de URL waarnaar de link
wijst, met een _optionele_ titel voor de link tussen aanhalingstekens,
bijvoorbeeld:

Syntaxis:

```plaintext
This is [an example](http://example.com/ "This is a link title") inline link.

[This link](http://example.net/) has no title attribute.
```

Uitvoer:

This is [an example](http://example.com/ "This is a link title") inline link.

[This link](http://example.net/) has no title attribute.

### Nadruk {#emphasis}

Markdown ziet sterretjes (`*`) en underscores (`_`) als tekens voor nadruk.
Tekst tussen één `*` of `_` krijgt de HTML-tag `<em>`; tekst tussen twee `*` of
`_` krijgt de HTML-tag `<strong>`. Bijvoorbeeld deze invoer:

Syntaxis:

```plaintext
*single asterisks*

_single underscores_

**double asterisks**

__double underscores__
```

Uitvoer:

_single asterisks_

_single underscores_

**double asterisks**

**double underscores**

### Code

Om een stuk code aan te geven, zet je het tussen backticks (`` ` ``). Anders dan
een vooraf opgemaakt codeblok geeft een inline-stuk code code binnen een gewone
alinea aan. Bijvoorbeeld:

Use the `printf()` function. `"type": "sepa_debit"`
