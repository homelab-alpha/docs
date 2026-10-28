---
title: "install_latest_go.info"
description:
  "Automate the process of fetching, downloading, installing, and cleaning up
  the latest version of Go from the official Go download page with this shell
  script."
url: "shell-script/script-info/install-latest-go"
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
  - Go
  - Automation
  - Installation
keywords:
  - Go installation
  - Shell script
  - Official Go download
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
`install_latest_go.sh`, authored by GJS (homelab-alpha), and its purpose is to
fetch, download, install, and clean up the latest version of Go from the
official Go download page.

## Script Metadata

- **Filename**: `install_latest_go.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: November 11, 2025
- **Version**: 1.2.0
- **Description**: This script fetches the latest version of Go from the
  official Go download page, downloads it, installs it to `/usr/local/go`, and
  cleans up the downloaded files.
- **RAW Script**: [install_latest_go.sh]

<br />

## Logging

The script prints every message to the terminal and appends it to the log file
`$HOME/.bash-script/install_latest_go.log`. The `log` function records informational
messages and the `log_error` function records errors, both with a timestamp. The
script does not create the log directory itself.

```bash
LOG_DIR="$HOME/.bash-script"
LOG_FILE="$LOG_DIR/install_latest_go.log"

log() {
  local TIMESTAMP
  TIMESTAMP=$(date +"%b %d, %Y %H:%M:%S")
  echo "$TIMESTAMP [INFO] - $1" | tee -a "$LOG_FILE"
}

log_error() {
  local TIMESTAMP
  TIMESTAMP=$(date +"%b %d, %Y %H:%M:%S")
  echo "$TIMESTAMP [ERROR] - $1" | tee -a "$LOG_FILE"
}
```

<br />

## Checking the Installed Version

Before installing, the script checks whether Go is already available and logs
the installed version.

```bash
log "Checking current installed version of Go (if available)..."
if command -v go &>/dev/null; then
  log "Go version: $(go version)"
else
  log "Go is not currently installed."
fi
```

<br />

## Fetching the Latest Version

The script fetches the latest version of Go from the official Go download page.
It uses `curl` to request the Go version endpoint, keeps only the first line of
the output with `head`, and uses `sed` to remove the `go` prefix, leaving just
the version number.

```bash
log "Fetching the latest version of Go from the official download page..."
LATEST_VERSION=$(curl -s https://go.dev/VERSION?m=text | head -n 1 | sed 's/^go//')
```

<br />

## Error Handling for Version Fetching

The script checks if the version fetching was successful by verifying if the
`LATEST_VERSION` variable is not empty. If it is empty, an error message is
displayed, and the script exits with a status of 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  log_error "Failed to fetch the latest version of Go. Exiting."
  exit 1
fi
```

<br />

## Constructing the Download URL

Using the fetched version number, the script constructs the URL to download the
latest Go binary.

```bash
DOWNLOAD_URL="https://go.dev/dl/go${LATEST_VERSION}.linux-amd64.tar.gz"
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

The script uses `wget` to download the Go tar.gz file to the specified download
directory. It includes error handling to check if the download was successful.

```bash
if ! wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/go${LATEST_VERSION}.linux-amd64.tar.gz"; then
  log_error "Failed to download Go version ${LATEST_VERSION}. Exiting."
  exit 1
fi
log "Successfully downloaded Go version ${LATEST_VERSION} to $DOWNLOAD_DIR."
```

<br />

## Extracting the Downloaded File

The script extracts the downloaded file in two steps. First, `gzip -d`
decompresses the tarball into a `.tar` file. Then `tar -xf` extracts that `.tar`
file into the download directory. Both steps are checked for errors.

```bash
log "Extracting Go files..."

if gzip -d "$DOWNLOAD_DIR/go${LATEST_VERSION}.linux-amd64.tar.gz"; then
  log "Decompression of the tarball was successful."
else
  log_error "Failed to decompress Go tarball. Exiting."
  exit 1
fi

if tar -xf "$DOWNLOAD_DIR/go${LATEST_VERSION}.linux-amd64.tar" -C "$DOWNLOAD_DIR"; then
  log "Extraction of the tar file was successful."
else
  log_error "Failed to extract Go tar file. Exiting."
  exit 1
fi
```

<br />

## Preparing the Installation Directory

The script creates the target directory `/usr/local/go` if it does not already
exist. It then removes any previous installations in that directory to ensure a
clean installation.

```bash
sudo mkdir -p /usr/local/go
sudo rm -rf /usr/local/go
```

<br />

## Moving Files to the Installation Directory

The script moves the extracted files to the target directory. It includes error
handling to check if the move was successful.

```bash
if ! sudo mv "$DOWNLOAD_DIR/go" /usr/local/; then
  log_error "Failed to move Go files to /usr/local/go. Exiting."
  exit 1
fi
log "Go version ${LATEST_VERSION} installed successfully to /usr/local/go."
```

<br />

## Cleaning Up

The script removes the extracted `.tar` file from the download directory to
clean up unnecessary files.

```bash
rm "$DOWNLOAD_DIR/go${LATEST_VERSION}.linux-amd64.tar"
log "Cleanup complete."
```

<br />

## Checking for Go Command Availability

Finally, the script checks if the `go` command is available in the user's PATH.
If it is not found, it provides instructions for adding Go to the PATH.

```bash
if ! command -v go &>/dev/null; then
  log_error "Go command not found. You may need to add Go to your PATH."
  log_error "To do this, add the following line to your ~/.bashrc or ~/.bash_profile:"
  log_error "export PATH=\$PATH:/usr/local/go/bin"
  exit 1
else
  log "Go version: $(go version)"
fi
```

<br />

## Conclusion

This script automates the process of downloading and installing the latest
version of Go, ensuring that users always have the most up-to-date version with
minimal manual intervention. It includes comprehensive error handling and
provides clear instructions for users to finalize their setup if necessary.

[install_latest_go.sh]: https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_go.sh
