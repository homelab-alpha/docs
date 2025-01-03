---
title: "github_pr_inspector.info"
description:
  "This script provides an interactive interface for generating .patch and .diff
  links for GitHub pull requests. It allows users to inspect PR changes directly
  in their terminal by accessing these links. The script supports interactive
  menu options, hardcoded repositories, and custom input, ensuring a flexible
  user experience"
url: "shell-script/script-info/github-pr-inspector"
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
  - GitHub
  - Pull Request
  - PR Inspector
  - .patch
  - .diff
  - Terminal
  - Shell Script
  - Interactive Menu
  - Script
keywords:
  - GitHub Pull Request
  - PR Changes
  - GitHub PR Inspector
  - Patch and Diff
  - Terminal Script
  - Shell Scripting
  - Interactive Script

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
`github_pr_inspector.sh`, authored by GJS (homelab-alpha), and its purpose is to
manage GNOME keybindings by allowing users to create backups of their current
keybindings and restore them when needed.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `github_pr_inspector.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: Jan 03, 2025
- **Version**: 1.0.0
- **Description**: This script provides an interactive interface for generating
  .patch and .diff links for GitHub pull requests. It allows users to inspect PR
  changes directly in their terminal by accessing these links. The script
  supports interactive menu options, hardcoded repositories, and custom input,
  ensuring a flexible user experience
- **RAW Script**: [github_pr_inspector.sh]

<br />

## Script Header

The script starts with metadata comments, including the script's author,
version, and a brief description. The header also includes usage instructions,
with details about required dependencies such as `curl` and `less`.

<br />

## Requirements

The script checks for the following dependencies, which must be installed on the
user's system for it to work correctly:

- `curl` (to fetch GitHub PR data)
- `less` (to view the PR data in the terminal)

<br />

## Usage

### Command-Line Usage

The script can be executed directly with the following command structure:

```bash
./github_pr_inspector.sh [username/repository] [pr_number]
```

- **If no parameters are passed**, the script will show an interactive menu.
- **Optional flags**:
  - `-h` or `--help`: Display the help menu.
  - `-r` or `--reset`: Reset the session and start fresh.
  - `-q` or `--quit`: Exit the script.

<br />

### Examples

1. Generate links for PR #123 in a specific repository:

```bash
./github_pr_inspector.sh username/repository 123
```

2. Use the interactive menu:

```bash
./github_pr_inspector.sh
```

<br />

### Aliases

To create convenient aliases for the script, add the following lines to your
shell configuration file (e.g., `.bashrc` or `.bash_aliases`):

```bash
alias github-pr-inspector="$HOME/github_pr_inspector.sh"
# or
alias github-pr-inspector="$HOME/.bash_aliases/github_pr_inspector.sh"
```

<br />

## Main Menu

Upon execution, the script presents an interactive menu for the user to select
one of the following options:

1. `Github: homelab-alpha`
2. `Github: louislam/uptime-kuma`
3. `Custom: username/repository`

Additionally, users can interact with the following options:

- `h` or `--help`: Show the help menu.
- `r` or `--reset`: Reset the session and start over.
- `t` or `--toggle`: Toggle between `.patch` and `.diff` as the default file
  extension.
- `q` or `--quit`: Exit the script.

<br />

### Handling User Input

- The script will ask for a **GitHub repository** and a **pull request number**
  if they are not already provided.
- **Repository format**: The repository input must follow the
  `username/repository` format (e.g., `homelab-alpha/shell-script`).
- **PR Number**: The user will also need to input the **pull request number**.

Once the repository and PR number are validated, the script generates the
appropriate `.patch` or `.diff` link, depending on the chosen file extension
(toggled by the user).

<br />

## Fetching PR Files

The script generates two types of links for PR inspection:

1. `.patch`: Displays the changes in a patch format.
2. `.diff`: Displays the changes in a diff format.

Upon selecting a repository and PR number, the script fetches the corresponding
file using `curl` and displays it using `less`.

If the file cannot be retrieved (i.e., a non-200 HTTP status is returned), the
script will notify the user of the failure.

<br />

## Reset Functionality

The `--reset` option resets all previously entered data (repository, PR number,
etc.), allowing the user to start from a clean slate.

<br />

## Toggle Between .patch and .diff

The script defaults to `.patch` files, but users can toggle between `.patch` and
`.diff` formats by pressing the `t` or `--toggle` option.

<br />

## Handling Command-Line Arguments

- If the script is run with two arguments (repository and PR number), it will
  skip the interactive menu and fetch both `.patch` and `.diff` links for the
  specified PR.
- Example usage:

```bash
./github_pr_inspector.sh username/repository 123
```

This will generate both `.patch` and `.diff` links for PR #123 in the
`username/repository` repository.

<br />

## Conclusion

The `github_pr_inspector.sh` script offers a user-friendly way to view GitHub PR
changes directly in the terminal. Its interactive menu, support for custom
repositories, and file extension toggling ensure a flexible and efficient
experience for GitHub users.

[github_pr_inspector.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/github_pr_inspector.sh
