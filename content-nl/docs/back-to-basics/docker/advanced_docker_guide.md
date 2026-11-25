---
title: "Gevorderde gids voor Docker"
description:
  "Ontdek de kracht van Docker met gevorderde begrippen en technieken:
  orkestratie van containers, netwerken, volumes, beveiliging, aanbevolen
  werkwijzen voor Dockerfiles, private registries, service discovery, integratie
  met CI/CD, Kubernetes, microservices, Infrastructure as Code en monitoring en
  logging."
url: "back-to-basics/docker/advanced-guide"
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
  - Docker Swarm
  - Docker security
  - Dockerfile
  - CI/CD
  - Kubernetes
  - microservices
  - Infrastructure as Code
  - monitoring
  - logging
keywords:
  - advanced Docker concepts
  - Docker networking
  - Docker volumes
  - Docker Swarm orchestration
  - Docker security practices
  - Dockerfile best practices
  - private Docker registry
  - service discovery
  - CI/CD with Docker
  - Kubernetes orchestration
  - microservices architecture
  - Infrastructure as Code with Docker
  - Docker monitoring
  - Docker logging

weight: 2201

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

## Docker Compose

Docker Compose is een hulpmiddel waarmee je moeiteloos Docker-toepassingen met
meerdere containers definieert en draait, met YAML-bestanden om services,
netwerken en volumes in te stellen, bijvoorbeeld:

Stel dat je een webtoepassing hebt met een frontend-service, een backend-service
en een databaseservice. Je definieert deze services en hun configuratie zo in
een bestand `docker-compose.yml`:

```yaml
services:
  frontend:
    image: frontend:latest
    ports:
      - "80:80"
    networks:
      - app_network

  backend:
    image: backend:latest
    ports:
      - "8080:8080"
    networks:
      - app_network

  database:
    image: mysql:latest
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: mydb
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app_network

networks:
  app_network:

volumes:
  db_data:
```

In dit voorbeeld:

- We definiëren drie services: `frontend`, `backend` en `database`.
- Elke service geeft haar Docker-image, de open te zetten poorten,
  omgevingsvariabelen, volumes en netwerken op.
- De services zijn gekoppeld aan hetzelfde netwerk (`app_network`), zodat ze met
  elkaar kunnen communiceren.
- Een volume (`db_data`) bewaart de gegevens van de database.

## Docker-netwerken {#docker-networking}

Met Docker-netwerken stel je het netwerk naar wens in, voor soepele communicatie
tussen containers en met de buitenwereld, met goede prestaties en beveiliging,
bijvoorbeeld:

Stel dat je een microservices-architectuur hebt waarin meerdere containers met
elkaar en met externe diensten moeten communiceren. Je definieert dan zo een
eigen bridge-netwerk en koppelt de containers eraan in een bestand
`docker-compose.yml`:

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    networks:
      - my_network

  api:
    image: myapi:latest
    networks:
      - my_network

networks:
  my_network:
    driver: bridge
```

In dit voorbeeld:

- We definiëren twee services: `web` en `api`.
- Elke service geeft haar Docker-image op en zet eventueel poorten open.
- Beide services zijn gekoppeld aan hetzelfde eigen bridge-netwerk
  (`my_network`), zodat ze met elkaar kunnen communiceren.
- Het netwerk `my_network` is uitdrukkelijk gedefinieerd met het stuurprogramma
  `bridge`, dat containers een bridge-netwerk geeft.

## Docker-volumes

Met Docker-volumes bewaar je de gegevens van containers veilig, zodat ze heel en
beschikbaar blijven als containers stoppen of worden verwijderd, bijvoorbeeld:

Stel dat je een Docker-toepassing hebt die blijvende opslag nodig heeft voor
haar database. Je maakt dan zo een volume met een naam en koppelt het aan de
container in een bestand `docker-compose.yml`:

```yaml
services:
  database:
    image: mysql:latest
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

In dit voorbeeld:

- We definiëren de service `database` met de image van MySQL.
- Het volume `db_data` wordt gemaakt om de gegevens van de database te bewaren.
- Het volume `db_data` wordt in de container gekoppeld op het pad
  `/var/lib/mysql`, zodat de gegevens bewaard blijven, ook als de container
  wordt gestopt of verwijderd.

## Docker Swarm

Met Docker Swarm orkestreer je toepassingen met meerdere containers over
meerdere hosts, met functies als schalen, updates en load balancing voor een
hoge beschikbaarheid.

Stel dat je een webtoepassing hebt die uit meerdere services bestaat en die je
in een Docker Swarm-cluster wilt uitrollen. Je definieert de services en rolt ze
uit met een Docker Compose-bestand (`docker-compose.yml`) dat Swarm kan lezen.
Een vereenvoudigd voorbeeld:

