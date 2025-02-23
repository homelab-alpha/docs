---
title: "check_pi_throttling.info"
description:
  "Monitor the throttling status of your Raspberry Pi with this shell script,
  which checks for undervolting, frequency capping, and temperature limits using
  the `vcgencmd` tool."
url: "shell-script/script-info/check-pi-throttling"
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
  - Raspberry Pi
  - Throttling
  - System Monitoring
  - Shell Script
keywords:
  - Raspberry Pi throttling
  - vcgencmd
  - undervolting
  - frequency capping
  - temperature limits
  - system health monitoring
  - shell scripting

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
`check_pi_throttling.sh`, authored by GJS (homelab-alpha), and its purpose is to
check the throttling status of a Raspberry Pi by querying the `vcgencmd` tool.
This is useful for monitoring the system's health and ensuring it is operating
within safe parameters.

## Script Metadata

- **Filename**: `check_pi_throttling.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.0
- **Description**: This script checks the throttling status of a Raspberry Pi by
  querying the `vcgencmd` tool.
- **RAW Script**: [check_pi_throttling.sh]

<br />

## Flag Bits

These are hexadecimal constants representing different throttling conditions:

```bash
UNDERVOLTED=0x1
CAPPED=0x2
THROTTLED=0x4
SOFT_TEMPLIMIT=0x8
HAS_UNDERVOLTED=0x10000
HAS_CAPPED=0x20000
HAS_THROTTLED=0x40000
HAS_SOFT_TEMPLIMIT=0x80000
```

- `UNDERVOLTED`: Indicates if the Pi is currently undervolted.
- `CAPPED`: Indicates if the CPU frequency is capped.
- `THROTTLED`: Indicates if the Pi is currently throttled.
- `SOFT_TEMPLIMIT`: Indicates if the Pi has hit a soft temperature limit.
- `HAS_UNDERVOLTED`: Indicates if the Pi has been undervolted at any time since
  last reboot.
- `HAS_CAPPED`: Indicates if the CPU frequency has been capped at any time since
  last reboot.
- `HAS_THROTTLED`: Indicates if the Pi has been throttled at any time since last
  reboot.
- `HAS_SOFT_TEMPLIMIT`: Indicates if the Pi has hit a soft temperature limit at
  any time since last reboot.

<br />

## Text Colors

These define color codes for output text using `tput` for better readability:

```bash
GREEN=$(tput setaf 2)
RED=$(tput setaf 1)
NC=$(tput sgr0)
```

- `GREEN`: Sets text color to green.
- `RED`: Sets text color to red.
- `NC`: Resets text color to default.

<br />

## Output Strings

These are used to standardize "good" and "bad" status messages:

```bash
GOOD="${GREEN}NO${NC}"
BAD="${RED}YES${NC}"
```

- `GOOD`: Indicates a non-problematic status with green text "NO".
- `BAD`: Indicates a problematic status with red text "YES".

<br />

## Get Status and Extract Hex Value

This part queries the `vcgencmd` tool and extracts the status:

```bash
STATUS=$(vcgencmd get_throttled)
STATUS=${STATUS#*=}
```

- `STATUS=$(vcgencmd get_throttled)`: Runs the `vcgencmd get_throttled` command
  which returns the throttling status.
- `STATUS=${STATUS#*=}`: Strips the "throttled=" prefix, leaving only the hex
  status value.

<br />

## Display Status

This part of the script displays the current status in a readable format:

```bash
echo -n "Status: "
((STATUS != 0)) && echo "${RED}${STATUS}${NC}" || echo "${GREEN}${STATUS}${NC}"
echo ""
```

- `echo -n "Status: "`: Prints "Status: " without a newline.
- `((STATUS != 0)) && echo "${RED}${STATUS}${NC}" || echo "${GREEN}${STATUS}${NC}"`:
  Checks if `STATUS` is non-zero. If true, it prints the status in red;
  otherwise, it prints the status in green.

<br />

## Detailed Condition Checks

The script then checks and displays whether each specific condition is currently
active and if it has ever been active:

```bash
echo "Undervolted:"
echo -n "Now: "
((STATUS & UNDERVOLTED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo -n "Run: "
((STATUS & HAS_UNDERVOLTED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo ""

echo "Throttled:"
echo -n "Now: "
((STATUS & THROTTLED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo -n "Run: "
((STATUS & HAS_THROTTLED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo ""

echo "Frequency Capped:"
echo -n "Now: "
((STATUS & CAPPED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo -n "Run: "
((STATUS & HAS_CAPPED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo ""

echo "Softlimit:"
echo -n "Now: "
((STATUS & SOFT_TEMPLIMIT != 0)) && echo "${BAD}" || echo "${GOOD}"
echo -n "Run: "
((STATUS & HAS_SOFT_TEMPLIMIT != 0)) && echo "${BAD}" || echo "${GOOD}"
echo ""
```

For each condition (Undervolted, Throttled, Frequency Capped, and Softlimit):

1. **Current Status**:

   - `echo -n "Now: "`: Prints "Now: " without a newline.
   - `((STATUS & CONDITION != 0)) && echo "${BAD}" || echo "${GOOD}"`: Checks if
     the specific condition is currently active and prints "YES" (in red) if
     true, or "NO" (in green) if false.

2. **Historical Status**:
   - `echo -n "Run: "`: Prints "Run: " without a newline.
   - `((STATUS & HAS_CONDITION != 0)) && echo "${BAD}" || echo "${GOOD}"`:
     Checks if the specific condition has ever been active and prints "YES" (in
     red) if true, or "NO" (in green) if false.

<br />

## Conclusion

By running this script, users can quickly see if their Raspberry Pi has
encountered any power or thermal issues that could affect performance. The use
of color-coded output makes it easy to identify problems at a glance.

[check_pi_throttling.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/check_pi_throttling.sh
