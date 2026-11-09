---
title: "renew_ssl_certificates.info"
description:
  "Renew server and client certificates before they expire, with an archive of
  the old files, verification, hooks, and a restore when a step fails."
url: "openssl/script-info/renew-ssl-certificates"
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
  - certificate renewal
  - OpenSSL scripts
  - certificate management
  - certificate automation
  - hooks
keywords:
  - certificate renewal
  - renew server certificate
  - renew client certificate
  - OpenSSL automation
  - homelab certificates

weight: 8113

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the script `renew_ssl_certificates.sh`. It renews server and
client certificates before they expire. It detects the kind of each certificate
from the existing files and calls the matching certificate script without
questions, so it contains no issuance logic of its own. The certificates are for
a homelab and for testing.

## Script Metadata

- **Filename**: `renew_ssl_certificates.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: November 8, 2026
- **Version**: 1.1.0
- **Description**: This script renews server and client certificates before they
  expire, and it keeps the old files in a dated archive.
- **RAW Script**: [renew_ssl_certificates.sh]

<br />

## Usage

```bash
./renew_ssl_certificates.sh [options] <fqdn>
./renew_ssl_certificates.sh [options] --all --within <days>
```

| Option          | Meaning                                                                      |
| :-------------- | :--------------------------------------------------------------------------- |
| `<fqdn>`        | Renew the certificate with this FQDN.                                        |
| `--all`         | Renew all server and client certificates that expire within `--within` days. |
| `--within DAYS` | Used with `--all`. Includes certificates that have expired already.          |
| `--reuse-key`   | Reuse the existing private key instead of a new key.                         |
| `--dry-run`     | Show the plan and exit. Nothing is asked or changed.                         |
| `--yes`         | Do not ask for confirmation (for cron and timers).                           |
| `-h`, `--help`  | Show the help.                                                               |

The alias is `openssl-renew`.

## Exit Codes

| Exit code | Meaning                                                 |
| :-------- | :------------------------------------------------------ |
| `0`       | Success, or nothing to renew.                           |
| `1`       | A renewal, a check, or a hook failed.                   |
| `2`       | Wrong usage or a pre-flight error. Nothing was changed. |

## What a Renewal Does

1. Archives the old key, certificate, and bundles in
   `~/ssl/archive/<fqdn>/<date>/`. Nothing is ever deleted.
2. Sets `unique_subject` to `no` for the duration of the run, because
   `openssl ca` refuses a second valid certificate with the same name.
3. Calls the matching certificate script with `--fqdn`, `--ip`, and
   `--reuse-key` as needed.
4. Verifies the chain, the private key, the names, and the HAProxy bundle (mode
   600). When a check fails, the old files are restored.
5. Marks the old entry in `index.txt` as revoked with the reason `superseded`.
   This is a database marking only. Run `revoke_ssl_certificates.sh --crl-only`
   afterwards to put it in the CRL.
6. Restores `unique_subject`, and runs the executable files in `~/ssl/hooks.d/`
   with the arguments
   `<fqdn> <certificate> <chain_bundle> <key> <haproxy_bundle>`.

CA certificates are never renewed. The script warns when one expires soon. The
CA private keys are not encrypted, so an unattended renewal can read the
intermediate CA key.

<br />

## Detailed Explanation

The sections below follow the script from top to bottom.

<br />

### Define directory paths

```bash
# Define directory paths
base_dir="$HOME/ssl"
certs_dir="$base_dir/certs"
private_dir="$base_dir/private"
db_dir="$base_dir/db"
certs_root_dir="$certs_dir/root"
certs_intermediate_dir="$certs_dir/intermediate"
certs_certificates_dir="$certs_dir/certificates"
private_certificates_dir="$private_dir/certificates"
hooks_dir="$base_dir/hooks.d"
archive_root="$base_dir/archive"
lock_file="$base_dir/.renew.lock"
attr_file="$db_dir/index.txt.attr"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
certificate_script_dir="$script_dir/certificate"
```

<br />

### Defaults

```bash
# Defaults
target_fqdn=""
renew_all=false
within_days=""
reuse_key=false
dry_run=false
assume_yes=false
ca_warn_days=180
```

<br />

### State

```bash
# State
plan_fqdn=()
plan_algo=()
plan_kind=()
plan_ip=()
plan_expires=()
plan_failed=0
attr_changed=false
attr_created=false
attr_original=""
renewed=0
failed=0
```

<br />

### Function: print text in cyan color

Function to print text in cyan color.

```bash
# Function to print text in cyan color
print_cyan() {
  echo -e "\e[36m$1\e[0m"
}
```

<br />

### Function: print an error message

Function to print an error message.

```bash
# Function to print an error message
print_error() {
  echo "[ERROR] $1" >&2
}
```

<br />

### Function: print a warning message

Function to print a warning message.

```bash
# Function to print a warning message
print_warning() {
  echo -e "\e[33m[WARNING] $1\e[0m" >&2
}
```

<br />

### Function: show the help text

Function to show the help text.

```bash
# Function to show the help text
show_help() {
  sed -n '/^# Usage:/,/^# Hooks:/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
}
```

<br />

### Function: check that a value is a positive integer

Function to check that a value is a positive integer.

```bash
# Function to check that a value is a positive integer
is_number() {
  [[ "$1" =~ ^[0-9]+$ ]]
}
```

<br />

### Function: check that a value is a usable FQDN

Function to check that a value is a usable FQDN.

```bash
# Function to check that a value is a usable FQDN
is_valid_fqdn() {
  [[ -n "$1" && "$1" =~ ^[A-Za-z0-9*][A-Za-z0-9._*-]*$ && "$1" != *..* ]]
}
```

<br />

### Function: parse arguments

Function to parse arguments.

```bash
# Function to parse arguments
parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    --all)
      renew_all=true
      shift
      ;;
    --within)
      is_number "$2" || {
        print_error "--within needs a number of days."
        exit 2
      }
      within_days="$2"
      shift 2
      ;;
    --reuse-key)
      reuse_key=true
      shift
      ;;
    --dry-run)
      dry_run=true
      shift
      ;;
    --yes)
      assume_yes=true
      shift
      ;;
    -h | --help)
      show_help
      exit 0
      ;;
    -*)
      print_error "Unknown option: $1"
      exit 2
      ;;
    *)
      [ -z "$target_fqdn" ] || {
        print_error "Give only one FQDN, or use --all --within <days>."
        exit 2
      }
      target_fqdn="$1"
      shift
      ;;
    esac
  done

  if [ "$renew_all" = true ]; then
    [ -z "$target_fqdn" ] || {
      print_error "Use either an FQDN or --all, not both."
      exit 2
    }
    [ -n "$within_days" ] || {
      print_error "--all needs --within <days>."
      exit 2
    }
  else
    [ -z "$within_days" ] || {
      print_error "--within can only be used together with --all."
      exit 2
    }
    [ -n "$target_fqdn" ] || {
      print_error "Give an FQDN, or use --all --within <days>."
      exit 2
    }
  fi
}
```

<br />

### Function: check that everything needed is present, before anything changes

Function to check that everything needed is present, before anything changes.

```bash
# Function to check that everything needed is present, before anything changes
preflight() {
  local missing=false file

  command -v openssl >/dev/null 2>&1 || {
    print_error "OpenSSL is not installed."
    exit 2
  }

  cd "$HOME" || {
    print_error "Cannot change to $HOME."
    exit 2
  }

  for file in \
    "$certs_intermediate_dir/ca.pem" \
    "$certs_intermediate_dir/ca_chain_bundle.pem" \
    "$private_dir/intermediate/ca.pem" \
    "$db_dir/index.txt" \
    "$db_dir/serial" \
    "$base_dir/openssl.cnf/cert.cnf"; do
    if [ ! -f "$file" ]; then
      print_error "Required file not found: $file"
      missing=true
    fi
  done
  [ -d "$certs_certificates_dir" ] || {
    print_error "Directory not found: $certs_certificates_dir"
    missing=true
  }
  for file in cert_rsa_server cert_ecdsa_server cert_rsa_client cert_ecdsa_client cert_ecdsa_localhost; do
    if [ ! -f "$certificate_script_dir/$file.sh" ]; then
      print_error "Certificate script not found: $certificate_script_dir/$file.sh"
      missing=true
    fi
  done
  [ "$missing" = false ] || exit 2

  # The intermediate CA must still be usable
  if ! openssl x509 -in "$certs_intermediate_dir/ca.pem" -noout -checkend 0 >/dev/null 2>&1; then
    print_error "The intermediate CA certificate has expired or is not readable. Renew the CA first."
    exit 2
  fi
}
```

<br />

### Function: warn about CA certificates that expire soon

Function to warn about CA certificates that expire soon.

```bash
# Function to warn about CA certificates that expire soon
warn_ca_certificates() {
  local days="$ca_warn_days" file name
  [ -z "$within_days" ] || [ "$within_days" -le "$days" ] || days="$within_days"
  for file in "$certs_root_dir"/trusted_id.pem "$certs_root_dir"/root_ca.pem "$certs_intermediate_dir"/ca.pem; do
    [ -f "$file" ] || continue
    name=$(basename "$file" .pem)
    if ! openssl x509 -in "$file" -noout -checkend "$((days * 86400))" >/dev/null 2>&1; then
      print_warning "CA certificate '$name' expires within $days days. This script does not renew CA certificates."
    fi
  done
}
```

<br />

### Function: get the normalized subject alternative names of a certificate

Function to get the normalized subject alternative names of a certificate.

```bash
# Function to get the normalized subject alternative names of a certificate
get_san() {
  openssl x509 -in "$1" -noout -ext subjectAltName 2>/dev/null | tail -n +2 | tr -d ' ' | tr ',' '\n' | sort
}
```

<br />

### Function: check if a certificate is revoked in the database (status R)

Function to check if a certificate is revoked in the database (status R).

```bash
# Function to check if a certificate is revoked in the database (status R)
is_revoked() {
  local serial
  serial=$(openssl x509 -in "$1" -noout -serial 2>/dev/null)
  serial="${serial#serial=}"
  awk -F'\t' -v s="$serial" '
    function norm(x) { x = toupper(x); sub(/^0+/, "", x); return x }
    $1 == "R" && norm($4) == norm(s) { found = 1 }
    END { exit !found }' "$db_dir/index.txt"
}
```

<br />

### Function: detect the kind of a certificate and add it to the plan

Function to detect the kind of a certificate and add it to the plan.

```bash
# Function to detect the kind of a certificate and add it to the plan
plan_certificate() {
  local fqdn="$1" cert="$certs_certificates_dir/$1.pem" text algo kind enddate token ips=() ip=""

  if [ ! -f "$cert" ]; then
    print_error "No certificate found for $fqdn in $certs_certificates_dir."
    return 1
  fi
  text=$(openssl x509 -in "$cert" -noout -text 2>/dev/null) || {
    print_error "Cannot read the certificate of $fqdn."
    return 1
  }
  if is_revoked "$cert"; then
    print_error "$fqdn is revoked. Issue a new certificate with the certificate scripts."
    return 1
  fi

  # RSA or ECDSA, from the public key algorithm
  case "$text" in
  *"Public Key Algorithm: rsaEncryption"*) algo="rsa" ;;
  *"Public Key Algorithm: id-ecPublicKey"*) algo="ecdsa" ;;
  *)
    print_error "Unsupported public key algorithm for $fqdn."
    return 1
    ;;
  esac

  # Server or client, from the extended key usage
  if [[ "$text" == *"TLS Web Server Authentication"* ]]; then
    kind="server"
  elif [[ "$text" == *"TLS Web Client Authentication"* ]]; then
    kind="client"
  else
    print_error "$fqdn is not a server or client certificate (extended key usage)."
    return 1
  fi

  if [ "$reuse_key" = true ] && [ ! -f "$private_certificates_dir/$fqdn.pem" ]; then
    print_error "--reuse-key: no private key found for $fqdn."
    return 1
  fi

  # The names must be the ones that the certificate scripts create
  if [ "$fqdn" = "localhost" ]; then
    if [ "$algo" != "ecdsa" ] || [ "$kind" != "server" ]; then
      print_error "localhost can only be renewed as an ECDSA server certificate."
      return 1
    fi
  else
    while IFS= read -r token; do
      case "$token" in
      "DNS:$fqdn" | "DNS:www.$fqdn") ;;
      IPAddress:*) ips+=("${token#IPAddress:}") ;;
      *)
        print_error "$fqdn has other names than the certificate scripts create ($token). Renew it by hand."
        return 1
        ;;
      esac
    done < <(get_san "$cert")
    if [ "${#ips[@]}" -gt 1 ] || { [ "${#ips[@]}" -eq 1 ] && [ "$kind" = "client" ]; }; then
      print_error "$fqdn has IP addresses that the certificate scripts cannot reproduce. Renew it by hand."
      return 1
    fi
    ip="${ips[0]:-}"
  fi

  enddate=$(openssl x509 -in "$cert" -noout -enddate 2>/dev/null)
  plan_fqdn+=("$fqdn")
  plan_algo+=("$algo")
  plan_kind+=("$kind")
  plan_ip+=("$ip")
  plan_expires+=("${enddate#notAfter=}")
}
```

<br />

### Function: select the certificates to renew

Function to select the certificates to renew.

```bash
# Function to select the certificates to renew
select_targets() {
  local file name

  if [ "$renew_all" = false ]; then
    case "$target_fqdn" in
    trusted_id | root_ca | ca)
      print_error "'$target_fqdn' is a CA certificate. This script does not renew CA certificates."
      exit 2
      ;;
    esac
    is_valid_fqdn "$target_fqdn" || {
      print_error "'$target_fqdn' is not a valid FQDN."
      exit 2
    }
    plan_certificate "$target_fqdn" || exit 2
    return
  fi

  for file in "$certs_certificates_dir"/*.pem; do
    [ -f "$file" ] || continue
    name=$(basename "$file" .pem)
    case "$name" in
    *_chain_bundle | *_haproxy | *_bundle) continue ;;
    esac
    if openssl x509 -in "$file" -noout -checkend "$((within_days * 86400))" >/dev/null 2>&1; then
      continue
    fi
    # A revoked certificate is not renewed
    if is_revoked "$file"; then
      continue
    fi
    plan_certificate "$name" || plan_failed=$((plan_failed + 1))
  done
}
```

<br />

### Function: print the plan

Function to print the plan.

```bash
# Function to print the plan
print_plan() {
  local i
  print_cyan "=== Renewal plan ==="
  printf '%-40s %-6s %-7s %-26s %s\n' "FQDN" "ALGO" "ROLE" "EXPIRES" "KEY"
  for i in "${!plan_fqdn[@]}"; do
    printf '%-40s %-6s %-7s %-26s %s\n' "${plan_fqdn[$i]}" "${plan_algo[$i]}" "${plan_kind[$i]}" "${plan_expires[$i]}" \
      "$([ "$reuse_key" = true ] && echo "reuse" || echo "new")"
  done
  echo
  echo "Old files are archived in $archive_root/<fqdn>/<date> first. Nothing is deleted."
}
```

<br />

### Function: ask for confirmation

Function to ask for confirmation.

```bash
# Function to ask for confirmation
confirm() {
  local answer
  read -r -p "Do you want to continue? (yes/no): " answer
  [[ "$answer" == "yes" ]]
}
```

<br />

### Function: normalize a serial number (uppercase, without leading zeros)

Function to normalize a serial number (uppercase, without leading zeros).

```bash
# Function to normalize a serial number (uppercase, without leading zeros)
normalize_serial() {
  local value="${1#serial=}"
  printf '%s' "$value" | tr 'a-f' 'A-F' | sed 's/^0*//'
}
```

<br />

### Function: list the serial numbers of the valid (V) entries of an FQDN

Function to list the serial numbers of the valid (V) entries of an FQDN.

```bash
# Function to list the serial numbers of the valid (V) entries of an FQDN
list_valid_serials() {
  awk -F'\t' -v cn="/CN=$1" '
    $1 == "V" && (substr($NF, length($NF) - length(cn) + 1) == cn || index($NF, cn "/")) { print $4 }' \
    "$db_dir/index.txt"
}
```

<br />

### Function: check that no subject has more than one valid entry

Function to check that no subject has more than one valid entry.

```bash
# Function to check that no subject has more than one valid entry
database_is_unique() {
  [ -z "$(awk -F'\t' '$1 == "V" { if (seen[$NF]++) print $NF }' "$db_dir/index.txt")" ]
}
```

<br />

### Function: mark all valid entries of an FQDN, except one, as superseded

Function to mark all valid entries of an FQDN, except one, as superseded.

```bash
# Function to mark all valid entries of an FQDN, except one, as superseded
supersede_entries() {
  local fqdn="$1" keep status=0 serial
  keep=$(normalize_serial "$2")
  while IFS= read -r serial; do
    [ -n "$serial" ] || continue
    [ "$(normalize_serial "$serial")" != "$keep" ] || continue
    if ! openssl ca -config "$base_dir/openssl.cnf/cert.cnf" -revoke "$base_dir/newcerts/$serial.pem" \
      -crl_reason superseded >>"$log" 2>&1; then
      print_error "Cannot mark database entry $serial of $fqdn as superseded."
      status=1
    fi
  done < <(list_valid_serials "$fqdn")
  return $status
}
```

<br />

### Function: set unique_subject to no for the renewals

Function to set unique_subject to no for the renewals.

```bash
# Function to set unique_subject to no for the renewals
disable_unique_subject() {
  if [ -f "$attr_file" ]; then
    attr_original=$(cat "$attr_file")
  else
    attr_created=true
  fi
  attr_changed=true
  echo "unique_subject = no" >"$attr_file"
}
```

<br />

### Function: restore index.txt.attr to its original content

Function to restore index.txt.attr to its original content.

```bash
# Function to restore index.txt.attr to its original content
restore_unique_subject() {
  [ "$attr_changed" = true ] || return 0
  if ! database_is_unique; then
    print_warning "index.txt has valid entries with the same name. unique_subject stays 'no' in $attr_file. Revoke or remove the extra entries and set it back to 'yes'."
    attr_changed=false
    return 0
  fi
  if [ "$attr_created" = true ]; then
    rm -f "$attr_file"
  else
    printf '%s\n' "$attr_original" >"$attr_file"
  fi
  attr_changed=false
}
```

<br />

### Function: archive the files of a certificate

Function to archive the files of a certificate.

```bash
# Function to archive the files of a certificate
archive_certificate() {
  local fqdn="$1" stamp dir n=0 rel
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  (umask 077 && mkdir -p "$archive_root/$fqdn") || return 1
  dir="$archive_root/$fqdn/$stamp"
  until (umask 077 && mkdir "$dir") 2>/dev/null; do
    n=$((n + 1))
    [ "$n" -lt 100 ] || return 1
    dir="$archive_root/$fqdn/$stamp-$n"
  done
  archive_dir="$dir"

  for rel in \
    "certs/certificates/$fqdn.pem" \
    "certs/certificates/$fqdn.crt" \
    "certs/certificates/${fqdn}_chain_bundle.pem" \
    "certs/certificates/${fqdn}_chain_bundle.crt" \
    "certs/certificates/${fqdn}_haproxy.pem" \
    "private/certificates/$fqdn.pem" \
    "private/certificates/$fqdn.key" \
    "csr/$fqdn.pem" \
    "extfiles/$fqdn.cnf"; do
    [ -f "$base_dir/$rel" ] || continue
    (umask 077 && mkdir -p "$archive_dir/$(dirname "$rel")" && cp -p "$base_dir/$rel" "$archive_dir/$rel") || return 1
  done
}
```

<br />

### Function: restore the archived files of a certificate

Function to restore the archived files of a certificate.

```bash
# Function to restore the archived files of a certificate
restore_archive() {
  local rel
  while IFS= read -r -d '' rel; do
    rel="${rel#./}"
    cp -p "$archive_dir/$rel" "$base_dir/$rel" || return 1
  done < <(cd "$archive_dir" && find . -type f ! -name renew.log -print0)
}
```

<br />

### Function: check a renewed certificate

Function to check a renewed certificate.

```bash
# Function to check a renewed certificate
check_renewal() {
  local fqdn="$1" old_serial="$2" old_san="$3"
  local cert="$certs_certificates_dir/$fqdn.pem"
  local chain="$certs_certificates_dir/${fqdn}_chain_bundle.pem"
  local haproxy="$certs_certificates_dir/${fqdn}_haproxy.pem"
  local key="$private_certificates_dir/$fqdn.pem"

  openssl verify -CAfile "$certs_intermediate_dir/ca_chain_bundle.pem" "$cert" >>"$log" 2>&1 || {
    print_error "The new certificate does not verify against the CA chain."
    return 1
  }
  openssl verify -CAfile "$certs_intermediate_dir/ca_chain_bundle.pem" "$chain" >>"$log" 2>&1 || {
    print_error "The new chain bundle does not verify."
    return 1
  }
  openssl x509 -in "$cert" -noout -checkend 0 >/dev/null 2>&1 || {
    print_error "The new certificate has already expired."
    return 1
  }
  [ "$(openssl x509 -in "$cert" -noout -serial)" != "$old_serial" ] || {
    print_error "The certificate was not replaced (same serial number)."
    return 1
  }
  [ "$(openssl x509 -in "$cert" -noout -pubkey 2>/dev/null)" = "$(openssl pkey -in "$key" -pubout 2>/dev/null)" ] || {
    print_error "The new certificate does not match the private key."
    return 1
  }
  [ "$(get_san "$cert")" = "$old_san" ] || {
    print_error "The names of the new certificate differ from the old certificate."
    return 1
  }
  if [ -f "$haproxy" ]; then
    [ "$(stat -c %a "$haproxy")" = "600" ] || {
      print_error "The HAProxy bundle does not have mode 600."
      return 1
    }
    openssl verify -CAfile "$certs_intermediate_dir/ca_chain_bundle.pem" "$haproxy" >>"$log" 2>&1 || {
      print_error "The HAProxy bundle does not verify."
      return 1
    }
  fi
  if ! openssl x509 -in "$certs_intermediate_dir/ca.pem" -noout -checkend "$((366 * 86400))" >/dev/null 2>&1; then
    print_warning "The intermediate CA expires within the validity of the new certificate of $fqdn."
  fi
}
```

<br />

### Function: run the hooks after a successful renewal

Function to run the hooks after a successful renewal.

```bash
# Function to run the hooks after a successful renewal
run_hooks() {
  local fqdn="$1" hook status=0
  local haproxy="$certs_certificates_dir/${fqdn}_haproxy.pem"
  [ -f "$haproxy" ] || haproxy=""
  [ -d "$hooks_dir" ] || return 0
  for hook in "$hooks_dir"/*; do
    [ -f "$hook" ] && [ -x "$hook" ] || continue
    if ! "$hook" "$fqdn" "$certs_certificates_dir/$fqdn.pem" "$certs_certificates_dir/${fqdn}_chain_bundle.pem" \
      "$private_certificates_dir/$fqdn.key" "$haproxy" >>"$log" 2>&1 9>&-; then
      print_error "Hook failed: $hook (see $log)"
      status=1
    fi
  done
  return $status
}
```

<br />

### Function: renew one certificate

Function to renew one certificate.

```bash
# Function to renew one certificate
renew_certificate() {
  local i="$1" fqdn="${plan_fqdn[$1]}" old_serial old_san script args=()

  echo
  print_cyan "=== Renew $fqdn ==="

  archive_certificate "$fqdn" || {
    print_error "Cannot archive the files of $fqdn. Nothing was changed."
    return 1
  }
  log="$archive_dir/renew.log"
  echo "Archive: $archive_dir"

  old_serial=$(openssl x509 -in "$certs_certificates_dir/$fqdn.pem" -noout -serial)
  old_san=$(get_san "$certs_certificates_dir/$fqdn.pem")

  # Select the certificate script. The names come from the old certificate.
  if [ "$fqdn" = "localhost" ]; then
    script="$certificate_script_dir/cert_ecdsa_localhost.sh"
    args=(--non-interactive)
  else
    script="$certificate_script_dir/cert_${plan_algo[$i]}_${plan_kind[$i]}.sh"
    args=(--fqdn "$fqdn")
    [ -z "${plan_ip[$i]}" ] || args+=(--ip "${plan_ip[$i]}")
  fi
  [ "$reuse_key" = false ] || args+=(--reuse-key)

  if bash "$script" "${args[@]}" </dev/null >"$log" 2>&1 9>&- && check_renewal "$fqdn" "$old_serial" "$old_san"; then
    # The old entry is superseded by the new certificate
    supersede_entries "$fqdn" "$(openssl x509 -in "$certs_certificates_dir/$fqdn.pem" -noout -serial)" || failed=$((failed + 1))
    echo "Renewed: $(openssl x509 -in "$certs_certificates_dir/$fqdn.pem" -noout -enddate)"
    run_hooks "$fqdn" || failed=$((failed + 1))
    renewed=$((renewed + 1))
    return 0
  fi

  print_error "Renewal of $fqdn failed. Last lines of $log:"
  tail -n 10 "$log" >&2
  if restore_archive; then
    echo "The old files of $fqdn were restored from $archive_dir." >&2
  else
    print_error "Restoring failed. Copy the files from $archive_dir back by hand."
  fi
  # A certificate that was issued but rolled back must not stay valid in the database
  supersede_entries "$fqdn" "$old_serial" || true
  return 1
}
```

<br />

### Main process

```bash
# Main process
parse_arguments "$@"
preflight
select_targets
warn_ca_certificates

if [ "${#plan_fqdn[@]}" -eq 0 ]; then
  if [ "$plan_failed" -gt 0 ]; then
    exit 1
  fi
  echo "Nothing to renew."
  exit 0
fi

print_plan

if [ "$dry_run" = true ]; then
  [ "$plan_failed" -eq 0 ] || exit 1
  exit 0
fi

if [ "$assume_yes" = false ] && ! confirm; then
  echo "Cancelled. Nothing was changed."
  exit 0
fi
```

<br />

### Prevent two renewals at the same time. The scripts and hooks that this script

Prevent two renewals at the same time. The scripts and hooks that this script
starts do not inherit the lock (9>&-), so a hook cannot keep it.

```bash
# Prevent two renewals at the same time. The scripts and hooks that this script
# starts do not inherit the lock (9>&-), so a hook cannot keep it.
if command -v flock >/dev/null 2>&1; then
  exec 9>"$lock_file"
  flock -n 9 || {
    print_error "Another renewal is running."
    exit 2
  }
else
  print_warning "flock is not installed, so overlapping renewals are not prevented."
fi

trap restore_unique_subject EXIT
trap 'exit 1' INT TERM
disable_unique_subject

for i in "${!plan_fqdn[@]}"; do
  if ! renew_certificate "$i"; then
    failed=$((failed + 1))
  fi
done

restore_unique_subject

echo
print_cyan "Renewed: $renewed. Failed: $((failed + plan_failed))."
if [ "$((failed + plan_failed))" -gt 0 ]; then
  exit 1
fi
exit 0
```

<br />

## Conclusion

This script renews server and client certificates before they expire, and it
keeps the old files in a dated archive.

[renew_ssl_certificates.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/renew_ssl_certificates.sh
