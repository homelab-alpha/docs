---
title: "tls_directory_migrate.info"
description:
  "Verplaats de oude map ~/ssl naar ~/tls, laat een symbolische koppeling achter
  en wijzig het oude pad in de OpenSSL-configuratiebestanden."
url: "openssl/script-info/tls-directory-migrate"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - OpenSSL
series:
  - Script Information
tags:
  - directory migration
  - OpenSSL scripts
  - certificate management
  - backward compatibility
  - TLS
keywords:
  - migrate ssl to tls
  - OpenSSL directory migration
  - symbolic link
  - backward compatibility
  - homelab certificates

weight: 9113

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `tls_directory_migrate.sh` bekijken. Dit script verplaatst
de oude map `$HOME/ssl` naar `$HOME/tls` en laat een symbolische koppeling
`$HOME/ssl ->` tls achter, zodat oude paden (cronjobs, systemd-units, hooks en
de configuratie van HAProxy of nginx) blijven werken. Het wijzigt ook het pad
`$HOME/ssl` in de OpenSSL-configuratiebestanden in `$HOME/tls/openssl.cnf` naar
`$HOME/tls`. Elk gewijzigd bestand wordt eerst bewaard met de extensie .pre-tls.

Het script verwijdert geen enkel bestand en wijzigt geen certificaat, sleutel of
database. Voer het één keer uit. Een tweede keer doet niets.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `tls_directory_migrate.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 1.1.0
- **Beschrijving**: dit script verplaatst de oude map `$HOME/ssl` naar
  `$HOME/tls` en laat een symbolische koppeling `$HOME/ssl ->` tls achter, zodat
  oude paden (cronjobs, systemd-units, hooks en de configuratie van HAProxy of
  nginx) blijven werken.
- **RAW-script**: [tls_directory_migrate.sh]

## Gebruik {#usage}

```bash
./tls_directory_migrate.sh [--dry-run] [-h|--help]
```

| Optie          | Betekenis                                           |
| :------------- | :-------------------------------------------------- |
| `--dry-run`    | Toon wat er zou gebeuren. Er wordt niets gewijzigd. |
| `-h`, `--help` | Toon deze hulp.                                     |

De alias is `openssl-migrate-tls`.

## Afsluitcodes {#exit-codes}

| Afsluitcode | Betekenis                                                               |
| :---------- | :---------------------------------------------------------------------- |
| `0`         | De map is verplaatst, of er is niets te verplaatsen.                    |
| `1`         | Het verplaatsen is mislukt.                                             |
| `2`         | Verkeerd gebruik, of zowel `$HOME/ssl` als `$HOME/tls` bestaat als map. |

## Opmerkingen {#notes}

- De certificaten zijn voor een homelab en om te testen.
- Verwijder de symbolische koppeling `$HOME/ssl` zelf als niets het oude pad
  meer gebruikt.

## Uitgebreide uitleg {#detailed-explanation}

De onderstaande secties volgen het script van boven naar beneden. Functies die
hier niet zijn gedefinieerd, zoals `print_error`, komen uit
`scripts/lib/common.sh`.

### Het script stoppen bij een fout {#stop-script-on-error}

Het script stoppen bij een fout. De functies hieronder geven bewust een status
terug, en de aanroepers bepalen wat een fout betekent.

```bash
# Stop script on error. The functions below return a status on purpose, and
# the callers decide what a failure means.
set -Eeuo pipefail
```

### De gedeelde functies laden {#load-the-shared-functions}

De gedeelde functies, zoals de meldingen en de controles, staan in
`scripts/lib/common.sh`.

```bash
# shellcheck source=scripts/lib/common.sh
source "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/lib/common.sh" || exit 2
```

### Functie: het gebruik tonen (uit de header van dit script) {#function-show-the-usage-from-the-header-of-this-script}

```bash
# Function to show the usage (from the header of this script)
show_help() {
  sed -n '/^# Usage:/,/^$/p' "$0" | sed 's/^# \{0,1\}//'
}
```

### Paden bepalen {#define-paths}

```bash
# Define paths
old_dir="$HOME/ssl"
new_dir="$HOME/tls"
```

### De argumenten verwerken {#parse-the-arguments}

```bash
# Parse the arguments
dry_run=false
while [[ $# -gt 0 ]]; do
  case "$1" in
  --dry-run)
    dry_run=true
    shift
    ;;
  -h | --help)
    show_help
    exit 0
    ;;
  *)
    print_error "Unknown option: $1"
    exit 2
    ;;
  esac
