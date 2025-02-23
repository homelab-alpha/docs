---
title: "install_latest_jetbrains_mono.info"
description:
  "Automate the installation of the latest JetBrains Mono font. This script
  fetches the latest release from GitHub, downloads it, installs it system-wide,
  and performs clean-up. Comprehensive error handling ensures reliable
  execution."
url: "shell-script/script-info/install-latest-jetbrains-mono"
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
  - JetBrains Mono
  - Font Installation
  - Shell Script
  - Automation
  - GitHub API
  - Linux Fonts
keywords:
  - JetBrains Mono
  - install script
  - download font
  - GitHub releases
  - system fonts
  - shell script
  - Linux automation
  - font management

weight: 9100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`install_latest_jetbrains_mono.sh`, authored by GJS (homelab-alpha), and its
purpose is to fetch the latest version of JetBrains Mono from the official
GitHub repository, download it, install it to the system-wide fonts directory,
and clean up the downloaded files.

## Script Metadata

- **Filename**: `install_latest_jetbrains_mono.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: Dec 07, 2024
- **Version**: 1.1.0
- **Description**: The script fetches the latest version of JetBrains Mono from
  the official GitHub repository, downloads it, installs it to the system-wide
  fonts directory, and cleans up the downloaded files.
- **Usage**: `sudo ./install_latest_jetbrains_mono.sh`
- **RAW Script**: [install_latest_jetbrains_mono.sh]

<br />

## Fetching the Latest Version

The script starts by fetching the latest version of JetBrains Mono using the
GitHub API. It uses `curl` to send a request to the GitHub API endpoint for
JetBrains Mono releases and `grep` to extract the tag name of the latest
release. The tag name, which includes the version number, is then cleaned up
using `sed` to isolate just the version number.

```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/JetBrains/JetBrainsMono/releases/latest | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
```

<br />

## Error Handling for Version Fetching

The script checks if the version fetching was successful by verifying if the
`LATEST_VERSION` variable is not empty. If it is empty, an error message is
displayed, and the script exits with a status of 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  log_error "Failed to fetch the latest version of JetBrains Mono. Exiting."
  exit 1
fi
```

<br />

## Constructing the Download URL

Using the fetched version number, the script constructs the URL to download the
latest JetBrains Mono zip file.

```bash
DOWNLOAD_URL="https://github.com/JetBrains/JetBrainsMono/releases/download/v${LATEST_VERSION}/JetBrainsMono-${LATEST_VERSION}.zip"
```

<br />

## Defining the Download Directory

The script defines a directory where the downloaded file will be saved. In this
case, it uses the `Downloads` directory in the user's home directory.

```bash
DOWNLOAD_DIR="$HOME/Downloads"
```

<br />

## Checking and Creating the Download Directory

The script checks if the download directory exists, and if not, it creates it.

```bash
log "Ensuring download directory exists: $DOWNLOAD_DIR"
mkdir -p "$DOWNLOAD_DIR"
```

<br />

## Downloading the Latest Version

The script uses `wget` to download the JetBrains Mono zip file to the specified
download directory.

```bash
if ! wget -v "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}.zip"; then
  log_error "Failed to download JetBrains Mono version ${LATEST_VERSION}. Exiting."
  exit 1
fi
```

<br />

## Error Handling for Downloading

It checks if `wget` successfully downloaded the file by verifying its existence.
If the download fails, an error message is displayed, and the script exits with
a status of 1.

```bash
log "Successfully downloaded JetBrains Mono to $DOWNLOAD_DIR."
```

<br />

## Extracting the Downloaded File

The script extracts the contents of the downloaded zip file to the download
directory using `unzip`.

```bash
unzip "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}.zip" -d "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}"
```

<br />

## Preparing the Installation Directory

The script creates the target directory `/usr/share/fonts/jetbrains-mono` if it
does not already exist.

```bash
JETBRAINS_MONO_DIR="/usr/share/fonts/jetbrains-mono"
sudo mkdir -p "$JETBRAINS_MONO_DIR"
```

<br />

## Removing Previous Installations

To avoid conflicts, the script removes any previous installations of JetBrains
Mono fonts in the target directory.

```bash
sudo rm -rf "$JETBRAINS_MONO_DIR"/*
```

<br />

## Moving Files to the Installation Directory

The script moves the font files to the system-wide fonts directory.

```bash
sudo mv "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}/fonts/"* "$JETBRAINS_MONO_DIR"
```

<br />

## Verifying the Installation

It checks if the font files were successfully moved to the target directory. If
the files are not found, an error message is displayed, and the script exits
with a status of 1.

```bash
if [ ! -f "$JETBRAINS_MONO_DIR/ttf/JetBrainsMono-Regular.ttf" ]; then
  log_error "Failed to move JetBrains Mono fonts to $JETBRAINS_MONO_DIR. Exiting."
  exit 1
fi
```

<br />

## Updating the Font Cache

The script updates the font cache to make the new fonts available system-wide.

```bash
sudo fc-cache -f -v
```

<br />

## Cleaning Up

The script removes the downloaded zip file and the extracted directory to clean
up unnecessary files.

```bash
rm "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}.zip"
rm -r "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}"
```

<br />

## Verifying the Installation by Listing Installed Fonts

Finally, the script checks if the JetBrains Mono font was successfully installed
by listing installed fonts and checking for its presence. If the font is not
found, an error message is displayed; otherwise, a success message is shown.

```bash
if ! fc-list | grep -q "JetBrains Mono"; then
  log_error "JetBrains Mono font not found. Installation may have failed."
  exit 1
fi
log "JetBrains Mono font installed successfully."
```

<br />

## Conclusion

This script automates the process of downloading and installing the latest
version of JetBrains Mono, ensuring that users always have the most up-to-date
version with minimal manual intervention. It includes comprehensive error
handling and provides clear instructions for users to finalize their setup if
necessary.

[install_latest_jetbrains_mono.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_jetbrains_mono.sh
