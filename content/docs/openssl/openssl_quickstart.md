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

1. **Clone the Repository**: Clone the OpenSSL repository to your local machine:

   ```bash
   git clone https://github.com/homelab-alpha/openssl.git && cd openssl/scripts && ./ssl_dotfiles_installer.sh && cd && exec bash
   ```

2. **Create the OpenSSL Directories and Configuration Files**:

   ```bash
   new-ssl-directorie-setup
   ```

3. **Create a Trusted Authority (self-signed)**:

   ```bash
   new-trusted-id
   ```

4. **Create a Root Certificate Authority (signed by Trusted Authority)**:

   ```bash
   new-root-ca
   ```

5. **Create a Intermediate Certificate Authority (signed by Root Certificate
   Authority)**:

   ```bash
   new-ca
   ```

6. **Create a Certificate for localhost (signed by Intermediate Certificate
   Authority)**:

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
