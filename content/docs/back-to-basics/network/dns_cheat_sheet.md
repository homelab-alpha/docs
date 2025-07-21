---
title: "DNS Cheat Sheet"
description:
  "A complete guide to understanding the Domain Name System (DNS) including key
  components, record types, query methods, caching, and troubleshooting. Perfect
  for network admins and web developers."
url: "back-to-basics/network/dns-cheat-sheet"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Network
tags:
  - DNS
  - Network Administration
  - Web Development
  - DNS Records
  - Network Security
  - IT Infrastructure
keywords:
  - DNS basics
  - DNS cheat sheet
  - DNS resolver
  - DNS server
  - DNS records
  - DNS query types
  - DNS caching
  - DNS troubleshooting
  - DNSSEC
  - Network best practices

weight: 2700

toc: true
katex: true
---

<br />

## Basics of DNS

**Domain Name System (DNS)** translates human-readable domain names (like
<www.example.com>) into IP addresses that computers use to identify each other
on the network.

- **Domain Name**: A readable name for an IP address (e.g., <www.example.com>).
- **IP Address**: A numerical label assigned to each device connected to a
  computer network (e.g., 192.168.1.1 for IPv4 or
  2001:0db8:85a3:0000:0000:8a2e:0370:7334 for IPv6).

<br />

## Key DNS Components

- **DNS Resolver**: The client-side part of DNS; it queries the DNS server.
- **DNS Server**: The server-side part of DNS; it responds to queries with IP
  addresses.
- **Root Name Servers**: The top-level DNS servers that direct queries to
  appropriate TLD (Top-Level Domain) servers.
- **TLD Name Servers**: Servers that store information for all domains within a
  top-level domain (like .com, .org).
- **Authoritative DNS Servers**: Servers that contain DNS records for specific
  domains.

<br />

## Common DNS Record Types

- **A Record**: Maps a domain name to an IPv4 address.
- **AAAA Record**: Maps a domain name to an IPv6 address.
- **CNAME Record**: Canonical Name record, which maps an alias name to the true
  or canonical domain name.
- **MX Record**: Mail Exchange record, which specifies the mail server
  responsible for receiving email.
- **NS Record**: Name Server record, which specifies the authoritative DNS
  servers for the domain.
- **TXT Record**: Text record, often used to provide additional information such
  as SPF records for email verification.
- **SRV Record**: Service record, which defines the location of servers for
  specified services.
- **PTR Record**: Pointer record, used for reverse DNS lookups.

<br />

## DNS Query Types

- **Recursive Query**: The DNS resolver queries multiple DNS servers until it
  finds the final IP address.
- **Iterative Query**: The DNS resolver queries each DNS server in turn; each
  server may refer the resolver to another server.
- **Non-recursive Query**: The DNS resolver queries the DNS server, and if the
  DNS server has the requested record, it responds immediately.

<br />

## DNS Caching

- **DNS Cache**: Temporary storage of DNS query results to improve speed and
  reduce the load on DNS servers.
- **TTL (Time To Live)**: The duration that a DNS record is cached by a DNS
  resolver or server.

<br />

## DNS Resolution Process

1. **Query Initiation**: A user types a domain name into a browser.
2. **DNS Resolver**: The resolver checks its cache. If the IP is not cached, it
   sends a query to a root DNS server.
3. **Root DNS Server**: Responds with the address of a TLD DNS server.
4. **TLD DNS Server**: Responds with the address of the authoritative DNS server
   for the domain.
5. **Authoritative DNS Server**: Provides the IP address for the domain.
6. **DNS Resolver**: Returns the IP address to the user's browser.
7. **Browser**: Connects to the server using the provided IP address.

<br />

## DNS Providers

