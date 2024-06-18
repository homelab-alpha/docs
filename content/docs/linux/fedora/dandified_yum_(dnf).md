---
title: "Dandified YUM (DNF)"
description:
  "DNF, the powerful package manager used by Fedora, Red Hat Enterprise Linux
(RHEL), and their derivatives."
url: "linux/fedora/dnf"
aliases:
  - /dnf
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
  - package manager
  - RPM
  - software management
  - Linux administration
  - Fedora tools
  - DNF
  - YUM
keywords:
  - Dandified YUM
  - DNF Fedora
  - RPM-based distributions
  - Fedora package manager
  - Linux package management
  - Red Hat Enterprise Linux
  - DNF commands

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Please note that the Linux shell is case-sensitive. {{% /alert %}}

<br />

## What is DNF?

DNF, short for Dandified YUM, is the next-generation version of the Yellowdog
Updater, Modified (YUM) package manager for RPM-based distributions. It was
designed to improve upon YUM in terms of performance, dependency resolution, and
handling large numbers of packages.

<br />

## Installing and Updating Packages

### Installing a Package

To install a package using DNF, you use the `install` command followed by the
package name. For example, to install `nano`:

```bash
sudo dnf install nano
```

<br />

### Removing a Package

To remove a package, you use the `remove` command:

```bash
sudo dnf remove nano
```

<br />

### Updating a Package

To update a specific package, you can use the `update` command:

```bash
sudo dnf update nano
```

<br />

### Updating All Packages

To update all installed packages to their latest versions:

```bash
sudo dnf update
```

<br />

## Searching for Packages

### Searching by Name

You can search for packages by name using the `search` command:

```bash
dnf search nano
```

<br />

### Searching by Description

If you're not sure about the exact name of the package, you can search by
description or other attributes:

```bash
dnf search editor
```

<br />

## Managing Repositories

### Adding a Repository

To add a new repository, you typically create a `.repo` file in the
`/etc/yum.repos.d/` directory. For example, to add a new repository:

```bash
sudo nano /etc/yum.repos.d/newrepo.repo
```

Then add the repository information to the file:

```shell
[newrepo]
name=New Repository
baseurl=http://repository.url/path/
enabled=1
gpgcheck=1
gpgkey=http://repository.url/path/RPM-GPG-KEY
```

<br />

### Disabling a Repository

To disable a repository:

```bash
sudo dnf config-manager --set-disabled newrepo
```

<br />

### Enabling a Repository

To enable a repository:

```bash
sudo dnf config-manager --set-enabled newrepo
```

<br />

## Cleaning Up

### Removing Unused Packages

Over time, you might accumulate packages that are no longer needed. To remove
these orphaned packages:

```bash
sudo dnf autoremove
```

<br />

### Cleaning Cache

DNF caches data for faster operations, but sometimes you need to clean this
cache:

```bash
sudo dnf clean all
```

<br />

## Additional Commands and Tips

### Listing Installed Packages

To list all installed packages:

```bash
dnf list installed
```

<br />

### Showing Package Information

To display detailed information about a package:

```bash
dnf info nano
```

<br />

### Downloading Packages Without Installing

If you need to download a package without installing it (useful for offline
installations):

```bash
dnf download nano
```

<br />

### Group Installations

DNF supports installing groups of packages, which is handy for setting up
environments. To list available groups:

```bash
dnf group list
```

To install a group:

```bash
sudo dnf group install "Development Tools"
```

<br />

### History and Rollback

DNF keeps track of all transactions, making it possible to undo changes. To view
the transaction history:

```bash
dnf history
```

To undo a specific transaction, use the transaction ID from the history:

```bash
sudo dnf history undo <transaction_id>
```

<br />

## Best Practices

1. **Regular Updates**: Keep your system updated regularly to ensure security
   and stability.
2. **Repository Management**: Only enable repositories you trust and need.
3. **Cleanup**: Regularly clean up unused packages and cache to free up space.
4. **Dependency Awareness**: Be mindful of dependencies when installing or
   removing packages to avoid breaking your system.

<br />

## Conclusion

DNF is a powerful and flexible package manager that makes managing software on
RPM-based systems a breeze. With these commands and tips, you should be able to
handle most of your package management needs efficiently. For more advanced
usage, the `man dnf` command and the official
[DNF documentation](https://dnf.readthedocs.io/en/latest/) are great resources.
Happy package managing!
