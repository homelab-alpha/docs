---
title: "dotfiles_installer.info"
description:
  "A script for managing the installation and uninstallation of dotfiles. This
  script includes functionalities for backing up existing dotfiles, installing
  new ones, and restoring backups during uninstallation, with checks for Git
  installation."
url: "dotfiles/installer"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Dotfiles
series:
  - Script Information
tags:
  - dotfiles
  - script
  - installation
  - backup
  - uninstallation
  - Git
keywords:
  - dotfiles installer
  - dotfiles script
  - backup dotfiles
  - install dotfiles
  - uninstall dotfiles
  - manage dotfiles
  - Git dotfiles
  - Homelab-Alpha

weight: 3003

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`dotfiles_installer.sh`, authored by GJS (homelab-alpha), and its purpose is to
manage the installation and uninstallation of dotfiles. The script backs up
existing dotfiles before installing new ones and can restore backups during
uninstallation. It also checks if Git is installed, as it is necessary for
managing dotfiles repositories.

Here's a detailed explanation:

## Script Metadata

- **Script Name**: `dotfiles_installer.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: June 5, 2024
- **Version**: 1.0.1
- **Description**: The script provides a function to install and uninstall
  dotfiles, including creating backups and restoring them if necessary.
- **RAW Script**: [dotfiles_installer.sh]

<br />

## Detailed Explanation

### Check if Git is Installed

```bash
check_git() {
    if ! command -v git &>/dev/null; then
        echo "Git is not installed. Please install Git before running this script."
        exit 1
    fi
}
```

This function checks if Git is installed on the system. If not, it prompts the
user to install Git and exits the script.

<br />

### Create a Backup of Existing Dotfiles

```bash
create_backup() {
    local backup_dir="$HOME/dotfiles_backup/before_installation"
    mkdir -p "$backup_dir"

    for file in ~/.bash_* ~/.bashrc ~/.gitconfig ~/.nano ~/.nanorc ~/.profile ~/.selected_editor ~/.tmux.conf ~/.vimrc ~/.zshrc; do
        if [ -e "$file" ]; then
            cp -r "$file" "$backup_dir" || {
                echo "Error: Unable to create backup for $file" >&2
                exit 1
            }
            echo "Backup created for $file"
        else
            echo "Skipping $file as it does not exist"
        fi
    done
    echo "Backup completed at: $backup_dir"
}
```

This function creates a backup of existing dotfiles. It creates a directory for
backups and copies each dotfile if it exists. If a file cannot be copied, it
outputs an error and exits the script.

<br />

### Install Dotfiles

```bash
install_dotfiles() {
    if [ -d "$HOME/dotfiles/dotfiles" ]; then
        find "$HOME/dotfiles/dotfiles" -name '.bash_*' -exec cp {} "$HOME" \; &&
            cp "$HOME/dotfiles/dotfiles/.bashrc" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.gitconfig" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.nanorc" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.selected_editor" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.tmux.conf" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.vimrc" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.zshrc" "$HOME" &&
            cp -r "$HOME/dotfiles/.bash_script" "$HOME" &&
            cp -r "$HOME/dotfiles/.nano" "$HOME" &&
            if [ ! -d "$HOME/.versioning" ]; then
                mkdir "$HOME/.versioning"
            fi
        rm -rf "$HOME/dotfiles/.git" "$HOME/dotfiles/.github" "$HOME/dotfiles/.gitignore"
        echo "dotfiles successfully installed"
    else
        echo "Error: dotfiles directory not found" >&2
        exit 1
    fi
}
```

This function installs new dotfiles. It copies dotfiles from the `dotfiles`
directory in the user's home directory to the appropriate locations. It also
removes Git-related directories and files after copying.

<br />

### Backup Files Before Uninstallation

```bash
backup_files() {
    local backup_dir="$HOME/dotfiles_backup/before_uninstallation"
    mkdir -p "$backup_dir"

    for file in ~/.bash_* ~/.bashrc ~/.gitconfig ~/.nano ~/.nanorc ~/.profile ~/.selected_editor ~/.tmux.conf ~/.vimrc ~/.zshrc; do
        if [ -e "$file" ]; then
            cp -r "$file" "$backup_dir" || {
                echo "Error: Unable to create backup for $file" >&2
                exit 1
            }
            echo "Backup created for $file"
        else
            echo "Skipping $file as it does not exist"
        fi
    done
    echo "Backup completed at: $backup_dir"
}
```

This function creates a backup of the current dotfiles before uninstallation. It
is similar to the `create_backup` function but is used during the uninstallation
process.

<br />

### Remove Dotfiles

```bash
remove_dotfiles() {
    rm -rf ~/.bash_* ~/.bashrc ~/.gitconfig ~/.nano ~/.nanorc ~/.profile ~/.selected_editor ~/.tmux.conf ~/.vimrc ~/.zshrc ||
        {
            echo "Error: Unable to remove dotfiles" >&2
            return 1
        }
    echo "dotfiles successfully removed"
}
```

This function removes the dotfiles from the home directory. If it encounters an
error while removing the files, it outputs an error message.

<br />

### Restore Backup Files

```bash
restore_backup() {
    local backup_dir="$HOME/dotfiles_backup/before_installation"
    cp -a "$backup_dir"/. "$HOME" || {
        echo "Error: Unable to restore backup" >&2
        exit 1
    }
    echo "Backup successfully restored"
}
```

This function restores the backup of the original dotfiles created before
installation. If it encounters an error, it outputs an error message and exits
the script.

<br />

### Main Installation Function

```bash
install() {
    create_backup &&
        install_dotfiles &&
        echo "$(date '+%Y-%m-%d %H:%M:%S') - dotfiles installation completed" >>"$HOME/dotfiles.log" &&
        echo "Installation completed. Check dotfiles_installation.log for details."
}
```

This function orchestrates the installation process by calling the
`create_backup` and `install_dotfiles` functions. It logs the installation
completion time.

<br />

### Main Uninstallation Function

```bash
uninstall() {
    if backup_files &&
        remove_dotfiles &&
        sleep 0.5 &&
        restore_backup; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - dotfiles uninstallation completed" >>"$HOME/dotfiles.log"
        echo "Uninstallation completed. Check dotfiles_installation.log for details."
    else
        echo "$(date '+%Y-%m-%d %H:%M:%S') - dotfiles uninstallation encountered errors" >>"$HOME/dotfiles.log"
        echo "Uninstallation encountered errors. Check dotfiles_installation.log for details."
    fi
    sleep 0.5
    rm -rf ~/dotfiles
}
```

This function orchestrates the uninstallation process by calling `backup_files`,
`remove_dotfiles`, and `restore_backup` functions. It logs the uninstallation
completion time and removes the `dotfiles` directory from the home directory.

<br />

### Display Menu for Action Selection

```bash
echo "Welcome to the dotfiles installation/uninstallation tool"
echo "1. Install dotfiles"
echo "2. Uninstall dotfiles"
read -r -p "Enter your choice: " choice
if [ "$choice" == "1" ]; then
    check_git
    install
elif [ "$choice" == "2" ]; then
    uninstall
else
    echo "Invalid choice. Exiting."
fi
```

The script presents a menu to the user to choose between installing and
uninstalling dotfiles. Based on the user's choice, it either calls the
`check_git` and `install` functions for installation or the `uninstall` function
for uninstallation. If an invalid choice is entered, it exits the script.

<br />

## Conclusion

The `dotfiles_installer.sh` script is a comprehensive tool for managing
dotfiles. It ensures that Git is installed, creates backups of existing
dotfiles, installs new dotfiles, and can restore the original files during
uninstallation. The script is user-friendly, providing a menu for selecting
actions and logging the process to a log file.

[dotfiles_installer.sh]:
  https://raw.githubusercontent.com/homelab-alpha/dotfiles/main/dotfiles_installer.sh
