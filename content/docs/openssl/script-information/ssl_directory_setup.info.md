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

## Script Metadata

- **Filename**: `ssl_directory_setup.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: February 20, 2025
- **Version**: 2.5.0
- **Description**: Sets up SSL certificate management directories, generates
  random serial numbers, and creates OpenSSL configuration files.
- **Requirements**: OpenSSL installed, write permissions in specified
  directories.
- **RAW Script**: [ssl_directory_setup.sh]

<br />

## Detailed Explanation

Before diving into the script, it’s important to know that the script will stop
execution on any error using the following line:

```bash
set -e
```

<br />

## Functions

### Function to check if OpenSSL is installed

Checks if OpenSSL is installed on the system. If OpenSSL is not found, it prints
an error message and exits the script.

```bash
check_openssl_installed() {
  if ! command -v openssl &>/dev/null; then
    echo "Error: OpenSSL is not installed. Please install it before running this script."
    exit 1
  fi
}
```

<br />

### Print Text in Cyan

This function prints text in cyan color to improve visibility in the terminal
output.

```bash
print_cyan() {
  echo -e "\e[36m$1\e[0m"
}
```

<br />

### Generate Random Hex Value

Generates a random 16-byte hexadecimal value using OpenSSL's random number
generator. If the generation fails, it displays an error and exits the script.

```bash
generate_random_hex() {
  openssl rand -hex 16 || {
    echo "Error: Failed to generate random hex."
    exit 1
  }
}
```

<br />

### Print Section Header

Prints section headers in cyan to clearly distinguish different parts of the
script's output.

```bash
print_section_header() {
  echo ""
  print_cyan "=== $1 ==="
}
```

<br />

### Directory Structure

Defines the main directory and subdirectories used for SSL certificates and
related files. The structure is designed for managing root and intermediate CAs,
certificates, and other essential components.

```bash
# Set base directory
base_dir="$HOME/ssl"
certs_dir="$base_dir/certs"
crl_dir="$base_dir/crl"
crl_backup_dir="$base_dir/crl-backup"
csr_dir="$base_dir/csr"
extfile_dir="$base_dir/extfiles"
newcerts_dir="$base_dir/newcerts"
private_dir="$base_dir/private"
db_dir="$base_dir/db"
log_dir="$base_dir/log"
openssl_conf_dir="$base_dir/openssl.cnf"
tsa_dir="$base_dir/tsa"

# Set directories for various components (for future use)
# certs_root_dir="$certs_dir/root"
# certs_intermediate_dir="$certs_dir/intermediate"
# certs_certificates_dir="$certs_dir/certificates"
# private_root_dir="$private_dir/root"
# private_intermediate_dir="$private_dir/intermediate"
# private_certificates_dir="$private_dir/certificates"
# tsa_certs_dir="$tsa_dir/certs"
# tsa_private_dir="$tsa_dir/private"
```

<br />

### Create Directory Structure

Creates the necessary directory structure for SSL certificate management,
including directories for root and intermediate certificate authorities (CAs),
certificates, Certificate Revocation Lists (CRLs), and other key components.

```bash
print_section_header "Creating directory structure"
mkdir -p "$certs_dir"/{root,intermediate,certificates} \
  "$crl_dir" \
  "$crl_backup_dir" \
  "$csr_dir" \
  "$extfile_dir" \
  "$newcerts_dir" \
  "$private_dir"/{root,intermediate,certificates} \
  "$db_dir" \
  "$log_dir" \
  "$openssl_conf_dir" \
  "$tsa_dir"/{certs,private,db}
```

<br />

## Database Files

### Create Database Files

Creates the index files for the certificate databases and ensures that the
`unique_subject` attribute is set to `yes` for both the main and TSA databases.

```bash
print_section_header "Creating db files and setting unique_subject attribute"
touch "$db_dir/index.txt"
touch "$tsa_dir/db/index.txt"

for dir in "$db_dir" "$tsa_dir/db"; do
  touch "$dir/index.txt.attr"
  echo "unique_subject = yes" >"$dir/index.txt.attr"
done
```

<br />

### Renew DB Serial Numbers

Generates new random serial numbers for both the main database and the TSA's
certificate revocation list (CRL) numbers.

```bash
print_section_header "Renewing db numbers (serial and CRL)"
for type in "serial" "crlnumber"; do
  for dir in "$db_dir" "$tsa_dir/db"; do
    generate_random_hex >"$dir/$type"
  done
done
```

<br />

### OpenSSL Configuration Files

Copies the OpenSSL configuration files from the user's local directory to the
target directory for the SSL setup. If the source directory doesn't exist, it
will print a warning and skip the copy operation.

```bash
print_section_header "Copying OpenSSL configuration files"
if [ -d "$HOME/openssl/openssl.cnf" ]; then
  cp -r "$HOME/openssl/openssl.cnf"/* "$openssl_conf_dir/"
else
  echo "Warning: OpenSSL configuration directory not found at $HOME/openssl/openssl.cnf."
  echo "Skipping OpenSSL configuration files copy."
fi
```

<br />

### Script Completion Message

Finally, the script exits with a success message:

```bash
echo
print_cyan "SSL directory setup completed successfully."
```

<br />

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
