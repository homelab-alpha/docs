---
title: "Kairos Configuration"
description: "Every Option of the Kairos Card, Grouped as in the Visual Editor"
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

draft: true
weight: 6503

toc: true
katex: true
---

<br />

{{% alert context="warning" %}}
**Caution** - This documentation is in progress
{{% /alert %}}

<br />

A minimal card:

```yaml
type: custom:kairos-card
entity: sensor.nord_pool_the_netherlands_prices
history_entity: sensor.nord_pool_the_netherlands_current_price
view: heatmap
day: today
```

Every option is available in the visual editor, in the same order as below.
Booleans are `true` or `false`. A wrong value shows a configuration error.

## Entities

| Option                 | Default                                          | Description                                                                       |
| :--------------------- | :----------------------------------------------- | :-------------------------------------------------------------------------------- |
| `entity`               | `sensor.nord_pool_the_netherlands_prices`        | Sensor with the `today` and `tomorrow` attributes (15-minute slots).              |
| `entities`             | none                                             | Fallback sensors; the first one that is usable wins.                              |
| `history_entity`       | `sensor.nord_pool_the_netherlands_current_price` | Sensor with the bare price in EUR/kWh. Feeds past days, ranges, and the calendar. |
| `history_quarter_days` | `7`                                              | Days back (0-10) that show quarter hours; older days show hourly averages.        |

## Header

| Option        | Default  | Description                                                                        |
| :------------ | :------- | :--------------------------------------------------------------------------------- |
| `source`      | `custom` | `custom`, `nord_pool`, or `entsoe`: the title and logo of the header.              |
| `show_header` | `true`   | Show the header.                                                                   |
| `title`       | empty    | Title for `source: custom`; `{day}` is the selected day. Empty uses the default.   |
| `icon`        | empty    | Icon for `source: custom`: an `mdi` icon such as `mdi:flash`, or `false` for none. |

The default titles are `Kairos` (`custom`, with the Kairos logo),
`Nord Pool · Day-Ahead Market`, and `ENTSO-E · Day-Ahead Market`. Only the
`custom` source uses your own `title` and `icon`; the other sources ignore them,
and the editor hides those two options. For now `source` only sets the title and
the logo; the card still reads the sensors you configure. Reading ENTSO-E data
is planned.

## Data and view

| Option                  | Default | Description                                                                                                                                                         |
| :---------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `day`                   | `today` | `today`, `tomorrow`, `yesterday`, `week`, `month`, `year`, `q1` to `q4`, or a date (`YYYY-MM-DD`).                                                                  |
| `auto_advance_tomorrow` | `false` | Switch to tomorrow when its prices are published.                                                                                                                   |
| `view`                  | `price` | `price`, `heatmap`, or `breakdown`.                                                                                                                                 |
| `period`                | `15min` | Follows `day`: a day offers `15min` and `hour`, a week `hour` and `day`, a month `day` and `week`, a year `week` and `month`, a quarter `day`, `week`, and `month`. |
| `chart_style`           | `bars`  | `auto`, `bars`, or `line`; `auto` picks by the available width.                                                                                                     |

## Prices and units

| Option             | Default   | Description                                                    |
| :----------------- | :-------- | :------------------------------------------------------------- |
| `vat`              | `true`    | Include VAT.                                                   |
| `vat_rate`         | `21`      | VAT rate in percent.                                           |
| `energy_tax`       | `0`       | Energy tax in EUR/kWh, before VAT.                             |
| `surcharge`        | `0`       | Supplier surcharge in EUR/kWh, before VAT.                     |
| `fixed_price`      | `0`       | Fixed rate in EUR/kWh, before VAT; 0 hides it.                 |
| `fixed_label`      | empty     | Energy company shown on the rate; empty uses the default name. |
| `unit`             | `auto`    | `auto`, `ct/kWh`, `EUR/kWh`, `SEK/kWh`, and so on.             |
| `decimals`         | automatic | Whole number from 0 to 6.                                      |
| `currency`         | `EUR`     | Currency code used for amounts.                                |
| `currency_display` | `symbol`  | `symbol` or `code`.                                            |
| `time_format`      | `24`      | `auto` (Home Assistant profile), `12`, or `24`.                |
| `axis_am_pm`       | `false`   | Show AM/PM on the time axis.                                   |
| `axis_minutes`     | `false`   | Show `00:00` instead of `00` on the time axis.                 |

## Highlights

