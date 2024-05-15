---
title: "Dotfiles Quickstart"
description: "Start Managing Your Dotfiles with This Quickstart Guide"
url: "dotfiles/quickstart"
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

weight: 3002

toc: true
katex: true
---

<br />

## Quick install

```bash
git clone https://github.com/homelab-alpha/dotfiles.git && cd dotfiles && echo 1 | ./install.sh
```

<br />

## Using the `install.sh` Script

### Clone the Repository

Run the following command in your terminal

```bash
git clone https://github.com/homelab-alpha/dotfiles.git
```

This command will clone the dotfiles repository from GitHub to your local
machine.

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
./install.sh
```

This script installs the dotfiles according to the specified configuration.

<br />

### Follow Any Instructions

If the script prompts for further actions, follow the displayed instructions.

### Pre-installation Checklist

The following files will be backed up before installation:

```plaintext
~/.bash_*
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

You can find the backups in `$HOME/dotfiles_backup/before_installation`

<br />

### Verifying the Installation

After completing the installation script, verify if your dotfiles are installed
correctly as expected.

<br />

## Removal of Dotfiles

To remove the dotfiles, rerun the install.sh script and follow the instructions.

### Pre-uninstallation Checklist

Similar to pre-installation, your files will be backed up:

```plaintext
~/.bash_*
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

These backups are stored in `$HOME/dotfiles_backup/before_uninstallation`

<br />

### Post-deletion Process

Your dotfiles will be restored from the backup after deletion.

<br />

### Verifying the Uninstallation

After uninstalling, verify if everything has been removed correctly.

By following these steps, you can effectively manage your dotfiles using the
install.sh script from the GitHub repository. If you have any further questions,
feel free to ask!

<br />

## Log Files

The location of log files can vary depending on the specific operating system
and application being used. Dotfiles, log files are often stored in a
subdirectory within the application's installation directory or in a system
directory such as `/var/log` on Linux
