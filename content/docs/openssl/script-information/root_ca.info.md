---
title: "root_ca.info"
description:
  "This script sets up and manages a Root Certificate Authority, handling key
  generation, CSR creation, certificate issuance, and verification processes."
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

weight: 8104

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`root_ca.sh`, authored by GJS (homelab-alpha), and its purpose is to set up and
manage a Root Certificate Authority (CA). The script defines necessary directory
paths, renews database serial numbers, generates ECDSA keys, creates Certificate
Signing Requests (CSRs), and issues the root certificate. Additionally, it
verifies the root certificate and creates a CA chain bundle, ensuring the
integrity and correctness of the generated keys, CSRs, and certificates.

## Script Metadata

- **Filename**: `root_ca.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: February 20, 2025
- **Version**: 2.6.2
- **Description**: This script sets up and manages a Root Certificate Authority,
  handling key generation, CSR creation, certificate issuance, and verification
  processes.
- **RAW Script**: [root_ca.sh]

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

The script defines necessary directory paths for the Certificate Authority
components.

```bash
print_section_header "Define directory paths"
base_dir="$HOME/ssl"
certs_dir="$base_dir/certs"
csr_dir="$base_dir/csr"
private_dir="$base_dir/private"
db_dir="$base_dir/db"
openssl_conf_dir="$base_dir/openssl.cnf"
```

The following directories are specifically defined for the Certificate Authority
components:

```bash
certs_root_dir="$certs_dir/root"
private_root_dir="$private_dir/root"
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

### Check if Unique Subject and Certificate Authority Exists

The script checks whether the `unique_subject` flag is set to `yes` in the
`index.txt.attr` file, and whether the Certificate Authority (`root_ca.pem`)
already exists.

```bash
unique_subject="no"
if grep -q "^unique_subject\s*=\s*yes" "$db_dir/index.txt.attr" 2>/dev/null; then
  unique_subject="yes"
fi

root_ca_path="$certs_root_dir/root_ca.pem"
root_ca_exists=false
if [[ -f "$root_ca_path" ]]; then
  root_ca_exists=true
fi
```

If `unique_subject` is enabled and the Certificate Authority exists, the script
stops and reports an error. If not, it prompts the user for confirmation before
overwriting the Certificate Authority.

```bash
if [[ "$unique_subject" == "yes" && "$root_ca_exists" == "true" ]]; then
  echo "[ERROR] unique_subject is enabled and Certificate Authority already exists." >&2
  exit 1
fi

if [[ "$unique_subject" == "no" && -f "$root_ca_path" ]]; then
  print_section_header "⚠️  WARNING: Overwriting Certificate Authority"

  echo "[WARNING] Certificate Authority already exists and will be OVERWRITTEN!" >&2
  echo "[WARNING] This action will require REGENERATING ALL SUB-CA CERTIFICATES, AND ALL ISSUED CERTIFICATES!" >&2
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

The script generates an ECDSA key for the Root Certificate Authority using the
secp384r1 curve and saves it to the private directory.

```bash
print_section_header "Generate ECDSA key"
openssl ecparam -name secp384r1 -genkey -out "$private_root_dir/root_ca.pem"
check_success "Failed to generate ECDSA key"
```

<br />

### Generate Certificate Signing Request (CSR)

A CSR for the Root Certificate Authority is generated using the generated ECDSA
key.

```bash
print_section_header "Generate Certificate Signing Request"
openssl req -new -sha384 -config "$openssl_conf_dir/root_ca.cnf" -key "$private_root_dir/root_ca.pem" -out "$csr_dir/root_ca.pem"
check_success "Failed to generate Certificate Signing Request"
```

<br />

### Generate Root Certificate Authority

The Root Certificate Authority is generated and signed for a validity of 7305
days (20 years).

```bash
print_section_header "Generate Root Certificate Authority"
openssl ca -config "$openssl_conf_dir/root_ca.cnf" -extensions v3_ca -notext -batch -in "$csr_dir/root_ca.pem" -days 7305 -out "$certs_root_dir/root_ca.pem"
check_success "Failed to generate Root Certificate Authority"
```

<br />

### Create Root Certificate Authority Chain Bundle

The Root Certificate Authority and Trusted Identity certificate are concatenated
into a chain bundle.

```bash
print_section_header "Create Root Certificate Authority Chain Bundle"
cat "$certs_root_dir/root_ca.pem" "$certs_root_dir/trusted_id.pem" >"$certs_root_dir/root_ca_chain_bundle.pem"
check_success "Failed to create Root Certificate Authority Chain Bundle"
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

verify_certificate "$certs_root_dir/root_ca_chain_bundle.pem" "$certs_root_dir/root_ca.pem"
verify_certificate "$certs_root_dir/trusted_id.pem" "$certs_root_dir/root_ca.pem"
verify_certificate "$certs_root_dir/trusted_id.pem" "$certs_root_dir/root_ca_chain_bundle.pem"
```

<br />

### Convert Certificate from PEM to CRT Format

The Root Certificate Authority and chain bundle are converted from PEM to CRT
format.

```bash
print_section_header "Convert Root Certificate Authority from .pem to .crt"
cp "$certs_root_dir/root_ca.pem" "$certs_root_dir/root_ca.crt"
cp "$certs_root_dir/root_ca_chain_bundle.pem" "$certs_root_dir/root_ca_chain_bundle.crt"
check_success "Failed to convert Root Certificate Authority from .pem to .crt"
echo
print_cyan "--> root_ca.crt"
print_cyan "--> root_ca_chain_bundle.crt"
```

<br />

### Script Completion Message

The script prints a completion message when the process is successfully
completed.

```bash
echo
print_cyan "Root Certificate Authority process successfully completed."
```

<br />

### Exit

The script exits with a success code (`0`).

```bash
exit 0
```

<br />

## Conclusion

This comprehensive script ensures that every step in setting up and managing a
Root Certificate Authority is performed correctly and securely, from key
generation to certificate verification.

[root_ca.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate-authority/root_ca.sh
