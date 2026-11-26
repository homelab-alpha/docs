---
title: "Spoedcursus Docker Compose"
description:
  "Leer Docker Compose vanaf de basis met deze uitgebreide spoedcursus. Verken
  het beheer en de orkestratie van Docker-containers en DevOps-werkwijzen."
url: "back-to-basics/docker-compose/crash-course"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Docker Compose
tags:
  - Docker
  - Containerization
  - Orchestration
  - DevOps
keywords:
  - Docker Compose
  - Docker container management
  - Container orchestration
  - Docker deployment
  - Docker development
  - Docker Compose tutorial

weight: 2302

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

## Wat is Docker Compose {#what-is-docker-compose}

Docker Compose is een krachtig hulpmiddel om meerdere Docker-containers als één
samenhangende toepassing te beheren. Het maakt het bouwen, draaien en beheren
van complexe toepassingen eenvoudiger met één configuratiebestand.

## Installatie {#installation}

Zorg voordat je met Docker Compose begint dat zowel Docker als Docker Compose op
je systeem is geïnstalleerd. De installatie-instructies vind je op de [officiële
website van Docker][official Docker website]. Docker Compose zit in Docker
Desktop. Op Linux installeer je het pakket `docker-compose-plugin` met je
pakketbeheerder. Je start Compose met `docker compose` (zonder koppelteken). Het
oude losse commando `docker-compose` (v1) wordt niet meer onderhouden.

## Het YAML-bestand van Docker Compose {#the-docker-compose-yaml-file}

De kern van Docker Compose is het YAML-configuratiebestand (`compose.yaml` of
`docker-compose.yml`), waarin je de configuratie van je services definieert. De
sleutel `version` op het hoogste niveau is verouderd en hoort niet meer te
worden gebruikt. Een overzicht:

```yaml
services: # List of services to run
  service1: # Service name
    image: image1:tag # Docker image to use
    ports: # Port forwarding (optional)
      - "8000:8000"
    environment: # Environment variables (optional)
      - ENV_VAR=value
```

## Veelgebruikte commando's {#common-commands}

- `docker compose up`: bouwt, maakt (opnieuw) en start alle services.
- `docker compose down`: stopt en verwijdert alle services, samen met de
  bijbehorende netwerken en volumes.
- `docker compose ps`: toont de status van alle services.
- `docker compose logs`: toont de logs van alle services.
- `docker compose exec <service> <command>`: voert een commando uit in een
  draaiende service.

## Tips van professionals {#pro-tips}

### Netwerkconfiguratie {#network-configuration}

Je kunt eigen netwerken definiëren in je Docker Compose-bestand, zodat services
afgeschermd met elkaar communiceren, bijvoorbeeld:

```yaml
services:
  web:
    image: nginx
    networks:
      - my-network

  db:
    image: postgres
    networks:
      - my-network

networks:
  my-network:
    driver: bridge
```

Dit voorbeeld laat zien hoe je in een Docker Compose-bestand het eigen netwerk
`my-network` definieert en services (`web` en `db`) aan dit netwerk koppelt,
zodat ze afgeschermd met elkaar communiceren.

### Volumes

Gebruik volumes om gegevens te bewaren, ook nadat containers zijn gestopt,
bijvoorbeeld:

```yaml
services:
  web:
    image: nginx
    volumes:
      - my-volume:/usr/share/nginx/html

volumes:
  my-volume:
```

In dit voorbeeld wordt het volume `my-volume` gedefinieerd en gekoppeld aan de
map `/usr/share/nginx/html` in de container van de service `web`. Zo blijven de
gegevens in deze map bewaard, ook als de container wordt gestopt of verwijderd.

### Herstartbeleid {#restart-policy}

Stel per service het herstartbeleid in, om te bepalen hoe die reageert op
crashes, bijvoorbeeld:

```yaml
services:
  web:
    image: nginx
    restart: always

  backend:
    image: my-backend
    restart: on-failure
```

In dit voorbeeld heeft de service `web` het herstartbeleid `always`: Docker
probeert de container altijd opnieuw te starten als die om welke reden ook
stopt. De service `backend` heeft het herstartbeleid `on-failure`: Docker start
de container alleen opnieuw als die stopt met een afsluitcode die niet nul is
(dus als die mislukt).

### Geheimen en configuraties {#secrets-and-configurations}

Gebruik Docker Secrets of externe configuratiebronnen om gevoelige gegevens,
zoals wachtwoorden, te beheren, bijvoorbeeld:

```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: ./db_password.txt
```

In dit voorbeeld wordt het Docker-geheim `db_password` gemaakt, dat het
wachtwoord leest uit het bestand `db_password.txt`. Dit geheim wordt in de
container van de service `db` gekoppeld op het pad `/run/secrets/db_password`,
zodat de PostgreSQL-container het wachtwoord veilig kan lezen zonder dat het in
het Docker Compose-bestand staat.

## Gevorderde functies {#advanced-features}

### Overrides in Docker Compose {#docker-compose-overrides}

Gebruik meerdere YAML-bestanden om verschillende configuraties te definiëren
voor verschillende omgevingen (bijv. ontwikkeling, staging, productie),
bijvoorbeeld:

Stel dat je een basisbestand `docker-compose.yml` hebt:

```yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
```

Voor de ontwikkelomgeving kun je dan een bestand `docker-compose.override.yml`
hebben:

```yaml
services:
  web:
    ports:
      - "8080:80"
    environment:
      DEBUG: "true"
    volumes:
      - ./html:/usr/share/nginx/html
```

In dit voorbeeld overschrijft het bestand `docker-compose.override.yml` bepaalde
instellingen uit het basisbestand `docker-compose.yml` voor de
ontwikkelomgeving. Hier worden de `ports` en de `environment` van de service
`web` aangepast aan de ontwikkelomgeving, terwijl de koppeling van het volume
gelijk blijft.

Dit voorbeeld laat zien hoe je met override-bestanden van Docker Compose
configuraties per omgeving aanpast, met een gemeenschappelijke basisconfiguratie
in het bestand `docker-compose.yml`.

### Services schalen {#service-scaling}

Schaal services eenvoudig op of af naar behoefte, bijvoorbeeld:

Stel dat je een eenvoudig bestand `docker-compose.yml` hebt met één service:

```yaml
services:
  web:
    image: nginx
```

Om de service `web` met meerdere containers te draaien, gebruik je het commando
`docker compose`:

```bash
docker compose up -d --scale web=3
```

Dit commando laat Docker Compose drie instanties van de service `web` starten.
Je past het aantal aan naar behoefte. Door services te schalen verdeel je het
werk over meerdere containers, wat de prestaties en de weerbaarheid verbetert.

In dit voorbeeld schaalt het commando `docker compose up -d --scale web=3` de
service `web` naar drie instanties van de container `nginx`. Zo zie je hoe
eenvoudig je met Docker Compose services schaalt naar wisselende vraag.

## Conclusie {#conclusion}

Docker Compose verandert de manier waarop je Docker-toepassingen ontwikkelt,
test en uitrolt. Verken de mogelijkheden en zie hoe het je werk soepeler maakt!

[official Docker website]: https://docs.docker.com/get-started/get-docker/
