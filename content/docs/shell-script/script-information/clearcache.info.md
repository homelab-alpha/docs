---
title: "clearcache.info"
description:
  "This script is designed to optimize Linux system performance by clearing file
  system caches and reclaiming memory."
url: "shell-script/script-info/clearcache"
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
  - Linux
  - System Administration
  - Cache Management
  - Performance Optimization
  - Memory Management
keywords:
  - clear cache
  - Linux shell script
  - memory optimization
  - system performance
  - filesystem caches
  - slab objects
  - dentries
  - inodes
  - Homelab-Alpha

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
`clearcache.sh`, authored by GJS (homelab-alpha), and its purpose is to drop
clean caches and reclaimable slab objects like dentries and inodes on a Linux
system. This script ensures that the file system's caches are cleared, which can
help in freeing up memory and improving system performance.

Here's a detailed explanation:

## Script Metadata

- **Script Name**: `clearcache.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.0.1
- **Description**: This script drops clean caches, as well as reclaimable slab
  objects like dentries and inodes.
- **RAW Script**: [clearcache.sh]

<br />

## Detailed Explanation

The script is designed to clear system caches, which is particularly useful for
system administrators who want to ensure that their Linux systems run
efficiently by freeing up unused memory.

<br />

### Logging Configuration

- **Log Directory**: `$HOME/.bash_script`
- **Log File**: `$log_dir/clearcache_cron.log`

<br />

### Logging Function

`log_message()`: This function takes a message as an argument and logs it to the
specified log file with a timestamp.

```bash
log_message() {
  local log_timestamp
  log_timestamp=$(date +"%Y-%m-%d %T")
  echo "[$log_timestamp] $1" >>"$log_file"
}
```

<br />

### Initial Logging

The script starts logging by adding a blank line and a start message to the log
file.

```bash
echo "" >>"$log_file"
log_message "=== beginning of the log ==="
log_message "INFO: Script execution started."
```

<br />

### Root User Check

The script checks if it is being run as root or with sudo. If not, it logs an
error message and exits.

```bash
if [ "$EUID" -ne 0 ]; then
  log_message "ERROR: This script must be run as root or with sudo."
  log_message "=== end of the log ==="
  exit 1
fi
```

<br />

### Log Directory Creation

The script checks if the log directory exists. If not, it attempts to create it
and logs the result.

```bash
if [ ! -d "$log_dir" ]; then
  mkdir -p "$log_dir" || {
    log_message "ERROR: Unable to create log directory: $log_dir"
    log_message "=== end of the log ==="
    exit 1
  }
  log_message "INFO: Log directory created: $log_dir"
fi
```

<br />

### Log File Creation

The script checks if the log file exists. If not, it attempts to create it and
logs the result.

```bash
if [ ! -f "$log_file" ]; then
  touch "$log_file" || {
    log_message "ERROR: Unable to create log file: $log_file"
    log_message "=== end of the log ==="
    exit 1
  }
  log_message "INFO: Log file created: $log_file"
fi
```

<br />

### File System Synchronization

The script synchronizes the file system to ensure all buffered modifications are
written to disk.

```bash
sync
```

<br />

### Clearing Caches

The script checks if the file `/proc/sys/vm/drop_caches` exists. If it does, it
writes `1` to this file to clear the caches and logs the result.

```bash
if [ -e /proc/sys/vm/drop_caches ]; then
  echo 1 >/proc/sys/vm/drop_caches
  log_message "INFO: File system caches have been cleared."
else
  log_message "ERROR: File /proc/sys/vm/drop_caches does not exist. Cache clearing failed."
  log_message "=== end of the log ==="
  exit 1
fi
```

<br />

### Completion Logging

The script logs a success message indicating that it has completed successfully
and ends the log.

```bash
log_message "INFO: Script execution completed successfully."
log_message "=== end of the log ==="
```

<br />

## Conclusion

The `clearcache.sh` script is a useful tool for Linux system administrators to
free up memory by clearing file system caches. It includes comprehensive
logging, checks for necessary permissions, and ensures that log directories and
files are created if they do not exist. The script is designed to be run as a
cron job, allowing automated clearing of caches at specified intervals.

[clearcache.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/clearcache.sh
