---
title: "cert_ecdsa_localhost.info"
description:
  "Automates the generation of an ECDSA certificate for localhost, including key
  creation, CSR, certificate issuance, and format conversion."
url: "openssl/script-info/cert-ecdsa-localhost"
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
  - SSL
  - Certificate Generation
  - OpenSSL Script
  - Localhost Security
keywords:
  - ECDSA certificate
  - localhost SSL
  - OpenSSL automation
  - certificate signing request
  - SSL key generation
  - certificate verification
  - HAProxy SSL
  - certificate format conversion

weight: 8106

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the script `cert_ecdsa_localhost.sh`. This script creates an
ECDSA server certificate for localhost, signed by the intermediate certificate
authority. It also creates the chain bundle and a bundle for HAProxy. The work
is done by `cert.sh` in the same folder. This script starts it with `--algo`
ecdsa `--role` server `--localhost` and passes all other options on.

## Script Metadata

- **Filename**: `cert_ecdsa_localhost.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: November 13, 2026
- **Version**: 3.0.0
- **Description**: This script creates an ECDSA server certificate for
  localhost, signed by the intermediate certificate authority.
- **RAW Script**: [cert_ecdsa_localhost.sh]

<br />

## Usage

```bash
./cert_ecdsa_localhost.sh [--non-interactive] [--reuse-key] [-h|--help]
```

| Option              | Meaning                                                                             |
| :------------------ | :---------------------------------------------------------------------------------- |
| `--non-interactive` | Kept for older commands. The script never asks a question.                          |
| `--reuse-key`       | Reuse the existing private key instead of generating a new one. The key must exist. |
| `-h`, `--help`      | Show this help.                                                                     |

The alias is `new-cert-localhost`.

The Common Name is localhost.

## Notes

- The certificates are for a homelab and for testing.
- Certificates are stored under `$HOME/tls`.
- The certificate covers localhost, `*.localhost`, and 127.0.0.1.

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

exec bash "$script_dir/cert.sh" --algo ecdsa --role server --localhost "$@"
```

<br />

## Conclusion

This script creates an ECDSA server certificate for localhost, signed by the
intermediate certificate authority.

[cert_ecdsa_localhost.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_ecdsa_localhost.sh
