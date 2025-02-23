---
title: "mkdirg.info"
description:
  "A shell script function that creates a directory if it doesn't exist and
  navigates into it. The script ensures the correct number of arguments, checks
  for existing directories, and handles errors gracefully. Additionally, it
  verifies and updates script metadata comments for better documentation."
url: "shell-script/function-info/mkdirg"
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
  - Shell Scripting
  - Bash Function
  - Directory Management
  - Script Documentation
  - Automation
keywords:
  - mkdirg
  - bash script
  - shell function
  - directory creation
  - scripting
  - automation
  - metadata verification

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
`mkdirg.sh`, authored by GJS (homelab-alpha), and its purpose is to create a
function called `mkdirg` that creates a directory if it doesn't already exist
and then navigates into that directory. This script handles the creation of
directories and changes the current working directory to the newly created one.

## Script Metadata

- **Filename**: `mkdirg.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 26, 2024
- **Version**: 1.0.1
- **Description**: This script creates a directory if it doesn't exist and
  navigates into it.
- **RAW Script**: [mkdirg.sh]

<br />

## Function Definition

The script defines a function `mkdirg`:

```bash
function mkdirg() {
```

<br />

## Argument Check

The function first checks if exactly one argument is provided, which should be
the name of the directory to create:

```bash
  # Check if the correct number of arguments is provided
  if [ $# -ne 1 ]; then
    echo "Usage: mkdirg directory_name"
    return 1
  fi
```

If the number of arguments is not exactly one, it prints a usage message and
returns with a status of 1, indicating an error.

<br />

## Directory Name Storage

The provided directory name is stored in a local variable:

```bash
  # Store the directory name provided as an argument
  local directory_name="$1"
```

<br />

## Directory Existence Check

The script checks if the directory already exists:

```bash
  # Check if the directory already exists
  if [ -d "$directory_name" ]; then
    echo "Directory already exists: $directory_name"
    return 1
  fi
```

If the directory exists, it prints a message and returns with a status of 1.

<br />

## Directory Creation and Navigation

If the directory does not exist, it creates the directory and navigates into it:

```bash
  # Create the directory and navigate into it
  mkdir -p "$directory_name" && cd "$directory_name" || exit
}
```

The `mkdir -p` command ensures that any necessary parent directories are
created. The `&& cd "$directory_name"` part ensures that the script only changes
the directory if the creation is successful. The `|| exit` part ensures the
script exits if the `cd` command fails.

<br />

## Script Metadata Checks and Updates

The script includes a mechanism to check if certain comments are present and
adds them if they are missing:

```bash
# Check if Description is present in the script, add if not
grep -q "# Description:" "$0" || sed -i '2i# Description:' "$0"

# Check if Usage Example is present in the script, add if not
grep -q "# Usage Example:" "$0" || sed -i '/# Description/a# Usage Example:' "$0"
```

These lines use `grep` to search for specific comments in the script and `sed`
to insert them if they are not found.

<br />

## Displaying the Script

Finally, the script prints its own contents:

```bash
# Show the entire script with improvements
cat "$0"
```

This part uses `cat` to display the script, potentially useful for reviewing the
current state of the script after any modifications.

<br />

## Conclusion

Overall, the `mkdirg.sh` script is a useful tool for creating directories and
navigating into them while also ensuring that necessary metadata is present in
the script itself.

[mkdirg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/mkdirg.sh
