---
title: "OpenSSL Quickstart"
description: "Jumpstart Your Journey with OpenSSL Using This Quickstart Guide"
url: "openssl/quickstart"
aliases: ""
icon: "rocket_launch"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - OpenSSl
series:
  - OpenSSl
tags:
  - openssl
  - quickstart
keywords:
  - openssl quickstart
  - openssl tutorial
  - openssl commands
  - openssl setup
  - openssl certificates
  - openssl configuration
  - certificate authority
  - SSL/TLS certificates

weight: 8902

toc: true
katex: true
---

<br />

{{% alert context="warning" %}}
**Caution** – This documentation is a work in progress.

The **Getting Started** section is functional, but it needs additional content and information.
{{% /alert %}}

<br />

## Getting Started

{{% alert context="danger" %}}
Before proceeding, please review the [existing bug] to avoid potential issues.
{{% /alert %}}

## Quick Install

To quickly install, run the following command:

```bash
git clone https://github.com/homelab-alpha/openssl.git && cd openssl/scripts && ./ssl_dotfiles_installer.sh && cd && exec bash
```

If you've used the quick install method, you can skip to
[get started.](#get-started)

<br />

## Normal Install

If you prefer to manually install, follow these steps:

1. Clone the OpenSSL repository to your local machine:

   ```bash
   git clone https://github.com/homelab-alpha/openssl.git
   ```

2. Navigate to the `scripts` directory:

   ```bash
   cd openssl/scripts
   ```

3. Run the installation script:

   ```bash
   ./ssl_dotfiles_installer.sh
   ```

4. To apply the changes, reset your shell environment:

   ```bash
   cd && exec bash
   ```

<br />

## Get Started

### 1. Set Up OpenSSL Directories and Config Files

Run the following command to create the necessary directories and configuration
files:

```bash
new-ssl-directories-setup
```

<br />

### 2. Trusted Authority

Generate a self-signed certificate to serve as a trusted authority:

```bash
new-trusted-id
```

<br />

### 3. Root Certificate Authority

Generate a root certificate authority, signed by your trusted authority:

```bash
new-root-ca
```

<br />

### 4. Intermediate Certificate Authority

Generate an intermediate certificate authority, signed by the root certificate
authority:

```bash
new-ca
```

<br />

### 5. Certificate

Finally, create a certificate for localhost, signed by the intermediate
certificate authority:

```bash
new-cert-localhost
```

When prompted for the `Common Name`, enter `localhost` and press enter. You will
now have successfully created your first certificate.

<br />

## Create Your Own Certificate

### 1. Certificate for Server Application

Generate a certificate for your server application, signed by the intermediate
certificate authority:

```bash
new-cert-server
```

For RSA:

```bash
new-cert-rsa-server
```

<br />

### 2. Certificate for Client Application

Generate a certificate for your client application, signed by the intermediate
certificate authority:

```bash
new-cert-client
```

For RSA:

```bash
new-cert-rsa-client
```

These commands will help you create certificates tailored for your server or
client applications.

[existing bug]: known_bug.md
