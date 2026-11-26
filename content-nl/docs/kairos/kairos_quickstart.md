---
title: "Snelstart Kairos"
description: "Bereid Home Assistant voor en installeer de Kairos-kaart"
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

draft: false
weight: 7003

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Vereisten {#requirements}

- Home Assistant met de recorder (onderdeel van `default_config`).
- De
  [Nord Pool-integratie](https://www.home-assistant.io/integrations/nordpool/),
  ingesteld voor Nederland.
- Een templatesensor die de prijzen van de integratie omzet in de attributen die
  de kaart leest (stap 2 hieronder).
- De sensor **Current price** van de Nord Pool-integratie, met
  `state_class: measurement`, als `history_entity`. Gisteren en eerdere dagen,
  periodes en de kalender worden gelezen uit de recordergeschiedenis van deze
  sensor. Die geschiedenis groeit met de tijd: Home Assistant legt pas vast
  vanaf het moment dat de sensor bestaat, dus een nieuwe installatie heeft eerst
  geen geschiedenis. Vandaag en morgen werken meteen; eerdere dagen verschijnen
  dag voor dag.

## Home Assistant voorbereiden {#prepare-home-assistant}

### Stap 1: de Nord Pool-integratie installeren {#step-1-install-the-nord-pool-integration}

Voeg de
[Nord Pool-integratie](https://www.home-assistant.io/integrations/nordpool/) toe
via **Instellingen**, **Apparaten & diensten**, **Integratie toevoegen**. Kies
het gebied `NL` (Nederland) en de valuta `EUR`.

### Stap 2: de templatesensor maken {#step-2-create-the-template-sensor}

Maak `config/templates/nord-pool/the_netherlands_prices.yaml` met de inhoud
hieronder. De sensor ververst bij het opstarten, om 13:05 (als de prijzen van
morgen bekend worden) en elke 15 minuten. Hij rekent de prijzen om van EUR/MWh
naar EUR/kWh en stelt ze beschikbaar als de attributen `today` en `tomorrow`.

Vervang `<config_entry_id>` door de ID van je Nord Pool-item. Die vind je via
**Ontwikkelhulpmiddelen**, **Acties**: kies **Nord Pool: Get prices for date**
en schakel over naar de **YAML-modus**.

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

De sensor krijgt de entiteit-ID `sensor.nord_pool_the_netherlands_prices`, de
standaard `entity` van de kaart.

### Stap 3: de templates laden in `configuration.yaml` {#step-3-load-the-templates-in-configurationyaml}

Zorg dat `config/configuration.yaml` de map `templates` laadt. Deze regel voegt
elk templatebestand daarin samen, ook die in de submap `nord-pool`:

```yaml
template: !include_dir_merge_list templates
```

Zonder gesplitste configuratie neem je het bestand direct op:

```yaml
template: !include templates/nord-pool/the_netherlands_prices.yaml
```

Een complete `configuration.yaml` die de configuratie over mappen verdeelt, ziet
er zo uit:

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

Herstart daarna Home Assistant.

### Stap 4: de sensoren controleren {#step-4-check-the-sensors}

Open **Ontwikkelhulpmiddelen**, **Statussen**. De sensor
`sensor.nord_pool_the_netherlands_prices` moet de attributen `today` en
`tomorrow` hebben, elk een lijst van `{start, end, energy_price}`. Morgen blijft
leeg tot de prijzen bekend zijn. Noteer ook de entiteit-ID van de sensor
**Current price**; dat is de `history_entity` van de kaart. Die begint zonder
geschiedenis, dus dagen vóór de installatie blijven leeg.

## Installatie {#installation}

Installeer de kaart met de hand. Home Assistant bouwt aan een eigen marktplaats,
en de kaart verhuist daarheen zodra die klaar is.

1. Download `kairos_card.js` uit de
   [nieuwste release](https://github.com/homelab-alpha/kairos/releases) (archief
   met de broncode) en kopieer het naar `/config/www/`.
2. Voeg een dashboardbron `/local/kairos_card.js` toe van het type
   **JavaScript-module**.
3. Laad de browser opnieuw.

## De eerste kaart {#first-card}

Een minimale kaart:

```yaml
type: custom:kairos-card
entity: sensor.nord_pool_the_netherlands_prices
history_entity: sensor.nord_pool_the_netherlands_current_price
view: heatmap
day: today
```

Elke optie staat in de visuele editor. Zie de
[configuratie](/kairos/configuration/) voor alle opties.
