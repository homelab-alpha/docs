---
title: "Tips en trucs voor Docker"
description:
  "Haal meer uit Docker met waardevolle tips en trucs om je werk te
  optimaliseren: Docker Compose gebruiken, layer caching benutten, het gebruik
  van bronnen bewaken, hosts en containers beveiligen, updates automatiseren en
  meer."
url: "back-to-basics/docker/tips-and-tricks"
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
  - DevOps
  - containerization
  - Docker Compose
  - Docker Hub
  - Docker security
  - Docker optimization
  - Docker best practices
  - Docker monitoring
  - Docker updates
keywords:
  - Docker tips
  - Docker tricks
  - Docker best practices
  - Docker optimization techniques
  - Docker security practices
  - Docker Compose for local development
  - Docker layer caching
  - Docker container resource monitoring
  - Docker container lifecycle management
  - Docker container updates

weight: 2203

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

## Maak lokaal ontwikkelen eenvoudiger met Docker Compose {#simplify-local-development-with-docker-compose}

Docker Compose stroomlijnt lokaal ontwikkelen: je definieert toepassingen met
meerdere containers in één YAML-bestand en zet je ontwikkelomgeving met één
commando op, bijvoorbeeld:

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
  api:
    image: node:24-alpine
    ports:
      - "3000:3000"
    volumes:
      - ./api:/app
    environment:
      NODE_ENV: development
```

In dit voorbeeld definiëren we een toepassing met meerdere containers en twee
services: `web` en `api`. De service `web` gebruikt de image `nginx:alpine` en
zet poort `8080` op de host open, gekoppeld aan poort `80` in de container. De
service `api` gebruikt de image `node:24-alpine`, zet poort `3000` open, koppelt
de lokale map `./api` aan de map `/app` in de container en zet de
omgevingsvariabele `NODE_ENV` op `development`.

## Bouw sneller met layer caching van Docker {#optimize-build-times-with-docker-layer-caching}

Bouw je Dockerfiles zo op dat de cache zo goed mogelijk wordt benut: stabiele
instructies vooraan en wisselende instructies achteraan, voor een kortere
bouwtijd, bijvoorbeeld:

```Dockerfile
# Use a stable base image
FROM node:24-alpine AS base

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY . .

# Development stage
FROM base AS development

# Install development dependencies
RUN npm install --only=development

# Build stage
FROM development AS build

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Command to run the service
CMD ["nginx", "-g", "daemon off;"]
```

In deze voorbeeld-Dockerfile verkorten we de bouwtijd door de Dockerfile in
meerdere fasen op te delen. We beginnen met een basisfase (`base`), waarin we de
omgeving inrichten, de afhankelijkheden installeren en de code kopiëren. Daarna
volgt een ontwikkelfase (`development`), waarin we de afhankelijkheden voor
ontwikkeling installeren. Vervolgens is er een buildfase (`build`), waarin we de
toepassing bouwen. Tot slot is er een productiefase (`production`), waarin we
een minimale image van Nginx gebruiken, de gebouwde bestanden uit de buildfase
kopiëren, poort 80 openzetten en het commando opgeven waarmee de service start.

## Gebruik officiële Docker-images {#leverage-official-docker-images}

Bekijk de officiële images op Docker Hub voor veelgebruikte software, zodat je
profiteert van onderhouden, veilige en vaak bijgewerkte oplossingen voordat je
eigen images maakt, bijvoorbeeld:

Stel dat je een PostgreSQL-database nodig hebt voor je toepassing. In plaats van
een eigen image voor PostgreSQL te maken, gebruik je de officiële image van
PostgreSQL op Docker Hub.

```Dockerfile
# Use the official PostgreSQL image
FROM postgres:latest

