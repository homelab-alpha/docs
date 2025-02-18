---
title: "OpenSSL Quickstart Guide"
description: "Jumpstart Your Journey with OpenSSL Using This Quickstart Guide"
url: "openssl/quickstart-guide"
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
  - ssl
  - tls
  - certificate-authority
  - security
keywords:
  - openssl tutorial
  - openssl setup guide
  - ssl certificate management
  - tls certificates
  - self-signed certificates
  - openssl configuration

weight: 8902

toc: true
katex: true
---

<br />

{{% alert context="warning" %}}
**Caution** – This documentation is a work in progress.
{{% /alert %}}

<br />

## Quick Install

To quickly install, run the following command:

```bash
git clone https://github.com/homelab-alpha/openssl.git && cd openssl/scripts && ./ssl_dotfiles_installer.sh && cd && exec bash
```

If you've used the quick install method, you can skip to [get started].

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
new-ssl-directorie-setup
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

## Unique Subject in OpenSSL

<br />

{{% alert context="primary" %}}
**Important:** Our default OpenSSL configuration requires a **unique subject**
for each certificate. This ensures that each certificate has a unique identifier,
preventing duplication. {{% /alert %}}

### Should You Adjust This Configuration?

For most users, it is **strongly recommended** to apply the change outlined
below.

If you do not use our script `revoke_ssl_certificate.sh` (which is still in
development) or prefer a simpler setup, you must apply this change to avoid
potential errors.

To adjust the configuration, open the terminal and add the following lines:

```bash
echo "unique_subject = no" > $HOME/ssl/db/index.txt.attr
```

Afterward, verify the changes by running the following commands:

```bash
cat $HOME/ssl/db/index.txt.attr
```

<br />

### Why Is This Change Important?

If this setting is not adjusted and you attempt to create a new SSL certificate
with the same **Common Name** (for example, `localhost`), OpenSSL may reject the
request because the name already exists in the index file.

By setting `unique_subject = no`, you will be able to:

- Create multiple certificates with the same **Common Name** without issues.
- Avoid errors when generating new certificates.
- Simplify certificate management, especially if you do not revoke certificates
  using the script.

For a smoother experience, we recommend applying this change unless you have a
specific reason to keep the default setting.

Proceed to the next chapter: **[Create Your Own Certificate]**.

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

[get started]: #get-started
[Create Your Own Certificate]: #create-your-own-certificate
