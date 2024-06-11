---
title: "user_accounts_info.info"
description:
  "Retrieve and organize detailed information about system and normal user
  accounts, categorizing them based on UID and GID values."
url: "shell-script/script-info/user-accounts-info"
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
  - user management
  - account information
  - system administration
  - shell script
  - Linux
keywords:
  - user
  - accounts
  - system users
  - normal users
  - UID
  - GID
  - shell script
  - Linux administration
  - passwd file
  - login.defs
  - user
  - groups

weight: 6100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}} ChatGPT has contributed to this document.
Therefore, it's advisable to treat the information here with caution and verify
it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`user_accounts_info.sh`, authored by GJS (homelab-alpha), and its purpose is to
retrieve and organize information about system user accounts. It categorizes the
accounts into system and normal user categories and displays relevant details in
a formatted manner.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `user_accounts_info.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.0.1
- **Description**: The script retrieves information about system user accounts
  and organizes them into system and normal user categories.
- **RAW Script**: [user_accounts_info.sh]

<br />

## Overview

The script is designed to extract user account information from the system's
`passwd` file and categorize them into system and normal users based on UID and
GID values defined in the `login.defs` file. It uses `awk` for data processing
and displays the information in a tabular format.

<br />

## Detailed Explanation

### Functions

#### `print_header()`

This function prints a formatted header for the output. It uses `echo` and
`printf` to create a table-like header.

```bash
print_header() {
  echo "==========================================================================================================="
  printf "%-15s %-15s %-30s %-25s %-20s\n" "UID" "GID" "Shell" "Username" "Groups"
  echo "==========================================================================================================="
}
```

<br />

### Main Program

#### File Paths

The script defines the paths to the `login.defs` and `passwd` files.

```bash
login_defs="/etc/login.defs"
passwd_file="/etc/passwd"
```

<br />

#### File Existence Check

It checks if the required files (`login.defs` and `passwd`) exist. If either
file is missing, the script exits with an error message.

```bash
if [ ! -f "$login_defs" ] || [ ! -f "$passwd_file" ]; then
  echo "ERROR: Required files not found."
  exit 1
fi
```

<br />

#### Retrieve UID and GID Limits

The script extracts the minimum and maximum UID and GID values from the
`login.defs` file using `awk`.

```bash
min_uid=$(awk '/^UID_MIN/{print $2}' "$login_defs")
max_uid=$(awk '/^UID_MAX/{print $2}' "$login_defs")
min_gid=$(awk '/^GID_MIN/{print $2}' "$login_defs")
max_gid=$(awk '/^GID_MAX/{print $2}' "$login_defs")
```

<br />

#### Check for `awk` Availability

It verifies if `awk` is available on the system. If not, the script exits with
an error message.

```bash
if ! command -v awk &>/dev/null; then
  echo "ERROR: awk command not found."
  exit 1
fi
```

<br />

### Print System User Accounts

The script prints the header for system user accounts and then uses `awk` to
process the `passwd` file. It filters out accounts that fall outside the range
of normal user UIDs and GIDs, displaying only system accounts. It also retrieves
and displays the groups for each user.

```bash
print_header "System User Accounts"
awk -F':' -v "min_uid=$min_uid" -v "max_uid=$max_uid" -v "min_gid=$min_gid" -v "max_gid=$max_gid" '
    function get_user_groups(username) {
        "id -Gn " username | getline groups
        close("id -Gn " username)
        return groups
    }
    !($3 >= min_uid && $3 <= max_uid && $4 >= min_gid && $4 <= max_gid) {
        printf "%-15s %-15s %-30s %-25s %-20s\n", "UID: "$3, "GID: "$4, "Shell: "$7, $1, get_user_groups($1)
    }' "$passwd_file" | sort -n -t ':' -k 2
```

<br />

### Print Normal User Accounts

Similarly, the script prints the header for normal user accounts and uses `awk`
to process and display details for users within the specified UID and GID
ranges.

```bash
echo "" # Add a blank line between sections

print_header "Normal User Accounts"
awk -F':' -v "min_uid=$min_uid" -v "max_uid=$max_uid" -v "min_gid=$min_gid" -v "max_gid=$max_gid" '
    function get_user_groups(username) {
        "id -Gn " username | getline groups
        close("id -Gn " username)
        return groups
    }
    $3 >= min_uid && $3 <= max_uid && $4 >= min_gid && $4 <= max_gid {
        printf "%-15s %-15s %-30s %-25s %-20s\n", "UID: "$3, "GID: "$4, "Shell: "$7, $1, get_user_groups($1)
    }' "$passwd_file" | sort -n -t ':' -k 2
```

<br />

## Notes

- The script requires read access to the `/etc/login.defs` and `/etc/passwd`
  files.
- It relies on `awk` for data processing.
- The output is sorted based on UID and GID for easier readability.

This script effectively categorizes and displays user account information on a
Unix-like system, providing a clear separation between system and normal users.

[user_accounts_info.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/user_accounts_info.sh
