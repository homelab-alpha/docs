---
title: "cert.info"
description:
  "Het script dat elk server- en clientcertificaat uitgeeft, met een ECDSA- of
  RSA-sleutel, ondertekend door de tussenliggende certificaatautoriteit."
url: "openssl/script-info/cert"
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
  - Certificate Management
  - ECDSA
  - RSA
  - Bash
  - SSL/TLS
keywords:
  - OpenSSL script
  - Server certificate
  - Client certificate
  - Certificate issuance
  - Shell scripting

weight: 9102

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `cert.sh` bekijken. Dit script maakt een server- of
clientcertificaat met een ECDSA- of RSA-sleutel, ondertekend door de
tussenliggende certificaatautoriteit. De scripts `cert_ecdsa_server.sh`,
`cert_rsa_server.sh`, `cert_ecdsa_client.sh`, `cert_rsa_client.sh` en
`cert_ecdsa_localhost.sh` starten dit script met de bijbehorende opties.

Het script maakt de privésleutel, de certificaataanvraag (CSR) en het
extensiebestand in een tijdelijke map, geeft het certificaat uit en controleert
het tegen de CA-keten en de privésleutel. Pas daarna zet het de bestanden op hun
plek. Mislukt een stap, dan worden de bestaande sleutel en het bestaande
certificaat van de FQDN niet gewijzigd.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `cert.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 1.0.0
- **Beschrijving**: dit script maakt een server- of clientcertificaat met een
  ECDSA- of RSA-sleutel, ondertekend door de tussenliggende
  certificaatautoriteit.
- **RAW-script**: [cert.sh]

## Gebruik {#usage}

```bash
./cert.sh --algo <ecdsa|rsa> --role <server|client> [options]
```

| Optie                     | Betekenis                                                                                                                                                                                                                       |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--algo <ecdsa\|rsa>`     | Het type sleutel: ECDSA (secp384r1) of RSA (4096 bits).                                                                                                                                                                         |
| `--role <server\|client>` | Het soort certificaat.                                                                                                                                                                                                          |
| `--fqdn <fqdn>`           | Werk zonder vragen voor deze FQDN.                                                                                                                                                                                              |
| `--ip <list>`             | Alleen voor servers. Voeg een of meer IPv4-adressen toe aan de alternatieve namen, gescheiden door komma's (bijvoorbeeld 192.168.0.1,192.168.0.2). Een spatie na een komma mag. Mag vaker voorkomen. Alleen samen met `--fqdn`. |
| `--www`                   | Client only. Voeg ook `www.<fqdn>` toe aan de alternatieve namen (SAN's). A server certificate always has this name.                                                                                                            |
| `--localhost`             | Maak het certificaat voor localhost (localhost, `*.localhost` en 127.0.0.1). Alleen voor servers.                                                                                                                               |
| `--non-interactive`       | Met `--localhost`. Bewaard voor oudere commando's: het localhost-certificaat stelt nooit een vraag.                                                                                                                             |
| `--reuse-key`             | Gebruik de bestaande privésleutel van deze FQDN opnieuw in plaats van een nieuwe te maken. De sleutel moet bestaan.                                                                                                             |
| `-h`, `--help`            | Toon deze hulp.                                                                                                                                                                                                                 |

Zonder `--fqdn` vraagt het script om de gegevens.

## Afsluitcodes {#exit-codes}

| Afsluitcode | Betekenis                                                                    |
| :---------- | :--------------------------------------------------------------------------- |
| `0`         | Gelukt.                                                                      |
| `1`         | Een stap is mislukt. De bestaande bestanden van de FQDN zijn niet gewijzigd. |
| `2`         | Verkeerd gebruik of een fout bij de voorcontrole. Er is niets gewijzigd.     |

## Opmerkingen {#notes}

- De certificaten zijn voor een homelab en om te testen.
- Certificaten staan onder `$HOME/tls`.
- Een servercertificaat dekt de FQDN en `www.<fqdn>`. Bij een wildcard-FQDN,
  zoals `*.example.test`, dekt het de wildcard en het domein zelf
  (example.test), omdat de wildcard www.example.test al dekt en het domein zelf
  niet.
- Het serienummer is willekeurig (openssl ca `-rand_serial`). Het script wijzigt
  `db/serial` en `db/crlnumber` niet.
- Mislukt het script nadat het certificaat is uitgegeven, dan markeert het het
  nieuwe database-item als ingetrokken, zodat de volgende run niet wordt
  geblokkeerd.
- De Common Name is altijd de FQDN.
- Is de sleutel van de tussenliggende CA versleuteld, dan vraagt het script om
  de wachtwoordzin, of leest het die uit de omgevingsvariabele
  `TLS_CA_PASSPHRASE`.
- Het script wacht tot twee minuten op een ander certificaatscript, een
  vernieuwing of een intrekking die de database gebruikt.

## Uitgebreide uitleg {#detailed-explanation}

De secties hieronder volgen het script van boven naar beneden. Functies die hier
niet zijn gedefinieerd, zoals `print_error`, komen uit `scripts/lib/common.sh`.

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

### Functie: een lijst van IPv4-adressen met komma's omzetten naar alternatieve namen {#function-turn-a-comma-separated-list-of-ipv4-addresses-into-subject-alternative-name-entries}

Functie die een lijst van IPv4-adressen, gescheiden door komma's, omzet naar
items voor de alternatieve namen (bijvoorbeeld ", IP:192.168.0.1,
IP:192.168.0.2"). Spaties worden genegeerd en dubbele adressen verwijderd. Geeft
1 terug bij ongeldige invoer.

```bash
# Function to turn a comma-separated list of IPv4 addresses into subject
# alternative name entries (for example ", IP:192.168.0.1, IP:192.168.0.2").
# Spaces are ignored and duplicates are removed. Returns 1 for invalid input.
build_ip_san() {
  local list="${1// /}" ip octet san="" ips octets
  if [[ -z "$list" || "$list" == ,* || "$list" == *, || "$list" == *,,* ]]; then
    return 1
  fi
  IFS=',' read -r -a ips <<<"$list"
  for ip in "${ips[@]}"; do
    # Four decimal octets without leading zeros, each between 0 and 255
    [[ "$ip" =~ ^(0|[1-9][0-9]{0,2})(\.(0|[1-9][0-9]{0,2})){3}$ ]] || return 1
    IFS='.' read -r -a octets <<<"$ip"
    for octet in "${octets[@]}"; do
      ((octet <= 255)) || return 1
    done
    if [[ "$san, " != *", IP:$ip, "* ]]; then
      san+=", IP:$ip"
    fi
  done
  printf '%s' "$san"
}
```

### Functie: de tijdelijke map verwijderen {#function-remove-the-temporary-folder}

Functie die de tijdelijke map verwijdert. Ze draait vanuit de EXIT-trap.

```bash
# Function to remove the temporary folder. It runs from the EXIT trap.
# shellcheck disable=SC2329
cleanup() {
  # A certificate that was issued but not put in place must not stay valid in
  # the database: it would block the next run for this FQDN.
  if [[ "$issued" == "true" && "$installed" == "false" && -s "$new_cert" ]]; then
    if TLS_CA_PASSPHRASE_VALUE="$ca_passphrase" openssl ca -config "$config_file" ${ca_options[@]+"${ca_options[@]}"} \
      -revoke "$new_cert" -crl_reason cessationOfOperation >/dev/null 2>&1; then
      print_warning "The script failed after the certificate was issued. Its database entry is marked as revoked."
    else
      print_warning "The script failed after the certificate was issued, and its database entry could not be revoked. Revoke it with revoke_tls_certificates.sh."
    fi
  fi
  if [[ -n "$work_dir" && -d "$work_dir" ]]; then
    rm -rf "$work_dir"
  fi
}
```

### Gegevens van het certificaat {#certificate-information}

```bash
# Certificate information
algo=""
role=""
fqdn=""
ipv4=""
ip_list=""
add_www=false
localhost=false
non_interactive=false
reuse_key=false
work_dir=""
new_cert=""
issued=false
installed=false
install_status=0
ca_passphrase=""
ca_options=()
```

### Functie: argumenten verwerken {#function-parse-arguments}

```bash
# Function to parse arguments
parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    --algo)
      algo="${2:-}"
      shift
      [[ $# -eq 0 ]] || shift
      ;;
    --role)
      role="${2:-}"
      shift
      [[ $# -eq 0 ]] || shift
      ;;
    --fqdn)
      fqdn="${2:-}"
      [[ -n "$fqdn" ]] || {
        print_error "--fqdn needs a valid FQDN."
        exit 2
      }
      non_interactive=true
      shift 2
      ;;
    --ip)
      [[ -n "${2:-}" ]] || {
        print_error "--ip needs one or more IPv4 addresses, separated by commas."
        exit 2
      }
      ip_list+="${ip_list:+,}$2"
      shift 2
      # Without quotes, the shell splits "a, b" into separate arguments. Take the
      # next argument as well when the list so far ends with a comma, or when the
      # next argument starts with a comma.
      while [[ $# -gt 0 && "$1" != -* ]] && [[ "$ip_list" == *, || "$1" == ,* ]]; do
        ip_list+="$1"
        shift
      done
      ;;
    --www)
      add_www=true
      shift
      ;;
    --localhost)
      localhost=true
      shift
      ;;
    --non-interactive)
      non_interactive=true
      shift
      ;;
    --reuse-key)
      reuse_key=true
      shift
      ;;
    -h | --help)
      show_usage '^# Exit codes:'
      exit 0
      ;;
    *)
      print_error "Unknown option: $1"
      exit 2
      ;;
    esac
  done

  case "$algo" in
  ecdsa | rsa) ;;
  *)
    print_error "--algo needs ecdsa or rsa."
    exit 2
    ;;
  esac
  case "$role" in
  server | client) ;;
  *)
    print_error "--role needs server or client."
    exit 2
    ;;
  esac

  if [[ "$localhost" == "true" ]]; then
    if [[ "$role" != "server" || -n "$fqdn" || -n "$ip_list" ]]; then
      print_error "--localhost is a server certificate and cannot be used with --fqdn or --ip."
      exit 2
    fi
    fqdn="localhost"
    ipv4=", IP:127.0.0.1"
    return
  fi

  if [[ "$non_interactive" == "true" && -z "$fqdn" ]]; then
    print_error "--non-interactive can only be used together with --localhost."
    exit 2
  fi
  if [[ -n "$ip_list" && "$non_interactive" == "false" ]]; then
    print_error "--ip can only be used together with --fqdn."
    exit 2
  fi
  if [[ -n "$ip_list" && "$role" == "client" ]]; then
    print_error "--ip can only be used for a server certificate."
    exit 2
  fi
  if [[ "$add_www" == "true" && "$role" == "server" ]]; then
    print_error "--www is for a client certificate. A server certificate always has www.<fqdn>."
    exit 2
  fi
}

parse_arguments "$@"
require_openssl 2
```

### Alleen om de gegevens vragen als `--fqdn` niet is opgegeven {#ask-for-the-details-only-when---fqdn-is-not-given}

```bash
# Ask for the details only when --fqdn is not given
if [[ "$localhost" == "false" && "$non_interactive" == "false" ]]; then
  # Without input (end of file) the checks below report the empty value
  read -r -p "$(print_cyan "Enter the FQDN name of the new certificate: ")" fqdn || true
  if [[ "$role" == "server" ]]; then
    read -r -p "$(print_cyan "Enter the IPv4 addresses of the new certificate, separated by commas (empty for none): ")" ip_list || true
  fi
fi
```

### De FQDN wordt deel van bestandsnamen en van het extensiebestand {#the-fqdn-becomes-a-part-of-filenames-and-of-the-extension-file}

De FQDN wordt deel van bestandsnamen en van het extensiebestand, dus die wordt
in beide modi gecontroleerd.

```bash
# The FQDN becomes a part of file names and of the extension file, so it is
# checked in both modes.
if ! is_valid_fqdn "$fqdn"; then
  print_error "'$fqdn' is not a valid FQDN."
  echo "Use letters, digits, hyphens, and dots, for example server.example.test or *.example.test." >&2
  exit 2
fi
if [[ "$fqdn" == \*.* && "$add_www" == "true" ]]; then
  print_error "--www cannot be used with a wildcard FQDN."
  exit 2
fi
```

### De IPv4-adressen controleren en de alternatieve namen opbouwen {#validate-the-ipv4-addresses-and-build-the-subject-alternative-name-entries}

```bash
# Validate the IPv4 addresses and build the subject alternative name entries
if [[ -n "${ip_list// /}" ]]; then
  ipv4=$(build_ip_san "$ip_list") || {
    print_error "Invalid IPv4 address list: ${ip_list}"
    echo "Use IPv4 addresses without leading zeros, separated by commas (for example 192.168.0.1,192.168.0.2)." >&2
    exit 2
  }
fi
```

### De Common Name is altijd de FQDN {#the-common-name-is-always-the-fqdn}

De Common Name is altijd de FQDN, dus openssl req vraagt er niet om, en het
database-item, de bestandsnamen en de namen in het certificaat komen overeen.

```bash
# The Common Name is always the FQDN, so openssl req does not ask for it and
# the database entry, the file names, and the names in the certificate agree.
req_subject=(-subj "/CN=${fqdn}")
```

### De mappaden bepalen {#define-directory-paths}

```bash
# Define directory paths
print_section_header "Define directory paths"
set_base_dir
certs_dir="$base_dir/certs"
csr_dir="$base_dir/csr"
extfile_dir="$base_dir/extfiles"
private_dir="$base_dir/private"
db_dir="$base_dir/db"
config_file="$base_dir/openssl.cnf/cert.cnf"
certs_intermediate_dir="$certs_dir/intermediate"
certs_certificates_dir="$certs_dir/certificates"
private_certificates_dir="$private_dir/certificates"
ca_chain="$certs_intermediate_dir/ca_chain_bundle.pem"
key_file="$private_certificates_dir/${fqdn}.pem"

enter_home 2
```

### Controleren of alles aanwezig is, voordat er iets verandert {#check-that-everything-needed-is-present-before-anything-changes}

```bash
# Check that everything needed is present, before anything changes
missing=false
for file in "$config_file" "$ca_chain" "$private_dir/intermediate/ca.pem" "$db_dir/index.txt"; do
  if [[ ! -f "$file" ]]; then
    print_error "Required file not found: $file"
    missing=true
  fi
done
for dir in "$certs_certificates_dir" "$private_certificates_dir" "$csr_dir" "$extfile_dir"; do
  if [[ ! -d "$dir" ]]; then
    print_error "Directory not found: $dir"
    missing=true
  fi
done
[[ "$missing" == "false" ]] || exit 2
```

### Een ingetrokken tussenliggende CA mag geen certificaten uitgeven {#a-revoked-intermediate-ca-must-not-issue-certificates}

```bash
# A revoked intermediate CA must not issue certificates
ca_database=$(config_database "$base_dir/openssl.cnf/ca.cnf" 2>/dev/null) || ca_database=""
if [[ -n "$ca_database" ]] && entry_is_revoked "$ca_database" "$certs_intermediate_dir/ca.pem"; then
  print_error "The intermediate CA is revoked. Create it again with ca.sh --replace."
  exit 2
fi
```

### De sleutel van de tussenliggende CA kan versleuteld zijn (`ca.sh --passphrase`) {#the-key-of-the-intermediate-ca-can-be-encrypted-cash---passphrase}

```bash
# The key of the intermediate CA can be encrypted (ca.sh --passphrase)
ca_options=()
if key_is_encrypted "$private_dir/intermediate/ca.pem"; then
  get_passphrase ca_passphrase TLS_CA_PASSPHRASE "intermediate CA key" || exit 2
  ca_options=(-passin env:TLS_CA_PASSPHRASE_VALUE)
fi
```

### Twee scripts mogen de database niet tegelijk wijzigen {#two-scripts-must-not-change-the-database-at-the-same-time}

```bash
# Two scripts must not change the database at the same time
acquire_lock 2 120 "Another certificate script is still running. Try again later."
```

### Alleen geldige items (status V, het eerste veld) tellen {#only-valid-entries-status-v-the-first-field-count}

Alleen geldige items (status V, het eerste veld) tellen. Ingetrokken en
bijgewerkte (verlopen) items blokkeren een nieuw certificaat niet, net als bij
openssl ca.

```bash
# Only valid entries (status V, the first field) count. Revoked and updated
# (expired) entries do not block a new certificate, just like in openssl ca.
cn_exists=false
if awk -F'\t' -v cn="/CN=${fqdn}" '
  $1 == "V" && (substr($NF, length($NF) - length(cn) + 1) == cn || index($NF, cn "/")) { found = 1 }
  END { exit !found }' "$db_dir/index.txt"; then
  cn_exists=true
fi
```

### Is `unique_subject` aan en bestaat het certificaat al, dan een fout tonen en stoppen {#if-unique_subject-is-enabled-and-certificate-exists-display-an-error-and-exit}

```bash
# If unique_subject is enabled and Certificate exists, display an error and exit
if unique_subject_enabled "$db_dir/index.txt.attr" && [[ "$cn_exists" == "true" ]]; then
  print_error "unique_subject is enabled and a valid certificate with Common Name ${fqdn} already exists in index.txt."
  echo "Renew it with renew_tls_certificates.sh, or revoke it with revoke_tls_certificates.sh, and try again." >&2
  exit 2
fi
```

### De alternatieve namen van het certificaat {#the-subject-alternative-names-of-the-certificate}

```bash
# The subject alternative names of the certificate
if [[ "$localhost" == "true" ]]; then
  san_names="DNS:${fqdn}, DNS:*.${fqdn}"
elif [[ "$fqdn" == \*.* ]]; then
  # A wildcard already covers www.<domain>, and www.*.<domain> is not valid.
  # Add the domain itself instead, because a wildcard does not cover it.
  san_names="DNS:${fqdn}"
  [[ "$role" == "client" ]] || san_names+=", DNS:${fqdn#\*.}"
elif [[ "$role" == "server" || "$add_www" == "true" ]]; then
  san_names="DNS:${fqdn}, DNS:www.${fqdn}"
else
  san_names="DNS:${fqdn}"
fi
```

### De namen controleren tegen de naambeperkingen van de autoriteiten {#check-the-names-against-the-name-constraints-of-the-authorities}

Controleer de namen tegen de naambeperkingen van de autoriteiten, zodat een naam
die de clients zouden weigeren wordt gemeld voordat er iets wordt gemaakt.

```bash
# Check the names against the name constraints of the authorities, so a name
# that the clients would refuse is reported before anything is created
for authority in "$certs_intermediate_dir/ca.pem" "$certs_dir/root/root_ca.pem" "$certs_dir/root/trusted_id.pem"; do
  [[ -f "$authority" ]] || continue
  IFS=',' read -r -a san_list <<<"${san_names// /}${ipv4// /}"
  for san in "${san_list[@]}"; do
    if ! name_is_permitted "$san" "$authority"; then
      print_error "${san#*:} is outside the name constraints of $(basename "$authority" .pem). Permitted:"
      permitted_names "$authority" | sed 's/^/  /' >&2
      echo "Create the authority again with a wider --name-constraints list to add a name." >&2
      exit 2
    fi
  done
done

if [[ "$reuse_key" == "true" && ! -f "$key_file" ]]; then
  print_error "No existing key found for ${fqdn} to reuse."
  exit 2
fi
if [[ "$reuse_key" == "true" ]]; then
  # The key type must be the one that this script creates
  key_marker="modulus:"
  [[ "$algo" == "rsa" ]] || key_marker="ASN1 OID:"
  if ! openssl pkey -in "$key_file" -noout -text 2>/dev/null | grep -q "^${key_marker}"; then
    print_error "The existing key of ${fqdn} is not an ${algo^^} key. Use the script for that key type, or run without --reuse-key."
    exit 2
  fi
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
work_dir=$(umask 077 && mktemp -d "$base_dir/.cert.XXXXXX")
new_key="$work_dir/key.pem"
new_csr="$work_dir/csr.pem"
new_extfile="$work_dir/ext.cnf"
new_cert="$work_dir/cert.pem"
new_chain="$work_dir/chain_bundle.pem"
new_haproxy="$work_dir/haproxy.pem"
```

### De sleutel maken, of de bestaande sleutel hergebruiken met `--reuse-key` {#generate-the-key-or-reuse-the-existing-key-with---reuse-key}

```bash
# Generate the key, or reuse the existing key with --reuse-key
if [[ "$reuse_key" == "true" ]]; then
  print_section_header "Reuse existing key"
  cp -p "$key_file" "$new_key"
elif [[ "$algo" == "ecdsa" ]]; then
  print_section_header "Generate ECDSA key"
  (umask 077 && openssl ecparam -name secp384r1 -genkey -out "$new_key")
else
  print_section_header "Generate RSA key"
  (umask 077 && openssl genrsa -out "$new_key" 4096)
fi
chmod 600 "$new_key"
```

### Certificaataanvraag (CSR) maken {#generate-certificate-signing-request-csr}

```bash
# Generate Certificate Signing Request (CSR)
print_section_header "Generate Certificate Signing Request"
digest="sha384"
[[ "$algo" == "ecdsa" ]] || digest="sha256"
openssl req -new "-$digest" -config "$config_file" "${req_subject[@]}" -key "$new_key" -out "$new_csr"
```

### Een extensiebestand maken met alle alternatieve namen {#create-an-extfile-with-all-the-alternative-names}

```bash
# Create an extfile with all the alternative names
print_section_header "Create an extfile with all the alternative names"
if [[ "$role" == "server" ]]; then
  extended_key_usage="serverAuth"
  comment="OpenSSL Generated Server Certificate"
else
  extended_key_usage="clientAuth"
  comment="OpenSSL Generated Client Certificate"
fi
{
  echo "subjectAltName = ${san_names}${ipv4}"
  echo "basicConstraints = critical, CA:FALSE"
  echo "keyUsage = critical, digitalSignature"
  echo "extendedKeyUsage = ${extended_key_usage}"
  echo "nsComment = ${comment}"
} >"$new_extfile"
```

### Certificaat maken {#generate-certificate}

```bash
# Generate Certificate
print_section_header "Generate Certificate"
# From here the database can hold the new entry, also when the command is
# interrupted
issued=true
TLS_CA_PASSPHRASE_VALUE="$ca_passphrase" openssl ca -config "$config_file" ${ca_options[@]+"${ca_options[@]}"} \
  -rand_serial -notext -batch -in "$new_csr" -out "$new_cert" -extfile "$new_extfile"
```

### Ketenbundel van het certificaat maken {#create-certificate-chain-bundle}

```bash
# Create Certificate Chain Bundle
print_section_header "Create Certificate Chain Bundle"
cat "$new_cert" "$ca_chain" >"$new_chain"
```

### Ketenbundel van het certificaat maken voor HAProxy {#create-certificate-chain-bundle-for-haproxy}

Maak de ketenbundel van het certificaat voor HAProxy. Die bevat de privésleutel.

```bash
# Create Certificate Chain Bundle for HAProxy. It holds the private key.
if [[ "$role" == "server" ]]; then
  print_section_header "Create Certificate Chain Bundle for HAProxy"
  (umask 077 && cat "$new_chain" "$new_key" >"$new_haproxy")
fi
```

### Het certificaat controleren tegen de CA-keten en de privésleutel {#verify-the-certificate-against-the-ca-chain-and-the-private-key}

```bash
# Verify the certificate against the CA chain and the private key
print_section_header "Verify Certificate"
openssl verify -CAfile "$ca_chain" "$new_cert"
if [[ "$(openssl x509 -in "$new_cert" -noout -pubkey)" != "$(openssl pkey -in "$new_key" -pubout)" ]]; then
  print_error "The new certificate does not match the private key."
  exit 1
fi
echo "The certificate matches the private key."
```

### De bestanden op hun plek zetten {#put-the-files-in-place}

Zet de bestanden op hun plek. Alle bestanden worden eerst naast hun doel
gekopieerd en daarna hernoemd, zodat een fout geen mengsel van oude en nieuwe
bestanden achterlaat.

```bash
# Put the files in place. All files are copied next to their target first and
# then renamed, so a failure does not leave a mix of old and new files.
print_section_header "Install the files"
install_list=(
  "$new_key" "$private_certificates_dir/${fqdn}.key"
  "$new_csr" "$csr_dir/${fqdn}.pem"
  "$new_extfile" "$extfile_dir/${fqdn}.cnf"
  "$new_cert" "$certs_certificates_dir/${fqdn}.pem"
  "$new_cert" "$certs_certificates_dir/${fqdn}.crt"
  "$new_chain" "$certs_certificates_dir/${fqdn}_chain_bundle.pem"
  "$new_chain" "$certs_certificates_dir/${fqdn}_chain_bundle.crt"
)
if [[ "$reuse_key" == "false" ]]; then
  install_list+=("$new_key" "$key_file")
fi
if [[ "$role" == "server" ]]; then
  install_list+=("$new_haproxy" "$certs_certificates_dir/${fqdn}_haproxy.pem")
fi
install_files "${install_list[@]}" || install_status=$?
# After a failed rename the new files are partly in use, so the new database
# entry stays valid
[[ "$install_status" -eq 1 ]] || installed=true
[[ "$install_status" -eq 0 ]] || exit 1
echo
print_cyan "--> ${fqdn}.pem and ${fqdn}.crt"
print_cyan "--> ${fqdn}_chain_bundle.pem and ${fqdn}_chain_bundle.crt"
print_cyan "--> ${fqdn}.key"
if [[ "$role" == "server" ]]; then
  print_cyan "--> ${fqdn}_haproxy.pem"
fi
```

### Melding aan het einde van het script {#script-completion-message}

```bash
# Script completion message
echo
print_cyan "Certificate process successfully completed."

exit 0
```

## Conclusie {#conclusion}

Dit script maakt een server- of clientcertificaat met een ECDSA- of RSA-sleutel,
ondertekend door de tussenliggende certificaatautoriteit.

[cert.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert.sh
