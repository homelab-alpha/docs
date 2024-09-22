---
title: "AdGuard Home Overview"
description:
  "Explore the features and functionalities of AdGuard Home in this
  comprehensive overview."
url: "adguard-home/overview"
aliases: ""
icon: "overview"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - AdGuard Home
series:
  - AdGuard Home
tags:
  - AdGuard Home
keywords:
  - AdGuard Home
  - ad blocker
  - privacy protection
  - internet security
  - DNS filtering
  - network protection
  - home network
  - overview

weight: 1001

toc: true
katex: true
---

<br />

## Introduction

AdGuard Home is a powerful and versatile Ad Blocker and privacy protection
software. In this repository, you'll find various subdirectories containing
specific components of AdGuard Home, including filters and other related files.

<br />

## Available filters from Homelab-Alpha

{{% alert context="warning" %}} The filters listed below are my personal filters
for AdGuard Home. Please ensure to review them initially to understand what is
being blocked, allowed, and/or redirected before using any of them.
{{% /alert %}}

- [**Bekende Malafide Handelspartijen:**] Filter consisting of a list of trading
  parties (sellers and traders) known to the Dutch National Police to be
  fraudulent.
- [**Blocklist:**] Filter composed of several other filters and specifically
  simplified to be more compatible with ad blocking at the DNS level.
- [**Cookies:**] Filter consisting of a list that blocks ads and ad tracking
  using cookie filters.
- [**DNS type:**] Filter consisting of a list that analyzes what type of DNS
  requests they are and then determines whether they should be blocked using a
  rule in a DNS block list.
- [**Fraudulent Trading Parties**] Filter consisting of a list of trading
  parties (sellers and traders) known to be fraudulent.
- [**IDNs:**] Filter consisting of a list that blocks Internationalized Domain
  Names.
- [**Microsoft Whitelist:**] Filter consisting of specific DNS whitelist for
  Microsoft that allows authorized domain names.
- [**Regex:**] Filter consisting of a list that blocks ads and ad tracking using
  regex syntax.
- [**SLDs:**] Filter consisting of a list that blocks Second-level domains.
- [**Sociale Media:**] Filter consisting of a list that blocks social media
  websites.
- [**Third Level Domains:**] Filter consisting of a list that blocks Third Level
  Domains.
- [**TLDs:**] Filter consisting of a list that blocks Top Level Domains.
- [**Whitelist:**] Filter consisting of a DNS whitelist that allows authorized
  domain names.
- [**Wildcard:**] Filter consisting of a list that blocks Wildcard DNS records.

<br />

## Contributions to Homelab-Alpha - AdGuard Home

No external contributions are currently being accepted for this project.

<br />

## Copyright and License

&copy; 2024 Homelab-Alpha and its repositories are licensed under the terms of
the [license] agreement.

[license]: docs/../../help/license.md
[**Bekende Malafide Handelspartijen:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/bekende_malafide_handelspartijen.txt
[**Blocklist:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/blocklist.txt
[**Cookies:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/cookies.txt
[**DNS type:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/dns_type.txt
[**Fraudulent Trading Parties**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/fraudulent_trading_parties.txt
[**IDNs:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/idns.txt
[**Microsoft Whitelist:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/microsoft_whitelist.txt
[**Regex:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/regex.txt
[**SLDs:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/slds.txt
[**Sociale Media:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/sociale_media.txt
[**Third Level Domains:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/third_level_domains.txt
[**TLDs:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/tlds.txt
[**Whitelist:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/whitelist.txt
[**Wildcard:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/wildcard.txt
