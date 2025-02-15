---
title: "ssl_directory_setup.info"
description:
  "Automates the setup of SSL certificate management directories, generates
  random serial numbers, and creates necessary OpenSSL configuration files for a
  root certificate authority (CA) and a time-stamping authority (TSA)."
url: "openssl/script-info/ssl-directory-setup"
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
  - SSL Certificates
  - Script
  - Security
  - Automation
keywords:
  - SSL setup
  - OpenSSL script
  - Certificate management
  - Root CA
  - TSA configuration
  - Security automation
  - OpenSSL configuration

weight: 8102

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`ssl_directory_setup.sh`, authored by GJS (homelab-alpha), and its purpose is to
set up a directory structure for SSL certificate management, generate random
serial numbers for certificate databases, and create OpenSSL configuration files
for a trusted identity (root certificate authority) and a time-stamping
authority (TSA). The script requires OpenSSL to be installed and write
permissions in the specified directories.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `ssl_directory_setup.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: February 15, 2025
- **Version**: 1.1.0
- **Description**: Sets up SSL certificate management directories, generates
  random serial numbers, and creates OpenSSL configuration files.
- **Requirements**: OpenSSL installed, write permissions in specified
  directories.
- **RAW Script**: [ssl_directory_setup.sh]

<br />

## Detailed Explanation

## Functions

### Print Text in Cyan

```bash
print_cyan() {
  echo -e "\e[36m$1\e[0m" # \e[36m sets text color to cyan, \e[0m resets it
}
```

This function prints text in cyan color for better visibility in the terminal.

<br />

### Generate Random Hex Value

```bash
generate_random_hex() {
  openssl rand -hex 16
}
```

Generates a random 16-byte hexadecimal value using OpenSSL's random number
generator.

<br />

### Print Section Header

```bash
print_section_header() {
  echo ""
  echo ""
  echo -e "$(print_cyan "=== $1 === ")"
}
```

Prints section headers in cyan to distinguish different parts of the script
output.

<br />

## Directory Structure

### Define Directories

```bash
ssl_dir="$HOME/ssl"
root_dir="$ssl_dir/root"
intermediate_dir="$ssl_dir/intermediate"
certificates_dir="$ssl_dir/certificates"
tsa_dir="$ssl_dir/tsa"
crl_backup_dir="$ssl_dir/crl-backups"
```

Defines the main directory and subdirectories for SSL certificates and related
files.

<br />

### Create Directory Structure

```bash
print_section_header "Create directory structure"
mkdir -p "$root_dir"/{certs,crl,csr,db,newcerts,private} \
  "$intermediate_dir"/{certs,crl,csr,db,newcerts,private} \
  "$certificates_dir"/{certs,csr,extfile,private} \
  "$tsa_dir"/{cacerts,db,private,tsacerts} \
  "$crl_backup_dir"
```

Creates the necessary directory structure for managing SSL certificates,
including directories for root and intermediate CAs, certificates, and TSA.

<br />

## Database Files

### Create Database Files

```bash
print_section_header "Create DataBase files"
touch "$root_dir/db/index.txt"
touch "$intermediate_dir/db/index.txt"
```

Creates index files for the certificate databases.

<br />

### Renew DB Serial Numbers

```bash
print_section_header "Renew db serial numbers"
for dir in "$root_dir/db" "$intermediate_dir/db" "$tsa_dir/db"; do
  generate_random_hex > "$dir/serial"
done

generate_random_hex > "$root_dir/db/crlnumber"
generate_random_hex > "$intermediate_dir/db/crlnumber"
generate_random_hex > "$tsa_dir/db/crlnumber"
```

Generates new random serial numbers for the certificate databases and CRL
numbers.

<br />

## OpenSSL Configuration Files

### Create OpenSSL Config for Trusted Identity

```bash
print_section_header "Create openssl config files for trusted-id"
cat <<EOF >"$root_dir/trusted-id.cnf"
# Configuration file content truncated for brevity
EOF
```

Creates an OpenSSL configuration file for the trusted identity (root CA). This
file contains various settings and extensions used in generating and managing
certificates.

<br />

### Create OpenSSL Config for Root Certificate Authority

```bash
print_section_header "Create openssl config files for Root Certificate Authority"
cat <<EOF >"$root_dir/root_ca.cnf"
# Configuration file content truncated for brevity
EOF
```

Creates an OpenSSL configuration file for the Root Certificate Authority (CA),
detailing policies, extensions, and paths to certificate files and databases.

<br />

### Create OpenSSL Config for Certificate Authority

```bash
print_section_header "Create openssl config files for Certificate Authority"
cat <<EOF >"$intermediate_dir/ca.cnf"
# Configuration file content truncated for brevity
EOF
```

Creates an OpenSSL configuration file for the Certificate Authority (CA),
detailing policies, extensions, and paths to certificate files and databases.

<br />

### Create OpenSSL Config for Certificate

```bash
print_section_header "Create openssl config files for Certificate"
cat <<EOF >"$certificates_dir/cert.cnf"
# Configuration file content truncated for brevity
EOF
```

Creates an OpenSSL configuration file for a Certificate, detailing policies,
extensions, and paths to certificate files and databases.

## Conclusion

The `ssl_directory_setup.sh` script automates the setup of an SSL certificate
management environment. It creates a structured directory layout, initializes
database files, generates unique serial numbers, and sets up configuration files
for a root CA and TSA. By using functions for printing and generating random
values, the script ensures clarity and security throughout the process. This
setup is crucial for managing SSL/TLS certificates in a controlled and organized
manner.

[ssl_directory_setup.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/ssl_directory_setup.sh