done
```

### Bepalen wat er moet gebeuren {#decide-what-to-do}

```bash
# Decide what to do
if [[ -L "$old_dir" ]]; then
  echo "Nothing to do: $old_dir is already a symbolic link."
  exit 0
fi

if [[ ! -d "$old_dir" ]]; then
  echo "Nothing to do: $old_dir does not exist."
  exit 0
fi

if [[ -e "$new_dir" ]]; then
  print_error "Both $old_dir and $new_dir exist. Check them and move or remove one yourself."
  exit 2
fi
```

### De configuratiebestanden met het oude pad opsommen {#list-the-configuration-files-that-contain-the-old-path}

```bash
# List the configuration files that contain the old path
config_files=()
for file in "$old_dir"/openssl.cnf/*.cnf; do
  [[ -f "$file" ]] || continue
  if grep -q 'HOME/ssl' "$file"; then
    config_files+=("$file")
  fi
done

print_cyan "=== Migration plan ==="
echo "Move:   $old_dir -> $new_dir"
echo "Link:   $old_dir -> tls"
echo "Config: ${#config_files[@]} file(s) with the path \$HOME/ssl are changed (a copy is saved as .pre-tls)."

if [[ "$dry_run" = true ]]; then
  echo "Dry run: nothing was changed."
  exit 0
fi
```

### De map niet verplaatsen tijdens een vernieuwing of intrekking {#do-not-move-the-directory-during-a-renewal-or-a-revocation}

```bash
# Do not move the directory during a renewal or a revocation.
if command -v flock >/dev/null 2>&1; then
  exec 9>"$old_dir/.renew.lock"
  flock -n 9 || {
    print_error "A renewal or revocation is running. Try again later."
    exit 2
  }
else
  print_warning "flock is not installed, so overlapping runs are not prevented."
fi

if ! mv "$old_dir" "$new_dir"; then
  print_error "Could not move $old_dir to $new_dir."
  exit 1
fi

if ! ln -s tls "$old_dir"; then
  print_error "Could not create the link $old_dir. Moving the directory back."
  mv "$new_dir" "$old_dir" || print_error "Could not move it back. The files are in $new_dir."
  exit 1
fi
```

### Het pad in de configuratiebestanden wijzigen, na een kopie {#change-the-path-in-the-configuration-files-after-a-copy}

```bash
# Change the path in the configuration files, after a copy
changed=0
for file in "${config_files[@]}"; do
  file="$new_dir/openssl.cnf/$(basename "$file")"
  if sed -i.pre-tls 's#HOME/ssl#HOME/tls#g' "$file"; then
    changed=$((changed + 1))
  else
    print_warning "Could not change $file. The link $old_dir keeps the old path working."
  fi
done

echo
print_cyan "Moved $old_dir to $new_dir. $changed configuration file(s) changed."
echo "The old path $old_dir is now a link to $new_dir. Remove it when nothing uses it."
```

## Conclusie {#conclusion}

Dit script verplaatst de oude map `$HOME/ssl` naar `$HOME/tls` en laat een
symbolische koppeling `$HOME/ssl ->` tls achter, zodat oude paden (cronjobs,
systemd-units, hooks en de configuratie van HAProxy of nginx) blijven werken.

[tls_directory_migrate.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/tls_directory_migrate.sh
