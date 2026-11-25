---
title: "Tips en trucs voor Docker Compose"
description:
  "Leer belangrijke tips en trucs voor Docker Compose om je werk te stroomlijnen
  en containers beter te beheren."
url: "back-to-basics/docker-compose/tips-and-tricks"
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
  - docker
  - containers
  - development
  - deployment
  - optimization
keywords:
  - Docker Compose
  - Docker tips
  - Docker tricks
  - container management
  - container orchestration
  - Docker best practices
  - Docker optimization
  - Docker security

weight: 2303

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

## Gebruik `.env`-bestanden voor omgevingsvariabelen {#use-env-files-for-environment-variables}

Zet omgevingsvariabelen niet vast in je `docker-compose.yml`, maar gebruik
`.env`-bestanden om gevoelige gegevens apart en veilig te houden, bijvoorbeeld:

Stel dat je een `.env`-bestand met je omgevingsvariabelen hebt:

DB_USERNAME=myuser\ DB_PASSWORD=secretpassword

En je bestand `docker-compose.yml` verwijst naar deze variabelen:

```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

In dit voorbeeld gebruikt het bestand `docker-compose.yml` omgevingsvariabelen
uit het bestand `.env` (`${DB_USERNAME}` en `${DB_PASSWORD}`). Zo blijven
gevoelige gegevens buiten het Compose-bestand, wat het beheer makkelijker en
veiliger maakt.

Dit voorbeeld laat zien hoe je `.env`-bestanden gebruikt om gevoelige
omgevingsvariabelen apart van je `docker-compose.yml` te bewaren, voor meer
veiligheid en een eenvoudiger beheer.

## Gebruik overrides van Docker Compose {#leverage-docker-compose-overrides}

Gebruik override-bestanden van Docker Compose (`docker-compose.override.yml`) om
configuraties voor ontwikkeling te definiëren zonder het hoofdbestand
`docker-compose.yml` te wijzigen, bijvoorbeeld:

Stel dat je een basisbestand `docker-compose.yml` hebt met één service:

```yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"
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
```

In dit voorbeeld overschrijft het bestand `docker-compose.override.yml` bepaalde
instellingen uit het basisbestand `docker-compose.yml` voor de
ontwikkelomgeving. Hier worden de `ports` van de service `web` aangepast om
poort 8080 open te zetten, en komt de omgevingsvariabele `DEBUG` erbij, zonder
het hoofdbestand `docker-compose.yml` te wijzigen. Zo beheer je configuraties
per omgeving eenvoudig.

Dit voorbeeld laat zien hoe je met override-bestanden van Docker Compose
configuraties per omgeving definieert zonder het hoofdbestand
`docker-compose.yml` te wijzigen, wat het beheer van verschillende omgevingen
eenvoudiger maakt.

## Ga verstandig om met de build-context {#utilize-build-contexts-wisely}

Let op de build-context in je `docker-compose.yml`. Neem alleen de nodige
bestanden op, zodat het bouwen sneller gaat en er minder onnodige gegevens
worden overgedragen, bijvoorbeeld:

Stel dat je project deze mapstructuur heeft:

```treeview
project/
├── app/
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
└── docker-compose.yml
```

En je bestand `docker-compose.yml` gebruikt de map `app` als build-context:

```yaml
services:
  web:
    build: ./app
```

In dit voorbeeld gebruikt het bestand `docker-compose.yml` de map `app` als
build-context voor de service `web`. Door alleen de nodige bestanden in de map
`app` te zetten (bijv. de Dockerfile, de broncode en de afhankelijkheden), gaat
het bouwen sneller en worden er minder onnodige gegevens overgedragen. Zet geen
grote, overbodige bestanden of mappen in de build-context, voor betere
prestaties bij het bouwen.

Dit voorbeeld laat zien hoe je op de build-context in je `docker-compose.yml`
let en alleen de nodige bestanden opneemt, voor een sneller bouwproces en minder
onnodige gegevensoverdracht.

## Optimaliseer multi-stage builds {#optimize-multi-stage-builds}

Gebruik multi-stage builds in je Dockerfiles om images kleiner te maken en
sneller te bouwen, vooral voor productieomgevingen, bijvoorbeeld:

Neem een Dockerfile voor een Python-toepassing:

```Dockerfile
# Stage 1: Build the application
FROM python:3.14 as builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Stage 2: Create the final lightweight image
FROM python:3.14-slim

WORKDIR /app

