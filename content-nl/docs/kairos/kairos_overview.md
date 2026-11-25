---
title: "Overzicht van Kairos"
description:
  "Maak kennis met Kairos, een Lovelace-kaart voor Home Assistant met de
  stroomprijzen van morgen"
url: "kairos/overview"
aliases: ""
icon: "overview"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Kairos
series:
  - Kairos
tags:
  - kairos
  - home assistant
  - electricity prices
keywords:
  - Kairos
  - Home Assistant
  - Lovelace card
  - day-ahead electricity prices
  - Nord Pool
  - price chart
  - heatmap
  - electricity price breakdown
  - custom card

draft: false
weight: 7002

toc: true
katex: true
---

## Beschrijving

**Kairos** toont de stroomprijzen van de day-aheadmarkt in Home Assistant als
prijsgrafiek, heatmap of kostenopbouw. Het is één JavaScript-bestand zonder
afhankelijkheden, gebouwd met Shadow DOM en met de hand geschreven SVG, en volgt
de Apple Human Interface Guidelines voor indeling, tekst en aanraakdoelen.

De naam komt van het Griekse _kairos_ (καιρός), het juiste moment. De kaart laat
zien wanneer stroom het goedkoopst is, zodat je je elektrische auto of
thuisbatterij op het juiste moment oplaadt, voor een betere prijs.

De kaart leest nu de Nord Pool-integratie (Nederland) met prijzen per 15
minuten. Ondersteuning voor meer bronnen, zoals ENTSO-E, staat op de planning.

## Functies

- **Drie weergaven**: prijs, heatmap en opbouw (dal, piek, dal), met staaf- of
  lijngrafieken.
- **Navigatie**: blader door dagen, spring naar een week, maand, kwartaal of
  jaar, of kies een periode in de kalender, ook over maanden heen.
- **Resolutie**: 15 minuten, uren, dagen, weken of maanden, afhankelijk van de
  periode; de editor biedt alleen de opties die gelden.
- **Geschiedenis**: eerdere dagen en periodes komen uit de recorderstatistieken
  van een geschiedenissensor.
- **Zoomen**: scrollwiel, slepen en toetsen op desktop; dubbeltikken en met twee
  vingers verschuiven op iPhone en iPad. Elk is een aparte optie.
- **Responsief**: compacte, normale, grote en kioskindeling; lichte en donkere
  modus; werkt op telefoons, tablets en wandschermen.
- **Visuele editor**: alle opties in gegroepeerde secties, met validatie.
- **Talen**: Engels en Nederlands, in de kaart en in de visuele editor.

## Schermafbeeldingen

Deze schermafbeeldingen tonen de kaart in Home Assistant, met prijzen van de
Nord Pool-integratie. De kaart ondersteunt een lichte en een donkere modus; de
schermafbeeldingen gebruiken de donkere modus.

### Desktop

<details> <summary>Weergaven op desktop (klik om uit te klappen)</summary>

Prijsweergave:

![Prijsweergave op desktop](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_desktop_price.png)

Heatmap:

![Heatmap op desktop](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_desktop_heatmap.png)

Opbouwweergave:

![Opbouwweergave op desktop](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_desktop_breakdown.png)

Menu met periode en kalender:

![Kalender op desktop](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_desktop_calendar.png)

</details>

### Kiosk

<details> <summary>Weergaven in kioskmodus (klik om uit te klappen)</summary>

Prijsweergave:

![Prijsweergave in kioskmodus](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_kiosk_price.png)

Heatmap:

![Heatmap in kioskmodus](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_kiosk_heatmap.png)

Opbouwweergave:

![Opbouwweergave in kioskmodus](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_kiosk_breakdown.png)

Menu met periode en kalender:

![Kalender in kioskmodus](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_kiosk_calendar.png)

</details>

### Smartphone

<details> <summary>Weergaven op een smartphone (klik om uit te klappen)</summary>

Prijsweergave:

![Prijsweergave op een smartphone](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_smartphone_price.png)

Heatmap:

![Heatmap op een smartphone](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_smartphone_heatmap.png)

Opbouwweergave:

![Opbouwweergave op een smartphone](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_smartphone_breakdown.png)

Menu met periode en kalender:

![Kalender op een smartphone](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_smartphone_calendar.png)

</details>

### Visuele editor

<details> <summary>Secties van de editor (klik om uit te klappen)</summary>

![Editor: entiteiten en koptekst](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_1_entity_header.png)

![Editor: gegevens, weergave, prijzen en btw](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_2_data_prices.png)

![Editor: eenheden, opmaak en markeringen](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_3_units_highlights.png)

![Editor: onderdelen van de grafiek](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_4_chart_elements.png)

![Editor: overzichtssecties en bediening](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_5_summary_controls.png)

![Editor: doorzichtigheid en uiterlijk](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_6_opacity_appearance.png)

![Editor: kiosk en experimenteel](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_7_kiosk_experimental.png)

</details>

## Projectstatus

{{% alert context="warning" %}}
**Status:** alfa

Dit project wordt **actief ontwikkeld**. Opties en gedrag kunnen tussen versies
veranderen, zonder migratiepad.
{{% /alert %}}

{{% alert context="primary" %}}
Bijdragen worden voorlopig niet aangenomen. Zodra release v1.0.0 verschijnt,
zijn bijdragen van harte welkom.
{{% /alert %}}

Tot nu toe gecontroleerd: de kaart in Chromium met een nagebootste Home
Assistant, en de code van versie 0.1.0 op echte apparaten, gemeld door de
beheerder. Zie de
[projectstatus](https://github.com/homelab-alpha/kairos/blob/main/docs/project_status.md)
in de repository voor de huidige stand en open punten.

## Aan de slag

Zie de [snelstart](/kairos/quickstart/) om Home Assistant voor te bereiden en de
kaart te installeren, en de [configuratie](/kairos/configuration/) voor alle
opties.

## Bijdragen aan Homelab-Alpha - Kairos

Bijdragen worden voorlopig niet aangenomen. Zodra release v1.0.0 verschijnt,
zijn bijdragen van harte welkom. Zie [hoe je bijdraagt][contribute] voor de
richtlijnen, de namen van branches, de commitberichten en het reviewproces.

## Licentie

Dit project valt onder de **Apache License 2.0**. Zie de bestanden [LICENSE] en
[NOTICE] in de repository voor de volledige licentietekst en de eisen aan de
naamsvermelding.

[contribute]: /contributing/contribute/
[LICENSE]: https://github.com/homelab-alpha/kairos/blob/main/LICENSE
[NOTICE]: https://github.com/homelab-alpha/kairos/blob/main/NOTICE
