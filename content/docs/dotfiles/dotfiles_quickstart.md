---
title: "Dotfiles Quickstart"
description: "Start Managing Your Dotfiles with This Quickstart Guide"
url: "dotfiles/quickstart"
aliases: ""
icon: "rocket_launch"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Dotfiles
series:
  - Dotfiles
tags:
  - dotfiles management
keywords:
  - dotfiles
  - quickstart guide
  - dotfiles installation
  - dotfiles management
  - dotfiles script
  - dotfiles backup
  - dotfiles removal
  - dotfiles uninstallation
  - dotfiles log files

weight: 5002

toc: true
katex: true
---

<br />

## Quick install

```bash
git clone https://github.com/homelab-alpha/dotfiles.git ~/dotfiles && cd ~/dotfiles && echo 1 | ./dotfiles_installer.sh
```

<br />

## Using the `dotfiles_installer.sh` Script

### Clone the Repository

Run the following command in your terminal

```bash
git clone https://github.com/homelab-alpha/dotfiles.git ~/dotfiles
```

This command will clone the dotfiles repository from GitHub to `~/dotfiles`. The
installer expects the repository in `$HOME/dotfiles`.

<br />

### Navigate to the Folder

Go to the cloned repository by running the following command:

```bash
cd $HOME/dotfiles
```

<br />

### Run the Installation Script

Once you are in the `dotfiles` folder, run the installation script with:

```bash
./dotfiles_installer.sh
```

The script shows a menu. Enter `1` to install the dotfiles or `2` to uninstall
them. After the installation, the script removes the `.git`, `.github`, and
`.gitignore` entries from `$HOME/dotfiles`.

<br />

### Follow Any Instructions

If the script prompts for further actions, follow the displayed instructions.

### Pre-installation Checklist

The following files will be backed up before installation:

```plaintext
~/.bash_*
~/.bash-*
~/.bashrc
~/.gitconfig
~/.nano
~/.nanorc
~/.profile
~/.selected_editor
~/.tmux.conf
~/.vimrc
~/.zshrc
```

You can find the backups in `$HOME/dotfiles-backup/before-installation`

<br />

### Verifying the Installation

After completing the installation script, verify if your dotfiles are installed
correctly as expected.

<br />

## Removal of Dotfiles

To remove the dotfiles, run the `dotfiles_installer.sh` script again and enter
`2` when prompted.

### Pre-uninstallation Checklist

Similar to pre-installation, your files will be backed up:

```plaintext
~/.bash_*
~/.bash-*
~/.bashrc
~/.gitconfig
~/.nano
~/.nanorc
~/.profile
~/.selected_editor
~/.tmux.conf
~/.vimrc
~/.zshrc
```

These backups are stored in `$HOME/dotfiles-backup/before-uninstallation`

<br />

### Post-deletion Process

Your dotfiles will be restored from the backup after deletion. The script also
removes the `$HOME/dotfiles` directory.

<br />

### Verifying the Uninstallation

After uninstalling, verify if everything has been removed correctly.

By following these steps, you can effectively manage your dotfiles using the
`dotfiles_installer.sh` script from the GitHub repository. If you have any
further questions, feel free to ask!

<br />

## Log Files

The location of log files can vary depending on the specific operating system
and application being used. Dotfiles, log files are often stored in a
subdirectory within the application's installation directory or in a system
directory such as `/var/log` on Linux.

The `dotfiles_installer.sh` script appends its log entries to
`$HOME/dotfiles.log`.
