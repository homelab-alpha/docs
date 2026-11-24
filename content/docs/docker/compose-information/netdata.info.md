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
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `compose.yml` file does in detail. This file is used
to configure and deploy a Netdata instance for monitoring and troubleshooting
infrastructure using Docker Compose.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `compose.yml`
- **Project name**: `netdata`, set with the top-level `name:` of the file.
- **Author**: GJS (homelab-alpha)
- **Date**: November 19, 2026
- **Description**: This file configures a custom Docker network and a Netdata
  service to monitor and troubleshoot infrastructure. It includes detailed
  network settings and service configurations to ensure Netdata runs smoothly
  and securely.
- **RAW Compose File**: [compose.yml]

<br />

## Networks Configuration

```yaml
---
name: netdata

networks:
  netdata_net:
    attachable: false
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

<br />

- **networks**: This section defines a custom network named `netdata_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is not an externally defined one but created
  within this Compose file.
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
    deploy:
      resources:
        limits:
          pids: 2048 # Limits the number of processes and threads (fork bomb protection).
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: netdata
    image: ghcr.io/netdata/netdata:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    depends_on:
      netdata_socket-proxy:
        condition: service_started
    volumes:
      - /docker/netdata/production/app/cache:/var/cache/netdata
      - /docker/netdata/production/app/config:/etc/netdata
      - /docker/netdata/production/app/lib:/var/lib/netdata
      - /etc/group:/host/etc/group:ro
      - /etc/localtime:/etc/localtime:ro
      - /etc/os-release:/host/etc/os-release:ro
      - /etc/passwd:/host/etc/passwd:ro
      - /proc:/host/proc:ro
      - /run/dbus:/run/dbus:ro
      - /sys:/host/sys:ro
      - /var/log:/host/var/log:ro
    environment:
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      DOCKER_USR: root
      DOCKER_HOST: netdata_socket-proxy:2375 # Resolves container names through the read-only socket proxy.
      NETDATA_EXTRA_APK_PACKAGES: lm-sensors
    domainname: netdata.local # Customize this with your own domain, e.g., `netdata.local` to `netdata.your-fqdn-here.com`.
    hostname: netdata
    networks:
      netdata_net:
        ipv4_address: 172.20.4.2
    ports:
      - "19999:19999/tcp" # HTTP
    security_opt:
      - apparmor:unconfined
      - no-new-privileges:true
    cap_add:
      - SYS_PTRACE
      - SYS_ADMIN
    labels:
      com.netdata.description:
        "is an infrastructure monitoring and troubleshooting."
    healthcheck:
      disable: false
      test: ["CMD", "/usr/sbin/health.sh"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

<br />

- **services**: Defines services to be deployed.
- **netdata_app**: The service name for the Netdata container.
  - **deploy.resources.limits.pids: 2048**: Limits the number of processes and
    threads in the container, which protects the host against fork bombs.
  - **restart: always**: Ensures the container always restarts if it stops or
    fails.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: netdata**: Names the container "netdata".
  - **image: ghcr.io/netdata/netdata**: Uses the Netdata image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **depends_on**: Starts this service only after `netdata_socket-proxy` has
    started.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/netdata/production/app/cache:/var/cache/netdata**: Persists
      Netdata cache data.
    - **/docker/netdata/production/app/config:/etc/netdata**: Persists Netdata
      configuration data.
    - **/docker/netdata/production/app/lib:/var/lib/netdata**: Persists Netdata
      library data.
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
    - **DOCKER_HOST: netdata_socket-proxy:2375**: Reads the container names
      through the read-only socket proxy instead of the Docker socket.
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
  - **security_opt**: Security options for the container.
    - **apparmor:unconfined**: Runs the container without AppArmor confinement.
    - **no-new-privileges:true**: Prevents the container from gaining additional
      privileges.
  - **cap_add**: Adds additional capabilities to the container.
    - **SYS_PTRACE**: Allows tracing of processes.
    - **SYS_ADMIN**: Allows various administrative operations.
  - **labels**: Metadata for the container.
    - **com.netdata.description**: Description label for Netdata.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Specifies the command to be run for the health check. In this
      case, it is `["CMD", "/usr/sbin/health.sh"]`.
    - **interval**: The time between running health checks (10 seconds).
    - **timeout**: The time a health check is allowed to run before it is
      considered to have failed (5 seconds).
    - **retries**: The number of consecutive failures required before the
      container is considered unhealthy (3 retries).
    - **start_period**: The initial period during which a health check failure
      will not be counted towards the retries (10 seconds).
    - **start_interval**: The time between starting health checks (5 seconds).

<br />

### `netdata_socket-proxy`

```yaml
services:
  netdata_socket-proxy:
    deploy:
      resources:
        limits:
          pids: 512 # Limits the number of processes and threads (fork bomb protection).
    # Read-only proxy for the Docker API. The app reaches Docker through this proxy instead of the socket.
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: netdata_socket-proxy
    image: lscr.io/linuxserver/socket-proxy:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    read_only: true
    tmpfs:
      - /run
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      CONTAINERS: 1 # Allow GET /containers (list and inspect).
      POST: 0 # Read-only: only GET and HEAD requests reach Docker.
    hostname: netdata_socket-proxy
    networks:
      netdata_net:
        ipv4_address: 172.20.4.3
    security_opt:
      - no-new-privileges:true
    labels:
      com.netdata.socket-proxy.description:
        "is a read-only Docker API proxy for Netdata."
```

<br />

- **netdata_socket-proxy**: The read-only Docker socket proxy. `netdata_app`
  reaches the Docker API through this proxy on port 2375 instead of mounting the
  Docker socket.
  - **deploy.resources.limits.pids: 512**: Limits the number of processes and
    threads in the container, which protects the host against fork bombs.
  - **restart: unless-stopped**: Restarts the container unless it is explicitly
    stopped.
  - **logging**: Uses the `json-file` driver, limited to 1MB per file and a
    maximum of 2 files.
  - **stop_grace_period: 1m**: Waits 1 minute before forcibly stopping the
    container.
  - **container_name: netdata_socket-proxy**: Names the container.
  - **image: lscr.io/linuxserver/socket-proxy**: Uses the LinuxServer.io socket
    proxy image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not present
    locally.
  - **read_only: true**: Mounts the root file system of the container read-only.
  - **tmpfs: /run**: Mounts `/run` as an in-memory file system for the runtime
    files of the proxy.
  - **volumes**: Mounts the Docker socket read-only. The `:ro` flag does not
    limit the Docker API; the proxy does.
  - **environment**: Sets what the proxy lets through. `CONTAINERS: 1` allows
    listing and inspecting containers and `POST: 0` blocks every request that
    changes something. Only `GET` and `HEAD` requests reach Docker.
  - **hostname: netdata_socket-proxy**: Sets the hostname for the container.
  - **networks**: Connects the service to the stack network with static IP
    address `172.20.4.3`.
  - **security_opt: no-new-privileges:true**: Prevents the container from
    gaining additional privileges.
  - **labels**: A description label.

<br />

## Quick Start

{{% alert context="info" %}}
Requires Docker Compose 2.24.0 or later.
{{% /alert %}}

1. Start the stack. Netdata reads the container names through the read-only
   socket proxy (`netdata_socket-proxy`) instead of the Docker socket:

   ```bash
   docker compose up -d
   ```

<br />

## Default Web Access

Access the Netdata web interface using the following URL:

```bash
http://your-ip-address:19999
```

<br />

## Default Login Credentials

**Username**: No username is required.

**Password**: No password is required.

{{% alert context="warning" %}}
**The local dashboard has no login. Do not expose it outside your network.**
{{% /alert %}}

<br />

## Conclusion

This Compose file sets up a robust Docker environment for running Netdata, an
infrastructure monitoring and troubleshooting system. It creates a custom bridge
network with specific IP settings and security configurations. The Netdata
service is configured with persistent storage, access to essential host
directories, and various network and security options. The configuration ensures
that Netdata runs continuously, restarts on failure, and logs efficiently.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/netdata/compose.yml
