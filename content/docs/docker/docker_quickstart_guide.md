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

weight: 2002

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

[Official Docker documentation for Fedora]:
  https://docs.docker.com/desktop/install/fedora
[Official Docker documentation for Ubuntu]:
  https://docs.docker.com/desktop/install/ubuntu
