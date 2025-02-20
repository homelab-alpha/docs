---
title: "cert_rsa_client.info"
description:
  "Automate the creation and management of RSA client certificates, including
  key generation, CSR creation, certificate issuance, verification, and
  preparation of certificate chain bundles."
url: "openssl/script-info/cert-rsa-client"
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
  - RSA
  - certificates
  - automation
keywords:
  - RSA client certificates
  - certificate automation
  - key generation
  - CSR creation
  - certificate issuance
  - certificate verification
  - certificate chain bundles

weight: 8110

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Here's an explanation of the `cert_rsa_client.sh` script, which is designed for
creating and managing RSA client certificates. This script automates directory
setup, database serial number renewal, RSA key generation, CSR creation,
certificate issuance, verification, and preparation of certificate chain
bundles.

## Script Metadata

- **Filename**: `cert_rsa_client.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: February 20, 2025
- **Version**: 2.5.2
- **Description**: Automates the process of creating and managing RSA client
  certificates, including key generation, CSR creation, certificate issuance,
  verification, and preparation of certificate chain bundles.
- **RAW Script**: [cert_rsa_client.sh]

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
   read -r -p "$(print_cyan "Enter the IPv4 address of the new certificate (syntax: , IP:192.168.x.x): ")" ipv4
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

### Generate RSA Key

The script generates an RSA key for the Certificate and saves it to the private
directory.

```bash
print_section_header "Generate RSA key"
openssl genrsa -out "$private_certificates_dir/${fqdn}.pem"
check_success "Failed to generate RSA key"
```

<br />

### Generate Certificate Signing Request (CSR)

A CSR for the Certificate is generated using the generated RSA key.

```bash
print_section_header "Generate Certificate Signing Request"
openssl req -new -sha256 -config "$openssl_conf_dir/cert.cnf" -key "$private_certificates_dir/${fqdn}.pem" -out "$csr_dir/${fqdn}.pem"
check_success "Failed to generate Certificate Signing Request"
```

<br />

### Create an Extfile with All the Alternative Names

The script creates an extfile with alternative names for the certificate,
including DNS and IP addresses.

```bash
print_section_header "Create an extfile with all the alternative names"
{
  echo "subjectAltName = DNS:${fqdn}, DNS:www.${fqdn}"
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

This script ensures that every step in generating and managing an RSA client
certificate is performed correctly and securely, from key generation to
certificate verification and format conversion.

[cert_rsa_client.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_rsa_client.sh