The DNS providers below focus on showcasing their key features and services so
you can choose the one that best suits your needs. If you can't decide or can't
figure out which one best suits your needs, Homelab-Alpha recommends
[Quad9](#quad9).

<br />

{{% alert context="primary" %}}

**Notes**

- **DNS over UDP/TCP (Do53)**: Traditional DNS resolution method using port 53.
- **DNS over HTTPS (DoH)**: A protocol for performing remote Domain Name System
  (DNS) resolution via the HTTPS protocol.
- **DNS over TLS (DoT)**: A security protocol for encrypting and wrapping DNS
  queries and answers via the TLS protocol.
- **DNS over QUIC (DoQ)**: A new protocol for DNS encryption based on the QUIC
  transport protocol.
- **DNSCrypt**: A protocol that authenticates communications between a DNS
  client and a DNS resolver to prevent DNS spoofing.
- **DNSSEC**: DNS Security Extensions, a suite of specifications to ensure DNS
  data integrity and authenticity.
- **EDNS Padding**: A method to pad DNS packets to avoid leaking the size of DNS
  queries and responses, enhancing privacy.
- **Filters**: Indicates if the DNS provider offers content filtering options
  such as blocking malware, ads, or adult content.

{{% /alert %}}

<br />

### Quad9

| **Name**                    | Quad9                                             |
| --------------------------- | ------------------------------------------------- |
| **Description**             | Non-profit, free security and privacy-focused DNS |
| **Privacy Policy**          | [Quad9](https://www.quad9.net/privacy/policy/)    |
| **IPv4 Addresses**          | `9.9.9.9`, `149.112.112.112`                      |
| **IPv6 Addresses**          | `2620:fe::fe`, `2620:fe::9`                       |
| **DNS over UDP/TCP (Do53)** | Yes                                               |
| **DNS over HTTPS (DoH)**    | `https://dns.quad9.net/dns-query`                 |
| **DNS over TLS (DoT)**      | `tls://dns.opendns.com`                           |
| **DNS over QUIC (DoQ)**     | Not supported                                     |
| **DNSCrypt**                | Yes                                               |
| **DNSSEC**                  | Yes                                               |
| **EDNS Padding**            | Yes                                               |
| **Filters**                 | Malware, Phishing                                 |
| **Remarks**                 | Focused on blocking malicious domains             |

<br />

### AdGuard DNS

| **Name**                    | AdGuard DNS                                        |
| --------------------------- | -------------------------------------------------- |
| **Description**             | DNS service focused on blocking ads and trackers   |
| **Privacy Policy**          | [AdGuard DNS](https://adguard.com/en/privacy.html) |
| **IPv4 Addresses**          | `94.140.14.14`, `94.140.15.15`                     |
| **IPv6 Addresses**          | `2a10:50c0::ad1:ff`, `2a10:50c0::ad2:ff`           |
| **DNS over UDP/TCP (Do53)** | Yes                                                |
| **DNS over HTTPS (DoH)**    | `https://dns.adguard-dns.com/dns-query`            |
| **DNS over TLS (DoT)**      | `tls://dns.adguard-dns.com`                        |
| **DNS over QUIC (DoQ)**     | `quic://dns.adguard-dns.com`                       |
| **DNSCrypt**                | No                                                 |
| **DNSSEC**                  | Yes                                                |
| **EDNS Padding**            | Yes                                                |
| **Filters**                 | Ad blocking, Tracking                              |
| **Remarks**                 | Ideal for ad and tracker blocking                  |

<br />

### Cloudflare

| **Name**                    | Cloudflare                                              |
| --------------------------- | ------------------------------------------------------- |
| **Description**             | Fast, privacy-first DNS resolver                        |
| **Privacy Policy**          | [Cloudflare](https://www.cloudflare.com/privacypolicy/) |
| **IPv4 Addresses**          | `1.1.1.1`, `1.0.0.1`                                    |
| **IPv6 Addresses**          | `2606:4700:4700::1111`, `2606:4700:4700::1001`          |
| **DNS over UDP/TCP (Do53)** | Yes                                                     |
| **DNS over HTTPS (DoH)**    | `https://dns.cloudflare.com/dns-query`                  |
| **DNS over TLS (DoT)**      | `tls://1dot1dot1dot1.cloudflare-dns.com`                |
| **DNS over QUIC (DoQ)**     | Not supported                                           |
| **DNSCrypt**                | No                                                      |
| **DNSSEC**                  | Yes                                                     |
| **EDNS Padding**            | Yes                                                     |
| **Filters**                 | Malware, Adult Content                                  |
| **Remarks**                 | Known for speed and privacy                             |

<br />

### Google Public DNS

| **Name**                    | Google Public DNS                                        |
| --------------------------- | -------------------------------------------------------- |
| **Description**             | Free, global DNS resolution service                      |
| **Privacy Policy**          | [Google Public DNS](https://policies.google.com/privacy) |
| **IPv4 Addresses**          | `8.8.8.8`, `8.8.4.4`                                     |
| **IPv6 Addresses**          | `2001:4860:4860::8888`, `2001:4860:4860::8844`           |
| **DNS over UDP/TCP (Do53)** | Yes                                                      |
| **DNS over HTTPS (DoH)**    | `https://dns.google/dns-query`                           |
| **DNS over TLS (DoT)**      | `tls://dns.google`                                       |
| **DNS over QUIC (DoQ)**     | Not supported                                            |
| **DNSCrypt**                | No                                                       |
| **DNSSEC**                  | Yes                                                      |
| **EDNS Padding**            | Yes                                                      |
| **Filters**                 | No                                                       |
| **Remarks**                 | Fast, reliable, no filters                               |

<br />

### Cisco OpenDNS

| **Name**                    | OpenDNS                                                                |
| --------------------------- | ---------------------------------------------------------------------- |
| **Description**             | DNS service with customizable security and filtering options           |
| **Privacy Policy**          | [OpenDNS](https://www.cisco.com/c/en/us/about/legal/privacy-full.html) |
| **IPv4 Addresses**          | `208.67.222.222`, `208.67.220.220`                                     |
| **IPv6 Addresses**          | `2620:119:35::35`, `2620:119:53::53`                                   |
| **DNS over UDP/TCP (Do53)** | Yes                                                                    |
| **DNS over HTTPS (DoH)**    | `https://doh.opendns.com/dns-query`                                    |
| **DNS over TLS (DoT)**      | `doh.opendns.com`                                                      |
| **DNS over QUIC (DoQ)**     | Not supported                                                          |
| **DNSCrypt**                | No                                                                     |
| **DNSSEC**                  | Yes                                                                    |
| **EDNS Padding**            | No                                                                     |
| **Filters**                 | Malware, Phishing, Custom                                              |
| **Remarks**                 | Great for families and small businesses                                |

<br />

## Common DNS Tools

### dig

A network administration command-line tool for querying DNS name servers.

```bash
dig example.com
dig +short example.com
dig example.com MX
dig -x 192.168.1.1
```

<br />

### nslookup

A network administration command-line tool for querying DNS to obtain domain
name or IP address mapping.

```bash
nslookup example.com
nslookup -type=MX example.com
nslookup 192.168.1.1
```

<br />

### host

A simple utility for performing DNS lookups.

```bash
host example.com
host -t MX example.com
host 192.168.1.1
```

<br />

## Advanced DNS Concepts

- **DNSSEC (DNS Security Extensions)**: Enhances security by adding
  cryptographic signatures to DNS data.
- **Anycast Routing**: A network addressing and routing methodology in which a
  single destination address has multiple routing paths.
- **Split-Horizon DNS**: Provides different DNS responses based on the source of
  the DNS query, often used for internal vs. external users.

<br />

## DNS Best Practices

1. **Regular Updates**: Ensure your DNS records are up-to-date and accurate.
2. **Use DNSSEC**: Implement DNSSEC to protect against DNS spoofing and cache
   poisoning.
3. **Monitor TTL Values**: Set appropriate TTL values to balance between speed
   and freshness of DNS data.
4. **Implement Redundancy**: Use multiple DNS servers to ensure reliability and
   availability.
5. **Regular Audits**: Conduct periodic DNS audits to detect and rectify
   configuration errors.

<br />

## Troubleshooting DNS Issues

1. **Check Local DNS Cache**: Clear your DNS cache to resolve any local caching
   issues.

   On Linux

   ```bash
   sudo systemd-resolve --flush-caches
   ```

   On Windows

   ```bash
   ipconfig /flushdns
   ```

   On macOS (Monterey, Big Sur and Catalina)

   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

   On macOS (Mojave, High Sierra and Sierra)

   ```bash
   sudo killall -HUP mDNSResponder
   ```

2. **Verify DNS Configuration**: Use tools like `dig`, `nslookup`, or `host` to
   verify DNS records.
3. **Check Network Connectivity**: Ensure you have a stable network connection.
4. **Review DNS Server Logs**: Examine logs on your DNS servers for any error
   messages or unusual activity.
5. **Consult ISP**: If issues persist, contact your Internet Service Provider
   for assistance.

<br />

## Conclusion

Understanding DNS is crucial for anyone involved in network administration or
web development. This cheat sheet provides a comprehensive overview of the
essential aspects of DNS, from basic concepts to advanced configurations and
troubleshooting. Use it as a reference to ensure your DNS setup is optimized and
secure.
