---
title: "uptime-kuma.info"
description:
  "Deploy Uptime Kuma instance for monitoring website uptime and alerting. It
  covers the configuration of a custom Docker network and the Uptime Kuma
  service, ensuring effective and secure operation."
url: "docker/compose-info/uptime-kuma"
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
setting up an Uptime Kuma instance for monitoring website uptime and alerting.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 12, 2024
- **Description**: This file configures a custom Docker network and an Uptime
  Kuma service for monitoring website uptime and alerting. It includes detailed
  network settings and service configurations to ensure Uptime Kuma runs
  smoothly and securely.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  uptime-kuma_net:
    internal: false
    external: false
    name: uptime-kuma
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.3.0/24
          ip_range: 172.20.3.0/24
          gateway: 172.20.3.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "uptime-kuma"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.uptime-kuma.network.description: "is an isolated network."
```

- **networks**: This section defines a custom network named `uptime-kuma_net`.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is not an externally defined one but created
  within this `docker-compose` file.
- **name: uptime-kuma**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "uptime-kuma"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.uptime-kuma.network.description**: A description label for the
    network.

<br />

## Services Configuration

```yaml
services:
  uptime-kuma_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    container_name: uptime-kuma
    image: louislam/uptime-kuma:latest
    pull_policy: if_not_present
    volumes:
      - /docker/uptime-kuma/production/app:/app/data
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /usr/local/share/ca-certificates:/app/data/docker-tls
    environment:
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      # NODE_EXTRA_CA_CERTS: /app/data/docker-tls/change_me # Replace `change_me` with the name of your own certificate to add your trusted root certificates.
    domainname: status.local # Customize this with your own domain, e.g., `status.local` to `status.your-fqdn-here.com`.
    hostname: status
    networks:
      uptime-kuma_net:
        ipv4_address: 172.20.3.2
    ports:
      - "3001:3001/tcp" # HTTP
      - "3001:3001/udp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "uptime-kuma"
      com.uptime-kuma.description:
        "it is a self-hosted monitoring tool like uptime robot."
    healthcheck:
      disable: true
```

- **services**: Defines services to be deployed.
- **uptime-kuma_app**: The service name for the Uptime Kuma container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **container_name: uptime-kuma**: Names the container "uptime-kuma".
  - **image: louislam/uptime-kuma:latest**: Uses the latest Uptime Kuma image
    from Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/uptime-kuma/production/app:/app/data**: Persists Uptime Kuma
      data.
    - **/var/run/docker.sock:/var/run/docker.sock:ro**: Mounts the Docker socket
      read-only.
    - **/usr/local/share/ca-certificates:/app/data/docker-tls**: Mounts the
      directory containing custom CA certificates.
  - **environment**: Sets environment variables.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **# NODE_EXTRA_CA_CERTS: /app/data/docker-tls/change_me**: Commented out.
      Replace `change_me` with your certificate to add trusted root
      certificates.
  - **domainname: status.local**: Sets the domain name for the container.
  - **hostname: status**: Sets the hostname for the container.
  - **networks**: Connects the service to the `uptime-kuma_net` network.
    - **ipv4_address: 172.20.3.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps host ports to container ports.
    - **"3001:3001/tcp"**: Maps TCP port 3001 on the host to port 3001 in the
      container.
    - **"3001:3001/udp"**: Maps UDP port 3001 on the host to port 3001 in the
      container.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "uptime-kuma"**: Project label.
    - **com.uptime-kuma.description**: Description label for Uptime Kuma.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Conclusion

This `docker-compose` file sets up a robust Docker environment for running
Uptime Kuma, a self-hosted monitoring tool similar to Uptime Robot. It creates a
custom bridge network with specific IP settings and security configurations. The
Uptime Kuma service is configured with persistent storage, access to essential
host directories, and various network and security options. The configuration
ensures that Uptime Kuma runs continuously, restarts on failure, and logs
efficiently.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma/docker-compose.yml
