---
title: "ex.info"
description:
  "A versatile shell script designed to simplify the extraction of various
  archive formats by automatically detecting the file type and applying the
  appropriate extraction method."
url: "shell-script/function-info/ex"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Function Information
tags:
  - shell
  - script
  - extraction
  - archive
  - automation
  - command-line
  - linux
  - unix
keywords:
  - shell script
  - archive extraction
  - file decompression
  - tar
  - zip
  - gzip
  - bzip2
  - rar
  - automation tools
  - command-line utilities

weight: 6200

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named `ex.sh`,
authored by GJS (homelab-alpha), and its purpose is to provide a convenient way
to extract various archive formats. It simplifies the extraction process by
automatically detecting the file format and applying the appropriate extraction
method.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `ex.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 26, 2024
- **Version**: 1.0.1
- **Description**: This script provides a convenient way to extract various
  archive formats including tar, zip, gzip, bzip2, rar, etc. It simplifies the
  extraction process by automatically detecting the file format and applying the
  appropriate extraction method.
- **RAW Script**: [ex.sh]

<br />

## Function Declaration

```bash
# Function: ex
function ex() {
```

The script defines a function called `ex`. This function is responsible for
handling the extraction of different archive formats.

<br />

## File Existence Check

```bash
  # Check if the input file exists
  if [ -f "$1" ]; then
```

The function starts by checking if the input file (passed as the first argument
`$1`) exists using the `-f` flag.

<br />

## Case Statement for File Type Detection

```bash
    # Determine the file type and perform extraction accordingly
    case "$1" in
```

The script uses a `case` statement to determine the file type based on the file
extension of the input file.

<br />

## Handling Different File Types

Each case within the `case` statement handles a specific file extension:

- **`.tar.bz2`**: Extracts using `tar -jxvf`

  ```bash
    *.tar.bz2) tar -jxvf "$1" ;;
  ```

<br />

- **`.tar.gz`**: Extracts using `tar -zxvf`

  ```bash
    *.tar.gz) tar -zxvf "$1" ;;
  ```

<br />

- **`.bz2`**: Extracts using `bunzip2`

  ```bash
    *.bz2) bunzip2 "$1" ;;
  ```

<br />

- **`.dmg`**: Mounts the disk image using `hdiutil`

  ```bash
    *.dmg) hdiutil mount "$1" ;;
  ```

<br />

- **`.gz`**: Extracts using `gunzip`

  ```bash
    *.gz) gunzip "$1" ;;
  ```

<br />

- **`.tar`**: Extracts using `tar -xvf`

  ```bash
    *.tar) tar -xvf "$1" ;;
  ```

<br />

- **`.tbz2`**: Extracts using `tar -jxvf`

  ```bash
    *.tbz2) tar -jxvf "$1" ;;
  ```

<br />

- **`.tgz`**: Extracts using `tar -zxvf`

  ```bash
    *.tgz) tar -zxvf "$1" ;;
  ```

<br />

- **`.zip` or `.ZIP`**: Extracts using `unzip`

  ```bash
    *.zip | *.ZIP) unzip "$1" ;;
  ```

<br />

- **`.pax`**: Extracts using `pax`

  ```bash
    *.pax) pax -r <"$1" ;;
  ```

<br />

- **`.pax.Z`**: Uncompresses and extracts using `uncompress` piped to `pax`

  ```bash
    *.pax.Z) uncompress "$1" --stdout | pax -r ;;
  ```

<br />

- **`.rar`**: Extracts using `unrar`

  ```bash
    *.rar) unrar x "$1" ;;
  ```

<br />

- **`.Z`**: Extracts using `uncompress`

  ```bash
    *.Z) uncompress "$1" ;;
  ```

<br />

## Unsupported File Format

```bash
    *) echo "$1 cannot be extracted/mounted via ex()" ;; # Unsupported file format
```

If the file extension does not match any of the supported formats, the script
prints a message indicating that the file cannot be extracted.

<br />

## Non-Existent File Handling

```bash
  else
    echo "$1 is not a valid file" # Print error message for non-existent files
  fi
```

If the input file does not exist, the script prints an error message indicating
that the file is not valid.

<br />

## Conclusion

This script effectively handles the extraction of various archive formats,
making it a handy tool for simplifying the process of dealing with compressed
files.

[ex.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/ex.sh
