---
title: "cert_ecdsa_server.info"
description:
  "This script automates the generation of an ECDSA server certificate, handling
  key generation, CSR creation, certificate issuance, and verification. It
  includes steps for directory path definition, random hexadecimal value
  generation, and certificate format conversion for compatibility with various
  applications."
url: "openssl/script-info/cert-ecdsa-server"
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
  - ECDSA
  - Server Certificate
  - Automation
  - Certificate Management
keywords:
  - ECDSA server certificate
  - key generation
  - CSR creation
  - certificate issuance
  - verification

weight: 8107

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the script `cert_ecdsa_server.sh`. This script creates an ECDSA
server certificate, signed by the intermediate certificate authority. It also
creates the chain bundle and a bundle for HAProxy. The work is done by `cert.sh`
in the same folder. This script starts it with `--algo` ecdsa `--role` server
and passes all other options on.

## Script Metadata

- **Filename**: `cert_ecdsa_server.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: November 13, 2026
- **Version**: 3.0.0
- **Description**: This script creates an ECDSA server certificate, signed by
  the intermediate certificate authority.
- **RAW Script**: [cert_ecdsa_server.sh]

<br />

## Usage

```bash
./cert_ecdsa_server.sh [--fqdn <fqdn> [--ip <ipv4>[,<ipv4>...]]] [--reuse-key] [-h|--help]
```

| Option          | Meaning                                                                                                                                                                                                                                     |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--fqdn <fqdn>` | Run without questions for this FQDN.                                                                                                                                                                                                        |
| `--ip <list>`   | Add one or more IPv4 addresses to the subject alternative names, separated by commas (for example 192.168.0.1,192.168.0.2). A space after a comma is allowed (192.168.0.1, 192.168.0.2). Can be repeated. Only used together with `--fqdn`. |
| `--reuse-key`   | Reuse the existing private key of this FQDN instead of generating a new one. The key must exist.                                                                                                                                            |
| `-h`, `--help`  | Show this help.                                                                                                                                                                                                                             |

The alias is `new-cert-server`.

Without `--fqdn` the script asks for the details. The Common Name is always the
FQDN.

## Notes

- The certificates are for a homelab and for testing.
- Certificates are stored under `$HOME/tls`.
- A certificate covers the FQDN and `www.<fqdn>`. For a wildcard FQDN, such as
  `*.example.test`, it covers the wildcard and the domain itself (example.test),
  because the wildcard already covers www.example.test and does not cover the
  domain itself.

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

exec bash "$script_dir/cert.sh" --algo ecdsa --role server "$@"
```

<br />

## Conclusion

This script creates an ECDSA server certificate, signed by the intermediate
certificate authority.

[cert_ecdsa_server.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_ecdsa_server.sh
