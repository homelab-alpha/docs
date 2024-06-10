---
title: "openssl_verify_certificates.info"
description:
  "A comprehensive guide and script for verifying SSL/TLS certificates using
  OpenSSL, ensuring proper chain of trust validation from root to individual
  certificates."
url: "openssl/script-info/openssl-verify-certificates"
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
  - SSL
  - TLS
  - Certificates
  - OpenSSL
  - Security
  - Verification
  - Scripting
  - Homelab
  - DevOps
keywords:
  - SSL verification
  - TLS verification
  - OpenSSL script
  - certificate chain of trust
  - verify certificates
  - OpenSSL tutorial
  - SSL/TLS security
  - scripting with OpenSSL
  - homelab security
  - DevOps tools

weight: 5111

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`openssl_verify_certificates.sh`, authored by GJS (homelab-alpha), and its
purpose is to verify SSL/TLS certificates by checking them against their
corresponding chain of trust. It performs various checks, including verification
of root, intermediate, and individual certificates, with support for a verbose
mode to provide detailed output during the verification process.

Here’s a detailed explanation:

## Script Metadata

- **Script Name**: `openssl_verify_certificates.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: June 9, 2024
- **Version**: 1.0.1
- **Description**: This script verifies SSL/TLS certificates by checking them
  against their corresponding chain of trust. It includes options for verbose
  output for detailed verification processes.
- **RAW Script**: [openssl_verify_certificates.sh]

<br />

## Detailed Explanation

### Define Directories

The script sets the paths for the certificates, intermediate certificates, and
root certificates:

```bash
# Define directories
certificates_dir="$HOME/ssl/certificates/certs"
intermediate_dir="$HOME/ssl/intermediate/certs"
root_dir="${HOME}/ssl/root/certs"
```

<br />

### Default Settings and Helper Functions

The script initializes the verbose mode to false and defines helper functions to
print section headers and usage information:

```bash
# Default to non-verbose mode
verbose=false

# Function to print section headers.
print_section_header() {
  echo ""
  echo ""
  echo -e "\e[38;2;102;204;204m=== $1 ===\e[0m"
}

# Function to print usage information
print_usage() {
  echo "Usage: $0 [-v|--verbose]"
  echo "  -v, --verbose    Enable verbose mode for detailed output during verification"
  exit 1
}
```

<br />

### Certificate Verification Function

The main function for verifying certificates uses `openssl` to check the
certificate against the chain of trust:

```bash
# Function to perform certificate verification
verify_certificate() {
  local cert_path="$1"
  local chain_path="$2"

  # Print verification header
  echo "Verifying $cert_path against $chain_path:"

  # Run openssl command and capture the result
  result=$(openssl verify -CAfile "$chain_path" "$cert_path" 2>&1)

  # Check the result and print in color
  if [[ "$result" == *"OK"* ]]; then
    ok_part=$(echo "$result" | grep -o "OK")
    result_colored="${result/OK/$'\e[32m'$ok_part$'\e[0m'}"
    echo -e "$result_colored"
  else
    echo -e "$result"
  fi
## Detailed Explanation
```

<br />

### Command-Line Options Parsing

The script parses command-line options to enable verbose mode if specified:

```bash
# Parse command line options
while [[ $# -gt 0 ]]; do
  case "$1" in
  -v | --verbose)
    verbose=true
    shift
    ;;
  *)
    print_usage
    ;;
  esac
done
```

<br />

### Prompt for Certificate Name

The script prompts the user for the name of the certificate to verify:

```bash
# Prompt user for the certificate name
read -r -p "Enter the name of the certificate to verify: " file_name
```

<br />

### Certificate Verification Process

The script verifies various types of certificates, printing section headers for
each step:

```bash
# Verify Trusted Identity against Trusted Identity.
print_section_header "Verify Trusted Identity against Trusted Identity"
verify_certificate "$root_dir/trusted-id.pem" "$root_dir/trusted-id.pem"

# Verify Root Certificate Authority against Trusted Identity.
print_section_header "Verify Root Certificate Authority against Trusted Identity"
verify_certificate "$root_dir/root_ca.pem" "$root_dir/trusted-id.pem"

# Verify Root Certificate Authority Chain against Trusted Identity.
print_section_header "Verify Root Certificate Authority Chain against Trusted Identity"
verify_certificate "$root_dir/root_ca_chain_bundle.pem" "$root_dir/trusted-id.pem"

# Verify Intermediate Certificate Authority against the Root Certificate Authority.
print_section_header "Verify Intermediate Certificate Authority against the Root Certificate Authority"
verify_certificate "$intermediate_dir/ca.pem" "$root_dir/root_ca_chain_bundle.pem"

# Verify Intermediate Certificate Authority Chain against the Root Certificate Authority Chain.
print_section_header "Verify Intermediate Certificate Authority Chain against the Root Certificate Authority Chain"
verify_certificate "$intermediate_dir/ca_chain_bundle.pem" "$root_dir/root_ca_chain_bundle.pem"

# Verify Certificate against the Certificate Chain.
print_section_header "Verify Certificate against the Certificate Chain"
verify_certificate "$certificates_dir/${file_name}.pem" "$certificates_dir/${file_name}_chain_bundle.pem"

# Verify Certificate against the Intermediate Certificate Chain.
print_section_header "Verify Certificate against the Intermediate Certificate Chain"
verify_certificate "$certificates_dir/${file_name}.pem" "$intermediate_dir/ca_chain_bundle.pem"

# Verify Certificate Chain against the Intermediate Certificate Chain.
print_section_header "Verify Certificate Chain against the Intermediate Certificate Chain"
verify_certificate "$certificates_dir/${file_name}_chain_bundle.pem" "$intermediate_dir/ca_chain_bundle.pem"

# Verify Haproxy Certificate Chain against the Intermediate Certificate Chain.
print_section_header "Verify Haproxy Certificate Chain against the Intermediate Certificate Chain"
verify_certificate "$certificates_dir/${file_name}_haproxy.pem" "$intermediate_dir/ca_chain_bundle.pem"
```

<br />

### Exit the Script

Finally, the script exits successfully:

```bash
# Exit successfully
exit 0
```

<br />

## Conclusion

This script is a robust tool for verifying SSL/TLS certificates, ensuring they
are correctly chained to trusted root and intermediate certificates. The use of
the `openssl` command ensures thorough verification, and the optional verbose
mode provides additional detail for debugging or inspection purposes.

[openssl_verify_certificates.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/openssl_verify_certificates.sh
