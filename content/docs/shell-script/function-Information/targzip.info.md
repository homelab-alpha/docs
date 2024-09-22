---
title: "targzip.info"
description:
  "Automate the process of creating and compressing tar archives with
  `targzip.sh`. This script generates a tar archive of a specified directory or
  file, compresses it using gzip, and verifies the integrity of the compressed
  file, ensuring reliability and efficiency."
url: "shell-script/function-info/targzip"
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
  - shell-script
  - tar
  - gzip
  - archiving
  - compression
keywords:
  - shell script
  - tar command
  - gzip compression
  - file archiving
  - bash script
  - file compression
  - tar archive
  - gzip verification
  - linux scripting
  - shell automation

weight: 9200

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`targzip.sh`, authored by GJS (homelab-alpha), and its purpose is to create a
function called `targzip` that creates a tar archive of a directory or file and
compresses it using gzip. The script handles the creation of the archive,
compression, and verification of the compressed file.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `targzip.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 26, 2024
- **Version**: 1.0.1
- **Description**: This script creates a tar archive of a directory or file and
  compresses it using gzip.
- **Usage**: `targzip <directory or file>`
- **RAW Script**: [targzip.sh]

<br />

## Function Definition

```bash
function targzip() {
  local source
  source="$1"
  local timestamp
  timestamp=$(date +'%b %d, %Y - %H%M%S')
  local tmpFile
  tmpFile="${source%/} [$timestamp].tar"
  local compressedFile
  compressedFile="$tmpFile.gz"
```

The function `targzip` starts by defining several local variables:

- `source`: The directory or file to be archived, passed as the first argument
  to the function.
- `timestamp`: A timestamp generated in the format
  `Month Day, Year - HourMinuteSecond`.
- `tmpFile`: The name of the tar file, including the source name and the
  timestamp.
- `compressedFile`: The name of the compressed file, which is the tar filename
  with a `.gz` extension.

<br />

## Create Tar Archive

```bash
  tar --create --file="$tmpFile" --verify --verbose "$source" || return 1
```

The script creates a tar archive of the `source` and stores it in `tmpFile`. It
uses the `tar` command with the `--create`, `--file`, `--verify`, and
`--verbose` options:

- `--create`: Creates a new archive.
- `--file="$tmpFile"`: Specifies the name of the archive file.
- `--verify`: Verifies the contents of the archive after creation.
- `--verbose`: Provides detailed information about the process.

If the tar command fails, the function returns 1, indicating an error.

<br />

## Determine File Size

```bash
  local size
  if stat --version &>/dev/null; then
    size=$(stat -c%s "$tmpFile")
  elif stat -f%z "$tmpFile" &>/dev/null; then
    size=$(stat -f%z "$tmpFile")
  else
    echo "Error: Unable to determine file size."
    return 1
  fi

  echo "Size of $tmpFile: $size bytes"
```

The script then determines the size of the tar file using the `stat` command. It
tries two different formats of the `stat` command to ensure compatibility across
different systems:

- `stat -c%s "$tmpFile"`: For systems that support GNU stat.
- `stat -f%z "$tmpFile"`: For systems that use BSD stat.

If neither command works, it outputs an error message and returns 1. If
successful, it prints the size of the tar file.

<br />

## Compress Tar Archive

```bash
  local cmd="gzip"

  echo ""
  echo "Compressing .tar using $cmd."
  $cmd "$tmpFile" --best --rsyncable --verbose || return 1
  [ -f "$tmpFile" ] && rm "$tmpFile"
```

The script then compresses the tar file using `gzip` with the options:

- `--best`: Uses the best compression level.
- `--rsyncable`: Makes the compression rsync-friendly.
- `--verbose`: Provides detailed information about the process.

If the compression succeeds, it deletes the original tar file.

<br />

## Verify Compressed File

```bash
  echo ""
  echo "Verifying $compressedFile using $cmd."
  $cmd -t "$compressedFile" --verbose || return 1

  echo ""
  echo "$compressedFile has been successfully created and verified."
  chmod 644 "$compressedFile"
```

The script verifies the integrity of the compressed file using `gzip -t`, which
tests the compressed file for errors. If successful, it prints a success message
and changes the permissions of the compressed file to be readable and writable
by the owner and readable by others (`chmod 644`).

<br />

## Call the Function

```bash
targzip "$1"
```

Finally, the script calls the `targzip` function with the first argument passed
to the script, initiating the archiving and compression process.

<br />

## Conclusion

The `targzip.sh` script automates the process of creating a tar archive of a
directory or file, compressing it with gzip, and verifying the integrity of the
compressed file. It ensures compatibility across different systems by checking
for available `stat` command formats and provides detailed output at each step
for transparency and debugging purposes.

[targzip.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/targzip.sh
