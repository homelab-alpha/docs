---
title: "IP Subnet Cheat Sheet"
description:
  "Your ultimate guide for mastering IP subnetting, including IP address
  classes, subnet masks, CIDR notation, and practical subnetting calculations."
url: "back-to-basics/network/ip-subnet-cheat-sheet"
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
  - IP subnet
  - subnetting
  - CIDR
  - subnet masks
keywords:
  - IP address classes
  - CIDR notation
  - subnetting calculations
  - network administration

weight: 106000

toc: true
katex: true
---

<br />

## Basic Concepts

### IP Address Classes

IP addresses are divided into different classes based on their leading bits.
Here’s a quick overview:

- **Class A**: `1.0.0.0` to `126.0.0.0`

  - Default Subnet Mask: `255.0.0.0` (`/8`)
  - Number of Networks: 128 (2^7)
  - Hosts per Network: 16,777,214

  <br />

- **Class B**: `128.0.0.0` to `191.255.0.0`

  - Default Subnet Mask: `255.255.0.0` (`/16`)
  - Number of Networks: 16,384 (2^14)
  - Hosts per Network: 65,534

  <br />

- **Class C**: `192.0.0.0` to `223.255.255.0`

  - Default Subnet Mask: `255.255.255.0` (`/24`)
  - Number of Networks: 2,097,152 (2^21)
  - Hosts per Network: 254

<br />

### Private IP Address Ranges

Private IP addresses are used within a network and are not routable on the
internet. Here are the ranges:

- **Class A**: `10.0.0.0` to `10.255.255.255`
- **Class B**: `172.16.0.0` to `172.31.255.255`
- **Class C**: `192.168.0.0` to `192.168.255.255`

<br />

## Subnet Masks and CIDR Notation

Subnet masks define the network and host portions of an IP address. CIDR
(Classless Inter-Domain Routing) notation specifies the subnet mask in a compact
form.

| CIDR Notation | Subnet Mask     | Usable Hosts | Subnet Increment |
| ------------- | --------------- | ------------ | ---------------- |
| /8            | 255.0.0.0       | 16,777,214   | 16,777,216       |
| /9            | 255.128.0.0     | 8,388,606    | 8,388,608        |
| /10           | 255.192.0.0     | 4,194,302    | 4,194,304        |
| /11           | 255.224.0.0     | 2,097,150    | 2,097,152        |
| /12           | 255.240.0.0     | 1,048,574    | 1,048,576        |
| /13           | 255.248.0.0     | 524,286      | 524,288          |
| /14           | 255.252.0.0     | 262,142      | 262,144          |
| /15           | 255.254.0.0     | 131,070      | 131,072          |
| /16           | 255.255.0.0     | 65,534       | 65,536           |
| /17           | 255.255.128.0   | 32,766       | 32,768           |
| /18           | 255.255.192.0   | 16,382       | 16,384           |
| /19           | 255.255.224.0   | 8,190        | 8,192            |
| /20           | 255.255.240.0   | 4,094        | 4,096            |
| /21           | 255.255.248.0   | 2,046        | 2,048            |
| /22           | 255.255.252.0   | 1,022        | 1,024            |
| /23           | 255.255.254.0   | 510          | 512              |
| /24           | 255.255.255.0   | 254          | 256              |
| /25           | 255.255.255.128 | 126          | 128              |
| /26           | 255.255.255.192 | 62           | 64               |
| /27           | 255.255.255.224 | 30           | 32               |
| /28           | 255.255.255.240 | 14           | 16               |
| /29           | 255.255.255.248 | 6            | 8                |
| /30           | 255.255.255.252 | 2            | 4                |

<br />

## Quick Reference for Common Subnets

### Class A Subnetting

| Subnet Mask   | CIDR | Usable Hosts | Notes         |
| ------------- | ---- | ------------ | ------------- |
| 255.0.0.0     | /8   | 16,777,214   | Default       |
| 255.240.0.0   | /12  | 1,048,574    |               |
| 255.255.0.0   | /16  | 65,534       | Commonly used |
| 255.255.255.0 | /24  | 254          |               |

