---
title: "verify_tls_certificates.info"
description:
  "Een uitgebreide uitleg en een script om TLS-certificaten met OpenSSL te
  controleren, met een controle van de vertrouwensketen van de root tot de
  afzonderlijke certificaten."
url: "openssl/script-info/verify-tls-certificates"
aliases:
  - "openssl/script-info/verify-ssl-certificates"
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
  - TLS
  - Certificates
  - OpenSSL
  - Security
  - Verification
  - Scripting
  - Homelab
  - DevOps
keywords:
  - TLS verification
  - TLS verification
  - OpenSSL script
  - certificate chain of trust
  - verify certificates
  - OpenSSL tutorial
  - TLS security
  - scripting with OpenSSL
  - homelab security
  - DevOps tools

weight: 9117

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `verify_tls_certificates.sh` bekijken. Dit script
controleert TLS-certificaten tegen hun vertrouwensketen:

- De vertrouwde identiteit tegen zichzelf.
- De root-certificaatautoriteit tegen de vertrouwde identiteit.
- De tussenliggende certificaatautoriteit tegen de rootketen.
- Een server- of clientcertificaat tegen de tussenliggende keten, en de
  ketenbundel en de HAProxy-bundel als die bestaan.

Het resultaat van elke controle komt uit de afsluitstatus van openssl verify.
Het script wijzigt nooit een bestand.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `verify_tls_certificates.sh`
- **Oude naam**: `verify_ssl_certificates.sh` (een wrapper die dit script start)
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 3.0.0
- **Beschrijving**: dit script controleert TLS-certificaten tegen hun
  vertrouwensketen.
- **RAW-script**: [verify_tls_certificates.sh]

## Gebruik {#usage}

```bash
./verify_tls_certificates.sh [-v|--verbose] [-h|--help] <certificate_name>
```

