---
title: "cert_ecdsa_client.info"
description:
  "This script is designed to automate the creation of an ECDSA client
  certificate. It covers key generation, CSR creation, certificate issuance,
  extension file creation, bundling with an intermediate CA chain, and
  verification of the certificate and its chain bundle. Additionally, it
  converts the certificate into different formats for use in various
  applications."
url: "openssl/script-info/cert-ecdsa-client"
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
  - ECDSA
  - Client Certificate
  - OpenSSL
  - Certificate Automation
  - CSR
  - Certificate Issuance
  - Certificate Verification
keywords:
  - ECDSA client certificate generation
  - OpenSSL scripting
  - Automated certificate creation
  - CSR generation script
  - Certificate chain verification
  - SSL/TLS certificates
  - Security automation
  - PEM to CRT conversion
  - Key management
  - Digital certificate script

weight: 8108

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's walkthrough the script `cert_ecdsa_client.sh`, which is designed to create
an ECDSA client certificate. This script handles the generation of the private
key, creation of the Certificate Signing Request (CSR), issuance of the
certificate, creation of an extension file, bundling the certificate with an
intermediate CA chain, and verifying the certificate and its chain bundle. It
also converts the certificate into different formats suitable for various
applications.

## Script Metadata

- **Filename**: `cert_ecdsa_client.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: February 20, 2025
- **Version**: 2.5.2
- **Description**: This script automates the generation of an ECDSA client
  certificate, including key creation, CSR generation, certificate issuance, and
  verification.
- **RAW Script**: [cert_ecdsa_client.sh]

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

5. **Certificate Information**: Define FQDN (Fully Qualified Domain Name) and IP
   address.

   ```bash
   read -r -p "$(print_cyan "Enter the FQDN name of the new certificate: ")" fqdn
   ```

<br />

## Main Script Execution

### Define Directory Paths

The script defines necessary directory paths for the Certificate components.

```bash
print_section_header "Define directory paths"
base_dir="$HOME/ssl"
certs_dir="$base_dir/certs"
csr_dir="$base_dir/csr"
extfile_dir="$base_dir/extfiles"
private_dir="$base_dir/private"
db_dir="$base_dir/db"
openssl_conf_dir="$base_dir/openssl.cnf"
```

The following directories are specifically defined for the Certificate
components:

```bash
certs_intermediate_dir="$certs_dir/intermediate"
certs_certificates_dir="$certs_dir/certificates"
private_certificates_dir="$private_dir/certificates"
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

### Check if Unique Subject is Enabled and CN Exists

The script checks whether the `unique_subject` flag is set to `yes` in the
`index.txt.attr` file, and whether the Certificate Authority Common Name (CN)
already exists.

```bash
unique_subject="no"
if grep -q "^unique_subject\s*=\s*yes" "$db_dir/index.txt.attr" 2>/dev/null; then
  unique_subject="yes"
fi

cn_exists=false
if grep -q "CN=${fqdn}" "$db_dir/index.txt" 2>/dev/null; then
  cn_exists=true
fi

if [[ "$unique_subject" == "yes" && "$cn_exists" == "true" ]]; then
  echo "[ERROR] unique_subject is enabled and CSR with Common Name ${fqdn} already exists in index.txt" >&2
  exit 1
fi
```

<br />

### Generate ECDSA Key

The script generates an ECDSA key for the Certificate using the secp384r1 curve
and saves it to the private directory.

```bash
print_section_header "Generate ECDSA key"
openssl ecparam -name secp384r1 -genkey -out "$private_certificates_dir/${fqdn}.pem"
check_success "Failed to generate ECDSA key"
```

<br />

### Generate Certificate Signing Request (CSR)

A CSR for the Certificate is generated using the generated ECDSA key.

```bash
print_section_header "Generate Certificate Signing Request"
openssl req -new -sha384 -config "$openssl_conf_dir/cert.cnf" -key "$private_certificates_dir/${fqdn}.pem" -out "$csr_dir/${fqdn}.pem"
check_success "Failed to generate Certificate Signing Request"
```

<br />

### Create an Extfile with All the Alternative Names

The script creates an extfile with alternative names for the certificate,
including DNS and IP addresses.

```bash
print_section_header "Create an extfile with all the alternative names"
{
  echo "subjectAltName = DNS:${fqdn}"
  echo "basicConstraints = critical, CA:FALSE"
  echo "keyUsage = critical, digitalSignature"
  echo "extendedKeyUsage = clientAuth, emailProtection"
  echo "nsCertType = client, email"
  echo "nsComment = OpenSSL Generated Client Certificate"
} >"$extfile_dir/${fqdn}.cnf"
```

<br />

### Generate Certificate

The Certificate is generated and signed for a validity of 366 days (1 years).

```bash
print_section_header "Generate Certificate"
openssl ca -config "$openssl_conf_dir/cert.cnf" -notext -batch -in "$csr_dir/${fqdn}.pem" -out "$certs_certificates_dir/${fqdn}.pem" -extfile "$extfile_dir/${fqdn}.cnf"
check_success "Failed to generate Certificate"
```

<br />

### Create Certificate Chain Bundle

The Certificate and Intermediate Certificate Authority are concatenated into a
chain bundle.

```bash
print_section_header "Create Certificate Chain Bundle"
cat "$certs_certificates_dir/${fqdn}.pem" "$certs_intermediate_dir/ca_chain_bundle.pem" >"$certs_certificates_dir/${fqdn}_chain_bundle.pem"
check_success "Failed to create Certificate Chain Bundle"
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

verify_certificate "$certs_certificates_dir/${fqdn}_chain_bundle.pem" "$certs_certificates_dir/${fqdn}.pem"
verify_certificate "$certs_intermediate_dir/ca_chain_bundle.pem" "$certs_certificates_dir/${fqdn}.pem"
verify_certificate "$certs_intermediate_dir/ca_chain_bundle.pem" "$certs_certificates_dir/${fqdn}_chain_bundle.pem"
```

<br />

### Convert Certificate from PEM to CRT and key Format

The Certificate and chain bundle are converted from PEM to CRT and key format.

```bash
print_section_header "Convert Certificate from .pem to .crt and .key"
cp "$certs_certificates_dir/${fqdn}.pem" "$certs_certificates_dir/${fqdn}.crt"
cp "$certs_certificates_dir/${fqdn}_chain_bundle.pem" "$certs_certificates_dir/${fqdn}_chain_bundle.crt"
cp "$private_certificates_dir/${fqdn}.pem" "$private_certificates_dir/${fqdn}.key"
chmod 600 "$private_certificates_dir/${fqdn}.key"
echo
print_cyan "--> ${fqdn}.crt"
print_cyan "--> ${fqdn}_chain_bundle.crt"
print_cyan "--> ${fqdn}.key"
```

<br />

### Script Completion Message

The script prints a completion message when the process is successfully
completed.

```bash
echo
print_cyan "Certificate process successfully completed."
```

<br />

### Exit

The script exits with a success code (`0`).

```bash
exit 0
```

<br />

## Conclusion

This script ensures that every step in generating and managing an ECDSA client
certificate is performed correctly and securely, from key generation to
certificate verification and format conversion.

[cert_ecdsa_client.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_ecdsa_client.sh
