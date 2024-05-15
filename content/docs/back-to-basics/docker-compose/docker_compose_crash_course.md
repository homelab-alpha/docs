---
title: "Docker Compose Crash Course"
description:
  "Learn Docker Compose from scratch with this comprehensive crash course.
  Explore Docker container management, orchestration, and DevOps practices."
url: "back-to-basics/docker-compose/crash-course"
icon: "bug_report"

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

weight: 102001

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this
document. Therefore, it's advisable to treat the information here with caution
and verify it if necessary.
{{% /alert %}}

<br />

## What is Docker Compose

Docker Compose is a powerful tool designed to manage multiple Docker containers
as a single, cohesive application. It simplifies the process of building,
running, and managing complex applications using a single configuration file.

<br />

## Installation

Before getting started with Docker Compose, ensure that both Docker and Docker
Compose are installed on your system. You can find installation instructions on
the [official Docker website]. Docker Compose can be downloaded from GitHub or
installed using a package manager.

<br />

## The Docker Compose YAML File

At the core of Docker Compose lies the YAML configuration file\
(`docker-compose.yml`), where you define the configuration of your services.
Here's an overview:

```yaml
version: "3.8" # Docker Compose syntax version

services: # List of services to run
  service1: # Service name
    image: image1:tag # Docker image to use
    ports: # Port forwarding (optional)
      - "8000:8000"
    environment: # Environment variables (optional)
      - ENV_VAR=value
```

<br />

## Common Commands

- `docker-compose up`: Builds, (re)creates, and starts all services.
- `docker-compose down`: Stops and removes all services along with their
  associated networks and volumes.
- `docker-compose ps`: Shows the status of all services.
- `docker-compose logs`: Displays the logs of all services.
- `docker-compose exec <service> <command>`: Executes a command in a running
  service.

<br />

## Pro Tips

### Network Configuration

You can define custom networks in your Docker Compose file to ensure isolated
communication between services for example:

```yaml
version: "3"
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

This example demonstrates how to define a custom network named `my-network` in a
Docker Compose file, and how to assign services (`web` and `db`) to this network
to ensure isolated communication between them.

<br />

### Volumes

Use volumes to make data persistent even after containers are stopped for
example:

```yaml
version: "3"
services:
  web:
    image: nginx
    volumes:
      - my-volume:/usr/share/nginx/html

volumes:
  my-volume:
```

In this example, a volume named `my-volume` is defined, and it's mounted to the
`/usr/share/nginx/html` directory within the `web` service container. This
ensures that data stored in this directory persists even if the container is
stopped or removed.

<br />

### Restart Policy

Customize the restart policy for each service to determine how it responds to
crashes for example:

```yaml
version: "3"
services:
  web:
    image: nginx
    restart: always

  backend:
    image: my-backend
    restart: on-failure
```

In this example, the `web` service has a restart policy set to `always`, which
means Docker will always attempt to restart the container if it stops for any
reason. On the other hand, the `backend` service has a restart policy set to
`on-failure`, indicating that Docker will only restart the container if it exits
with a non-zero status code (i.e., if it fails).

<br />

### Secrets and Configurations

Use Docker Secrets or external configuration providers to manage sensitive
information like passwords for example:

```yaml
version: "3.1"
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

In this example, a Docker secret named `db_password` is created, which reads the
password from a file named `db_password.txt`. This secret is then mounted into
the `db` service container at the path `/run/secrets/db_password`, allowing the
PostgreSQL container to access the password securely without exposing it in the
Docker Compose file.

<br />

## Advanced Features

### Docker Compose Overrides

Use multiple YAML files to define different configurations for different
environments (e.g., development, staging, production) for example:

Suppose you have a base `docker-compose.yml` file:

```yaml
version: "3"
services:
  web:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
```

And then, for the development environment, you can have a
`docker-compose.override.yml` file:

```yaml
version: "3"
services:
  web:
    ports:
      - "8080:80"
    environment:
      DEBUG: "true"
    volumes:
      - ./html:/usr/share/nginx/html
```

In this example, the `docker-compose.override.yml` file is used to override
specific settings from the base `docker-compose.yml` file for the development
environment. Here, the `web` service's `ports` and `environment` are modified to
suit the development environment while keeping the volume mapping unchanged.

This example demonstrates how you can use Docker Compose override files to
customize configurations for different environments while keeping a common base
configuration in the `docker-compose.yml` file.

<br />

### Service Scaling

Easily scale services up or down to meet demand for example:

Suppose you have a simple `docker-compose.yml` file defining a service:

```yaml
version: "3"
services:
  web:
    image: nginx
```

To scale the `web` service to run multiple containers, you can use the\
`docker-compose` command:

```bash
docker-compose up -d --scale web=3
```

This command instructs Docker Compose to start three instances of the `web`
service. You can adjust the number according to your needs. Scaling services
allows you to distribute the workload across multiple containers, improving
performance and resilience.

In this example, the `docker-compose up -d --scale web=3` command scales the
`web` service to run three instances of the `nginx` container. This demonstrates
how Docker Compose enables easy scaling of services to meet varying demand.

<br />

## Conclusion

Docker Compose is a game-changer for streamlining the development, testing, and
deployment of Docker-based applications. Explore its capabilities and witness
how it enhances your workflow seamlessly!

[official Docker website]: https://docs.docker.com/get-docker
