---
title: "DNF Command Cheat Sheet"
description:
  "Master DNF, the powerful package manager used in Fedora and other RPM-based
  distributions, with this comprehensive cheat sheet. Learn essential commands
  for package management, repository handling, system upgrades, and more."
url: "linux/fedora/dnf-cheat-sheet"
aliases: ""
icon: "terminal"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Linux
series:
  - Fedora
tags:
  - DNF
  - package management
  - RPM
  - Fedora
  - Linux administration
  - system upgrades
  - repository management
  - kernel management
keywords:
  - DNF commands cheat sheet
  - DNF package manager
  - RPM package management
  - Fedora DNF tutorial
  - Linux system upgrades
  - manage repositories in Linux
  - remove old kernels Fedora

weight: 7100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Please note that the Linux shell is case-sensitive. {{% /alert %}}

<br />

## Basic Package Management

### Install a Package

```bash
sudo dnf install <package_name>
```

Installs the specified package.

<br />

### Remove a Package

```bash
sudo dnf remove <package_name>
```

Removes the specified package.

<br />

### Update a Specific Package

```bash
sudo dnf update <package_name>
```

Updates the specified package to the latest version.

<br />

### Update All Packages

```bash
sudo dnf update
```

Updates all installed packages to their latest versions.

<br />

### List All Installed Packages

```bash
dnf list installed
```

Displays a list of all installed packages.

<br />

### Show Package Information

```bash
dnf info <package_name>
```

Displays detailed information about the specified package.

<br />

### Search for Packages by Name

```bash
dnf search <package_name>
```

Searches for packages by their names.

<br />

### Search for Packages by Description

```bash
dnf search <keyword>
```

Searches for packages by keywords in their descriptions.

<br />

### Download a Package Without Installing

```bash
dnf download <package_name>
```

Downloads the specified package without installing it.

<br />

## Repository Management

### Add a Repository

1. Create a `.repo` file in `/etc/yum.repos.d/`:
   ```bash
   sudo nano /etc/yum.repos.d/<repo_name>.repo
   ```
2. Add repository details to the file.

<br />

### Disable a Repository

```bash
sudo dnf config-manager --set-disabled <repo_name>
```

Disables the specified repository.

<br />

### Enable a Repository

```bash
sudo dnf config-manager --set-enabled <repo_name>
```

Enables the specified repository.

<br />

### List All Repositories

```bash
dnf repolist
```

Displays a list of all configured repositories.

<br />

## Cleaning Up

### Remove Unused Packages

```bash
sudo dnf autoremove
```

Removes packages that were installed as dependencies but are no longer needed.

<br />

### Clean Cache

```bash
sudo dnf clean all
```

Cleans all cached files.

<br />

### Clean Metadata Cache

```bash
sudo dnf clean metadata
```

Cleans the metadata cache.

<br />

### Clean Packages Cache

```bash
sudo dnf clean packages
```

Cleans the packages cache.

<br />

### Clean Expired Cache

```bash
sudo dnf clean expire-cache
```

Cleans the expired cache.

<br />

## Group Management

### List Available Groups

```bash
dnf group list
```

Lists all available package groups.

<br />

### Install a Group

```bash
sudo dnf group install "<group_name>"
```

Installs all packages in the specified group.

<br />

### Remove a Group

```bash
sudo dnf group remove "<group_name>"
```

Removes all packages in the specified group.

<br />

## History and Rollback

### View Transaction History

```bash
dnf history
```

Displays the transaction history.

<br />

### View Details of a Specific Transaction

```bash
dnf history info <transaction_id>
```

Displays details of the specified transaction.

<br />

### Undo a Specific Transaction

```bash
sudo dnf history undo <transaction_id>
```

Undoes the specified transaction.

<br />

### Redo a Specific Transaction

```bash
sudo dnf history redo <transaction_id>
```

Redoes the specified transaction.

<br />

## Additional Commands

### Check for Available Updates

```bash
dnf check-update
```

Checks for available updates.

<br />

### List Enabled Repositories

```bash
dnf repolist enabled
```

Lists all enabled repositories.

<br />

### List Disabled Repositories

```bash
dnf repolist disabled
```

Lists all disabled repositories.

<br />

### Upgrade System to a New Release

```bash
sudo dnf system-upgrade download --releasever=<version>
sudo dnf system-upgrade reboot
```

Upgrades the system to a new release.

<br />

### Synchronize Installed Packages to Latest Available Versions

```bash
sudo dnf distro-sync
```

Synchronizes installed packages to the latest available versions.

<br />

### Display DNF Version

```bash
dnf --version
```

Displays the current version of DNF.

<br />

### Get Help on DNF Commands

```bash
dnf help
```

Displays help information for DNF commands.

<br />

## Removing Old Kernels

### List Installed Kernels

```bash
dnf list installed kernel
```

Lists all installed kernels.

<br />

### Check Current Running Kernel

```bash
uname -r
```

Displays the current running kernel version.

<br />

### Automatically Remove Old Kernels

1. Configure DNF to keep only the latest two kernels:
   ```bash
   sudo nano /etc/dnf/dnf.conf
   ```
   Add or modify the following line:
   ```ini
   installonly_limit=2
   ```
2. Apply cleanup to remove old kernels:
   ```bash
   sudo dnf remove $(dnf repoquery --installonly --latest-limit=-2 -q)
   ```

<br />

### Manually Remove Specific Old Kernels

1. List all installed kernels:
   ```bash
   dnf list installed kernel
   ```
2. Identify the old kernel versions you want to remove. Do not remove the
   currently running kernel (you can check it with `uname -r`).
3. Remove a specific old kernel:
   ```bash
   sudo dnf remove kernel-<version>
   ```

<br />

### Using `package-cleanup` for Managing Kernels

1. Install `dnf-utils`:
   ```bash
   sudo dnf install dnf-utils
   ```
2. Keep only the latest 2 kernels:
   ```bash
   sudo package-cleanup --oldkernels --count=2
   ```

Keep this cheat sheet handy for efficient and effective system management using
DNF!
