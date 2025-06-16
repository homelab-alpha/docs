---
title: "portainer.info"
description:
  "Deploy Portainer for managing Docker environments. It covers the
  configuration of a custom Docker network and the Portainer service, ensuring
  effective and secure operation."
url: "docker/compose-info/portainer"
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
is used to configure and deploy services using Docker Compose, specifically
setting up a Portainer instance for managing Docker environments.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 16, 2025
- **Description**: This file configures a custom Docker network and a Portainer
  service to manage Docker containers. It includes detailed network settings and
  service configurations to ensure Portainer runs smoothly and securely.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  portainer_net:
    attachable: false
    internal: false
    external: false
    name: portainer
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.1.0/24
          ip_range: 172.20.1.0/24
          gateway: 172.20.1.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "portainer"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.portainer.network.description: "is an isolated network."
```

<br />

- **networks**: This section defines a custom network named `portainer_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is not an externally defined one but created
  within this `docker-compose` file.
- **name: portainer**: Specifies the name of the network.
- **driver: bridge**: Uses the bridge driver to create an isolated network.
- **ipam**: Configures IP address management for the network.
  - **subnet**: Defines the subnet for the network.
  - **ip_range**: Restricts the IP range within the subnet.
  - **gateway**: Sets the gateway for the network.
- **driver_opts**: Additional options for the network driver.
  - **default_bridge: "false"**: Indicates this is not the default Docker
    bridge.
  - **enable_icc: "true"**: Enables inter-container communication.
  - **enable_ip_masquerade: "true"**: Allows outbound traffic to appear as if it
    came from the host.
  - **host_binding_ipv4: "0.0.0.0"**: Binds the bridge to all available IP
    addresses on the host.
  - **bridge.name: "portainer"**: Names the bridge network.
  - **mtu: "1500"**: Sets the Maximum Transmission Unit size for the network.
- **labels**: Metadata for the network.
  - **com.portainer.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  portainer_app:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: portainer
    image: docker.io/portainer/portainer-ee:latest
    pull_policy: if_not_present
    volumes:
      - /docker/portainer/production/app:/data
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      TZ: Europe/Amsterdam
    domainname: portainer.local
    hostname: portainer
    networks:
      portainer_net:
        ipv4_address: 172.20.1.2
    ports:
      - "8000:8000/tcp"
      - "8000:8000/udp"
      - "9000:9000/tcp"
      - "9000:9000/udp"
      - "9443:9443/tcp"
      - "9443:9443/udp"
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "portainer"
      com.portainer.description:
        "deploy, configure, troubleshoot and secure containers."
    healthcheck:
      disable: true
```

<br />

- **services**: Defines services to be deployed.
- **portainer_app**: The service name for the Portainer container.
  - **restart: always**: Ensures the container always restarts if it stops or
    crashes.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: portainer**: Names the container "portainer".
  - **image: docker.io/portainer/portainer-ee:latest**: Uses the latest Portainer image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/portainer/production/app:/data**: Persists Portainer data.
    - **/var/run/docker.sock:/var/run/docker.sock**: Grants the container access
      to the Docker socket.
  - **environment**: Sets environment variables.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **domainname: portainer.local**: Sets the domain name for the container.
  - **hostname: portainer**: Sets the hostname for the container.
  - **networks**: Connects the service to the `portainer_net` network.
    - **ipv4_address: 172.20.1.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps host ports to container ports.
    - **"8000:8000/tcp"**: Maps TCP port 8000 on the host to port 8000 in the
      container.
    - **"8000:8000/udp"**: Maps UDP port 8000 on the host to port 8000 in the
      container.
    - **"9000:9000/tcp"**: Maps TCP port 9000 on the host to port 9000 in the
      container.
    - **"9000:9000/udp"**: Maps UDP port 9000 on the host to port 9000 in the
      container.
    - **"9443:9443/tcp"**: Maps TCP port 9443 on the host to port 9443 in the
      container.
    - **"9443:9443/udp"**: Maps UDP port 9443 on the host to port 9443 in the
      container.
  - **security_opt**: Security options for the container.
    - **no-new-privileges: true**: Prevents the container from gaining
      additional privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "portainer"**: Project label.
    - **com.portainer.description**: Description label for Portainer.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Conclusion

This `docker-compose` file sets up a robust Docker environment for running
Portainer, a management UI for Docker. It creates a custom bridge network with
specific IP settings and security configurations. The Portainer service is
configured with persistent storage, access to the Docker socket, and various
network and security options. The configuration ensures that Portainer runs
continuously, restarts on failure, and logs efficiently.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/portainer/docker-compose.yml
