---
title: "ssl_certificate_status.info"
description:
  "Report the expiry date and the days left of all certificates under the SSL
  directory, with exit codes for use in cron or a systemd timer."
url: "openssl/script-info/ssl-certificate-status"
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
  - certificate expiry
  - monitoring
  - OpenSSL scripts
  - certificate management
  - exit codes
keywords:
  - certificate expiry check
  - OpenSSL monitoring
  - days left
  - cron certificate check
  - systemd timer

weight: 8112

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the script `ssl_certificate_status.sh`. It reports the expiry
of the trusted identity, the root CA, the intermediate CA, and all server and
client certificates. It is read only, so it never changes a file. The result is
also reported in the exit code, so you can use the script in cron or in a
systemd timer. The certificates are for a homelab and for testing.

## Script Metadata

- **Filename**: `ssl_certificate_status.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: November 8, 2026
- **Version**: 1.0.0
- **Description**: This script reports the expiry date and the days left of
  every certificate in the SSL directory, and it reports the result in its exit
  code.
- **RAW Script**: [ssl_certificate_status.sh]

<br />

## Usage

```bash
./ssl_certificate_status.sh [--warn-days N] [--ca-warn-days N] [--quiet] [-h|--help]
```

| Option             | Meaning                                                                       |
| :----------------- | :---------------------------------------------------------------------------- |
| `--warn-days N`    | Warn when a server or client certificate expires within N days (default: 30). |
| `--ca-warn-days N` | Warn when a CA certificate expires within N days (default: 180).              |
| `--quiet`          | Print only the certificates that need attention.                              |
| `-h`, `--help`     | Show the help.                                                                |

The alias is `openssl-status`.

## Exit Codes

| Exit code | Meaning                                                                      |
| :-------- | :--------------------------------------------------------------------------- |
| `0`       | Every certificate is valid for longer than its threshold.                    |
| `1`       | At least one certificate expires within its threshold.                       |
| `2`       | At least one certificate has expired.                                        |
| `3`       | An error occurred, for example an unreadable certificate. It takes priority. |

## Detailed Explanation

The sections below follow the script from top to bottom.

<br />

### Defaults

```bash
# Defaults
warn_days=30
ca_warn_days=180
quiet=false
```

<br />

### Define directory paths

```bash
# Define directory paths
base_dir="$HOME/ssl"
certs_dir="$base_dir/certs"
certs_root_dir="$certs_dir/root"
certs_intermediate_dir="$certs_dir/intermediate"
certs_certificates_dir="$certs_dir/certificates"
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

### Function: show the help text

Function to show the help text.

