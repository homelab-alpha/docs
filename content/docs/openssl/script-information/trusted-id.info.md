---
title: "trusted_id.info"
description:
  "This script automates the generation and management of a trusted root
  certificate, ensuring secure key generation, certificate creation,
  verification, and format conversion."
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

weight: 8103

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`trusted_id.sh`, authored by GJS (homelab-alpha), and its purpose is to generate
and manage a trusted root certificate. The script sets up directory paths,
renews database serial numbers, generates an ECDSA key, creates a self-signed
certificate, verifies the certificate, checks the private key, and converts the
certificate format.

## Script Metadata

- **Filename**: `trusted_id.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: February 20, 2025
- **Version**: 2.5.2
- **Description**: This script generates and manages a trusted root certificate,
  including key generation, certificate creation, verification, and format
  conversion.
- **RAW Script**: [trusted_id.sh]

Here is the detailed explanation:

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

### Check if Unique Subject and Trusted ID Exists

The script checks whether the `unique_subject` flag is set to `yes` in the
`index.txt.attr` file, and whether the Trusted ID (`trusted_id.sh`) already
exists.

```bash
unique_subject="no"
if grep -q "^unique_subject\s*=\s*yes" "$db_dir/index.txt.attr" 2>/dev/null; then
  unique_subject="yes"
fi

trusted_id_path="$certs_root_dir/trusted_id.pem"
trusted_id_exists=false
if [[ -f "$trusted_id_path" ]]; then
  trusted_id_exists=true
fi
```

If `unique_subject` is enabled and the Trusted ID exists, the script stops and
reports an error. If not, it prompts the user for confirmation before
overwriting the Trusted ID.

```bash
if [[ "$unique_subject" == "yes" && "$trusted_id_exists" == "true" ]]; then
  echo "[ERROR] unique_subject is enabled and Trusted ID already exists." >&2
  exit 1
fi

if [[ "$unique_subject" == "no" && -f "$trusted_id_path" ]]; then
  print_section_header "⚠️  WARNING: Overwriting Trusted ID"

  echo "[WARNING] Trusted ID already exists and will be OVERWRITTEN!" >&2
  echo "[WARNING] This action will require REGENERATING THE ROOT CA, ALL SUB-CA CERTIFICATES, AND ALL ISSUED CERTIFICATES!" >&2
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

The script generates an ECDSA key for the Trusted ID using the secp384r1 curve
and saves it to the private directory.

```bash
print_section_header "Generate ECDSA key"
openssl ecparam -name secp384r1 -genkey -out "$private_root_dir/trusted_id.pem"
check_success "Failed to generate ECDSA key"
```

<br />

### Generate Certificate

It generates a self-signed certificate for the Trusted ID using the generated
ECDSA key, valid for 10956 days (30 years).

```bash
print_section_header "Generate Certificate Signing Request"
openssl req -new -x509 -sha384 -config "$openssl_conf_dir/trusted_id.cnf" -extensions v3_ca -key "$private_root_dir/trusted_id.pem" -days 10956 -out "$certs_root_dir/trusted_id.pem"
check_success "Failed to generate Certificate Signing Request"
```

<br />

### Verify Certificate Against Itself

The script verifies the generated certificate against itself to ensure its
correctness.

```bash
print_section_header "Verify Certificates"
openssl verify -CAfile "$certs_root_dir/trusted_id.pem" "$certs_root_dir/trusted_id.pem"
check_success "Verification failed for certificate"
```

<br />

### Check Generated Files

The script checks the private key and the self-signed certificate.

1. **Check Private Key**

   ```bash
   print_section_header "Check Private Key"
   openssl ecparam -in "$private_root_dir/trusted_id.pem" -text -noout
   check_success "Failed to check private key"
   ```

    <br />

2. **Check Certificate**

   ```bash
   print_section_header "Check Certificate"
   openssl x509 -in "$certs_root_dir/trusted_id.pem" -text -noout
   check_success "Failed to check certificate"
   ```

<br />

### Convert Certificate Format

Finally, the script converts the self-signed certificate from PEM format to CRT
format.

```bash
print_section_header "Convert Trusted ID Certificate Authority from .pem to .crt"
cp "$certs_root_dir/trusted_id.pem" "$certs_root_dir/trusted_id.crt"
check_success "Failed to convert Trusted ID Certificate Authority from .pem to .crt"
echo
print_cyan "--> trusted_id.crt"
```

<br />

### Script Completion Message

The script prints a completion message when the process is successfully
completed.

```bash
echo
print_cyan "Trusted ID Certificate Authority process successfully completed."
```

<br />

### Exit

The script exits with a success code (`0`).

```bash
exit 0
```

<br />

## Conclusion

This comprehensive script ensures that every step in generating and managing a
trusted root certificate is performed correctly and securely, from key
generation to certificate conversion.

[trusted_id.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate-authority/trusted_id.sh
