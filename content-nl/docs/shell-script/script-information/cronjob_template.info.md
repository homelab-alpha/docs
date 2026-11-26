---
title: "cronjob_template.info"
description:
  "Een sjabloonscript voor een cronjob die pings voor de controle van de
  systeemgezondheid naar een monitoringserver stuurt."
url: "shell-script/script-info/cronjob-template"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Script Information
tags:
  - cron job
  - system monitoring
  - shell script
  - automation
  - server health check
keywords:
  - cron job template
  - system health check script
  - automate server monitoring
  - ping monitoring server
  - cron job example

weight: 10205

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`cronjob_template.sh`, is geschreven door GJS (homelab-alpha) en is een sjabloon
voor een cronjob die een ping naar een monitoringserver stuurt als controle van
de systeemgezondheid.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `cronjob_template.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 28 oktober 2026
- **Versie**: 1.0.2
- **Beschrijving**: dit script is een sjabloon voor een cronjob die een ping
  naar een monitoringserver stuurt om de systeemgezondheid te controleren.
- **Gebruik**: voer het script met rootrechten uit via `sudo`.
- **RAW-script**: [cronjob_template.sh]

## Header van het script {#script-header}

De header bevat gegevens zoals de bestandsnaam, de auteur, de datum, de versie
en een korte beschrijving van wat het script doet.

## Gebruiksinstructies {#usage-instructions}

Het script bevat gebruiksinstructies. Daarin staat dat `curl` geïnstalleerd moet
zijn en dat het script met rootrechten moet draaien. Er staat ook een voorbeeld
in van een cronjob die het script op vaste momenten uitvoert.

## Voorbeeld van een cronjob {#cron-job-example}

Het script bevat een sjabloon voor een cronjob. Dit voorbeeld voert het script
elke 3 uur uit, van 07:00 tot 23:00:

```sh
10 07-23/3 * * * /bin/bash /path/to/.bash-script/cronjob_template.sh
```

## Logfuncties {#logging-functions}

Een aantal functies schrijft meldingen naar een bestand:

- **`log_message()`**: logt een gewone melding met een tijdstempel.
- **`log_verbose()`**: logt uitgebreide meldingen als de vlag voor uitgebreide
  uitvoer is gezet.
- **`log_debug()`**: logt debugmeldingen als de debugvlag is gezet.
- **`log_warning()`**: logt waarschuwingen.

## Pingfunctie {#ping-function}

De functie **`send_ping_to_monitor_server()`** stuurt een ping naar de
monitoringserver:

- Eerst probeert ze een ping te sturen zonder een zelfondertekend certificaat.
- Mislukt dat, dan probeert ze het opnieuw met een opgegeven certificaat.
- De antwoorden van de server worden gelogd om te kunnen debuggen.

## Hoofdprogramma {#main-program}

Het hoofddeel van het script regelt:

## Opties op de opdrachtregel {#command-line-options}

Het script verwerkt de opties op de opdrachtregel om uitgebreide logging en
debuglogging aan te zetten:

```sh
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -v | --verbose)
      verbose="true"
      shift
      ;;
    -d | --debug)
      debug="true"
      shift
      ;;
    *)
      shift
      ;;
  esac
done
```

## De logmap en het logbestand instellen {#log-directory-and-file-setup}

Het script stelt de paden voor de logmap en het logbestand in:

```sh
log_dir="$HOME/.bash-script"
log_file="$log_dir/cronjob_template_cron.log"
```

## URL van de monitoringserver en certificaat {#monitoring-server-url-and-certificate}

Het stelt de URL van de monitoringserver en de naam van het certificaat in:

```sh
monitoring_server_url="<insert_url>"
cert_name="<insert_cert.crt>"
cert_file=""
```

De variabele `cert_file` vult het script later zelf in. Het script markeert die
als "DO NOT EDIT", omdat het script niet meer werkt als je die wijzigt.

## Begin van de log {#start-logging}

Het script begint een nieuw deel in de log met een lege regel en een markering,
en logt dat de uitvoering is begonnen:

```sh
echo "" >>"$log_file"
log_message "=== beginning of the log ==="
log_message "INFO: Script execution started."
```

## Controle op rootrechten {#root-privileges-check}

Het script controleert of het met rootrechten draait. Zo niet, dan logt het een
fout, sluit het het deel in de log af en stopt het:

```sh
if [ "$EUID" -ne 0 ]; then
  log_message "ERROR: This script must be run as root or with sudo."
  log_message "=== end of the log ==="
  exit 1
fi
```

## Pad naar het certificaatbestand {#certificate-file-path}

Het bepaalt het pad naar het certificaatbestand op basis van het
besturingssysteem:

```sh
if [ -f /usr/local/share/ca-certificates/$cert_name ]; then
  cert_file="/usr/local/share/ca-certificates/$cert_name"
elif [ -f /etc/pki/ca-trust/source/anchors/$cert_name ]; then
  cert_file="/etc/pki/ca-trust/source/anchors/$cert_name"
else
  log_message "ERROR: Certificate file not found for this operating system."
  log_message "=== end of the log ==="
  exit 1
fi
```

## De logmap en het logbestand maken {#log-directory-and-file-creation}

Het zorgt dat de logmap en het logbestand bestaan en maakt ze zo nodig. Kan de
map of het bestand niet worden gemaakt, dan logt het script een fout, sluit het
het deel in de log af en stopt het:

```sh
if [ ! -d "$log_dir" ]; then
  mkdir -p "$log_dir" || {
    log_message "ERROR: Unable to create log directory: $log_dir"
    log_message "=== end of the log ==="
    exit 1
  }
  log_message "INFO: Log directory created: $log_dir"
fi

if [ ! -f "$log_file" ]; then
  touch "$log_file" || {
    log_message "ERROR: Unable to create log file: $log_file"
    log_message "=== end of the log ==="
    exit 1
  }
  log_message "INFO: Log file created: $log_file"
fi
```

## De ping sturen {#sending-the-ping}

Tot slot stuurt het script een ping naar de monitoringserver en logt het het
resultaat:

```sh
send_ping_to_monitor_server
log_message "INFO: Script execution completed successfully."
log_message "=== end of the log ==="
```

## Conclusie {#conclusion}

Dit script is een degelijk sjabloon voor een cronjob die een ping voor de
controle van de systeemgezondheid naar een monitoringserver stuurt. Het logt
uitgebreid, handelt fouten af en past zich via opties op de opdrachtregel en het
certificaatbeheer aan verschillende omgevingen aan.

[cronjob_template.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/cronjob_template.sh
