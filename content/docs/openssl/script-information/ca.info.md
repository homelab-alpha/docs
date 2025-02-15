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

Here’s a detailed explanation:

## Script Metadata

- **Filename**: `ca.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: June 9, 2024
- **Version**: 1.0.1
- **Description**: This script manages an Intermediate Certificate Authority,
  handling key generation, CSR creation, certificate issuance, and verification
  processes.
- **RAW Script**: [ca.sh]

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
private directory of the intermediate CA.

```bash
print_section_header "Generate ECDSA key"
openssl ecparam -name secp384r1 -genkey -out "$intermediate_dir/private/ca.pem"
```

<br />

### Generate Certificate Signing Request (CSR)

It creates a CSR for the intermediate CA using the generated ECDSA key and the
configuration file.

```bash
print_section_header "Generate Certificate Signing Request (CSR)"
openssl req -new -sha384 -config "$intermediate_dir/ca.cnf" -key "$intermediate_dir/private/ca.pem" -out "$intermediate_dir/csr/ca.pem"
```

<br />

### Generate Intermediate Certificate Authority

The script then issues the intermediate certificate, valid for 1826 days, based
on the CSR.

```bash
print_section_header "Generate Intermediate Certificate Authority"
openssl ca -config "$intermediate_dir/ca.cnf" -extensions v3_intermediate_ca -notext -batch -in "$intermediate_dir/csr/ca.pem" -days 1826 -out "$intermediate_dir/certs/ca.pem"
```

<br />

### Create Intermediate Certificate Authority Chain Bundle

It creates a chain bundle by concatenating the intermediate certificate and the
root CA chain bundle.

```bash
print_section_header "Create Intermediate Certificate Authority Chain Bundle"
cat "$intermediate_dir/certs/ca.pem" "$root_dir/certs/root_ca_chain_bundle.pem" >"$intermediate_dir/certs/ca_chain_bundle.pem"
```

<br />

### Verification Steps

The script performs several verification steps to ensure the integrity and
correctness of the certificates and keys.

1. **Verify Intermediate CA against the Intermediate CA Chain Bundle**

   ```bash
   print_section_header "Verify Intermediate Certificate Authority against the Intermediate Certificate Authority Chain Bundle"
   openssl verify -CAfile "$intermediate_dir/certs/ca_chain_bundle.pem" "$intermediate_dir/certs/ca.pem"
   ```

    <br />

2. **Verify Intermediate CA against Root CA Chain Bundle**

   ```bash
   print_section_header "Verify Intermediate Certificate Authority against Root Certificate Authority Chain Bundle"
   openssl verify -CAfile "$root_dir/certs/root_ca_chain_bundle.pem" "$intermediate_dir/certs/ca.pem"
   ```

    <br />

3. **Verify Intermediate CA Chain Bundle against Root CA Chain Bundle**

   ```bash
   print_section_header "Verify Intermediate Certificate Authority Chain Bundle against Root Certificate Authority Chain Bundle"
   openssl verify -CAfile "$root_dir/certs/root_ca_chain_bundle.pem" "$intermediate_dir/certs/ca_chain_bundle.pem"
   ```

<br />

### Check Generated Files

The script also includes steps to check the private key, CSR, intermediate CA
certificate, and the CA chain bundle to verify their contents.

1. **Check Private Key**

   ```bash
   print_section_header "Check Private Key"
   openssl ecparam -in "$intermediate_dir/private/ca.pem" -text -noout
   ```

    <br />

2. **Check CSR**

   ```bash
   print_section_header "Check Certificate Signing Request (CSR)"
   openssl req -text -noout -verify -in "$intermediate_dir/csr/ca.pem"
   ```

    <br />

3. **Check Intermediate CA**

   ```bash
   print_section_header "Check Intermediate Certificate Authority"
   openssl x509 -in "$intermediate_dir/certs/ca.pem" -text -noout
   ```

    <br />

4. **Check CA Chain Bundle**

   ```bash
   print_section_header "Check Intermediate Certificate Authority Chain Bundle"
   openssl x509 -in "$intermediate_dir/certs/ca_chain_bundle.pem" -text -noout
   ```

<br />

## Conclusion

This comprehensive script ensures that every step in setting up and managing an
Intermediate Certificate Authority is performed correctly and securely, from key
generation to certificate verification.

[ca.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/intermediate-certificate-authority/ca.sh
