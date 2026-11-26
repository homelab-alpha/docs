---
title: "root_ca.info"
description:
  "Dit script zet een root-certificaatautoriteit op en beheert die: het maakt de
  sleutel en de CSR, geeft het certificaat uit en controleert het resultaat."
url: "openssl/script-info/root-ca"
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
  - Root Certificate Authority
  - Certificate Management
  - Security
keywords:
  - Root CA
  - Certificate Authority
  - Key Generation
  - CSR Creation
  - Certificate Issuance

weight: 9111

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `root_ca.sh` bekijken. Dit script maakt de
root-certificaatautoriteit (CA), ondertekend door de vertrouwde identiteit. Het
maakt een ECDSA-sleutel die met een wachtwoordzin is versleuteld, maakt de
Certificate Signing Request (CSR), geeft het certificaat uit, maakt de
ketenbundel en controleert het resultaat. De bestanden worden pas op hun plaats
gezet als alle controles zijn geslaagd. Een bestaande sleutel en een bestaand
certificaat worden eerst naar het archief gekopieerd.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `root_ca.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 3.0.0
- **Beschrijving**: dit script maakt de root-certificaatautoriteit (CA),
  ondertekend door de vertrouwde identiteit.
- **RAW-script**: [root_ca.sh]

## Gebruik {#usage}

```bash
./root_ca.sh [--no-passphrase] [--name-constraints <list>] [--replace [--yes]] [-h|--help]
```

| Optie                       | Betekenis                                                                                                                                                                                                                                                                                                                                                                                                     |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--no-passphrase`           | Versleutel de privésleutel niet. Iedereen die het bestand kan lezen, kan dan certificaten ondertekenen.                                                                                                                                                                                                                                                                                                       |
| `--name-constraints <list>` | Beperk de namen waarvoor deze autoriteit, en elke autoriteit eronder, mag ondertekenen. De lijst is gescheiden door komma's: `DNS:<domain>` (het domein en de subdomeinen) en `IP:<IPv4 network>/<prefix>`. Bijvoorbeeld "DNS:example.test, DNS:localhost, `IP:192.168.0.0/16`". Een spatie na een komma mag, met of zonder de aanhalingstekens. Kan worden herhaald. Zonder deze optie is er geen beperking. |
| `--replace`                 | Maak de autoriteit opnieuw als die bestaat. De oude sleutel en het oude certificaat worden naar het archief gekopieerd, en het oude item in de database wordt als vervangen gemarkeerd. Zonder deze optie wordt een bestaande autoriteit nooit gewijzigd.                                                                                                                                                     |
| `--yes`                     | Met `--replace`. Vraag niet om bevestiging.                                                                                                                                                                                                                                                                                                                                                                   |
| `-h`, `--help`              | Toon deze hulp.                                                                                                                                                                                                                                                                                                                                                                                               |

De alias is `new-root-ca`.

Zonder `--no-passphrase` vraagt het script om een nieuwe wachtwoordzin, of leest
het die uit de omgevingsvariabele `TLS_ROOT_CA_PASSPHRASE`. Is de sleutel van de
vertrouwde identiteit versleuteld, dan vraagt het script ook om die
wachtwoordzin, of leest het die uit `TLS_TRUSTED_ID_PASSPHRASE`.

## Opmerkingen {#notes}

- De certificaten zijn voor een homelab en om te testen.
- Met `--name-constraints` weigeren clients een certificaat voor een naam buiten
  de lijst. Noem de DNS-namen en de IP-netwerken: een soort dat niet in de lijst
  staat, wordt niet beperkt. Voeg DNS:localhost en `IP:127.0.0.0/8` toe als je
  het localhost-certificaat gebruikt. Maak de autoriteit opnieuw om de lijst te
  wijzigen.
- Bewaar de wachtwoordzin. Zonder die kan de sleutel geen nieuwe tussenliggende
  CA ondertekenen.
- Met `--replace` wordt het oude item in de database als vervangen gemarkeerd.
  Voer daarna `revoke_tls_certificates.sh --crl-only --authority root_ca` uit om
  het in de CRL te zetten.
- Als de root-CA wordt overschreven, zijn een nieuwe tussenliggende CA en nieuwe
  certificaten nodig.
- Het serienummer is willekeurig (openssl ca `-rand_serial`). Het script wijzigt
  het serial- en crlnumber-bestand niet.
- Het certificaat wordt vastgelegd in de database van de vertrouwde identiteit
  (`$HOME/tls/db/trusted_id/`), niet in de database van de certificaten.
