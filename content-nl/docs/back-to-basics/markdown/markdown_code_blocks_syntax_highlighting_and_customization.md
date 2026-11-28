---
title: "Codeblokken in Markdown: syntaxmarkering en aanpassing"
description:
  "Leer hoe je de codeblokken van Markdown gebruikt, met syntaxmarkering door
  Chroma en mogelijkheden om ze aan te passen."
url: "back-to-basics/markdown/code-blocks"
aliases: ""
icon: "code_blocks"

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
  - Code Blocks
  - Syntax Highlighting
  - Chroma
keywords:
  - Markdown
  - Code Blocks
  - Syntax Highlighting
  - Chroma

weight: 2501

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Syntaxmarkering {#syntax-highlighting}

De ingebouwde syntaxmarkering van Hugo, [Chroma], markeert codeblokken bij het
bouwen van de site, in de kleuren GitHub Light en GitHub Dark. De shortcode
`prism` hieronder werkt nog en gebruikt dezelfde markering.

## code fences - `bash`

Syntaxis:

````plaintext
```bash
curl -X POST -is "http://localhost:4242/create-checkout-session" -d ""
```
````

Uitvoer:

```bash
curl -X POST -is "http://localhost:4242/create-checkout-session" -d ""
```

## code fences - `JavaScript`

Syntaxis:

````plaintext
```JavaScript {linenos=inline,linenostart=19,hl_lines=[1,"4-5"],anchorlinenos=true}
function foo(bar) {
  var a = 42,
    b = "Prism";
  return a + bar(b);
}
```
````

Uitvoer:

```JavaScript {linenos=inline,linenostart=19,hl_lines=[1,"4-5"],anchorlinenos=true}
function foo(bar) {
  var a = 42,
    b = "Prism";
  return a + bar(b);
}
```

## code fences - `html`

Syntaxis:

````plaintext
```html
<html>
  <head>
    <title>Buy cool new product</title>
  </head>
  <body>
    <!-- Use action="/create-checkout-session.php" if your server is PHP based. -->
    <form action="/create-checkout-session" method="POST">
      <button type="submit">Checkout</button>
    </form>
  </body>
</html>
```
````

Uitvoer:

```html
<html>
  <head>
    <title>Buy cool new product</title>
  </head>
  <body>
    <!-- Use action="/create-checkout-session.php" if your server is PHP based. -->
    <form action="/create-checkout-session" method="POST">
      <button type="submit">Checkout</button>
    </form>
  </body>
</html>
```

## code fences - `swift`

Syntaxis:

````plaintext
```swift
let cardParams = STPCardParams()
cardParams.name = "Jenny Rosen"
cardParams.number = "4242424242424242"
cardParams.expMonth = 12
cardParams.expYear = 18
cardParams.cvc = "424"

let sourceParams = STPSourceParams.cardParams(withCard: cardParams)
STPAPIClient.shared.createSource(with: sourceParams) { (source, error) in
    if let s = source, s.flow == .none && s.status == .chargeable {
        self.createBackendChargeWithSourceID(s.stripeID)
    }
}
```
````

Uitvoer:

```swift
let cardParams = STPCardParams()
cardParams.name = "Jenny Rosen"
cardParams.number = "4242424242424242"
cardParams.expMonth = 12
cardParams.expYear = 18
cardParams.cvc = "424"

let sourceParams = STPSourceParams.cardParams(withCard: cardParams)
STPAPIClient.shared.createSource(with: sourceParams) { (source, error) in
    if let s = source, s.flow == .none && s.status == .chargeable {
        self.createBackendChargeWithSourceID(s.stripeID)
    }
}
```

## code fences - `treeview`

Syntaxis:

````plaintext
```treeview
├── fonts/
├── images/
├── js/
│   ├── vendor/
│   ├── app.js
│   └── index.js
├── lambda/
└── scss/
    ├── common/
    ├── components/
    ├── layouts/
    ├── vendor/
    └── app.scss
```
````

Uitvoer:

```treeview
├── fonts/
├── images/
├── js/
│   ├── vendor/
│   ├── app.js
│   └── index.js
├── lambda/
└── scss/
    ├── common/
    ├── components/
    ├── layouts/
    ├── vendor/
    └── app.scss
```

## prism shortcode - `go`

{{% alert context="danger" %}}
Dit geldt alleen voor de website van Homelab-Alpha {{% /alert %}}

Syntaxis:

```plaintext
{{</* prism lang="go" start="46" line="6-13,15-25,27-44,45,46,48-52" */>}} package
main

import ( "net/http"

"github.com/labstack/echo" "github.com/labstack/echo/middleware"
"github.com/stripe/stripe-go/v72"
"github.com/stripe/stripe-go/v72/checkout/session" )

// This example sets up an endpoint using the Echo framework. // Watch this
video to get started: <https://youtu.be/ePmEVBu8w6Y>.

func main() { stripe.Key = "UfXXWzQ2B1yVX57GU3QV8EQyTizMUvUm"

e := echo.New() e.Use(middleware.Logger()) e.Use(middleware.Recover())

e.POST("/create-checkout-session", createCheckoutSession)

e.Logger.Fatal(e.Start("localhost:4242")) }

func createCheckoutSession(c echo.Context) (err error) { params :=
&stripe.CheckoutSessionParams{ Mode:
stripe.String(string(stripe.CheckoutSessionModePayment)), LineItems:
[]\*stripe.CheckoutSessionLineItemParams{ &stripe.CheckoutSessionLineItemParams{
PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{ Currency:
stripe.String("usd"), ProductData:
&stripe.CheckoutSessionLineItemPriceDataProductDataParams{ Name:
stripe.String("T-shirt"), }, UnitAmount: stripe.Int64(2000), }, Quantity:
stripe.Int64(1), }, }, SuccessURL:
stripe.String("<http://localhost:4242/success>"), CancelURL:
stripe.String("<http://localhost:4242/cancel>"), }

s, \_ := session.New(params)

if err != nil { return err }

return c.Redirect(http.StatusSeeOther, s.URL) } {{</* /prism */>}}
```

Uitvoer:

{{< prism lang="go" start="46" line="6-13,15-25,27-44,45,46,48-52" >}} package
main

import ( "net/http"

"github.com/labstack/echo" "github.com/labstack/echo/middleware"
"github.com/stripe/stripe-go/v72"
"github.com/stripe/stripe-go/v72/checkout/session" )

// This example sets up an endpoint using the Echo framework. // Watch this
video to get started: <https://youtu.be/ePmEVBu8w6Y>.

func main() { stripe.Key = "UfXXWzQ2B1yVX57GU3QV8EQyTizMUvUm"

e := echo.New() e.Use(middleware.Logger()) e.Use(middleware.Recover())

e.POST("/create-checkout-session", createCheckoutSession)

e.Logger.Fatal(e.Start("localhost:4242")) }

func createCheckoutSession(c echo.Context) (err error) { params :=
&stripe.CheckoutSessionParams{ Mode:
stripe.String(string(stripe.CheckoutSessionModePayment)), LineItems:
[]\*stripe.CheckoutSessionLineItemParams{ &stripe.CheckoutSessionLineItemParams{
PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{ Currency:
stripe.String("usd"), ProductData:
&stripe.CheckoutSessionLineItemPriceDataProductDataParams{ Name:
stripe.String("T-shirt"), }, UnitAmount: stripe.Int64(2000), }, Quantity:
stripe.Int64(1), }, }, SuccessURL:
stripe.String("<http://localhost:4242/success>"), CancelURL:
stripe.String("<http://localhost:4242/cancel>"), }

s, \_ := session.New(params)

if err != nil { return err }

return c.Redirect(http.StatusSeeOther, s.URL) } {{< /prism >}}

## prism shortcode - `JavaScript`

{{% alert context="danger" %}}
Dit geldt alleen voor de website van Homelab-Alpha {{% /alert %}}

Syntaxis:

```plaintext
{{</* prism lang="JavaScript" linkable-line-numbers="true" line-numbers="true" start="19" line-offset="19" line="19,22-23" */>}}
function foo(bar) { var a = 42, b = 'Prism'; return a + bar(b); } {{</* /prism */>}}
```

Uitvoer:

{{< prism lang="JavaScript" linkable-line-numbers="true" line-numbers="true" start="19" line-offset="19" line="19,22-23" >}}
function foo(bar) { var a = 42, b = 'Prism'; return a + bar(b); } {{< /prism >}}

[Chroma]: https://github.com/alecthomas/chroma
