---
title: "Kairos configureren"
description:
  "Alle opties van de Kairos-kaart, gegroepeerd zoals in de visuele editor"
url: "kairos/configuration"
aliases: ""
icon: "tune"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Kairos
series:
  - Kairos
tags:
  - kairos configuration
  - card options
keywords:
  - Kairos configuration
  - Kairos options
  - Home Assistant card configuration
  - visual editor
  - heatmap
  - kiosk mode

draft: false
weight: 7001

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

Een minimale kaart:

```yaml
type: custom:kairos-card
entity: sensor.nord_pool_the_netherlands_prices
history_entity: sensor.nord_pool_the_netherlands_current_price
view: heatmap
day: today
```

Elke optie staat in de visuele editor, in dezelfde volgorde als hieronder.
Booleans zijn `true` of `false`. Een verkeerde waarde geeft een
configuratiefout.

## Entiteiten {#entities}

| Optie                  | Standaard                                        | Beschrijving                                                                        |
| :--------------------- | :----------------------------------------------- | :---------------------------------------------------------------------------------- |
| `entity`               | `sensor.nord_pool_the_netherlands_prices`        | Sensor met de attributen `today` en `tomorrow` (blokken van 15 minuten).            |
| `entities`             | geen                                             | Reservesensoren; de eerste die bruikbaar is, wordt gebruikt.                        |
| `history_entity`       | `sensor.nord_pool_the_netherlands_current_price` | Sensor met de kale prijs in EUR/kWh. Levert eerdere dagen, periodes en de kalender. |
| `history_quarter_days` | `7`                                              | Aantal dagen terug (0-10) met kwartieren; oudere dagen tonen uurgemiddelden.        |

## Koptekst {#header}

| Optie         | Standaard | Beschrijving                                                                          |
| :------------ | :-------- | :------------------------------------------------------------------------------------ |
| `source`      | `custom`  | `custom`, `nord_pool` of `entsoe`: de titel en het logo van de koptekst.              |
| `show_header` | `true`    | Toon de koptekst.                                                                     |
| `title`       | leeg      | Titel voor `source: custom`; `{day}` is de gekozen dag. Leeg gebruikt de standaard.   |
| `icon`        | leeg      | Icoon voor `source: custom`: een `mdi`-icoon zoals `mdi:flash`, of `false` voor geen. |

De standaardtitels zijn `Kairos` (`custom`, met het Kairos-logo),
`Nord Pool · Day-Ahead Market` en `ENTSO-E · Day-Ahead Market`. Alleen de bron
`custom` gebruikt je eigen `title` en `icon`; de andere bronnen negeren ze, en
de editor verbergt die twee opties. Voorlopig bepaalt `source` alleen de titel
en het logo; de kaart leest nog steeds de sensoren die je instelt. Het lezen van
ENTSO-E-gegevens staat op de planning.

## Gegevens en weergave {#data-and-view}

| Optie                   | Standaard | Beschrijving                                                                                                                                                          |
| :---------------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `day`                   | `today`   | `today`, `tomorrow`, `yesterday`, `week`, `month`, `year`, `q1` tot `q4`, of een datum (`YYYY-MM-DD`).                                                                |
| `auto_advance_tomorrow` | `false`   | Ga naar morgen zodra de prijzen daarvan bekend zijn.                                                                                                                  |
| `view`                  | `price`   | `price`, `heatmap` of `breakdown`.                                                                                                                                    |
| `period`                | `15min`   | Volgt `day`: een dag biedt `15min` en `hour`, een week `hour` en `day`, een maand `day` en `week`, een jaar `week` en `month`, een kwartaal `day`, `week` en `month`. |
| `chart_style`           | `bars`    | `auto`, `bars` of `line`; `auto` kiest op basis van de beschikbare breedte.                                                                                           |

## Prijzen en eenheden {#prices-and-units}

| Optie              | Standaard   | Beschrijving                                                             |
| :----------------- | :---------- | :----------------------------------------------------------------------- |
| `vat`              | `true`      | Inclusief btw.                                                           |
| `vat_rate`         | `21`        | Btw-tarief in procenten.                                                 |
| `energy_tax`       | `0`         | Energiebelasting in EUR/kWh, zonder btw.                                 |
| `surcharge`        | `0`         | Opslag van de leverancier in EUR/kWh, zonder btw.                        |
| `fixed_price`      | `0`         | Vast tarief in EUR/kWh, zonder btw; 0 verbergt het.                      |
| `fixed_label`      | leeg        | Energiebedrijf dat bij het tarief staat; leeg gebruikt de standaardnaam. |
| `unit`             | `auto`      | `auto`, `ct/kWh`, `EUR/kWh`, `SEK/kWh` enzovoort.                        |
| `decimals`         | automatisch | Geheel getal van 0 tot 6.                                                |
| `currency`         | `EUR`       | Valutacode voor bedragen.                                                |
| `currency_display` | `symbol`    | `symbol` of `code`.                                                      |
| `time_format`      | `24`        | `auto` (profiel in Home Assistant), `12` of `24`.                        |
| `axis_am_pm`       | `false`     | Toon AM/PM op de tijdas.                                                 |
| `axis_minutes`     | `false`     | Toon `00:00` in plaats van `00` op de tijdas.                            |

## Markeringen {#highlights}