- De oude bestanden worden eerst naar `$HOME/tls/archive/_ca/root_ca/`
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
  # A certificate that was issued but not put in place must not stay valid in
  # the database
  if [[ "$issued" == "true" && "$installed" == "false" && -s "$new_cert" ]]; then
    if revoke_entry "$new_cert" cessationOfOperation; then
      print_warning "The script failed after the certificate was issued. Its database entry is marked as revoked."
    else
      print_warning "The script failed after the certificate was issued, and its database entry could not be revoked. Revoke $new_cert by hand."
    fi
  fi
  restore_second_entry
  if [[ -n "$work_dir" && -d "$work_dir" ]]; then
    rm -rf "$work_dir"
  fi
}
```

### Functie: het item van een certificaat in de database als ingetrokken markeren {#function-mark-the-database-entry-of-a-certificate-as-revoked}

Functie die het item van een certificaat in de database als ingetrokken
markeert, met de sleutel van de autoriteit die het heeft ondertekend.

Gebruik: `revoke_entry <certificate> <reason>`

```bash
# Function to mark the database entry of a certificate as revoked, with the
# key of the authority that signed it
# Usage: revoke_entry <certificate> <reason>
revoke_entry() {
  TLS_SIGNER_PASSPHRASE="$signer_passphrase" openssl ca -config "$config_file" \
    ${signer_options[@]+"${signer_options[@]}"} -revoke "$1" -crl_reason "$2" >/dev/null 2>&1
}

use_passphrase=true
work_dir=""
new_cert=""
replace=false
assume_yes=false
replacing=false
issued=false
installed=false
install_status=0
old_cert=""
name_constraints_list=""
key_passphrase=""
signer_passphrase=""
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
certs_dir="$base_dir/certs"
csr_dir="$base_dir/csr"
config_file="$base_dir/openssl.cnf/root_ca.cnf"
certs_root_dir="$certs_dir/root"
key_file="$base_dir/private/root/root_ca.pem"
cert_file="$certs_root_dir/root_ca.pem"
signer_key="$base_dir/private/root/trusted_id.pem"
signer_cert="$certs_root_dir/trusted_id.pem"
parent_chain="$certs_root_dir/trusted_id.pem"

enter_home 2
```

### De database van de autoriteit die ondertekent, zoals genoemd in het configuratiebestand {#the-database-of-the-authority-that-signs-as-named-in-the-configuration-file}

```bash
# The database of the authority that signs, as named in the configuration file
database=$(config_database "$config_file") || {
  print_error "Cannot read the database path from $config_file. Run tls_directory_setup.sh first."
  exit 2
}
```

### Controleren of alles aanwezig is, voordat er iets verandert {#check-that-everything-needed-is-present-before-anything-changes}

```bash
# Check that everything needed is present, before anything changes
missing=false
for file in "$config_file" "$signer_key" "$signer_cert" "$parent_chain" "$database"; do
  if [[ ! -f "$file" ]]; then
    print_error "Required file not found: $file"
    missing=true
  fi
done
for dir in "$(dirname "$cert_file")" "$(dirname "$key_file")" "$csr_dir"; do
  if [[ ! -d "$dir" ]]; then
    print_error "Directory not found: $dir"
    missing=true
  fi
done
[[ "$missing" == "false" ]] || exit 2
```

### Een bestaande autoriteit wordt alleen vervangen met `--replace` {#an-existing-authority-is-only-replaced-with---replace}

```bash
# An existing authority is only replaced with --replace
if [[ -f "$cert_file" ]]; then
  if [[ "$replace" == "false" ]]; then
    print_error "Root Certificate Authority already exists. Use --replace to create it again."
    exit 2
  fi
  replacing=true

  print_section_header "WARNING: Overwriting Root Certificate Authority"
  print_warning "Root Certificate Authority already exists and will be OVERWRITTEN!"
  print_warning "This action will require REGENERATING ALL SUB-CA CERTIFICATES, AND ALL ISSUED CERTIFICATES!"
  print_warning "If you continue, all issued certificates will become INVALID!"
  if [[ "$assume_yes" == "false" ]] && ! confirm; then
    echo "[INFO] Operation aborted by user." >&2
    exit 1
  fi
fi
```

### Om de wachtwoordzinnen vragen: de sleutel die ondertekent en de nieuwe sleutel {#ask-for-the-passphrases-the-key-that-signs-and-the-new-key}

```bash
# Ask for the passphrases: the key that signs, and the new key
signer_options=()
if key_is_encrypted "$signer_key"; then
  get_passphrase signer_passphrase TLS_TRUSTED_ID_PASSPHRASE "trusted identity key" || exit 2
  signer_options=(-passin env:TLS_SIGNER_PASSPHRASE)
fi
key_options=()
pass_options=()
if [[ "$use_passphrase" == "true" ]]; then
  get_passphrase key_passphrase TLS_ROOT_CA_PASSPHRASE "new root CA key" new || exit 2
  key_options=(-aes-256-cbc -pass env:TLS_KEY_PASSPHRASE)
  pass_options=(-passin env:TLS_KEY_PASSPHRASE)
else
  print_warning "The private key of the root CA is not encrypted."
fi
```

### Twee scripts mogen de database niet tegelijk wijzigen {#two-scripts-must-not-change-the-database-at-the-same-time}

```bash
# Two scripts must not change the database at the same time
acquire_lock 2 120 "Another certificate script is still running. Try again later."
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
work_dir=$(umask 077 && mktemp -d "$base_dir/.root_ca.XXXXXX")
new_key="$work_dir/key.pem"
new_csr="$work_dir/csr.pem"
new_cert="$work_dir/cert.pem"
new_chain="$work_dir/chain_bundle.pem"
```

### Het oude certificaat is nog geldig in de database {#the-old-certificate-is-still-valid-in-the-database}

Het oude certificaat is nog geldig in de database. Bewaar een kopie om het later
als vervangen te markeren, en sta voor deze uitvoering een tweede item met
dezelfde naam toe.

```bash
# The old certificate is still valid in the database. Keep a copy to mark it as
# superseded later, and allow a second entry with the same name for this run.
if [[ "$replacing" == "true" ]]; then
  old_cert="$work_dir/old_cert.pem"
  cp -p "$cert_file" "$old_cert"
  allow_second_entry "$database.attr"
