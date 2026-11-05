---
title: "Kairos Quickstart"
description: "Prepare Home Assistant and Install the Kairos Card"
url: "kairos/quickstart"
aliases: ""
icon: "rocket_launch"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Kairos
series:
  - Kairos
tags:
  - kairos installation
  - home assistant
keywords:
  - Kairos quickstart
  - Kairos installation
  - Nord Pool integration
  - template sensor
  - Home Assistant dashboard resource
  - custom:kairos-card

draft: true
weight: 6502

toc: true
katex: true
---

<br />

{{% alert context="warning" %}}
**Caution** - This documentation is in progress
{{% /alert %}}

<br />

## Requirements

- Home Assistant with the recorder (included in `default_config`).
- The
  [Nord Pool integration](https://www.home-assistant.io/integrations/nordpool/),
  set up for the Netherlands.
- A template sensor that turns the integration prices into the attributes the
  card reads (step 2 below).
- The **Current price** sensor of the Nord Pool integration, with
  `state_class: measurement`, as `history_entity`. Yesterday and older days,
  ranges, and the calendar are read from the recorder history of this sensor.
  The history builds up over time: Home Assistant only records from the moment
  the sensor exists, so a new setup has no history at first. Today and tomorrow
  work immediately; earlier days appear day by day.

## Prepare Home Assistant

### Step 1: Install the Nord Pool integration

Add the
[Nord Pool integration](https://www.home-assistant.io/integrations/nordpool/) in
**Settings**, **Devices & services**, **Add integration**. Choose the area `NL`
(the Netherlands) and the currency `EUR`.

### Step 2: Create the template sensor

Create `config/templates/nord-pool/the_netherlands_prices.yaml` with the content
below. The sensor refreshes at startup, at 13:05 (when tomorrow's prices are
published), and every 15 minutes. It converts the prices from EUR/MWh to EUR/kWh
and exposes them as the attributes `today` and `tomorrow`.

Replace `<config_entry_id>` with the ID of your Nord Pool entry. To find it,
open **Developer tools**, **Actions**, choose **Nord Pool: Get prices for
date**, and switch to **YAML mode**.

<!-- prettier-ignore -->
```yaml
- triggers:
    - trigger: homeassistant
      event: start
    - trigger: time
      at: '13:05:00'
    - trigger: time_pattern
      minutes: /15

  actions:
    - variables:
        today_response: {}
        tomorrow_response: {}

    - action: nordpool.get_prices_for_date
      continue_on_error: true
      data:
        config_entry: <config_entry_id>
        areas: NL
        currency: EUR
        date: "{{ now().date() + timedelta(days=0) }}"
      response_variable: today_response

    - action: nordpool.get_prices_for_date
      continue_on_error: true
      data:
        config_entry: <config_entry_id>
        areas: NL
        currency: EUR
        date: "{{ now().date() + timedelta(days=1) }}"
      response_variable: tomorrow_response

    - variables:
        prices: >
          {% macro convert(response) %}
            {% set raw_prices = response.get('NL', []) if response is mapping else [] %}
            {% set ns = namespace(items=[]) %}
            {% for epex in raw_prices %}
              {% set raw = epex.price | float(0) / 1000 %}
              {% set ns.items = ns.items + [{
                'start': epex.start | string,
                'end': epex.end | string,
                'energy_price': raw | round(5),
              }] %}
            {% endfor %}
            {{ ns.items | tojson }}
          {% endmacro %}
          {{ {
            'today': convert(today_response) | from_json,
            'tomorrow': convert(tomorrow_response) | from_json,
          } }}

  sensor:
    - name: "Nord Pool - the Netherlands prices"
      unique_id: nord_pool_the_netherlands_prices
      state_class: measurement
      icon: mdi:cash-clock

      availability: "{{ prices is defined and prices.today | count > 0 }}"
      state: "{{ prices.today | map(attribute='energy_price') | min }}"
      attributes:
        today: "{{ prices.today }}"
        tomorrow: "{{ prices.tomorrow }}"
```

The sensor gets the entity ID `sensor.nord_pool_the_netherlands_prices`, which
is the default `entity` of the card.

### Step 3: Load the templates in `configuration.yaml`

Make sure `config/configuration.yaml` loads the `templates` folder. This line
merges every template file in it, including the subfolder `nord-pool`:

```yaml
template: !include_dir_merge_list templates
```

Without a split configuration, include the file directly instead:

```yaml
template: !include templates/nord-pool/the_netherlands_prices.yaml
```

A complete `configuration.yaml` that splits its configuration over folders looks
like this:

```yaml
default_config:

automation split: !include_dir_merge_list automations
binary_sensor split: !include_dir_merge_list binary_sensors
rest: !include_dir_merge_list rest
scene split: !include_dir_merge_list scenes
script split: !include_dir_merge_list scripts
sensor split: !include_dir_merge_list sensors
template: !include_dir_merge_list templates

automation: !include automations.yaml
binary_sensor: !include binary_sensors.yaml
scene: !include scenes.yaml
script: !include scripts.yaml
sensor: !include sensors.yaml
```

Restart Home Assistant afterwards.

### Step 4: Check the sensors

Open **Developer tools**, **States**. The sensor
`sensor.nord_pool_the_netherlands_prices` must have the attributes `today` and
`tomorrow`, each a list of `{start, end, energy_price}`. Tomorrow stays empty
until the prices are published. Also note the entity ID of the **Current price**
sensor; it is the `history_entity` of the card. It starts without history, so
days before the installation stay empty.

## Installation

Install the card by hand. Home Assistant is building its own marketplace, and
the card will move there when it is ready.

1. Download `kairos_card.js` from the
   [latest release](https://github.com/homelab-alpha/kairos/releases) (source
   code archive) and copy it to `/config/www/`.
2. Add a dashboard resource `/local/kairos_card.js` of the type **JavaScript
   module**.
3. Reload the browser.

<br />

## First Card

A minimal card:

```yaml
type: custom:kairos-card
entity: sensor.nord_pool_the_netherlands_prices
history_entity: sensor.nord_pool_the_netherlands_current_price
view: heatmap
day: today
```

Every option is available in the visual editor. See the
[configuration reference](/kairos/configuration/) for all options.
