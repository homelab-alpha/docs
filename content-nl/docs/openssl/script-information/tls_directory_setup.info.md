---
title: "tls_directory_setup.info"
description:
  "Zet de mappen voor TLS-certificaatbeheer op, maakt willekeurige serienummers
  en maakt de benodigde OpenSSL-configuratiebestanden voor een
  root-certificaatautoriteit (CA) en een time-stamping authority (TSA)."
url: "openssl/script-info/tls-directory-setup"
aliases:
  - "openssl/script-info/ssl-directory-setup"
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
  - OpenSSL
  - TLS Certificates
  - Script
  - Security
  - Automation
keywords:
  - TLS setup
  - OpenSSL script
  - Certificate management
  - Root CA
  - TSA configuration
  - Security automation
  - OpenSSL configuration

weight: 9114

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `tls_directory_setup.sh` bekijken. Dit script zet de
mapstructuur voor TLS-certificaatbeheer op in `$HOME/tls`. Het maakt de
databasebestanden en kopieert de OpenSSL-configuratiebestanden uit de
repository.

Het script kan veilig opnieuw worden uitgevoerd: het maakt wat ontbreekt en
wijzigt geen bestand dat al bestaat. De databasebestanden (`index.txt`,
`index.txt.attr`, serial en crlnumber) en de configuratiebestanden in
`$HOME/tls/openssl.cnf` blijven zoals ze zijn.

Elke autoriteit heeft een eigen database, zodat een CRL en de controle
`unique_subject` alleen de certificaten omvatten die de autoriteit zelf heeft
uitgegeven:

```text
$HOME/tls/db/trusted_id/  the root CA, issued by the trusted identity
$HOME/tls/db/root_ca/     the intermediate CA, issued by the root CA
$HOME/tls/db/             the certificates, issued by the intermediate CA
```

Oudere versies gebruikten `$HOME/tls/db/` voor alle drie. Als de
configuratiebestanden de nieuwe databases noemen (na `--update-config`),
verplaatst het script de items van de root-CA en de tussenliggende CA naar hun
eigen database. Eerst wordt een kopie van `index.txt` bewaard in
`$HOME/tls/archive/_database/`.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `tls_directory_setup.sh`
- **Oude naam**: `ssl_directory_setup.sh` (een wrapper die dit script start)
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 3.0.0
- **Beschrijving**: dit script zet de mapstructuur voor TLS-certificaatbeheer op
  in `$HOME/tls`.
- **RAW-script**: [tls_directory_setup.sh]

## Gebruik {#usage}

```bash
./tls_directory_setup.sh [--update-config] [--fix-permissions] [-h|--help]
```

| Optie               | Betekenis                                                                                                                                                            |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--update-config`   | Vervang de configuratiebestanden in `$HOME/tls/openssl.cnf` die afwijken van de repository. Elk vervangen bestand wordt eerst bewaard met de extensie `.bak-<date>`. |
| `--fix-permissions` | Zet modus 700 op bestaande mappen voor privésleutels. Zonder deze optie waarschuwt het script alleen voor een ruimere modus, omdat een dienst ervan kan afhangen.    |
| `-h`, `--help`      | Toon deze hulp.                                                                                                                                                      |

De alias is `new-tls-directory-setup`.

## Opmerkingen {#notes}

- Zorg dat OpenSSL is geïnstalleerd voordat je het script uitvoert.
- De configuratiebestanden worden gelezen uit de map `openssl.cnf` van de
  repository waarin dit script staat.
- De mappen voor privésleutels krijgen modus 700 als het script ze maakt.
- De certificaten zijn voor een homelab en om te testen.

## Uitgebreide uitleg {#detailed-explanation}

De onderstaande secties volgen het script van boven naar beneden. Functies die
hier niet zijn gedefinieerd, zoals `print_error`, komen uit
`scripts/lib/common.sh`.

### Het script stoppen bij een fout {#stop-script-on-error}

```bash
# Stop script on error
set -Eeuo pipefail
```

### De gedeelde functies laden {#load-the-shared-functions}

De gedeelde functies, zoals de meldingen en de controles, staan in
`scripts/lib/common.sh`.

```bash
# shellcheck source=scripts/lib/common.sh
source "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/lib/common.sh"
```

### De opties verwerken {#parse-the-options}

```bash
update_config=false
fix_permissions=false
while [[ $# -gt 0 ]]; do
  case "$1" in
  --update-config)
    update_config=true
    shift
    ;;
  --fix-permissions)
    fix_permissions=true
    shift
    ;;
  -h | --help)
    show_usage '^# Notes:'
    exit 0
    ;;
  *)
    print_error "Unknown option: $1"
    exit 2
    ;;
  esac
