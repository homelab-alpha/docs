---
title: "cpg.info"
description:
  "The cpg.info script, provides a versatile function 'cpg' designed for copying
  files or directories from a source to a destination, encompassing single files
  and directories, including recursive copying. Discover its detailed
  functionality and how it streamlines file management tasks."
url: "shell-script/function-info/cpg"
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
  - Shell Script
  - File Management
  - Copy Files
  - Copy Directories
  - Recursive Copy
  - Scripting
  - Bash Script
  - Function
keywords:
  - cpg.info
  - shell script
  - file management
  - copy files
  - copy directories
  - recursive copy
  - bash script
  - function information

weight: 6200

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named `cpg.sh`,
authored by GJS (homelab-alpha), and its purpose is to create a function called
`cpg` that can copy files or directories from a source location to a destination
location. The script handles both single files and directories, including
recursive copying for directories.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `cpg.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 26, 2024
- **Version**: 1.0.1
- **Description**: The script provides a function `cpg` to copy files or
  directories from a source to a destination, handling both single files and
  directories recursively.
- **RAW Script**: [cpg.sh]

<br />

## Detailed Explanation

The main part of this script is the function `cpg`. Let's go through what it
does step by step.

### Function Definition and Argument Check

```bash
function cpg() {
  if [ $# -ne 2 ]; then
    echo "Usage: cpg source destination"
    return 1
  fi
```

The function `cpg` is defined here. It starts by checking if the number of
arguments passed is exactly 2. If not, it prints a usage message
(`Usage: cpg source destination`) and returns an error status (`1`).

<br />

### Variables Assignment

```bash
  local source="$1"
  local destination="$2"
```

The script assigns the first argument to a variable named `source` and the
second argument to a variable named `destination`. This makes the code more
readable and easier to work with.

<br />

### Directory Check and Recursive Copy

```bash
  if [ -d "$source" ]; then
    if [ -d "$destination" ]; then
      cp -r "$source" "$destination" && cd "$destination/$(basename "$source")" || exit
    else
      echo "Destination is not a directory: $destination"
      return 1
    fi
  else
    cp "$source" "$destination"
  fi
}
```

Next, the script checks if the `source` is a directory using the `-d` flag. If
`source` is a directory, it then checks if the `destination` is also a
directory. If both conditions are true, it uses the `cp -r` command to
recursively copy the `source` directory to the `destination`. After the copy
operation, it changes the current directory to the newly copied directory within
the `destination` using the `cd` command. If the directory change fails, the
script exits with an error.

<br />

### Single File Copy

If the `source` is not a directory, the script simply copies the `source` file
to the `destination` using the `cp` command.

<br />

### Error Handling

The script includes basic error handling. If the `destination` is not a
directory when the `source` is a directory, it prints an error message
(`Destination is not a directory: $destination`) and returns an error status
(`1`).

<br />

## Conclusion

To summarize, the `cpg` function in the `cpg.sh` script:

1. **Checks Argument Count**: Ensures exactly two arguments are passed.
2. **Assigns Variables**: Stores the arguments in `source` and `destination`.
3. **Handles Directories**:
   - If `source` is a directory and `destination` is also a directory, it copies
     `source` to `destination` recursively and changes the directory to the
     copied directory.
   - If `destination` is not a directory, it prints an error and exits.
4. **Handles Files**: If `source` is a file, it copies the file to
   `destination`.

This function is a useful tool for copying files and directories with ease,
including handling the complexities of recursive directory copying.

[cpg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/cpg.sh
