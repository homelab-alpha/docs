---
title: "new_docker_container.info"
description:
  "This script automates the creation of a new Docker container's directory
  structure and configuration files based on user input, ensuring all necessary
  tools and permissions are in place."
url: "shell-script/script-info/new-docker-container"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Script Information
tags:
  - Docker
  - Shell Script
  - Automation
  - DevOps
  - Containerization
keywords:
  - Docker container setup
  - Shell script automation
  - Docker directory structure
  - DevOps tools
  - Container configuration
  - Dockerfile
  - Docker Compose
  - Scripting
  - Homelab

weight: 6100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`new_docker_container.sh`, authored by GJS (homelab-alpha), and its purpose is
to create a new Docker container directory structure and configuration files
based on user input. The script ensures that the necessary tools are available,
checks for proper execution permissions, and creates a comprehensive directory
structure and configuration files for Docker containers.

Here's a detailed explanation:

## Script Metadata

- **Script Name**: `new_docker_container.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.0.1
- **Description**: This script creates a new Docker container directory
  structure and configuration files based on user input.
- **RAW Script**: [new_docker_container.sh]

<br />

## Detailed Explanation

### Check for sudo Permissions

```sh
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo."
  exit 1
fi
```

This section ensures that the script is run with `sudo` to have the necessary
permissions for creating directories and files.

<br />

### Validate Existence of Required Commands

```sh
for cmd in mkdir touch chown; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "ERROR: $cmd command not found. Please install it and try again."
    exit 1
  fi
done
```

This part checks if the required commands (`mkdir`, `touch`, `chown`) are
available on the system. If any of these commands are missing, the script will
exit with an error message.

<br />

### Display Message Function

```sh
display_message() {
  echo -e "\n$1\n"
}
```

This function is used to display messages to the user in a formatted manner.

<br />

### Prompt for Docker Container Name

```sh
display_message "What is the name of the new Docker container:"
read -r container_name
```

The script prompts the user to enter the name of the new Docker container and
reads the input into the variable `container_name`.

<br />

### Validate Container Name

```sh
if [[ ! "$container_name" =~ ^[a-zA-Z0-9_-]+$ ]]; then
  display_message "Invalid container name. Use only letters, numbers, underscore (_), and hyphen (-)."
  exit 1
fi
```

This validation ensures that the container name only contains letters, numbers,
underscores, and hyphens.

<br />

### Set Base Directory for Docker Containers

```sh
base_dir="${docker_base_dir:-/docker}"
dir_path="$base_dir/$container_name"
```

This section sets the base directory for Docker containers. If `docker_base_dir`
is not set, it defaults to `/docker`. The full directory path for the new
container is constructed.

<br />

### Check if Directory Already Exists

```sh
if [ -d "$dir_path" ]; then
  display_message "The directory already exists. Choose a different name for the container."
  exit 1
fi
```

This checks if a directory with the specified container name already exists. If
it does, the script exits with a message.

<br />

### Create Required Directories

```sh
declare -a directories=(
  "notes"
  "production/.cert" "production/app" "production/config" "production/db" "production/log" "production/redis"
  "testing/.cert" "testing/app" "testing/config" "testing/db" "testing/log" "testing/redis"
)
for dir in "${directories[@]}"; do
  if ! mkdir -p "$dir_path/$dir"; then
    display_message "Failed to create directory: $dir_path/$dir"
    exit 1
  fi
done
```

This part creates the required directory structure for the Docker container,
including directories for notes, production, and testing environments.

<br />

### Create Docker Startup Files

```sh
if ! touch "$dir_path/.dockerignore" "$dir_path/.env" "$dir_path/docker-compose.yml" "$dir_path/Dockerfile" "$dir_path/README.md"; then
  display_message "Failed to create Docker startup files in $dir_path."
  exit 1
