---
title: "tls_directory_migrate.info"
description:
  "Move the old directory ~/ssl to ~/tls, leave a symbolic link behind, and
  change the old path in the OpenSSL configuration files."
url: "openssl/script-info/tls-directory-migrate"
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
  - directory migration
  - OpenSSL scripts
  - certificate management
  - backward compatibility
  - TLS
keywords:
  - migrate ssl to tls
  - OpenSSL directory migration
  - symbolic link
  - backward compatibility
  - homelab certificates

weight: 8115

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the script `tls_directory_migrate.sh`. It moves the old
directory `~/ssl` to `~/tls` and leaves the symbolic link `~/ssl -> tls` behind,
so old paths in cron jobs, systemd units, hooks, and HAProxy or nginx
configuration keep working. It also changes the path `$HOME/ssl` in the OpenSSL
configuration files in `~/tls/openssl.cnf`, after it saves each file with the
extension `.pre-tls`. The script does not delete any file and does not change a
certificate, a key, or the database. The certificates are for a homelab and for
testing.

## Script Metadata

- **Filename**: `tls_directory_migrate.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: November 9, 2026
- **Version**: 1.0.0
- **Description**: This script moves the old directory ~/ssl to ~/tls and keeps
  the old path working with a symbolic link.
- **RAW Script**: [tls_directory_migrate.sh]

<br />

## Usage

```bash
./tls_directory_migrate.sh [--dry-run] [-h|--help]
```

| Option         | Meaning                                     |
| :------------- | :------------------------------------------ |
| `--dry-run`    | Show what would happen. Nothing is changed. |
| `-h`, `--help` | Show the help.                              |

The alias is `openssl-migrate-tls`. Run the script once; a second run does
nothing.

## Exit Codes

| Exit code | Meaning                                                        |
| :-------- | :------------------------------------------------------------- |
| `0`       | The directory was moved, or there is nothing to move.          |
| `1`       | The move failed.                                               |
| `2`       | Wrong usage, or both `~/ssl` and `~/tls` exist as directories. |

## What the Script Does

1. Stops when `~/ssl` is already a symbolic link, or when it does not exist.
2. Stops with exit code `2` when both `~/ssl` and `~/tls` exist, because it
   cannot know which one to keep.
3. Takes the lock `.renew.lock`, so it never moves the directory during a
   renewal or a revocation.
4. Moves `~/ssl` to `~/tls` and creates the link `~/ssl -> tls`.
5. Changes `HOME/ssl` to `HOME/tls` in `~/tls/openssl.cnf/*.cnf`, after it saves
   a copy as `*.cnf.pre-tls`.

Remove the link `~/ssl` yourself when nothing uses the old path anymore.

<br />

## Detailed Explanation

The sections below follow the script from top to bottom.

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

### Function: show the usage (from the header of this script)

Function to show the usage (from the header of this script).

```bash
# Function to show the usage (from the header of this script)
show_help() {
  sed -n '/^# Usage:/,/^$/p' "$0" | sed 's/^# \{0,1\}//'
}
```

<br />

### Define paths

```bash
# Define paths
old_dir="$HOME/ssl"
new_dir="$HOME/tls"
```

<br />

### Parse the arguments

```bash
# Parse the arguments
dry_run=false
while [ $# -gt 0 ]; do
  case "$1" in
  --dry-run)
    dry_run=true
    shift
    ;;
  -h | --help)
    show_help
    exit 0
    ;;
  *)
    print_error "Unknown option: $1"
    exit 2
    ;;
  esac
done
```

<br />

### Decide what to do

```bash
# Decide what to do
if [ -L "$old_dir" ]; then
  echo "Nothing to do: $old_dir is already a symbolic link."
  exit 0
fi

if [ ! -d "$old_dir" ]; then
  echo "Nothing to do: $old_dir does not exist."
  exit 0
fi

if [ -e "$new_dir" ]; then
  print_error "Both $old_dir and $new_dir exist. Check them and move or remove one yourself."
  exit 2
fi
```

<br />

### List the configuration files that contain the old path

```bash
# List the configuration files that contain the old path
config_files=()
for file in "$old_dir"/openssl.cnf/*.cnf; do
  [ -f "$file" ] || continue
  if grep -q 'HOME/ssl' "$file"; then
    config_files+=("$file")
  fi
done

print_cyan "=== Migration plan ==="
echo "Move:   $old_dir -> $new_dir"
echo "Link:   $old_dir -> tls"
echo "Config: ${#config_files[@]} file(s) with the path \$HOME/ssl are changed (a copy is saved as .pre-tls)."

if [ "$dry_run" = true ]; then
  echo "Dry run: nothing was changed."
  exit 0
fi
```

<br />

### Do not move the directory during a renewal or a revocation

```bash
# Do not move the directory during a renewal or a revocation.
if command -v flock >/dev/null 2>&1; then
  exec 9>"$old_dir/.renew.lock"
  flock -n 9 || {
    print_error "A renewal or revocation is running. Try again later."
    exit 2
  }
else
  print_warning "flock is not installed, so overlapping runs are not prevented."
fi

if ! mv "$old_dir" "$new_dir"; then
  print_error "Could not move $old_dir to $new_dir."
  exit 1
fi

if ! ln -s tls "$old_dir"; then
  print_error "Could not create the link $old_dir. Moving the directory back."
  mv "$new_dir" "$old_dir" || print_error "Could not move it back. The files are in $new_dir."
  exit 1
fi
```

<br />

### Change the path in the configuration files, after a copy

```bash
# Change the path in the configuration files, after a copy
changed=0
for file in "${config_files[@]}"; do
  file="$new_dir/openssl.cnf/$(basename "$file")"
  if sed -i.pre-tls 's#HOME/ssl#HOME/tls#g' "$file"; then
    changed=$((changed + 1))
  else
    print_warning "Could not change $file. The link $old_dir keeps the old path working."
  fi
done

echo
print_cyan "Moved $old_dir to $new_dir. $changed configuration file(s) changed."
echo "The old path $old_dir is now a link to $new_dir. Remove it when nothing uses it."
```

<br />

## Conclusion

This script moves the old directory ~/ssl to ~/tls and keeps the old path
working with a symbolic link.

[tls_directory_migrate.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/tls_directory_migrate.sh
