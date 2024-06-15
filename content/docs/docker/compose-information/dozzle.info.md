---
title: "dozzle.info"
description:
  "Deploy Dozzle, a web-based interface for real-time Docker log monitoring. It
  includes custom Docker network settings, service configurations, and security
  measures for efficient and secure operation."
url: "docker/compose-info/dozzle"
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
  - Dozzle
  - Docker Compose
  - Container Management
  - Log Monitoring
keywords:
  - Docker
  - Dozzle
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Log Monitoring
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Infrastructure Monitoring
  - Real-time Log Viewer

weight: 2100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `docker-compose.yml` file does in detail for
deploying Dozzle, a web-based interface for real-time Docker log monitoring.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 13, 2024
- **Description**: Configures a Docker network and the Dozzle service for
  real-time Docker log monitoring.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  dozzle_net:
    internal: false
    external: false
    name: dozzle
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.9.0/24
          ip_range: 172.20.9.0/24
          gateway: 172.20.9.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "dozzle"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.dozzle.network.description: "is an isolated bridge network."
```

- **networks**: This section defines a custom network named `dozzle_net`.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: dozzle**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "dozzle"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.dozzle.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  dozzle_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    container_name: dozzle
    image: amir20/dozzle:latest
    pull_policy: if_not_present
    volumes:
      - /docker/dozzle/production/app:/data
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      DOZZLE_AUTH_PROVIDER: "none" # none, simple, forward-proxy
      DOZZLE_ENABLE_ACTIONS: "false"
      DOZZLE_HOSTNAME: docker-server
      DOZZLE_LEVEL: info
      DOZZLE_NO_ANALYTICS: "true"
      # DOZZLE_REMOTE_HOST: tcp://192.168.*.*:2376|dozzle-remote.local
    domainname: dozzle.local # Customize this with your own domain, e.g., `dozzle.local` to `dozzle.your-fqdn-here.com`.
    hostname: dozzle
    networks:
      dozzle_net:
        ipv4_address: 172.20.9.2
    ports:
      - "3008:8080/tcp" # HTTP
      - "3008:8080/udp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "dozzle"
      com.dozzle.description:
        "is a small lightweight application with a web based interface to
        monitor Docker logs."
    healthcheck:
      disable: true
```

- **services**: Defines services to be deployed.
- **dozzle_app**: The service name for the Dozzle container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **container_name: dozzle**: Names the container "dozzle".
  - **image: amir20/dozzle:latest**: Uses the latest Dozzle image from Docker
    Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/dozzle/production/app:/data**: Mounts the app data directory.
    - **/var/run/docker.sock:/var/run/docker.sock:ro**: Mounts the Docker socket
      as read-only.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **DOZZLE_AUTH_PROVIDER: "none"**: Disables authentication (options: none,
      simple, forward-proxy).
    - **DOZZLE_ENABLE_ACTIONS: "false"**: Disables actions within Dozzle.
    - **DOZZLE_HOSTNAME: docker-server**: Sets the hostname for Dozzle.
    - **DOZZLE_LEVEL: info**: Sets the logging level to info.
    - **DOZZLE_NO_ANALYTICS: "true"**: Disables analytics.
    - **DOZZLE_REMOTE_HOST**: Optionally specifies a remote host for Docker
      (commented out).
  - **domainname: dozzle.local**: Sets the domain name for the container.
  - **hostname: dozzle**: Sets the hostname for the container.
  - **networks**: Connects the service to the `dozzle_net` network.
    - **ipv4_address: 172.20.9.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **3008:8080/tcp**: Maps the HTTP port.
    - **3008:8080/udp**: Maps the HTTP port (UDP).
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "dozzle"**: Project label.
    - **com.dozzle.description**: Description label for Dozzle.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Conclusion

This `docker-compose` file sets up a Docker environment for Dozzle, a
lightweight application that provides a web-based interface for monitoring
Docker logs. The configuration defines a custom bridge network with specific IP
settings and security configurations. The Dozzle service is configured to run
continuously, with persistent storage for application data and read-only access
to the Docker socket. The setup ensures Dozzle runs efficiently and securely,
with appropriate logging and restart policies, making it an excellent tool for
real-time Docker log monitoring.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/dozzle/docker-compose.yml
