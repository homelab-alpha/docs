---
title: "install_latest_hugo.info"
description:
  "Automate the process of fetching, downloading, installing, and cleaning up
  the latest version of Hugo from the official GitHub repository with this shell
  script."
url: "shell-script/script-info/install-latest-hugo"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Script Information
tags:
  - Shell Script
  - Hugo
  - GitHub
  - Automation
  - Installation
keywords:
  - Hugo installation
  - Shell script
  - GitHub API
  - Automated deployment
  - Error handling

weight: 9100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

This script, named `install_latest_hugo.sh` and authored by GJS (homelab-alpha),
automates the process of fetching, downloading, installing, and cleaning up the
latest version of Hugo from the official GitHub repository.

Here's a breakdown of the script's operations:

## Script Metadata

- **Filename**: `install_latest_hugo.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: December 7, 2024
- **Version**: 1.1.0
- **Description**: This script fetches the latest version of Hugo from the
  official GitHub repository, downloads it, installs it to
  `/usr/local/hugo-extended`, and cleans up the downloaded files.
- **RAW Script**: [install_latest_hugo.sh]

<br />

## Fetching the Latest Version

The script fetches the latest version of Hugo using the GitHub API. It sends a
`curl` request to the GitHub API endpoint for Hugo releases and uses `grep` and
`sed` to extract and clean the version number.

```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
```

<br />

## Error Handling for Version Fetching

If the script fails to fetch the latest version of Hugo, it checks if the
`LATEST_VERSION` variable is empty. If so, it logs an error and exits with a
status of 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  log_error "Failed to fetch the latest version of Hugo. Exiting."
  exit 1
fi
```

<br />

## Constructing the Download URL

The script constructs the download URL for the Hugo binary using the fetched
version number.

```bash
DOWNLOAD_URL="https://github.com/gohugoio/hugo/releases/download/v${LATEST_VERSION}/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz"
```

<br />

## Defining the Download Directory

The script saves the downloaded file in the `Downloads` directory located in the
user's home directory.

```bash
DOWNLOAD_DIR="$HOME/Downloads"
```

<br />

## Downloading the Latest Version

The script uses `wget` to download the tar.gz file for the latest Hugo version.

```bash
wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz"
```

<br />

## Error Handling for Downloading

If the download fails, the script logs an error and exits.

```bash
if ! wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz"; then
  log_error "Failed to download Hugo version ${LATEST_VERSION}. Exiting."
  exit 1
fi
```

<br />

## Extracting the Downloaded File

The script extracts the downloaded tar.gz file into the download directory.

```bash
tar -xzf "$DOWNLOAD_DIR/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz" -C "$DOWNLOAD_DIR"
```

<br />

## Preparing the Installation Directory

The script ensures the target directory `/usr/local/hugo-extended` exists and
cleans up any existing Hugo installation.

```bash
sudo mkdir -p /usr/local/hugo-extended
sudo rm -rf /usr/local/hugo-extended/*
```

<br />

## Moving Files to the Installation Directory

The Hugo binary and related files are moved to the target installation
directory.

```bash
sudo mv "$DOWNLOAD_DIR/hugo" /usr/local/hugo-extended/
sudo mv "$DOWNLOAD_DIR/LICENSE" /usr/local/hugo-extended/
sudo mv "$DOWNLOAD_DIR/README.md" /usr/local/hugo-extended/
```

<br />

## Verifying the Installation

If the Hugo binary is not found in the target directory, an error is logged, and
the script exits with a failure status.

```bash
if [ ! -f "/usr/local/hugo-extended/hugo" ]; then
  log_error "Failed to move Hugo binary to /usr/local/hugo-extended. Exiting."
  exit 1
fi
```

<br />

## Cleaning Up

The script cleans up the downloaded tar.gz file from the `Downloads` directory.

```bash
rm "$DOWNLOAD_DIR/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz"
log "Cleanup complete."
```

<br />

## Checking for Hugo Command Availability

Finally, the script verifies whether the `hugo` command is available in the
user's `PATH`. If it is not, the script suggests adding it to the `PATH` and
provides instructions for doing so.

```bash
if ! command -v hugo &>/dev/null; then
  log_error "Hugo command not found. You may need to add Hugo to your PATH."
  log_error "To do this, add the following line to your ~/.bashrc or ~/.bash_profile:"
  log_error "export PATH=\$PATH:/usr/local/hugo-extended"
  exit 1
else
  log "Verification: Hugo is installed and available."
  log "Hugo version: $(hugo version)"
fi
```

<br />

## Conclusion

This script automates the process of downloading and installing the latest
version of Hugo, ensuring that users always have the most up-to-date version. It
includes comprehensive error handling and provides clear instructions to
complete the installation if needed.

[install_latest_hugo.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_hugo.sh
