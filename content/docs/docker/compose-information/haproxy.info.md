---
title: "haproxy.info"
description:
  "Deploy HAProxy, a high-performance TCP/HTTP load balancer, using Docker Compose.
  This guide covers custom network setup, service configurations, volume mounting
  for SSL certificates, and security best practices for reliable and efficient
  load balancing."
url: "docker/compose-info/haproxy"
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
  - HAProxy
  - Docker
  - Docker Compose
  - Load Balancer
  - TCP Load Balancer
  - HTTP Load Balancer
  - Networking
  - DevOps
  - Containerization
keywords:
  - haproxy
  - docker-compose
  - load balancing
  - tcp load balancer
  - http load balancer
  - container network
  - ssl certificates
  - docker volumes
  - high availability
  - devops

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
deploying HAProxy, a reliable, high-performance TCP/HTTP load balancer.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 18, 2025
- **Description**: Docker Compose setup for HAProxy load balancing with SSL and
  network management.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
---
networks:
  haproxy_net:
    attachable: true
    internal: false
    external: false
    name: haproxy
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.21.0/24
          ip_range: 172.20.21.0/24
          gateway: 172.20.21.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "haproxy"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.haproxy.network.description: "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `haproxy_net`.
- **attachable**: Set to `true`, meaning other containers can attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: haproxy**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "haproxy"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.haproxy.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  haproxy_app:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: haproxy
    image: docker.io/haproxytech/haproxy-ubuntu
    pull_policy: if_not_present
    volumes:
      - /docker/haproxy/production/app/hapoxy.cfg:/usr/local/etc/haproxy/haproxy.cfg
      - /docker/haproxy/production/certs:/certs
      - /etc/letsencrypt:/etc/letsencrypt
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
    domainname: haproxy.local
    hostname: haproxy
    networks:
      haproxy_net:
        ipv4_address: 172.20.21.2
    dns:
      - 9.9.9.9
      - 149.112.112.112
    ports:
      - "80:80/tcp"
      - "80:80/udp"
      - "443:433/tcp"
      - "443:433/udp"
      - "8404:8404/tcp"
      - "8404:8404/udp"
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "haproxy"
      com.haproxy.description: "the reliable, high performance tcp/http load balancer."
    healthcheck:
      disable: false
```

<br />

- **services**: Defines services to be deployed.
- **haproxy_app**: The service name for the HAProxy container.
  - **restart: always**: Ensures the container always restarts if it stops.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: haproxy**: Names the container "haproxy".
  - **image: docker.io/haproxytech/haproxy-ubuntu**: Uses the official HAProxy
    Ubuntu image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/haproxy/production/app/hapoxy.cfg:/usr/local/etc/haproxy/haproxy.cfg**:
      Mounts the HAProxy configuration file into the container.
    - **/docker/haproxy/production/certs\:/certs**: Mounts SSL certificates.
    - **/etc/letsencrypt:/etc/letsencrypt**: Mounts Let's Encrypt certificates.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **domainname: haproxy.local**: Sets the domain name for the container.
  - **hostname: haproxy**: Sets the hostname for the container.
  - **networks**: Connects the service to the `haproxy_net` network.
    - **ipv4_address: 172.20.21.2**: Assigns a static IP address to the container.
  - **dns**: Defines custom DNS servers for the container.
    - **9.9.9.9**: Primary DNS server (Quad9).
    - **149.112.112.112**: Secondary DNS server (Quad9).
  - **ports**: Maps container ports to host ports.
    - **80:80/tcp**: Maps HTTP port (TCP).
    - **80:80/udp**: Maps HTTP port (UDP).
    - **443:433/tcp**: Maps HTTPS port (TCP).
    - **443:433/udp**: Maps HTTPS port (UDP).
    - **8404:8404/tcp**: Maps Statistics Report port (TCP).
    - **8404:8404/udp**: Maps Statistics Report port (UDP).
  - **security_opt**: Security options for the container.
    - **no-new-privileges\:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "haproxy"**: Project label.
    - **com.haproxy.description**: Description label for HAProxy.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.

<br />

## Conclusion

This `docker-compose.yml` file sets up a Docker environment for HAProxy, a
reliable, high-performance TCP/HTTP load balancer. The configuration defines a
custom bridge network with specific IP settings and security configurations. The
HAProxy

[docker-compose.yml]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/haproxy/docker-compose.yml
