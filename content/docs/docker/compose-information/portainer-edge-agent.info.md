---
title: "portainer-edge-agent.info"
description:
  "Deploy Portainer Edge Agent, a self-hosted, user-friendly Docker Compose
  stack management interface. It includes details on custom Docker network
  settings, service configurations, and security measures for efficient and
  secure operation."
url: "docker/compose-info/portainer-edge-agent"
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
  - Infrastructure Management
keywords:
  - Docker
  - Portainer
  - Docker Compose
  - Container Management
  - Docker Network
  - Portainer Edge Agent
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Infrastructure Monitoring
  - Self-hosted Docker Management

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
deploying Portainer Edge Agent, a user-friendly Docker Compose stack management
interface.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Feb 11, 2025
- **Description**: Configures a Docker network and the Portainer Edge Agent
  service for managing Docker Compose stacks.
- **RAW Compose File**: [docker-compose.yml]
- **RAW .env File**: [.env]
- **RAW stack.env File**: [stack.env]

<br />

## Networks Configuration

```yaml
networks:
  edge-agent_net:
    attachable: false
    internal: false
    external: false
    name: edge-agent
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.18.0/24
          ip_range: 172.20.18.0/24
          gateway: 172.20.18.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "edge-agent"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.edge-agent.network.description: "is an isolated bridge network."
```

- **networks**: This section defines a custom network named `edge-agent_net` for
  the Portainer Edge Agent.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal**: Set to `false`, making the network accessible externally.
- **external**: Set to `false`, indicating the network is created within the
  `docker-compose` file.
- **name: edge-agent**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "edge-agent"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.edge-agent.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  edge-agent_app:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: edge-agent
    image: portainer/agent:latest
    volumes:
      - /docker/portainer/edge-agent/production/app:/data
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
      - /:/host
    env_file:
      # Choose the correct environment file:
      # - Use '.env' for Docker Compose.
      # - Use 'stack.env' for Portainer.
      # Comment out the file you are not using in the Compose file to avoid issues.
      - .env
      - stack.env
    environment:
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      EDGE: 1
      EDGE_ID: ${PORTAINER_AGENT_ID}
      EDGE_KEY: ${PORTAINER_AGENT_KEY}
      EDGE_INSECURE_POLL: 1
    networks:
      edge-agent_net:
        ipv4_address: 172.20.18.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "portainer agent"
      com.edge-agent.description:
        "a remote environment is not directly accessible from docker server."
    healthcheck:
      disable: true
```

- **services**: Defines services to be deployed.
- **edge-agent_app**: The service name for the Portainer Edge Agent container.
  - **restart: always**: Ensures the container restarts automatically.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: edge-agent**: Names the container "edge-agent".
  - **image: portainer/agent:latest**: Uses the latest Portainer Edge Agent
    image from Docker Hub.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/portainer/edge-agent/production/app:/data**: Mounts the
      application data directory.
    - **/var/run/docker.sock:/var/run/docker.sock**: Mounts the Docker socket.
    - **/var/lib/docker/volumes:/var/lib/docker/volumes**: Mounts Docker
      volumes.
    - **/:/host**: Mounts the host's root directory to the container.
  - **env_file**: Specifies environment files.
    - **.env**: For Docker Compose.
    - **stack.env**: For Portainer.
  - **environment**: Sets environment variables.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **EDGE: 1**: Enables Edge functionality.
    - **EDGE_ID**: Specifies the Portainer Edge Agent ID.
    - **EDGE_KEY**: Specifies the Portainer Edge Agent Key.
    - **EDGE_INSECURE_POLL: 1**: Allows insecure polling for the Edge Agent.
  - **networks**: Connects the service to the `edge-agent_net` network.
    - **ipv4_address: 172.20.18.2**: Assigns a static IP address to the
      container.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "portainer agent"**: Project label.
    - **com.edge-agent.description**: Description label for Portainer Edge
      Agent.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Environment Variables

This file contains configuration settings that can be used by various
applications (such as Docker containers or your MySQL server). The values are
variables stored outside the source code for security purposes.

<br />

### Variables in this file

```env
# Portainer Agent Configuration
# Change the Portainer Agent ID to a unique identifier
# Ensure it is a random and secure string.
PORTAINER_AGENT_ID=UniqueAgentID12345

# Portainer Agent Key: Change this to a secure, strong key
# Avoid using predictable patterns or common phrases.
PORTAINER_AGENT_KEY=SecureAgentKey67890
```

- **`PORTAINER_AGENT_ID`**: A unique identifier for the Portainer agent. This ID
  should be a random and secure string to ensure the security of your Portainer
  environment.
- **`PORTAINER_AGENT_KEY`**: The key used to secure communication between the
  Portainer agent and Portainer server. This should also be a strong and unique
  string, avoiding easily guessable patterns to maintain security.

<br />

## Conclusion

This `docker-compose` file sets up a Docker environment for the Portainer Edge
Agent, a remote environment for managing Docker hosts. The configuration defines
a custom bridge network with specific IP settings and security configurations.
The Portainer Edge Agent service is configured to run continuously, with
persistent storage for application data and Docker volumes. The setup ensures
the Portainer Edge Agent runs efficiently and securely, with appropriate logging
and restart policies.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/portainer-edge-agent/docker-compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/portainer-edge-agent/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/portainer-edge-agent/stack.env
