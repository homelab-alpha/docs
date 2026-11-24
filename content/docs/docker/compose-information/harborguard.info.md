---
title: "harborguard.info"
description:
  "This file deploys HarborGuard, a container security scanning platform with a
  web interface for managing and visualizing security assessments of Docker
  images. It uses an internal PostgreSQL database and does not persist data."
url: "docker/compose-info/harborguard"
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
  - HarborGuard
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - HarborGuard
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - HarborGuard
  - Container Security
  - Vulnerability Scanning

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `compose.yml` file does in detail. This file deploys
HarborGuard, a container security scanning platform with a web interface for
managing and visualizing security assessments of Docker images. It uses an
internal PostgreSQL database and does not persist data.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `compose.yml`
- **Project name**: `harborguard`, set with the top-level `name:` of the file.
- **Author**: GJS (homelab-alpha)
- **Date**: November 19, 2026
- **Description**: Configures a Docker network and the HarborGuard service.
- **RAW Compose File**: [compose.yml]
- **RAW Environment File**: [stack.env]

<br />

## Networks Configuration

```yaml
---
name: harborguard

networks:
  harborguard_net:
    attachable: false
    internal: false
    external: false
    name: harborguard
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.27.0/24
          ip_range: 172.20.27.0/24
          gateway: 172.20.27.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "harborguard"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.harborguard.network.description: "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `harborguard_net`.
- **attachable: false**: Other containers can't attach to this network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this Compose file.
- **name: harborguard**: Specifies the name of the network.
- **driver: bridge**: Uses the bridge driver to create an isolated network.
- **ipam**: Configures IP address management for the network.
  - **subnet**: `172.20.27.0/24`.
  - **ip_range**: `172.20.27.0/24`.
  - **gateway**: `172.20.27.1`.
- **driver_opts**: Additional options for the network driver.
  - **com.docker.network.bridge.default_bridge: "false"**: Indicates this is not
    the default Docker bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows outbound
    traffic to appear as if it came from the host.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds the bridge
    to all available IP addresses on the host.
  - **com.docker.network.bridge.name: "harborguard"**: Names the bridge
    interface on the host.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **description label**: Describes the network as an isolated bridge network.

<br />

## Services Configuration

### `harborguard_app`

```yaml
services:
  harborguard_app:
    deploy:
      resources:
        limits:
          pids: 2048 # Limits the number of processes and threads (fork bomb protection).
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: harborguard
    image: ghcr.io/harborguard/harborguard:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    env_file:
      # Compose loads each file that exists and skips a missing one:
      # '.env' for the Docker Compose CLI, 'stack.env' for Portainer.
      - path: .env
        required: false
      - path: stack.env
        required: false
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      POSTGRES_DB: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      POSTGRES_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      POSTGRES_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: 0.0.0.0
      MAX_CONCURRENT_SCANS: 3
      SCAN_TIMEOUT_MINUTES: 30
      ENABLED_SCANNERS: trivy,grype,syft,dockle,osv,dive
      VERSION_CHECK_ENABLED: true
      TRIVY_CACHE_DIR: "/opt/trivy-cache"
      GRYPE_DB_CACHE_DIR: "/opt/grype-cache"
      SYFT_CACHE_DIR: "/opt/syft-cache"
      LOG_LEVEL: info
      CLEANUP_OLD_SCANS_DAYS: 30
      STORE_RAW_SCAN_DATA: true
      STORE_METADATA_JSON: true
      USE_NORMALIZED_APIS: true
      ENABLE_LEGACY_FALLBACK: true
      AUTO_UPDATE_SUMMARIES: true
      SUMMARY_CACHE_TTL_MINUTES: 5
      ENABLE_CVE_DEDUPLICATION: true
      DASHBOARD_API_TIMEOUT_MS: 105000
      BATCH_SUMMARY_UPDATE_SIZE: 10
    domainname: harborguard.local # Customize this with your own domain, e.g., `harborguard.local` to `harborguard.your-fqdn-here.com`.
    hostname: harborguard
    extra_hosts:
      harborguard: "0.0.0.0"
    networks:
      harborguard_net:
        ipv4_address: 172.20.27.3
    ports:
      - "3016:3000/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.harborguard.description:
        "is a comprehensive container security scanning platform that provides
        an intuitive web interface for managing and visualizing security
        assessments of Docker images."
    healthcheck:
      disable: false
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s
```

<br />

- **harborguard_app**: The service definition.
  - **restart: unless-stopped**: Restarts the container unless it is explicitly
    stopped.
  - **logging**: Uses the `json-file` driver, limited to 1MB per file and a
    maximum of 2 files.
  - **stop_grace_period: 1m**: Waits 1 minute before forcibly stopping the
    container.
  - **container_name: harborguard**: Names the container.
  - **image: ghcr.io/harborguard/harborguard**: Uses this image with the
    `latest` tag.
  - **pull_policy: if_not_present**: Pulls the image only if it's not present
    locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/var/run/docker.sock:/var/run/docker.sock:ro**
  - **env_file**: Loads `.env` (Docker Compose CLI) and `stack.env` (Portainer).
    Both are listed with `required: false`, so Compose skips the file that is
    missing.
  - **environment**: Sets environment variables.
    - **PUID: 1000**: The user ID the container runs as.
    - **PGID: 1000**: The group ID the container runs as.
    - **TZ: Europe/Amsterdam**: Adjust the timezone to match your local
      timezone. You can find the full list of timezones here
      https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    - **POSTGRES_DB: ${NAME_DB}**: Fill in the value in both the .env and
      stack.env files
    - **POSTGRES_PASSWORD: ${PASSWORD_DB}**: Fill in the value in both the .env
      and stack.env files
    - **POSTGRES_USER: ${USER_DB}**: Fill in the value in both the .env and
      stack.env files
    - **NODE_ENV: production**
    - **PORT: 3000**
    - **HOSTNAME: 0.0.0.0**
    - **MAX_CONCURRENT_SCANS: 3**
    - **SCAN_TIMEOUT_MINUTES: 30**
    - **ENABLED_SCANNERS: trivy,grype,syft,dockle,osv,dive**
    - **VERSION_CHECK_ENABLED: True**
    - **TRIVY_CACHE_DIR: /opt/trivy-cache**
    - **GRYPE_DB_CACHE_DIR: /opt/grype-cache**
    - **SYFT_CACHE_DIR: /opt/syft-cache**
    - **LOG_LEVEL: info**
    - **CLEANUP_OLD_SCANS_DAYS: 30**
    - **STORE_RAW_SCAN_DATA: True**
    - **STORE_METADATA_JSON: True**
    - **USE_NORMALIZED_APIS: True**
    - **ENABLE_LEGACY_FALLBACK: True**
    - **AUTO_UPDATE_SUMMARIES: True**
    - **SUMMARY_CACHE_TTL_MINUTES: 5**
    - **ENABLE_CVE_DEDUPLICATION: True**
    - **DASHBOARD_API_TIMEOUT_MS: 105000**
    - **BATCH_SUMMARY_UPDATE_SIZE: 10**
  - **domainname: harborguard.local**: Sets the domain name for the container.
    Replace it with your own domain.
  - **hostname: harborguard**: Sets the hostname for the container.
  - **extra_hosts**: Resolves `harborguard` to `0.0.0.0` inside the container.
  - **networks**: Connects the service to `harborguard_net` with static IP
    address `172.20.27.3`.
  - **ports**: Maps host ports to container ports.
    - **"3016:3000/tcp"**: HTTP.
  - **deploy.resources.limits.pids: 2048**: Limits the number of processes and
    threads in the container, which protects the host against fork bombs.
  - **security_opt: no-new-privileges:true**: Prevents the container from
    gaining new privileges.
  - **labels**: A description label.
  - **healthcheck**: Runs `curl -f http://localhost:3000/api/health`.
    - **interval / timeout / retries / start_period / start_interval**: 1m30s /
      10s / 3 / 40s / 5s.