# Optionally, add custom configurations or initialization scripts
COPY custom-config-file.conf /etc/postgresql/postgresql.conf
COPY init.sql /docker-entrypoint-initdb.d/
```

In dit voorbeeld beginnen we met de officiële image van PostgreSQL
(`postgres:latest`). Zo nodig voeg je eigen instellingen of initialisatiescripts
toe. De officiële image bespaart tijd en moeite, en je profiteert van
onderhouden en veilige software.

## Bewaak het gebruik van bronnen om te optimaliseren {#monitor-resource-usage-for-optimization}

Bewaak met commando's van de Docker-CLI of met orkestratiehulpmiddelen hoeveel
bronnen containers gebruiken, om de prestaties te verbeteren en bronnen
efficiënt te verdelen, bijvoorbeeld:

Met commando's van de Docker-CLI, zoals `docker stats`, bewaak je het gebruik
van bronnen. Bijvoorbeeld:

```plaintext
CONTAINER ID   NAME         CPU %   MEM USAGE / LIMIT     MEM %   NET I/O          BLOCK I/O        PIDS
6d88664275d3   portainer    0.33%   65.75MiB / 11.34GiB   0.57%   101MB / 265MB    138MB / 67.8MB   7
db83b0bfe11c   watchtower   0.00%   18.24MiB / 11.34GiB   0.16%   13.2MB / 4.3MB   27.3MB / 0B      10
```

Orkestratiehulpmiddelen als Docker Swarm of Kubernetes bieden ook uitgebreide
monitoring, zodat je de prestaties van containers in de tijd volgt en goed
onderbouwde keuzes maakt over de verdeling van bronnen.

Door het gebruik van bronnen te bewaken, vind je mogelijke knelpunten en verdeel
je bronnen beter, voor betere prestaties en efficiëntie.

## Laat containers sneller starten {#speed-up-container-startup-time}

Maak toepassingen sneller en schaalbaarder door minder afhankelijkheden te
gebruiken, opstartscripts te optimaliseren en multi-stage builds van Docker te
gebruiken, zodat containers sneller starten, bijvoorbeeld:

Stel dat je een Node.js-toepassing hebt waarvan de afhankelijkheden bij het
starten van de container worden geïnstalleerd. Met multi-stage builds van Docker
start de container sneller. Een voorbeeld van een Dockerfile:

```Dockerfile
# Stage 1: Build the application
FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

In dit voorbeeld gebruiken we een multi-stage build. De eerste fase (`build`)
installeert de afhankelijkheden, bouwt de toepassing en levert het resultaat op.
In de tweede fase gebruiken we een lichte image van Nginx en kopiëren we het
gebouwde resultaat uit de vorige fase. Zo wordt de container kleiner en start
die sneller.

## Automatiseer het beheer van de levenscyclus van containers {#automate-container-lifecycle-management}

Abonneer je op Docker-events om acties te automatiseren of meldingen te sturen
bij gebeurtenissen in de levenscyclus van containers, voor een soepele werking
en het vroeg oplossen van problemen, bijvoorbeeld:

Je kunt een eenvoudig script maken dat zich via de API of de opdrachtregel (CLI)
van Docker abonneert op Docker-events en op basis daarvan acties uitvoert. Een
eenvoudig voorbeeld met de CLI van Docker en een shellscript:

```bash
#!/bin/bash

# Subscribe to Docker events and filter container lifecycle events
docker events --filter event=start --filter event=die --filter event=stop --filter event=kill --filter event=pause --filter event=unpause --filter event=restart --filter event=oom --filter event=destroy --format '{{json .}}' |
while read event; do
    # Example: Send an email notification for container lifecycle events
    echo "Container event: $event" | mail -s "Docker Event" user@example.com
done
```

In dit voorbeeld abonneren we ons met het commando `docker events` op
Docker-events, gefilterd op gebeurtenissen in de levenscyclus van containers,
zoals start, die, stop, kill, pause, unpause, restart, oom (out of memory) en
destroy. Bij elke ontvangen gebeurtenis voeren we een actie uit, zoals een
melding per e-mail sturen.

Door het beheer van de levenscyclus van containers met Docker-events te
automatiseren, reageer je snel op veranderingen in je containeromgeving, voor
een soepele werking en het vroeg oplossen van problemen.

## Beveilig Docker-hosts en -containers {#secure-docker-hosts-and-containers}

Pas aanbevolen beveiligingswerkwijzen toe, zoals containers draaien met
gebruikers zonder rootrechten, capabilities beperken, de handtekeningen en
herkomst van images controleren en regelmatig bijwerken om kwetsbaarheden te
dichten, bijvoorbeeld:

Je verbetert de beveiliging door containers te draaien met gebruikers zonder
rootrechten. Een voorbeeld van een Dockerfile:

```Dockerfile
FROM node:24

# Create a non-root user
RUN useradd -m myuser

# Set the working directory and ownership
WORKDIR /app
RUN chown -R myuser:myuser /app

# Switch to the non-root user
USER myuser

# Copy application files
COPY . .

# Run the application
CMD ["node", "app.js"]
```

In dit voorbeeld maken we een gebruiker zonder rootrechten (`myuser`) en maken
we die eigenaar van de werkmap. Daarna wisselen we naar de gebruiker `myuser`,
voordat we de bestanden van de toepassing kopiëren en de toepassing starten. Dat
beperkt de beveiligingsrisico's van containers die als root draaien.

Daarnaast beveilig je je Docker-omgeving verder door capabilities te beperken,
images te scannen op kwetsbaarheden (bijvoorbeeld met Docker Scout of Trivy), de
handtekeningen van images te controleren (bijvoorbeeld met Sigstore Cosign) en
Docker en zijn afhankelijkheden regelmatig bij te werken om kwetsbaarheden te
dichten.