<br />

### Class B Subnetting

| Subnet Mask     | CIDR | Usable Hosts | Notes         |
| --------------- | ---- | ------------ | ------------- |
| 255.255.0.0     | /16  | 65,534       | Default       |
| 255.255.240.0   | /20  | 4,094        |               |
| 255.255.255.0   | /24  | 254          | Commonly used |
| 255.255.255.240 | /28  | 14           |               |

<br />

### Class C Subnetting

| Subnet Mask     | CIDR | Usable Hosts | Notes                |
| --------------- | ---- | ------------ | -------------------- |
| 255.255.255.0   | /24  | 254          | Default              |
| 255.255.255.128 | /25  | 126          |                      |
| 255.255.255.192 | /26  | 62           |                      |
| 255.255.255.224 | /27  | 30           |                      |
| 255.255.255.240 | /28  | 14           |                      |
| 255.255.255.248 | /29  | 6            |                      |
| 255.255.255.252 | /30  | 2            | Point-to-point links |

<br />

## Special IP Address Ranges

IP address ranges have specific purposes, from local communication to testing
and future use. Here's a detailed look at these special IP address ranges,
presented in a more visual and structured format.

<br />

### Reserved and Private Ranges

| **IP Range**     | **Description** | **Notes**                                                         |
| ---------------- | --------------- | ----------------------------------------------------------------- |
| `0.0.0.0/8`      | "This" Network  | Reserved, used for routing and initialization.                    |
| `10.0.0.0/8`     | Private Network | Commonly used for internal communications in private networks.    |
| `127.0.0.0/8`    | Loopback        | Used for localhost (127.0.0.1), testing network software locally. |
| `169.254.0.0/16` | Link-local      | Used for Automatic Private IP Addressing (APIPA).                 |
| `172.16.0.0/12`  | Private Network | Used for local communications within a private network.           |
| `192.168.0.0/16` | Private Network | Widely used in home networks and small businesses.                |

<br />

### Documentation and Testing

| **IP Range**      | **Description** | **Notes**                                |
| ----------------- | --------------- | ---------------------------------------- |
| `192.0.2.0/24`    | TEST-NET-1      | Reserved for documentation and examples. |
| `198.51.100.0/24` | TEST-NET-2      | Reserved for documentation and examples. |
| `203.0.113.0/24`  | TEST-NET-3      | Reserved for documentation and examples. |

<br />

### Specialized Purposes

| **IP Range**      | **Description**                          | **Notes**                                                     |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------- |
| `192.88.99.0/24`  | IPv6 to IPv4 relay                       | Used for 6to4 relay, aiding the transition from IPv4 to IPv6. |
| `198.18.0.0/15`   | Network Interconnect Device Benchmarking | Reserved for benchmarking network interconnect devices.       |
| `224.0.0.0/4`     | Multicast                                | Reserved for multicast traffic.                               |
| `240.0.0.0/4`     | Reserved for Future Use                  | Experimental, reserved for future protocols or applications.  |
| `255.255.255.255` | Broadcast                                | Limited broadcast to all hosts on the local network.          |

<br />

## Visual Explanation and Practical Examples

### APIPA (Automatic Private IP Addressing)

- **Range**: `169.254.0.0/16`
- **Usage**: When a device can't obtain an IP from DHCP, it auto-assigns an
  address within this range.
- **Example**: A device might use `169.254.45.1` to communicate locally.

```plaintext
+---------------------+
| Device A            |
| IP: 169.254.45.1    |
+---------------------+
         |
         | (Link-local communication)
         |
+---------------------+
| Device B            |
| IP: 169.254.45.2    |
+---------------------+
```

<br />

### Loopback Address

- **Range**: `127.0.0.0/8`
- **Usage**: Test network software without external network. Commonly used
  address: `127.0.0.1`.
- **Example**: Web developers testing a web server on their local machine.

