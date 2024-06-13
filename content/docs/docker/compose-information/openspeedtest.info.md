---
title: "openspeedtest.info"
description:
  "Deploying OpenSpeedTest, a network speed test server. It includes custom
  Docker network settings, service configurations, and security measures to
  ensure reliable and secure operation."
url: "docker/compose-info/openspeedtest"
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
  - OpenSpeedTest
  - Docker Compose
  - Network Testing
  - Infrastructure Management
keywords:
  - Docker
  - OpenSpeedTest
  - Docker Compose
  - Container Management
  - Docker Network
  - OpenSpeedTest Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Network Speed Test
  - Infrastructure Monitoring

weight: 2100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down the `docker-compose.yml` file for OpenSpeedTest, which sets up
a Docker environment for running a network speed test server.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 13, 2024
- **Description**: This file configures a custom Docker network and an
  OpenSpeedTest service, including detailed network settings and service
  configurations for reliable and secure operation.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Detailed Explanation

### Networks Configuration

```yaml
networks:
  openspeedtest_net:
    internal: false
    external: false
    name: openspeedtest
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.10.0/24
          ip_range: 172.20.10.0/24
          gateway: 172.20.10.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "openspeedtest"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.openspeedtest.network.description: "is an isolated bridge network."
```

- **networks**: This section defines a custom network named `openspeedtest_net`.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is not externally defined but created within
  this `docker-compose` file.
- **name: openspeedtest**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "openspeedtest"**: Names the bridge
    network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.openspeedtest.network.description**: A description label for the
    network.

<br />

### Services Configuration

```yaml
services:
  openspeedtest_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    container_name: openspeedtest
    image: openspeedtest/latest
    pull_policy: if_not_present
    volumes:
      - /docker/openspeedtest/production/config/nginx.conf:/etc/nginx.conf
      - /docker/openspeedtest/production/config/OpenSpeedTest-Server.conf:/etc/nginx/conf.d/OpenSpeedTest-Server.conf
      - /docker/openspeedtest/production/log:/var/log/letsencrypt
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      ENABLE_LETSENCRYPT: false
      DOMAIN_NAME: speedtest.local # Customize this with your own domain, e.g., `openspeedtest.local` to `openspeedtest.your-fqdn-here.com`.
      # USER_EMAIL: info@example.com
    domainname: openspeedtest.local # Customize this with your own domain, e.g., `openspeedtest.local` to `openspeedtest.your-fqdn-here.com`.
    hostname: openspeedtest
    networks:
      openspeedtest_net:
        ipv4_address: 172.20.10.2
    ports:
      - "3009:3000/tcp" # HTTP
      - "3009:3000/udp" # HTTP
      - "3010:3001/tcp" # HTTPS
      - "3010:3001/udp" # HTTPS
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "openspeedtest"
      com.openspeedtest.description:
        "is a Free and Open-Source HTML5 Network Speed Test Software."
    healthcheck:
      disable: true
```

- **services**: Defines services to be deployed.
- **openspeedtest_app**: The service name for the OpenSpeedTest container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **container_name: openspeedtest**: Names the container "openspeedtest".
  - **image: openspeedtest/latest**: Uses the latest OpenSpeedTest image from
    Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/openspeedtest/production/config/nginx.conf:/etc/nginx.conf**:
      Mounts the Nginx configuration file.
    - **/docker/openspeedtest/production/config/OpenSpeedTest-Server.conf:/etc/nginx/conf.d/OpenSpeedTest-Server.conf**:
      Mounts the OpenSpeedTest server configuration file.
    - **/docker/openspeedtest/production/log:/var/log/letsencrypt**: Mounts the
      log directory.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **ENABLE_LETSENCRYPT: false**: Disables Let's Encrypt.
    - **DOMAIN_NAME: speedtest.local**: Sets the domain name for the service.
  - **domainname: openspeedtest.local**: Sets the domain name for the container.
  - **hostname: openspeedtest**: Sets the hostname for the container.
  - **networks**: Connects the service to the `openspeedtest_net` network.
    - **ipv4_address: 172.20.10.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **3009:3000/tcp**: Maps HTTP port 3000 to host port 3009.
    - **3009:3000/udp**: Maps HTTP port 3000 to host port 3009 (UDP).
    - **3010:3001/tcp**: Maps HTTPS port 3001 to host port 3010.
    - **3010:3001/udp**: Maps HTTPS port 3001 to host port 3010 (UDP).
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "openspeedtest"**: Project label.
    - **com.openspeedtest.description**: Description label for OpenSpeedTest.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Conclusion

This `docker-compose` file sets up a robust Docker environment for running
OpenSpeedTest, a free and open-source HTML5 network speed test software. It
creates a custom bridge network with specific IP settings and security
configurations. The OpenSpeedTest service is configured to run continuously,
with persistent storage for configuration and logs, and includes options for
enabling HTTPS with Let's Encrypt. The configuration ensures that OpenSpeedTest
runs efficiently and securely, with appropriate logging and restart policies.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/openspeedtest/docker-compose.yml
