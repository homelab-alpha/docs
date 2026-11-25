---
title: "trusted_id.info"
description:
  "Dit script maakt en beheert een vertrouwd rootcertificaat: veilige sleutels,
  het certificaat, controles en de omzetting van formaten."
url: "openssl/script-info/trusted-id"
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
  - OpenSSL
  - certificate
  - root certificate
  - security
keywords:
  - trusted root certificate
  - key generation
  - certificate creation
  - format conversion

weight: 9116

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `trusted_id.sh` bekijken. Dit script maakt de vertrouwde
identiteit: het zelfondertekende certificaat bovenaan de keten. Het maakt een
ECDSA-sleutel die met een wachtwoordzin is versleuteld, maakt het
zelfondertekende certificaat, controleert het en controleert de privésleutel. De
bestanden worden pas op hun plaats gezet als alle controles zijn geslaagd. Een
bestaande sleutel en een bestaand certificaat worden eerst naar het archief
gekopieerd.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `trusted_id.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 3.0.0
- **Beschrijving**: dit script maakt de vertrouwde identiteit: het
  zelfondertekende certificaat bovenaan de keten.
- **RAW-script**: [trusted_id.sh]

## Gebruik {#usage}

```bash
./trusted_id.sh [--no-passphrase] [--name-constraints <list>] [--replace [--yes]] [-h|--help]
```

| Optie                       | Betekenis                                                                                                                                                                                                                                                                                                                                                                                                     |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--no-passphrase`           | Versleutel de privésleutel niet. Iedereen die het bestand kan lezen, kan dan certificaten ondertekenen.                                                                                                                                                                                                                                                                                                       |
| `--name-constraints <list>` | Beperk de namen waarvoor deze autoriteit, en elke autoriteit eronder, mag ondertekenen. De lijst is gescheiden door komma's: `DNS:<domain>` (het domein en de subdomeinen) en `IP:<IPv4 network>/<prefix>`. Bijvoorbeeld "DNS:example.test, DNS:localhost, `IP:192.168.0.0/16`". Een spatie na een komma mag, met of zonder de aanhalingstekens. Kan worden herhaald. Zonder deze optie is er geen beperking. |
| `--replace`                 | Maak de vertrouwde identiteit opnieuw als die bestaat. De oude sleutel en het oude certificaat worden naar het archief gekopieerd. Zonder deze optie wordt een bestaande vertrouwde identiteit nooit gewijzigd.                                                                                                                                                                                               |
| `--yes`                     | Met `--replace`. Vraag niet om bevestiging.                                                                                                                                                                                                                                                                                                                                                                   |
| `-h`, `--help`              | Toon deze hulp.                                                                                                                                                                                                                                                                                                                                                                                               |

De alias is `new-trusted-id`.

Zonder `--no-passphrase` vraagt het script om een nieuwe wachtwoordzin, of leest
het die uit de omgevingsvariabele `TLS_TRUSTED_ID_PASSPHRASE`.

## Opmerkingen {#notes}

- De certificaten zijn voor een homelab en om te testen.
- Met `--name-constraints` weigeren clients een certificaat voor een naam buiten
  de lijst. Niet elke client past de beperking toe van een certificaat dat in
  zijn vertrouwde opslag staat, dus stel de optie ook in voor de root-CA. Noem
  de DNS-namen en de IP-netwerken: een soort dat niet in de lijst staat, wordt
  niet beperkt.
- Bewaar de wachtwoordzin. Zonder die kan de sleutel geen nieuwe root-CA
  ondertekenen.
- Als de vertrouwde identiteit wordt overschreven, zijn een nieuwe root-CA, een
  nieuwe tussenliggende CA en nieuwe certificaten nodig.
- De oude bestanden worden eerst naar `$HOME/tls/archive/_ca/trusted_id/`
  gekopieerd.

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
source "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/../lib/common.sh"
```

### Functie: de tijdelijke map verwijderen {#function-remove-the-temporary-folder}

Functie die de tijdelijke map verwijdert. Ze draait vanuit de EXIT-trap.

```bash
# Function to remove the temporary folder. It runs from the EXIT trap.
# shellcheck disable=SC2329
cleanup() {
  if [[ -n "$work_dir" && -d "$work_dir" ]]; then
    rm -rf "$work_dir"
  fi
}

