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

1. **Quick Install**: If you've used the quick install method, skip to step 3.

   Run the following command to quickly install:

   ```bash
   git clone https://github.com/homelab-alpha/openssl.git && cd openssl/scripts && ./ssl_dotfiles_installer.sh && cd && exec bash
   ```

2. **Normal Install**:

   First, clone the OpenSSL repository to your local machine:

   ```bash
   git clone https://github.com/homelab-alpha/openssl.git
   ```

   Navigate to the `scripts` directory:

   ```bash
   cd openssl/scripts
   ```

   Run the installation script:

   ```bash
   ./ssl_dotfiles_installer.sh
   ```

   Reset the shell environment to apply changes:

   ```bash
   cd && exec bash
   ```

3. **Create the OpenSSL Directories and Configuration Files**:

   ```bash
   new-ssl-directories-setup
   ```

4. **Create a Trusted Authority (Self-Signed Certificate)**:

   ```bash
   new-trusted-id
   ```

5. **Create a Root Certificate Authority (Signed by Trusted Authority)**:

   ```bash
   new-root-ca
   ```

6. **Create an Intermediate Certificate Authority (Signed by Root Certificate Authority)**:

   ```bash
   new-ca
   ```

7. **Create a Certificate for Localhost (Signed by Intermediate Certificate Authority)**:

   ```bash
   new-cert-localhost
   ```

<br />

## Create your own certificate for server or client application services

1. **Create a Certificate for Server application (signed by Intermediate
   Certificate Authority)**:

   ```bash
   new-cert-server
   ```

   For RSA:

   ```bash
   new-cert-rsa-server
   ```

2. **Create a Certificate for Client application (signed by Intermediate
   Certificate Authority)**:

   ```bash
   new-cert-client
   ```

   For RSA:

   ```bash
   new-cert-rsa-client
   ```

These commands will help you set up certificates for server and client
applications according to your requirements.

[existing bug]: known_bug.md