| Optie                | Betekenis                                                                                                                                                                               |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-v`, `--verbose`    | Toon de uitvoer van openssl verify bij elke controle.                                                                                                                                   |
| `-h`, `--help`       | Toon deze hulp.                                                                                                                                                                         |
| `<certificate_name>` | Het certificaat dat wordt gecontroleerd: `trusted_id.pem`, `root_ca.pem`, `ca.pem`, of de naam van een server- of clientcertificaat zonder extensie (bijvoorbeeld server.example.test). |

De alias is `openssl-verify`.

## Afsluitcodes {#exit-codes}

| Afsluitcode | Betekenis                                                            |
| :---------- | :------------------------------------------------------------------- |
| `0`         | Alle controles zijn geslaagd.                                        |
| `1`         | Een of meer controles zijn mislukt, of een bestand is niet gevonden. |
| `2`         | Verkeerd gebruik.                                                    |

## Voorbeeldgebruik {#example-usage}

- `./verify_tls_certificates.sh root_ca.pem` (controleert de
  root-certificaatautoriteit)
- `./verify_tls_certificates.sh -v ca.pem` (controleert het tussenliggende
  certificaat met uitgebreide uitvoer)

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

### De basismap instellen {#set-the-base-directory}

De basismap instellen. De oude naam `~/ssl` wordt gebruikt zolang `~/tls` niet
bestaat.

```bash
# Set the base directory. The old name ~/ssl is used while ~/tls does not exist.
set_base_dir
certs_dir="$base_dir/certs"
```

### Mappen voor de verschillende onderdelen instellen {#set-directories-for-various-components}

```bash
# Set directories for various components
certs_root_dir="$certs_dir/root"
certs_intermediate_dir="$certs_dir/intermediate"
certs_certificates_dir="$certs_dir/certificates"
```

### Standaard geen uitgebreide uitvoer {#default-to-non-verbose-mode}

```bash
# Default to non-verbose mode
verbose=false
file_name=""
failures=0
```

### Functie: een certificaat controleren tegen een ketenbestand {#function-verify-a-certificate-against-a-chain-file}

```bash
# Function to verify a certificate against a chain file
verify_certificate() {
  local title="$1" cert_path="$2" chain_path="$3" result status=0 file options=()

  print_section_header "$title"
  for file in "$cert_path" "$chain_path"; do
    if [[ ! -f "$file" ]]; then
      echo -e "$file: \033[31m[FAIL] - File not found\033[0m"
      failures=$((failures + 1))
      return
    fi
  done

  [[ "$verbose" == "false" ]] || options=(-show_chain)
  result=$(openssl verify ${options[@]+"${options[@]}"} -CAfile "$chain_path" "$cert_path" 2>&1) || status=$?

  if [[ "$status" -eq 0 ]]; then
    echo -e "$cert_path: \033[32m[PASS]\033[0m"
  else
    echo -e "$cert_path: \033[31m[FAIL]\033[0m"
    failures=$((failures + 1))
  fi

  # Show verbose output if enabled, and always for a failed check
  if [[ "$verbose" == "true" || "$status" -ne 0 ]]; then
    echo "$result"
  fi
}
```

### Functie: argumenten verwerken {#function-parse-arguments}

```bash
# Function to parse arguments
parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    -v | --verbose)
      verbose=true
      shift
      ;;
    -h | --help)
      show_usage '^# Example usage:'
      exit 0
      ;;
    -*)
      print_error "Unknown option: $1"
      exit 2
      ;;
    *)
      [[ -z "$file_name" ]] || {
        print_error "Give only one certificate name."
        exit 2
      }
      file_name="$1"
      shift
      ;;
    esac
  done

  # If no file name is provided, prompt the user for it
  if [[ -z "$file_name" ]]; then
    read -r -p "Enter the name of the certificate to verify: " file_name || true
  fi
  if [[ -z "$file_name" || "$file_name" == */* ]]; then
    print_error "'$file_name' is not a certificate name."
    exit 2
  fi
}
```

### Functie: controleren of een bundel een volledige keten bevat {#function-check-that-a-bundle-holds-a-complete-chain}

Functie die controleert of een bundel een volledige keten bevat: het certificaat
wordt gecontroleerd met alleen de vertrouwde identiteit als vertrouwensanker en
de certificaten van de bundel als de keten ertussen. openssl verify op de bundel
zelf zou alleen naar het eerste certificaat kijken.

```bash
# Function to check that a bundle holds a complete chain: the certificate is
# verified with only the trusted identity as trust anchor and the certificates
# of the bundle as the chain in between. openssl verify on the bundle itself
# would only look at its first certificate.
verify_bundle() {
  local title="$1" cert_path="$2" bundle_path="$3" anchor="$certs_root_dir/trusted_id.pem" result status=0 file

  print_section_header "$title"
  for file in "$cert_path" "$bundle_path" "$anchor"; do
    if [[ ! -f "$file" ]]; then
      echo -e "$file: \033[31m[FAIL] - File not found\033[0m"
      failures=$((failures + 1))
      return
    fi
  done

  result=$(openssl verify -CAfile "$anchor" -untrusted "$bundle_path" "$cert_path" 2>&1) || status=$?
  # The bundle must start with the certificate itself
  if [[ "$status" -eq 0 ]] && [[ "$(openssl x509 -in "$bundle_path" -noout -fingerprint -sha256 2>/dev/null)" != \
  "$(openssl x509 -in "$cert_path" -noout -fingerprint -sha256 2>/dev/null)" ]]; then
    status=1
    result="The bundle does not start with the certificate."
  fi

  if [[ "$status" -eq 0 ]]; then
    echo -e "$bundle_path: \033[32m[PASS]\033[0m"
  else
    echo -e "$bundle_path: \033[31m[FAIL]\033[0m"
    failures=$((failures + 1))
  fi
  if [[ "$verbose" == "true" || "$status" -ne 0 ]]; then
    echo "$result"
  fi
}
```

### Functie: controleren of de privésleutel in een HAProxy-bundel bij het certificaat hoort {#function-check-that-the-private-key-in-a-haproxy-bundle-belongs-to-the-certificate}

```bash
# Function to check that the private key in a HAProxy bundle belongs to the
# certificate
verify_bundle_key() {
  local title="$1" cert_path="$2" bundle_path="$3"

  print_section_header "$title"
  if [[ "$(openssl pkey -in "$bundle_path" -pubout 2>/dev/null)" == "$(openssl x509 -in "$cert_path" -noout -pubkey 2>/dev/null)" ]]; then
    echo -e "$bundle_path: \033[32m[PASS]\033[0m"
  else
    echo -e "$bundle_path: \033[31m[FAIL]\033[0m"
    echo "The private key in the bundle does not match the certificate, or the bundle cannot be read."
    failures=$((failures + 1))
  fi
}
```

### Functies om elk niveau van de keten te controleren {#functions-to-verify-each-level-of-the-chain}

```bash
# Functions to verify each level of the chain
verify_trusted_id() {
  verify_certificate "Verify Trusted Identity against Trusted Identity" \
    "$certs_root_dir/trusted_id.pem" "$certs_root_dir/trusted_id.pem"
}
```

### Functie: `verify_root_ca` {#function-verify_root_ca}

```bash
verify_root_ca() {
  verify_certificate "Verify Root Certificate Authority against Trusted Identity" \
    "$certs_root_dir/root_ca.pem" "$certs_root_dir/trusted_id.pem"
  verify_bundle "Verify the chain in the Root Certificate Authority Chain Bundle" \
    "$certs_root_dir/root_ca.pem" "$certs_root_dir/root_ca_chain_bundle.pem"
}
```

### Functie: `verify_intermediate_ca` {#function-verify_intermediate_ca}

```bash
verify_intermediate_ca() {
  verify_certificate "Verify Intermediate Certificate Authority against the Root Certificate Authority" \
    "$certs_intermediate_dir/ca.pem" "$certs_root_dir/root_ca_chain_bundle.pem"
  verify_bundle "Verify the chain in the Intermediate Certificate Authority Chain Bundle" \
    "$certs_intermediate_dir/ca.pem" "$certs_intermediate_dir/ca_chain_bundle.pem"
}
```

### Functie: `verify_leaf` {#function-verify_leaf}

```bash
verify_leaf() {
  local name="$1"
  verify_certificate "Verify Certificate against the Intermediate Certificate Chain" \
    "$certs_certificates_dir/${name}.pem" "$certs_intermediate_dir/ca_chain_bundle.pem"
  verify_bundle "Verify the chain in the Certificate Chain Bundle" \
    "$certs_certificates_dir/${name}.pem" "$certs_certificates_dir/${name}_chain_bundle.pem"
  # Only server certificates have a HAProxy bundle
  if [[ -f "$certs_certificates_dir/${name}_haproxy.pem" ]]; then
    verify_bundle "Verify the chain in the HAProxy Bundle" \
      "$certs_certificates_dir/${name}.pem" "$certs_certificates_dir/${name}_haproxy.pem"
    verify_bundle_key "Verify the private key in the HAProxy Bundle" \
      "$certs_certificates_dir/${name}.pem" "$certs_certificates_dir/${name}_haproxy.pem"
  fi
}
```

### Hoofdproces {#main-process}

```bash
# Main process
parse_arguments "$@"
require_openssl 2
```

### Bepalen welke secties worden gecontroleerd op basis van het certificaat {#determine-which-sections-to-verify-based-on-the-certificate}

```bash
# Determine which sections to verify based on the certificate
case "$file_name" in
"trusted_id.pem")
  verify_trusted_id
  ;;
"root_ca.pem")
  verify_trusted_id
  verify_root_ca
  ;;
"ca.pem")
  verify_trusted_id
  verify_root_ca
  verify_intermediate_ca
  ;;
*)
  verify_trusted_id
  verify_root_ca
  verify_intermediate_ca
  verify_leaf "${file_name%.pem}"
  ;;
esac

echo
if [[ "$failures" -gt 0 ]]; then
  print_error "$failures check(s) failed."
  exit 1
fi
print_cyan "All checks passed."
exit 0
```

## Conclusie {#conclusion}

Dit script controleert TLS-certificaten tegen hun vertrouwensketen.

[verify_tls_certificates.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/verify_tls_certificates.sh
