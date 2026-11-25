---
title: "health_check.info"
description:
  "Een Bash-script dat controleert of een URL bereikbaar is via HTTP en HTTPS,
  met duidelijke uitvoer in kleur."
url: "shell-script/function-info/health-check"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Function Information
tags:
  - Shell Scripting
  - URL Monitoring
  - Health Check
  - Bash
  - Automation
keywords:
  - shell script
  - URL health check
  - HTTP check
  - HTTPS check
  - web service monitoring
  - bash scripting
  - URL availability
  - monitoring script

weight: 10105

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`health_check.sh`, is geschreven door GJS (homelab-alpha) en controleert of een
opgegeven URL bereikbaar is via HTTP en HTTPS.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `health_check.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 26 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script controleert of een opgegeven URL bereikbaar is
  via HTTP en HTTPS.
- **RAW-script**: [health_check.sh]

Het script definieert de functie `health-check`, die controleert of de URL
bereikbaar is. Laten we het script regel voor regel bekijken.

## Definitie van de functie {#function-definition}

```bash
function health-check() {
  green="\e[32m"
  red="\e[31m"
  end="\e[0m"
```

Hier wordt de functie `health-check` gedefinieerd. Drie variabelen, `green`,
`red` en `end`, krijgen escapecodes voor gekleurde uitvoer in de terminal (groen
bij succes, rood bij een fout, en terug naar de standaardkleur).

## Controle op een URL als argument {#checking-for-url-argument}

```bash
  if [ -z "$1" ]; then
    echo "Please provide a URL to check."
    return 1
  fi
```

Dit blok controleert of je een URL als argument hebt opgegeven. Zo niet, dan
vraagt het om een URL en geeft het afsluitstatus 1 terug, wat een fout aangeeft.

## URL en protocollen {#url-and-protocols}

```bash
  url="$1"

  protocols=("https" "http")
```

De opgegeven URL wordt toegewezen aan de variabele `url`. De array `protocols`
bevat de tekenreeksen `"https"` en `"http"`.

## De protocollen doorlopen {#loop-through-protocols}

```bash
  for protocol in "${protocols[@]}"; do
    if curl --head --silent --show-error --fail --location "$protocol://$url"; then
      echo -e "$protocol://$url is ${green}UP${end} and running."
      return 0
    fi
  done
```

Het script doorloopt elk protocol in de array `protocols`. Per protocol stuurt
het met `curl` een HEAD-verzoek naar de URL, met deze opties:

- `--head`: haalt alleen de headers op.
- `--silent`: stille modus, met minder uitvoer.
- `--show-error`: toont fouten als die optreden.
- `--fail`: faalt stil (zonder uitvoer) bij HTTP-fouten.
- `--location`: volgt doorverwijzingen.

Lukt het `curl`-commando (de URL is bereikbaar), dan meldt het in groen dat de
URL UP is en geeft het afsluitstatus 0 terug, wat succes aangeeft.

## Als beide protocollen mislukken {#if-both-protocols-fail}

```bash
  echo -e "Both https://$url and http://$url are ${red}DOWN${end}"
  return 1
}
```

Zijn zowel de HTTP- als de HTTPS-versie van de URL niet bereikbaar, dan meldt
het script in rood dat beide DOWN zijn en geeft het afsluitstatus 1 terug.

## Conclusie {#conclusion}

Het script `health_check.sh` is een eenvoudig Bash-script dat controleert of een
URL bereikbaar is via HTTP en HTTPS. Het toont duidelijke meldingen in kleur of
de URL bereikbaar is of niet. Met `curl` en de juiste opties controleert het de
URL efficiënt. Het script is handig voor een snelle controle van webdiensten.

[health_check.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/health_check.sh
