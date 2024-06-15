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

weight: 6100

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

Here's a detailed explanation:

## Script Metadata

- **Filename**: `install_latest_go.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.1.1
- **Description**: This script fetches the latest version of Go from the
  official Go download page, downloads it, installs it to `/usr/local/go`, and
  cleans up the downloaded files.
- **RAW Script**: [install_latest_go.sh]

<br />

## Fetching the Latest Version

The script starts by fetching the latest version of Go from the official Go
download page. It uses `curl` to send a request to the Go version endpoint and
captures the output, which contains the latest version.

```bash
LATEST_VERSION_OUTPUT=$(curl -s https://go.dev/VERSION?m=text)
```

<br />

## Extracting the Version Number

It then extracts the version number from the fetched output. The `awk` command
isolates the version string, and `sed` removes the `go` prefix, leaving just the
version number.

```bash
LATEST_VERSION="$(echo $LATEST_VERSION_OUTPUT | awk '{print $1}' | sed 's/go//')"
```

<br />

## Error Handling for Version Fetching

The script checks if the version fetching was successful by verifying if the
`LATEST_VERSION` variable is not empty. If it is empty, an error message is
displayed, and the script exits with a status of 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  echo "Failed to fetch the latest version of Go."
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
  echo "Failed to download Go version ${LATEST_VERSION}."
  exit 1
fi

echo "Successfully downloaded Go version ${LATEST_VERSION} to $DOWNLOAD_DIR."
```

<br />

## Extracting the Downloaded File

The script extracts the contents of the downloaded tar.gz file to the download
directory using `tar`.

```bash
tar -xzf "$DOWNLOAD_DIR/go${LATEST_VERSION}.linux-amd64.tar.gz" -C "$DOWNLOAD_DIR"
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
  echo "Failed to move Go files to /usr/local/go."
  exit 1
fi

echo "Successfully installed Go version ${LATEST_VERSION} to /usr/local/go."
```

<br />

## Cleaning Up

The script removes the downloaded tar.gz file from the download directory to
clean up unnecessary files.

```bash
rm "$DOWNLOAD_DIR/go${LATEST_VERSION}.linux-amd64.tar.gz"
echo "Cleanup complete."
echo ""
```

<br />

## Checking for Go Command Availability

Finally, the script checks if the `go` command is available in the user's PATH.
If it is not found, it provides instructions for adding Go to the PATH.

```bash
if ! command -v go &>/dev/null; then
  echo "Go command not found. You may need to add Go to your PATH."
  echo "To do this, add the following line to your ~/.bashrc or ~/.bash_profile:"
  echo ""
  echo "export PATH=\$PATH:/usr/local/go/bin"
  echo ""
  echo "Then, run: source ~/.bashrc"
  echo "and/or"
  echo "Then, run: source ~/.bash_profile"
  exit 1
else
  echo "Go version: $(go version)"
fi
```

<br />

## Conclusion

This script automates the process of downloading and installing the latest
version of Go, ensuring that users always have the most up-to-date version with
minimal manual intervention. It includes comprehensive error handling and
provides clear instructions for users to finalize their setup if necessary.

[install_latest_go.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_go.sh
