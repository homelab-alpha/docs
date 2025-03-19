---
title: "Building a Robust 2-Tier Network Infrastructure with UniFi"
description: "Explore how to design a scalable and efficient 2-tier network using
  Ubiquiti's UniFi equipment. This guide covers the essentials of combining Core
  and Distribution layers while maintaining a separate Access layer for small to
  medium-sized networks."
url:
  "back-to-basics/network/building-a-robust-2-tier-network-infrastructure
  with-unifi"
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
  - UniFi
  - Network Design
  - 2-Tier Architecture
  - Network Infrastructure
  - Homelab Setup
keywords:
  - 2-tier network design
  - UniFi network infrastructure
  - Core-Distribution layer
  - Access layer design
  - Ubiquiti UniFi equipment

weight: 2700

toc: true
katex: true
---

<br />

A 2-tier network architecture simplifies network design by combining the Core
and Distribution layers into a single layer while keeping the Access layer
separate. This approach is suitable for small to medium-sized networks, offering
a balance between performance, scalability, and manageability. This guide will
help you design a 2-tier network using Ubiquiti's UniFi equipment.

<br />

## Core-Distribution Layer

### Purpose

The Core-Distribution Layer merges the functions of the traditional Core and
Distribution layers, providing high-speed and reliable connectivity, policy
enforcement, and routing between different segments of the network.

<br />

### Key Features

- **High Speed**: Utilizes high-speed switches.
- **High Availability**: Incorporates redundancy and fault tolerance.
- **Policy Enforcement**: Implements access control lists (ACLs) and quality of
  service (QoS).
- **Scalability**: Capable of handling increased traffic loads and future
  growth.

<br />

### Design Considerations

- **Redundancy**: Use redundant hardware and links to avoid single points of
  failure.
- **High Bandwidth**: Employ high-capacity links, such as 10 Gbps or higher.
- **Routing and Switching**: Implement robust routing and switching protocols.
- **Security**: Enforce security policies and VLAN segmentation.

<br />

### Example Configuration

```yaml
core_distribution_layer:
  devices:
    - type: core_distribution_switch
      model: UniFi Switch Aggregation (USW-Aggregation)
      interfaces:
        - type: fiber_optic
          speed: 10Gbps
          redundancy: yes
    - type: core_distribution_router
      model: UniFi Dream Machine Pro Max (UDM-Pro-Max)
      protocols:
        - OSPF
        - BGP
      features:
        - ACLs
        - QoS
        - VLAN segmentation
```

<br />

#### Specifications

**UniFi Switch Aggregation (USW-Aggregation)**

- **Interfaces**: 8x 10G SFP+ ports
- **Performance**: 160 Gbps switching capacity, 80 Gbps non-blocking throughput
- [More details](https://techspecs.ui.com/unifi/switching/usw-aggregation)

**UniFi Dream Machine Pro Max (UDM-Pro-Max)**

- **Interfaces**: 8x 2.5G RJ45 ports, 1x 10G SFP+ WAN port, 2x 10G SFP+ LAN
  ports
- **Features**: Integrated security gateway, high-performance router, network
  video recorder, and Wi-Fi controller
- [More details](https://techspecs.ui.com/unifi/unifi-cloud-gateways/udm-pro-max)

<br />

## Access Layer

### Purpose

The Access Layer is the edge of the network where end devices such as computers,
printers, and IoT devices connect. It provides the first level of security and
control.

<br />

### Key Features

- **Device Connectivity**: Connects end user devices to the network.
- **Port Security**: Controls device access and ensures network security.
- **Power over Ethernet (PoE)**: Powers devices like IP phones and wireless
  access points.
- **Scalability**: Supports a large number of connected devices.

<br />

### Design Considerations

- **Port Density**: Ensure sufficient ports to support all end devices.
- **Security**: Implement port security and authentication protocols (e.g.,
  802.1X).
- **PoE**: Utilize PoE for devices requiring power through Ethernet.
- **Manageability**: Use managed switches for better control and monitoring.

<br />

### Example Configuration

```yaml
access_layer:
  devices:
    - type: access_switch
      model: UniFi Switch Pro 24 PoE (USW-Pro-24-POE, 400W)
      interfaces:
        - type: copper
          speed: 1Gbps
          PoE: yes
          port_security: 802.1X
      features:
        - port_security
        - VLAN support
        - PoE
    - type: wireless_access_point
      model: UniFi U7 Pro (U7-Pro)
      connectivity:
        - type: Wi-Fi
          speed: 2Gbps
          PoE: yes
```

<br />

#### Specifications

**UniFi Switch Pro 24 PoE (USW-Pro-24-POE, 400W)**

- **Interfaces**: 24x RJ45 Gigabit Ethernet ports, 2x 10G SFP+ uplink ports
- **PoE**: 24x PoE+ (802.3at) ports, 400W total PoE budget
- [More details](https://techspecs.ui.com/unifi/switching/usw-pro-48-poe)

**UniFi U7 Pro (U7-Pro)**

- **Interfaces**: 1x 2.5GbE RJ45 port
- **Wi-Fi Standards**: 802.11a/b/g/n/ac/ax/be (Wi-Fi 6/6E, Wi-Fi 7)
- **Power Method**: PoE+
- **Throughput Rates**: Up to 2.4 Gbps on 6 GHz, up to 4.3 Gbps on 5 GHz, up to
  688 Mbps on 2.4 GHz
- [More details](https://techspecs.ui.com/unifi/Wi-Fi/u7-pro)

<br />

## Best Practices for 2-Tier Network Design

1. **Redundancy and High Availability**: Ensure that each layer has redundancy
   to prevent any single point of failure. Use technologies like link
   aggregation, redundant power supplies, and dual-homed devices.

2. **Scalability**: Design your network with future growth in mind. Ensure that
   each layer can be expanded without significant redesign.

3. **Security**: Implement robust security measures at each layer. Use
   firewalls, intrusion detection/prevention systems (IDS/IPS), and network
   access control (NAC) to protect your network.

4. **Performance**: Use high-performance switches and routers to minimize
   latency and ensure fast data processing. Optimize routing protocols and use
   QoS to prioritize critical traffic.

5. **Management and Monitoring**: Implement comprehensive network management and
   monitoring tools to oversee the network’s health and performance. Use the
   UniFi Controller for centralized management and logging for proactive issue
   resolution.

6. **Documentation**: Keep detailed documentation of your network design,
   including device configurations, IP address schemes, and network diagrams.
   This will be invaluable for troubleshooting and future upgrades.

<br />

## Conclusion

Designing a 2-tier network infrastructure using UniFi equipment involves careful
planning and consideration of each layer's unique requirements. By following the
guidelines and best practices outlined in this guide, you can create a network
that is robust, scalable, and secure, ensuring smooth and efficient operations
for your organization.
