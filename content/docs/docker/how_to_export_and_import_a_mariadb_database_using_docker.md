---
title: "How to Export and Import a MariaDB Database Using Docker"
description:
  "Comprehensive step-by-step tutorial on exporting a MariaDB database from a
  Docker container and importing it securely into a new server environment."
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

<br />

## 1. SSH into the Docker Host

Connect to your Docker host via SSH:

```bash
ssh user@your-docker-server -p 22
```

<br />

## 2. Access the MariaDB Container

Open an interactive shell inside your MariaDB container:

{{% alert context="primary" %}}
**Note**: Replace `mariadb` with your actual container name if different.
{{% /alert %}}

```bash
docker exec -it mariadb bash
```

<br />

## 3. Export the `testing_db` Database

**Make sure you are inside the MariaDB container** before running the following
command to export the database:

{{% alert context="primary" %}}
**Note**: Replace `testing_db` with the name of the database you want to export.
Use this name consistently throughout this guide.
{{% /alert %}}

```bash
mariadb-dump -u root -p \
  --single-transaction --quick --routines --triggers --events \
  testing_db > /var/lib/mysql/testing_db_backup.sql
```

### Explanation of Flags

- `--single-transaction`: Creates a consistent snapshot without locking tables
  (works with InnoDB).
- `--quick`: Retrieves rows quickly without buffering them in memory.
- `--routines`, `--triggers`, `--events`: Includes stored procedures, triggers,
  and scheduled events.

<br />

## 4. Transfer the Backup to the New Server

Copy the dump file from the Docker host to the new server using `scp`:

```bash
scp /var/lib/mysql/testing_db_backup.sql user@new-server:/var/lib/mysql/
```

**Other transfer methods:**

- `rsync`
- SFTP clients
- Physical media (USB drive, etc.)

<br />

## 5. Import the Database on the New Server

SSH into the new server and run the following commands:

```bash
mariadb -u root -p -e "CREATE DATABASE IF NOT EXISTS testing_db;"
mariadb -u root -p testing_db < /var/lib/mysql/testing_db_backup.sql
```

{{% alert context="primary" %}}
**Note**: If `testing_db` already exists and you want to overwrite it, drop or
clear the database first to avoid conflicts:
{{% /alert %}}

```bash
mariadb -u root -p -e "DROP DATABASE testing_db; CREATE DATABASE testing_db;"
```

<br />

## 6. Verify the Import

Confirm that the import was successful by listing the tables:

```bash
mariadb -u root -p -e "SHOW TABLES IN testing_db;"
```

<br />

## Conclusion

Following these steps, you can export a MariaDB database from a Docker container,
transfer it securely, and import it into a new server. Always verify the import
to ensure data integrity and completeness.
