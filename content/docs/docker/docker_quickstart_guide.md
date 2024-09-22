---
title: "Docker Quickstart Guide"
description: "Start Your Docker Journey with This Quickstart Guide"
url: "docker/quickstart"
aliases: ""
icon: "rocket_launch"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Docker
series:
  - Docker
tags:
  - Containerization
  - DevOps
  - Docker
  - Linux
keywords:
  - deployment
  - development
  - Docker Compose
  - Docker Engine
  - Docker installation
  - Docker installation
  - Docker quickstart
  - Docker setup
  - Docker uninstallation

weight: 4002

toc: true
katex: true
---

<br />

## Fedora

{{% alert context="primary" %}}
[Official Docker documentation for Fedora] {{% /alert %}}

### Set up the DNF repository

Before you install Docker Engine for the first time on a new host machine, you
need to set up the Docker repository. Afterward, you can install and update
Docker from the repository.

Install the `dnf-plugins-core` package (which provides the commands to manage
your dnf repositories) and set up the repository:

```bash
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
```

<br />

### Install Docker Engine

1. Install Docker Engine, containerd, and Docker Compose:

   ```bash
   sudo dnf install -y \
    containerd.io \
    docker-buildx-plugin \
    docker-ce \
    docker-ce-cli \
    docker-compose \
    docker-compose-plugin
   ```

   If prompted to accept the GPG key, verify that the fingerprint matches\
   `060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35`, and if so, accept it.

   This command installs Docker, but it doesn't start Docker. It also creates a
   docker group, however, it doesn't add any users to the group by default.

2. Start Docker:

   ```bash
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

3. Add user to docker group:

   ```bash
   sudo usermod -aG docker ${USER}
   ```

4. Verify that the Docker Engine installation is successful by running the
   `hello-world` image:

   ```bash
   sudo docker run hello-world
   ```

   This command downloads a test image and runs it in a container. When the
   container runs, it prints a confirmation message and exits.

   You have now successfully installed and started Docker Engine.

   Once Docker is installed, setting up Portainer is straightforward. You can
   choose between the Portainer Community Edition (CE) or the Business Edition
   (BE). Simply copy and paste the command from the
   [quick install guide portainer](#quick-install-guide-portainer) to get started.

<br />

### Uninstall Docker Engine

1. Stop Docker:

   ```bash
   sudo systemctl disable docker
   sudo systemctl stop docker
   ```

2. Remove user from the docker group:

   ```bash
   sudo deluser ${USER} docker
   ```

3. Uninstall the Docker Engine, CLI, containerd, and Docker Compose packages:

   ```bash
   sudo dnf remove -y \
    docker-ce-rootless-extras \
    containerd.io \
    docker-buildx-plugin \
    docker-ce \
    docker-ce-cli \
    docker-compose \
    docker-compose-plugin
   ```

4. Images, containers, volumes, or custom configuration files on your host
   aren't automatically removed. To delete all images, containers, and volumes.

   You have to delete any edited configuration files manually:

   ```bash
   sudo rm -rf /var/lib/docker
   sudo rm -rf /var/lib/containerd
   ```

   You have now successfully uninstalled Docker Engine.

<br />

## Ubuntu

{{% alert context="primary" %}}
[Official Docker documentation for Ubuntu] {{% /alert %}}

### Set up the APT repository

Before you install Docker Engine for the first time on a new host machine, you
need to set up the Docker repository. Afterward, you can install and update
Docker from the repository:

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

<br />

{{% alert context="primary" %}}
If you use an Ubuntu derivative distro, such as Linux Mint, you may need to use
**UBUNTU_CODENAME** instead of **VERSION_CODENAME**. {{% /alert %}}

<br />

### Install Docker Engine

1. Install Docker Engine, containerd, and Docker Compose:

   ```bash
   sudo apt-get -y install \
    containerd.io \
    docker-buildx-plugin \
    docker-ce \
    docker-ce-cli \
    docker-compose \
    docker-compose-plugin
   ```

   This command installs Docker, but it doesn't start Docker. It also creates a
   docker group, however, it doesn't add any users to the group by default.

2. Start Docker:

   ```bash
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

3. Add user to docker group:

   ```bash
   sudo usermod -aG docker ${USER}
   ```

