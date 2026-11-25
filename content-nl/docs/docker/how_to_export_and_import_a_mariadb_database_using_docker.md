---
title: "Een MariaDB-database exporteren en importeren met Docker"
description:
  "Een uitgebreide handleiding, stap voor stap, om een MariaDB-database uit een
  Docker-container te exporteren en veilig in een nieuwe serveromgeving te
  importeren."
url: "docker/how-to-export-and-import-a-mariadb-database-using-docker"
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
  - mariadb
  - docker
  - database-backup
  - database-restore
  - export-import
  - migration
  - sql-transfer
keywords:
  - mariadb database export docker
  - import mariadb docker container
  - migrate mariadb database docker
  - backup and restore mariadb docker
  - transfer sql database between servers

weight: 4903

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

## 2. De MariaDB-container openen {#2-access-the-mariadb-container}

Open een interactieve shell in je MariaDB-container:

{{% alert context="primary" %}}
**Let op**: vervang `mariadb` door de echte naam van je container als die anders
is.
{{% /alert %}}

```bash
docker exec -it mariadb bash
```

## 3. De `testing_db`-database exporteren {#3-export-the-testing_db-database}

**Zorg dat je in de MariaDB-container zit** voordat je het volgende commando
uitvoert om de database te exporteren:

{{% alert context="primary" %}}
**Let op**: vervang `testing_db` door de naam van de database die je wilt
exporteren. Gebruik deze naam in de hele gids.
{{% /alert %}}

```bash
mariadb-dump -u root -p \
  --single-transaction --quick --routines --triggers --events \
  testing_db > /var/lib/mysql/testing_db_backup.sql
```

### Uitleg van de vlaggen {#explanation-of-flags}

- `--single-transaction`: maakt een consistente momentopname zonder tabellen te
  vergrendelen (werkt met InnoDB).
- `--quick`: haalt rijen snel op zonder ze in het geheugen te bufferen.
- `--routines`, `--triggers`, `--events`: neemt opgeslagen procedures, triggers
  en geplande events mee.

## 4. De back-up naar de nieuwe server overzetten {#4-transfer-the-backup-to-the-new-server}

Kopieer het dumpbestand met `scp` van de Docker-host naar de nieuwe server:

```bash
scp /var/lib/mysql/testing_db_backup.sql user@new-server:/var/lib/mysql/
```

**Andere manieren om over te zetten:**

- `rsync`
- SFTP-clients
- Fysieke media (USB-stick enzovoort)

## 5. De database op de nieuwe server importeren {#5-import-the-database-on-the-new-server}

Log met SSH in op de nieuwe server en voer deze commando's uit:

```bash
mariadb -u root -p -e "CREATE DATABASE IF NOT EXISTS testing_db;"
mariadb -u root -p testing_db < /var/lib/mysql/testing_db_backup.sql
```

{{% alert context="primary" %}}
**Let op**: bestaat `testing_db` al en wil je die overschrijven, verwijder of
leeg dan eerst de database om conflicten te voorkomen:
{{% /alert %}}

```bash
mariadb -u root -p -e "DROP DATABASE testing_db; CREATE DATABASE testing_db;"
```

## 6. De import controleren {#6-verify-the-import}

Controleer of de import is gelukt door de tabellen op te vragen:

```bash
mariadb -u root -p -e "SHOW TABLES IN testing_db;"
```

## Conclusie {#conclusion}

Met deze stappen exporteer je een MariaDB-database uit een Docker-container, zet
je die veilig over en importeer je die op een nieuwe server. Controleer altijd
de import, zodat de gegevens heel en volledig zijn.