```plaintext
+---------------------------+
| Local Machine             |
|                           |
| Test Web Server:          |
| http://127.0.0.1          |
+---------------------------+
```

<br />

### Private Network Addresses

| **Range**        | **Typical Usage**                                   |
| ---------------- | --------------------------------------------------- |
| `10.0.0.0/8`     | Large private networks (e.g., enterprise networks). |
| `172.16.0.0/12`  | Medium-sized private networks.                      |
| `192.168.0.0/16` | Small home and business networks.                   |

```plaintext
+----------------------------------------------+
| Home Router                                  |
|                                              |
| +-------------------+     +----------------+ |
| | Device A          |     | Device B       | |
| | IP: 192.168.1.2   |     | IP: 192.168.1.3| |
| +-------------------+     +----------------+ |
|                                              |
| Private Network: 192.168.1.0/24              |
+----------------------------------------------+
```

<br />

## Practical Usage of Special IP Ranges

### Broadcast Address (255.255.255.255)

- **Usage**: Send a message to all devices in the local network segment.
- **Example**: A DHCP request might be broadcast to `255.255.255.255`.

<br />

### Multicast Address (224.0.0.0/4)

- **Usage**: Stream data to multiple devices simultaneously.
- **Example**: Video conferencing tools often use multicast to distribute video
  streams.

<br />

## Common Calculations

### Determining Subnet Range

1. **Identify the subnet mask**.
2. **Calculate the block size**:
   `256 - the value in the subnet mask's relevant octet`.
3. **List subnet ranges** using the block size.

<br />

#### For example

For `192.168.1.0/26`:

1. **Subnet Mask**: `255.255.255.192`
2. **Block Size**: `256 - 192 = 64`
3. **Subnets**:
   - `192.168.1.0` - `192.168.1.63`
   - `192.168.1.64` - `192.168.1.127`
   - `192.168.1.128` - `192.168.1.191`
   - `192.168.1.192` - `192.168.1.255`

<br />

### Calculating Usable Hosts

- **Formula**: `2^n - 2`
  - `n` = number of host bits.
- Example for `/26`:
  - Host Bits: `32 - 26 = 6`
  - Usable Hosts: `2^6 - 2 = 62`

<br />

### Binary to Decimal Conversion

Understanding binary to decimal conversion is key in subnetting:

- Powers of 2: `2^0 = 1`, `2^1 = 2`, `2^2 = 4`, ..., `2^8 = 256`
- Example: Binary `11000000` equals decimal `192`.

<br />

### Subnetting Practice Exercises

1. **Determine the number of subnets and hosts per subnet** for a given CIDR.
2. **Practice converting binary to decimal and vice versa**.
3. **Calculate subnet ranges and broadcast addresses**.

<br />

## Quick Tips

- **Memorize Common Subnet Masks and CIDR Notations**.
- **Use Incremental Values** for easy subnet calculation.
- **Plan for Future Growth**: Allocate larger subnets than currently needed.
- **Document Your Subnetting Scheme**: Keep a record of your IP address
  allocations and network design.
- **Practice, Practice, Practice**: Regular practice with different scenarios
  will improve your subnetting skills.

<br />

## Conclusion

This cheat sheet serves as a quick reference to essential subnetting
information, equipping you with the knowledge needed to efficiently design and
manage IP networks. By familiarizing yourself with these special IP address
ranges, you can ensure proper allocation of IP addresses and avoid conflicts.

Understanding these ranges allows network administrators to:

- **Design Efficient Networks**: Plan and implement network segments that are
  both scalable and organized.
- **Avoid IP Conflicts**: Use reserved and private IP ranges correctly to
  prevent address overlap and connectivity issues.
- **Troubleshoot Effectively**: Quickly identify and resolve network issues by
  recognizing the significance of different IP ranges.
- **Plan for the Future**: Allocate IP addresses with foresight, considering
  potential network growth and changes.

With this cheat sheet at your disposal, you’ll be well-prepared to handle the
complexities of subnetting and IP address management. Happy subnetting!
