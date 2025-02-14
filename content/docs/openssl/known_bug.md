---
title: "⚠️ Known BUG"
description:
  "Encounter an error when generating a CSR due to a conflicting Common Name?
  This guide provides a step-by-step workaround to resolve the issue by
  permanently disabling conflicting entries in the OpenSSL index files, ensuring
  smooth certificate creation."
url: "openssl/known-bug"
aliases: ""
icon: "bug_report"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - OpenSSl
series:
  - OpenSSl
tags:
  - OpenSSL
  - CSR
  - SSL/TLS
  - Certificate Generation
  - Common Name Conflict
keywords:
  - OpenSSL issue
  - Certificate Signing Request
  - Common Name conflict
  - SSL/TLS certificate creation
  - OpenSSL index.txt
  - troubleshooting OpenSSL
  - CSR error fix
  - encryption troubleshooting

weight: 8901

toc: true
katex: true
---

<br />

{{% alert context="warning" %}}
**Caution** – This documentation is a work in progress.
{{% /alert %}}

## Existing BUG when generating a (CSR)

When you try to create a new certificate with the same `Common Name` (for
example, `localhost`), you may encounter an error message stating that the
`Common Name` already exists in the index file. I haven’t had the time to figure
out exactly what’s going wrong yet, but here is a temporary workaround.

<br />

### Steps to resolve the issue

<br />

1. **Check the files where certificates are stored:**

   Check the `index.txt` files in both the intermediate and root databases. You
   can do this with the following commands:

   ```bash
   cat $HOME/ssl/intermediate/db/index.txt
   ```

   and

   ```bash
   cat $HOME/ssl/root/db/index.txt
   ```

2. **Search for the `Common Name` in the files:**

   Check if the `Common Name` you are trying to use already exists in the index
   file. For example, if you are trying to use `localhost`, search for a line
   that looks like:

   ```txt
   /CN=localhost
   ```

3. **Permanently disable the line:**

   If you find the `Common Name` in the files, you can permanently disable the
   line. **Do not delete the line**, but add a `#` at the beginning of the line
   to permanently disable it.

4. **Example for the intermediate certificate and certificate:**

   Open the file for the intermediate index file:

   ```bash
   nano $HOME/ssl/intermediate/db/index.txt
   ```

   Look for the line with the existing `Common Name` (for example, `localhost`)
   and permanently disable the line:

   ```nano
   # V	300214090008Z		0DEF222C7753E06C642346C35BE3EBA8	unknown	/C=NL/O=Homelab-Alpha/CN=HA E1
   # V	260215090016Z		8C0556B625F8DBAC783345A0E0966913	unknown	/CN=localhost
   ```

5. **Example for the root certificate:**

   Repeat this process for the root certificate:

   ```bash
   nano $HOME/ssl/root/db/index.txt
   ```

   Permanently disable the line with the existing `Common Name` here as well:

   ```nano
   # V	450214090003Z		4E00BDA75588B45CE488253C5E09BCF1	unknown	/C=NL/O=Homelab-Alpha/CN=HA Root X1
   ```

6. **Try creating the certificate again:**

   After permanently disabling the lines, try creating the certificate again.
   This should now work without any issues.
