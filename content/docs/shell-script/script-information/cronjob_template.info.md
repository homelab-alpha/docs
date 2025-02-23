---
title: "cronjob_template.info"
description:
  "Template script for setting up a cron job to send system health check pings
  to a monitoring server."
url: "shell-script/script-info/cronjob-template"
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
  - cron job
  - system monitoring
  - shell script
  - automation
  - server health check
keywords:
  - cron job template
  - system health check script
  - automate server monitoring
  - ping monitoring server
  - cron job example

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
`cronjob_template.sh`, authored by GJS (homelab-alpha), and its purpose is to
provide a template for a cron job that sends a ping to a monitoring server for
system health checks.

## Script Metadata

- **Filename**: `cronjob_template.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.0.1
- **Description**: This script serves as a cron job template that sends a ping
  to a monitoring server to check system health.
- **Usage**: The script should be executed with root privileges using `sudo`.
- **RAW Script**: [cronjob_template.sh]

<br />

## Script Header

The header includes metadata such as the filename, author, date, version, and
a brief description of its functionality.

<br />

## Usage Instructions

The script provides usage instructions, emphasizing the need for `curl` to be
installed and the script to be run with root privileges. It also includes an
example of how to set up a cron job to execute the script at specified
intervals.

<br />

## Cron Job Example

The script includes a template for setting up a cron job. This example runs the
script every 3 hours from 07:00 to 23:00:

```sh
10 07-23/3 * * * /bin/bash /path/to/.bash-script/cronjob_template.sh
```

<br />

## Logging Functions

Several functions handle logging messages to a file:

- **`log_message()`**: Logs a generic message with a timestamp.
- **`log_verbose()`**: Logs verbose messages if the verbose flag is set.
- **`log_debug()`**: Logs debug messages if the debug flag is set.
- **`log_warning()`**: Logs warning messages.

<br />

## Ping Function

The function **`send_ping_to_monitor_server()`** handles sending a ping to the
monitoring server:

- It first attempts to send a ping without using a self-signed certificate.
- If the first attempt fails, it retries using a specified certificate.
- Responses from the server are logged for debugging purposes.

<br />

## Main Program

The main part of the script handles:

## Command-Line Options

The script parses command-line options to enable verbose and debug logging:

```sh
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -v | --verbose)
      verbose="true"
      shift
      ;;
    -d | --debug)
      debug="true"
      shift
      ;;
    *)
      shift
      ;;
  esac
done
```

<br />

## Log Directory and File Setup

The script sets up paths for the log directory and file:

```sh
log_dir="$HOME/.bash-script"
log_file="$log_dir/cronjob_template_cron.log"
```

<br />

## Monitoring Server URL and Certificate

It sets up the monitoring server URL and the certificate name:

```sh
monitoring_server_url="<insert_url>"
cert_name="<insert_cert.crt>"
```

<br />

## Root Privileges Check

The script checks if it is being run with root privileges:

```sh
if [ "$EUID" -ne 0 ]; then
  log_message "ERROR: This script must be run as root or with sudo."
  exit 1
fi
```

<br />

## Certificate File Path

It determines the path to the certificate file based on the operating system:

```sh
if [ -f /usr/local/share/ca-certificates/$cert_name ]; then
  cert_file="/usr/local/share/ca-certificates/$cert_name"
elif [ -f /etc/pki/ca-trust/source/anchors/$cert_name ]; then
  cert_file="/etc/pki/ca-trust/source/anchors/$cert_name"
else
  log_message "ERROR: Certificate file not found for this operating system."
  exit 1
fi
```

<br />

## Log Directory and File Creation

It ensures the log directory and file exist, creating them if necessary:

```sh
if [ ! -d "$log_dir" ]; then
  mkdir -p "$log_dir"
fi

if [ ! -f "$log_file" ]; then
  touch "$log_file"
fi
```

<br />

## Sending the Ping

Finally, the script sends a ping to the monitoring server and logs the result:

```sh
send_ping_to_monitor_server
log_message "INFO: Script execution completed successfully."
```

<br />

## Conclusion

This script is a robust template for setting up a cron job that sends a system
health check ping to a monitoring server. It includes detailed logging, error
handling, and flexibility for different environments through command-line
options and certificate management.

[cronjob_template.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/cronjob_template.sh
