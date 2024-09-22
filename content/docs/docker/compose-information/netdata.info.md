---
title: "netdata.info"
description:
  "Deploy Netdata instance for infrastructure monitoring and troubleshooting. It
  details the configuration of a custom Docker network and the Netdata service,
  ensuring effective and secure monitoring."
url: "docker/compose-info/netdata"
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
is used to configure and deploy a Netdata instance for monitoring and
troubleshooting infrastructure using Docker Compose.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 12, 2024
- **Description**: This file configures a custom Docker network and a Netdata
  service to monitor and troubleshoot infrastructure. It includes detailed
  network settings and service configurations to ensure Netdata runs smoothly
  and securely.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  netdata_net:
    internal: false
    external: false
    name: netdata
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.4.0/24
          ip_range: 172.20.4.0/24
          gateway: 172.20.4.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "netdata"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.netdata.network.description: "is an isolated bridge network."
```

- **networks**: This section defines a custom network named `netdata_net`.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is not an externally defined one but created
  within this `docker-compose` file.
- **name: netdata**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "netdata"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.netdata.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  netdata_app:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    container_name: netdata
    image: netdata/netdata:latest
    pull_policy: if_not_present
    volumes:
      - /docker/netdata/production/app/cache:/var/cache/netdata
      - /docker/netdata/production/app/config:/etc/netdata
      - /docker/netdata/production/app/lib:/var/lib/netdata
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /etc/group:/host/etc/group:ro
      - /etc/localtime:/etc/localtime:ro
      - /etc/os-release:/host/etc/os-release:ro
      - /etc/passwd:/host/etc/passwd:ro
      - /proc:/host/proc:ro
      - /run/dbus:/run/dbus:ro
      - /sys:/host/sys:ro
      - /var/log:/host/var/log:ro
    environment:
      TZ: Europe/Amsterdam
      DOCKER_USR: root
      NETDATA_EXTRA_APK_PACKAGES: lm-sensors
    domainname: netdata.local
    hostname: netdata
    networks:
      netdata_net:
        ipv4_address: 172.20.4.2
    ports:
      - "19999:19999/tcp"
      - "19999:19999/udp"
    security_opt:
      - apparmor:unconfined
    cap_add:
      - SYS_PTRACE
      - SYS_ADMIN
    labels:
      com.docker.compose.project: "netdata"
      com.netdata.description:
        "is an infrastructure monitoring and troubleshooting."
    healthcheck:
      disable: true
```

- **services**: Defines services to be deployed.
- **netdata_app**: The service name for the Netdata container.
  - **restart: always**: Ensures the container always restarts if it stops or
    fails.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **container_name: netdata**: Names the container "netdata".
  - **image: netdata/netdata:latest**: Uses the latest Netdata image from Docker
    Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/netdata/production/app/cache:/var/cache/netdata**: Persists
      Netdata cache data.
    - **/docker/netdata/production/app/config:/etc/netdata**: Persists Netdata
      configuration data.
    - **/docker/netdata/production/app/lib:/var/lib/netdata**: Persists Netdata
      library data.
    - **/var/run/docker.sock:/var/run/docker.sock:ro**: Mounts the Docker socket
      read-only.
    - **/etc/group:/host/etc/group:ro**: Mounts the host's group file read-only.
    - **/etc/localtime:/etc/localtime:ro**: Mounts the host's local time file
      read-only.
    - **/etc/os-release:/host/etc/os-release:ro**: Mounts the host's OS release
      file read-only.
    - **/etc/passwd:/host/etc/passwd:ro**: Mounts the host's passwd file
      read-only.
    - **/proc:/host/proc:ro**: Mounts the host's proc directory read-only.
    - **/run/dbus:/run/dbus:ro**: Mounts the host's DBus runtime directory
      read-only.
    - **/sys:/host/sys:ro**: Mounts the host's sys directory read-only.
    - **/var/log:/host/var/log:ro**: Mounts the host's log directory read-only.
  - **environment**: Sets environment variables.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **DOCKER_USR: root**: Specifies the Docker user as root.
    - **NETDATA_EXTRA_APK_PACKAGES: lm-sensors**: Installs additional packages
      (lm-sensors).
  - **domainname: netdata.local**: Sets the domain name for the container.
  - **hostname: netdata**: Sets the hostname for the container.
  - **networks**: Connects the service to the `netdata_net` network.
    - **ipv4_address: 172.20.4.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps host ports to container ports.
    - **"19999:19999/tcp"**: Maps TCP port 19999 on the host to port 19999 in
      the container.
    - **"19999:19999/udp"**: Maps UDP port 19999 on the host to port 19999 in
      the container.
  - **security_opt**: Security options for the container.
    - **apparmor:unconfined**: Runs the container without AppArmor confinement.
  - **cap_add**: Adds additional capabilities to the container.
    - **SYS_PTRACE**: Allows tracing of processes.
    - **SYS_ADMIN**: Allows various administrative operations.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "netdata"**: Project label.
    - **com.netdata.description**: Description label for Netdata.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Conclusion

This `docker-compose` file sets up a robust Docker environment for running
Netdata, an infrastructure monitoring and troubleshooting system. It creates a
custom bridge network with specific IP settings and security configurations. The
Netdata service is configured with persistent storage, access to essential host
directories, and various network and security options. The configuration ensures
that Netdata runs continuously, restarts on failure, and logs efficiently.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/netdata/docker-compose.yml
