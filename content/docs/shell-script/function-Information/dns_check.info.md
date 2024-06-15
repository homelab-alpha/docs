---
title: "dns_check.info"
description:
  "The dns_check.info script, offers a robust network diagnostic tool aimed at
  assessing network connectivity and DNS server availability, essential for
  troubleshooting network issues. Dive into its detailed functionality and learn
  how it aids in diagnosing potential network-related problems."
url: "shell-script/function-info/dns-check"
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
  - Network Diagnostics
  - DNS Server
  - Network Connectivity
  - Troubleshooting
  - Ping Test
  - Network Interface
keywords:
  - dns_check.info
  - shell script
  - network diagnostics
  - DNS server
  - network connectivity
  - troubleshooting
  - ping test
  - network interface

weight: 6200

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let’s break down what this script does in detail. The script is named
`dns_check.sh`, authored by GJS (homelab-alpha), and its purpose of assessing
network connectivity and the availability of DNS servers. While it doesn't
execute specific tasks, it's instrumental in diagnosing potential
network-related issues.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `dns_check.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: 2024-05-26
- **Version**: 1.0.1
- **Description**: The script checks network connectivity and DNS server
  availability, aiding in troubleshooting network problems.
- **RAW Script**: [dns_check.sh]

<br />

The script employs a function named `dns-checker()` to carry out the network
checks. Let's dissect its components:

<br />

## ANSI Color Codes

```bash
green="\e[32m"   # Green color code
red="\e[31m"     # Red color code
end="\e[0m"      # Reset text formatting
```

These variables store ANSI color codes for green, red, and resetting text
formatting, enhancing the readability of log messages.

<br />

## Timestamp

```bash
stamp="$(date +'[%b %d, %Y - %H%M%S]')" # Timestamp for log messages
```

This line generates a timestamp to append to log messages, providing a
chronological context for network events.

<br />

## Logging Function

```bash
function log_message() {
  local message="$1"
  echo -e "$stamp $message"
}
```

The `log_message()` function facilitates logging by adding timestamps to
provided messages and echoing them to the console.

<br />

## Ping Checking Function

```bash
function check_ping() {
  local host="$1"
  if ping -c 1 "$host" >/dev/null; then
    return 0
  else
    return 1
  fi
}
```

This function, `check_ping()`, tests the reachability of a specified host via a
single ping. It returns 0 if successful and 1 if unsuccessful.

<br />

## DNS Server Checks

The script checks the availability of primary and secondary local (internal) DNS
servers, such as PiHole or AdGuard Home, as well as overall internet
connectivity.

First, it pings the primary local DNS server and logs its status. If the primary
DNS server is unreachable, it pings the secondary local DNS server to check its
availability.

Next, the script tests overall network connectivity by attempting to reach
`google.com`. If `google.com` is unreachable, the script indicates a potential
network issue.

If the network appears to be down, the script performs further diagnostics by
pinging external DNS servers (`9.9.9.9` and `149.112.112.112`). This helps
determine if the problem lies with DNS failures or broader network issues.

<br />

## Network Interface Logging

```bash
ifconfig >>"DNS_failure_interface_${stamp}.txt"
```

In case of network failures, the script appends network interface information to
a timestamped log file, aiding in subsequent troubleshooting.

<br />

## Conclusion

In essence, `dns_check.sh` provides a comprehensive network diagnostic tool,
assessing DNS server availability and network connectivity, and logging relevant
information for troubleshooting purposes.

[dns_check.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/dns_check.sh