COPY --from=builder /app .

CMD ["python", "app.py"]
```

In dit voorbeeld gebruikt de Dockerfile multi-stage builds. De eerste fase
(`builder`) installeert de afhankelijkheden van de toepassing en kopieert de
code. In de tweede fase worden alleen de nodige onderdelen uit de eerste fase
(`builder`) gekopieerd. De uiteindelijke image bevat zo alleen de toepassing en
haar afhankelijkheden: kleiner en sneller.

Dit voorbeeld laat zien hoe je multi-stage builds in Dockerfiles gebruikt om de
grootte van images en de bouwsnelheid te verbeteren, vooral handig in
productieomgevingen waar efficiënt gebruik van bronnen belangrijk is.

## Health checks voor services {#health-checks-for-services}

Stel health checks in voor je services in Docker Compose, zodat alleen gezonde
containers verkeer krijgen en de betrouwbaarheid toeneemt, bijvoorbeeld:

Stel dat je een bestand `docker-compose.yml` hebt met een service met een health
check:

```yaml
services:
  web:
    image: nginx
    ports:
      - "80:80"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

In dit voorbeeld heeft de service `web` een health check. Het commando
`(CMD curl -f http://localhost)` controleert of de service bereikbaar is door
met `curl` de startpagina op te halen. De health check draait elke 30 seconden
(`interval`), met een time-out van 10 seconden (`timeout`) per controle, en
probeert het tot 3 keer opnieuw (`retries`) voordat de container als ongezond
geldt. Met health checks krijgen alleen gezonde containers verkeer, wat de
betrouwbaarheid van je toepassing verbetert.

Dit voorbeeld laat zien hoe je health checks instelt voor services in Docker
Compose, zodat alleen gezonde containers verkeer krijgen en je toepassing
betrouwbaarder wordt.

## Netwerkconfiguratie {#networking-configuration}

Gebruik de netwerkfuncties van Docker Compose om eigen netwerken en aliassen te
definiëren, zodat services met elkaar communiceren en toch afgeschermd blijven,
bijvoorbeeld:

Stel dat je een bestand `docker-compose.yml` hebt met meerdere services:

```yaml
services:
  web:
    image: nginx
    networks:
      - backend
  api:
    image: myapi
    networks:
      - backend
      - frontend
networks:
  backend:
  frontend:
    driver: bridge
```

In dit voorbeeld worden twee eigen netwerken gedefinieerd: `backend` en
`frontend`. De service `web` is gekoppeld aan het netwerk `backend`, en de
service `api` aan zowel `backend` als `frontend`. Zo communiceren services met
elkaar en blijven ze toch afgeschermd. Daarnaast kunnen services op het netwerk
`frontend` via service-aliassen communiceren met services op het netwerk
`backend`.

Dit voorbeeld laat zien hoe je met de netwerkfuncties van Docker Compose eigen
netwerken en aliassen definieert, voor soepele communicatie tussen services met
behoud van afscherming.

## Herstartbeleid voor containers {#container-restart-policies}

Stel in je `docker-compose.yml` een herstartbeleid in, zodat containers na een
fout automatisch opnieuw starten en je services beschikbaar blijven,
bijvoorbeeld:

Stel dat je een bestand `docker-compose.yml` hebt met een service met een
herstartbeleid:

```yaml
services:
  web:
    image: nginx
    restart: always
```

In dit voorbeeld heeft de service `web` het herstartbeleid `always`. Docker
Compose start de container dan automatisch opnieuw als die om welke reden ook
stopt, zodat de service beschikbaar blijft. Je kunt ook een specifieker beleid
instellen, zoals `on-failure` of `unless-stopped`, afhankelijk van wat je nodig
hebt. Een herstartbeleid helpt de betrouwbaarheid en beschikbaarheid van je
services te behouden.

Dit voorbeeld laat zien hoe je in Docker Compose een herstartbeleid instelt,
zodat containers na een fout automatisch opnieuw starten en je services
beschikbaar blijven.

## Volumes voor blijvende gegevens {#volume-mounting-for-persistent-data}

Gebruik volumes in Docker Compose om gegevens van je containers te bewaren,
zodat belangrijke informatie behouden blijft als containers opnieuw starten,
bijvoorbeeld:

Stel dat je een bestand `docker-compose.yml` hebt met een service met een
volume:

```yaml
services:
  db:
    image: postgres
    volumes:
      - myvolume:/var/lib/postgresql/data

volumes:
  myvolume:
```

