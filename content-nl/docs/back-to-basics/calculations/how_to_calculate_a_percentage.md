---
title: "Percentages berekenen"
description:
  "Leer met deze uitgebreide gids hoe je percentages berekent. Begrijp de
  formules en stappen om percentages te bepalen, waarden met een percentage te
  verhogen of te verlagen en het procentuele verschil te vinden."
url: "back-to-basics/calculations/how-to-calculate-a-percentage"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Calculations
tags:
  - Troubleshooting
  - Math Guide
  - Calculation Tips
  - Percentage Calculation
keywords:
  - percentage calculation
  - how to calculate percentages
  - math help
  - increase by percentage
  - decrease by percentage
  - percentage difference
  - calculator tips

weight: 2103

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Een percentage van een getal nemen {#taking-a-percentage-of-a-number}

De formule om een percentage van een getal te berekenen is:

$ \text{Resultaat} = \frac{p \times v}{100} $

Waarbij \( p \) het percentage is en \( v \) de waarde. Bijvoorbeeld 20% van 50
berekenen:

$ \text{Resultaat} = \frac{20 \times 50}{100} = 10 $

Zo bereken je het op een rekenmachine:

$ \ p \times v \div 100 \ $

---

## Een getal met een bepaald percentage verhogen {#increasing-a-number-by-a-certain-percentage}

Zo verhoog je een getal met een bepaald percentage:

$ \text{Resultaat} = v + \left(\frac{p}{100} \times v\right) $

Waarbij \( p \) het percentage is en \( v \) de waarde. Bijvoorbeeld 50 met 20%
verhogen:

$ \text{Resultaat} = 50 + \left(\frac{20}{100} \times 50\right) = 50 + 10 = 60 $

Zo bereken je het op een rekenmachine:

$ \ v + (p \times v \div 100) \ $

---

## Een getal met een bepaald percentage verlagen {#decreasing-a-number-by-a-certain-percentage}

Zo verlaag je een getal met een bepaald percentage:

$ \text{Resultaat} = v - \left(\frac{p}{100} \times v\right) $

Waarbij \( p \) het percentage is en \( v \) de waarde. Bijvoorbeeld 50 met 20%
verlagen:

$ \text{Resultaat} = 50 - \left(\frac{20}{100} \times 50\right) = 50 - 10 = 40 $

Zo bereken je het op een rekenmachine:

$ \ v - (p \times v \div 100) \ $

---

## Berekenen hoeveel procent het ene getal van het andere is {#calculating-what-percentage-one-number-is-of-another}

Zo bereken je hoeveel procent het ene getal van het andere is:

$ \text{Percentage} = \left(\frac{v1 \times 100}{v2}\right) $

Waarbij \( v1 \) de eerste waarde is en \( v2 \) de tweede. Bijvoorbeeld:
hoeveel procent is 20 van 50?

$ \text{Percentage} = \left(\frac{20 \times 100}{50}\right) = 40\% $

Zo bereken je het op een rekenmachine:

$ \ v1 \times 100 \div v2 \ $

---

## Het procentuele verschil berekenen {#calculating-the-percentage-difference}

Zo bereken je het procentuele verschil tussen twee getallen:

$ \text{Procentueel verschil} = \left(\frac{v2 - v1}{v1}\right) \times 100 $

Waarbij \( v1 \) de eerste waarde is en \( v2 \) de tweede. Bijvoorbeeld het
procentuele verschil tussen 20 en 50 berekenen:

$ \text{Procentueel verschil} = \left(\frac{50 - 20}{20}\right) \times 100 =
\left(\frac{30}{20}\right) \times 100 = 150\% $

Zo bereken je het op een rekenmachine:

$ \ (v2 - v1) \div v1 \times 100 \ $
