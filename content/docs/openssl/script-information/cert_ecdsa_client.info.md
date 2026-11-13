---
title: "cert_ecdsa_client.info"
description:
  "This script is designed to automate the creation of an ECDSA client
  certificate. It covers key generation, CSR creation, certificate issuance,
  extension file creation, bundling with an intermediate CA chain, and
  verification of the certificate and its chain bundle. Additionally, it
  converts the certificate into different formats for use in various
  applications."
url: "openssl/script-info/cert-ecdsa-client"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - OpenSSL
series:
  - Script Information
tags:
  - ECDSA
  - Client Certificate
  - OpenSSL
  - Certificate Automation
  - CSR
  - Certificate Issuance
  - Certificate Verification
keywords:
  - ECDSA client certificate generation
  - OpenSSL scripting
  - Automated certificate creation
  - CSR generation script
  - Certificate chain verification
  - SSL/TLS certificates
  - Security automation
  - PEM to CRT conversion
  - Key management
  - Digital certificate script

weight: 8108

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the script `cert_ecdsa_client.sh`. This script creates an ECDSA
client certificate, signed by the intermediate certificate authority. It also
creates the chain bundle. The work is done by `cert.sh` in the same folder. This
script starts it with `--algo` ecdsa `--role` client and passes all other
options on.

## Script Metadata

- **Filename**: `cert_ecdsa_client.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: November 13, 2026
- **Version**: 3.0.0
- **Description**: This script creates an ECDSA client certificate, signed by
  the intermediate certificate authority.
- **RAW Script**: [cert_ecdsa_client.sh]

<br />

## Usage

```bash
./cert_ecdsa_client.sh [--fqdn <fqdn>] [--www] [--reuse-key] [-h|--help]
```

| Option          | Meaning                                                                                          |
| :-------------- | :----------------------------------------------------------------------------------------------- |
| `--fqdn <fqdn>` | Run without questions for this FQDN.                                                             |
| `--www`         | Also add `www.<fqdn>` to the subject alternative names.                                          |
| `--reuse-key`   | Reuse the existing private key of this FQDN instead of generating a new one. The key must exist. |
| `-h`, `--help`  | Show this help.                                                                                  |

The alias is `new-cert-client`.

Without `--fqdn` the script asks for the details. The Common Name is always the
FQDN.

## Notes

- The certificates are for a homelab and for testing.
- Certificates are stored under `$HOME/tls`.
- A certificate covers the FQDN. Use `--www` to add `www.<fqdn>`.

<br />

## Detailed Explanation

The sections below follow the script from top to bottom.

<br />

### Start `cert.sh` with the fixed options

The script shows its own help text for `-h` and `--help`. For every other call
it starts `cert.sh` in the same folder with the fixed options, and passes all
other options on.

```bash
script_dir="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"

for argument in "$@"; do
  case "$argument" in
  -h | --help)
    sed -n '/^# Usage:/,/^$/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
    exit 0
    ;;
  esac
done

exec bash "$script_dir/cert.sh" --algo ecdsa --role client "$@"
```

<br />

## Conclusion

This script creates an ECDSA client certificate, signed by the intermediate
certificate authority.

[cert_ecdsa_client.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_ecdsa_client.sh
