---
title: "gpg_keygen_script.info"
description:
  "A detailed shell script for generating GPG key pairs, including software
  checks, logging, verbose output options, and GPG directory specification.
  Ideal for secure communication setup."
url: "shell-script/script-info/gpg-keygen-script"
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
  - GPG
  - Key Generation
  - Security
  - Shell Script
  - Homelab
keywords:
  - GPG key pair
  - shell script
  - secure communication
  - script logging
  - verbose mode
  - software check
  - GPG directory

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
`gpg_keygen_script.sh`, authored by GJS (homelab-alpha), and its purpose is to
generate a GPG key pair for secure communication. The script checks for required
software, generates the key pair, and logs the actions. It also provides options
for verbose output and specifying the GPG directory.

Here's a detailed explanation:

## Script Metadata

- **Script Name**: `gpg_keygen_script.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.0.1
- **Description**: This script generates a GPG key pair for secure
  communication. It checks for required software, generates the key pair, and
  logs the actions. The script also provides options for verbose output and
  specifying the GPG directory.
- **RAW Script**: [gpg_keygen_script.sh]

<br />

## Detailed Explanation

### Script Header

The script begins with metadata and usage instructions, providing a clear
overview of its purpose, options, and examples of how to use it.

<br />

### Functions

#### Color and Header Printing

- **print_cyan()**: This function prints text in cyan color, enhancing
  readability.

```bash
print_cyan() {
  echo -e "\e[36m$1\e[0m"
}
```

- **print_section_header()**: This function prints section headers in cyan to
  separate different parts of the script's output.

```bash
print_section_header() {
  echo ""
  echo ""
  echo -e "$(print_cyan "=== $1 ===")"
}
```

<br />

#### Verbose Information Display

- **display_verbose_info()**: If the verbose mode is enabled, this function
  lists the GPG keys in long format.

```bash
display_verbose_info() {
  if [ "$verbose" == "true" ]; then
    print_section_header "GPG Key:"
    gpg --list-keys --keyid-format LONG
  fi
}
```

<br />

#### Logging

- **log_message()**: This function logs messages with a timestamp to a specified
  log file. It ensures that all actions and errors are recorded.

```bash
log_message() {
  local timestamp
  timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  local message="$1"

  echo "${timestamp} - ${message}" | tee -a "$log_file" >&2
}
```

<br />

#### Usage Instructions

- **display_usage()**: This function displays usage instructions and exits the
  script. It is invoked when the user provides incorrect command-line options.

```bash
display_usage() {
  echo "Usage: $0 [-v] [-d /path/to/gpg_directory]"
  echo "Options:"
  echo "  -v, --verbose    Enable verbose mode"
  echo "  -d, --directory  Specify the path to the GPG directory (default is \$HOME/.gnupg)"
  exit 1
}
```

<br />

#### Software Check

- **check_required_software()**: This function checks if GPG is installed. If
  not, it logs an error and exits the script.

```bash
check_required_software() {
  if ! command -v "gpg" >/dev/null 2>&1; then
    log_message "Error: GPG is not installed. Please install GPG before running this script."
    exit 1
  else
    log_message "GPG is installed."
  fi
}
```

<br />

#### Key Pair Generation

- **generate_key_pair()**: This function generates a new GPG key pair using
  `gpg --full-generate-key`. It logs the command and prints a section header.

```bash
generate_key_pair() {
  log_message "Generating new GPG key pair..."
  print_section_header "Generating new GPG key pair"
  log_message "Executing command: gpg --full-generate-key"
  gpg --full-generate-key
}
```

<br />

#### Key File Existence Check

- **check_key_file_existence()**: This function checks if a GPG key pair already
  exists in the specified directory. If found, it logs a message and exits to
  prevent overwriting existing keys.

```bash
check_key_file_existence() {
  if [ -f "$gpg_dir/pubring.kbx" ]; then
    log_message "The GPG key pair already exists."
    log_message "=== end of the log ==="
    echo "$(print_cyan "Error:") The GPG key pair already exists."
    exit 1
  fi
}
```

<br />

#### Command-Line Options Parsing

- **parse_command_line_options()**: This function parses the command-line
  options (`-v` for verbose mode and `-d` for specifying the GPG directory). It
  sets appropriate variables based on user input.

```bash
parse_command_line_options() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    -v | --verbose)
      verbose=true
      shift
      ;;
    -d | --directory)
      shift
      gpg_dir="$1"
      shift
      ;;
    *)
      display_usage
      ;;
    esac
  done
}
```

<br />

### Signal Trapping

- **trap_handler**: This function is set to handle interrupt signals (like
  `SIGINT` and `SIGTERM`). It ensures that the script handles interruptions
  gracefully.

```bash
trap trap_handler SIGINT SIGTERM
```

<br />

### Main Program Execution

1. **Default Values**: Sets default values for the GPG directory and log file.

```bash
gpg_dir="$HOME/.gnupg"
log_file="$gpg_dir/gpg_keygen_script.log"
```

2. **Start Logging**: Begins logging, marking the start of the log file with a
   separator.

```bash
echo "" >>"$log_file" # Add an empty line after the marker for separation
log_message "=== beginning of the log ==="
log_message "Script execution started"
```

3. **Check Required Software**: Ensures GPG is installed.

```bash
check_required_software
```

4. **Initialize Options**: Initializes options, setting verbose mode to false by
   default.

```bash
verbose=false
```

5. **Parse Command-Line Options**: Parses any provided command-line options.

```bash
parse_command_line_options "$@"
```

6. **Directory and Log File Check**: Checks if the GPG directory and log file
   exist. Creates them if they don't.

```bash
if [ ! -d "$gpg_dir" ]; then
  mkdir -p "$gpg_dir" && log_message "Created directory: $gpg_dir"
fi

if [ ! -f "$log_file" ]; then
  touch "$log_file" && log_message "Created log file: $log_file"
fi
```

7. **Check Key File Existence**: Ensures no existing GPG key pair is present to
   avoid overwriting.

```bash
check_key_file_existence
```

8. **Generate Key Pair**: Generates the GPG key pair.

```bash
generate_key_pair
```

9. **Display Verbose Information**: If verbose mode is enabled, it displays the
   generated keys.

```bash
display_verbose_info
```

10. **Complete Logging**: Marks the end of the log, indicating script
    completion.

```bash
log_message "Script execution completed."
log_message "=== end of the log ==="
```

<br />

## Conclusion

The `gpg_keygen_script.sh` script is a comprehensive tool for generating GPG key
pairs. It ensures necessary software is installed, handles user input
gracefully, provides verbose output if needed, logs all actions, and ensures
existing keys are not overwritten. This makes it a robust solution for secure
communication setup.

[gpg_keygen_script.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/gpg_keygen_script.sh