```yaml
services:
  web:
    image: nginx:alpine
    deploy:
      replicas: 3
      placement:
        constraints:
          - node.role == worker
    ports:
      - "80:80"
    networks:
      - app_network

  api:
    image: myapi:latest
    deploy:
      replicas: 3
      placement:
        constraints:
          - node.role == worker
    networks:
      - app_network

networks:
  app_network:
```

In dit voorbeeld:

- We definiëren twee services: `web` en `api`.
- Elke service geeft haar Docker-image op.
- Elke service krijgt drie replica's, voor een hoge beschikbaarheid.
- Plaatsingsregels zorgen dat de replica's alleen op worker-nodes worden
  uitgerold, niet op manager-nodes.
- Beide services zijn gekoppeld aan hetzelfde overlay-netwerk (`app_network`)
  voor interne communicatie in het Swarm-cluster.
- Zo beheert Docker Swarm het uitrollen en schalen van de services in het
  cluster, met een hoge beschikbaarheid en load balancing.

## Beveiliging van Docker {#docker-security}

Met de beveiliging van Docker bescherm je toepassingen met isolatie, user
namespaces en beveiligingsprofielen, om risico's te beperken.

Stel dat je een microservices-architectuur hebt waarin beveiliging voorop staat.
Met de beveiligingsfuncties van Docker bescherm je je containers beter. Een
vereenvoudigd voorbeeld:

```dockerfile
FROM nginx:alpine

# Set up user and permissions
RUN adduser -D myuser
RUN chown -R myuser:myuser /usr/share/nginx/html

# Copy application files
COPY index.html /usr/share/nginx/html

# Drop root privileges
USER myuser
```

In dit voorbeeld:

- We beginnen met de officiële image van Nginx.
- We maken in de container een gebruiker zonder rootrechten (`myuser`), voor een
  betere beveiliging.
- De bestanden van de toepassing worden naar het bestandssysteem van de
  container gekopieerd.
- Tot slot wisselen we naar de gebruiker `myuser` zonder rootrechten om het
  proces van Nginx te draaien, wat het aanvalsoppervlak van de container
  verkleint.

Deze opzet laat zien hoe je met Docker aanbevolen beveiligingswerkwijzen
toepast, zoals processen met zo min mogelijk rechten draaien, om risico's te
beperken en je toepassingen te beschermen.

## Aanbevolen werkwijzen voor Dockerfiles {#dockerfile-best-practices}

Met aanbevolen werkwijzen voor Dockerfiles bouw je efficiënter, maak je kleinere
images en verbeter je de beveiliging, met multi-stage builds en beheer van
afhankelijkheden, bijvoorbeeld:

Neem een Node.js-toepassing die in een container moet. Hieronder staat een
voorbeeld van een Dockerfile volgens de aanbevolen werkwijzen:

```Dockerfile
# Stage 1: Build the application
FROM node:24 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Create a lightweight production image
FROM nginx:alpine

# Copy the build output from Stage 1 into the web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]
```

In dit voorbeeld:

- **Fase 1:** we gebruiken de image van Node.js als basis om de toepassing te
  bouwen. Deze fase installeert de afhankelijkheden, kopieert de broncode en
  bouwt de toepassing.
- **Fase 2:** we gebruiken de lichte image van Nginx als basis voor de
  productie-image. Deze fase kopieert de uitvoer van fase 1 naar de map van de
  webserver.
- Multi-stage builds maken de uiteindelijke image kleiner, omdat overbodige
  build-afhankelijkheden en hulpmiddelen wegvallen.
- De uiteindelijke image is kleiner, bevat alleen onderdelen voor productie en
  is veiliger, omdat er geen build-hulpmiddelen en -afhankelijkheden in zitten.

Dit voorbeeld laat zien hoe je aanbevolen werkwijzen voor Dockerfiles toepast om
efficiënter te bouwen, images kleiner te maken en de beveiliging te verbeteren.

## Docker Registry

Met Docker Registry zet je private registries op om images veilig binnen je
organisatie op te slaan en te verspreiden, bijvoorbeeld:

Stel dat je bedrijf meerdere ontwikkelteams heeft en dat je grip wilt houden op
de Docker-images in je projecten. Met een private Docker Registry sla je deze
images veilig op en verspreid je ze intern. Hieronder staat een vereenvoudigd
voorbeeld van hoe je een Docker Registry instelt en gebruikt:

1. **Installatie:** installeer Docker Registry op een server binnen je
   organisatie.

   ```bash
   docker run -d -p 5000:5000 --name registry registry:2
   ```

