---
title: "watchtower.info"
description:
  "Deploy Watchtower for automated Docker container updates. It covers the
  configuration of a custom Docker network and the Watchtower service, ensuring
  effective and secure operation."
url: "docker/compose-info/watchtower"
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
  - Portainer
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - Portainer
  - Docker Compose
  - Container Management
  - Docker Network
  - Portainer Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Portainer Service

weight: 4100

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
setting up Watchtower for automated Docker container updates.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 12, 2024
- **Description**: This file configures a custom Docker network and a Watchtower
  service for automated container updates. It includes detailed network settings
  and service configurations to ensure Watchtower runs smoothly and securely.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  watchtower_net:
    internal: false
    external: false
    name: watchtower
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.2.0/24
          ip_range: 172.20.2.0/24
          gateway: 172.20.2.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "watchtower"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.watchtower.network.description: "is an isolated network."
```

- **networks**: This section defines a custom network named `watchtower_net`.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is not an externally defined one but created
  within this `docker-compose` file.
- **name: watchtower**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "watchtower"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.watchtower.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  watchtower_app:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    container_name: watchtower
    image: containrrr/watchtower:latest
    pull_policy: if_not_present
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    command: ["--schedule", "0 0 * * * *", "--cleanup", "--debug"]
    hostname: watchtower
    networks:
      watchtower_net:
        ipv4_address: 172.20.2.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "watchtower"
      com.watchtower.description:
        "a container-based solution for automating Docker container base image
        updates."
    healthcheck:
      disable: true
```

- **services**: Defines services to be deployed.
- **watchtower_app**: The service name for the Watchtower container.
  - **restart: always**: Ensures the container always restarts on failure.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **container_name: watchtower**: Names the container "watchtower".
  - **image: containrrr/watchtower:latest**: Uses the latest Watchtower image
    from Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/var/run/docker.sock:/var/run/docker.sock**: Mounts the Docker socket to
      enable Watchtower to interact with the Docker daemon.
  - **environment**: Sets environment variables.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **command**: Runs Watchtower with specific options.
    - **--schedule "0 0 \* \* \* \*"**: Schedules Watchtower to check for
      updates every hour.
    - **--cleanup**: Removes old images after updating.
    - **--debug**: Enables debug mode for more detailed logs.
  - **hostname: watchtower**: Sets the hostname for the container.
  - **networks**: Connects the service to the `watchtower_net` network.
    - **ipv4_address: 172.20.2.2**: Assigns a static IP address to the
      container.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "watchtower"**: Project label.
    - **com.watchtower.description**: Description label for Watchtower.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Conclusion

This `docker-compose` file sets up a robust Docker environment for running
Watchtower, a tool for automated Docker container updates. It creates a custom
bridge network with specific IP settings and security configurations. The
Watchtower service is configured to monitor and update Docker containers on a
set schedule, with persistent storage and various network and security options.
The configuration ensures that Watchtower runs continuously, restarts on
failure, and logs efficiently.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/watchtower/docker-compose.yml
