---
title: "cert_ecdsa_server.info"
description:
  "This script automates the generation of an ECDSA server certificate, handling
  key generation, CSR creation, certificate issuance, and verification. It
  includes steps for directory path definition, random hexadecimal value
  generation, and certificate format conversion for compatibility with various
  applications."
url: "openssl/script-info/cert-ecdsa-server"
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
  - ECDSA
  - Server Certificate
  - Automation
  - Certificate Management
keywords:
  - ECDSA server certificate
  - key generation
  - CSR creation
  - certificate issuance
  - verification

weight: 8107

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`cert_ecdsa_server.sh`, authored by GJS (homelab-alpha), and its purpose is to
generate an ECDSA server certificate. The script automates the entire
certificate creation process, including generating a private key, creating a
Certificate Signing Request (CSR), issuing the final certificate, and bundling
it with an intermediate Certificate Authority (CA) chain. Additionally, it sets
up a certificate bundle for HAProxy, performs various verification checks, and
converts the certificate to different formats for compatibility with various
applications.

## Script Metadata

- **Filename**: `cert_ecdsa_server.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: November 9, 2026
- **Version**: 2.7.3
- **Description**: This script automates the generation of an ECDSA server
  certificate, handling key generation, CSR creation, certificate issuance, and
  verification.
- **RAW Script**: [cert_ecdsa_server.sh]

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

5. **build_ip_san**: This function turns a comma-separated list of IPv4
   addresses into subject alternative name entries. Spaces are ignored and
   duplicates are removed. It returns an error for an invalid address: an
   address needs four decimal numbers between 0 and 255, without leading zeros.

   ```bash
   # Function to turn a comma-separated list of IPv4 addresses into subject
   # alternative name entries (for example ", IP:192.168.0.1, IP:192.168.0.2").
   # Spaces are ignored and duplicates are removed. Returns 1 for invalid input.
   build_ip_san() {
     local list="${1// /}" ip octet san="" ips octets
     local -A seen=()
     if [[ -z "$list" || "$list" == ,* || "$list" == *, || "$list" == *,,* ]]; then
       return 1
     fi
     IFS=',' read -r -a ips <<<"$list"
     for ip in "${ips[@]}"; do
       # Four decimal octets without leading zeros, each between 0 and 255
       [[ "$ip" =~ ^(0|[1-9][0-9]{0,2})(\.(0|[1-9][0-9]{0,2})){3}$ ]] || return 1
       IFS='.' read -r -a octets <<<"$ip"
       for octet in "${octets[@]}"; do
         ((octet <= 255)) || return 1
       done
       if [[ -z "${seen[$ip]:-}" ]]; then
         seen[$ip]=1
         san+=", IP:$ip"
       fi
     done
     printf '%s' "$san"
   }
   ```

6. **Certificate Information**: Define the FQDN (Fully Qualified Domain Name)
   and the list of IPv4 addresses.

   ```bash
   fqdn=""
   ipv4=""
   ip_list=""
   non_interactive=false
   reuse_key=false

   # Function to parse arguments
   parse_arguments() {
     while [[ $# -gt 0 ]]; do
       case "$1" in
       --fqdn)
         [[ -n "$2" && "$2" =~ ^[A-Za-z0-9*][A-Za-z0-9._*-]*$ && "$2" != *..* ]] || {
           echo "[ERROR] --fqdn needs a valid FQDN." >&2
           exit 1
         }
         fqdn="$2"
         non_interactive=true
         shift 2
         ;;
       --ip)
         [[ -n "${2:-}" ]] || {
           echo "[ERROR] --ip needs one or more IPv4 addresses, separated by commas." >&2
           exit 1
         }
         ip_list+="${ip_list:+,}$2"
         shift 2
         # Without quotes, the shell splits "a, b" into separate arguments. Take the
         # next argument as well when the list so far ends with a comma, or when the
         # next argument starts with a comma.
         while [[ $# -gt 0 && "$1" != -* ]] && [[ "$ip_list" == *, || "$1" == ,* ]]; do
           ip_list+="$1"
           shift
         done
         ;;
       --reuse-key)
         reuse_key=true
         shift
         ;;
       -h | --help)
         sed -n '/^# Usage:/,/^$/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
         exit 0
         ;;
       *)
         echo "[ERROR] Unknown option: $1" >&2
         exit 1
         ;;
       esac
     done
   }

   parse_arguments "$@"

   # --ip is only accepted together with --fqdn
   if [[ -n "$ip_list" && "$non_interactive" == "false" ]]; then
     echo "[ERROR] --ip can only be used together with --fqdn." >&2
     exit 1
   fi

   # Ask for the details only when --fqdn is not given
   if [ "$non_interactive" = false ]; then
     read -r -p "$(print_cyan "Enter the FQDN name of the new certificate: ")" fqdn
     read -r -p "$(print_cyan "Enter the IPv4 addresses of the new certificate, separated by commas (empty for none): ")" ip_list
   fi

   # Validate the IPv4 addresses and build the subject alternative name entries
   if [[ -n "${ip_list// /}" ]]; then
     ipv4=$(build_ip_san "$ip_list") || {
       echo "[ERROR] Invalid IPv4 address list: ${ip_list}" >&2
       echo "Use IPv4 addresses without leading zeros, separated by commas (for example 192.168.0.1,192.168.0.2)." >&2
       exit 1
     }
   fi

   # In non-interactive mode the Common Name comes from the FQDN, so openssl req
   # does not ask for it again.
   req_subject=()
   if [ "$non_interactive" = true ]; then
     req_subject=(-subj "/CN=${fqdn}")
   fi
   ```

Without options, the script asks for the FQDN and the IPv4 addresses, as a plain
comma-separated list (or nothing). With `--fqdn <fqdn>` (and `--ip <list>` for
one or more IPv4 addresses, for example `--ip 192.168.0.1,192.168.0.2`), it runs
without questions: the Common Name is set to the FQDN, so `openssl req` does not
ask for it a second time. `--reuse-key` reuses the existing private key, and
`-h` shows the usage.

A space after a comma is allowed (`--ip 192.168.0.1, 192.168.1.1`). The shell
splits such a list into separate arguments, so the script takes the next
argument as well while the list so far ends with a comma, or when the next
argument starts with a comma. `--ip` can be repeated. Every address is validated
before anything is created, so an invalid address (such as `192.168.01` or
`256.1.1.1`) stops the script with an error.

<br />

## Main Script Execution

### Define Directory Paths

The script defines necessary directory paths for the Certificate components.

```bash
print_section_header "Define directory paths"
# Set the base directory. The old name ~/ssl is used while ~/tls does not exist.
base_dir="$HOME/tls"
if [ ! -e "$base_dir" ] && [ -d "$HOME/ssl" ]; then
  base_dir="$HOME/ssl"
  echo "Warning: using the old directory $HOME/ssl. Run tls_directory_migrate.sh to move it to $HOME/tls." >&2