done

require_openssl
```

### De basismap instellen {#set-base-directory}

```bash
# Set base directory
base_dir="$HOME/tls"
# Do not create a second, empty directory while the old one exists.
if [[ ! -e "$base_dir" && -d "$HOME/ssl" ]]; then
  print_error "The old directory $HOME/ssl exists. Run tls_directory_migrate.sh to move it to $HOME/tls."
  exit 1
fi
certs_dir="$base_dir/certs"
private_dir="$base_dir/private"
db_dir="$base_dir/db"
openssl_conf_dir="$base_dir/openssl.cnf"
tsa_dir="$base_dir/tsa"
source_conf_dir="$(dirname "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")")/openssl.cnf"
```

### Functie: een bestand met de opgegeven inhoud maken als het niet bestaat {#function-create-a-file-with-the-given-content-when-it-does-not-exist}

```bash
# Function to create a file with the given content when it does not exist
create_if_missing() {
  local file="$1" content="$2"
  if [[ -e "$file" ]]; then
    echo "Kept:    $file"
  else
    printf '%s\n' "$content" >"$file"
    echo "Created: $file"
  fi
}
```

### Functie: het item van een autoriteitscertificaat uit de gedeelde database verplaatsen {#function-move-the-database-entry-of-an-authority-certificate-from-the-shared-database}

Functie die het item van een autoriteitscertificaat verplaatst van de gedeelde
database (`$db_dir/index.txt`) naar de database die het configuratiebestand
noemt. De kopie van het certificaat in newcerts gaat mee.

Gebruik: `move_authority_entry <configuration file> <certificate>`

```bash
# Function to move the database entry of an authority certificate from the
# shared database ($db_dir/index.txt) to the database that its configuration
# file names. The certificate copy in newcerts moves with it.
# Usage: move_authority_entry <configuration file> <certificate>
move_authority_entry() {
  local config="$1" cert="$2" shared="$db_dir/index.txt" target serial line backup_dir newcerts_dir
  [[ -f "$config" && -f "$cert" && -f "$shared" ]] || return 0
  target=$(config_database "$config") || return 0
  [[ "$target" != "$shared" && -f "$target" ]] || return 0
  serial=$(openssl x509 -in "$cert" -noout -serial 2>/dev/null) || return 0
  serial="${serial#serial=}"
  line=$(awk -F'\t' -v s="$serial" 'toupper($4) == toupper(s)' "$shared")
  [[ -n "$line" ]] || return 0
  if awk -F'\t' -v s="$serial" 'toupper($4) == toupper(s) { found = 1 } END { exit !found }' "$target"; then
    return 0
  fi

  if [[ "$moved" == "false" ]]; then
    # Do not change the database during a renewal or a revocation
    if command -v flock >/dev/null 2>&1; then
      exec 9>"$base_dir/.renew.lock"
      flock -n 9 || {
        print_error "A renewal or revocation is running. Try again later."
        return 1
      }
    fi
    backup_dir="$base_dir/archive/_database"
    (umask 077 && mkdir -p "$backup_dir" &&
      cp -p "$shared" "$backup_dir/index.txt.$(date -u +%Y%m%dT%H%M%SZ)") || {
      print_error "Cannot save a copy of $shared. Nothing was moved."
      return 1
    }
  fi
  printf '%s\n' "$line" >>"$target" || return 1
  awk -F'\t' -v s="$serial" 'toupper($4) != toupper(s)' "$shared" >"$shared.tmp" || return 1
  mv -f "$shared.tmp" "$shared" || return 1
  newcerts_dir="$base_dir/newcerts/$(basename "$(dirname "$target")")"
  if [[ -f "$base_dir/newcerts/$serial.pem" && -d "$newcerts_dir" ]]; then
    mv -f "$base_dir/newcerts/$serial.pem" "$newcerts_dir/$serial.pem" || return 1
  fi
  moved=true
  echo "Moved:   entry $serial of $(basename "$cert") to $target"
}
```

### Mapstructuur maken {#create-directory-structure}

Mapstructuur maken. Mappen voor privésleutels zijn alleen voor de eigenaar.

```bash
# Create directory structure. Private key folders are for the owner only.
print_section_header "Creating directory structure"
for dir in "$private_dir" "$tsa_dir/private"; do
  if [[ ! -d "$dir" ]]; then
    mkdir -p "$dir"
    chmod 700 "$dir"
  elif [[ "$(stat -c %a "$dir")" != "700" ]]; then
    if [[ "$fix_permissions" == "true" ]]; then
      chmod 700 "$dir"
      echo "Changed: $dir now has mode 700"
    else
      print_warning "$dir has mode $(stat -c %a "$dir"), so other users can list it. Use --fix-permissions to set mode 700."
    fi
  fi
