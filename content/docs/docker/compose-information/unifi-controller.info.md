---
title: "unifi-controller.info"
description:
  "Deploy and set up the Unifi Controller, a comprehensive network management
  tool, using Docker Compose. This configuration includes custom Docker network
  settings and service configurations for efficient deployment and centralized
  control of network devices across different locations."
url: "docker/compose-info/unifi-controller"
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
  - Unifi Controller
  - Docker Compose
  - Network Management
  - Containerization
  - Docker Networking
keywords:
  - Docker Unifi Controller setup
  - Docker Compose Unifi configuration
  - Unifi Controller Docker persistent storage
  - Network management Docker container
  - Docker network configuration

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
deploying the Unifi Controller, a powerful network management tool, with
detailed explanations.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: February 22, 2025
- **Description**: Configures a Docker network and service for Unifi Controller.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  unifi-controller_net:
    attachable: false
    internal: false
    external: false
    name: unifi-controller
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.13.0/24
          ip_range: 172.20.13.0/24
          gateway: 172.20.13.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "unifi"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.unifi-controller.network.description: "is an isolated bridge network."
```

- **networks**: Defines a custom network named `unifi-controller_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: unifi-controller**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "unifi"**: Names the bridge
    network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.unifi-controller.network.description**: A description label for the
    network.

<br />

## Unifi Controller Service

```yaml
services:
  unifi-controller_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: unifi-controller
    image: linuxserver/unifi-controller:latest
    pull_policy: if_not_present
    volumes:
      - /docker/unifi-controller/production/app:/config
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      MEM_LIMIT: "2048M"
    domainname: unifi-controller.local # Customize this with your own domain, e.g., `unifi-controller.local` to `unifi-controller.your-fqdn-here.com`.
    hostname: unifi-controller
    networks:
      unifi-controller_net:
        ipv4_address: 172.20.13.2
    ports:
      - "1900:1900/udp" # Required for Make controller discoverable on L2
      - "3478:3478/udp" # Unifi STUN port
      - "5514:5514/tcp" # Remote syslog port
      - "6789:6789/tcp" # For mobile throughput test
      - "8080:8080/tcp" # Required for device communication
      - "8443:8443/tcp" # Unifi web admin port
      - "8843:8843/tcp" # Unifi guest portal HTTPS redirect port
      - "8880:8880/tcp" # Unifi guest portal HTTP redirect port
      - "10001:10001/udp" # Required for AP discovery
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "unifi-controller"
      com.unifi-controller.description:
        "is an end-to-end system of network devices across different locations —
        all controlled from a single interface."
    healthcheck:
      disable: true
```

- **unifi-controller_app**: The service name for the Unifi Controller container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: unifi-controller**: Names the container
    "unifi-controller".
  - **image: linuxserver/unifi-controller:latest**: Uses the latest Unifi
    Controller image from Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/unifi-controller/production/app:/config**: Mounts the Unifi
      Controller configuration directory.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **MEM_LIMIT: "2048M"**: Limits the memory usage of the container to
      2048MB.
  - **domainname: unifi-controller.local**: Sets the domain name for the
    container.
  - **hostname: unifi-controller**: Sets the hostname for the container.
  - **networks**: Connects the service to the `unifi-controller_net` network.
    - **ipv4_address: 172.20.13.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **1900:1900/udp**: Maps the UDP port required for controller
      discoverability.
    - **3478:3478/udp**: Maps the UDP port for Unifi STUN.
    - **5514:5514/tcp**: Maps the TCP port for remote syslog.
    - **6789:6789/tcp**: Maps the TCP port for mobile throughput test.
    - **8080:8080/tcp**: Maps the TCP port required for device communication.
    - **8443:8443/tcp**: Maps the TCP port for Unifi web admin.
    - **8843:8843/tcp**: Maps the TCP port for Unifi guest portal HTTPS
      redirect.
    - **8880:8880/tcp**: Maps the TCP port for Unifi guest portal HTTP redirect.
    - **10001:10001/udp**: Maps the UDP port required for AP discovery.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "unifi-controller"**: Project label.
    - **com.unifi-controller.description**: Description label for Unifi
      Controller.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Conclusion

This `docker-compose.yml` file sets up a Unifi Controller with its own custom
bridge network. The configuration includes a persistent storage setup for
Unifi's configuration directory. Environment variables customize the setup,
including timezone and memory limits. The service is configured to restart
unless stopped manually, with logging options to manage log size and retention.
The network settings ensure the Unifi container has a static IP within the
specified subnet, and various ports are mapped for Unifi services. Security
options enhance container security by preventing privilege escalation.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/unifi-controller/docker-compose.yml