fi
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
if awk -F'\t' -v cn="/CN=${fqdn}" '
  $1 == "V" && (substr($NF, length($NF) - length(cn) + 1) == cn || index($NF, cn "/")) { found = 1 }
  END { exit !found }' "$db_dir/index.txt" 2>/dev/null; then
  cn_exists=true
fi

if [[ "$unique_subject" == "yes" && "$cn_exists" == "true" ]]; then
  echo "[ERROR] unique_subject is enabled and a valid certificate with Common Name ${fqdn} already exists in index.txt." >&2
  echo "Revoke it, or run 'openssl ca -updatedb' if it has expired, and try again." >&2
  exit 1
fi
```

Only valid entries (status `V`, the first field of `index.txt`) count. A revoked
or expired entry does not block a new certificate with the same name. An entry
that is past its expiry date keeps status `V` until `openssl ca -updatedb` is
run, like `openssl ca` itself.

<br />

### Generate ECDSA Key

The script generates an ECDSA key for the Certificate using the secp384r1 curve
and saves it to the private directory.

```bash
# Generate ECDSA key, or reuse the existing key with --reuse-key
if [ "$reuse_key" = true ]; then
  print_section_header "Reuse existing ECDSA key"
  if [ ! -f "$private_certificates_dir/${fqdn}.pem" ]; then
    echo "[ERROR] No existing key found for ${fqdn} to reuse." >&2
    exit 1
  fi
else
  print_section_header "Generate ECDSA key"
  openssl ecparam -name secp384r1 -genkey -out "$private_certificates_dir/${fqdn}.pem"
  check_success "Failed to generate ECDSA key"
fi
```

With `--reuse-key`, the script keeps the existing private key of the FQDN and
stops when that key does not exist.

<br />

### Generate Certificate Signing Request (CSR)

A CSR for the Certificate is generated using the generated ECDSA key.

```bash
print_section_header "Generate Certificate Signing Request"
openssl req -new -sha384 -config "$openssl_conf_dir/cert.cnf" "${req_subject[@]}" -key "$private_certificates_dir/${fqdn}.pem" -out "$csr_dir/${fqdn}.pem"
check_success "Failed to generate Certificate Signing Request"
```

<br />

### Create an Extfile with All the Alternative Names

The script creates an extfile with alternative names for the certificate,
including DNS and IP addresses. A certificate holds the FQDN and `www.<fqdn>`.
For a wildcard FQDN, such as `*.example.test`, it holds the wildcard and the
domain itself (`example.test`) instead. The wildcard already covers
`www.example.test`, `www.*.example.test` is not a valid name, and a wildcard
does not cover the domain itself.

```bash
print_section_header "Create an extfile with all the alternative names"
if [[ "$fqdn" == \*.* ]]; then
  # A wildcard already covers www.<domain>, and www.*.<domain> is not valid.
  # Add the domain itself instead, because a wildcard does not cover it.
  san_names="DNS:${fqdn}, DNS:${fqdn#\*.}"
else
  san_names="DNS:${fqdn}, DNS:www.${fqdn}"
fi
{
  echo "subjectAltName = ${san_names}${ipv4}"
  echo "basicConstraints = critical, CA:FALSE"
  echo "keyUsage = critical, digitalSignature"
  echo "extendedKeyUsage = serverAuth"
  echo "nsComment = OpenSSL Generated Server Certificate"
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

### Create Certificate Chain Bundle for HAProxy

The script creates a certificate chain bundle specifically for HAProxy by
concatenating the certificate chain with the private key.

```bash
print_section_header "Create Certificate Chain Bundle for HAProxy"
cat "$certs_certificates_dir/${fqdn}_chain_bundle.pem" "$private_certificates_dir/${fqdn}.pem" >"$certs_certificates_dir/${fqdn}_haproxy.pem"
chmod 600 "$certs_certificates_dir/${fqdn}_haproxy.pem"
check_success "Failed to create Certificate Chain Bundle for HAProxy"
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
verify_certificate "$certs_intermediate_dir/ca_chain_bundle.pem" "$certs_certificates_dir/${fqdn}_haproxy.pem"
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

This comprehensive script ensures that every step in generating and managing an
ECDSA server certificate is performed correctly and securely, from key
generation to certificate verification and format conversion.

[cert_ecdsa_server.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_ecdsa_server.sh
