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
  - tls
  - certificate-authority
  - security
keywords:
  - openssl tutorial
  - openssl setup guide
  - tls certificate management
  - tls certificates
  - self-signed certificates
  - openssl configuration

weight: 8902

toc: true
katex: true
---

<br />

{{% alert context="warning" %}}
The certificates are meant for a homelab and for testing. Do not use them in
production. {{% /alert %}}

<br />

## Requirements

A Linux system with Bash, Git, and OpenSSL.

<br />

## Quick Install

To quickly install, run the following command:

```bash
git clone https://github.com/homelab-alpha/openssl.git ~/openssl && cd ~/openssl/scripts && ./tls_dotfiles_installer.sh && cd && exec bash
```

If you've used the quick install method, you can skip to [get started].

<br />

## Normal Install

If you prefer to manually install, follow these steps:

1. Clone the OpenSSL repository to `~/openssl`. The aliases expect the
   repository in this location:

   ```bash
   git clone https://github.com/homelab-alpha/openssl.git ~/openssl
   ```

2. Navigate to the `scripts` directory:

   ```bash
   cd ~/openssl/scripts
   ```

3. Run the installation script:

   ```bash
   ./tls_dotfiles_installer.sh
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
new-tls-directory-setup
```

<br />

### Upgrading from the `ssl` Directory

Earlier versions of the scripts used the directory `~/ssl`. The scripts still
work with that directory while `~/tls` does not exist, and they print a warning.
The old script names and the old alias `new-ssl-directorie-setup` also still
work, until the next major version.

To move to `~/tls`, update the repository, open a new shell, and run the
migration. Use `--dry-run` first to see what happens:

```bash
git -C ~/openssl pull
exec bash
openssl-migrate-tls --dry-run
openssl-migrate-tls
```

The migration moves `~/ssl` to `~/tls`, leaves the link `~/ssl -> tls` behind,
and changes the path in the OpenSSL configuration files after it saves a copy.
Do not run `new-tls-directory-setup` while `~/ssl` exists; the script stops with
an error to prevent a second, empty directory. See the
[migration section of the README](https://github.com/homelab-alpha/openssl#migrating-from-ssl-to-tls)
for details.

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

The script asks no questions: the `Common Name` is `localhost`. You have now
created your first certificate. It also creates a bundle for HAProxy.

Check the chain of trust of the whole chain, including the new certificate:

```bash
openssl-verify localhost
```

<br />

## Unique Subject in OpenSSL

<br />

{{% alert context="primary" %}}
**Important:** `new-tls-directory-setup` sets `unique_subject = yes`. OpenSSL
then refuses a second valid certificate with the same **Common Name**.
{{% /alert %}}

### What Should You Do?

For most users, keep the default. To replace a certificate that expires, use
`openssl-renew`. It archives the old files, handles the setting for you, and
restores it afterwards. See [Renew Certificates].

Only change the setting when you want several valid certificates with the same
**Common Name**, for example while you test. Open the terminal and run:

```bash
echo "unique_subject = no" > $HOME/tls/db/index.txt.attr
```

Afterward, verify the change:

```bash
cat $HOME/tls/db/index.txt.attr
```

To go back to the default, run:

```bash
echo "unique_subject = yes" > $HOME/tls/db/index.txt.attr
```

<br />

### What Happens With Each Setting?

With `unique_subject = yes` (the default):

- A certificate script stops with an error when a valid certificate with the
  same **Common Name** already exists in `index.txt`.
- Every name has at most one valid entry, which keeps revocation and renewal
  simple.

With `unique_subject = no`:

- You can create multiple certificates with the same **Common Name**.
- A name can have several valid entries. `openssl-revoke` revokes all valid
  certificates with that name.

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

These commands ask for the fully qualified domain name (FQDN) and, for servers,
one or more IPv4 addresses. To run without questions, pass them as options:

```bash
new-cert-server --fqdn example.test --ip 192.0.2.10
new-cert-client --fqdn client.example.test
```

For more than one IPv4 address, separate the addresses with commas:

```bash
new-cert-server --fqdn example.test --ip 192.0.2.10,192.0.2.11
```

A space after a comma is allowed, which keeps a long list readable:

```bash
new-cert-server --fqdn example.test --ip 192.0.2.10, 192.0.2.11, 192.0.2.12
```

Enter the FQDN without `www.`. A server certificate (ECDSA or RSA) and an RSA
client certificate cover both the FQDN and `www.<fqdn>`, so
`--fqdn example.test` gives a certificate for `example.test` and
`www.example.test`. The commands that use the name of an existing certificate,
such as `openssl-verify`, `openssl-renew`, and `openssl-revoke`, also take the
FQDN you entered here.

For a wildcard certificate, put the FQDN in single quotes so that the shell does
not expand the `*`:

```bash
new-cert-server --fqdn '*.example.test'
```

A wildcard certificate holds `*.example.test` and `example.test` itself. It does
not hold `www.<fqdn>`, because the wildcard already covers `www.example.test`. A
wildcard covers one label only, so `a.b.example.test` is not covered.

<br />

## Verify Certificates

Check a certificate against its chain of trust. Use the filename without `.pem`
for your own certificates:

```bash
openssl-verify root_ca.pem
openssl-verify -v ca.pem
openssl-verify example.test
```

See [verify_tls_certificates] for the options.

<br />

## Check the Expiry

List every certificate under `~/tls/certs`, sorted by the days left. The script
never changes a file:

```bash
openssl-status
openssl-status --quiet
```

Server and client certificates warn 30 days ahead, and the authorities warn 180
days ahead. The exit code is `0` when everything is valid longer than its
threshold, so you can use the script in cron or in a systemd timer. See
[tls_certificate_status] for all exit codes.

<br />

## Renew Certificates

Renew server and client certificates before they expire. The script archives the
old files in `~/tls/archive/<fqdn>/<date>/` and never deletes anything:

```bash
openssl-renew --dry-run example.test
openssl-renew example.test
openssl-renew --all --within 30 --yes
```

The authorities (trusted identity, root, and intermediate) are not renewed. See
[renew_tls_certificates] for the options, the hooks, and a schedule.

<br />

## Revoke Certificates

Revoke a server or client certificate, for example after a private key leaked.
The script marks it as revoked in the database and generates a Certificate
Revocation List (CRL) in `~/tls/crl/ca_crl.pem`:

```bash
openssl-revoke --dry-run example.test
openssl-revoke --reason keyCompromise example.test
openssl-revoke --crl-only
```

The certificates have no CRL distribution point, so clients do not find the CRL
by themselves. Install `ca_crl.pem` where you use it, for example in the
configuration of HAProxy or nginx. A CRL is valid for 30 days, so generate a new
one with `openssl-revoke --crl-only` before it expires. See
[revoke_tls_certificates] for the details.

[get started]: #get-started
[Create Your Own Certificate]: #create-your-own-certificate
[Renew Certificates]: #renew-certificates
[verify_tls_certificates]: /openssl/script-info/verify-tls-certificates/
[tls_certificate_status]: /openssl/script-info/tls-certificate-status/
[renew_tls_certificates]: /openssl/script-info/renew-tls-certificates/
[revoke_tls_certificates]: /openssl/script-info/revoke-tls-certificates/
