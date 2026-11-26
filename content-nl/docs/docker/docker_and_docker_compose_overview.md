---
title: "Overzicht van Docker en Docker Compose"
description:
  "Ontdek Docker en Docker Compose met dit uitgebreide overzicht van hun
  functies, werking en voordelen voor ontwikkelen en uitrollen."
url: "docker/overview"
aliases: ""
icon: "overview"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Docker
series:
  - Docker
tags:
  - Docker
  - Docker Compose
  - containerization
  - development
  - deployment
keywords:
  - Docker
  - Docker Compose
  - containerization
  - development
  - deployment
  - container management
  - Dockerfile
  - Docker Compose file
  - Docker commands
  - Docker Desktop
  - Docker resources
  - Docker documentation
  - Docker contribution
  - Homelab-Alpha

weight: 4901

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Inleiding {#introduction}

Leuk dat je onze Docker-projecten hebt ontdekt! Hier vind je alles wat je nodig
hebt om je Docker-projecten soepel te draaien met Docker en Docker Compose.

Ons belangrijkste doel is om het opzetten van je Docker-projecten moeiteloos te
maken. Door de onderdelen van de toepassing met Docker in containers te zetten,
streven we naar consistentie in verschillende omgevingen en een eenvoudiger
beheer van afhankelijkheden.

Laat ons je dus helpen om prettiger te ontwikkelen en je projecten snel op te
zetten met Docker en Docker Compose!

## Wat is Docker? {#what-is-docker}

[Docker] is een platform om toepassingen in containers te ontwikkelen, uit te
rollen en te draaien. Een container is een zelfstandig, uitvoerbaar
softwarepakket met alles wat nodig is om een stuk software te draaien: code,
runtime, bibliotheken, systeemhulpmiddelen en instellingen.

Met Docker bouwen, delen en draaien ontwikkelaars containers in verschillende
omgevingen, los van de infrastructuur. Zo werkt software overal op dezelfde
manier.

## Wat is Docker Compose? {#what-is-docker-compose}

[Docker Compose] is een hulpmiddel om Docker-toepassingen met meerdere
containers te definiëren en te draaien. Met Compose maak je eenvoudig een
YAML-bestand om de services, netwerken en volumes van je app in te stellen,
zodat je je hele app met een paar commando's start.

### Basisgebruik {#basic-usage}

Gebruik deze Docker-commando's om een eenvoudige container te starten:

```bash
# Pull the latest image from Docker Hub
docker pull image_name

# Start a container
docker run image_name
```

Voor Docker Compose maak je een bestand `compose.yml` met de configuratie van je
app en voer je daarna dit commando uit:

```bash
docker compose up
```

Dit start alle services zoals ze in het YAML-bestand staan.

## Dockerfile

Een Dockerfile is een tekstbestand met instructies die Docker vertellen hoe een
Docker-image moet worden gebouwd. Je legt er de configuratie en de
afhankelijkheden van je toepassing in vast.

Hier is een voorbeeld van een eenvoudige Dockerfile:

```Dockerfile
# Use a base image
FROM ubuntu:20.04

# Install necessary packages
RUN apt-get update && apt-get install -y \
    package1 \
    package2

# Copy local source code to the container
COPY . /app

# Set the working directory in the container
WORKDIR /app

# Run command when starting the container
CMD ["python", "app.py"]
```

## Docker Compose-bestand {#docker-compose-file}

Een Docker Compose-bestand is een YAML-bestand dat de services, netwerken en
volumes van je toepassing definieert. Je laat er meerdere containers mee
samenwerken als één toepassing.

Hier is een voorbeeld van een eenvoudig Docker Compose-bestand:

```yaml
version: "3"

services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
  db:
    image: mysql:latest
    environment:
      MYSQL_ROOT_PASSWORD: example
```

## Veelgestelde vragen {#faqs}

**Wat is het verschil tussen Docker en Docker Compose?**\ Docker is een platform
om containers te draaien, terwijl Docker Compose een hulpmiddel is om
Docker-toepassingen met meerdere containers te definiëren en te draaien.

**Kan ik Docker op Windows en macOS gebruiken?**\ Ja, Docker Desktop werkt op
Windows, macOS en Linux.

**Hoe maak ik een eigen Docker-image?**\ Je maakt een eigen Docker-image door
een Dockerfile te schrijven met de configuratie en de afhankelijkheden van je
toepassing.

## Bronnen {#resources}

- [Documentatie van Docker][Docker Documentation]
- [Documentatie van Docker Compose][Docker Compose Documentation]

Dat was een snelle kennismaking met Docker en Docker Compose. Veel plezier met
containers! 🐳

## Bijdragen aan Homelab-Alpha - Docker {#contribute-to-homelab-alpha---docker}

We waarderen je bijdrage en willen het zo makkelijk mogelijk maken om bij te
dragen aan de repository Homelab-Alpha - docker. Wijzigingen gaan via pull
requests naar de branch `main`. Zie [bijdragen][contribute] om te lezen hoe je
kunt bijdragen.

## Licentie {#license}

Dit project valt onder de **Creative Commons
Naamsvermelding-NietCommercieel-GelijkDelen 4.0 Internationaal-licentie** (CC
BY-NC-SA 4.0). Zie de pagina [licentie][license] voor de volledige licentietekst
en het bestand [NOTICE] voor de eisen aan de naamsvermelding.

[Docker]: https://www.docker.com
[Docker Compose]: https://docs.docker.com/compose
[Docker Documentation]: https://docs.docker.com
[Docker Compose Documentation]: https://docs.docker.com/compose
[contribute]: /contributing/contribute/
[license]: /license/
[NOTICE]: https://github.com/homelab-alpha/docker/blob/main/NOTICE
