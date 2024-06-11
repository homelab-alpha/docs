---
title: "trusted-id.info"
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

weight: 5103

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`trusted-id.sh`, authored by GJS (homelab-alpha), and its purpose is to generate
and manage a trusted root certificate. The script sets up directory paths,
renews database serial numbers, generates an ECDSA key, creates a self-signed
certificate, verifies the certificate, checks the private key, and converts the
certificate format.

Here’s a detailed explanation:

## Script Metadata

- **Filename**: `trusted-id.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: June 9, 2024
- **Version**: 1.0.1
- **Description**: This script generates and manages a trusted root certificate,
  including key generation, certificate creation, verification, and format
  conversion.
- **RAW Script**: [trusted-id.sh]

Here is the detailed explanation:

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
openssl ecparam -name secp384r1 -genkey -out "$root_dir/private/trusted-id.pem"
```

<br />

### Generate Certificate

It creates a self-signed certificate for the root CA using the generated ECDSA
key and the configuration file, valid for 10956 days (30 years).

```bash
print_section_header "Generate Certificate"
openssl req -new -x509 -sha384 -config "$root_dir/trusted-id.cnf" -extensions v3_ca -key "$root_dir/private/trusted-id.pem" -days 10956 -out "$root_dir/certs/trusted-id.pem"
```

<br />

### Verify Certificate Against Itself

The script verifies the generated certificate against itself to ensure its
correctness.

```bash
print_section_header "Verify Certificate against itself"
openssl verify -CAfile "$root_dir/certs/trusted-id.pem" "$root_dir/certs/trusted-id.pem"
```

<br />

### Check Generated Files

The script includes steps to check the private key and the self-signed
certificate to verify their contents.

1. **Check Private Key**

   ```bash
   print_section_header "Check Private Key"
   openssl ecparam -in "$root_dir/private/trusted-id.pem" -text -noout
   ```

    <br />

2. **Check Certificate**

   ```bash
   print_section_header "Check Certificate"
   openssl x509 -in "$root_dir/certs/trusted-id.pem" -text -noout
   ```

<br />

### Convert Certificate Format

Finally, the script converts the self-signed certificate from PEM format to CRT
format.

```bash
print_section_header "Convert from trusted-id.pem to"
cat "$root_dir/certs/trusted-id.pem" >"$root_dir/certs/trusted-id.crt"
echo -e "$(print_cyan "--> ")""trusted-id.crt"
```

<br />

## Conclusion

This comprehensive script ensures that every step in generating and managing a
trusted root certificate is performed correctly and securely, from key
generation to certificate conversion.

[trusted-id.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/certificate-authority/trusted-id.sh