```bash
# Function to show the help text
show_help() {
  sed -n '/^# Usage:/,/^# Notes:/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
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

### Function: parse arguments

Function to parse arguments.

```bash
# Function to parse arguments
parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    --warn-days)
      is_number "$2" || {
        print_error "--warn-days needs a number of days."
        exit 3
      }
      warn_days="$2"
      shift 2
      ;;
    --ca-warn-days)
      is_number "$2" || {
        print_error "--ca-warn-days needs a number of days."
        exit 3
      }
      ca_warn_days="$2"
      shift 2
      ;;
    --quiet)
      quiet=true
      shift
      ;;
    -h | --help)
      show_help
      exit 0
      ;;
    *)
      print_error "Unknown option: $1"
      exit 3
      ;;
    esac
  done
}
```

<br />

### Function: convert a calendar date to days since 1970-01-01

Function to convert a calendar date to days since 1970-01-01.

```bash
# Function to convert a calendar date to days since 1970-01-01
days_from_civil() {
  local y=$1 m=$2 d=$3 era yoe doy doe
  ((m <= 2)) && ((y--))
  era=$((y / 400))
  yoe=$((y - era * 400))
  doy=$(((153 * (m > 2 ? m - 3 : m + 9) + 2) / 5 + d - 1))
  doe=$((yoe * 365 + yoe / 4 - yoe / 100 + doy))
  echo $((era * 146097 + doe - 719468))
}
```

<br />

### Function: convert the OpenSSL notAfter value to epoch seconds

Function to convert the OpenSSL notAfter value to epoch seconds.

```bash
# Function to convert the OpenSSL notAfter value to epoch seconds
notafter_to_epoch() {
  local mon day time year hh mm ss month
  read -r mon day time year _ <<<"$1"
  case "$mon" in
  Jan) month=1 ;;
  Feb) month=2 ;;
  Mar) month=3 ;;
  Apr) month=4 ;;
  May) month=5 ;;
  Jun) month=6 ;;
  Jul) month=7 ;;
  Aug) month=8 ;;
  Sep) month=9 ;;
  Oct) month=10 ;;
  Nov) month=11 ;;
  Dec) month=12 ;;
  *) return 1 ;;
  esac
  IFS=: read -r hh mm ss <<<"$time"
  echo $(($(days_from_civil "$year" "$month" "$((10#$day))") * 86400 + 10#$hh * 3600 + 10#$mm * 60 + 10#$ss))
}
```

<br />

### Function: determine the type of a certificate

Function to determine the type of a certificate.

```bash
# Function to determine the type of a certificate
get_type() {
  local file="$1" location="$2" eku
  case "$location" in
  root) echo "root" ;;
  intermediate) echo "intermediate" ;;
  *)
    eku=$(openssl x509 -in "$file" -noout -ext extendedKeyUsage 2>/dev/null)
    if [[ "$eku" == *"TLS Web Server Authentication"* ]]; then
      echo "server"
    elif [[ "$eku" == *"TLS Web Client Authentication"* ]]; then
      echo "client"
    else
      echo "unknown"
    fi
    ;;
  esac
}
```

<br />

### Function: get the Common Name of a certificate

Function to get the Common Name of a certificate.

```bash
# Function to get the Common Name of a certificate
get_cn() {
  local subject
  subject=$(openssl x509 -in "$1" -noout -subject -nameopt RFC2253 2>/dev/null) || return 1
  subject="${subject#*CN=}"
  echo "${subject%%,*}"
}
```

<br />

### Function: check one certificate and store the result

Function to check one certificate and store the result.

```bash
# Function to check one certificate and store the result
check_certificate() {
  local file="$1" location="$2"
  local cn type enddate epoch days threshold state

  cn=$(get_cn "$file") || {
    print_error "Cannot read certificate: $file"
    had_error=true
    return
  }
  [ -n "$cn" ] || cn=$(basename "$file" .pem)
  type=$(get_type "$file" "$location")
  enddate=$(openssl x509 -in "$file" -noout -enddate 2>/dev/null)
  enddate="${enddate#notAfter=}"
  epoch=$(notafter_to_epoch "$enddate") || {
    print_error "Cannot read the expiry date of: $file"
    had_error=true
    return
  }

  # Days left, rounded down. Negative when the certificate has expired.
  days=$(((epoch - now) / 86400))
  ((epoch < now)) && days=$((-(((now - epoch) + 86399) / 86400)))

  if [[ "$location" == "leaf" ]]; then
    threshold=$warn_days
  else
    threshold=$ca_warn_days
  fi

  # Use -checkend for the decision: it is the authoritative OpenSSL check.
  if ! openssl x509 -in "$file" -noout -checkend 0 >/dev/null 2>&1; then
    state="EXPIRED"
    had_expired=true
  elif ! openssl x509 -in "$file" -noout -checkend "$((threshold * 86400))" >/dev/null 2>&1; then
    state="WARN"
    had_warning=true
  else
    state="OK"
  fi

  results+=("$(printf '%08d|%s|%s|%s|%s|%s' "$((days + 10000000))" "$days" "$cn" "$type" "$enddate" "$state")")
}
```

<br />

### Function: scan a directory for certificates

Function to scan a directory for certificates.

```bash
# Function to scan a directory for certificates
scan_directory() {
  local dir="$1" location="$2" file name
  [ -d "$dir" ] || {
    print_error "Directory not found: $dir"
    had_error=true
    return
  }
  for file in "$dir"/*.pem; do
    [ -f "$file" ] || continue
    name=$(basename "$file")
    # Skip bundles and combined files, they hold copies of other certificates
    case "$name" in
    *_chain_bundle.pem | *_haproxy.pem | *_bundle.pem) continue ;;
    esac
    check_certificate "$file" "$location"
  done
}
```

<br />

### Function: print the results

Function to print the results.

```bash
# Function to print the results
print_results() {
  local days cn type enddate state color
  local reset="" green="" yellow="" red=""
  if [ -t 1 ]; then
    reset="\e[0m"
    green="\e[32m"
    yellow="\e[33m"
    red="\e[31m"
  fi

  [ "${#results[@]}" -gt 0 ] || return

  if [ "$quiet" = false ]; then
    printf '%-40s %-13s %-26s %6s  %s\n' "NAME (CN)" "TYPE" "EXPIRES" "DAYS" "STATUS"
  fi

  while IFS="|" read -r _ days cn type enddate state; do
    if [ "$quiet" = true ] && [ "$state" = "OK" ]; then
      continue
    fi
    case "$state" in
    OK) color="$green" ;;
    WARN) color="$yellow" ;;
    *) color="$red" ;;
    esac
    printf '%-40s %-13s %-26s %6s  %b%s%b\n' "$cn" "$type" "$enddate" "$days" "$color" "$state" "$reset"
  done < <(printf '%s\n' "${results[@]}" | sort -t'|' -k1,1)
}
```

<br />

### Main process

```bash
# Main process
had_error=false
had_warning=false
had_expired=false
results=()

parse_arguments "$@"

if ! command -v openssl >/dev/null 2>&1; then
  print_error "OpenSSL is not installed."
  exit 3
fi

if [ ! -d "$certs_dir" ]; then
  print_error "Certificate directory not found: $certs_dir"
  exit 3
fi

printf -v now '%(%s)T' -1

scan_directory "$certs_root_dir" "root"
scan_directory "$certs_intermediate_dir" "intermediate"
scan_directory "$certs_certificates_dir" "leaf"

print_results

if [ "$quiet" = false ]; then
  echo
  print_cyan "Thresholds: ${warn_days} days (server and client), ${ca_warn_days} days (CA)."
fi
```

<br />

### Exit with the most severe result

```bash
# Exit with the most severe result
if [ "$had_error" = true ]; then
  exit 3
elif [ "$had_expired" = true ]; then
  exit 2
elif [ "$had_warning" = true ]; then
  exit 1
fi
exit 0
```

<br />

## Conclusion

This script reports the expiry date and the days left of every certificate in
the SSL directory, and it reports the result in its exit code.

[ssl_certificate_status.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/ssl_certificate_status.sh
