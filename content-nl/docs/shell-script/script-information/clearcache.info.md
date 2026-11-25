---
title: "clearcache.info"
description:
  "Dit script verbetert de prestaties van een Linux-systeem door de caches van
  het bestandssysteem te legen en geheugen vrij te maken."
url: "shell-script/script-info/clearcache"
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
  - Shell Script
  - Linux
  - System Administration
  - Cache Management
  - Performance Optimization
  - Memory Management
keywords:
  - clear cache
  - Linux shell script
  - memory optimization
  - system performance
  - filesystem caches
  - slab objects
  - dentries
  - inodes
  - Homelab-Alpha

weight: 10204

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`clearcache.sh`, is geschreven door GJS (homelab-alpha) en leegt de schone
caches en de vrij te maken slab-objecten, zoals dentries en inodes, op een
Linux-systeem. Het script leegt de caches van het bestandssysteem, wat geheugen
kan vrijmaken en de prestaties kan verbeteren.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `clearcache.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 18 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script leegt de schone caches en de vrij te maken
  slab-objecten, zoals dentries en inodes.
- **RAW-script**: [clearcache.sh]

Het script leegt de caches van het systeem. Dat is vooral handig voor
systeembeheerders die hun Linux-systemen efficiënt willen laten draaien door
ongebruikt geheugen vrij te maken.

## Instellingen voor logging {#logging-configuration}

- **Logmap**: `$HOME/.bash_script`
- **Logbestand**: `$log_dir/clearcache_cron.log`

## Logfunctie {#logging-function}

`log_message()`: deze functie krijgt een melding als argument en schrijft die
met een tijdstempel naar het opgegeven logbestand.

```bash
log_message() {
  local log_timestamp
  log_timestamp=$(date +"%Y-%m-%d %T")
  echo "[$log_timestamp] $1" >>"$log_file"
}
```

## Begin van de log {#initial-logging}

Het script begint de log met een lege regel en een startmelding in het
logbestand.

```bash
echo "" >>"$log_file"
log_message "=== beginning of the log ==="
log_message "INFO: Script execution started."
```

## Controle op de rootgebruiker {#root-user-check}

Het script controleert of het als root of met sudo draait. Zo niet, dan logt het
een foutmelding en stopt het.

```bash
if [ "$EUID" -ne 0 ]; then
  log_message "ERROR: This script must be run as root or with sudo."
  log_message "=== end of the log ==="
  exit 1
fi
```

## De logmap maken {#log-directory-creation}

Het script controleert of de logmap bestaat. Zo niet, dan probeert het die te
maken en logt het het resultaat.

```bash
if [ ! -d "$log_dir" ]; then
  mkdir -p "$log_dir" || {
    log_message "ERROR: Unable to create log directory: $log_dir"
    log_message "=== end of the log ==="
    exit 1
  }
  log_message "INFO: Log directory created: $log_dir"
fi
```

## Het logbestand maken {#log-file-creation}

Het script controleert of het logbestand bestaat. Zo niet, dan probeert het dat
te maken en logt het het resultaat.

```bash
if [ ! -f "$log_file" ]; then
  touch "$log_file" || {
    log_message "ERROR: Unable to create log file: $log_file"
    log_message "=== end of the log ==="
    exit 1
  }
  log_message "INFO: Log file created: $log_file"
fi
```

## Het bestandssysteem synchroniseren {#file-system-synchronization}

Het script synchroniseert het bestandssysteem, zodat alle wijzigingen in de
buffer naar de schijf worden geschreven.

```bash
sync
```

## De caches legen {#clearing-caches}

Het script controleert of het bestand `/proc/sys/vm/drop_caches` bestaat. Zo ja,
dan schrijft het `1` naar dit bestand om de caches te legen en logt het het
resultaat.

```bash
if [ -e /proc/sys/vm/drop_caches ]; then
  echo 1 >/proc/sys/vm/drop_caches
  log_message "INFO: File system caches have been cleared."
else
  log_message "ERROR: File /proc/sys/vm/drop_caches does not exist. Cache clearing failed."
  log_message "=== end of the log ==="
  exit 1
fi
```

## Einde van de log {#completion-logging}

Het script logt dat het met succes is voltooid en sluit de log af.

```bash
log_message "INFO: Script execution completed successfully."
log_message "=== end of the log ==="
```

## Conclusie {#conclusion}

Het script `clearcache.sh` is een handig hulpmiddel voor beheerders van
Linux-systemen om geheugen vrij te maken door de caches van het bestandssysteem
te legen. Het logt uitgebreid, controleert de benodigde rechten en maakt de
logmap en het logbestand als die niet bestaan. Het script is bedoeld als
cronjob, zodat de caches automatisch op vaste momenten worden geleegd.

[clearcache.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/clearcache.sh
