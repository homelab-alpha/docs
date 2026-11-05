---
title: "Kairos Overview"
description:
  "Get Acquainted with Kairos, a Home Assistant Lovelace Card for Day-Ahead
  Electricity Prices"
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

draft: true
weight: 6501

toc: true
katex: true
---

<br />

{{% alert context="warning" %}}
**Caution** - This documentation is in progress
{{% /alert %}}

<br />

## Description

**Kairos** shows day-ahead electricity prices in Home Assistant as a price
chart, a heatmap, or a cost breakdown. It is a single JavaScript file with no
dependencies, built with Shadow DOM and hand-written SVG, and it follows the
Apple Human Interface Guidelines for layout, type, and touch targets.

The name comes from the Greek _kairos_ (καιρός), the right moment. The card
shows when electricity is cheapest, so you can charge your EV or your home
battery at the right moment, for a better price.

The card currently reads the Nord Pool integration (Netherlands) with 15-minute
prices. Support for more sources, such as ENTSO-E, is planned.

<br />

## Features

- **Three views** — Price, Heatmap, and Breakdown (off-peak, peak, off-peak),
  with bar or line charts.
- **Navigation** — Step through days, jump to a week, month, quarter, or year,
  or pick any period in the calendar, also across months.
- **Resolution** — 15 minutes, hours, days, weeks, or months, depending on the
  period; the editor only offers the options that apply.
- **History** — Past days and ranges come from the recorder statistics of a
  history sensor.
- **Zoom** — Mouse wheel, drag, and keys on desktop; double tap and two-finger
  pan on iPhone and iPad. Each is a separate option.
- **Responsive** — Compact, regular, large, and kiosk layouts; light and dark
  mode; works on phones, tablets, and wall displays.
- **Visual editor** — All options in grouped sections, with validation.
- **Languages** — English and Dutch, in the card and in the visual editor.

<br />

## Screenshots

These screenshots show the card in Home Assistant, with prices from the Nord
Pool integration. The card supports both light and dark mode; the screenshots
use dark mode.

### Desktop

<details>
  <summary>Desktop views (click to expand)</summary>

Price view:

![Price view on desktop](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_desktop_price.png)

Heatmap view:

![Heatmap view on desktop](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_desktop_heatmap.png)

Breakdown view:

![Breakdown view on desktop](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_desktop_breakdown.png)

Period and calendar menu:

![Calendar on desktop](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_desktop_calendar.png)

</details>

### Kiosk

<details>
  <summary>Kiosk views (click to expand)</summary>

Price view:

![Price view in kiosk mode](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_kiosk_price.png)

Heatmap view:

![Heatmap view in kiosk mode](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_kiosk_heatmap.png)

Breakdown view:

![Breakdown view in kiosk mode](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_kiosk_breakdown.png)

Period and calendar menu:

![Calendar in kiosk mode](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_kiosk_calendar.png)

</details>

### Smartphone

<details>
  <summary>Smartphone views (click to expand)</summary>

Price view:

![Price view on a smartphone](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_smartphone_price.png)

Heatmap view:

![Heatmap view on a smartphone](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_smartphone_heatmap.png)

Breakdown view:

![Breakdown view on a smartphone](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_smartphone_breakdown.png)

Period and calendar menu:

![Calendar on a smartphone](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_smartphone_calendar.png)

</details>

### Visual editor

<details>
  <summary>Editor sections (click to expand)</summary>

![Editor: entities and header](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_1_entity_header.png)

![Editor: data, view, prices, and VAT](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_2_data_prices.png)

![Editor: units, formatting, and highlights](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_3_units_highlights.png)

![Editor: chart elements](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_4_chart_elements.png)

![Editor: summary sections and controls](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_5_summary_controls.png)

![Editor: opacity and appearance](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_6_opacity_appearance.png)

![Editor: kiosk and experimental](https://raw.githubusercontent.com/homelab-alpha/kairos/main/docs/images/screenshot_editor_7_kiosk_experimental.png)

</details>

<br />

## Project Status

{{% alert context="warning" %}}
**Status:** Alpha

This project is under **active development**. Options and behavior can change
between versions without a migration path.
{{% /alert %}}

{{% alert context="primary" %}}
Contributions are not accepted for now. When release v1.0.0 is published,
contributions are very welcome.
{{% /alert %}}

Verified so far: the card in Chromium with a mocked Home Assistant, and the code
of version 0.1.0 on real devices, reported by the maintainer. See the
[project status](https://github.com/homelab-alpha/kairos/blob/main/docs/project_status.md)
in the repository for the current state and open items.

<br />

## Getting Started

See the [quickstart guide](/kairos/quickstart/) to prepare Home Assistant and
install the card, and the [configuration reference](/kairos/configuration/) for
every option.

<br />

## Contributions to Homelab-Alpha - Kairos

Contributions are not accepted for now. When release v1.0.0 is published,
contributions are very welcome. See [contribute] for the guidelines, the branch
names, the commit messages, and the review process.

<br />

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE] and
[NOTICE] files in the repository for the full license text and the attribution
requirements.

[contribute]: /contributing/contribute/
[LICENSE]: https://github.com/homelab-alpha/kairos/blob/main/LICENSE
[NOTICE]: https://github.com/homelab-alpha/kairos/blob/main/NOTICE
