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

weight: 4109

toc: true
katex: true
---

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

Let's break down what this `compose.yml` file does in detail for deploying
IT-Tools, a collection of handy online tools for developers, along with its
network and security configuration.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `compose.yml`
- **Project name**: `it-tools`, set with the top-level `name:` of the file.
- **Author**: GJS (homelab-alpha)
- **Date**: November 19, 2026
- **Description**: Docker Compose setup for IT-Tools, a suite of
  developer-friendly online tools with network and security configurations.
- **RAW Compose File**: [compose.yml]

## Networks Configuration

```yaml
---
name: it-tools

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

- **networks**: Defines a custom network named `it-tools_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this Compose file, not
  externally defined.
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

## Services Configuration

```yaml
services:
  it-tools_app:
    deploy:
      resources:
        limits:
          pids: 512 # Limits the number of processes and threads (fork bomb protection).
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: it-tools
    image: ghcr.io/corentinth/it-tools:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    read_only: true # Read-only root file system; nginx writes only to the tmpfs paths below.
    tmpfs:
      - /var/cache/nginx
      - /var/run
      - /tmp
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    domainname: tools.local # Customize this with your own domain, e.g., `it-tools.local` to `it-tools.your-fqdn-here.com`.
    hostname: it-tools
    networks:
      it-tools_net:
        ipv4_address: 172.20.22.3
    ports:
      - "3014:80/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add: # The minimum for nginx: bind port 80 and switch to the nginx user.
      - CHOWN
      - DAC_OVERRIDE
      - NET_BIND_SERVICE
      - SETGID
      - SETUID
    labels:
      com.it-tools.description:
        "A collection of handy online tools for developers, with great UX."
    healthcheck:
      disable: true
```

- **services**: Defines services to be deployed.
- **it-tools_app**: The service name for the it-tools container.
  - **deploy.resources.limits.pids: 512**: Limits the number of processes and
    threads in the container, which protects the host against fork bombs.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: it-tools**: Names the container "it-tools".
  - **image: ghcr.io/corentinth/it-tools**: Uses the it-tools image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **read_only: true**: Mounts the root file system of the container read-only.
  - **tmpfs**: Mounts `/var/cache/nginx`, `/var/run`, and `/tmp` as in-memory
    file systems, so the app can still write its runtime files there.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **domainname: tools.local**: Sets the domain name for the container.
  - **hostname: it-tools**: Sets the hostname for the container.
  - **networks**: Connects the service to the `it-tools_net` network.
    - **ipv4_address: 172.20.22.3**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **3014:80/tcp**: Maps the HTTP port (TCP).
  - **security_opt**: Security options for the container.
    - **no-new-privileges\:true**: Ensures the container does not gain new
      privileges.
  - **cap_drop: ALL**: Drops all Linux capabilities.
  - **cap_add**: Adds back only what nginx needs: `CHOWN`, `DAC_OVERRIDE`,
    `NET_BIND_SERVICE`, `SETGID`, and `SETUID`. These let it bind port 80 and
    switch to the `nginx` user.
  - **labels**: Metadata for the container.
    - **com.it-tools.description**: Description label for it-tools.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

## Quick Start

{{% alert context="info" %}}
Requires Docker Compose 2.24.0 or later.
{{% /alert %}}

1. Start the stack:

   ```bash
   docker compose up -d
   ```

## Default Web Access

Access the IT Tools web interface using the following URL:

```bash
http://your-ip-address:3014
```

## Default Login Credentials

**Username**: No username is required.

**Password**: No password is required.

## Conclusion

This Compose file sets up a Docker environment for IT-Tools, a collection of
useful online tools for developers. The configuration defines a custom bridge
network with specific IP settings and security configurations. The `it-tools`
service is configured to run continuously, with appropriate logging and restart
policies, ensuring it runs efficiently and securely.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/it-tools/compose.yml