done
mkdir -p "$certs_dir"/{root,intermediate,certificates} \
  "$base_dir/crl" \
  "$base_dir/crl-backup" \
  "$base_dir/csr" \
  "$base_dir/extfiles" \
  "$base_dir/newcerts" \
  "$base_dir/newcerts"/{trusted_id,root_ca} \
  "$private_dir"/{root,intermediate,certificates} \
  "$db_dir"/{trusted_id,root_ca} \
  "$base_dir/log" \
  "$openssl_conf_dir" \
  "$tsa_dir"/{certs,db}
```

### De db-bestanden maken {#create-the-db-files}

De db-bestanden maken. Bestaande bestanden blijven staan: een nieuw serie- of
CRL-nummer zou de volgorde van de gebruikte nummers verstoren.

```bash
# Create the db files. Existing files are kept: a new serial or CRL number
# would break the order of the numbers that are in use.
print_section_header "Creating db files"
for dir in "$db_dir" "$db_dir/trusted_id" "$db_dir/root_ca" "$tsa_dir/db"; do
  if [[ -e "$dir/index.txt" ]]; then
    echo "Kept:    $dir/index.txt"
  else
    : >"$dir/index.txt"
    echo "Created: $dir/index.txt"
  fi
  create_if_missing "$dir/index.txt.attr" "unique_subject = yes"
  create_if_missing "$dir/serial" "$(openssl rand -hex 16)"
  create_if_missing "$dir/crlnumber" "1000"
done
```

### OpenSSL-configuratiebestanden naar de doelmap kopiëren {#copy-openssl-configuration-files-to-the-target-directory}

```bash
# Copy OpenSSL configuration files to the target directory
print_section_header "Copying OpenSSL configuration files"
if [[ -d "$source_conf_dir" ]]; then
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  for file in "$source_conf_dir"/*.cnf; do
    [[ -f "$file" ]] || continue
    target="$openssl_conf_dir/$(basename "$file")"
    if [[ ! -e "$target" ]]; then
      cp "$file" "$target"
      echo "Created: $target"
    elif cmp -s "$file" "$target"; then
      echo "Kept:    $target"
    elif [[ "$update_config" == "true" ]]; then
      cp -p "$target" "$target.bak-$stamp"
      cp "$file" "$target"
      echo "Updated: $target (the old file is $target.bak-$stamp)"
    else
      echo "Kept:    $target (differs from the repository; use --update-config to replace it)"
    fi
  done
else
  print_warning "OpenSSL configuration directory not found at $source_conf_dir."
  echo "Skipping OpenSSL configuration files copy."
fi
```

### De items van de autoriteiten uit de gedeelde database van een oudere versie verplaatsen {#move-the-entries-of-the-authorities-out-of-the-shared-database-of-an-older-version}

De items van de autoriteiten uit de gedeelde database van een oudere versie
verplaatsen. Bij een nieuwe installatie gebeurt er niets, en ook niet zolang de
configuratiebestanden nog de gedeelde database noemen.

```bash
# Move the entries of the authorities out of the shared database of an older
# version. Nothing happens on a new setup, or while the configuration files
# still name the shared database.
print_section_header "Checking the databases of the authorities"
moved=false
move_authority_entry "$openssl_conf_dir/root_ca.cnf" "$certs_dir/root/root_ca.pem" || exit 1
move_authority_entry "$openssl_conf_dir/ca.cnf" "$certs_dir/intermediate/ca.pem" || exit 1
[[ "$moved" == "true" ]] || echo "Nothing to move."
```

### Melding aan het einde van het script {#script-completion-message}

```bash
# Script completion message
echo
print_cyan "TLS directory setup completed successfully."
```

## Conclusie {#conclusion}

Dit script zet de mapstructuur voor TLS-certificaatbeheer op in `$HOME/tls`.

[tls_directory_setup.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/tls_directory_setup.sh
