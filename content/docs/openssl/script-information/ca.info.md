---
title: "ca.info"
description:
  "A detailed script to manage an Intermediate Certificate Authority (CA) using
  OpenSSL, including key generation, CSR creation, certificate issuance, and
  verification."
url: "openssl/script-info/ca"
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
  - Certificate Authority
  - ECDSA
  - Security
  - Scripting
  - SSL/TLS
  - Cryptography
keywords:
  - Intermediate Certificate Authority
  - OpenSSL script
  - CSR generation
  - Certificate issuance
  - ECDSA keys
  - SSL/TLS management
  - Cryptographic verification

weight: 8105

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named `ca.sh`,
authored by GJS (homelab-alpha), and its purpose is to facilitate the setup and
management of an Intermediate Certificate Authority (CA). The script defines
directory paths, renews database serial numbers, generates ECDSA keys, creates
Certificate Signing Requests (CSRs), issues the intermediate certificate, and
verifies the intermediate CA chain bundle. It ensures the validity and integrity
of the generated keys, CSRs, and certificates.

## Script Metadata

- **Filename**: `ca.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: February 20, 2025
- **Version**: 2.6.3
- **Description**: This script manages an Intermediate Certificate Authority,
  handling key generation, CSR creation, certificate issuance, and verification
  processes.
- **RAW Script**: [ca.sh]

<br />

## Detailed Explanation

Before diving into the script, it’s important to know that the script will stop
execution on any error using the following line:

```bash
set -e
```

<br />

### Functions

1. **print_cyan**: This function is used to print text in cyan color for better
   readability in the terminal.

   ```bash
   print_cyan() {
     echo -e "\e[36m$1\e[0m"
   }
   ```

    <br />

2. **generate_random_hex**: This function generates a random hexadecimal value,
   which is used for serial numbers and CRL numbers.

   ```bash
   generate_random_hex() {
     openssl rand -hex 16 || return 1
   }
   ```

    <br />

3. **print_section_header**: This function prints section headers in cyan to
   clearly delineate different parts of the script.

   ```bash
   print_section_header() {
     echo ""
     print_cyan "=== $1 ==="
   }
   ```

    <br />

4. **check_success**: This function checks the success of the last command and
   exits the script if the command failed.

   ```bash
   check_success() {
     if [ $? -ne 0 ]; then
       echo "[ERROR] $1" >&2
       exit 1
     fi
   }
   ```

<br />

## Main Script Execution

### Define Directory Paths

The script defines necessary directory paths for the Intermediate Certificate
Authority components.

```bash
print_section_header "Define directory paths"
base_dir="$HOME/ssl"
certs_dir="$base_dir/certs"
csr_dir="$base_dir/csr"
private_dir="$base_dir/private"
db_dir="$base_dir/db"
openssl_conf_dir="$base_dir/openssl.cnf"
```

The following directories are specifically defined for the Intermediate
Certificate Authority components:

```bash
certs_root_dir="$certs_dir/root"
certs_intermediate_dir="$certs_dir/intermediate"
private_intermediate_dir="$private_dir/intermediate"
```

<br />

### Renew Database Serial Numbers and CRL

The script renews database serial numbers and CRL by generating random
hexadecimal values and writing them to the respective files.

```bash
print_section_header "Renew db numbers (serial and CRL)"
for type in "serial" "crlnumber"; do
  for dir in $db_dir; do
    generate_random_hex >"$dir/$type" || check_success "Failed to generate $type for $dir"
  done
done
```

<br />

### Check if Unique Subject and Intermediate Certificate Authority Exists

The script checks whether the `unique_subject` flag is set to `yes` in the
`index.txt.attr` file, and whether the Intermediate Certificate Authority
(`ca.pem`) already exists.

```bash
unique_subject="no"
if grep -q "^unique_subject\s*=\s*yes" "$db_dir/index.txt.attr" 2>/dev/null; then
  unique_subject="yes"
fi

ca_path="$certs_intermediate_dir/ca.pem"
ca_exists=false
if [[ -f "$ca_path" ]]; then
  ca_exists=true
fi
```

If `unique_subject` is enabled and the Intermediate Certificate Authority
exists, the script stops and reports an error. If not, it prompts the user for
confirmation before overwriting the Intermediate Certificate Authority.

```bash
if [[ "$unique_subject" == "yes" && "$ca_exists" == "true" ]]; then
  echo "[ERROR] unique_subject is enabled and Intermediate Certificate Authority already exists." >&2
  exit 1
