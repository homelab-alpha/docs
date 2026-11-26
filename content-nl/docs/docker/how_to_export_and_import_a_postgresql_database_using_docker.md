---
title: "Een PostgreSQL-database exporteren en importeren met Docker"
description:
  "Een uitgebreide handleiding, stap voor stap, om een PostgreSQL-database uit
  een Docker-container te exporteren en veilig in een nieuwe serveromgeving te
  importeren."
url: "docker/how-to-export-and-import-a-postgresql-database-using-docker"
icon: "tools_wrench"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Docker
series:
  - Docker
tags:
  - postgresql
  - docker
  - database-backup
  - database-restore
  - export-import
  - migration
  - sql-transfer
keywords:
  - postgresql database export docker
  - import postgresql docker container
  - migrate postgresql database docker
  - backup and restore postgresql docker
  - transfer sql database between servers

weight: 4904

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## 1. Met SSH inloggen op de Docker-host {#1-ssh-into-the-docker-host}

Maak via SSH verbinding met je Docker-host:

```bash
ssh user@your-docker-server -p 22
```

## 2. De PostgreSQL-container openen {#2-access-the-postgresql-container}

Open een interactieve shell in je PostgreSQL-container:

{{% alert context="primary" %}}
**Let op**: vervang `postgresql` door de echte naam van je container als die
anders is.
{{% /alert %}}

```bash
docker exec -it postgresql bash
```

## 3. De `testing_db`-database exporteren {#3-export-the-testing_db-database}

**Zorg dat je in de PostgreSQL-container zit** voordat je het volgende commando
uitvoert om de database te exporteren:

{{% alert context="warning" %}}
**Waarschuwing**: heeft je PostgreSQL-superuser een andere naam, vervang
`postgresql` dan door de echte naam van je superuser. Gebruik deze naam in de
hele gids.
{{% /alert %}}

{{% alert context="primary" %}}
**Let op**: vervang `testing_db` door de naam van de database die je wilt
exporteren. Gebruik deze naam in de hele gids.
{{% /alert %}}

```bash
pg_dump -U postgresql -Fc testing_db -f /var/lib/postgresql/data/testing_db_backup.dump
```

### Uitleg van de vlaggen {#explanation-of-flags}

- `-U postgresql`: maakt verbinding als de gebruiker `postgresql`.
- `-Fc`: maakt een dump in eigen formaat (gecomprimeerd en geschikt voor
  `pg_restore`).
- `-f`: geeft het uitvoerbestand van de dump op.

## 4. De back-up naar de nieuwe server overzetten {#4-transfer-the-backup-to-the-new-server}

Kopieer het dumpbestand met `scp` van de Docker-host naar de nieuwe server:

```bash
scp /var/lib/postgresql/data/testing_db_backup.dump user@new-server:/var/lib/postgresql/data/
```

**Andere manieren om over te zetten:**

- `rsync`
- SFTP-clients
- Fysieke media (USB-stick enzovoort)

## 5. De database op de nieuwe server importeren {#5-import-the-database-on-the-new-server}

Log met SSH in op de nieuwe server en voer deze commando's uit:

```bash
psql -U postgresql -c "CREATE DATABASE testing_db;"
pg_restore -U postgresql -d testing_db /var/lib/postgresql/data/testing_db_backup.dump
```

{{% alert context="primary" %}}
**Let op**: bestaat `testing_db` al en wil je die overschrijven, verwijder of
leeg dan eerst de database om conflicten te voorkomen:
{{% /alert %}}

```bash
psql -U postgresql -c "DROP DATABASE testing_db;"
psql -U postgresql -c "CREATE DATABASE testing_db;"
```

## 6. De import controleren {#6-verify-the-import}

Controleer of de import is gelukt door de tabellen op te vragen:

```bash
psql -U postgresql -d testing_db -c "\dt"
```

## Conclusie {#conclusion}

Met deze stappen exporteer je een PostgreSQL-database uit een Docker-container,
zet je die veilig over en importeer je die op een nieuwe server. Controleer
altijd de import, zodat de gegevens heel en volledig zijn.