2. **Taggen en pushen:** tag je lokale Docker-image met het adres van je private
   registry en push die.

   ```bash
   docker tag my_image:latest my_registry_server:5000/my_image:latest
   docker push my_registry_server:5000/my_image:latest
   ```

3. **Ophalen:** haal de image op uit je private registry.

   ```bash
   docker pull my_registry_server:5000/my_image:latest
   ```

Met een private Docker Registry worden de Docker-images van je organisatie
veilig opgeslagen en intern verspreid, wat meer grip en beheer geeft over je
toepassingen in containers.

## Gevorderde technieken {#advanced-techniques}

### Service discovery en load balancing {#service-discovery-and-load-balancing}

Gebruik hulpmiddelen als Consul of etcd voor dynamisch beheer van services en
een efficiënte verdeling van verkeer, bijvoorbeeld:

Stel dat je een microservices-architectuur hebt en service discovery en load
balancing efficiënt wilt regelen. Hulpmiddelen als Consul of etcd helpen
daarbij. Hieronder staat een vereenvoudigd voorbeeld met Consul:

1. **Een Consul-cluster opzetten:** rol een Consul-cluster uit in je
   infrastructuur.

   ```bash
   docker compose up -d consul-server-1 consul-server-2 consul-server-3
   ```

2. **Services registreren:** registreer je microservices bij Consul.

   ```bash
   curl --request PUT --data @service.json http://consul-server-1:8500/v1/agent/service/register
   ```

   Daarbij bevat `service.json` gegevens over je service, zoals de naam, het
   adres en de poort.

3. **Services opvragen:** vraag bij Consul de beschikbare instanties van een
   service op.

   ```bash
   curl http://consul-server-1:8500/v1/health/service/my-service?passing
   ```

   Dit geeft een lijst van de gezonde instanties van de service my-service.

4. **Load balancing:** gebruik de DNS-interface of de HTTP-API van Consul voor
   dynamische load balancing op basis van de gezondheid en beschikbaarheid van
   services.

Met hulpmiddelen als Consul of etcd voor service discovery en load balancing
beheer je je microservices-architectuur efficiënt, met een hoge beschikbaarheid
en een goed gebruik van bronnen.

### Integratie met CI/CD {#cicd-integration}

Automatiseer het bouwen, testen en uitrollen met Docker, voor een snellere en
betrouwbaardere oplevering van software, bijvoorbeeld:

Stel dat je een webtoepassing met een CI/CD-pipeline en Docker wilt uitrollen.
Hieronder staat een vereenvoudigd voorbeeld van een integratie met GitLab CI:

1. **De CI-pipeline definiëren:** maak in je repository een bestand
   `.gitlab-ci.yml` met de fasen van de CI-pipeline:

   ```yaml
   stages:
     - build
     - test
     - deploy

   build:
     image: docker:latest
     stage: build
     script:
       - docker build -t myapp .

   test:
     image: myapp
     stage: test
     script:
       - docker run myapp npm test

   deploy:
     image: docker:latest
     stage: deploy
     script:
       - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
       - docker tag myapp $CI_REGISTRY_IMAGE
       - docker push $CI_REGISTRY_IMAGE
   ```

2. **CI/CD-variabelen instellen:** stel in GitLab CI/CD variabelen in voor de
   inloggegevens van de Docker-registry en andere instellingen per omgeving.

3. **De CI-pipeline uitvoeren:** GitLab CI start de pipeline automatisch bij
   elke commit: het bouwt de Docker-image, voert tests uit en rolt uit naar de
   doelomgeving.

Door Docker in je CI/CD-pipeline op te nemen, automatiseer je de oplevering van
software, met snellere iteraties, een betere kwaliteit en een hogere
productiviteit.

### Orkestratie met Kubernetes {#kubernetes-orchestration}

Gebruik de kracht van Kubernetes om toepassingen in containers automatisch uit
te rollen, te schalen en te beheren, bijvoorbeeld:

Stel dat je een toepassing met microservices met Kubernetes wilt uitrollen en
beheren. Hieronder staat een vereenvoudigd voorbeeld van een
Kubernetes-deploymentmanifest voor een microservice:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-service
  template:
    metadata:
      labels:
        app: my-service
    spec:
      containers:
        - name: my-service
          image: my-registry/my-service:latest
          ports:
            - containerPort: 8080
