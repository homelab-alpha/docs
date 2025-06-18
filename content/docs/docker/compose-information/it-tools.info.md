---
title: "it-tools.info"
description:
  "Deploy IT-Tools, a suite of useful online tools for developers, using Docker
  Compose. This guide includes custom network setup, service configuration,
  security options, and port mapping for seamless access and reliable operation."
url: "docker/compose-info/it-tools"
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
  - IT-Tools
  - Docker
  - Docker Compose
  - Developer Tools
  - DevOps
  - Networking
  - Containers
  - Productivity
keywords:
  - it-tools
  - docker-compose
  - developer tools
  - online tools
  - containerized apps
  - docker network
  - security options
  - devops tools
  - productivity tools
  - container deployment

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
deploying IT-Tools, a collection of handy online tools for developers, along
with its network and security configuration.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 18, 2025
- **Description**: Docker Compose setup for IT-Tools, a suite of developer-friendly
  online tools with network and security configurations.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
---
networks:
  it-tools_net:
    attachable: false
    internal: false
    external: false
    name: it-tools
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.22.0/24
          ip_range: 172.20.22.0/24
          gateway: 172.20.22.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "it-tools"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.it-tools.network.description: "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `it-tools_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: it-tools**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "it-tools"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.it-tools.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  it-tools_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: it-tools
    image: ghcr.io/corentinth/it-tools:latest
    pull_policy: if_not_present
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
    domainname: tools.local
    hostname: it-tools
    networks:
      it-tools_net:
        ipv4_address: 172.20.22.3
    ports:
      - "3014:80/tcp"
      - "3014:80/udp"
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "it-tools"
      com.it-tools.description: "A collection of handy online tools for developers, with great UX."
    healthcheck:
      disable: true
```

<br />

- **services**: Defines services to be deployed.
- **it-tools_app**: The service name for the it-tools container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: it-tools**: Names the container "it-tools".
  - **image: ghcr.io/corentinth/it-tools\:latest**: Uses the latest it-tools image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **domainname: tools.local**: Sets the domain name for the container.
  - **hostname: it-tools**: Sets the hostname for the container.
  - **networks**: Connects the service to the `it-tools_net` network.
    - **ipv4_address: 172.20.22.3**: Assigns a static IP address to the container.
  - **ports**: Maps container ports to host ports.
    - **3014:80/tcp**: Maps the HTTP port (TCP).
    - **3014:80/udp**: Maps the HTTP port (UDP).
  - **security_opt**: Security options for the container.
    - **no-new-privileges\:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "it-tools"**: Project label.
    - **com.it-tools.description**: Description label for it-tools.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Conclusion

This `docker-compose` file sets up a Docker environment for IT-Tools, a collection of useful online tools for developers. The configuration defines a custom bridge network with specific IP settings and security configurations. The `it-tools` service is configured to run continuously, with appropriate logging and restart policies, ensuring it runs efficiently and securely.

[docker-compose.yml]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/it-tools/docker-compose.yml
