---
title: "Snelstartgids voor Docker"
description: "Begin aan je reis met Docker met deze snelstartgids"
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

weight: 4902

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Fedora

{{% alert context="primary" %}}
[Officiële documentatie van Docker voor
Fedora][Official Docker documentation for Fedora]

Ondersteunde versies:

- Fedora 45
- Fedora 44
- Fedora 43

{{% /alert %}}

### De DNF-repository instellen {#set-up-the-dnf-repository}

Voordat je Docker Engine voor het eerst op een nieuwe host installeert, stel je
de Docker-repository in. Daarna installeer en werk je Docker bij vanuit de
repository.

Stel de repository in:

```bash
sudo dnf config-manager addrepo --from-repofile https://download.docker.com/linux/fedora/docker-ce.repo
```

### Docker Engine installeren {#install-docker-engine}

1. Installeer Docker Engine, containerd en Docker Compose:

   ```bash
   sudo dnf install -y \
    containerd.io \
    docker-buildx-plugin \
    docker-ce \
    docker-ce-cli \
    docker-compose-plugin
   ```

   Vraagt het systeem om de GPG-sleutel te accepteren, controleer dan of de
   vingerafdruk overeenkomt met
   `060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35`, en accepteer die als dat
   zo is.

   Dit commando installeert Docker, maar start het niet. Het maakt ook de groep
   docker, maar voegt standaard geen gebruikers aan die groep toe.

2. Start Docker:

   ```bash
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

3. Voeg de gebruiker toe aan de groep docker:

   ```bash
   sudo usermod -aG docker ${USER}
   ```

4. Controleer of de installatie van Docker Engine is gelukt door de image
   `hello-world` te starten:

   ```bash
   sudo docker run hello-world
   ```

   Dit commando downloadt een testimage en start die in een container. De
   container toont een bevestiging en stopt daarna.

   Je hebt Docker Engine nu geïnstalleerd en gestart.

   Is Docker geïnstalleerd, dan is Portainer eenvoudig op te zetten. Je kiest
   tussen de Portainer Community Edition (CE) en de Business Edition (BE).
   Kopieer en plak het commando uit de
   [snelle installatiegids voor Portainer](#quick-install-guide-portainer) om te
   beginnen.

### Docker Engine verwijderen {#uninstall-docker-engine}

1. Stop Docker:

   ```bash
   sudo systemctl disable docker
   sudo systemctl stop docker
   ```

2. Verwijder de gebruiker uit de groep docker:

   ```bash
   sudo gpasswd -d ${USER} docker
   ```

3. Verwijder de pakketten van Docker Engine, de CLI, containerd en Docker
   Compose:

   ```bash
   sudo dnf remove -y \
    docker-ce-rootless-extras \
    containerd.io \
    docker-buildx-plugin \
    docker-ce \
    docker-ce-cli \
    docker-compose-plugin
   ```

4. Images, containers, volumes en eigen configuratiebestanden op je host worden
   niet automatisch verwijderd. Zo verwijder je alle images, containers en
   volumes.

   Gewijzigde configuratiebestanden moet je met de hand verwijderen:

   ```bash
   sudo rm -rf /var/lib/docker
   sudo rm -rf /var/lib/containerd
   ```

   Je hebt Docker Engine nu verwijderd.

## Ubuntu

{{% alert context="primary" %}}
[Officiële documentatie van Docker voor
Ubuntu][Official Docker documentation for Ubuntu]

Ondersteunde versies:

- Ubuntu Stonking 26.10
- Ubuntu Resolute 26.04 (LTS)
- Ubuntu Noble 24.04 (LTS)
- Ubuntu Jammy 22.04 (LTS)

{{% /alert %}}

### De APT-repository instellen {#set-up-the-apt-repository}

Voordat je Docker Engine voor het eerst op een nieuwe host installeert, stel je
de Docker-repository in. Daarna installeer en werk je Docker bij vanuit de
repository:

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt-get update
```

{{% alert context="primary" %}}
Distributies die van Ubuntu zijn afgeleid, zoals Linux Mint, worden niet
officieel ondersteund, al kunnen ze werken. Het commando hierboven gebruikt
**UBUNTU_CODENAME** als die is ingesteld, zodat het ook de Ubuntu-basis van een
afgeleide distributie vindt. {{% /alert %}}

### Docker Engine installeren {#install-docker-engine-1}

1. Installeer Docker Engine, containerd en Docker Compose:

   ```bash
   sudo apt-get -y install \
    containerd.io \
    docker-buildx-plugin \
    docker-ce \
    docker-ce-cli \
    docker-compose-plugin
   ```

   Dit commando installeert Docker, maar start het niet. Het maakt ook de groep
   docker, maar voegt standaard geen gebruikers aan die groep toe.

