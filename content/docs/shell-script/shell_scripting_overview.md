---
title: "Shell Scripting Overview"
description:
  "Discover the Fundamentals of Shell Scripting with This Comprehensive Overview"
url: "shell-script/overview"
icon: "overview"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Shell Script
tags:
  - shell scripting
  - shell script
  - automation
  - system configuration
  - Unix-like systems
keywords:
  - shell scripting
  - shell script overview
  - shell script basics
  - shell script usage
  - shell script examples
  - shell script repository
  - shell script contributions
  - log files
  - shellcheck
  - bash scripting guide
  - copyright
  - license

weight: 6001

toc: true
katex: true
---

<br />

{{% alert context="warning" %}}
**Caution** - This documentation is in progress {{% /alert %}}

<br />

## Introduction

Shell script are plain text files containing commands that are interpreted and
executed by the shell. They are commonly used for automating tasks, managing
system configurations, and performing various operations in Unix-like operating
systems.

<br />

## Usage

Each shell script in this repository is self-contained and can be run directly
from the command-line. Before executing a script, ensure that you have the
necessary permissions and dependencies installed on your system.

To run a shell script, navigate to its location in the terminal and execute the
following command:

```bash
./script_name.sh
```

Replace `script_name.sh` with the name of the script you want to run.

<br />

## Scripts

Here's a brief overview of the scripts available in Homelab-Alpha Shell Script
repository:

### audio_converter.sh

**Description:** This script converts audio files in various formats (m4a, mp3,
wma) to MP3 format with a bitrate of 128k, 44.1kHz sampling rate, and 2-channel
audio.\
**RAW Script:** [audio_converter.sh]

<br />

### check_pi_throttling.sh

**Description:** This script checks the throttling status of a Raspberry Pi by
querying the vcgencmd tool.\
**RAW Script:** [check_pi_throttling.sh]

<br />

### check_system_info.sh

**Description:** This script checks system information It provides details about
system uptime, hardware information, system temperature, systemctl status,
RAM/SWAP usage, disk usage, disk usage inodes, and last reboot/shutdown events.\
**RAW Script:** [check_system_info.sh]

<br />

### clearcache.sh

**Description:** This script drop clean caches, as well as reclaimable slab
objects like dentries and inodes.\
**RAW Script:** [clearcache.sh]

<br />

### cronjob_template.sh

**Description:** This script is a cronjob template and sends a ping to a
monitoring server for system health check. \
**RAW Script:** [cronjob_template.sh]

<br />

### gnome_keybindings_backup_restore.sh

**Description:** This script allows you to easily create backups of GNOME
keybindings and restore them when needed. It creates a backup directory in the
specified location and saves keybinding configurations for various GNOME
components. You can then choose to make a backup or restore keybindings based on
your preference. \
**RAW Script:** [gnome_keybindings_backup_restore.sh]

<br />

### gpg_keygen_script.sh

**Description:** This script generates a GPG key pair for secure communication.
It checks for required software, generates the key pair, and logs the actions.
The script also provides options for verbose output and specifying the GPG
directory.\
**RAW Script:** [gpg_keygen_script.sh]

<br />

### install_latest_dart_sass.sh

**Description:** This script fetches the latest version of Dart Sass from the
official GitHub repository, downloads it, installs it to /usr/local/dart-sass,
and cleans up the downloaded files.\
**RAW Script:** [install_latest_dart_sass.sh]

<br />

### install_latest_go.sh

**Description:** This script fetches the latest version of Go from the official
Go download page, downloads it, installs it to /usr/local/go, and cleans up the
downloaded files.\
**RAW Script:** [install_latest_go.sh]

<br />

### install_latest_hugo.sh

**Description:** This script fetches the latest version of Hugo from the
official GitHub repository, downloads it, installs it to
/usr/local/hugo-extended, and cleans up the downloaded files.\
**RAW Script:** [install_latest_hugo.sh]

<br />

### maintain_git_repo.sh

**Description:** This script automates the maintenance process of a Git
repository. It cleans up unnecessary files and resets the commit history to
provide a fresh start, improving repository organization and reducing size. This
can be particularly useful after importing from another version control system
or to ensure a clean history for better project management and collaboration.\
**RAW Script:** [maintain_git_repo.sh]

<br />

### new_docker_compose_file.sh

**Description:** This script creates a new Docker-Compose file and configuration
files based on user input.\
**RAW Script:** [new_docker_compose_file.sh]

<br />

### new_docker_container.sh

**Description:** This script creates a new Docker container directory structure
and configuration files based on user input.\
**RAW Script:** [new_docker_container.sh]

<br />

### ssh_keygen_script.sh

**Description:** This script automates the generation and conversion of SSH key
pairs for secure communication. It supports both ed25519 and RSA key types,
allowing users to specify the desired key type, filename for the key pair, and
SSH directory. The script logs all actions and errors to a designated log file
for traceability.\
**RAW Script:** [ssh_keygen_script.sh]

