---
title: "cert_rsa_server.info"
description:
  "Automate the process of creating and managing RSA server certificates,
  including key generation, CSR creation, certificate issuance, verification,
  and format conversion."
url: "openssl/script-info/cert-rsa-server"
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
  - RSA certificates
  - server authentication
  - OpenSSL scripts
  - certificate management
  - certificate automation
keywords:
  - RSA server certificates
  - key generation
  - CSR creation
  - certificate issuance
  - certificate verification
  - format conversion

weight: 8109

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the script `cert_rsa_server.sh`, which is designed for creating
and managing RSA server certificates. This script facilitates setting up the
necessary directories, renewing database serial numbers, generating RSA keys,
creating Certificate Signing Requests (CSRs), issuing certificates, and
preparing certificate chain bundles for applications like HAProxy. Additionally,
it verifies the integrity and details of the generated keys, CSRs, and
certificates.

Here’s a detailed explanation:

## Script Metadata

- **Filename**: `cert_rsa_server.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: June 9, 2024
- **Version**: 1.0.1
- **Description**: This script automates the process of creating and managing
  RSA certificates for server authentication, including key generation, CSR
  creation, certificate issuance, verification, and preparation of certificate
  chain bundles.
- **RAW Script**: [cert_rsa_server.sh]

<br />

## Detailed Explanation

### Functions

1. **print_cyan**: This function prints text in cyan color to enhance
   readability in the terminal.

   ```bash
   print_cyan() {
     echo -e "\e[36m$1\e[0m" # \e[36m sets text color to cyan, \e[0m resets it
   }
   ```

    <br />

2. **generate_random_hex**: This function generates a random hexadecimal value,
   which is useful for serial numbers and CRL numbers.

   ```bash
   generate_random_hex() {
     openssl rand -hex 16
   }
   ```

    <br />

3. **print_section_header**: This function prints section headers in cyan to
   clearly separate different parts of the script.

   ```bash
   print_section_header() {
     echo ""
     echo ""
     echo -e "$(print_cyan "=== $1 === ")"
   }
   ```

<br />

### Main Script Execution

### Prompt for Certificate Information

The script prompts the user for the certificate name, FQDN, and IPv4 address.

```bash
read -r -p "$(print_cyan "Enter the name of the new certificate: ")" file_name
read -r -p "$(print_cyan "Enter the FQDN name of the new certificate: ")" fqdn
read -r -p "$(print_cyan "Enter the IPv4 address of the new certificate (syntax: , IP:192.168.x.x): ")" ipv4
```

<br />

### Define Directory Paths

It defines the directory paths for storing SSL files and certificates.

```bash
print_section_header "Define directory paths"
ssl_dir="$HOME/ssl"
certificates_dir="$ssl_dir/certificates"
intermediate_dir="$ssl_dir/intermediate"
```

<br />

### Renew Database Serial Numbers

The script renews database serial numbers by generating random hex values and
writing them to the respective serial files for the root, intermediate, and TSA
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

### Generate RSA Key

It generates an RSA key and saves it in the private directory for the server
certificate.

```bash
print_section_header "Generate RSA key"
openssl genrsa -out "$certificates_dir/private/${file_name}.pem"
```

<br />

### Generate Certificate Signing Request (CSR)

The script creates a CSR for the server certificate using the generated RSA key
and a configuration file.

```bash
print_section_header "Generate Certificate Signing Request (CSR)"
openssl req -new -sha256 -config "$certificates_dir/cert.cnf" -key "$certificates_dir/private/${file_name}.pem" -out "$certificates_dir/csr/${file_name}.pem"
```

<br />

### Create an Extfile with All the Alternative Names

It creates an extfile with parameters for the server certificate, such as
subject alternative names (SANs), key usage, and extended key usage.

```bash
print_section_header "Create an extfile with all the alternative names"
{
  echo "subjectAltName = DNS:${fqdn}, DNS:www.${fqdn}${ipv4}"
  echo "basicConstraints = critical, CA:FALSE"
  echo "keyUsage = critical, digitalSignature"
  echo "extendedKeyUsage = serverAuth"
  echo "nsCertType = server"
  echo "nsComment = OpenSSL Generated Server Certificate"
} >>"$certificates_dir/extfile/${file_name}.cnf"
```

<br />

### Generate Certificate

The script issues the server certificate based on the CSR and extfile, valid for
a specified period.

```bash
print_section_header "Generate Certificate"
openssl ca -config "$certificates_dir/cert.cnf" -notext -batch -in "$certificates_dir/csr/${file_name}.pem" -out "$certificates_dir/certs/${file_name}.pem" -extfile "$certificates_dir/extfile/${file_name}.cnf"
```

<br />

### Create Certificate Chain Bundle

It creates a certificate chain bundle by concatenating the server certificate
and the intermediate CA chain bundle.

```bash
print_section_header "Create Certificate Chain Bundle"
cat "$certificates_dir/certs/${file_name}.pem" "$intermediate_dir/certs/ca_chain_bundle.pem" >"$certificates_dir/certs/${file_name}_chain_bundle.pem"
```

<br />

### Create Certificate Chain Bundle for HAProxy

The script creates a certificate chain bundle specifically for HAProxy by
concatenating the chain bundle and the private key.

```bash
print_section_header "Create Certificate Chain Bundle for HAProxy"
cat "$certificates_dir/certs/${file_name}_chain_bundle.pem" "$certificates_dir/private/${file_name}.pem" >"$certificates_dir/certs/${file_name}_haproxy.pem"
chmod 600 "$certificates_dir/certs/${file_name}_haproxy.pem"
```

<br />

### Verification Steps

The script performs several verification steps to ensure the integrity and
correctness of the certificates and keys.

1. **Verify Certificate against the Certificate Chain Bundle**

   ```bash
   print_section_header "Verify ${file_name} Certificate against the ${file_name} Certificate chain Bundle"
   openssl verify -CAfile "$certificates_dir/certs/${file_name}_chain_bundle.pem" "$certificates_dir/certs/${file_name}.pem"
   ```

    <br />

2. **Verify Certificate against the Intermediate Certificate Authority Chain
   Bundle**

   ```bash
   print_section_header "Verify ${file_name} Certificate against the Intermediate Certificate Authority Chain Bundle"
   openssl verify -CAfile "$intermediate_dir/certs/ca_chain_bundle.pem" "$certificates_dir/certs/${file_name}.pem"
   ```

    <br />

3. **Verify Certificate Chain Bundle against the Intermediate Certificate
   Authority Chain Bundle**

   ```bash
   print_section_header "Verify ${file_name} Certificate Chain Bundle against the Intermediate Certificate Authority Chain Bundle"
   openssl verify -CAfile "$intermediate_dir/certs/ca_chain_bundle.pem" "$certificates_dir/certs/${file_name}_chain_bundle.pem"
   ```

    <br />

4. **Verify HAProxy Certificate Chain Bundle against the Intermediate
   Certificate Authority Chain Bundle**

   ```bash
   print_section_header "Verify HAProxy Certificate Chain Bundle against the Intermediate Certificate Authority Chain Bundle"
   openssl verify -CAfile "$intermediate_dir/certs/ca_chain_bundle.pem" "$certificates_dir/certs/${file_name}_haproxy.pem"
   ```

<br />

### Check Generated Files

The script includes steps to check the private key, CSR, server certificate, and
the chain bundle to verify their contents.

1. **Check Private Key**

   ```bash
   print_section_header "Check Private Key"
   openssl rsa -in "$certificates_dir/private/${file_name}.pem" -text -noout
   ```

    <br />

2. **Check CSR**

   ```bash
   print_section_header "Check Certificate Signing Request (CSR)"
   openssl req -text -noout -verify -in "$certificates_dir/csr/${file_name}.pem"
   ```

    <br />

3. **Check Certificate**

   ```bash
   print_section_header "Check Certificate Certificate"
   openssl x509 -in "$certificates_dir/certs/${file_name}.pem" -text -noout
   ```

    <br />

4. **Check Certificate Chain Bundle**

   ```bash
   print_section_header "Check Certificate Chain Bundle"
   openssl x509 -in "$certificates_dir/certs/${file_name}_chain_bundle.pem" -text -noout
   ```

<br />

### Convert Certificate to Different Formats

The script converts the certificate from PEM to CRT and KEY formats for
compatibility with various applications.

```bash
print_section_header "Convert Certificate from ${fqdn}.pem to"
cat "$certificates_dir/certs/${file_name}.pem" >"$certificates_dir/certs/${file_name}.crt"
cat "$certificates_dir/certs/${file_name}_chain_bundle.pem" >"$certificates_dir/certs/${file_name}_chain_bundle.crt"
cat "$certificates_dir/private/${file_name}.pem" >"$certificates_dir/private/${file_name}.key"
chmod 600 "$certificates_dir/private/${file_name}.key"
echo -e "$(print_cyan "--> ")""${fqdn}.crt"
echo -e "$(print_cyan "--> ")""${fqdn}_chain_bundle.crt"
echo -e "$(print_cyan "--> ")""${fqdn}.key"
```

<br />

## Conclusion

This script ensures that every step in generating and managing an RSA server
certificate is performed correctly and securely, from key generation to
certificate verification and format conversion.

[cert_rsa_server.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_rsa_server.sh
