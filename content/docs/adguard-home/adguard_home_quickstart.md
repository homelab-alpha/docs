---
title: "AdGuard Home Quickstart"
description:
  "Start your journey with AdGuard Home swiftly using this concise and
  informative quickstart guide, empowering you to enhance your internet security
  and privacy."
url: "adguard-home/quickstart"
icon: "rocket_launch"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - AdGuard Home
series:
  - AdGuard Home
tags:
  - AdGuard Home
  - ad blocking
  - DNS filtering
  - internet security
  - network protection
  - privacy protection
  - home network
  - quickstart guide
keywords:
  - AdGuard Home
  - ad blocking
  - DNS filtering
  - internet security
  - network protection
  - privacy protection
  - home network
  - quickstart guide

weight: 1002

toc: true
katex: true
---

<br />

## Linux and macOS

### Using `curl`

If you prefer using `curl`, you can execute the following command in your
terminal:

```bash
curl -s -S -L https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
```

This command will download the installation script and execute it. The flags are
used to ensure a `-s` silent, `-S` show errors, and `-L` follow redirects
respectively. The `-v` flag is optional and stands for verbose output.

<br />

### Using `wget`

Alternatively, if you prefer `wget`, you can run this command in your terminal:

```bash
wget --no-verbose -O - https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
```

Similar to `curl`, this command downloads the script and executes it. The\
`--no-verbose` flag ensures minimal output, while `-O` redirects the output to stdout.

<br />

### Using `fetch`

For FreeBSD users or those who prefer `fetch`, you can execute the following
command in your terminal:

```bash
fetch -o - https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
```

This command downloads the script using `fetch` and then executes it. The\
`-o` flag directs the output to stdout.

After downloading and executing the installation script, AdGuardHome will be
installed on your system. However, make sure to review and understand the
contents of the script before running it to ensure it aligns with your security
practices.

<br />

### Script Options

The installation script provides several options:

- `-c <channel>`: Use a specified channel.
- `-r`: Reinstall AdGuard Home.
- `-u`: Uninstall AdGuard Home.
- `-v`: Enable verbose output.

{{% alert context="warning" %}}
Please note that the `-r` and `-u` options cannot be used simultaneously as they
are mutually exclusive. {{% /alert %}}

<br />

## Alternative Methods

If you prefer manual installation, you can refer to the **[getting
started][wiki-start]** article on the AdGuard Home website for detailed
instructions.

Alternatively, you can use the official Docker image available on [Docker Hub]
or install AdGuard Home securely and easily from the [Snap Store] if you're
running Ubuntu.

These alternative methods offer flexibility based on your preferences and system
setup.

[wiki-start]: https://adguard-dns.io/kb/adguard-home/getting-started
[Docker Hub]: https://hub.docker.com/r/adguard/adguardhome
[Snap Store]: https://snapcraft.io/adguard-home
