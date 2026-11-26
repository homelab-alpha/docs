---
title: "Markdown beheersen: gevorderde technieken"
description:
  "Verdiep je in gevorderde technieken van Markdown, met eigen voorbeelden om
  bijzondere of zeldzame opmaak te testen. Verken meldingen met shortcodes, pas
  de grootte van afbeeldingen aan en maak genummerde en ongenummerde lijsten met
  kopjes."
url: "back-to-basics/markdown/unorthodox"
aliases: ""
icon: "fingerprint"

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
  - custom Markdown
  - Markdown examples
  - notifications
  - alerts
  - image sizes
  - heading lists
keywords:
  - Markdown
  - custom Markdown
  - Markdown examples
  - notifications
  - alerts
  - image sizes
  - heading lists
  - Markdown notifications
  - Markdown alerts
  - Markdown image sizes
  - Markdown heading lists

weight: 2502

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

# Meldingen in Markdown {#markdown-alerts}

Verschillende stijlen voor meldingen:

## Note

Syntaxis:

```plaintext
> [!NOTE]
> Useful information that users should know, even when skimming content.
```

Uitvoer:

<!-- prettier-ignore -->
> [!NOTE]
> Nuttige informatie die gebruikers moeten weten, ook als ze de inhoud vluchtig lezen.

## Tip

Syntaxis:

```plaintext
> [!TIP]
> Helpful advice for doing things better or more easily.
```

Uitvoer:

<!-- prettier-ignore -->
> [!TIP]
> Handig advies om dingen beter of makkelijker te doen.

## Important

Syntaxis:

```plaintext
> [!IMPORTANT]
> Key information users need to know to achieve their goal.
```

Uitvoer:

<!-- prettier-ignore -->
> [!IMPORTANT]
> Belangrijke informatie die gebruikers nodig hebben om hun doel te bereiken.

## Warning

Syntaxis:

```plaintext
> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.
```

Uitvoer:

<!-- prettier-ignore -->
> [!WARNING]
> Dringende informatie die direct aandacht vraagt, om problemen te voorkomen.

## Caution

Syntaxis:

```plaintext
> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

Uitvoer:

<!-- prettier-ignore -->
> [!CAUTION]
> Waarschuwt voor risico's of negatieve gevolgen van bepaalde acties.

## Note

Syntaxis:

```plaintext
> **Note**\
> This is a note
```

Uitvoer:

> **Note**\
> Dit is een opmerking

# Afbeeldingen in Markdown {#markdown-images}

Syntaxis:

```plaintext
![Redis](https://res.cloudinary.com/qunux/image/upload/v1643320066/isometric_redis_proxy_icon_nmf5dm.webp)
```

Uitvoer:

![Redis](https://res.cloudinary.com/qunux/image/upload/v1643320066/isometric_redis_proxy_icon_nmf5dm.webp)

# Kopjes in Markdown {#markdown-headings}

# Heading \<h1\>

Syntaxis:

```plaintext
# Heading

- # Heading

1. # Heading
```

Uitvoer:

# Heading

- # Heading

1. # Heading

## Heading \<h2\>

Syntaxis:

```plaintext
## Heading

- ## Heading

1. ## Heading
```

Uitvoer:

## Heading

- ## Heading

1. ## Heading

### Heading \<h3\>

Syntaxis:

```plaintext
### Heading

- ### Heading

1. ### Heading
```

Uitvoer:

### Heading

- ### Heading

1. ### Heading

#### Heading \<h4\>

Syntaxis:

```plaintext
#### Heading

- #### Heading

1. #### Heading
```

Uitvoer:

#### Heading

- #### Heading

1. #### Heading

##### Heading \<h5\>

Syntaxis:

```plaintext
##### Heading

- ##### Heading

1. ##### Heading
```

Uitvoer:

##### Heading

- ##### Heading

1. ##### Heading

###### Heading \<h6\>

Syntaxis:

```plaintext
###### Heading

- ###### Heading

1. ###### Heading
```

Uitvoer:

###### Heading

- ###### Heading

1. ###### Heading

# Meldingen met shortcodes {#shortcode-alerts}

{{% alert context="danger" %}}
Dit geldt alleen voor de website van Homelab-Alpha
{{% /alert %}}

{{% alert %}}
Dit is de standaardmelding zonder opties.<br />Er is geen parameter `context` of
`icon` gedefinieerd.
{{% /alert %}}

{{% alert  context="info" %}}
**Markdown** en <em>HTML</em> worden weergegeven. De volgende zin [laat
zien][demonstrates] welke kleur een link in een meldingsvak heeft. We werken aan
een nieuwe manier om het Payment Element te integreren, waarmee je de
PaymentIntent of SetupIntent maakt nadat je het Payment Element hebt
weergegeven. Als je meer over deze functie wilt weten.

_Begin_ van een tweede alinea.
{{% /alert %}}

{{% alert icon="🎃" context="info" %}}
Het standaardpictogram van de <strong>context</strong> kun je vervangen door een
emoji, door de parameter <code>icon</code> op de gewenste emoji te zetten. Bijv.

<code>{{\< alert icon="🎃" text="Make sure to always self-close the alert shortcode." />}}</code>
{{% /alert %}}

{{% alert icon=" " context="primary" %}} Het standaardpictogram van de
<strong>context</strong> kun je verbergen door de parameter <code>icon</code> op
een spatie te zetten. Bijv.

```plaintext
{{\< alert icon=" " text="Make sure to always self-close the alert shortcode." />}}
```

{{% /alert %}}

{{% alert icon="🌕" context="light" text="An <strong>light</strong> context alert using an emoji (:full_moon:) instead of the default <strong>icon</strong>." /%}}

{{< alert icon="🌑" context="dark" text="An alert using an emoji (:jack_o_lantern:) instead of the default <strong>context</strong> icon." />}}

{{% alert context="primary" %}} De handleiding is bedoeld voor beginnende tot
gemiddelde gebruikers.

De volgende zin [laat zien][demonstrates] welke kleur een link in een
meldingsvak heeft.
{{% /alert %}}

{{< alert context="success" text="The Tutorial is intended for novice to intermediate users.<br /> Hello World" />}}

{{< alert context="warning" text="The Tutorial is intended for novice to intermediate users.<br /> Hello World" />}}

{{< alert context="danger" text="The Tutorial is intended for novice to intermediate users.<br /> Hello World" />}}

{{% alert context="light" %}}
De handleiding is bedoeld voor beginnende tot gemiddelde gebruikers.<br /> Hello
World De volgende zin [laat zien][demonstrates] welke kleur een link in een
meldingsvak heeft.
{{% /alert %}}

[demonstrates]: https://homelab-alpha.nl
