---
title: "Docker Crash Course"
description:
  "Get started with Docker through this crash course covering key concepts,
  basic commands, creating Dockerfiles, building images, running containers, and
  publishing to Docker Hub."
url: "back-to-basics/docker/crash-course"
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

weight: 101001

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

## What is Docker

Docker is a platform that allows you to package, distribute, and run
applications within containers. Containers are lightweight, portable, and
self-sufficient environments that encapsulate everything needed to run an
application, including its code, runtime, system tools, libraries, and settings.

<br />

## Key Concepts

- **Images** Docker images are read-only templates that contain the application
  and its dependencies. They serve as the basis for creating containers.
- **Containers** Containers are instances of Docker images. They are
  lightweight, portable, and isolated environments that run applications.
- **Dockerfile** A Dockerfile is a text file that contains instructions for
  building Docker images. It specifies the environment and configuration for an
  application.
- **Docker Hub** Docker Hub is a cloud-based registry service that hosts Docker
  images. It allows users to share and distribute images publicly or privately.

<br />

## Getting Started

### Installation

Install Docker Desktop from the [official website]. After installation, Docker
CLI (`docker`) and Docker Compose (`docker-compose`) commands will be available
in your terminal.

<br />

### Basic Commands

- `docker run <image>`: Runs a container based on the specified image.
- `docker pull <image>`: Downloads an image from Docker Hub.
- `docker build <path>`: Builds an image from a Dockerfile located at the
  specified path.
- `docker ps`: Lists running containers.
- `docker images`: Lists downloaded images.
- `docker stop <container>`: Stops a running container.
- `docker rm <container>`: Removes a container.
- `docker rmi <image>`: Removes an image.

<br />

### Creating a Dockerfile

Start by creating a new directory for your project. Create a file named
`Dockerfile` in the project directory. Define the base image, copy application
files, and specify commands to run the application. Example Dockerfile:

```Dockerfile
FROM python:3.9
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

<br />

### Building an Image

Navigate to the directory containing the Dockerfile. Run\
`docker build -t <image_name> .` to build the image. Replace `<image_name>` with
a name for your image.

<br />

### Running a Container

Once the image is built, you can run a container using\
`docker run <image_name>`. You can specify additional options such as port
mappings, volume mounts, and environment variables.

<br />

### Publishing to Docker Hub

Create a Docker Hub account if you haven't already. Log in to Docker Hub using
`docker login`. Tag your image with your Docker Hub username and repository
name: `docker tag <image_name> <username>/<repository_name>`. Push the image to
Docker Hub: `docker push <username>/<repository_name>`.

<br />

## Conclusion

Docker simplifies the process of building, distributing, and running
applications by leveraging containers. With Docker, you can package your
applications with their dependencies, ensuring consistency and reproducibility
across different environments. Experiment with Docker to discover its full
potential!

[official website]: https://www.docker.com/products/docker-desktop
