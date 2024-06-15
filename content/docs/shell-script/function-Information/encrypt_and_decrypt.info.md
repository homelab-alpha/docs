---
title: "encrypt_and_decrypt.info"
description:
  "A shell script providing functions for AES-256 encryption and decryption of
  files and directories using OpenSSL."
url: "shell-script/function-info/encrypt-and-decrypt"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Function Information
tags:
  - encryption
  - decryption
  - AES-256
  - OpenSSL
  - shell script
  - data security
keywords:
  - encrypt files
  - decrypt files
  - shell script encryption
  - AES-256 encryption
  - OpenSSL encryption
  - data protection
  - command-line encryption

weight: 6200

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`encrypt_and_decrypt.sh`, authored by GJS (homelab-alpha), and its purpose is to
provide functions to encrypt and decrypt files or directories using the AES-256
encryption algorithm with OpenSSL.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `encrypt_and_decrypt.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 26, 2024
- **Version**: 1.0.1
- **Description**: This script provides functions for encrypting and decrypting
  files or directories using AES-256 encryption with OpenSSL.
- **RAW Script**: [encrypt_and_decrypt.sh]

<br />

## Script Overview

The script defines two main functions:

1. `file-encrypt`: Encrypts a given file or directory.
2. `file-decrypt`: Decrypts a previously encrypted file or directory.

<br />

## Function: file-encrypt

### Purpose

The `file-encrypt` function encrypts files or directories using the AES-256
encryption algorithm with OpenSSL.

<br />

### Usage

```bash
file-encrypt <input_file_or_directory>
```

- `<input_file_or_directory>`: The file or directory to be encrypted.

<br />

### Code Breakdown

```bash
function file-encrypt() {
    if [ -z "$1" ]; then
        echo "Usage: file-encrypt <input_file_or_directory>"
        return 1
    fi

    local input="$1"
    local output="${input}.aes256"

    if [ -e "$output" ]; then
        echo "Error: Output file already exists. Please choose a different name."
        return 1
    fi

    openssl enc -aes-256-ctr -pbkdf2 -salt -in "$input" -out "$output"
    if openssl_exit_code=$? && [ $openssl_exit_code -eq 0 ]; then
        echo ""
        echo "${input} has been successfully encrypted as ${output}."
        chmod 644 "$output"
    else
        echo "Encryption failed."
    fi
}
```

<br />

1. **Parameter Check**: The function first checks if the user provided an input
   file or directory. If not, it prints the usage message and exits with a
   status of 1.
2. **Variables**:
   - `input`: Stores the input file or directory name.
   - `output`: Stores the name of the output encrypted file, which is the input
     name appended with `.aes256`.
3. **Output File Check**: Checks if a file with the output name already exists.
   If it does, it prints an error message and exits.
4. **Encryption**: Uses the OpenSSL command to encrypt the input file with
   AES-256 in CTR mode, using PBKDF2 for key derivation and adding a salt.
5. **Success Message**: If the encryption is successful, it prints a success
   message and sets the permissions of the output file to `644`. If the
   encryption fails, it prints an error message.

<br />

## Function: file-decrypt

### Purpose

The `file-decrypt` function decrypts files or directories that were encrypted
using the AES-256 encryption algorithm with OpenSSL.

<br />

### Usage

```bash
file-decrypt <input_file>
```

- `<input_file>`: The file to be decrypted.

<br />

### Code Breakdown

```bash
function file-decrypt() {
    if [ -z "$1" ]; then
        echo "Usage: file-decrypt <input_file>"
        return 1
    fi

    local input="$1"
    local output="${input%.aes256}"

    if [ -e "$output" ]; then
        echo "Error: Output file already exists. Please choose a different name."
        return 1
    fi

    openssl enc -aes-256-ctr -pbkdf2 -d -salt -in "$input" -out "$output"
    if openssl_exit_code=$? && [ $openssl_exit_code -eq 0 ]; then
        echo ""
        echo "${input} has been successfully decrypted as ${output}."
        chmod 644 "$output"
    else
        echo "Decryption failed."
    fi
}
```

<br />

1. **Parameter Check**: Similar to `file-encrypt`, it checks if an input file is
   provided. If not, it prints the usage message and exits with a status of 1.
2. **Variables**:
   - `input`: Stores the input filename.
   - `output`: Stores the name of the output decrypted file by removing the
     `.aes256` extension from the input name.
3. **Output File Check**: Checks if a file with the output name already exists.
   If it does, it prints an error message and exits.
4. **Decryption**: Uses the OpenSSL command to decrypt the input file with
   AES-256 in CTR mode, using PBKDF2 for key derivation and adding a salt.
5. **Success Message**: If the decryption is successful, it prints a success
   message and sets the permissions of the output file to `644`. If the
   decryption fails, it prints an error message.

<br />

## Conclusion

By following these steps, the script ensures secure encryption and decryption of
files and directories, making it useful for protecting sensitive data.

[encrypt_and_decrypt.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/encrypt_and_decrypt.sh
