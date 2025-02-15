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

Here’s a detailed explanation:

## Script Metadata

- **Filename**: `root_ca.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: June 9, 2024
- **Version**: 1.0.1
- **Description**: This script sets up and manages a Root Certificate Authority,
  handling key generation, CSR creation, certificate issuance, and verification
  processes.
- **RAW Script**: [root_ca.sh]

<br />

## Detailed Explanation

### Functions

1. **print_cyan**: This function is used to print text in cyan color for better
   readability in the terminal.

   ```bash
   print_cyan() {
     echo -e "\e[36m$1\e[0m" # \e[36m sets text color to cyan, \e[0m resets it
   }
   ```

    <br />

2. **generate_random_hex**: This function generates a random hexadecimal value,
   which is used for serial numbers and CRL numbers.

   ```bash
   generate_random_hex() {
     openssl rand -hex 16
   }
   ```

    <br />

3. **print_section_header**: This function prints section headers in cyan to
   clearly delineate different parts of the script.

   ```bash
   print_section_header() {
     echo ""
     echo ""
     echo -e "$(print_cyan "=== $1 === ")"
   }
   ```

<br />

## Main Script Execution

### Define Directory Paths

The script sets up necessary directory paths for the root and intermediate CA.

```bash
print_section_header "Define directory paths"
ssl_dir="$HOME/ssl"
root_dir="$ssl_dir/root"
intermediate_dir="$ssl_dir/intermediate"
```

<br />

### Renew Database Serial Numbers

It renews database serial numbers by generating random hex values and writing
them to the respective serial files for the root, intermediate, and TSA
directories.

```bash
print_section_header "Renew db serial numbers"
for dir in "$ssl_dir/root/db" "$intermediate_dir/db" "$ssl_dir/tsa/db"; do
  generate_random_hex >"$dir/serial"
done
generate_random_hex >"$ssl_dir/root/db/crlnumber"
generate_random_hex >"$intermediate_dir/db/crlnumber"
```

<br />

### Generate ECDSA Key

The script generates an ECDSA key using the secp384r1 curve and saves it to the
private directory of the root CA.

```bash
print_section_header "Generate ECDSA key"
openssl ecparam -name secp384r1 -genkey -out "$root_dir/private/root_ca.pem"
```

<br />

### Generate Certificate Signing Request (CSR)

It creates a CSR for the root CA using the generated ECDSA key and the
configuration file.

```bash
print_section_header "Generate Certificate Signing Request (CSR)"
openssl req -new -sha384 -config "$root_dir/root_ca.cnf" -key "$root_dir/private/root_ca.pem" -out "$root_dir/csr/root_ca.pem"
```

<br />

### Generate Root Certificate Authority

The script issues the root certificate, valid for 7305 days (20 years), based on
the CSR.

```bash
print_section_header "Generate Root Certificate Authority"
openssl ca -config "$root_dir/root_ca.cnf" -extensions v3_ca -notext -batch -in "$root_dir/csr/root_ca.pem" -days 7305 -out "$root_dir/certs/root_ca.pem"
```

<br />

### Create Root Certificate Authority Chain Bundle

It creates a chain bundle by concatenating the root certificate and the trusted
identity certificate.

```bash
print_section_header "Create Root Certificate Authority Chain Bundle"
cat "$root_dir/certs/root_ca.pem" "$root_dir/certs/trusted-id.pem" >"$root_dir/certs/root_ca_chain_bundle.pem"
```

<br />

### Verification Steps

The script performs several verification steps to ensure the integrity and
correctness of the certificates and keys.

1. **Verify Root CA against the Root CA Chain Bundle**

   ```bash
   print_section_header "Verify Root Certificate Authority against the Root Certificate Authority Chain Bundle"
   openssl verify -CAfile "$root_dir/certs/root_ca_chain_bundle.pem" "$root_dir/certs/root_ca.pem"
   ```

    <br />

2. **Verify Root CA against Trusted Identity**

   ```bash
   print_section_header "Verify Root Certificate Authority against Trusted Identity"
   openssl verify -CAfile "$root_dir/certs/trusted-id.pem" "$root_dir/certs/root_ca.pem"
   ```

    <br />

3. **Verify Root CA Chain Bundle against Trusted Identity**

   ```bash
   print_section_header "Verify Root Certificate Authority Chain Bundle against Trusted Identity"
   openssl verify -CAfile "$root_dir/certs/trusted-id.pem" "$root_dir/certs/root_ca_chain_bundle.pem"
   ```

<br />

### Check Generated Files

The script also includes steps to check the private key, CSR, root CA
certificate, and the CA chain bundle to verify their contents.

1. **Check Private Key**

   ```bash
   print_section_header "Check Private Key"
   openssl ecparam -in "$root_dir/private/root_ca.pem" -text -noout
   ```

    <br />

2. **Check CSR**

   ```bash
   print_section_header "Check Certificate Signing Request (CSR)"
   openssl req -text -noout -verify -in "$root_dir/csr/root_ca.pem"
   ```

    <br />

3. **Check Root CA**

   ```bash
   print_section_header "Check Root Certificate Authority"
   openssl x509 -in "$root_dir/certs/root_ca.pem" -text -noout
   ```

    <br />

4. **Check CA Chain Bundle**

   ```bash
   print_section_header "Check Root Certificate Authority Chain Bundle"
   openssl x509 -in "$root_dir/certs/root_ca_chain_bundle.pem" -text -noout
   ```

<br />

## Conclusion

This comprehensive script ensures that every step in setting up and managing a
Root Certificate Authority is performed correctly and securely, from key
generation to certificate verification.

[root_ca.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate-authority/root_ca.sh
