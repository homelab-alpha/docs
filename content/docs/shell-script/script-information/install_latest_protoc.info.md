---
title: "install_latest_protoc.info"
description:
  "Automate the process of fetching, downloading, installing, and cleaning up
  the latest version of Protoc (Protocol Buffers) from the official GitHub
  repository with this shell script."
url: "shell-script/script-info/install-latest-protoc"
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
  - GitHub
  - Automation
  - Installation
  - Protocol Buffers
keywords:
  - Protoc installation
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

Let's break down what this script does in detail. The script is named
`install_latest_protoc.sh`, authored by GJS (homelab-alpha), and its purpose is
to fetch, download, install, and clean up the latest version of Protoc (Protocol
Buffers) from the official GitHub repository.

## Script Metadata

- **Filename**: `install_latest_protoc.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 09, 2025
- **Version**: 1.0.0
- **Description**: This script fetches the latest version of Protoc (Protocol
  Buffers) from the official GitHub repository, downloads it, installs it to
  `/usr/local/protoc`, and cleans up the downloaded files.
- **RAW Script**: [install_latest_protoc.sh]

<br />

## Fetching the Latest Version

The script starts by fetching the latest version of Protoc using the GitHub API.
It uses `curl` to send a request to the GitHub API endpoint for Protoc releases
and `grep` to extract the tag name of the latest release. The tag name, which
includes the version number, is then cleaned up using `sed` to isolate just the
version number.

```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/protocolbuffers/protobuf/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
```

<br />

## Error Handling for Version Fetching

The script checks if the version fetching was successful by verifying if the
`LATEST_VERSION` variable is not empty. If it is empty, an error message is
displayed, and the script exits with a status of 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  log_error "Unable to fetch the latest version of Protoc. Exiting."
  exit 1
fi
```

<br />

## Constructing the Download URL

Using the fetched version number, the script constructs the URL to download the
latest Protoc (Protocol Buffers) binary.

```bash
DOWNLOAD_URL="https://github.com/protocolbuffers/protobuf/releases/download/${LATEST_VERSION}/protoc-${LATEST_VERSION#v}-linux-x86_64.zip"
```

<br />

## Defining the Download Directory

The script defines a directory where the downloaded file will be saved. In this
case, it uses the `Downloads` directory in the user's home directory.

```bash
DOWNLOAD_DIR="$HOME/Downloads"
```

<br />

## Downloading the Latest Version

The script uses `wget` to download the Protoc .zip file to the specified
download directory. It includes error handling to check if the download was
successful.

```bash
if ! wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/protoc-${LATEST_VERSION}-linux-x86_64.zip"; then
  log_error "Failed to download Protoc version ${LATEST_VERSION}. Exiting."
  exit 1
fi
echo
log "Successfully downloaded Protoc version ${LATEST_VERSION} to $DOWNLOAD_DIR."
```

<br />

## Extracting the Downloaded File

The script extracts the contents of the downloaded .zip file to the download
directory using `unzip`.

```bash
unzip -o "$DOWNLOAD_DIR/protoc-${LATEST_VERSION}-linux-x86_64.zip" -d "$DOWNLOAD_DIR/protoc"
```

<br />

## Preparing the Installation Directory

The script creates the target directory `/usr/local/protoc` if it does not
already exist. It then removes any previous installations in that directory to
ensure a clean installation.

```bash
sudo mkdir -p /usr/local/protoc
sudo rm -rf /usr/local/protoc/*
```

<br />

## Moving Files to the Installation Directory

The script moves the extracted files to the target directory. It includes error
handling to check if the move was successful.

```bash
if ! sudo mv "$DOWNLOAD_DIR/protoc"/* /usr/local/protoc/; then
  log_error "Failed to move Protoc files to /usr/local/protoc. Exiting."
  exit 1
fi
log "Protoc version ${LATEST_VERSION} installed successfully."
```

<br />

## Cleaning Up

The script removes the downloaded .zip file and the extracted directory from the
download directory to clean up unnecessary files.

```bash
rm -r "$DOWNLOAD_DIR/protoc-${LATEST_VERSION}-linux-x86_64.zip"
rm -rf "$DOWNLOAD_DIR/protoc"
log "Cleanup complete."
```

<br />

## Checking for Protoc Command Availability

Finally, the script checks if the `protoc` command is available in the user's
PATH. If it is not found, it provides instructions for adding Protoc to the
PATH.

```bash
if ! command -v protoc &>/dev/null; then
  log_error "Protoc command not found. You may need to add Protoc to your PATH."
  log_error "To do this, add the following line to your ~/.bashrc or ~/.bash_profile:"
  log_error "export PATH=\$PATH:/usr/local/protoc/bin"
  exit 1
else
  log "Verification: Protoc is installed and available."
  log "Protoc version: $(protoc --version)"
fi
```

<br />

## Conclusion

This script automates the process of downloading and installing the latest
version of Protoc (Protocol Buffers), ensuring that users always have the most
up-to-date version with minimal manual intervention. It includes comprehensive
error handling and provides clear instructions for users to finalize their setup
if necessary.

[install_latest_protoc.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_protoc.sh
