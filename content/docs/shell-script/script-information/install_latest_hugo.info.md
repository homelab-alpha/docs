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

weight: 6100

toc: true
katex: true
---

<br />

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

<br />

Let's break down what this script does in detail. The script is named
`install_latest_hugo.sh`, authored by GJS (homelab-alpha), and its purpose is to
fetch, download, install, and clean up the latest version of Hugo from the
official GitHub repository.

Here's a detailed explanation:

## Script Metadata

- **Script Name**: `install_latest_hugo.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.1.1
- **Description**: This script fetches the latest version of Hugo from the
  official GitHub repository, downloads it, installs it to
  `/usr/local/hugo-extended`, and cleans up the downloaded files.
- **RAW Script**: [install_latest_hugo.sh]

<br />

## Detailed Explanation

### Fetching the Latest Version

The script starts by fetching the latest version of Hugo using the GitHub API.
It uses `curl` to send a request to the GitHub API endpoint for Hugo releases
and `grep` to extract the tag name of the latest release. The tag name, which
includes the version number, is then cleaned up using `sed` to isolate just the
version number.

```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
```

<br />

### Error Handling for Version Fetching

The script checks if the version fetching was successful by verifying if the
`LATEST_VERSION` variable is not empty. If it is empty, an error message is
displayed, and the script exits with a status of 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  echo "Failed to fetch the latest version of Hugo."
  exit 1
fi
```

<br />

### Constructing the Download URL

Using the fetched version number, the script constructs the URL to download the
latest Hugo binary.

```bash
DOWNLOAD_URL="https://github.com/gohugoio/hugo/releases/download/v${LATEST_VERSION}/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz"
```

<br />

### Defining the Download Directory

The script defines a directory where the downloaded file will be saved. In this
case, it uses the `Downloads` directory in the user's home directory.

```bash
DOWNLOAD_DIR="$HOME/Downloads"
```

<br />

### Downloading the Latest Version

The script uses `wget` to download the Hugo tar.gz file to the specified
download directory.

```bash
wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR"/hugo_extended_"${LATEST_VERSION}"_linux-amd64.tar.gz
```

<br />

### Error Handling for Downloading

It checks if `wget` successfully downloaded the file by using `wget -q --spider`
to test the URL. If the download fails, an error message is displayed, and the
script exits with a status of 1.

```bash
if ! wget -q --spider "$DOWNLOAD_URL"; then
  echo "Failed to download Hugo version ${LATEST_VERSION}."
  exit 1
fi

echo "Successfully downloaded Hugo version ${LATEST_VERSION} to $DOWNLOAD_DIR."
```

<br />

### Extracting the Downloaded File

The script extracts the contents of the downloaded tar.gz file to the download
directory using `tar`.

```bash
tar -xzf "$DOWNLOAD_DIR"/hugo_extended_"${LATEST_VERSION}"_linux-amd64.tar.gz -C "$DOWNLOAD_DIR"
```

<br />

### Preparing the Installation Directory

The script creates the target directory `/usr/local/hugo-extended` if it does
not already exist. It then removes any previous installations in that directory
to ensure a clean installation.

```bash
sudo mkdir -p /usr/local/hugo-extended
sudo rm -rf /usr/local/hugo-extended/*
```

<br />

### Moving Files to the Installation Directory

The script moves the Hugo binary and additional files (LICENSE and README.md) to
the target directory.

```bash
sudo mv "$DOWNLOAD_DIR"/hugo /usr/local/hugo-extended/
sudo mv "$DOWNLOAD_DIR"/LICENSE /usr/local/hugo-extended/
sudo mv "$DOWNLOAD_DIR"/README.md /usr/local/hugo-extended/
```

<br />

### Verifying the Installation

It checks if the Hugo binary was successfully moved to the target directory. If
the binary is not found, an error message is displayed, and the script exits
with a status of 1.

```bash
if [ ! -f "/usr/local/hugo-extended/hugo" ]; then
  echo "Failed to move Hugo binary to /usr/local/hugo-extended."
  exit 1
fi

echo "Successfully installed Hugo version ${LATEST_VERSION} to /usr/local/hugo-extended."
```

<br />

### Cleaning Up

The script removes the downloaded tar.gz file from the download directory to
clean up unnecessary files.

```bash
rm "$DOWNLOAD_DIR"/hugo_extended_"${LATEST_VERSION}"_linux-amd64.tar.gz

echo "Cleanup complete."
echo ""
```

<br />

### Checking for Hugo Command Availability

Finally, the script checks if the `hugo` command is available in the user's
PATH. If it is not found, it provides instructions for adding Hugo to the PATH.

```bash
if ! command -v hugo &>/dev/null; then
  echo "Hugo command not found. You may need to add Hugo to your PATH."
  echo "To do this, add the following line to your ~/.bashrc or ~/.bash_profile:"
  echo ""
  echo "export PATH=\$PATH:/usr/local/hugo-extended"
  echo ""
  echo "Then, run: source ~/.bashrc"
  echo "Or"
  echo "Then, run: source ~/.bash_profile"
  exit 1
else
  echo "Hugo version: $(hugo version)"
fi
```

<br />

## Conclusion

This script automates the process of downloading and installing the latest
version of Hugo, ensuring that users always have the most up-to-date version
with minimal manual intervention. It includes comprehensive error handling and
provides clear instructions for users to finalize their setup if necessary.

[install_latest_hugo.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_hugo.sh
