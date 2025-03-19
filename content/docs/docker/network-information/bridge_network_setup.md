---
title: "Bridge Network Setup"
description:
  "This guide explains how to set up a Docker network of type `bridge`, offering
  a customizable environment for container communication. It covers network
  configuration, IP address management, and driver options for enhanced control
  and security within isolated environments."
url: "docker/network-info/bridge-network-setup"
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
  - Container Networking
  - IPAM
keywords:
  - Docker bridge network
  - Docker network setup
  - Docker networking configuration
  - IPAM
  - container communication

weight: 4200

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

## Introduction

Setting up a Docker network of type `bridge` enables you to create an isolated
environment where containers can communicate with each other while maintaining
flexibility in configuration and security. This guide walks you through the
process of creating and managing a `bridge` network, highlighting key
configuration options such as IP address management, driver settings, and
network control. Whether you're configuring an internal network for
containerized applications or allowing controlled external communication, this
setup provides a customizable and secure networking environment tailored to your
specific needs.

Use the following YAML configuration to create a Docker network of type `bridge`:

```yml
---
networks:
  change_me:
    attachable: false # Containers cannot connect to this network manually.
    internal: false # Allows traffic to and from the internet.
    external: false # The network is not externally managed.
    name: change_me # The name of the network.
    driver: bridge # Use the bridge driver for networking.
    ipam: # IP Address Management settings.
      driver: default # Use the default IPAM driver.
      config:
        - subnet: 172.20.0.0/24 # Network's subnet.
          ip_range: 172.20.0.128/25 # Range of available IP addresses.
          gateway: 172.20.0.1 # Gateway IP address.
    driver_opts: # Network driver configuration options.
      com.docker.network.bridge.default_bridge: "false" # Disable default bridge network.
      com.docker.network.bridge.enable_icc: "true" # Enable inter-container communication (ICC).
      com.docker.network.bridge.enable_ip_masquerade: "true" # Enable IP masquerading for internet access.
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0" # Allow connections from any IP address.
      com.docker.network.bridge.name: "change_me" # Custom bridge network name.
      com.docker.network.driver.mtu: "1500" # Maximum Transmission Unit for the network.
    labels: # Network label for description.
      com.change_me.network.description:
        "An isolated bridge network for internal communication."
```

<br />

## Description of the Options

- **`internal: false`**: Allows traffic to and from the internet.

  - **Example**: `internal: false` enables external communication, allowing
    containers to access the internet. Setting it to `true` restricts containers
    to internal communication only, useful for isolated applications that do not
    need external access.

- **`name: change_me`**: The name of the network.

  - **Example**: `name: change_me` specifies the network's name, which Docker
    uses to identify it.

- **`driver: bridge`**: Specifies the use of the `bridge` network driver.

  - **Example**: `driver: bridge` tells Docker to use the `bridge` driver to
    manage the network.

- **`ipam`**: IPAM (IP Address Management) settings for the network.

  - **Example**:
    ```yml
    ipam:
      driver: default
      config:
        - subnet: 172.20.0.0/24
          ip_range: 172.20.0.128/25
          gateway: 172.20.0.1
    ```
    This section defines the network's subnet, IP range, and gateway.

- **`driver_opts`**: Options for configuring the network driver.

  - **Example**:
    ```yml
    driver_opts:
      com.docker.network.bridge.default_bridge: "false" # Disables the default bridge network.
      com.docker.network.bridge.enable_icc: "true" # Enables inter-container communication (ICC).
      com.docker.network.bridge.enable_ip_masquerade: "true" # Enables IP masquerading, allowing containers to access the external network.
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0" # Allows connections to the host from any IP address.
      com.docker.network.bridge.name: "change_me" # Specifies the custom bridge network name.
      com.docker.network.driver.mtu: "1500" # Sets the maximum transmission unit for the network.
    ```
    This includes options like disabling the default bridge, enabling
    inter-container communication (ICC), and configuring IP masquerading.

- **`labels`**: Adds labels for the network.
  - **Example**:
    `com.change_me.network.description: "An isolated bridge network for internal communication."`
    adds a description label for the network. This label can be used for
    identifying the network or for documentation purposes.

<br />

## Applications and Considerations

- **Bridge Network**: The `bridge` network is a default Docker network that
  allows containers to communicate with each other via virtual Ethernet
  interfaces. It is ideal for cases where you need an isolated network for
  containers but still want them to have the ability to communicate with each
  other.

- **Limitations**: The `bridge` network is isolated, meaning containers within
  the same network can communicate with each other, but they cannot access other
  networks unless explicitly configured. This isolation ensures that containers
  are not exposed to external networks by default.

- **Network Security**: By setting `internal: false`, containers can communicate
  with the external network, which is crucial for containers needing internet
  access. However, users should be mindful of security when allowing external
  communication. For enhanced security, consider using firewalls or additional
  network isolation measures to protect sensitive applications.

<br />

## Conclusion

Using a `bridge` network in Docker provides an easy way to connect containers
within an isolated network. You have the flexibility to grant internet access as
required, while maintaining control over the network's configuration through
options like IP address management and driver settings.