In dit voorbeeld heeft de service `db` het volume `myvolume`, gekoppeld aan de
map `/var/lib/postgresql/data` in de container. Zo worden de gegevens van de
PostgreSQL-database blijvend op de host bewaard en gaan ze niet verloren als de
container opnieuw start. Volumes zijn onmisbaar om belangrijke gegevens en
configuraties in Docker-omgevingen te bewaren.

Dit voorbeeld laat zien hoe je volumes in Docker Compose gebruikt om gegevens
van containers te bewaren, zodat belangrijke informatie behouden blijft als
containers opnieuw starten.

## Grenzen voor bronnen {#resource-constraints}

Stel in je `docker-compose.yml` grenzen in voor bronnen, zoals CPU en geheugen,
om concurrentie om bronnen te voorkomen en je Docker-omgeving stabieler te
maken, bijvoorbeeld:

Stel dat je een bestand `docker-compose.yml` hebt met een service met grenzen
voor bronnen:

```yaml
services:
  web:
    image: nginx
    ports:
      - "80:80"
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
```

In dit voorbeeld heeft de service `web` grenzen voor bronnen in het deel
`deploy.resources`: 0.5 CPU-kern en 512 megabyte geheugen. Grenzen voor bronnen
voorkomen concurrentie om bronnen en maken je Docker-omgeving stabieler, omdat
services niet te veel CPU of geheugen gebruiken.

Dit voorbeeld laat zien hoe je in Docker Compose grenzen voor bronnen, zoals CPU
en geheugen, instelt om concurrentie om bronnen te voorkomen en je
Docker-omgeving stabieler te maken.

## Afhankelijkheden tussen containers {#container-dependencies}

Definieer afhankelijkheden tussen containers met de instructie `depends_on` van
Docker Compose, zodat afhankelijke services in de juiste volgorde starten,
bijvoorbeeld:

Stel dat je een bestand `docker-compose.yml` hebt met meerdere services met
afhankelijkheden:

```yaml
services:
  db:
    image: postgres
    ports:
      - "5432:5432"
  web:
    image: nginx
    ports:
      - "80:80"
    depends_on:
      - db
```

In dit voorbeeld hangt de service `web` af van de service `db`, zoals de
instructie `depends_on` aangeeft. Zo start de service `db` vóór de service `web`
bij `docker compose up`, zodat `web` verbinding kan maken met de database. Met
afhankelijkheden tussen containers starten services in de juiste volgorde, wat
race conditions voorkomt en je toepassing goed laat werken.

Dit voorbeeld laat zien hoe je met de instructie `depends_on` van Docker Compose
afhankelijkheden tussen containers definieert, zodat afhankelijke services in de
juiste volgorde starten en je toepassing goed werkt.

## Ruim ongebruikte bronnen op {#clean-up-unused-resources}

Ruim regelmatig ongebruikte Docker-bronnen op, zoals images, containers en
volumes, om schijfruimte te besparen en je werk met Docker te stroomlijnen,
bijvoorbeeld:

Ongebruikte Docker-containers verwijder je met het commando
`docker container prune`:

```bash
docker container prune
```

Ongebruikte Docker-images verwijder je met het commando `docker image prune`:

```bash
docker image prune
```

Ongebruikte Docker-volumes verwijder je met het commando `docker volume prune`:

```bash
docker volume prune
```

Docker vraagt telkens om bevestiging voordat het de bronnen verwijdert. Door
regelmatig op te ruimen bespaar je schijfruimte en stroomlijn je je werk met
Docker, zodat alleen de nodige bronnen overblijven.

Dit voorbeeld laat zien hoe je met Docker-commando's ongebruikte bronnen, zoals
containers, images en volumes, opruimt om schijfruimte te besparen en je werk
met Docker te stroomlijnen.

## Gebruik korte namen {#use-short-names}

Gebruik korte, beschrijvende namen voor services in je `docker-compose.yml`,
zodat je configuratiebestanden leesbaarder en beter te onderhouden zijn,
bijvoorbeeld:

Stel dat je een bestand `docker-compose.yml` hebt met meerdere services met
korte, beschrijvende namen:

```yaml
services:
  web:
    image: nginx
    ports:
      - "80:80"
  db:
    image: postgres
    ports:
      - "5432:5432"
  api:
    image: myapi
    ports:
      - "8080:8080"
```

