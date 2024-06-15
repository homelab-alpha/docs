---
title: "install_latest_dart_sass.info"
description:
  "Automate the process of fetching, downloading, installing, and cleaning up
  the latest version of Dart Sass from the official GitHub repository with this
  shell script."
url: "shell-script/script-info/install-latest-dart-sass"
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
  - Dart Sass
  - GitHub
  - Automation
  - Installation
keywords:
  - Dart Sass installation
  - Shell script
  - GitHub API
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
`install_latest_dart_sass.sh`, authored by GJS (homelab-alpha), and its purpose
is to fetch, download, install, and clean up the latest version of Dart Sass
from the official GitHub repository.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `install_latest_dart_sass.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.1.1
- **Description**: This script fetches the latest version of Dart Sass from the
  official GitHub repository, downloads it, installs it to
  `/usr/local/dart-sass`, and cleans up the downloaded files.
- **RAW Script**: [install_latest_dart_sass.sh]

<br />

## Fetching the Latest Version

The script starts by fetching the latest version of Dart Sass using the GitHub
API. It uses `curl` to send a request to the GitHub API endpoint for Dart Sass
releases and `grep` to extract the tag name of the latest release. The tag name,
which includes the version number, is then cleaned up using `sed` to isolate
just the version number.

```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/sass/dart-sass/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
```

<br />

## Error Handling for Version Fetching

The script checks if the version fetching was successful by verifying if the
`LATEST_VERSION` variable is not empty. If it is empty, an error message is
displayed, and the script exits with a status of 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  echo "Failed to fetch the latest version of Dart Sass."
  exit 1
fi
```

<br />

## Constructing the Download URL

Using the fetched version number, the script constructs the URL to download the
latest Dart Sass binary.

```bash
DOWNLOAD_URL="https://github.com/sass/dart-sass/releases/download/${LATEST_VERSION}/dart-sass-${LATEST_VERSION}-linux-x64.tar.gz"
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

The script uses `wget` to download the Dart Sass tar.gz file to the specified
download directory. It includes error handling to check if the download was
successful.

```bash
if ! wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/dart-sass-${LATEST_VERSION}-linux-x64.tar.gz"; then
  echo "Failed to download Dart Sass version ${LATEST_VERSION}."
  exit 1
fi

echo "Successfully downloaded Dart Sass version ${LATEST_VERSION} to $DOWNLOAD_DIR."
```

<br />

## Extracting the Downloaded File

The script extracts the contents of the downloaded tar.gz file to the download
directory using `tar`.

```bash
tar -xzf "$DOWNLOAD_DIR/dart-sass-${LATEST_VERSION}-linux-x64.tar.gz" -C "$DOWNLOAD_DIR"
```

<br />

## Preparing the Installation Directory

The script creates the target directory `/usr/local/dart-sass` if it does not
already exist. It then removes any previous installations in that directory to
ensure a clean installation.

```bash
sudo mkdir -p /usr/local/dart-sass
sudo rm -rf /usr/local/dart-sass/*
```

<br />

## Moving Files to the Installation Directory

The script moves the extracted files to the target directory. It includes error
handling to check if the move was successful.

```bash
if ! sudo mv "$DOWNLOAD_DIR/dart-sass"/* /usr/local/dart-sass/; then
  echo "Failed to move Dart Sass files to /usr/local/dart-sass."
  exit 1
fi

echo "Successfully installed Dart Sass version ${LATEST_VERSION} to /usr/local/dart-sass."
```

<br />

## Cleaning Up

The script removes the downloaded tar.gz file and the extracted directory from
the download directory to clean up unnecessary files.

```bash
rm -r "$DOWNLOAD_DIR/dart-sass-${LATEST_VERSION}-linux-x64.tar.gz"
rm -rf "$DOWNLOAD_DIR/dart-sass"
echo "Cleanup complete."
echo ""
```

<br />

## Checking for Sass Command Availability

Finally, the script checks if the `sass` command is available in the user's
PATH. If it is not found, it provides instructions for adding Dart Sass to the
PATH.

```bash
if ! command -v sass &>/dev/null; then
  echo "Sass command not found. You may need to add Dart Sass to your PATH."
  echo "To do this, add the following line to your ~/.bashrc or ~/.bash_profile:"
  echo ""
  echo "export PATH=\$PATH:/usr/local/dart-sass"
  echo ""
  echo "Then, run: source ~/.bashrc"
  echo "and/or"
  echo "Then, run: source ~/.bash_profile"
  exit 1
else
  echo "Sass version: $(sass --version)"
fi
```

<br />

## Conclusion

This script automates the process of downloading and installing the latest
version of Dart Sass, ensuring that users always have the most up-to-date
version with minimal manual intervention. It includes comprehensive error
handling and provides clear instructions for users to finalize their setup if
necessary.

[install_latest_dart_sass.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_dart_sass.sh