use_passphrase=true
work_dir=""
new_cert=""
replace=false
assume_yes=false
name_constraints_list=""
key_passphrase=""
```

### De opties verwerken {#parse-the-options}

```bash
while [[ $# -gt 0 ]]; do
  case "$1" in
  --no-passphrase)
    use_passphrase=false
    shift
    ;;
  --replace)
    replace=true
    shift
    ;;
  --yes)
    assume_yes=true
    shift
    ;;
  --name-constraints)
    [[ -n "${2:-}" ]] || {
      print_error "--name-constraints needs a list, for example \"DNS:example.test, IP:192.168.0.0/16\"."
      exit 2
    }
    name_constraints_list+="${name_constraints_list:+,}$2"
    shift 2
    # Without quotes, the shell splits "a, b" into separate arguments. Take the
    # next argument as well when the list so far ends with a comma, or when the
    # next argument starts with a comma.
    while [[ $# -gt 0 && "$1" != -* ]] && [[ "$name_constraints_list" == *, || "$1" == ,* ]]; do
      name_constraints_list+="$1"
      shift
    done
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
```

### De toegestane namen controleren en de waarde van de extensie opbouwen {#validate-the-permitted-names-and-build-the-value-of-the-extension}

```bash
# Validate the permitted names and build the value of the extension
name_constraints=""
if [[ -n "$name_constraints_list" ]]; then
  name_constraints=$(build_name_constraints "$name_constraints_list") || {
    print_error "Invalid --name-constraints list: $name_constraints_list"
    echo "Use DNS:<domain> and IP:<IPv4 network>/<prefix>, separated by commas (for example \"DNS:example.test, IP:192.168.0.0/16\")." >&2
    exit 2
  }
fi

require_openssl 2
```

### De mappaden bepalen {#define-directory-paths}

```bash
# Define directory paths
print_section_header "Define directory paths"
set_base_dir
certs_root_dir="$base_dir/certs/root"
private_root_dir="$base_dir/private/root"
config_file="$base_dir/openssl.cnf/trusted_id.cnf"
key_file="$private_root_dir/trusted_id.pem"
cert_file="$certs_root_dir/trusted_id.pem"

enter_home 2
```

### Controleren of alles aanwezig is, voordat er iets verandert {#check-that-everything-needed-is-present-before-anything-changes}

```bash
# Check that everything needed is present, before anything changes
if [[ ! -f "$config_file" || ! -d "$certs_root_dir" || ! -d "$private_root_dir" ]]; then
  print_error "The directory structure in $base_dir is not complete. Run tls_directory_setup.sh first."
  exit 2
fi
```

### Een bestaande vertrouwde identiteit wordt alleen vervangen met `--replace` {#an-existing-trusted-identity-is-only-replaced-with---replace}

```bash
# An existing trusted identity is only replaced with --replace
if [[ -f "$cert_file" ]]; then
  if [[ "$replace" == "false" ]]; then
    print_error "Trusted ID already exists. Use --replace to create it again."
    exit 2
  fi

  print_section_header "WARNING: Overwriting Trusted ID"
  print_warning "Trusted ID already exists and will be OVERWRITTEN!"
  print_warning "This action will require REGENERATING THE ROOT CA, ALL SUB-CA CERTIFICATES, AND ALL ISSUED CERTIFICATES!"
  print_warning "If you continue, all issued certificates will become INVALID!"
  if [[ "$assume_yes" == "false" ]] && ! confirm; then
    echo "[INFO] Operation aborted by user." >&2
    exit 1
  fi
fi
```

### Om de wachtwoordzin van de nieuwe sleutel vragen {#ask-for-the-passphrase-of-the-new-key}

```bash
# Ask for the passphrase of the new key
key_options=()
pass_options=()
if [[ "$use_passphrase" == "true" ]]; then
  get_passphrase key_passphrase TLS_TRUSTED_ID_PASSPHRASE "new trusted identity key" new || exit 2
  key_options=(-aes-256-cbc -pass env:TLS_KEY_PASSPHRASE)
  pass_options=(-passin env:TLS_KEY_PASSPHRASE)
else
  print_warning "The private key of the trusted identity is not encrypted."
fi
```

### Werken in een tijdelijke map die alleen de eigenaar kan lezen {#work-in-a-temporary-folder-that-only-the-owner-can-read}

Werk in een tijdelijke map die alleen de eigenaar kan lezen. De traps worden
eerst ingesteld, zodat een onderbreking direct na het maken van de map die map
toch verwijdert.

```bash
# Work in a temporary folder that only the owner can read. The traps are set
# first, so an interrupt right after the folder is created still removes it.
trap cleanup EXIT
trap 'exit 1' INT TERM
work_dir=$(umask 077 && mktemp -d "$base_dir/.trusted_id.XXXXXX")
new_key="$work_dir/key.pem"
new_cert="$work_dir/cert.pem"
```

### ECDSA-sleutel maken {#generate-ecdsa-key}

```bash
# Generate ECDSA key
print_section_header "Generate ECDSA key"
(umask 077 && TLS_KEY_PASSPHRASE="$key_passphrase" openssl genpkey -algorithm EC \
  -pkeyopt ec_paramgen_curve:P-384 -pkeyopt ec_param_enc:named_curve \
  ${key_options[@]+"${key_options[@]}"} -out "$new_key")
```

### Het zelfondertekende certificaat maken {#generate-the-self-signed-certificate}

```bash
# Generate the self-signed certificate
print_section_header "Generate Trusted ID Certificate"
# With --name-constraints the extension is added to a copy of the configuration
# file. The file in $HOME/tls/openssl.cnf is not changed.
sign_config="$config_file"
if [[ -n "$name_constraints" ]]; then
  if grep -Eq '^[[:space:]]*nameConstraints[[:space:]]*=' "$config_file"; then
    print_error "$config_file already sets nameConstraints. Remove that line, or run without --name-constraints."
    exit 2
  fi
  sign_config="$work_dir/sign.cnf"
  config_with_extension "$config_file" "v3_ca" "nameConstraints = $name_constraints" "$sign_config" || {
    print_error "The section [ v3_ca ] was not found in $config_file."
    exit 2
  }
  echo "Name constraints: $name_constraints"
fi

TLS_KEY_PASSPHRASE="$key_passphrase" openssl req -new -x509 -sha384 -config "$sign_config" -extensions v3_ca \
  -key "$new_key" ${pass_options[@]+"${pass_options[@]}"} -days 10956 -out "$new_cert"
```

### Certificaatcontroles uitvoeren {#perform-certificate-verifications}

```bash
# Perform certificate verifications
print_section_header "Verify Certificate"
openssl verify -CAfile "$new_cert" "$new_cert"
```

### Privésleutel controleren {#check-private-key}

```bash
# Check Private Key.
print_section_header "Check Private Key"
TLS_KEY_PASSPHRASE="$key_passphrase" openssl pkey -in "$new_key" ${pass_options[@]+"${pass_options[@]}"} -noout -check
if [[ "$(openssl x509 -in "$new_cert" -noout -pubkey)" != \
"$(TLS_KEY_PASSPHRASE="$key_passphrase" openssl pkey -in "$new_key" ${pass_options[@]+"${pass_options[@]}"} -pubout)" ]]; then
  print_error "The certificate does not match the private key."
  exit 1
fi
echo "The certificate matches the private key."
```

### Certificaat controleren {#check-certificate}

```bash
# Check Certificate.
print_section_header "Check Certificate"
openssl x509 -in "$new_cert" -text -noout
```

### De bestanden op hun plaats zetten, na een kopie van de bestaande bestanden {#put-the-files-in-place-after-a-copy-of-the-existing-files}

Zet de bestanden op hun plaats, na een kopie van de bestaande bestanden. Alle
bestanden worden eerst naast hun doel gekopieerd en daarna hernoemd, zodat een
fout geen mix van oude en nieuwe bestanden achterlaat.

```bash
# Put the files in place, after a copy of the existing files. All files are
# copied next to their target first and then renamed, so a failure does not
# leave a mix of old and new files.
print_section_header "Install the files"
archive_files "_ca/trusted_id" "$key_file" "$cert_file" "$certs_root_dir/trusted_id.crt"
install_files \
  "$new_key" "$key_file" \
  "$new_cert" "$cert_file" \
  "$new_cert" "$certs_root_dir/trusted_id.crt" || exit 1
echo
print_cyan "--> trusted_id.pem and trusted_id.crt"
```

### Melding aan het einde van het script {#script-completion-message}

```bash
# Script completion message
echo
print_cyan "Trusted ID Certificate Authority process successfully completed."

exit 0
```

## Conclusie {#conclusion}

Dit script maakt de vertrouwde identiteit: het zelfondertekende certificaat
bovenaan de keten.

[trusted_id.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate-authority/trusted_id.sh
