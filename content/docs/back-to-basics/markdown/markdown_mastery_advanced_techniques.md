---
title: "Markdown Mastery: Advanced Techniques"
description:
  "Delve into advanced Markdown techniques with custom examples tailored to test
  specific or rare styling cases. Explore shortcode notifications/alerts,
  manipulate image sizes, and create ordered/unordered heading lists."
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

weight: 104004

toc: true
katex: true
---

<br />

# Markdown Alerts

Various alert notification styles:

## Note

Syntax:

```plaintext
> [!NOTE]
> Useful information that users should know, even when skimming content.
```

Output:

![Note](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/markdown-alerts/markdown_alerts_note.webp)

<br />

## Tip

Syntax:

```plaintext
> [!TIP]
> Helpful advice for doing things better or more easily.
```

Output:

![Tip](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/markdown-alerts/markdown_alerts_tip.webp)

<br />

Syntax:

## Important

```plaintext
> [!IMPORTANT]
> Key information users need to know to achieve their goal.
```

Output:

![Important](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/markdown-alerts/markdown_alerts_important.webp)

<br />

## Warning

Syntax:

```plaintext
> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.
```

Output:

![Warning](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/markdown-alerts/markdown_alerts_waring.webp)

<br />

## Caution

Syntax:

```plaintext
> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

Output:

![Caution](https://raw.githubusercontent.com/homelab-alpha/docs/main/assets/images/markdown-alerts/markdown_alerts_caution.webp)

<br />

## Note

Syntax:

```plaintext
> **Note**\
> This is a note
```

Output:

> **Note**\
> This is a note

<br />

# Markdown Images

Syntax:

```plaintext
![Redis](https://res.cloudinary.com/qunux/image/upload/v1643320066/isometric_redis_proxy_icon_nmf5dm.webp)
```

Output:

![Redis](https://res.cloudinary.com/qunux/image/upload/v1643320066/isometric_redis_proxy_icon_nmf5dm.webp)

<br />


# Markdown Headings

# Heading \<h1\>

Syntax:

```plaintext
# Heading

- # Heading

1. # Heading
```

Output:

# Heading

- # Heading

1. # Heading

<br />

## Heading \<h2\>

Syntax:

```plaintext
## Heading

- ## Heading

1. ## Heading
```

Output:

## Heading

- ## Heading

1. ## Heading

<br />

### Heading \<h3\>

Syntax:

```plaintext
### Heading

- ### Heading

1. ### Heading
```

Output:

### Heading

- ### Heading

1. ### Heading

<br />

#### Heading \<h4\>

Syntax:

```plaintext
#### Heading

- #### Heading

1. #### Heading
```

Output:

#### Heading

- #### Heading

1. #### Heading


<br />

##### Heading \<h5\>

Syntax:

```plaintext
##### Heading

- ##### Heading

1. ##### Heading
```

Output:

##### Heading

- ##### Heading

1. ##### Heading

<br />

###### Heading \<h6\>

Syntax:

```plaintext
###### Heading

- ###### Heading

1. ###### Heading
```

Output:

###### Heading

- ###### Heading

1. ###### Heading

<br /><br />

# Shortcode Alerts

{{% alert context="danger" %}}
This only applies to Homelab-Alpha website
{{% /alert %}}

<br />

{{% alert %}}
This is the default alert without any options.<br />No `context`
or `icon` parameter defined.
{{% /alert %}}

<br />

{{% alert  context="info" %}}
**Markdown** and <em>HTML</em> will be rendered.
This next sentence [demonstrates] the colour of a link inside an alert box.
We’re currently designing a new way to integrate the Payment Element, which
allows you to create the PaymentIntent or SetupIntent after you render the
Payment Element. If you’re interested in learning more about this feature.

_Beginning_ of a second paragraph.
{{% /alert %}}

<br />

{{% alert icon="🎃" context="info" %}}
The default <strong>context</strong> icon
can be overridden with an emoji by setting the named parameter <code>icon</code>
to the emoji of choice. e.g.

<code>{{\< alert icon="🎃" text="Make sure to always self-close the alert shortcode." />}}</code>
{{% /alert %}}

<br />

{{% alert icon=" " context="primary" %}} The default <strong>context</strong>
icon can be overridden to display no icon by setting the named parameter
<code>icon</code> to an empty space. e.g.

```plaintext
{{\< alert icon=" " text="Make sure to always self-close the alert shortcode." />}}
```

{{% /alert %}}

<br />

{{% alert icon="🌕" context="light" text="An <strong>light</strong> context alert using an emoji (:full_moon:) instead of the default <strong>icon</strong>." /%}}

<br />

{{< alert icon="🌑" context="dark" text="An alert using an emoji (:jack_o_lantern:) instead of the default <strong>context</strong> icon." />}}

<br />

{{% alert context="primary" %}} The Tutorial is intended for beginner to
intermediate users.

This next sentence [demonstrates] the colour of a link inside an alert box.
{{% /alert %}}

<br />

{{< alert context="success" text="The Tutorial is intended for novice to intermediate users.<br /> Hello World" />}}

<br />

{{< alert context="warning" text="The Tutorial is intended for novice to intermediate users.<br /> Hello World" />}}

<br />

{{< alert context="danger" text="The Tutorial is intended for novice to intermediate users.<br /> Hello World" />}}

<br />

{{% alert context="light" %}}
The Tutorial is intended for novice to
intermediate users.<br /> Hello World This next sentence [demonstrates] the
colour of a link inside an alert box.
{{% /alert %}}

[demonstrates]: https://homelab-alpha.nl
