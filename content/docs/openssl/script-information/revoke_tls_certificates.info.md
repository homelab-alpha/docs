---
title: "revoke_tls_certificates.info"
description:
  "Revoke a server or client certificate and generate a Certificate Revocation
  List (CRL), with a copy of the database and a check of the CRL."
url: "openssl/script-info/revoke-tls-certificates"
aliases:
  - "openssl/script-info/revoke-ssl-certificates"
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
  - certificate revocation
  - CRL
  - OpenSSL scripts
  - certificate management
  - exit codes
keywords:
  - revoke certificate
  - certificate revocation list
  - openssl ca revoke
  - openssl ca gencrl
  - homelab certificates

weight: 8114

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the script `revoke_tls_certificates.sh`. It revokes a server or
client certificate and generates a Certificate Revocation List (CRL). It marks
the valid entry of the FQDN as revoked in the CA database, and then creates a
new CRL that is signed by the intermediate CA and checked against the CA chain.
The script does not delete any file. The certificates are for a homelab and for
testing.

## Script Metadata

- **Filename**: `revoke_tls_certificates.sh`
- **Old name**: `revoke_ssl_certificates.sh` (a wrapper that starts this script)
- **Author**: GJS (homelab-alpha)
- **Date**: November 9, 2026
- **Version**: 1.1.0
- **Description**: This script revokes a server or client certificate and
  generates a Certificate Revocation List (CRL) that is checked against the CA
  chain.
- **RAW Script**: [revoke_tls_certificates.sh]

<br />

## Usage

```bash
./revoke_tls_certificates.sh [options] <fqdn>
./revoke_tls_certificates.sh [options] --crl-only
```

| Option            | Meaning                                                                                                  |
| :---------------- | :------------------------------------------------------------------------------------------------------- |
| `<fqdn>`          | Revoke the valid certificate with this FQDN.                                                             |
| `--reason REASON` | `unspecified` (default), `keyCompromise`, `affiliationChanged`, `superseded`, or `cessationOfOperation`. |
| `--no-crl`        | Revoke, but do not generate a new CRL.                                                                   |
| `--crl-only`      | Only generate a new CRL. Nothing is revoked, and nothing is asked.                                       |
| `--dry-run`       | Show the plan and exit. Nothing is asked or changed.                                                     |
| `--yes`           | Do not ask for confirmation (for scripts).                                                               |
| `-h`, `--help`    | Show the help.                                                                                           |

The alias is `openssl-revoke`.

## Exit Codes

| Exit code | Meaning                                                 |
| :-------- | :------------------------------------------------------ |
| `0`       | Success.                                                |
| `1`       | A revocation, the CRL, or a check failed.               |
| `2`       | Wrong usage or a pre-flight error. Nothing was changed. |

## What a Revocation Does

1. Takes the lock `~/tls/.renew.lock`, so a revocation and a renewal never run
   at the same time.
2. Saves a copy of `~/tls/db/index.txt` in `~/tls/archive/_database/`.
3. Marks the valid entry of the FQDN as revoked (status `R`) with the reason.
4. Generates the CRL in a temporary file, checks it with the CA chain, and then
   moves it to `~/tls/crl/ca_crl.pem`. When the check fails, the previous CRL
   stays.

The key, the certificate, and the bundles of the revoked certificate stay where
they are, so stop using them yourself. CA certificates are never revoked.

The certificates have no CRL distribution point, so clients do not find the CRL
by themselves. Install `ca_crl.pem` where it is used, for example in the
configuration of HAProxy or nginx. A CRL is valid for 30 days, so generate a new
one with `--crl-only` before it expires.

<br />

## Detailed Explanation

The sections below follow the script from top to bottom.

<br />

### Define directory paths

Define directory paths Set the base directory. The old name ~/ssl is used while
~/tls does not exist.

```bash
# Define directory paths
# Set the base directory. The old name ~/ssl is used while ~/tls does not exist.
base_dir="$HOME/tls"
if [ ! -e "$base_dir" ] && [ -d "$HOME/ssl" ]; then
  base_dir="$HOME/ssl"
  echo "Warning: using the old directory $HOME/ssl. Run tls_directory_migrate.sh to move it to $HOME/tls." >&2
fi
certs_dir="$base_dir/certs"
private_dir="$base_dir/private"
db_dir="$base_dir/db"
certs_intermediate_dir="$certs_dir/intermediate"
crl_dir="$base_dir/crl"
crl_backup_dir="$base_dir/crl-backup"
newcerts_dir="$base_dir/newcerts"
archive_root="$base_dir/archive"
database_backup_dir="$archive_root/_database"
lock_file="$base_dir/.renew.lock"
config_file="$base_dir/openssl.cnf/cert.cnf"
crl_file="$crl_dir/ca_crl.pem"
```

