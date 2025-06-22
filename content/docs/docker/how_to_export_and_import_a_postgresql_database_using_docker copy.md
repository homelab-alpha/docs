---
title: "How to Export and Import a PostgreSQL Database Using Docker"
description:
  "Comprehensive step-by-step tutorial on exporting a PostgreSQL database from a
  Docker container and importing it securely into a new server environment."
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

<br />

## 1. SSH into the Docker Host

Connect to your Docker host via SSH:

```bash
ssh user@your-docker-server -p 22
```

<br />

## 2. Access the PostgreSQL Container

Open an interactive shell inside your PostgreSQL container:

{{% alert context="primary" %}}
**Note**: Replace `postgresql` with your actual container name if different.
{{% /alert %}}

```bash
docker exec -it postgresql bash
```

<br />

## 3. Export the `testing_db` Database

**Make sure you are inside the PostgreSQL container** before running the following
command to export the database:

{{% alert context="warning" %}}
**Warning**: If your PostgreSQL superuser has a different name, be sure to replace
`postgresql` with your actual superuser name. Use this name consistently
throughout this guide.
{{% /alert %}}


{{% alert context="primary" %}}
**Note**: Replace `testing_db` with the name of the database you want to export.
Use this name consistently throughout this guide.
{{% /alert %}}

```bash
pg_dump -U postgresql -Fc testing_db -f /var/lib/postgresql/data/testing_db_backup.dump
```

### Explanation of Flags

- `-U postgresql`: Connect as the `postgresql` user.
- `-Fc`: Creates a custom-format dump (compressed and suitable for `pg_restore`).
- `-f`: Specifies the output file for the dump.

<br />

## 4. Transfer the Backup to the New Server

Copy the dump file from the Docker host to the new server using `scp`:

```bash
scp /var/lib/postgresql/data/testing_db_backup.dump user@new-server:/var/lib/postgresql/data/
```

**Other transfer methods:**

- `rsync`
- SFTP clients
- Physical media (USB drive, etc.)

<br />

## 5. Import the Database on the New Server

SSH into the new server and run the following commands:

```bash
psql -U postgresql -c "CREATE DATABASE testing_db;"
pg_restore -U postgresql -d testing_db /var/lib/postgresql/data/testing_db_backup.dump
```

{{% alert context="primary" %}}
**Note**: If `testing_db` already exists and you want to overwrite it, drop or
clear the database first to avoid conflicts:
{{% /alert %}}

```bash
psql -U postgresql -c "DROP DATABASE testing_db;"
psql -U postgresql -c "CREATE DATABASE testing_db;"
```

<br />

## 6. Verify the Import

Confirm that the import was successful by listing the tables:

```bash
psql -U postgresql -d testing_db -c "\dt"
```

<br />

## Conclusion

Following these steps, you can export a PostgreSQL database from a Docker
container, transfer it securely, and import it into a new server. Always verify
the import to ensure data integrity and completeness.
