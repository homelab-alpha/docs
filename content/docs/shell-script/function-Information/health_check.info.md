---
title: "health_check.info"
description:
  "A Bash script to check the availability of a URL using both HTTP and HTTPS
  protocols, with user-friendly color-coded output."
url: "shell-script/function-info/health-check"
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
  - URL Monitoring
  - Health Check
  - Bash
  - Automation
keywords:
  - shell script
  - URL health check
  - HTTP check
  - HTTPS check
  - web service monitoring
  - bash scripting
  - URL availability
  - monitoring script

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
`health_check.sh`, authored by GJS (homelab-alpha), and its purpose is to check
the availability of a given URL using both HTTP and HTTPS protocols.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `health_check.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 26, 2024
- **Version**: 1.0.1
- **Description**: This script checks the availability of a given URL using both
  HTTP and HTTPS protocols.
- **RAW Script**: [health_check.sh]

<br />

The script defines a function named `health-check` that performs the URL
availability check. Let's go through the script line by line.

## Function Definition

```bash
function health-check() {
  green="\e[32m"
  red="\e[31m"
  end="\e[0m"
```

The function `health-check` is defined here. Three variables, `green`, `red`,
and `end`, are set to escape codes for colored output in the terminal (green for
success, red for failure, and resetting to default color).

<br />

## Checking for URL Argument

```bash
  if [ -z "$1" ]; then
    echo "Please provide a URL to check."
    return 1
  fi
```

This block checks if the user has provided a URL as an argument. If not, it
prints a message prompting the user to provide a URL and returns an exit status
of 1, indicating an error.

<br />

## URL and Protocols

```bash
  url="$1"

  protocols=("https" "http")
```

The provided URL is assigned to the variable `url`. An array `protocols` is
defined, containing the strings `"https"` and `"http"`.

<br />

## Loop Through Protocols

```bash
  for protocol in "${protocols[@]}"; do
    if curl --head --silent --show-error --fail --location "$protocol://$url"; then
      echo -e "$protocol://$url is ${green}UP${end} and running."
      return 0
    fi
  done
```

The script loops through each protocol in the `protocols` array. For each
protocol, it uses the `curl` command to send a HEAD request to the URL. The
options used are:

- `--head`: Fetch only the headers.
- `--silent`: Silent mode, which reduces output.
- `--show-error`: Show errors if they occur.
- `--fail`: Fail silently (no output at all) on HTTP errors.
- `--location`: Follow redirects.

If the `curl` command succeeds (indicating the URL is accessible), it prints a
message that the URL is UP, colored green, and returns an exit status of 0,
indicating success.

<br />

## If Both Protocols Fail

```bash
  echo -e "Both https://$url and http://$url are ${red}DOWN${end}"
  return 1
}
```

If neither HTTP nor HTTPS versions of the URL are accessible, the script prints
a message that both are DOWN, colored red, and returns an exit status of 1.

<br />

## Conclusion

The `health_check.sh` script is a straightforward Bash script that checks the
availability of a URL using both HTTP and HTTPS protocols. It provides
user-friendly output with color-coded messages to indicate whether the URL is up
or down. By using `curl` with appropriate options, it efficiently handles the
URL checking process. This script is handy for quick health checks of web
services.

[health_check.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/health_check.sh
