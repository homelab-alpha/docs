---
title: "Choosing a Network Driver"
description:
  "This guide compares the Docker bridge, ipvlan, and macvlan network drivers,
  helps you choose one, and explains when to define a network in Compose or with
  the CLI, with common troubleshooting steps."
url: "docker/network-info/choosing-a-network-driver"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Docker
series:
  - Docker Network
tags:
  - Docker
  - Network
  - Bridge
  - IPvlan
  - Macvlan
  - Container Networking
keywords:
  - Docker network drivers
  - bridge vs macvlan
  - ipvlan vs macvlan
  - Docker networking
  - container networking

weight: 4202

toc: true
katex: true
---

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

Docker offers several network drivers. This guide compares the three that the
stacks in the [docker repository](https://github.com/homelab-alpha/docker) use
or support, and helps you pick one. Each driver has its own guide with Compose
and CLI examples:

- [Bridge network setup](/docker/network-info/bridge-network-setup/)
- [IPvlan network setup](/docker/network-info/ipvlan-network-setup/)
- [Macvlan network setup](/docker/network-info/macvlan-network-setup/)

## Comparison

| Property                      | `bridge`                       | `ipvlan`                           | `macvlan`                             |
| :---------------------------- | :----------------------------- | :--------------------------------- | :------------------------------------ |
| IP address of the container   | Private subnet on the host     | Address in your LAN (L2) or routed | Address in your LAN                   |
| Reachable from the LAN        | Only through published ports   | Yes, on its own IP address         | Yes, on its own IP address            |
| MAC address                   | Per container, behind the host | Shares the MAC of the parent       | Own MAC per container                 |
| Host ↔ container              | Works                          | Blocked by Linux, needs a shim     | Blocked by Linux, needs a shim        |
| Container ↔ container by name | Yes, on a user-defined network | Yes, on the same network           | Yes, on the same network              |
| Requirements                  | None                           | Linux kernel 4.2 or later          | Switch and NIC that accept many MACs  |
| Typical use                   | Almost every stack             | LAN IPs where MACs are limited     | Apps that need their own LAN identity |

## Which One to Use

- **Use `bridge`** by default. Every stack in `compose-files/` uses its own
  user-defined bridge network. The containers are isolated from other stacks,
  and you reach them through the published ports of the host.
- **Use `ipvlan`** when a container needs its own IP address in your LAN, but
  your switch, Wi-Fi access point, or virtualization host limits the number of
  MAC addresses per port. All containers share the MAC address of the host.
- **Use `macvlan`** when a container must look like a separate device on your
  LAN, with its own MAC address. Examples are a DHCP server, a DNS server that
  your router must see as a separate host, or an app that discovers devices with
  broadcasts.

{{% alert context="info" %}}
With `ipvlan` and `macvlan`, the containers bypass the port publishing of
Docker. A service is reachable on every port it listens on, at the IP address of
the container. Use a firewall on the container or on your network if you need to
restrict access.
{{% /alert %}}

## Define the Network in Compose or with the CLI

There are two ways to create a network, and both work for every driver:

- **In `compose.yml`**: the `networks:` section of the stack defines the
  network. Docker Compose creates it on `docker compose up` and removes it on
  `docker compose down`. The stacks in the docker repository use this way.
- **With `docker network create`**: you create the network once, outside a
  stack. A stack then joins it with `external: true`. Use this way when several
  stacks share one network, or for `ipvlan` and `macvlan` networks, so that a
  `docker compose down` does not remove the network of your LAN.

## Troubleshooting

These checks apply to every driver:

| Problem                                                       | Check                                                                                         |
| :------------------------------------------------------------ | :-------------------------------------------------------------------------------------------- |
| `Pool overlaps with other one on this address space`          | Another network uses the subnet. Run `docker network ls` and `docker network inspect <name>`. |
| `network <name> declared as external, but could not be found` | Create the network first with `docker network create`.                                        |
| The container gets an unexpected IP address                   | Check `ip_range` and `ipv4_address`; the address must be inside the subnet.                   |
| Containers cannot reach each other by name                    | Use a user-defined network; the default `bridge` network has no name resolution.              |

Useful commands:

```bash
docker network ls                       # List all networks
docker network inspect <name>           # Show the subnet, the gateway, and the containers
docker inspect <container> --format '{{json .NetworkSettings.Networks}}'
```