fi
```

The script creates essential Docker startup files in the new container
directory.

<br />

### Add Content to `.dockerignore`

```sh
cat <<EOL >"$dir_path/.dockerignore"
*/temp*
*/*/temp*
temp?
EOL
```

This section writes predefined content to the `.dockerignore` file to exclude
certain files from Docker builds.

<br />

### Add Content to `.env`

```sh
cat <<EOL >"$dir_path/.env"
# API keys and secrets
API_KEY=
SECRET_KEY=

# App configuration
MYSQL_HOST_APP=${container_name}
MYSQL_PORT_APP=3306
MYSQL_NAME_APP=${container_name}
MYSQL_USER_APP=${container_name}
MYSQL_PASSWORD_APP=

# Database configuration
MYSQL_ROOT_PASSWORD_DB=
MYSQL_DATABASE_DB=${container_name}_db
MYSQL_USER_DB=${container_name}
MYSQL_PASSWORD_DB=
EOL
```

This writes configuration settings, including API keys, secrets, and database
details, to the `.env` file.

<br />

### Add Content to `docker-compose.yml`

```sh
cat <<EOL >"$dir_path/docker-compose.yml"
version: "3.9"
networks:
  ${container_name}_net:
    name: ${container_name}
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/24
          gateway: 172.20.0.1
services:
  ${container_name}_db:
    restart: unless-stopped
    container_name: ${container_name}_db
    image: change_me:latest
    volumes:
      - /docker/${container_name}/production/db:/change_me
    environment:
      MYSQL_DATABASE: "${container_name}_db"
      MYSQL_USER: "${container_name}"
    networks:
      ${container_name}_net:
        ipv4_address: 172.20.0.2
  ${container_name}_app:
    restart: unless-stopped
    container_name: ${container_name}
    image: change_me:latest
    volumes:
      - /docker/${container_name}/production/app:/change_me
    environment:
      MYSQL_HOST: "${container_name}_db"
      MYSQL_DATABASE: "${container_name}_db"
    networks:
      ${container_name}_net:
        ipv4_address: 172.20.0.3
volumes:
  ${container_name}_db:
    external: true
  ${container_name}_app:
    external: true
EOL
```

This section adds content to the `docker-compose.yml` file, specifying the
configuration for Docker services and networks.

<br />

### Add Content to `Dockerfile`

```sh
cat <<EOL >"$dir_path/Dockerfile"
EOL
```

This creates an empty `Dockerfile`, which should be populated with build
instructions.

<br />

### Add Content to `README.md`

```sh
cat <<EOL >"$dir_path/README.md"
.. ${container_name}::
.
├── notes                - Note files and information about the configuration.
├── production           - Configuration files and data for the production environment.
│   ├── .cert            - SSL certificates for secure connections.
│   ├── app              - Application files.
│   ├── config           - Configuration files for the application.
│   ├── db               - Database files.
│   ├── log              - Log files.
│   └── redis            - Redis database files.
├── testing              - Configuration files and data for the testing environment.
│   ├── .cert            - SSL certificates for secure connections.
│   ├── app              - Application files.
│   ├── config           - Configuration files for the application.
│   ├── db               - Database files.
│   └── log              - Log files.
├── .dockerignore        - Excludes files from Docker builds.
├── .env                 - Environment variables for the Docker containers.
├── docker-compose.yml   - Docker Compose configuration.
├── Dockerfile           - Docker container build instructions.
└── README.md            - Instructions and information about the project.
\`\`\`

## Customization

- Update placeholder values (change_me, USER, ROLE, etc.) in the Docker Compose files with your specific configurations.
- Modify the .env file with API keys, secrets, and MySQL configurations.

## Author

GJS (homelab-alpha)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

[LICENSE]: https://github.com/homelab-alpha/shell-script/blob/main/LICENSE.md
EOL
```

This section populates the `README.md` file with a directory structure overview
and customization instructions.

<br />

### Completion Message

```sh
display_message "Docker container directory structure created in $dir_path."
```

Finally, the script displays a message indicating that the Docker container
directory structure has

been successfully created.

<br />

## Conclusion

The script is a well-structured tool to automate the creation of a standardized
Docker container setup. It ensures that the necessary commands and permissions
are in place, validates user input, and creates a comprehensive directory
structure with essential configuration files for Docker containers. This can
significantly streamline the setup process for Docker-based projects, ensuring
consistency and reducing the risk of errors.

[new_docker_container.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/new_docker_container.sh