4. Verify that the Docker Engine installation is successful by running the
   `hello-world` image:

   ```bash
   sudo docker run hello-world
   ```

   This command downloads a test image and runs it in a container. When the
   container runs, it prints a confirmation message and exits.

   You have now successfully installed and started Docker Engine.

   Once Docker is installed, setting up Portainer is straightforward. You can
   choose between the Portainer Community Edition (CE) or the Business Edition
   (BE). Simply copy and paste the command from the
   [quick install guide portainer](#quick-install-guide-portainer) to get started.

<br />

### Uninstall Docker Engine

1. Stop Docker:

   ```bash
   sudo systemctl disable docker
   sudo systemctl stop docker
   ```

2. Remove user from the docker group:

   ```bash
   sudo deluser ${USER} docker
   ```

3. Uninstall the Docker Engine, CLI, containerd, and Docker Compose packages:

   ```bash
   sudo apt-get purge -y \
    containerd.io \
    docker-buildx-plugin \
    docker-ce \
    docker-ce-cli \
    docker-ce-rootless-extras \
    docker-compose \
    docker-compose-plugin
   ```

4. Images, containers, volumes, or custom configuration files on your host
   aren't automatically removed. To delete all images, containers, and volumes.

   You have to delete any edited configuration files manually:

   ```bash
   sudo rm -rf /var/lib/docker
   sudo rm -rf /var/lib/containerd
   ```

   You have now successfully uninstalled Docker Engine.

<br />

## Quick install guide Portainer

Once Docker is installed, setting up Portainer is straightforward. You can
choose between the Portainer Community Edition (CE) or the Business Edition
(BE). Simply copy and paste the command from the
[quick install guide portainer](#quick-install-guide-portainer) into your
terminal and hit enter. Docker will create the necessary network and pull the
Portainer container from Docker Hub.

After that, open your browser and navigate to the IP address of your local
machine where Docker is installed. For example, if your server's IP address is
`192.168.10.10`, go to `http://192.168.10.10:9000` or
`https://192.168.10.10:9443` to access the Portainer GUI. Follow the
instructions there to complete the installation of Portainer.

Congratulations, you have now installed Portainer. From now on, you will use
Portainer to start new Docker projects.

{{% alert context="primary" %}}
**Note:**
If you use one of Homelab-Alpha's Docker run commands or Docker Compose files,
persistent volumes are utilized. You can find your data from your containers in
the root directory named `docker/`. For example, all data from the Portainer
container is stored in `docker/portainer`. {{% /alert %}}

### Community Edition (CE)

```bash
docker network create \
  --driver=bridge \
  --subnet=172.20.1.0/24 \
  --ip-range=172.20.1.0/24 \
  --gateway=172.20.1.1 \
  --opt "com.docker.network.bridge.default_bridge"="false" \
  --opt "com.docker.network.bridge.enable_icc"="true" \
  --opt "com.docker.network.bridge.enable_ip_masquerade"="true" \
  --opt "com.docker.network.bridge.host_binding_ipv4"="0.0.0.0" \
  --opt "com.docker.network.bridge.name"="portainer" \
  --opt "com.docker.network.driver.mtu"="1500" \
  --label "com.portainer.network.description"="is an isolated network." \
  portainer_net

docker run \
  --detach \
  --network portainer_net \
  --restart always \
  --log-driver json-file \
  --log-opt max-size=1M \
  --log-opt max-file=2 \
  --name portainer \
  --pull missing \
  --volume /docker/portainer/production/app:/data \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --env TZ=Europe/Amsterdam \
  --domainname portainer.local \
  --hostname portainer \
  --ip 172.20.1.2 \
  --publish 8000:8000/tcp \
  --publish 8000:8000/udp \
  --publish 9000:9000/tcp \
  --publish 9000:9000/udp \
  --publish 9443:9443/tcp \
  --publish 9443:9443/udp \
  --security-opt="no-new-privileges=true" \
  --label "com.docker.compose.project"="portainer" \
  --label "com.portainer.description"="deploy, configure, troubleshoot and secure containers." \
  --no-healthcheck \
  portainer/portainer-ce:latest
```

<br />

### Business Edition (BE)

```bash
docker network create \
  --driver=bridge \
  --subnet=172.20.1.0/24 \
  --ip-range=172.20.1.0/24 \
  --gateway=172.20.1.1 \
  --opt "com.docker.network.bridge.default_bridge"="false" \
  --opt "com.docker.network.bridge.enable_icc"="true" \
  --opt "com.docker.network.bridge.enable_ip_masquerade"="true" \
  --opt "com.docker.network.bridge.host_binding_ipv4"="0.0.0.0" \
  --opt "com.docker.network.bridge.name"="portainer" \
  --opt "com.docker.network.driver.mtu"="1500" \
  --label "com.portainer.network.description"="is an isolated network." \
  portainer_net

docker run \
  --detach \
  --network portainer_net \
  --restart always \
  --log-driver json-file \
  --log-opt max-size=1M \
  --log-opt max-file=2 \
  --name portainer \
  --pull missing \
  --volume /docker/portainer/production/app:/data \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --env TZ=Europe/Amsterdam \
  --domainname portainer.local \
  --hostname portainer \
  --ip 172.20.1.2 \
  --publish 8000:8000/tcp \
  --publish 8000:8000/udp \
  --publish 9000:9000/tcp \
  --publish 9000:9000/udp \
  --publish 9443:9443/tcp \
  --publish 9443:9443/udp \
  --security-opt="no-new-privileges=true" \
  --label "com.docker.compose.project"="portainer" \
  --label "com.portainer.description"="deploy, configure, troubleshoot and secure containers." \
  --no-healthcheck \
  portainer/portainer-ee:latest
```

[Official Docker documentation for Fedora]:
  https://docs.docker.com/desktop/install/fedora
[Official Docker documentation for Ubuntu]:
  https://docs.docker.com/desktop/install/ubuntu