fi
```

### ECDSA-sleutel maken {#generate-ecdsa-key}

```bash
# Generate ECDSA key
print_section_header "Generate ECDSA key"
(umask 077 && TLS_KEY_PASSPHRASE="$key_passphrase" openssl genpkey -algorithm EC \
  -pkeyopt ec_paramgen_curve:P-384 -pkeyopt ec_param_enc:named_curve \
  ${key_options[@]+"${key_options[@]}"} -out "$new_key")
```

### Certificate Signing Request (CSR) maken {#generate-certificate-signing-request-csr}

```bash
# Generate Certificate Signing Request (CSR)
print_section_header "Generate Certificate Signing Request"
TLS_KEY_PASSPHRASE="$key_passphrase" openssl req -new -sha384 -config "$config_file" \
  -key "$new_key" ${pass_options[@]+"${pass_options[@]}"} -out "$new_csr"
```

### Root-certificaatautoriteit maken {#generate-root-certificate-authority}

```bash
# Generate Root Certificate Authority
print_section_header "Generate Root Certificate Authority"
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
```

### Vanaf hier kan de database het nieuwe item bevatten, ook als de opdracht wordt onderbroken {#from-here-the-database-can-hold-the-new-entry-also-when-the-command-is-interrupted}

```bash
# From here the database can hold the new entry, also when the command is
# interrupted
issued=true
TLS_SIGNER_PASSPHRASE="$signer_passphrase" openssl ca -config "$sign_config" -extensions v3_ca -rand_serial -notext -batch \
  ${signer_options[@]+"${signer_options[@]}"} -in "$new_csr" -days 7305 -out "$new_cert"
```

### Ketenbundel van de root-certificaatautoriteit maken {#create-root-certificate-authority-chain-bundle}

```bash
# Create Root Certificate Authority Chain Bundle
print_section_header "Create Root Certificate Authority Chain Bundle"
cat "$new_cert" "$parent_chain" >"$new_chain"
```

### Het certificaat controleren tegen de keten erboven en de privésleutel {#verify-the-certificate-against-the-chain-above-it-and-the-private-key}

```bash
# Verify the certificate against the chain above it and the private key
print_section_header "Verify Certificate"
openssl verify -CAfile "$parent_chain" "$new_cert"
if [[ "$(openssl x509 -in "$new_cert" -noout -pubkey)" != \
"$(TLS_KEY_PASSPHRASE="$key_passphrase" openssl pkey -in "$new_key" ${pass_options[@]+"${pass_options[@]}"} -pubout)" ]]; then
  print_error "The certificate does not match the private key."
  exit 1
fi
echo "The certificate matches the private key."
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
archive_files "_ca/root_ca" "$key_file" "$cert_file" "${cert_file%.pem}.crt" \
  "${cert_file%.pem}_chain_bundle.pem" "${cert_file%.pem}_chain_bundle.crt" "$csr_dir/root_ca.pem"
install_files \
  "$new_key" "$key_file" \
  "$new_csr" "$csr_dir/root_ca.pem" \
  "$new_cert" "$cert_file" \
  "$new_cert" "${cert_file%.pem}.crt" \
  "$new_chain" "${cert_file%.pem}_chain_bundle.pem" \
  "$new_chain" "${cert_file%.pem}_chain_bundle.crt" || install_status=$?
# After a failed rename the new files are partly in use, so the new database
# entry stays valid
[[ "$install_status" -eq 1 ]] || installed=true
[[ "$install_status" -eq 0 ]] || exit 1
```

### Het nieuwe certificaat is in gebruik, dus het oude item is vervangen {#the-new-certificate-is-in-use-so-the-old-entry-is-superseded}

```bash
# The new certificate is in use, so the old entry is superseded
if [[ "$replacing" == "true" ]] && entry_is_valid "$database" "$old_cert"; then
  if revoke_entry "$old_cert" superseded; then
    echo "The database entry of the old certificate is marked as superseded."
  else
    print_warning "Cannot mark the database entry of the old certificate as superseded."
  fi
fi
restore_second_entry
echo
print_cyan "--> root_ca.pem and root_ca.crt"
print_cyan "--> root_ca_chain_bundle.pem and root_ca_chain_bundle.crt"
```

### Melding aan het einde van het script {#script-completion-message}

```bash
# Script completion message
echo
print_cyan "Root Certificate Authority process successfully completed."

exit 0
```

## Conclusie {#conclusion}

Dit script maakt de root-certificaatautoriteit (CA), ondertekend door de
vertrouwde identiteit.

[root_ca.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate-authority/root_ca.sh