```

In dit voorbeeld:

- We definiëren een Kubernetes-Deployment met de naam `my-service` en drie
  replica's.
- De Deployment beheert pods met het label `app: my-service`.
- Elke pod draait een container op basis van de image
  `my-registry/my-service:latest` en zet poort 8080 open.

Met Kubernetes voor de orkestratie automatiseer je het uitrollen, schalen en
beheren, met een hoge beschikbaarheid en betrouwbaarheid voor je toepassingen in
containers.

### Microservices-architectuur {#microservices-architecture}

Splits monolithische toepassingen op in kleinere, schaalbare services met
Docker-containers, bijvoorbeeld:

Neem een webwinkel die bestaat uit verschillende microservices, zoals een
gebruikersservice, een productservice en een bestelservice. Hieronder staat een
vereenvoudigd voorbeeld van hoe je je microservices-architectuur met
Docker-containers opbouwt:

1. **Gebruikersservice:**
   - Zet de gebruikersservice in een eigen container.
   - Bied REST-API's voor het inloggen, registreren en beheren van profielen.

2. **Productservice:**
   - Zet de productservice in een andere container.
   - Bied REST-API's voor productoverzichten, productgegevens en zoeken.

3. **Bestelservice:**
   - Zet de bestelservice in een eigen container.
   - Bied REST-API's om bestellingen te maken, op te vragen en te beheren.

4. **Orkestratie van containers:**
   - Gebruik Kubernetes of Docker Swarm om het uitrollen, schalen en de
     netwerken van deze microservices over een cluster van machines te
     orkestreren en te beheren.

Met een microservices-architectuur met Docker-containers wordt je toepassing
schaalbaarder, flexibeler en weerbaarder, en wordt ontwikkelen, uitrollen en
onderhouden eenvoudiger.

### Infrastructure as Code (IaC)

Richt Docker-hosts in en beheer ze met code, voor een reproduceerbare en
schaalbare infrastructuur, bijvoorbeeld:

Stel dat je Docker-hosts wilt inrichten bij een cloudprovider als AWS, met
hulpmiddelen voor Infrastructure as Code (IaC) zoals Terraform. Hieronder staat
een vereenvoudigd voorbeeld van hoe je je infrastructuur definieert:

```terraform
# main.tf

provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "docker_host" {
  count         = 3
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "docker-host-${count.index}"
  }
}
```

In dit voorbeeld:

- We gebruiken Terraform om de gewenste staat van onze infrastructuur te
  definiëren.
- We geven aan dat we drie Docker-hosts willen inrichten met de dienst AWS EC2.
- Elke Docker-host start vanaf de opgegeven AMI en het opgegeven instantietype.

Met Infrastructure as Code richt je Docker-hosts in en beheer je ze met code,
wat zorgt voor een reproduceerbaar, schaalbaar en consistent uitrolproces voor
je infrastructuur.

### Monitoring en logging {#monitoring-and-logging}

Volg de prestaties van containers en los problemen op met oplossingen voor
monitoring en logging, zoals Prometheus en de ELK-stack, bijvoorbeeld:

Stel dat je een Docker-toepassing in productie hebt draaien en je de prestaties
wilt bewaken en logs wilt verzamelen om problemen op te lossen. Hieronder staat
een vereenvoudigd voorbeeld met Prometheus en de ELK-stack:

1. **Monitoring met Prometheus:**
   - Rol Prometheus naast je toepassing uit met Docker Compose

   ```yaml
   services:
     prometheus:
       image: prom/prometheus
       ports:
         - "9090:9090"
       volumes:
         - ./prometheus.yml:/etc/prometheus/prometheus.yml
       command:
         - "--config.file=/etc/prometheus/prometheus.yml"
   ```

   Stel Prometheus zo in dat het metrics van je toepassing en andere services
   ophaalt.

2. **Logging met de ELK-stack:** rol Elasticsearch, Logstash en Kibana (de
   ELK-stack) uit met Docker Compose.

   ```yml
   services:
     elasticsearch:
       image: docker.elastic.co/elasticsearch/elasticsearch:9.0.0
       environment:
         - discovery.type=single-node
         - xpack.security.enabled=false # for local testing only
       ports:
         - "9200:9200"

     logstash:
       image: docker.elastic.co/logstash/logstash:9.0.0
       volumes:
         - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

     kibana:
       image: docker.elastic.co/kibana/kibana:9.0.0
       ports:
         - "5601:5601"
   ```

   - Stel Logstash zo in dat het de logs van je Docker-containers ophaalt en
     doorstuurt naar Elasticsearch voor opslag en naar Kibana om ze te tonen.

Met monitoring via Prometheus en logging via de ELK-stack krijg je inzicht in de
prestaties van je toepassingen in containers en los je problemen goed op.

## Conclusie {#conclusion}

Wie de gevorderde begrippen van Docker beheerst, ontwikkelt, rolt uit en beheert
toepassingen in containers efficiënt. Verken het ecosysteem van Docker om je
werk te stroomlijnen, de beveiliging te verbeteren en toepassingen goed te
schalen in moderne IT-omgevingen.
