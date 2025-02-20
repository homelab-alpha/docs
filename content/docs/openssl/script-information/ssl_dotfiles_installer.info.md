---
title: "ssl_dotfiles_installer.info"
description:
  "A script for installing and configuring OpenSSL aliases in the .bashrc file
  without creating duplicate entries."
url: "openssl/script-info/ssl-dotfiles-installer"
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
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`ssl_dotfiles_installer`, authored by GJS (homelab-alpha), and its purpose is to
add specific configuration content to the `~/.bashrc` file without duplicating
existing entries. This ensures that certain aliases or configurations are loaded
from a separate file.

## Script Metadata

- **Filename**: `ssl_dotfiles_installer.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: February 20, 2025
- **Version**: 2.5.0
- **Description**: This script ensures the `.bashrc` file is updated with the
  necessary OpenSSL alias configurations without adding duplicates.
- **RAW Script**: [ssl_dotfiles_installer.sh]

<br />

## Detailed Explanation

Before diving into the script, it’s important to know that the script will stop
execution on any error using the following line:

```bash
set -e
```

<br />

## Functions

### BASHRC_PATH and ALIASES_PATH Variables

```bash
BASHRC_PATH="$HOME/.bashrc"
ALIASES_PATH="$HOME/openssl/dotfiles/.bash_aliases"
```

- **BASHRC_PATH** points to the `.bashrc` file in the user's home directory.
- **ALIASES_PATH** is the location of the file containing the OpenSSL alias
  definitions (`.bash_aliases`).

<br />

### Checking for Write Permission and Existence of .bashrc

This check ensures that the `.bashrc` file is writable before proceeding. If
not, the script exits with an error message.

```bash
if [ ! -w "$BASHRC_PATH" ]; then
    echo "Error: $BASHRC_PATH is not writable. Please check your permissions."
    exit 1
fi
```

<br />

### Appending the Configuration to .bashrc

```bash
if ! grep -qF "if [ -f $ALIASES_PATH ]; then" "$BASHRC_PATH"; then
    {
        echo "# Alias definitions for openssl."
        echo "# You may want to put all your additions into a separate file like"
        echo "# ~/openssl/dotfiles/.bash_aliases, instead of adding them here directly."
        echo ""
        echo "if [ -f $ALIASES_PATH ]; then"
        echo "    . $ALIASES_PATH"
        echo "fi"
        echo ""
    } >>"$BASHRC_PATH"
    echo "Configuration added to $BASHRC_PATH"
else
    echo "Configuration already exists in $BASHRC_PATH"
fi
```

- If the `.bashrc` file doesn’t already contain the necessary configuration
  (checking for the presence of `if [ -f $ALIASES_PATH ]; then`), the script
  appends the configuration to load the OpenSSL aliases.
- If the configuration is already present, it will simply notify the user
  without making any changes.

<br />

### Removing Unnecessary Files

The script identifies and removes unnecessary files from the OpenSSL directory,
such as version control and documentation files that are not essential for its
operation.

```bash
files_to_remove=(
    "$HOME/openssl/.git"
    "$HOME/openssl/.github"
    "$HOME/openssl/.gitignore"
    "$HOME/openssl/.gitleaksignore"
    "$HOME/openssl/CODE_OF_CONDUCT.md"
    "$HOME/openssl/CODE_STYLE_AND_STANDARDS_GUIDES.md"
    "$HOME/openssl/CONTRIBUTING.md"
)

for file in "${files_to_remove[@]}"; do
    if [ -e "$file" ]; then
        rm -rf "$file"
        echo "Removed: $file"
    else
        echo "File not found: $file"
    fi
done
```

<br />

### Completion and Exit

After updating the `.bashrc` file and removing unnecessary files, the script
prints a completion message.

```bash
echo "Installation completed. .bashrc has been updated, and the specified files have been removed."
```

Finally, the script exits. An optional line is included to restart the shell, if
desired.

```bash
# Optionally, restart the shell (optional line to consider uncommenting if needed)
# exec bash

exit 0
```

<br />

## Conclusion

In conclusion, `ssl_dotfiles_installer.sh` efficiently manages the configuration
of OpenSSL aliases in a modular way, ensuring that `.bashrc` is updated without
redundancy and that extraneous files are cleaned up. This script helps
streamline the process of managing OpenSSL-related shell configurations.

<br />

[ssl_dotfiles_installer.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/ssl_dotfiles_installer.sh
