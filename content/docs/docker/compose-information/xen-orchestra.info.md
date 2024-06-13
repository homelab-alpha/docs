---
title: "xen-orchestra.info"
description:
  "Deploying Xen Orchestra, enabling efficient management of XCP-ng or XenServer
  infrastructure through Docker Compose. It covers network configurations,
  service settings, and security options to ensure smooth and secure operation."
url: "docker/compose-info/xen-orchestra"
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
  - Xen Orchestra
  - Docker Compose
  - Infrastructure Management
  - XCP-ng
  - XenServer
keywords:
  - Docker
  - Xen Orchestra
  - Docker Compose
  - Container Management
  - Docker Network
  - Xen Orchestra Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Xen Orchestra Service
  - XCP-ng Management
  - XenServer Management

weight: 2100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `docker-compose.yml` file does in detail. This file
is used to configure and deploy a service using Docker Compose, specifically
setting up Xen Orchestra for managing XCP-ng or XenServer infrastructure.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 13, 2024
- **Version**: 3.9
- **Description**: This file configures a custom Docker network and a Xen
  Orchestra service. It includes detailed network settings and service
  configurations to ensure Xen Orchestra runs smoothly and securely.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Detailed Explanation

### Networks Configuration

```yaml
networks:
  xen-orchestra_net:
    internal: false
    external: false
    name: xen-orchestra
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.8.0/24
          ip_range: 172.20.8.0/24
          gateway: 172.20.8.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "xen-orchestra"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.xen-orchestra.network.description: "is an isolated bridge network."
```

- **networks**: This section defines a custom network named `xen-orchestra_net`.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is not externally defined but created within
  this `docker-compose` file.
- **name: xen-orchestra**: Specifies the name of the network.
- **driver: bridge**: Uses the bridge driver to create an isolated network.
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
  - **com.docker.network.bridge.name: "xen-orchestra"**: Names the bridge
    network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.xen-orchestra.network.description**: A description label for the
    network.

<br />

### Services Configuration

```yaml
services:
  xen-orchestra_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    container_name: xen-orchestra
    image: ronivay/xen-orchestra:latest
    pull_policy: if_not_present
    volumes:
      # - /docker/xen-orchestra/production/.cert/client-cert.pem:/client-cert.pem
      # - /docker/xen-orchestra/production/.cert/client-key.pem:/client-key.pem
      # - /docker/xen-orchestra/production/.cert/ca-cert.pem:/ca-cert.pem
      - /docker/xen-orchestra/production/app:/var/lib/xo-server
      - /docker/xen-orchestra/production/redis:/var/lib/redis
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      HTTP_PORT: 80
      HTTPS_PORT: 443
      REDIRECT_TO_HTTPS: false
      # CERT_PATH: "/docker/xen-orchestra/production/.cert/client-cert.pem"
      # KEY_PATH: "/docker/xen-orchestra/production/.cert/client-key.pem"
    domainname: xo.local # Customize this with your own domain, e.g., `xo.local` to `xo.your-fqdn-here.com`.
    hostname: xo
    networks:
      xen-orchestra_net:
        ipv4_address: 172.20.8.2
    ports:
      - "3006:80/tcp" # HTTP
      - "3006:80/udp" # HTTP
      # - "3007:443/tcp" # HTTPS
      # - "3007:443/udp" # HTTPS
    devices:
      - "/dev/fuse:/dev/fuse"
      - "/dev/loop-control:/dev/loop-control"
      - "/dev/loop0:/dev/loop0"
    security_opt:
      - no-new-privileges:true
      - apparmor:unconfined
    cap_add:
      - SYS_ADMIN
      - DAC_READ_SEARCH
    labels:
      com.docker.compose.project: "xen-orchestra"
      com.xen-orchestra.description:
        "is a complete solution to visualize, manage, backup and delegate your
        XCP-ng or XenServer infrastructure."
    healthcheck:
      disable: true
```

- **services**: Defines services to be deployed.
- **xen-orchestra_app**: The service name for the Xen Orchestra container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **container_name: xen-orchestra**: Names the container "xen-orchestra".
  - **image: ronivay/xen-orchestra:latest**: Uses the latest Xen Orchestra image
    from Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/xen-orchestra/production/app:/var/lib/xo-server**: Mounts the
      app directory.
    - **/docker/xen-orchestra/production/redis:/var/lib/redis**: Mounts the
      Redis directory.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **HTTP_PORT: 80**: Sets the HTTP port.
    - **HTTPS_PORT: 443**: Sets the HTTPS port.
    - **REDIRECT_TO_HTTPS: false**: Disables redirection to HTTPS.
  - **domainname: xo.local**: Sets the domain name for the container.
  - **hostname: xo**: Sets the hostname for the container.
  - **networks**: Connects the service to the `xen-orchestra_net` network.
    - **ipv4_address: 172.20.8.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **3006:80/tcp**: Maps HTTP port 80 to host port 3006.
    - **3006:80/udp**: Maps HTTP port 80 to host port 3006 (UDP).
    - **3007:443/tcp**: Maps HTTPS port 443 to host port 3007 (commented out).
    - **3007:443/udp**: Maps HTTPS port 443 to host port 3007 (UDP, commented
      out).
  - **devices**: Passes host devices to the container.
    - **/dev/fuse:/dev/fuse**: Mounts the fuse device.
    - **/dev/loop-control:/dev/loop-control**: Mounts the loop control device.
    - **/dev/loop0:/dev/loop0**: Mounts the loop0 device.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
    - **apparmor:unconfined**: Disables AppArmor confinement.
  - **cap_add**: Adds Linux capabilities to the container.
    - **SYS_ADMIN**: Adds system administration capability.
    - **DAC_READ_SEARCH**: Adds capability to bypass file read permission
      checks.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "xen-orchestra"**: Project label.
    - **com.xen-orchestra.description**: Description label for Xen Orchestra.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Conclusion

This `docker-compose` file sets up a robust Docker environment for running Xen
Orchestra, a complete solution for managing XCP-ng or XenServer infrastructure.
It creates a custom bridge network with specific IP settings and security
configurations. The Xen Orchestra service is configured to manage and backup
your XCP-ng or XenServer infrastructure with persistent storage, network, and
security options. The configuration ensures that Xen Orchestra runs
continuously, restarts on failure, and logs efficiently.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/xen-orchestra/docker-compose.yml
