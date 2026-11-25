---
title: "Spoedcursus Docker"
description:
  "Ga aan de slag met Docker met deze spoedcursus over de belangrijkste
  begrippen, basiscommando's, het maken van Dockerfiles, het bouwen van images,
  het draaien van containers en het publiceren op Docker Hub."
url: "back-to-basics/docker/crash-course"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Docker
tags:
  - Docker
  - containers
  - Dockerfile
  - Docker Hub
  - DevOps
  - virtualization
  - deployment
keywords:
  - Docker basics
  - containerization
  - Docker commands
  - Docker images
  - Docker Desktop
  - Docker CLI
  - Docker Compose
  - Dockerizing applications
  - Docker Hub registry

weight: 2202

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

## Wat is Docker {#what-is-docker}

Docker is een platform waarmee je toepassingen in containers verpakt, verspreidt
en draait. Containers zijn lichte, draagbare omgevingen die op zichzelf staan en
alles bevatten wat een toepassing nodig heeft: de code, de runtime,
systeemhulpmiddelen, bibliotheken en instellingen.

## Belangrijke begrippen {#key-concepts}

- **Images**: Docker-images zijn alleen-lezen sjablonen met de toepassing en
  haar afhankelijkheden. Ze zijn de basis waarop containers worden gemaakt.
- **Containers**: containers zijn instanties van Docker-images. Het zijn lichte,
  draagbare en afgeschermde omgevingen waarin toepassingen draaien.
- **Dockerfile**: een Dockerfile is een tekstbestand met instructies om
  Docker-images te bouwen. Het beschrijft de omgeving en de configuratie van een
  toepassing.
- **Docker Hub**: Docker Hub is een registry in de cloud waar Docker-images
  worden gehost. Je deelt en verspreidt er images openbaar of privé.

## Aan de slag {#getting-started}

### Installatie {#installation}

Installeer Docker Desktop via de [officiële website][official website]. Na de
installatie zijn de commando's van de Docker-CLI (`docker`) en Docker Compose
(`docker compose`) beschikbaar in je terminal.

### Basiscommando's {#basic-commands}

- `docker run <image>`: start een container op basis van de opgegeven image.
- `docker pull <image>`: downloadt een image van Docker Hub.
- `docker build <path>`: bouwt een image van een Dockerfile op het opgegeven
  pad.
- `docker ps`: toont de draaiende containers.
- `docker images`: toont de gedownloade images.
- `docker stop <container>`: stopt een draaiende container.
- `docker rm <container>`: verwijdert een container.
- `docker rmi <image>`: verwijdert een image.

### Een Dockerfile maken {#creating-a-dockerfile}

Maak eerst een nieuwe map voor je project. Maak in die map een bestand met de
naam `Dockerfile`. Geef de basisimage op, kopieer de bestanden van de toepassing
en geef de commando's op om de toepassing te starten. Voorbeeld van een
Dockerfile:

```Dockerfile
FROM python:3.14
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

### Een image bouwen {#building-an-image}

Ga naar de map met de Dockerfile. Voer `docker build -t <image_name> .` uit om
de image te bouwen. Vervang `<image_name>` door een naam voor je image.

### Een container starten {#running-a-container}

Is de image gebouwd, dan start je een container met `docker run <image_name>`.
Je kunt extra opties opgeven, zoals poortkoppelingen, volumes en
omgevingsvariabelen.

### Publiceren op Docker Hub {#publishing-to-docker-hub}

Maak een account op Docker Hub als je dat nog niet hebt. Log in op Docker Hub
met `docker login`. Tag je image met je gebruikersnaam op Docker Hub en de naam
van de repository: `docker tag <image_name> <username>/<repository_name>`. Push
de image naar Docker Hub: `docker push <username>/<repository_name>`.

## Conclusie {#conclusion}

Docker maakt het bouwen, verspreiden en draaien van toepassingen eenvoudiger met
containers. Met Docker verpak je je toepassingen met hun afhankelijkheden, zodat
ze in verschillende omgevingen consistent en reproduceerbaar werken.
Experimenteer met Docker en ontdek wat er allemaal mogelijk is!

[official website]: https://www.docker.com/products/docker-desktop