fi

if [[ "$unique_subject" == "no" && -f "$ca_path" ]]; then
  print_section_header "⚠️  WARNING: Overwriting Intermediate Certificate Authority"

  echo "[WARNING] Intermediate Certificate Authority already exists and will be OVERWRITTEN!" >&2
  echo "[WARNING] This action will require REGENERATING ALL ISSUED CERTIFICATES!" >&2
  echo "[WARNING] If you continue, all issued certificates will become INVALID!" >&2

  read -r -p "Do you want to continue? (yes/no): " confirm
  if [[ "$confirm" != "yes" ]]; then
    echo "[INFO] Operation aborted by user." >&2
    exit 1
  fi
fi
```

<br />

### Generate ECDSA Key

The script generates an ECDSA key for the Intermediate Certificate Authority
using the secp384r1 curve and saves it to the private directory.

```bash
print_section_header "Generate ECDSA key"
openssl ecparam -name secp384r1 -genkey -out "$private_intermediate_dir/ca.pem"
check_success "Failed to generate ECDSA key"
```

<br />

### Generate Certificate Signing Request (CSR)

A CSR for the Intermediate Certificate Authority is generated using the
generated ECDSA key.

```bash
print_section_header "Generate Certificate Signing Request"
openssl req -new -sha384 -config "$openssl_conf_dir/ca.cnf" -key "$private_intermediate_dir/ca.pem" -out "$csr_dir/ca.pem"
check_success "Failed to generate Certificate Signing Request"
```

<br />

### Generate Intermediate Certificate Authority

The Intermediate Certificate Authority is generated and signed for a validity of
1826 days (5 years).

```bash
print_section_header "Generate Intermediate Certificate Authority"
openssl ca -config "$openssl_conf_dir/ca.cnf" -extensions v3_intermediate_ca -notext -batch -in "$csr_dir/ca.pem" -days 1826 -out "$certs_intermediate_dir/ca.pem"
check_success "Failed to generate Intermediate Certificate Authority"

```

<br />

### Create Intermediate Certificate Authority Chain Bundle

The Intermediate Certificate Authority and Root Certificate Authority are
concatenated into a chain bundle.

```bash
print_section_header "Create Intermediate Certificate Authority Chain Bundle"
cat "$certs_intermediate_dir/ca.pem" "$certs_root_dir/root_ca_chain_bundle.pem" >"$certs_intermediate_dir/ca_chain_bundle.pem"
check_success "Failed to create Intermediate Certificate Authority Chain Bundle"
```

<br />

### Verify Certificates

The script verifies the integrity of the certificates using `openssl verify`.

```bash
print_section_header "Verify Certificates"
verify_certificate() {
  openssl verify -CAfile "$1" "$2"
  check_success "Verification failed for $2"
}

verify_certificate "$certs_intermediate_dir/ca_chain_bundle.pem" "$certs_intermediate_dir/ca.pem"
verify_certificate "$certs_root_dir/root_ca_chain_bundle.pem" "$certs_intermediate_dir/ca.pem"
verify_certificate "$certs_root_dir/root_ca_chain_bundle.pem" "$certs_intermediate_dir/ca_chain_bundle.pem"
```

<br />

### Convert Certificate from PEM to CRT Format

The Intermediate Certificate Authority and chain bundle are converted from PEM
to CRT format.

```bash
print_section_header "Convert Intermediate Certificate Authority from .pem to .crt"
cp "$certs_intermediate_dir/ca.pem" "$certs_intermediate_dir/ca.crt"
cp "$certs_intermediate_dir/ca_chain_bundle.pem" "$certs_intermediate_dir/ca_chain_bundle.crt"
check_success "Failed to convert Intermediate Certificate Authority from .pem to .crt"
echo
print_cyan "--> ca.crt"
print_cyan "--> ca_chain_bundle.crt"
```

<br />

### Script Completion Message

The script prints a completion message when the process is successfully
completed.

```bash
echo
print_cyan "Intermediate Certificate Authority process successfully completed."
```

<br />

### Exit

The script exits with a success code (`0`).

```bash
exit 0
```

<br />

## Conclusion

This comprehensive script ensures that every step in setting up and managing an
Intermediate Certificate Authority is performed correctly and securely, from key
generation to certificate verification.

[ca.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/intermediate-certificate-authority/ca.sh
