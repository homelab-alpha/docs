---
title: "tls_dotfiles_installer.info"
description:
  "A script for installing and configuring OpenSSL aliases in the .bashrc file
  without creating duplicate entries."
url: "openssl/script-info/tls-dotfiles-installer"
aliases:
  - "openssl/script-info/ssl-dotfiles-installer"
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
  - Bash
  - Shell Script
  - Configuration
keywords:
  - OpenSSL installer
  - Bash script
  - .bashrc configuration
  - Alias management
  - Shell scripting

weight: 8101

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the script `tls_dotfiles_installer.sh`. This script adds the
aliases of this repository to `~/.bashrc`. It avoids duplication by checking for
existing entries and only appends the content if it's missing. The script does
not remove or change any other file.

## Script Metadata

- **Filename**: `tls_dotfiles_installer.sh`
- **Old name**: `ssl_dotfiles_installer.sh` (a wrapper that starts this script)
- **Author**: GJS (homelab-alpha)
- **Date**: November 13, 2026
- **Version**: 3.0.0
- **Description**: This script adds the aliases of this repository to
  `~/.bashrc`.
- **RAW Script**: [tls_dotfiles_installer.sh]

<br />

## Usage

```bash
./tls_dotfiles_installer.sh [-h|--help]
```

| Option         | Meaning         |
| :------------- | :-------------- |
| `-h`, `--help` | Show this help. |

Without options the script appends the aliases to `~/.bashrc`.

## Notes

- Ensure the content to be added is properly formatted to avoid conflicts with
  existing aliases.
- The script assumes the user has a specific directory structure with the file
  `~/openssl/dotfiles/.bash_aliases` for aliases.

<br />

## Detailed Explanation

The sections below follow the script from top to bottom.

<br />

### Stop script on error

```bash
# Stop script on error
set -Eeuo pipefail
```

<br />

### Parse the options

```bash
while [[ $# -gt 0 ]]; do
  case "$1" in
  -h | --help)
    sed -n '/^# Usage:/,/^$/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
    exit 0
    ;;
  *)
    echo "Error: Unknown option: $1" >&2
    exit 2
    ;;
  esac
done
```

<br />

### Define the paths to the files

```bash
# Define the paths to the files
bashrc_path="$HOME/.bashrc"
aliases_path="$HOME/openssl/dotfiles/.bash_aliases"
```

<br />

### Check if .bashrc exists and is writable

```bash
# Check if .bashrc exists and is writable
if [[ ! -w "$bashrc_path" ]]; then
  echo "Error: $bashrc_path is not writable. Please check your permissions." >&2
  exit 1
fi
```

<br />

### Add the necessary configuration to .bashrc if it's not already present

Add the necessary configuration to .bashrc if it's not already present. The
first pattern is the line that older versions of this script wrote.

```bash
# Add the necessary configuration to .bashrc if it's not already present. The
# first pattern is the line that older versions of this script wrote.
if grep -qF -e "if [ -f $aliases_path ]; then" -e "if [ -f \"$aliases_path\" ]; then" "$bashrc_path"; then
  echo "Configuration already exists in $bashrc_path"
else
  {
    echo "# Alias definitions for openssl."
    echo "# You may want to put all your additions into a separate file like"
    echo "# ~/openssl/dotfiles/.bash_aliases, instead of adding them here directly."
    echo ""
    echo "if [ -f \"$aliases_path\" ]; then"
    echo "  . \"$aliases_path\""
    echo "fi"
    echo ""
  } >>"$bashrc_path"
  echo "Configuration added to $bashrc_path"
fi
```

<br />

### Inform the user about the completion of the script

```bash
# Inform the user about the completion of the script
echo "Installation completed. Open a new shell to use the aliases."

exit 0
```

<br />

## Conclusion

This script adds the aliases of this repository to `~/.bashrc`.

[tls_dotfiles_installer.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/tls_dotfiles_installer.sh