{{% alert context="primary" %}}
Docker Content Trust (DCT) is door Docker uitgefaseerd en wordt niet meer
aangeraden. Gebruik in plaats daarvan het ondertekenen van images en attestaties
op basis van Sigstore.
{{% /alert %}}

## Automatiseer updates met Watchtower {#automate-updates-with-watchtower}

{{% alert context="primary" %}}
Het oorspronkelijke project Watchtower (`containrrr/watchtower`) is gearchiveerd
en wordt niet meer onderhouden. Het voorbeeld hieronder gebruikt de actief
onderhouden fork van de gemeenschap, `nicholas-fedor/watchtower`. Andere
mogelijkheden zijn Diun (alleen meldingen van updates) of Renovate (pull
requests die de tags van images in je Compose-bestanden bijwerken).
{{% /alert %}}

Maak het onderhoud van containers eenvoudiger en beperk de uitvaltijd met
Watchtower, dat automatisch nieuwere versies ophaalt en containers opnieuw
start, zodat je uitrol actueel blijft, bijvoorbeeld:

Watchtower is een container die je Docker-containers in de gaten houdt en ze
bijwerkt zodra er wijzigingen zijn. Hieronder staat een voorbeeld van hoe je
Watchtower start:

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ghcr.io/nicholas-fedor/watchtower
```

Dit commando start Watchtower als container. Het koppelt de Docker-socket
(`/var/run/docker.sock`), zodat Watchtower met de Docker-daemon kan
communiceren. Watchtower controleert daarna regelmatig of er nieuwe images zijn
op Docker Hub of in je private registry. Vindt het die, dan haalt het de nieuwe
images op en start het de bijbehorende containers opnieuw.

Met Watchtower automatiseer je updates en stroomlijn je het onderhoud, zodat je
containers altijd de nieuwste versies draaien, met minder risico op
kwetsbaarheden en uitval.

## Optimaliseer Docker-volumes voor prestaties {#optimize-docker-volumes-for-performance}

Kies stuurprogramma's en plug-ins voor volumes op basis van je eisen aan
prestaties en schaalbaarheid, om meer uit volumes te halen en ze te koppelen aan
externe opslagsystemen, bijvoorbeeld:

Stel dat je een snelle databasetoepassing hebt die blijvende opslag nodig heeft.
Je optimaliseert Docker-volumes voor prestaties met een stuurprogramma voor
volumes dat bij je behoeften past, zoals `local-persist`.

```bash
docker volume create --driver local-persist --opt mountpoint=/mnt/database mydbvolume
```

In dit voorbeeld maken we het Docker-volume `mydbvolume` met het stuurprogramma
`local-persist`. Als koppelpunt geven we `/mnt/database` op, zodat het volume op
een plek staat die geschikt is voor goede prestaties.

Door stuurprogramma's en plug-ins voor volumes te kiezen op basis van je eisen
aan prestaties en schaalbaarheid, haal je meer uit volumes en koppel je
Docker-volumes soepel aan externe opslagsystemen, voor de beste prestaties van
je toepassingen.

## Documenteer de Docker-configuratie en -processen {#document-docker-configuration-and-processes}

Houd uitgebreide documentatie bij van de Docker-configuratie, Dockerfiles,
afhankelijkheden en uitrolprocessen, om samenwerken, inwerken en het oplossen
van problemen te stroomlijnen, bijvoorbeeld:

Hieronder staat een voorbeeld van hoe je je Docker-configuratie en -processen in
Markdown documenteert:

### Dockerfile

```Dockerfile
FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

### Configuratie van Docker Compose (docker-compose.yml) {#docker-compose-configuration-docker-composeyml}

```yml
services:
  web:
    build: .
    ports:
      - "8080:80"
    volumes:
      - ./app:/app
    environment:
      NODE_ENV: production
```

### Uitrolproces {#deployment-process}

1. Kloon de repository.
2. Bouw de Docker-image: `docker build -t myapp .`
3. Start de Docker-container: `docker run -d -p 8080:80 myapp`
4. Open de toepassing op [http://localhost:8080](http://localhost:8080).

### Problemen oplossen {#troubleshooting}

- Start de toepassing niet, bekijk dan de logs van Docker:
  `docker logs <container_id_or_name>`
- Controleer of de benodigde poorten nog niet in gebruik zijn:
  `sudo netstat -tuln | grep 8080`

Door de Docker-configuratie en -processen zo te documenteren, stroomlijn je
samenwerken, inwerken en het oplossen van problemen voor je team.

## Conclusie {#conclusion}

Met deze tips en trucs voor Docker werk je productiever, efficiënter en
betrouwbaarder bij het bouwen, uitrollen en beheren van toepassingen in
containers. Blijf nieuwe functies en bronnen van Docker verkennen om zoveel
mogelijk uit containers te halen in je projecten!