<br />

### Defaults

```bash
# Defaults
target_fqdn=""
reason="unspecified"
generate_crl=true
crl_only=false
dry_run=false
assume_yes=false
```

<br />

### State

```bash
# State
plan_serials=()
plan_expires=()
log=""
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
  sed -n '/^# Usage:/,/^# Exit codes:/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
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

### Function: check that a reason is supported

Function to check that a reason is supported.

```bash
# Function to check that a reason is supported
is_valid_reason() {
  case "$1" in
  unspecified | keyCompromise | affiliationChanged | superseded | cessationOfOperation) return 0 ;;
  *) return 1 ;;
  esac
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
    --reason)
      is_valid_reason "$2" || {
        print_error "--reason needs one of: unspecified, keyCompromise, affiliationChanged, superseded, cessationOfOperation."
        exit 2
      }
      reason="$2"
      shift 2
      ;;
    --no-crl)
      generate_crl=false
      shift
      ;;
    --crl-only)
      crl_only=true
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
        print_error "Give only one FQDN."
        exit 2
      }
      target_fqdn="$1"
      shift
      ;;
    esac
  done

  if [ "$crl_only" = true ]; then
    [ -z "$target_fqdn" ] || {
      print_error "--crl-only does not take an FQDN."
      exit 2
    }
    [ "$generate_crl" = true ] || {
      print_error "--crl-only and --no-crl cannot be used together."
      exit 2
    }
  else
    [ -n "$target_fqdn" ] || {
      print_error "Give an FQDN, or use --crl-only."
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
    "$db_dir/crlnumber" \
    "$config_file"; do
    if [ ! -f "$file" ]; then
      print_error "Required file not found: $file"
      missing=true
    fi
  done
  [ -d "$crl_dir" ] || {
    print_error "Directory not found: $crl_dir"
    missing=true
  }
  [ "$missing" = false ] || exit 2

  # The intermediate CA must still be usable to sign the CRL
  if ! openssl x509 -in "$certs_intermediate_dir/ca.pem" -noout -checkend 0 >/dev/null 2>&1; then
    print_error "The intermediate CA certificate has expired or is not readable."
    exit 2
  fi
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

### Function: check if an FQDN has an entry with status R

Function to check if an FQDN has an entry with status R.

```bash
# Function to check if an FQDN has an entry with status R
has_revoked_entry() {
  awk -F'\t' -v cn="/CN=$1" '
    $1 == "R" && (substr($NF, length($NF) - length(cn) + 1) == cn || index($NF, cn "/")) { found = 1 }
    END { exit !found }' "$db_dir/index.txt"
}
```

<br />

### Function: select the entries to revoke

Function to select the entries to revoke.

```bash
# Function to select the entries to revoke
select_targets() {
  local serial cert enddate

  case "$target_fqdn" in
  trusted_id | root_ca | ca)
    print_error "'$target_fqdn' is a CA certificate. This script does not revoke CA certificates."
    exit 2
    ;;
  esac
  is_valid_fqdn "$target_fqdn" || {
    print_error "'$target_fqdn' is not a valid FQDN."
    exit 2
  }

  while IFS= read -r serial; do
    [ -n "$serial" ] || continue
    cert="$newcerts_dir/$serial.pem"
    if [ ! -f "$cert" ]; then
      print_error "The certificate file of serial $serial is missing: $cert"
      exit 2
    fi
    enddate=$(openssl x509 -in "$cert" -noout -enddate 2>/dev/null)
    plan_serials+=("$serial")
    plan_expires+=("${enddate#notAfter=}")
  done < <(list_valid_serials "$target_fqdn")

  if [ "${#plan_serials[@]}" -eq 0 ]; then
    if has_revoked_entry "$target_fqdn"; then
      print_error "No valid certificate found for $target_fqdn. It is already revoked."
    else
      print_error "No valid certificate found for $target_fqdn in $db_dir/index.txt."
    fi
    exit 2
  fi
}
```

<br />

### Function: print the plan

Function to print the plan.

```bash
# Function to print the plan
print_plan() {
  local i
  print_cyan "=== Revocation plan ==="
  printf '%-40s %-34s %-26s %s\n' "FQDN" "SERIAL" "EXPIRES" "REASON"
  for i in "${!plan_serials[@]}"; do
    printf '%-40s %-34s %-26s %s\n' "$target_fqdn" "${plan_serials[$i]}" "${plan_expires[$i]}" "$reason"
  done
  echo
  echo "The database entry is marked as revoked. No file is deleted."
  if [ "$generate_crl" = true ]; then
    echo "A new CRL is generated in $crl_file."
  fi
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

### Function: save a copy of the database before it changes

Function to save a copy of the database before it changes.

```bash
# Function to save a copy of the database before it changes
backup_database() {
  local stamp
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  (umask 077 && mkdir -p "$database_backup_dir") || return 1
  (umask 077 && cp -p "$db_dir/index.txt" "$database_backup_dir/index.txt.$stamp") || return 1
  log="$database_backup_dir/revoke.$stamp.log"
  echo "Database copy: $database_backup_dir/index.txt.$stamp"
}
```

<br />

### Function: revoke the planned entries

Function to revoke the planned entries.

```bash
# Function to revoke the planned entries
revoke_entries() {
  local serial status=0
  for serial in "${plan_serials[@]}"; do
    if openssl ca -config "$config_file" -revoke "$newcerts_dir/$serial.pem" -crl_reason "$reason" >>"$log" 2>&1 9>&-; then
      echo "Revoked: $serial ($reason)"
    else
      print_error "Cannot revoke serial $serial. Last lines of $log:"
      tail -n 10 "$log" >&2
      status=1
    fi
  done

  # No valid entry may be left for this FQDN
  if [ "$status" -eq 0 ] && [ -n "$(list_valid_serials "$target_fqdn")" ]; then
    print_error "$target_fqdn still has a valid entry in $db_dir/index.txt."
    status=1
  fi
  return $status
}
```

<br />

### Function: generate and check the CRL

Function to generate and check the CRL.

```bash
# Function to generate and check the CRL
create_crl() {
  local stamp count
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  if [ -z "$log" ]; then
    (umask 077 && mkdir -p "$database_backup_dir") || return 1
    log="$database_backup_dir/crl.$stamp.log"
  fi

  # Keep the previous CRL
  if [ -f "$crl_file" ]; then
    (umask 077 && mkdir -p "$crl_backup_dir" && cp -p "$crl_file" "$crl_backup_dir/ca_crl.$stamp.pem") || {
      print_error "Cannot save the previous CRL. The CRL was not changed."
      return 1
    }
  fi

  openssl ca -config "$config_file" -gencrl -out "$crl_file.new" >>"$log" 2>&1 9>&- || {
    print_error "Cannot generate the CRL."
    rm -f "$crl_file.new"
    return 1
  }
  if ! openssl crl -in "$crl_file.new" -noout -CAfile "$certs_intermediate_dir/ca_chain_bundle.pem" >>"$log" 2>&1; then
    print_error "The new CRL does not verify against the CA chain."
    rm -f "$crl_file.new"
    return 1
  fi
  mv "$crl_file.new" "$crl_file" || return 1
  chmod 644 "$crl_file"

  count=$(openssl crl -in "$crl_file" -noout -text | grep -c "Serial Number:")
  echo "CRL: $crl_file"
  echo "Revoked certificates in the CRL: $count"
  openssl crl -in "$crl_file" -noout -lastupdate -nextupdate
  print_warning "The certificates have no CRL distribution point. Install the CRL where it is used. Generate a new one with --crl-only before it expires."
}
```

<br />

### Main process

```bash
# Main process
parse_arguments "$@"
preflight

if [ "$crl_only" = false ]; then
  select_targets
  print_plan
  if [ "$dry_run" = true ]; then
    exit 0
  fi
  if [ "$assume_yes" = false ] && ! confirm; then
    echo "Cancelled. Nothing was changed."
    exit 0
  fi
elif [ "$dry_run" = true ]; then
  echo "A new CRL would be generated in $crl_file."
  exit 0
fi
```

<br />

### Prevent a revocation during a renewal. The commands that this script starts

Prevent a revocation during a renewal. The commands that this script starts do
not inherit the lock (9>&-).

```bash
# Prevent a revocation during a renewal. The commands that this script starts
# do not inherit the lock (9>&-).
if command -v flock >/dev/null 2>&1; then
  exec 9>"$lock_file"
  flock -n 9 || {
    print_error "A renewal or revocation is running."
    exit 2
  }
else
  print_warning "flock is not installed, so overlapping runs are not prevented."
fi

status=0

if [ "$crl_only" = false ]; then
  backup_database || {
    print_error "Cannot save a copy of index.txt. Nothing was changed."
    exit 1
  }
  revoke_entries || status=1
fi
```

<br />

### Generate the CRL, also after a partial failure, so it matches the database

```bash
# Generate the CRL, also after a partial failure, so it matches the database
if [ "$generate_crl" = true ]; then
  create_crl || status=1
fi

if [ "$status" -ne 0 ]; then
  exit 1
fi

if [ "$crl_only" = false ]; then
  echo
  print_cyan "Revoked $target_fqdn. The files of the certificate are still in place; stop using them."
fi
exit 0
```

<br />

## Conclusion

This script revokes a server or client certificate and generates a Certificate
Revocation List (CRL) that is checked against the CA chain.

[revoke_tls_certificates.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/revoke_tls_certificates.sh