2. Start Docker:

   ```bash
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

3. Voeg de gebruiker toe aan de groep docker:

   ```bash
   sudo usermod -aG docker ${USER}
   ```

4. Controleer of de installatie van Docker Engine is gelukt door de image
   `hello-world` te starten:

   ```bash
   sudo docker run hello-world
   ```

   Dit commando downloadt een testimage en start die in een container. De
   container toont een bevestiging en stopt daarna.

   Je hebt Docker Engine nu geïnstalleerd en gestart.

   Is Docker geïnstalleerd, dan is Portainer eenvoudig op te zetten. Je kiest
   tussen de Portainer Community Edition (CE) en de Business Edition (BE).
   Kopieer en plak het commando uit de
   [snelle installatiegids voor Portainer](#quick-install-guide-portainer) om te
   beginnen.

### Docker Engine verwijderen {#uninstall-docker-engine-1}

1. Stop Docker:

   ```bash
   sudo systemctl disable docker
   sudo systemctl stop docker
   ```

2. Verwijder de gebruiker uit de groep docker:

   ```bash
   sudo deluser ${USER} docker
   ```

3. Verwijder de pakketten van Docker Engine, de CLI, containerd en Docker
   Compose:

   ```bash
   sudo apt-get purge -y \
    containerd.io \
    docker-buildx-plugin \
    docker-ce \
    docker-ce-cli \
    docker-ce-rootless-extras \
    docker-compose-plugin
   ```

4. Images, containers, volumes en eigen configuratiebestanden op je host worden
   niet automatisch verwijderd. Zo verwijder je alle images, containers en
   volumes.

   Gewijzigde configuratiebestanden moet je met de hand verwijderen:

   ```bash
   sudo rm -rf /var/lib/docker
   sudo rm -rf /var/lib/containerd
   ```

5. Verwijder de bronlijst en de sleutelbos:

   ```bash
   sudo rm /etc/apt/sources.list.d/docker.sources
   sudo rm /etc/apt/keyrings/docker.asc
   ```

   Je hebt Docker Engine nu verwijderd.

## Snelle installatiegids voor Portainer {#quick-install-guide-portainer}

Is Docker geïnstalleerd, dan is Portainer eenvoudig op te zetten. Je kiest
tussen de Portainer Community Edition (CE) en de Business Edition (BE). Kopieer
en plak het commando uit de
[snelle installatiegids voor Portainer](#quick-install-guide-portainer) in je
terminal en druk op Enter. Docker maakt het benodigde netwerk en haalt de
Portainer-container op van Docker Hub.

Open daarna je browser en ga naar het IP-adres van de lokale machine waarop
Docker is geïnstalleerd. Is het IP-adres van je server bijvoorbeeld
`192.168.10.10`, ga dan naar `https://192.168.10.10:9443` om de interface van
Portainer te openen. Volg de instructies daar om de installatie van Portainer af
te ronden.

Gefeliciteerd, je hebt Portainer nu geïnstalleerd. Vanaf nu gebruik je Portainer
om nieuwe Docker-projecten te starten.

{{% alert context="primary" %}}
**Let op:** gebruik je een van de commando's voor docker run of de Docker
Compose-bestanden van Homelab-Alpha, dan worden blijvende volumes gebruikt. De
gegevens van je containers vind je in de hoofdmap `/docker`. Alle gegevens van
de Portainer-container staan bijvoorbeeld in `/docker/portainer`. {{% /alert %}}

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
  --label "com.portainer.network.description"="is an isolated bridge network." \
  portainer_net

docker run \
  --detach \
  --network portainer_net \
  --restart always \
  --log-driver json-file \
  --log-opt max-size=1M \
  --log-opt max-file=2 \
  --stop-timeout 60 \
  --name portainer \
  --pull missing \
  --volume /docker/portainer/production/app:/data \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --env TZ=Europe/Amsterdam \
  --domainname portainer.local \
  --hostname portainer \
  --ip 172.20.1.2 \
  --publish 8000:8000/tcp \
  --publish 9443:9443/tcp \
  --pids-limit 512 \
  --security-opt="no-new-privileges=true" \
  --label "com.docker.compose.project"="portainer" \
  --label "com.portainer.description"="deploy, configure, troubleshoot and secure containers." \
  --no-healthcheck \
  docker.io/portainer/portainer-ce:lts
```

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
  --label "com.portainer.network.description"="is an isolated bridge network." \
  portainer_net

docker run \
  --detach \
  --network portainer_net \
  --restart always \
  --log-driver json-file \
  --log-opt max-size=1M \
  --log-opt max-file=2 \
  --stop-timeout 60 \
  --name portainer \
  --pull missing \
  --volume /docker/portainer/production/app:/data \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --env TZ=Europe/Amsterdam \
  --domainname portainer.local \
  --hostname portainer \
  --ip 172.20.1.2 \
  --publish 8000:8000/tcp \
  --publish 9443:9443/tcp \
  --pids-limit 512 \
  --security-opt="no-new-privileges=true" \
  --label "com.docker.compose.project"="portainer" \
  --label "com.portainer.description"="deploy, configure, troubleshoot and secure containers." \
  --no-healthcheck \
  docker.io/portainer/portainer-ee:lts
```

[Official Docker documentation for Fedora]:
  https://docs.docker.com/engine/install/fedora/
[Official Docker documentation for Ubuntu]:
  https://docs.docker.com/engine/install/ubuntu/
