---
title: "mvg.info"
description:
  "This documentation provides an in-depth explanation of the `mvg.sh` script,
  authored by Homelab-Alpha. The script is designed to move a file or directory
  to a specified destination and then change the working directory to the new
  location. It includes validation checks for the source and destination and can
  add metadata to itself if it's missing."
url: "shell-script/function-info/mvg"
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
  - shell-scripting
  - file-management
  - automation
  - linux
keywords:
  - shell script
  - move files
  - directory management
  - bash function
  - script metadata
  - automation tools
  - linux commands

weight: 6200

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named `mvg.sh`,
authored by GJS (homelab-alpha), and its purpose is to create a function called
`mvg` that moves a file or directory to a specified destination and then enters
the destination directory. The script also ensures the source and destination
are valid and provides functionality to add metadata to itself if it's missing.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `mvg.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 26, 2024
- **Version**: 1.0.1
- **Description**: This script moves a file or directory to a specified
  destination and then enters the destination directory.
- **RAW Script**: [mvg.sh]

<br />

## Detailed Explanation

### Function: `mvg`

The function `mvg` is the core of the script. Here's a step-by-step breakdown of
what it does:

<br />

#### Argument Check

```bash
if [ $# -ne 2 ]; then
  echo "Usage: mvg source destination"
  return 1
fi
```

The script first checks if the number of arguments provided is exactly two (the
source and the destination). If not, it prints a usage message and exits the
function with a status of `1`.

<br />

#### Variable Assignment

```bash
local source="$1"
local destination="$2"
```

The script assigns the first argument to `source` and the second argument to
`destination`.

<br />

#### Source Existence Check

```bash
if [ ! -e "$source" ]; then
  echo "Source does not exist: $source"
  return 1
fi
```

It checks if the source exists using the `-e` flag. If the source doesn't exist,
it prints an error message and exits the function with a status of `1`.

<br />

#### Destination Validity Check

```bash
if [ ! -d "$destination" ]; then
  echo "Destination is not a directory: $destination"
  return 1
fi
```

It checks if the destination exists and is a directory using the `-d` flag. If
the destination is not a directory, it prints an error message and exits the
function with a status of `1`.

<br />

#### Move and Enter Directory

```bash
mv "$source" "$destination" && cd "$destination/$(basename "$source")" || exit
```

If both checks pass, the script moves the source to the destination using the
`mv` command. Then, it tries to change the directory to the new location of the
moved source using `cd`. If either of these commands fails, it exits the script.

<br />

### Script Metadata Management

The script also includes functionality to add metadata descriptions and usage
examples if they are missing from the script.

#### Add Description

```bash
description=$(grep -c "# Description:" "$0")
if [ "$description" -eq 0 ]; then
  sed -i '2i# Description: This script moves a file or directory to a specified destination and then enters the destination directory.' "$0"
fi
```

It checks if the description line is present in the script using `grep`. If not,
it inserts the description after the second line using `sed`.

<br />

#### Add Usage Example

```bash
usage_example=$(grep -c "# Example usage:" "$0")
if [ "$usage_example" -eq 0 ]; then
  sed -i '4i# Example usage: ./mvg.sh source_file.txt destination_directory/' "$0"
fi
```

It checks if the usage example line is present in the script using `grep`. If
not, it inserts the usage example after the fourth line using `sed`.

<br />

## Conclusion

This script is a useful tool for moving files or directories to a new location
and ensuring the working directory is updated to the new location, while also
maintaining its own documentation.

[mvg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/mvg.sh
