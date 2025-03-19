---
title: "VLAN Tagging: A Deeper Dive"
description:
  "VLAN Tagging is an essential technique for identifying and segregating
  network traffic within a VLAN. This detailed guide explores how VLAN tagging
  works, the types of tags used, and their practical applications in modern
  network management."
url: "back-to-basics/network/vlan-tagging"
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
  - VLAN
  - Network Segmentation
  - IEEE 802.1Q
  - Network Management
  - Trunk Ports
  - Access Ports
keywords:
  - VLAN Tagging
  - Network Traffic Segregation
  - Ethernet Frames
  - VLAN ID
  - IEEE 802.1Q Tagging
  - Inter-Switch Link (ISL)
  - Trunk Port Configuration
  - Access Port Configuration
  - Network Security
  - Network Performance
  - VoIP Traffic Management
  - Network Scalability

weight: 2700

toc: true
katex: true
---

<br />

## What is VLAN Tagging?

VLAN tagging is a process used to identify and segregate network traffic within
a VLAN. It involves adding a VLAN tag to Ethernet frames to indicate the VLAN
membership of each packet. This tagging allows network devices, such as switches
and routers, to direct traffic to the appropriate VLAN, maintaining the logical
separation of network segments.

<br />

## How VLAN Tagging Works

### Tagging at the Source

When a device (e.g., a computer, server, or VoIP phone) sends a data packet, it
gets tagged with a VLAN ID by the network interface or the switch it is
connected to. The tag contains a 12-bit VLAN ID field, which can represent up to
4096 unique VLANs (from 0 to 4095).

<br />

### Transmitting the Tagged Frame

The tagged frame is then transmitted over the network. Network switches and
routers read this VLAN tag and use it to determine the frame’s path. Switches
forward the frame only to ports that are members of the same VLAN, ensuring that
traffic stays within its designated VLAN.

<br />

### Processing by Intermediate Devices

As the frame traverses the network, intermediate switches and routers process
the VLAN tag to maintain the segregation of traffic. They do not modify the tag
but use it to enforce VLAN policies. If a frame needs to cross a network
boundary (e.g., between two VLANs), a router or Layer 3 switch handles the
routing process.

<br />

### Untagging at the Destination

When the frame reaches its final destination (either another device within the
same VLAN or an end device like a computer), the VLAN tag is removed before
delivery. This untagging ensures that the receiving device processes the frame
as a standard Ethernet frame, unaware of the VLAN tag it carried across the
network.

<br />

## Types of VLAN Tags

### IEEE 802.1Q Tagging

The most common VLAN tagging standard is IEEE 802.1Q. It inserts a 4-byte tag
into the Ethernet frame header between the source MAC address and the
EtherType/Length fields.

The 802.1Q tag structure includes:

- **Tag Protocol Identifier (TPID):** A 2-byte field with a value of 0x8100,
  indicating that the frame is tagged.
- **Priority Code Point (PCP):** A 3-bit field used for Quality of Service (QoS)
  prioritization.
- **Drop Eligible Indicator (DEI):** A 1-bit field indicating if the frame can
  be dropped under congestion.
- **VLAN Identifier (VID):** A 12-bit field specifying the VLAN ID.

<br />

### ISL (Inter-Switch Link) Tagging

ISL is an older Cisco proprietary protocol that encapsulates the entire Ethernet
frame with a new header and trailer, which includes the VLAN ID. ISL is largely
obsolete and has been replaced by IEEE 802.1Q due to its standardization and
broader compatibility.

<br />

## Trunk Ports and Access Ports

### Trunk Ports

Trunk ports carry traffic for multiple VLANs between switches or between a
switch and a router. They use VLAN tags to distinguish between different VLANs
and ensure that traffic is correctly routed. Trunk ports typically use IEEE
802.1Q tagging.

<br />

### Access Ports

Access ports connect end devices (e.g., computers, printers) to the network and
carry traffic for a single VLAN. Frames arriving at an access port are untagged
because the device is not VLAN-aware. The switch assigns all incoming traffic to
the VLAN associated with that access port and tags outgoing traffic accordingly.

<br />

## VLAN Tagging in Practice

### Scenario 1: Multi-Department Network

Imagine a corporate network with different departments such as Finance, HR, and
IT. Each department has its own VLAN:

- **Finance VLAN (VLAN 10)**
- **HR VLAN (VLAN 20)**
- **IT VLAN (VLAN 30)**

A switch in this network would be configured with trunk ports connecting to
other switches and access ports connecting to department devices. VLAN tagging
ensures that packets from Finance devices only travel within VLAN 10, HR packets
within VLAN 20, and IT packets within VLAN 30, maintaining security and traffic
management.

<br />

### Scenario 2: VoIP and Data Traffic

In a business setting with VoIP phones, VLAN tagging can separate voice and data
traffic:

- **Data VLAN (VLAN 100)**
- **Voice VLAN (VLAN 200)**

This separation ensures high-quality voice communication by prioritizing VoIP
traffic and reducing interference from data traffic.

<br />

## Benefits of VLAN Tagging

1. **Enhanced Security:** By isolating traffic within VLANs, sensitive
   information is protected from unauthorized access.
2. **Improved Network Performance:** Reduces broadcast domains, minimizing
   unnecessary traffic and optimizing bandwidth usage.
3. **Simplified Network Management:** Logical grouping of devices makes it
   easier to manage and troubleshoot networks.
4. **Flexibility and Scalability:** Easily adjust VLAN configurations as the
   network grows or changes without physical reconfiguration.

<br />

## Conclusion

VLAN tagging is a fundamental aspect of modern network management, providing the
means to efficiently segment, secure, and manage traffic. By understanding how
VLAN tagging works and its practical applications, network administrators can
design robust and flexible network infrastructures.