In dit voorbeeld heten de services `web`, `db` en `api`: kort en beschrijvend.
Dat maakt het bestand `docker-compose.yml` leesbaarder en beter te onderhouden,
en ontwikkelaars begrijpen snel waar elke service voor is. Korte namen
verkleinen ook de kans op typefouten als je in het configuratiebestand naar
services verwijst, wat je Docker-opzet betrouwbaarder maakt.

Dit voorbeeld laat zien waarom korte, beschrijvende namen voor services in je
`docker-compose.yml` de leesbaarheid, het onderhoud en de betrouwbaarheid van je
Docker-configuratie verbeteren.

## Zet Docker Compose-bestanden onder versiebeheer {#version-control-docker-compose-files}

Zet je `docker-compose.yml` en de bijbehorende bestanden onder versiebeheer met
Git of een ander versiebeheersysteem, om wijzigingen te volgen en goed met je
team samen te werken, bijvoorbeeld:

Stel dat je een Docker Compose-project hebt met deze mapstructuur:

```treeview
my_project/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

Met deze commando's maak je een Git-repository en zet je je Docker
Compose-bestanden onder versiebeheer:

```bash
cd my_project
git init
git add .
git commit -m "Initial commit"
```

Na de eerste commit blijf je je `docker-compose.yml` en de bijbehorende
bestanden wijzigen en vastleggen in je Git-repository:

```bash
git add docker-compose.yml Dockerfile README.md
git commit -m "Added Dockerfile and updated README"
```

Met versiebeheer voor je Docker Compose-bestanden volg je wijzigingen in de
tijd, werk je goed samen met je team en ga je zo nodig eenvoudig terug naar een
eerdere versie. Dat zorgt voor consistentie en betrouwbaarheid in je
Docker-projecten.

Dit voorbeeld laat zien hoe je je Docker Compose-bestanden met Git onder
versiebeheer zet, zodat je wijzigingen volgt, goed samenwerkt en je
Docker-projecten consistent en betrouwbaar blijven.

## Gebruik externe configuratiebestanden {#use-external-configuration-files}

Houd configuratiebestanden apart van je `docker-compose.yml` voor een betere
ordening en meer flexibiliteit, vooral bij grote en complexe projecten,
bijvoorbeeld:

Stel dat je een bestand `docker-compose.yml` hebt dat naar een extern
configuratiebestand verwijst:

```yaml
services:
  web:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./config/nginx.conf:/etc/nginx/nginx.conf
```

En je hebt een extern configuratiebestand `nginx.conf` in de map `config`:

```treeview
├── config/
│   └── nginx.conf
└── docker-compose.yml

```

In dit voorbeeld koppelt het bestand `docker-compose.yml` het bestand
`nginx.conf` uit de map `config` in de container van de service `web`, op het
pad `/etc/nginx/nginx.conf`. Door configuratiebestanden apart van het
hoofdbestand `docker-compose.yml` te houden, blijft je project overzichtelijk en
wijzig je de configuratie zonder het Compose-bestand zelf aan te passen. Dat is
vooral handig bij grote en complexe projecten, waar configuratiebestanden per
omgeving of service kunnen verschillen.

Dit voorbeeld laat zien hoe je externe configuratiebestanden met Docker Compose
gebruikt, voor een betere ordening en meer flexibiliteit in het beheer van
instellingen, vooral in grote en complexe projecten.

## Monitoring en logging {#monitor-and-logging}

Gebruik oplossingen voor monitoring en logging voor je Docker-toepassingen, om
inzicht te krijgen in de prestaties, problemen op te lossen en alles goed te
laten draaien, bijvoorbeeld:

Stel dat je een bestand `docker-compose.yml` hebt met een service met een
configuratie voor logging:

```yaml
services:
  web:
    image: nginx
    ports:
      - "80:80"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

In dit voorbeeld gebruikt de service `web` het logstuurprogramma `json-file`,
dat de uitvoer van de container in JSON-bestanden op de host schrijft. Daarnaast
beperken de opties `max-size` en `max-file` de grootte en het aantal
logbestanden. Met zo'n logoplossing verzamel en analyseer je de logs van je
Docker-toepassingen, zodat je de prestaties bewaakt, problemen oplost en alles
goed laat draaien.

Dit voorbeeld laat zien hoe je in Docker Compose logging instelt om de logs van
je Docker-toepassingen te verzamelen en te analyseren, voor monitoring,
probleemoplossing en een goede werking.