| Option              | Default | Description                                                             |
| :------------------ | :------ | :---------------------------------------------------------------------- |
| `cheapest_quarters` | `10`    | Number of cheapest slots highlighted in the heatmap view.               |
| `best_window_hours` | `0`     | Highlight the cheapest contiguous window of this many hours (0 is off). |
| `price_bands`       | `auto`  | `auto` (percentiles), `[low, high]`, or `{ low, high }` as displayed.   |

## Chart

| Option                 | Default      | Description                                                                                |
| :--------------------- | :----------- | :----------------------------------------------------------------------------------------- |
| `show_chart`           | `true`       | Show the chart.                                                                            |
| `show_hour_grid`       | `true`       | Show the hour grid.                                                                        |
| `show_now_marker`      | `true`       | Show the marker for the current time.                                                      |
| `show_extremes`        | `false`      | Show the lowest and highest price labels.                                                  |
| `show_average_line`    | `false`      | Show the average line.                                                                     |
| `average_line_size`    | `medium`     | `small`, `medium`, or `large`.                                                             |
| `show_fixed_line`      | `false`      | Show the fixed rate line.                                                                  |
| `fixed_line_size`      | `medium`     | `small`, `medium`, or `large`.                                                             |
| `heat_gradient`        | `horizontal` | `horizontal` (one gradient over the chart height) or `vertical` (one solid color per bar). |
| `zoom_desktop`         | `false`      | Zoom on desktop and laptop: mouse wheel, drag to pan, and the `+`, `-`, and `0` keys.      |
| `zoom_touch`           | `false`      | Zoom on iPhone and iPad: double tap, and two fingers to pan.                               |
| `zoom_buttons_desktop` | `true`       | Show the reset, `-`, and `+` buttons on desktop and laptop.                                |
| `zoom_buttons_touch`   | `true`       | Show the reset button while zoomed on iPhone and iPad.                                     |

## Sections and controls

| Option                   | Default | Description                                                                  |
| :----------------------- | :------ | :--------------------------------------------------------------------------- |
| `show_stats`             | `true`  | Show the tiles.                                                              |
| `show_legend`            | `true`  | Show the legend and the cheapest summary.                                    |
| `show_controls`          | `true`  | Show the controls. The buttons below need this.                              |
| `show_day_button`        | `true`  | Day control.                                                                 |
| `show_period_button`     | `true`  | Period control.                                                              |
| `show_chart_type_button` | `true`  | Chart type control.                                                          |
| `show_price_button`      | `true`  | Price view button.                                                           |
| `show_heatmap_button`    | `true`  | Heatmap view button.                                                         |
| `show_breakdown_button`  | `true`  | Breakdown view button.                                                       |
| `show_cheapest_stepper`  | `false` | Stepper for the number of cheapest slots (heatmap view, today and tomorrow). |

## Opacity

Values from 0 to 100, for each view and chart type.

| Option                                                                 | Default |
| :--------------------------------------------------------------------- | :------ |
| `price_bar_opacity`, `heatmap_bar_opacity`, `breakdown_bar_opacity`    | `75`    |
| `price_line_opacity`, `heatmap_line_opacity`, `breakdown_line_opacity` | `60`    |

## Appearance

| Option                   | Default | Description                                                                          |
| :----------------------- | :------ | :----------------------------------------------------------------------------------- |
| `color_scheme`           | `auto`  | `auto`, `light`, or `dark`.                                                          |
| `display_mode_desktop`   | `auto`  | `auto`, `compact`, or `regular` on desktop and laptop. Auto is compact below 720 px. |
| `display_mode_touch`     | `auto`  | Same values, on tablet and smartphone.                                               |
| `kiosk`                  | `false` | Mark the card as a kiosk or wall display. It then uses `display_mode_kiosk`.         |
| `display_mode_kiosk`     | `auto`  | `auto`, `compact`, `regular`, `large`, or `kiosk`. Auto picks by the card width.     |
| `pixel_shift`            | `false` | Move the card slightly to prevent burn-in on wall displays.                          |
| `editor_expand_sections` | `true`  | Open every section of the visual editor.                                             |

## Experimental

These can stop working after a Home Assistant update.

| Option             | Default   | Description                                                                    |
| :----------------- | :-------- | :----------------------------------------------------------------------------- |
| `edit_button`      | `false`   | A header button that opens the card editor (administrators only).              |
| `edit_button_icon` | `sliders` | `sliders`, `gear`, `pencil`, or `pencil_square`.                               |
| `edit_link`        | `false`   | An `Edit` link in the footer that opens the card editor (administrators only). |
| `update_menu`      | `false`   | Show the Dashboard resource button (Check, Update, Reload) in the editor.      |
