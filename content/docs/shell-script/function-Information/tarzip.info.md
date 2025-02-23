---
title: "tarzip.info"
description:
  "A comprehensive shell script for creating and verifying compressed archives
  (.zip) of specified directories. The `tarzip.sh` script, combines `tar` and
  `zip` commands to ensure robust archiving and compression with added
  verification steps. Ideal for system administrators and users needing
  efficient backup solutions."
url: "shell-script/function-info/tarzip"
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
  - Bash
  - Archiving
  - Compression
  - Backup
  - Shell Scripting
  - tar
  - zip
keywords:
  - tarzip.sh
  - Bash script
  - file compression
  - directory archiving
  - backup script
  - shell function
  - Homelab-Alpha
  - tar command
  - zip command
  - automated backup

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
`tarzip.sh`, authored by GJS (homelab-alpha), and its purpose is to create a
compressed archive (.zip) of a specified folder using tar and zip commands.

## Script Metadata

- **Filename**: `tarzip.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 26, 2024
- **Version**: 1.0.1
- **Description**: The script provides a function `tarzip` to create a tar
  archive of a specified folder and then compress it into a .zip file with a
  timestamp in the filename. It also includes verification of the compressed
  file.
- **RAW Script**: [tarzip.sh]

<br />

The script is written in Bash and defines a single function called `tarzip`.
Let's go through it step by step.

## Function Definition and Input Validation

```bash
function tarzip() {
  local input_folder
  input_folder="$1"

  # Input validation
  if [ $# -ne 1 ]; then
    echo "Usage: tarzip <folder>"
    return 1
  fi

  if [ ! -d "$input_folder" ]; then
    echo "Error: '$input_folder' is not a valid directory."
    return 1
  fi
```

The function `tarzip` starts by defining a local variable `input_folder` to hold
the first argument passed to the function. It checks if the number of arguments
is exactly one. If not, it prints a usage message and exits with a return code
of 1. It then checks if the argument is a valid directory. If not, it prints an
error message and exits with a return code of 1.

<br />

## Generating a Timestamp and Filenames

```bash
  local timestamp
  timestamp="$(date +'%b %d, %Y - %H%M%S')"

  local tmp_file
  tmp_file="${input_folder%/} [$timestamp].tar"

  local zip_file
  zip_file="${input_folder%/} [$timestamp].tar.zip"
```

The script generates a timestamp using the `date` command formatted as "Month
Day, Year - HHMMSS". It then constructs the temporary tar filename and the final
zip filename by appending the timestamp to the input folder name.

<br />

## Creating the Tar Archive

```bash
  echo "Creating .tar archive for $input_folder..."
  tar --create --file="$tmp_file" --verbose "$input_folder" || return 1
```

It prints a message indicating that it's creating a tar archive for the input
folder. The `tar` command is used to create a tar archive (`--create`) with the
specified filename (`--file="$tmp_file"`) and verbose output (`--verbose`).

<br />

## Checking the Tar File Size

```bash
  local size
  size=$(stat -c "%s" "$tmp_file" 2>/dev/null)
  [ -z "$size" ] && size=$(stat -f "%z" "$tmp_file" 2>/dev/null)
```

It retrieves the size of the tar file using the `stat` command. This is done to
ensure that the file was created successfully. It tries two different `stat`
formats (`-c` and `-f`) for compatibility with different systems.

<br />

## Compressing the Tar Archive

```bash
  local cmd="zip"
  echo ""
  echo "Compressing .tar using $cmd..."
  $cmd "$zip_file" --encrypt --recurse-paths -9 --verbose "$tmp_file" || return 1

  if [ -f "$tmp_file" ]; then
    rm "$tmp_file"
  fi
```

1. The script sets the `cmd` variable to `zip`.
2. It prints a message indicating that it is compressing the tar file using the
   `zip` command.
3. The `zip` command is used to compress the tar file (`$tmp_file`) into a zip
   file (`$zip_file`). The options used are:

   - `--encrypt` to enable encryption.
   - `--recurse-paths` to include directories and their contents.
   - `-9` for maximum compression.
   - `--verbose` for verbose output.

4. After compressing, it checks if the tar file exists and removes it to clean
   up.

<br />

## Verifying the Zip Archive

```bash
  echo ""
  echo "Verifying $zip_file using $cmd..."
  $cmd "$zip_file" --test --verbose || return 1
```

The script prints a message indicating that it is verifying the zip file. The
`zip` command is used again to test the integrity of the zip file (`--test`)
with verbose output (`--verbose`).

<br />

## Finalizing

```bash
  echo ""
  echo "$zip_file has been successfully created and verified."
  chmod 644 "$zip_file"
}
```

It prints a success message indicating that the zip file has been created and
verified. It sets the permissions of the zip file to `644` using `chmod`, making
it readable by everyone but writable only by the owner.

<br />

## Conclusion

The `tarzip.sh` script is a useful tool for creating compressed archives of
directories. It includes robust input validation, generates filenames with
timestamps, and ensures the integrity of the compressed file through
verification. The detailed messages and verbose output help in understanding
each step of the process.

[tarzip.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/tarzip.sh
