---
title: "OpenSSL Overview"
description: "Explore OpenSSL with This Comprehensive Overview"
url: "openssl/overview"
aliases: ""
icon: "overview"

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
keywords:
  - cryptographic library
  - encryption
  - decryption
  - secure communication
  - TLS
  - certificates
  - cryptographic algorithms
  - security protocols

weight: 8901

toc: true
katex: true
---

<br />

## Introduction

OpenSSL is a widely-used open-source cryptographic library that provides various
tools, libraries, and protocols for secure communication over computer networks.
It supports various encryption algorithms, cryptographic hash functions, and
protocols, making it a versatile tool for securing data transmission and
ensuring data integrity.

<br />

## Self-signed Certificates

This repository provides scripts and configuration files for generating,
verifying, renewing, and revoking self-signed certificates with OpenSSL. They
create a trusted identity, a root certificate authority (CA), an intermediate
CA, and ECDSA and RSA certificates for servers, clients, and localhost.

{{% alert context="warning" %}}
The certificates are meant for a homelab and for testing. Do not use them in
production, where you need third-party validation. {{% /alert %}}

<br />

## What You Get

Every task has an alias. The alias starts the script, and the script page
explains it in detail.

- **Create the directories and configs**: `new-tls-directory-setup`. Script
  page: [tls_directory_setup](/openssl/script-info/tls-directory-setup/).
- **Create the authorities**: `new-trusted-id`, `new-root-ca`, `new-ca`. Script
  page: [trusted_id](/openssl/script-info/trusted-id/),
  [root_ca](/openssl/script-info/root-ca/), [ca](/openssl/script-info/ca/).
- **Issue a certificate**: `new-cert-localhost`, `new-cert-server`,
  `new-cert-client`, `new-cert-rsa-server`, `new-cert-rsa-client`. Script page:
  [cert_ecdsa_localhost](/openssl/script-info/cert-ecdsa-localhost/),
  [cert_ecdsa_server](/openssl/script-info/cert-ecdsa-server/),
  [cert_ecdsa_client](/openssl/script-info/cert-ecdsa-client/),
  [cert_rsa_server](/openssl/script-info/cert-rsa-server/),
  [cert_rsa_client](/openssl/script-info/cert-rsa-client/). These five scripts
  start [cert](/openssl/script-info/cert/), which does the work.
- **Verify the chain of trust**: `openssl-verify`. Script page:
  [verify_tls_certificates](/openssl/script-info/verify-tls-certificates/).
- **Check the expiry**: `openssl-status`. Script page:
  [tls_certificate_status](/openssl/script-info/tls-certificate-status/).
- **Renew before the certificate expires**: `openssl-renew`. Script page:
  [renew_tls_certificates](/openssl/script-info/renew-tls-certificates/).
- **Revoke and generate a CRL**: `openssl-revoke`. Script page:
  [revoke_tls_certificates](/openssl/script-info/revoke-tls-certificates/).
- **Move an old `~/ssl` directory to `~/tls`**: `openssl-migrate-tls`. Script
  page: [tls_directory_migrate](/openssl/script-info/tls-directory-migrate/).

The scripts share their functions in one file. Script page:
[common](/openssl/script-info/common/).

Everything is stored in `~/tls`. To install the scripts and create your first
certificate, follow the [Quickstart Guide].

<br />

## Examples

In the OpenSSL repository, you will find a folder named `examples`, which
contains various sample configurations demonstrating how the TLS folder
structure is organized. This includes associated certificates and files. While
the certificates and private keys are provided, their contents have been
modified for security reasons. The actual certificate and key data have been
replaced with placeholder text, such as:

### .csr/.pem - Certificate Signing Request Example

```pem
-----BEGIN CERTIFICATE REQUEST-----
This is a demonstration Certificate Signing Request (CSR).

**WARNING:**
This CSR is for demonstration purposes only.
**DO NOT use in testing or production environments.**
-----END CERTIFICATE REQUEST-----
```

<br />

### .crt/.pem - Certificate Example

```pem
-----BEGIN CERTIFICATE-----
This is a demonstration certificate.

**WARNING:**
This certificate is for demonstration purposes only.
**DO NOT use in testing or production environments.**
-----END CERTIFICATE-----
```

<br />

### .key/.pem - Private Key Example

```pem
-----BEGIN EC PARAMETERS-----
This is a demonstration Elliptic Curve (EC) parameter set.
-----END EC PARAMETERS-----
-----BEGIN EC PRIVATE KEY-----
**WARNING:**
This private key is for demonstration purposes only.
**DO NOT use in testing or production environments.**
-----END EC PRIVATE KEY-----
```

The keys of the trusted identity and the root CA are encrypted with a
passphrase, so their example files have the header line
`BEGIN ENCRYPTED PRIVATE KEY`. The example key of the intermediate CA has the
header line `BEGIN PRIVATE KEY`.

This ensures that no actual certificates or private keys are shared, while still
demonstrating the correct structure.

<br />

## Contribute to Homelab-Alpha - OpenSSL

We value your contribution. We want to make it as easy as possible to submit
your contributions to the Homelab-Alpha - openssl repository. Changes to the
openssl are handled through pull requests against the `main` branch. To learn
how to contribute, see [contribute].

<br />

## Security Considerations

While OpenSSL provides powerful cryptographic functions, it's essential to
follow best practices and keep the library updated to address any security
vulnerabilities. Regularly check for updates and security advisories from the
OpenSSL project.

<br />

## Resources

- [OpenSSL Official Site]
- [OpenSSL Wiki]
- [OpenSSL Documentation]
- [GitHub Repository]

<br />

## Disclaimer

This OpenSSL Overview is for informational purposes only and does not replace
official documentation or security best practices. Always refer to the official
OpenSSL documentation and follow best practices when using cryptographic
libraries and protocols.

<br />

## License

This project is licensed under the **Creative Commons
Attribution-NonCommercial-ShareAlike 4.0 International License** (CC BY-NC-SA
4.0). See the [license] page for the full license text and the [NOTICE] file for
the attribution requirements.

[Quickstart Guide]: /openssl/quickstart-guide/
[contribute]: /contributing/contribute/
[OpenSSL Official Site]: https://www.openssl.org
[OpenSSL Wiki]: https://wiki.openssl.org
[OpenSSL Documentation]: https://www.openssl.org/docs
[GitHub Repository]: https://github.com/openssl/openssl
[license]: /license/
[NOTICE]: https://github.com/homelab-alpha/openssl/blob/main/NOTICE
