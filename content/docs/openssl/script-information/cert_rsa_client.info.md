---
title: "cert_rsa_client.info"
description:
  "Automate the creation and management of RSA client certificates, including
  key generation, CSR creation, certificate issuance, verification, and
  preparation of certificate chain bundles."
url: "openssl/script-info/cert-rsa-client"
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
  - OpenSSL
  - RSA
  - certificates
  - automation
keywords:
  - RSA client certificates
  - certificate automation
  - key generation
  - CSR creation
  - certificate issuance
  - certificate verification
  - certificate chain bundles

weight: 8110

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the script `cert_rsa_client.sh`. This script creates an RSA
client certificate, signed by the intermediate certificate authority. It also
creates the chain bundle. The work is done by `cert.sh` in the same folder. This
script starts it with `--algo` rsa `--role` client and passes all other options
on.

## Script Metadata

- **Filename**: `cert_rsa_client.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: November 13, 2026
- **Version**: 3.0.0
- **Description**: This script creates an RSA client certificate, signed by the
  intermediate certificate authority.
- **RAW Script**: [cert_rsa_client.sh]

<br />

## Usage

```bash
./cert_rsa_client.sh [--fqdn <fqdn>] [--www] [--reuse-key] [-h|--help]
```

| Option          | Meaning                                                                                          |
| :-------------- | :----------------------------------------------------------------------------------------------- |
| `--fqdn <fqdn>` | Run without questions for this FQDN.                                                             |
| `--www`         | Also add `www.<fqdn>` to the subject alternative names.                                          |
| `--reuse-key`   | Reuse the existing private key of this FQDN instead of generating a new one. The key must exist. |
| `-h`, `--help`  | Show this help.                                                                                  |

The alias is `new-cert-rsa-client`.

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

exec bash "$script_dir/cert.sh" --algo rsa --role client "$@"
```

<br />

## Conclusion

This script creates an RSA client certificate, signed by the intermediate
certificate authority.

[cert_rsa_client.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_rsa_client.sh
