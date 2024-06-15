---
title: "gnome_keybindings_backup_restore.info"
description:
  "This script simplifies the management of GNOME keybindings by enabling users
  to back up their current keybinding configurations and restore them as needed.
  It ensures that personalized keybinding setups can be easily saved and
  recovered, facilitating seamless transitions between different system states
  or after fresh installations."
url: "shell-script/script-info/gnome-keybindings-backup-restore"
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
  - GNOME
  - keybindings
  - backup
  - restore
  - Linux
  - shell script
keywords:
  - GNOME keybindings
  - keybinding backup
  - keybinding restore
  - Linux customization
  - GNOME configuration
  - dconf
  - shell scripting

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
`gnome_keybindings_backup_restore.sh`, authored by GJS (homelab-alpha), and its
purpose is to manage GNOME keybindings by allowing users to create backups of
their current keybindings and restore them when needed.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `gnome_keybindings_backup_restore.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.1.1
- **Description**: This script facilitates the backup and restoration of GNOME
  keybindings, providing a simple way to save and restore keybinding
  configurations for various GNOME components.
- **RAW Script**: [gnome_keybindings_backup_restore.sh]

<br />

## Script Header

The script starts with a typical bash script header and includes metadata
comments that provide information about the script, its author, version, and
purpose. It also outlines the requirements and usage instructions:

- The script requires the `dconf` utility.
- Usage involves running the script and choosing an option to either back up or
  restore keybindings.

<br />

## Check and Create Backup Directory

The function `check_create_backup_dir` ensures that a backup directory exists:

```bash
check_create_backup_dir() {
  backup_dir="$HOME/Backup/Gnome/Keybindings $(date +'[%b %d, %Y %H:%M:%S]')"
  if [ ! -d "$backup_dir" ]; then
    mkdir -p "$backup_dir"
    echo "Backup directory created: $backup_dir"
  fi
}
```

- **Purpose**: Creates a unique backup directory with a timestamp in the user's
  home directory.
- **Process**: Checks if the directory exists; if not, it creates it and prints
  a message.

<br />

## Perform Backup

The function `perform_backup` handles the backup process:

```bash
perform_backup() {
  check_create_backup_dir

  backup_dir="$HOME/Backup/Gnome/Keybindings $(date +'[%b %d, %Y %H:%M:%S]')"

  dconf dump / >"$backup_dir/dconf.conf"
  dconf dump /org/gnome/desktop/wm/keybindings/ >"$backup_dir/desktop_wm_keybindings"
  dconf dump /org/gnome/mutter/keybindings/ >"$backup_dir/mutter_keybindings"
  dconf dump /org/gnome/mutter/wayland/keybindings/ >"$backup_dir/mutter_wayland_keybindings"
  dconf dump /org/gnome/settings-daemon/plugins/media-keys/ >"$backup_dir/settings-daemon_plugins_media_keys"
  dconf dump /org/gnome/shell/keybindings/ >"$backup_dir/shell_keybindings"

  echo "Backup completed successfully. Backup directory: $backup_dir"
}
```

- **Purpose**: Dumps GNOME keybinding configurations into separate files within
  the backup directory.
- **Process**:
  - Calls `check_create_backup_dir` to ensure the backup directory exists.
  - Uses `dconf dump` to export keybinding settings from various GNOME
    components into specific files.
  - Prints a success message with the backup directory location.

<br />

## Perform Restore

The function `perform_restore` manages the restoration process:

```bash
perform_restore() {
  backup_recovery_dir="$HOME/Backup/Gnome"

  backups=("$backup_recovery_dir"/*)
  if [ ${#backups[@]} -eq 0 ]; then
    echo "No backups found."
    exit 1
  fi

  echo "Available backups:"
  for ((i = 0; i < ${#backups[@]}; i++)); do
    echo "$((i + 1)). $(basename "${backups[$i]}")"
  done
  read -r -p "Enter the number of the backup you want to restore: " choice

  re='^[0-9]+$'
  if ! [[ $choice =~ $re ]]; then
    echo "Invalid input: Please enter a number."
    exit 1
  fi

  index=$((choice - 1))
  if [ $index -lt 0 ] || [ $index -ge ${#backups[@]} ]; then
    echo "Invalid backup number."
    exit 1
  fi

  selected_backup="${backups[$index]}"

  dconf reset -f /org/gnome/desktop/wm/keybindings/
  dconf reset -f /org/gnome/mutter/keybindings/
  dconf reset -f /org/gnome/mutter/wayland/keybindings/
  dconf reset -f /org/gnome/settings-daemon/plugins/media-keys/
  dconf reset -f /org/gnome/shell/keybindings/

  sleep 0.5

  dconf load /org/gnome/desktop/wm/keybindings/ <"$selected_backup/desktop_wm_keybindings"
  dconf load /org/gnome/mutter/keybindings/ <"$selected_backup/mutter_keybindings"
  dconf load /org/gnome/mutter/wayland/keybindings/ <"$selected_backup/mutter_wayland_keybindings"
  dconf load /org/gnome/settings-daemon/plugins/media-keys/ <"$selected_backup/settings-daemon_plugins_media_keys"
  dconf load /org/gnome/shell/keybindings/ <"$selected_backup/shell_keybindings"

  echo "Backup restored successfully from: $selected_backup"
}
```

- **Purpose**: Restores GNOME keybinding configurations from a selected backup.
- **Process**:
  - Checks for available backups and lists them for the user.
  - Validates the user's choice and ensures it corresponds to an available
    backup.
  - Resets current keybindings to default values.
  - Inserts a short delay to ensure the reset is processed.
  - Loads keybinding settings from the selected backup files.
  - Prints a success message indicating the source of the restored backup.

<br />

## Main Menu

The script presents a simple menu to the user:

```bash
echo "Welcome to the GNOME Keybindings Backup and Restore Script."
echo "Please choose an option:"
echo "1. Perform Backup"
echo "2. Perform Restore"
read -r -p "Enter your choice (1 or 2): " choice

case $choice in
1) perform_backup ;;
2) perform_restore ;;
*) echo "Invalid choice. Please enter either 1 or 2." ;;
esac
```

- **Purpose**: Provides an interface for the user to choose between backup and
  restore options.
- **Process**:
  - Displays a welcome message and options.
  - Reads the user's choice.
  - Calls the appropriate function (`perform_backup` or `perform_restore`) based
    on the user's input.
  - Handles invalid input by displaying an error message.

<br />

## End of Script

The script concludes here, having either backed up or restored the GNOME
keybindings based on the user's choice.

<br />

## Conclusion

By understanding each part of the script, you can see how it effectively manages
GNOME keybinding configurations, providing a straightforward way to back them up
and restore them as needed.

[gnome_keybindings_backup_restore.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/gnome_keybindings_backup_restore.sh
