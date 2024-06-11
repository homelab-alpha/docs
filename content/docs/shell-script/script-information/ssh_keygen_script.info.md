---
title: "ssh_keygen_script.info"
description:
  "This script, automates the creation and conversion of SSH key pairs,
  supporting both ed25519 and RSA key types. It allows users to specify key
  type, filename, and SSH directory, while logging all actions and errors for
  traceability."
url: "shell-script/script-info/ssh-keygen-script"
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
  - SSH
  - Key Generation
  - Shell Script
  - Automation
  - Security
keywords:
  - SSH keygen
  - shell script
  - SSH automation
  - ed25519 key
  - RSA key
  - SSH key conversion
  - SSH directory
  - secure communication
  - script logging

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
`ssh_keygen_script.sh`, authored by GJS (homelab-alpha), and its purpose is to
automate the generation and conversion of SSH key pairs for secure
communication. It supports both `ed25519` and `RSA` key types, allowing users to
specify the desired key type, filename for the key pair, and SSH directory.
Additionally, the script logs all actions and errors to a designated log file
for traceability.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `ssh_keygen_script.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.0.1
- **Description**: This script automates the generation and conversion of SSH
  key pairs for secure communication. It supports both `ed25519` and `RSA` key
  types, allowing users to specify the desired key type, filename for the key
  pair, and SSH directory. The script logs all actions and errors to a
  designated log file for traceability.
- **RAW Script**: [ssh_keygen_script.sh]

<br />

## Detailed Explanation

### Usage Instructions

- **Usage**: `./ssh_keygen_script.sh [-v] [-d /path/to/ssh_directory]`
- **Options**:
  - `-v, --verbose`: Enable verbose mode to display detailed information during
    execution.
  - `-d, --directory`: Specify the path to the SSH directory. The default
    directory is `$HOME/.ssh`.
- **Examples**:
  1. Generate and convert an SSH key pair: `./ssh_keygen_script.sh`
  2. Generate and convert an SSH key pair with verbose output:
     `./ssh_keygen_script.sh -v`
  3. Generate and convert an SSH key pair with a custom SSH directory:
     `./ssh_keygen_script.sh -d /custom/path/to/ssh_directory`

<br />

### Default Values and Configuration

- **Default SSH Directory**: `$HOME/.ssh`
- **Default File Extension for Converted Keys**: `ppk`
- **Log File Path**: `$ssh_dir/ssh_keygen_script.log`

<br />

### Script Functions

#### Utility Functions

1. **Print in Cyan Color**: The `print_cyan` function prints text in cyan color
   for better readability in the terminal.

   ```sh
   print_cyan() {
     echo -e "\e[36m$1\e[0m"
   }
   ```

2. **Print Section Headers**: The `print_section_header` function prints section
   headers in cyan color.

   ```sh
   print_section_header() {
     echo ""
     echo ""
     echo -e "$(print_cyan "=== $1 ===")"
   }
   ```

3. **Display Verbose Information**: The `display_verbose_info` function prints
   the contents of the generated and converted public keys if verbose mode is
   enabled.

   ```sh
   display_verbose_info() {
     local key_type="$1"
     local key_file="$2"
     local extension="$3"

     if [ "$verbose" == "true" ]; then
       print_cyan "${key_type} public key:"
       cat "${key_file}.pub"
       print_cyan "Converted ${key_type} public key:"
       cat "${key_file}.${extension}"
     fi
   }
   ```

4. **Log Messages**: The `log_message` function logs actions and errors with a
   timestamp to the log file.

   ```sh
   log_message() {
     local timestamp
     timestamp=$(date +"%Y-%m-%d %H:%M:%S")

     echo "${timestamp} - ${1}" >>"$log_file" 2>&1
   }
   ```

<br />

#### Main Functionalities

1. **Start Logging**: Initializes logging at the start of script execution.

   ```sh
   echo "" >>"$log_file"
   log_message "=== beginning of the log ==="
   log_message "Script execution started"
   ```

2. **Display Usage Instructions**: Provides usage information for the script.

   ```sh
   display_usage() {
     echo "Usage: $0 [-v] [-d /path/to/ssh_directory]"
     echo "Options:"
     echo "  -v, --verbose    Enable verbose mode"
     echo "  -d, --directory  Specify the path to the SSH directory (default is \$HOME/.ssh)"
     exit 1
   }
   ```

3. **Check Required Software**: Ensures required software (`ssh-keygen` and
   `putty`) are installed. Exits with an error if any are missing.

   ```sh
   check_required_software() {
     local software_list=("ssh-keygen" "putty")
     local missing_software=()

     for software in "${software_list[@]}"; do
       if ! command -v "$software" >/dev/null 2>&1; then
         missing_software+=("$software")
       fi
     done

     if [ ${#missing_software[@]} -eq 0 ]; then
       log_message "All required software is installed."
     else
       log_message "Error: The following required software is not installed: ${missing_software[*]}"
       log_message "Please install the missing software manually."
       exit 1
     fi
   }
   ```

4. **Trap Signals**: Handles script interruption signals for clean termination.

   ```sh
   trap_handler() {
     echo ""
     log_message "Script execution interrupted. Cleaning up..."
     echo "=== end of the log ===" >>"$log_file"
     exit 1
   }
   ```

5. **Generate Key Pair**: Generates an SSH key pair of the specified type.

   ```sh
   generate_key_pair() {
     local key_type="$1"
     local file_name="$2"

     log_message "Generating new ${key_type} SSH key pair for server: ${server}, filename: ${file_name}"
     print_section_header "Generating new ${key_type} SSH key pair"
     if ssh-keygen -a 100 -C "${server}" -f "${ssh_dir}/id_${key_type}_${file_name}" -t "${key_type}" >>"$log_file" 2>&1; then
       log_message "Successfully generated ${key_type} SSH key pair for filename: ${file_name}"
     else
       log_message "Failed to generate ${key_type} SSH key pair for filename: ${file_name}"
       log_message "=== end of the log ==="
       exit 1
     fi
   }
   ```

6. **Convert Key Pair**: Converts the generated SSH key pair to a specified
   format using `puttygen`.

   ```sh
   convert_key_pair() {
     local key_type="$1"
     local file_name="$2"

     log_message "Convert ${key_type} SSH key pair to ${file_name}.${file_extension}"
     print_section_header "Convert ${key_type} SSH key pair to ${file_name}.${file_extension}"
     if puttygen "${ssh_dir}/id_${key_type}_${file_name}" -o "${ssh_dir}/id_${key_type}_${file_name}.${file_extension}" >>"$log_file" 2>&1; then
       log_message "Successfully converted ${key_type} SSH key pair for filename: ${file_name}"
     else
       log_message "Failed to convert ${key_type} SSH key pair for filename: ${file_name}"
       log_message "=== end of the log ==="
       exit 1
     fi
   }
   ```

7. **Check Key File Existence**: Ensures that the specified key file does not
   already exist to avoid overwriting.

   ```sh
   check_key_file_existence() {
     local key_type="$1"
     local file_name="$2"

     if [ -f "${ssh_dir}/id_${key_type}_${file_name}" ]; then
       log_message "The ${key_type} SSH key pair already exists for filename: ${file_name}"
       log_message "=== end of the log ==="
       echo "$(print_cyan "Error:") The ${key_type} SSH key pair already exists for filename: ${file_name}"
       exit 1
     fi
   }
   ```

8. **Choose Key Type**: Prompts the user to select the SSH key type and then
   generates and converts the key pair.
   ```sh
   choose_key_type() {
     echo ""
     print_cyan "Choose the SSH key type:"
     PS3="Enter your choice (1 for ed25519, 2 for RSA): "
     options=("ed25519" "RSA")
     select KEY_TYPE in "${options[@]}"; do
       case $KEY_TYPE in
       "ed25519")
         check_key_file_existence "ed25519" "${file_name}"
         generate_key_pair "ed25519" "${file_name}"
         convert_key_pair "ed25519" "${file_name}"
         display_verbose_info "ed25519" "${ssh_dir}/id_ed25519_${file_name}" "${file_extension}"
         log_message "Ed25519 SSH key pair generated and converted for filename: ${file_name}"
         break
         ;;
       "RSA")
         check_key_file_existence "rsa" "${file_name}"
         generate_key_pair "rsa" "${file_name}"
         convert_key_pair "rsa" "${file_name}"
         display_verbose_info "RSA" "${ssh_dir}/id_rsa_${file_name}" "${file_extension}"
         log_message "RSA SSH key pair generated and converted for filename: ${file_name}"
         break
         ;;
       *)
         echo "Invalid option. Choose 1 for ed25519 or 2 for RSA."
         ;;
       esac
     done
   }
   ```

<br />

#### Script Execution

1. **Check Required Software**: Ensures necessary software is installed.

   ```sh
   check_required_software
   ```

2. **Initialize Options**: Parses command-line options for verbose mode and
   custom SSH directory.

   ```sh
   verbose=false
   while [[ $# -gt 0 ]]; do
     case "$1" in
     -v | --verbose)
       verbose=true
       shift
       ;;
     -d | --directory)
       shift
       ssh_dir="$1"
       shift
       ;;
     *)
       display_usage
       ;;
     esac
   done
   ```

3. **Trap Interrupts**: Sets up handlers for script interruption.

   ```sh
   trap trap_handler SIGINT SIGTERM
   ```

4. **Prompt for SSH Key Pair Information**: Collects user input for server name
   and filename.

   ```sh
   read -r -p "$(print_cyan "Enter the server name: ")" server
   read -r -p "$(print_cyan "Enter the filename for the new SSH key pair: ")" file_name
   ```

5. **Check Key File Existence**: Ensures the specified key file does not already
   exist.

   ```sh
   check_key_file_existence "ed25519" "${file_name}"
   check_key_file_existence "rsa" "${file_name}"
   ```

6. **Choose Key Type**: Prompts user to select key type and proceeds with
   generation and conversion.

   ```sh
   choose_key_type
   ```

7. **Log Completion**: Logs the completion of script execution.
   ```sh
   log_message "Script execution completed for filename: ${file_name}"
   log_message "=== end of the log ==="
   ```

This detailed breakdown provides a comprehensive understanding of the
`ssh_keygen_script.sh` script, covering its purpose, usage, key functionalities,
and execution flow.

<br />

## Conclusion

This script provides a comprehensive solution for generating and converting SSH
key pairs with built-in logging, verbose output options, and robust error
handling to ensure a smooth and traceable execution process.

[ssh_keygen_script.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/ssh_keygen_script.sh