<br />

## Environment Variables

The variables are stored in an environment file, outside the compose file. Use
`.env` for Docker Compose and `stack.env` for Portainer. Both files must contain
the same values.

<br />

### Variables in this file

```env
# NOTE:
# This setup uses an **internal PostgreSQL database** and **does not persist data**.
#
# To use the Harbor Guard Compose file, you must provide either a `.env`
# or `stack.env` file with the required environment variables.

# Database Configuration: USER
# Database name: no changes needed
NAME_DB=harborguard_db

# PostgreSQL user password: no changes needed
PASSWORD_DB=StrongUniqueUserPassword5678

# PostgreSQL username: no changes needed
USER_DB=harborguard
```

- **`NAME_DB`**: Database name: no changes needed
- **`PASSWORD_DB`**: PostgreSQL user password: no changes needed
- **`USER_DB`**: PostgreSQL username: no changes needed

<br />

## Quick Start

{{% alert context="info" %}}
Requires Docker Compose 2.24.0 or later.
{{% /alert %}}

1. Change the values in `.env` (Docker Compose CLI) or `stack.env` (Portainer),
   at least the passwords.

2. Start the stack:

   ```bash
   docker compose up -d
   ```

<br />

## Default Web Access

Access the Harbor Guard web interface using the following URL:

```bash
http://your-ip-address:3016
```

<br />

## Default Login Credentials

{{% alert context="info" %}}
This setup uses an internal database and does **not** persist your data. For a
production-ready setup with an external PostgreSQL database, refer to the
[Harbor Guard GitHub documentation](https://github.com/HarborGuard/HarborGuard),
including the
[docker-compose.yml](https://github.com/HarborGuard/HarborGuard/blob/main/docker-compose.yml)
and
[.env.example](https://github.com/HarborGuard/HarborGuard/blob/main/.env.example)
files.
{{% /alert %}}

**Username**: No username is required.

**Password**: No password is required.

<br />

## Conclusion

This Compose file deploys HarborGuard on a custom bridge network with a static
IP address. The scanners (Trivy, Grype, Syft, Dockle, OSV, and Dive) are enabled
through environment variables, and the Docker socket is mounted read-only so
images can be scanned. The bundled database does not persist data.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/harborguard/compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/harborguard/stack.env
