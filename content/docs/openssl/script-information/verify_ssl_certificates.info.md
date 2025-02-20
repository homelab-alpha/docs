---
title: "verify_ssl_certificates.info"
description:
  "A comprehensive guide and script for verifying SSL/TLS certificates using
  OpenSSL, ensuring proper chain of trust validation from root to individual
  certificates."
url: "openssl/script-info/verify-ssl-certificates"
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

weight: 8111

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`verify_ssl_certificates.sh`, authored by GJS (homelab-alpha), and its purpose
is to verify SSL/TLS certificates by checking them against their corresponding
chain of trust. It performs various checks, including verification of root,
intermediate, and individual certificates, with support for a verbose mode to
provide detailed output during the verification process.

## Script Metadata

- **Filename**: `verify_ssl_certificates.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: February 20, 2025
- **Version**: 2.5.0
- **Description**: This script verifies SSL/TLS certificates by checking them
  against their corresponding chain of trust. It includes options for verbose
  output for detailed verification processes.
- **RAW Script**: [verify_ssl_certificates.sh]

<br />

## Detailed Explanation

Before diving into the script, it’s important to know that the script will stop
execution on any error using the following line:

```bash
set -e
```

<br />

## Functions

### Define Directories

The script sets the paths for the certificates, intermediate certificates, and
root certificates:

```bash
base_dir="$HOME/ssl"
certs_dir="$base_dir/certs"

certs_root_dir="$certs_dir/root"
certs_intermediate_dir="$certs_dir/intermediate"
certs_certificates_dir="$certs_dir/certificates"
```

In the updated version, the directory names were simplified to make them more
consistent with the naming conventions across the project.

<br />

### Default Settings and Helper Functions

The script initializes the verbose mode to false and defines helper functions to
print section headers and usage information:

```bash
verbose=false
file_name=""

print_cyan() {
  echo -e "\e[36m$1\e[0m"
}

print_section_header() {
  echo ""
  print_cyan "=== $1 ==="
}
```

<br />

### Function to check if a file exists

The `check_file_exists` function checks whether a file exists at a specified
path. If the file is not found, it displays an error message and returns a
failure status (1). If the file exists, it returns 0 (success).

```bash
check_file_exists() {
  local file_path=$1
  if [ ! -f "$file_path" ]; then
    echo -e "$file_path: \033[31m[FAIL] - File not found\033[0m"
    return 1
  fi
  return 0
}
```

<br />

### Certificate Verification Function

The main function for verifying certificates uses `openssl` to check the
certificate against the chain of trust:

```bash
verify_certificate() {
  local cert_path="$1"
  local chain_path="$2"

  check_file_exists "$cert_path" || return
  check_file_exists "$chain_path" || return

  if [ "$verbose" = true ]; then
    result=$(openssl verify -show_chain -CAfile "$chain_path" "$cert_path" 2>&1)
  else
    result=$(openssl verify -CAfile "$chain_path" "$cert_path" 2>&1)
  fi

  if [[ "$result" == *"OK"* ]]; then
    echo -e "$cert_path: \033[32m[PASS]\033[0m"
  else
    echo -e "$cert_path: \033[31m[FAIL]\033[0m"
  fi

  if [ "$verbose" = true ]; then
    echo -e "Verbose output: $result"
  fi
}
```

<br />

### Prompt for Certificate Name

The script prompts the user for the name of the certificate to verify:

```bash
prompt_for_file_name() {
  read -r -p "Enter the name of the certificate to verify: " file_name
}
```

<br />

### Command-Line Options Parsing

The script parses command-line options to enable verbose mode if specified:

```bash
parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    -v | --verbose)
      verbose=true
      shift
      ;;
    *)
      file_name="$1"
      shift
      ;;
    esac
  done

  if [ -z "$file_name" ]; then
    prompt_for_file_name
  fi
}
```

<br />

### Certificate Verification Process

The script verifies various types of certificates, printing section headers for
each step:

```bash
parse_arguments "$@"

case "$file_name" in
"trusted_id.pem")
  print_section_header "Verify Trusted Identity against Trusted Identity"
  verify_certificate "$certs_root_dir/trusted_id.pem" "$certs_root_dir/trusted_id.pem"
  ;;
