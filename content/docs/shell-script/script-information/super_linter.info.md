---
title: "super_linter.info"
description:
  "This script streamlines the local linting process for code repositories by
  utilizing the GitHub Super Linter tool within a Docker container. It provides
  users with options to lint an entire local Git repository or a specific
  directory, ensuring consistent code quality checks across different
  environments."
url: "shell-script/script-info/super-linter"
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
  - linting
  - code quality
  - GitHub Super Linter
  - Docker
  - automation
  - shell script
keywords:
  - local linting
  - GitHub Super Linter
  - Docker container linting
  - code quality checks
  - shell script automation
  - linting repositories
  - directory linting
  - linting tool

weight: 9100

katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`super_linter.sh`, authored by GJS (homelab-alpha), and its purpose is to
facilitate local linting of code repositories using the GitHub Super Linter
tool. It wraps the Super Linter Docker container, providing options for linting
either a local Git repository or a specific folder.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `super_linter.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 20, 2024
- **Version**: 1.1.2
- **Description**: This script facilitates local linting of code repositories
  using the GitHub Super Linter tool. It wraps the Super Linter Docker
  container, providing options for linting either a local Git repository or a
  specific folder.
- **RAW Script**:[super_linter.sh]

<br />

The script provides functions to run the Super Linter Docker container with
different options, processes command-line arguments, and presents a menu for the
user to choose which linting mode to run.

<br />

## Default Debug Mode

```bash
DEBUG=false
```

The script starts by setting a default value for the debug mode, which is
`false`.

<br />

## Function to Run Docker with Standard Options

```bash
run_docker_super_linter() {
  docker run \
    --env DEFAULT_BRANCH=main \
    --env RUN_LOCAL=true \
    --name super-linter \
    --pull=always \
    --rm \
    --volume "$PWD":/tmp/lint \
    "$@" \
    ghcr.io/super-linter/super-linter:latest
}
```

This function runs the Super Linter Docker container with standard options. It
sets environment variables, removes the container after it runs, and mounts the
current working directory to `/tmp/lint` inside the container.

<br />

## Function to Run Docker with Extra Options

```bash
run_docker_super_linter_file() {
  docker run \
    --env DEFAULT_BRANCH=main \
    --env RUN_LOCAL=true \
    --env USE_FIND_ALGORITHM=true \
    --name super-linter \
    --pull=always \
    --rm \
    --volume "$PWD":/tmp/lint/file \
    "$@" \
    ghcr.io/super-linter/super-linter:latest
}
```

This function is similar to the previous one but includes an additional
environment variable `USE_FIND_ALGORITHM=true` and mounts the current directory
to `/tmp/lint/file`.

<br />

## Processing Command-Line Options

```bash
while [[ "$#" -gt 0 ]]; do
  case $1 in
  -d | --debug)
    DEBUG=true
    ;;
  *)
    echo "Unknown parameter: $1"
    exit 1
    ;;
  esac
  shift
done
```

The script processes command-line arguments to check if the debug mode should be
enabled (`-d` or `--debug`). If an unknown parameter is provided, it prints an
error message and exits.

<br />

## Check if Debug Mode is Enabled

```bash
if [ "$DEBUG" = true ]; then
  echo "Debug mode is enabled."
fi
```

If the debug mode is enabled, it prints a message indicating so.

<br />

## Menu for User Choice

```bash
echo "Choose an option:"
echo "1. Root directory"
echo "2. Local File or Folder"
read -rp "Enter the number of the desired option: " choice
```

The script presents a menu for the user to choose whether to lint the root
directory or a specific file/folder.

<br />

## Execute the Selected Option

```bash
case $choice in
1)
  if [ "$DEBUG" = true ]; then
    run_docker_super_linter -e LOG_LEVEL=DEBUG
  else
    run_docker_super_linter
  fi
  ;;
2)
  if [ "$DEBUG" = true ]; then
    run_docker_super_linter_file -e LOG_LEVEL=DEBUG
  else
    run_docker_super_linter_file
  fi
  ;;
*)
  echo "Invalid choice. Enter 1 or 2."
  ;;
esac
```

Depending on the user's choice, the script calls the appropriate function to run
the Super Linter Docker container. If debug mode is enabled, it also sets the
`LOG_LEVEL` to `DEBUG`.

<br />

## Conclusion

This script helps streamline the linting process by using Docker to encapsulate
the Super Linter tool, making it easy to run consistent linting checks across
different environments.

[super_linter.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/super_linter.sh
