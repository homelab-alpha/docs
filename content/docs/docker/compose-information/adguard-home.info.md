---
title: "adguard-home.info"
description:
  "Deploy AdGuard Home, a network-wide software for blocking ads and tracking,
  using Docker Compose. This guide covers custom network settings, service
  configurations, and security measures for efficient operation."
url: "docker/compose-info/adguard-home"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Docker
series:
  - Docker Compose
tags:
  - Docker
  - AdGuard Home
  - Docker Compose
  - Container Management
  - Infrastructure Management
keywords:
  - Docker
  - AdGuard Home
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - Docker Containers
  - DNS Filtering
  - Self-hosted Docker Management

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `docker-compose.yml` file does in detail for
deploying AdGuard Home, a network-wide software for blocking ads and tracking,
with Docker Compose.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: Homelab-Alpha
- **Date**: Jun 16, 2025
- **Description**: Configures a Docker network and the AdGuard Home service for
  blocking ads and tracking across a network.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  adguard-home_net:
    attachable: false
    internal: false
    external: false
    name: adguard-home
    driver: host
    ipam:
      driver: default
      config:
        - subnet: 172.20.15.0/24
          ip_range: 172.20.15.0/24
          gateway: 172.20.15.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "adguard-home"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.adguard-home.network.description: "is an isolated bridge network."
```

<br />

- **networks**: This section defines a custom network named `adguard-home_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: adguard-home**: Specifies the name of the network.
- **driver: host**: Uses the host driver to create an isolated network.
- **ipam**: Configures IP address management for the network.
  - **driver: default**: Uses the default IPAM driver.
  - **config**: Sets up the IP address configuration.
    - **subnet**: Defines the subnet for the network.
    - **ip_range**: Restricts the IP range within the subnet.
    - **gateway**: Sets the gateway for the network.
- **driver_opts**: Additional options for the network driver.
  - **com.docker.network.bridge.default_bridge: "false"**: Indicates this is not
    the default Docker bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows outbound
    traffic to appear as if it came from the host.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds the bridge
    to all available IP addresses on the host.
  - **com.docker.network.bridge.name: "adguard-home"**: Names the bridge
    network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.adguard-home.network.description**: A description label for the
    network.

<br />

## Services Configuration

```yaml
services:
  adguard-home_app:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: adguard-home
    image: docker.io/adguard/adguardhome:latest
    pull_policy: if_not_present
    volumes:
      - /docker/adguard-home/production/app:/opt/adguard-home/work
      - /docker/adguard-home/production/app:/opt/adguard-home/conf
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
    domainname: adguard-home.local
    hostname: adguard-home
    networks:
      adguard-home_net:
        ipv4_address: 172.20.15.2
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "67:67/udp"
      - "68:68/udp"
      - "80:80/tcp"
      - "443:443/tcp"
      - "443:443/udp"
      - "784:784/udp"
      - "853:853/tcp"
      - "853:853/udp"
      - "3000:3000/tcp"
      - "5443:5443/tcp"
      - "5443:5443/udp"
      # - "6060:6060/tcp"
      - "8853:8853/udp"
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "adguard-home"
      com.adguard-home.description: "is a network-wide software for blocking ads and tracking."
    healthcheck:
      disable: true
```

<br />

- **services**: Defines services to be deployed.
- **adguard-home_app**: The service name for the AdGuard Home container.
  - **restart: always**: Ensures the container restarts automatically if it
    stops.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: adguard-home**: Names the container "adguard-home".
  - **image: docker.io/adguard/adguardhome:latest**: Uses the latest AdGuard Home image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/adguard-home/production/app:/opt/adguard-home/work**: Mounts the
      work directory.
    - **/docker/adguard-home/production/app:/opt/adguard-home/conf**: Mounts the
      configuration directory.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **domainname: adguard-home.local**: Sets the domain name for the container.
  - **hostname: adguard-home**: Sets the hostname for the container.
  - **networks**: Connects the service to the `adguard-home_net` network.
    - **ipv4_address: 172.20.15.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **53:53/tcp**: Maps the DNS port (TCP).
    - **53:53/udp**: Maps the DNS port (UDP).
    - **67:67/udp**: Maps the DHCP server port.
    - **68:68/udp**: Maps the client DHCP port.
    - **80:80/tcp**: Maps the HTTP port.
    - **443:443/tcp**: Maps the HTTPS port.
    - **853:853/tcp**: Maps DNS over TLS (TCP).
    - **3000:3000/tcp**: Maps the web admin port.
    - **5443:5443/tcp**: Maps the DNSCrypt port.
    - **8853:8853/udp**: Maps DNS over QUIC.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "adguard-home"**: Project label.
    - **com.adguard-home.description**: Description label for AdGuard Home.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables the health check.

<br />

## Conclusion

This `docker-compose.yml` file sets up a Docker environment for AdGuard Home, a
network-wide software for blocking ads and tracking. The configuration defines a
custom bridge network with specific IP settings and security configurations. The
AdGuard Home service is configured to run continuously, with persistent storage
for application data. The setup ensures AdGuard Home runs efficiently and
securely, with appropriate logging and restart policies, making it an excellent
tool for network-wide ad blocking.

[docker-compose.yml]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/adguard-home/docker-compose.yml