"root_ca.pem")
  print_section_header "Verify Trusted Identity against Trusted Identity"
  verify_certificate "$certs_root_dir/trusted_id.pem" "$certs_root_dir/trusted_id.pem"

  print_section_header "Verify Root Certificate Authority against Trusted Identity"
  verify_certificate "$certs_root_dir/root_ca.pem" "$certs_root_dir/trusted_id.pem"

  print_section_header "Verify Root Certificate Authority Chain against Trusted Identity"
  verify_certificate "$certs_root_dir/root_ca_chain_bundle.pem" "$certs_root_dir/trusted_id.pem"
  ;;
"ca.pem")
  print_section_header "Verify Trusted Identity against Trusted Identity"
  verify_certificate "$certs_root_dir/trusted_id.pem" "$certs_root_dir/trusted_id.pem"

  print_section_header "Verify Root Certificate Authority against Trusted Identity"
  verify_certificate "$certs_root_dir/root_ca.pem" "$certs_root_dir/trusted_id.pem"

  print_section_header "Verify Root Certificate Authority Chain against Trusted Identity"
  verify_certificate "$certs_root_dir/root_ca_chain_bundle.pem" "$certs_root_dir/trusted_id.pem"

  print_section_header "Verify Intermediate Certificate Authority against the Root Certificate Authority"
  verify_certificate "$certs_intermediate_dir/ca.pem" "$certs_root_dir/root_ca_chain_bundle.pem"

  print_section_header "Verify Intermediate Certificate Authority Chain against the Root Certificate Authority Chain"
  verify_certificate "$certs_intermediate_dir/ca_chain_bundle.pem" "$certs_root_dir/root_ca_chain_bundle.pem"
  ;;
*)
  print_section_header "Verify Trusted Identity against Trusted Identity"
  verify_certificate "$certs_root_dir/trusted_id.pem" "$certs_root_dir/trusted_id.pem"

  print_section_header "Verify Root Certificate Authority against Trusted Identity"
  verify_certificate "$certs_root_dir/root_ca.pem" "$certs_root_dir/trusted_id.pem"

  print_section_header "Verify Root Certificate Authority Chain against Trusted Identity"
  verify_certificate "$certs_root_dir/root_ca_chain_bundle.pem" "$certs_root_dir/trusted_id.pem"

  print_section_header "Verify Intermediate Certificate Authority against the Root Certificate Authority"
  verify_certificate "$certs_intermediate_dir/ca.pem" "$certs_root_dir/root_ca_chain_bundle.pem"

  print_section_header "Verify Intermediate Certificate Authority Chain against the Root Certificate Authority Chain"
  verify_certificate "$certs_intermediate_dir/ca_chain_bundle.pem" "$certs_root_dir/root_ca_chain_bundle.pem"

  print_section_header "Verify Certificate against the Certificate Chain"
  verify_certificate "$certs_certificates_dir/${file_name}.pem" "$certs_certificates_dir/${file_name}_chain_bundle.pem"

  print_section_header "Verify Certificate against the Intermediate Certificate Chain"
  verify_certificate "$certs_certificates_dir/${file_name}.pem" "$certs_intermediate_dir/ca_chain_bundle.pem"

  print_section_header "Verify Certificate Chain against the Intermediate Certificate Chain"
  verify_certificate "$certs_certificates_dir/${file_name}_chain_bundle.pem" "$certs_intermediate_dir/ca_chain_bundle.pem"

  print_section_header "Verify Haproxy Certificate Chain against the Intermediate Certificate Chain"
  verify_certificate "$certs_certificates_dir/${file_name}_haproxy.pem" "$certs_intermediate_dir/ca_chain_bundle.pem"
  ;;
esac
```

<br />

### Exit the Script

Finally, the script exits successfully:

```bash
exit 0
```

<br />

## Conclusion

This script is a robust tool for verifying SSL/TLS certificates, ensuring they
are correctly chained to trusted root and intermediate certificates. The use of
the `openssl` command ensures thorough verification, and the optional verbose
mode provides additional detail for debugging or inspection purposes.

[verify_ssl_certificates.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/verify_ssl_certificates.sh