<br />

### super_linter.sh

**Description:** This script facilitates local linting of code repositories
using the Github Super Linter tool. It wraps the Super Linter Docker container,
providing options for linting either a local Git repository or a specific
folder.\
**RAW Script:** [super_linter.sh]

<br />

### user_accounts_info.sh

**Description:** This script retrieves information about system user accounts
and organizes them into system and normal user categories.\
**RAW Script:** [user_accounts_info.sh]

<br />

## Function scripts

### cpg.sh

**Description:** This script provides a function 'cpg' to copy files or
directories from a source to a destination. It handles both single files and
directories, including recursive copying. \
**RAW Script:** [cpg.sh]

<br />

### dns_check.sh

**Description:** This script checks network connectivity and DNS server
availability. It does not perform any specific task but can be used to diagnose
network issues. \
**RAW Script:** [dns_check.sh]

<br />

### encrypt_and_decrypt.sh

**Description:** This script provides functions to encrypt and decrypt files or
directories using AES-256 encryption algorithm with OpenSSL. \
**RAW Script:** [encrypt_and_decrypt.sh]

<br />

### ex.sh

**Description:** This script provides a convenient way to extract various
archive formats including tar, zip, gzip, bzip2, rar, etc. It simplifies the
extraction process by automatically detecting the file format and applying the
appropriate extraction method.\
**RAW Script:** [ex.sh]

<br />

### health_check.sh

**Description:** This script checks the availability of a given URL using both
HTTP and HTTPS protocols.\
**RAW Script:** [health_check.sh]

<br />

### mkdirg.sh

**Description:** This script creates a directory if it doesn't exist and
navigates into it.\
**RAW Script:** [mkdirg.sh]

<br />

### mvg.sh

**Description:** This script moves a file or directory to a specified
destination and then enters the destination directory.\
**RAW Script:** [mvg.sh]

<br />

### targzip.sh

**Description:** This script creates a tar archive of a directory or file and
compresses it using gzip.\
**RAW Script:** [targzip.sh]

<br />

### tarzip.sh

**Description:** This script creates a compressed archive (.zip) of a specified
folder using tar and zip commands.\
**RAW Script:** [tarzip.sh]

<br />

### up.sh

**Description:** This script defines a function 'up()' to navigate up a
specified number of directory levels in the file system. To use it, execute the
script in a terminal and provide the number of levels to move up.\
**RAW Script:** [up.sh]

<br />

Feel free to explore each script's documentation for detailed usage
instructions.

<br />

## Log Files

The location of log files can vary depending on the specific operating system
and application being used. Log files are often stored in a subdirectory within
the application's installation directory or in a system directory such as
`/var/log` on Linux

<br />

## Contribute to Homelab-Alpha - Shell Script

We value your contribution. We want to make it as easy as possible to submit
your contributions to the Homelab-Alpha - shell-script repository. Changes to
the shell-script are handled through pull requests against the `main` branch. To
learn how to contribute, see [contribute].

<br />

## Acknowledgements

- [ShellCheck]: A tool for analyzing shell scripts and providing suggestions for
  improvement.
- [Bash Scripting Guide]: A comprehensive guide to bash scripting.

<br />

## Copyright and License

&copy; 2024 Homelab-Alpha and its repositories are licensed under the terms of
the [license] agreement.

[audio_converter.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/audio_converter.sh
[check_pi_throttling.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/check_pi_throttling.sh
[check_system_info.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/check_system_info.sh
[clearcache.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/clearcache.sh
[cronjob_template.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/cronjob_template.sh
[gnome_keybindings_backup_restore.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/gnome_keybindings_backup_restore.sh
[gpg_keygen_script.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/gpg_keygen_script.sh
[install_latest_dart_sass.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_dart_sass.sh
[install_latest_go.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_go.sh
[install_latest_hugo.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_hugo.sh
[maintain_git_repo.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/maintain_git_repo.sh
[new_docker_compose_file.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/new_docker_compose_file.sh
[new_docker_container.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/new_docker_container.sh
[ssh_keygen_script.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/ssh_keygen_script.sh
[super_linter.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/super_linter.sh
[user_accounts_info.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/user_accounts_info.sh
[cpg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/cpg.sh
[dns_check.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/dns_check.sh
[encrypt_and_decrypt.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/encrypt_and_decrypt.sh
[ex.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/ex.sh
[health_check.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/health_check.sh
[mkdirg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/mkdirg.sh
[mvg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/mvg.sh
[targzip.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/targzip.sh
[tarzip.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/tarzip.sh
[up.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/up.sh
[contribute]: docs/../../contributing/code_of_conduct.md
[ShellCheck]: https://www.shellcheck.net/
[Bash Scripting Guide]: https://www.tldp.org/LDP/abs/html/
[license]: docs/../../help/license.md