| Optie               | Standaard | Beschrijving                                                               |
| :------------------ | :-------- | :------------------------------------------------------------------------- |
| `cheapest_quarters` | `10`      | Aantal goedkoopste blokken dat in de heatmap wordt gemarkeerd.             |
| `best_window_hours` | `0`       | Markeer het goedkoopste aaneengesloten venster van zoveel uur (0 is uit).  |
| `price_bands`       | `auto`    | `auto` (percentielen), `[low, high]` of `{ low, high }` zoals weergegeven. |

## Grafiek {#chart}

| Optie                  | Standaard    | Beschrijving                                                                                        |
| :--------------------- | :----------- | :-------------------------------------------------------------------------------------------------- |
| `show_chart`           | `true`       | Toon de grafiek.                                                                                    |
| `show_hour_grid`       | `true`       | Toon het uurraster.                                                                                 |
| `show_now_marker`      | `true`       | Toon de markering van de huidige tijd.                                                              |
| `show_extremes`        | `false`      | Toon de labels met de laagste en hoogste prijs.                                                     |
| `show_average_line`    | `false`      | Toon de lijn met het gemiddelde.                                                                    |
| `average_line_size`    | `medium`     | `small`, `medium` of `large`.                                                                       |
| `show_fixed_line`      | `false`      | Toon de lijn met het vaste tarief.                                                                  |
| `fixed_line_size`      | `medium`     | `small`, `medium` of `large`.                                                                       |
| `heat_gradient`        | `horizontal` | `horizontal` (één verloop over de hoogte van de grafiek) of `vertical` (één effen kleur per staaf). |
| `zoom_desktop`         | `false`      | Zoomen op desktop en laptop: scrollwiel, slepen om te verschuiven en de toetsen `+`, `-` en `0`.    |
| `zoom_touch`           | `false`      | Zoomen op iPhone en iPad: dubbeltikken, en met twee vingers verschuiven.                            |
| `zoom_buttons_desktop` | `true`       | Toon de knoppen herstellen, `-` en `+` op desktop en laptop.                                        |
| `zoom_buttons_touch`   | `true`       | Toon de herstelknop tijdens het zoomen op iPhone en iPad.                                           |

## Secties en bediening {#sections-and-controls}

| Optie                    | Standaard | Beschrijving                                                             |
| :----------------------- | :-------- | :----------------------------------------------------------------------- |
| `show_stats`             | `true`    | Toon de tegels.                                                          |
| `show_legend`            | `true`    | Toon de legenda en het overzicht van de goedkoopste blokken.             |
| `show_controls`          | `true`    | Toon de bediening. De knoppen hieronder hebben dit nodig.                |
| `show_day_button`        | `true`    | Bediening voor de dag.                                                   |
| `show_period_button`     | `true`    | Bediening voor de periode.                                               |
| `show_chart_type_button` | `true`    | Bediening voor het grafiektype.                                          |
| `show_price_button`      | `true`    | Knop voor de prijsweergave.                                              |
| `show_heatmap_button`    | `true`    | Knop voor de heatmap.                                                    |
| `show_breakdown_button`  | `true`    | Knop voor de opbouwweergave.                                             |
| `show_cheapest_stepper`  | `false`   | Teller voor het aantal goedkoopste blokken (heatmap, vandaag en morgen). |

## Doorzichtigheid {#opacity}

Waarden van 0 tot 100, per weergave en grafiektype.

| Optie                                                                  | Standaard |
| :--------------------------------------------------------------------- | :-------- |
| `price_bar_opacity`, `heatmap_bar_opacity`, `breakdown_bar_opacity`    | `75`      |
| `price_line_opacity`, `heatmap_line_opacity`, `breakdown_line_opacity` | `60`      |

## Uiterlijk {#appearance}

| Optie                    | Standaard | Beschrijving                                                                                       |
| :----------------------- | :-------- | :------------------------------------------------------------------------------------------------- |
| `color_scheme`           | `auto`    | `auto`, `light` of `dark`.                                                                         |
| `display_mode_desktop`   | `auto`    | `auto`, `compact` of `regular` op desktop en laptop. Auto is compact onder 720 px.                 |
| `display_mode_touch`     | `auto`    | Dezelfde waarden, op tablet en smartphone.                                                         |
| `kiosk`                  | `false`   | Markeer de kaart als kiosk of wandscherm. Dan gebruikt ze `display_mode_kiosk`.                    |
| `display_mode_kiosk`     | `auto`    | `auto`, `compact`, `regular`, `large` of `kiosk`. Auto kiest op basis van de breedte van de kaart. |
| `pixel_shift`            | `false`   | Verschuif de kaart een beetje om inbranden op wandschermen te voorkomen.                           |
| `editor_expand_sections` | `true`    | Open alle secties van de visuele editor.                                                           |

## Experimenteel {#experimental}

Deze opties kunnen na een update van Home Assistant ophouden te werken.

| Optie              | Standaard | Beschrijving                                                                  |
| :----------------- | :-------- | :---------------------------------------------------------------------------- |
| `edit_button`      | `false`   | Een knop in de koptekst die de kaarteditor opent (alleen beheerders).         |
| `edit_button_icon` | `sliders` | `sliders`, `gear`, `pencil` of `pencil_square`.                               |
| `edit_link`        | `false`   | Een link `Edit` in de voettekst die de kaarteditor opent (alleen beheerders). |
| `update_menu`      | `false`   | Toon de knop voor de dashboardbron (Check, Update, Reload) in de editor.      |
