---
title: "check_system_info.info"
description:
  "This script provides comprehensive system information, including system
  uptime, hardware details, temperature readings, systemctl status, memory (RAM
  and SWAP) usage, disk space and inode usage, and recent reboot/shutdown
  events. It's a valuable tool for system administrators and users who need to
  quickly gather and review essential system metrics on Linux."
url: "shell-script/script-info/check-system-info"
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
  - System Information
  - Linux
  - System Administration
  - Scripting
keywords:
  - Shell script
  - System info
  - System temperature
  - Uptime
  - Hardware details
  - systemctl status
  - RAM usage
  - SWAP usage
  - Disk usage
  - Disk usage inodes
  - Reboot events
  - Shutdown events

weight: 9100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`check_system_info.sh`, authored by GJS (homelab-alpha), and its purpose is to
check various aspects of system information. It provides details about system
uptime, hardware information, system temperature, systemctl status, RAM/SWAP
usage, disk usage, disk usage inodes, and last reboot/shutdown events.

## Script Metadata

- **Filename**: `check_system_info.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.0.1
- **Description**: This script checks system information. It provides details
  about system uptime, hardware information, system temperature, systemctl
  status, RAM/SWAP usage, disk usage, disk usage inodes, and last
  reboot/shutdown events.
- **RAW Script**: [check_system_info.sh]

<br />

## Script Structure and Functions

### Print Section Separators

The script includes a function `print_separator` to print a line separator for
clarity.

```bash
print_separator() {
    echo "────────────────────────────────────────────────────────────────────────────────"
}
```

<br />

### Check if a Command Exists

A helper function `command_exists` checks if a command is available on the
system.

```bash
command_exists() {
    command -v "$1" >/dev/null 2>&1
}
```

<br />

### Initial Information

Prints the current date, user, and system uptime.

```bash
print_separator
echo "$(date) │ $(whoami)@$(hostname --all-ip-addresses) │ $(uptime --pretty)"
print_separator
```

<br />

## Checking for Required Commands

### Check for Required Commands

It checks if the necessary commands (`sensors`, `hostnamectl`, `df`, `last`) are
available and lists any missing commands.

```bash
missing_commands=()
if ! command_exists "sensors"; then
    missing_commands+=("sensors")
fi
if ! command_exists "hostnamectl"; then
    missing_commands+=("hostnamectl")
fi
if ! command_exists "df"; then
    missing_commands+=("df")
fi
if ! command_exists "last"; then
    missing_commands+=("last")
fi

if [ ${#missing_commands[@]} -eq 0 ]; then
    echo "All required software is present."
else
    echo "The following software is missing:"
    for cmd in "${missing_commands[@]}"; do
        echo " - $cmd"
    done
    echo "You can install missing software manually using your package manager."
fi
```

<br />

## Detailed System Information

### System Info

Prints system model information and hostname details.

```bash
print_separator
echo "System info:"
echo ""
if command_exists "cat"; then
    cat /proc/device-tree/model
else
    echo "ERROR: 'cat' command not found."
fi
echo ""
if command_exists "hostnamectl"; then
    hostnamectl
else
    echo "ERROR: 'hostnamectl' command not found."
fi
print_separator
```

<br />

### System Temperature

Checks and prints system temperature using the `sensors` command.

```bash
echo "System temperature:"
echo ""
if command_exists "sensors"; then
    sensors
else
    echo "ERROR: 'sensors' command not found."
fi
print_separator
```

<br />

### Systemctl Status

Displays the status of failed system services.

```bash
echo "Systemctl status:"
echo ""
if command_exists "systemctl"; then
    systemctl --failed
else
    echo "ERROR: 'systemctl' command not found."
fi
print_separator
```

<br />

### RAM/SWAP Usage

Shows RAM and SWAP usage using the `free` command.

```bash
echo "RAM/SWAP usage:"
echo ""
if command_exists "free"; then
    free --human
else
    echo "ERROR: 'free' command not found."
fi
print_separator
```

<br />

### Disk Usage

Provides detailed disk usage information.

```bash
echo "Disk usage:"
echo ""
if command_exists "df"; then
    df --human-readable --type=ext4 --output=source,size,used,avail,pcent,target
else
    echo "ERROR: 'df' command not found."
fi
print_separator
```

<br />

### Disk Usage Inodes

Shows inode usage of the disk.

```bash
echo "Disk usage inodes:"
echo ""
if command_exists "df"; then
    df --human-readable --inodes
else
    echo "ERROR: 'df' command not found."
fi
print_separator
```

<br />

### Last Reboot/Shutdown Events

Displays the last three system shutdown events.

```bash
echo "Last reboot/shutdown:"
echo ""
if command_exists "last"; then
    last --system | grep shutdown | head --lines=3
else
    echo "ERROR: 'last' command not found."
fi
print_separator
```

<br />

## Conclusion

The script is well-organized, providing clear output of the system status and
any missing software that may be needed to perform certain checks. It's handy
for quickly diagnosing the state of a Linux system.

[check_system_info.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/check_system_info.sh
