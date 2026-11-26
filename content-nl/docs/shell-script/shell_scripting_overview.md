---
title: "Overzicht van shellscripts"
description: "Ontdek de basis van shellscripts met dit uitgebreide overzicht"
url: "shell-script/overview"
aliases: ""
icon: "overview"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Shell Script
tags:
  - shell scripting
  - shell script
  - automation
  - system configuration
  - Unix-like systems
keywords:
  - shell scripting
  - shell script overview
  - shell script basics
  - shell script usage
  - shell script examples
  - shell script repository
  - shell script contributions
  - log files
  - shellcheck
  - bash scripting guide
  - copyright
  - license

weight: 10901

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="warning" %}}
**Let op** - Deze documentatie is nog in bewerking {{% /alert %}}

## Inleiding {#introduction}

Shellscripts zijn tekstbestanden met commando's die de shell leest en uitvoert.
Ze worden vaak gebruikt om taken te automatiseren, systeeminstellingen te
beheren en allerlei handelingen uit te voeren op Unix-achtige
besturingssystemen.

## Gebruik {#usage}

Elk shellscript in deze repository staat op zichzelf en kan direct vanaf de
opdrachtregel worden uitgevoerd. Zorg voordat je een script uitvoert dat je de
nodige rechten hebt en dat de benodigde software is geïnstalleerd.

Ga in de terminal naar de map van het script en voer dit commando uit:

```bash
./script_name.sh
```

Vervang `script_name.sh` door de naam van het script dat je wilt uitvoeren.

## Shellscripts {#shell-scripts}

Hier volgt een kort overzicht van de scripts in de repository Homelab-Alpha
Shell Script. Bekijk gerust de documentatie van elk script voor meer details.

### audio_converter.sh

**Beschrijving:** Dit script zet audiobestanden in verschillende formaten (m4a,
mp3, wma) om naar MP3 met een bitrate van 128k, een samplefrequentie van 44,1
kHz en 2 kanalen.\ **Uitgebreide uitleg:** [audio_converter.info]\
**RAW-script:** [audio_converter.sh]

### check_pi_throttling.sh

**Beschrijving:** Dit script controleert of een Raspberry Pi wordt afgeknepen
(throttling), met het hulpmiddel vcgencmd.\ **Uitgebreide uitleg:**
[check_pi_throttling.info]\ **RAW-script:** [check_pi_throttling.sh]

### check_system_info.sh

**Beschrijving:** Dit script toont systeeminformatie: uptime, hardware,
temperatuur, de status van systemctl, het gebruik van RAM en SWAP,
schijfgebruik, inodes en de laatste herstarts en afsluitingen.\ **Uitgebreide
uitleg:** [check_system_info.info]\ **RAW-script:** [check_system_info.sh]

### clearcache.sh

**Beschrijving:** Dit script leegt de schone caches en de vrij te maken
slab-objecten, zoals dentries en inodes.\ **Uitgebreide uitleg:**
[clearcache.info]\ **RAW-script:** [clearcache.sh]

### cronjob_template.sh

**Beschrijving:** Dit script is een sjabloon voor een cronjob en stuurt een ping
naar een monitoringserver als controle van de systeemgezondheid.\ **Uitgebreide
uitleg:** [cronjob_template.info]\ **RAW-script:** [cronjob_template.sh]

### github_pr_inspector.sh

**Beschrijving:** Dit script biedt een interactieve interface om .patch- en
.diff-links te maken voor pull requests op GitHub. Zo kun je de wijzigingen van
een PR direct in de terminal bekijken. Het script heeft een interactief menu,
vaste repository's en eigen invoer.\ **Uitgebreide uitleg:**
[github_pr_inspector.info]\ **RAW-script:** [github_pr_inspector.sh]

### gnome_keybindings_backup_restore.sh

**Beschrijving:** Met dit script maak je eenvoudig een back-up van de
sneltoetsen van GNOME en zet je die terug wanneer nodig. Het maakt een
back-upmap op de opgegeven plek en bewaart de sneltoetsinstellingen van
verschillende GNOME-onderdelen. Daarna kies je of je een back-up maakt of de
sneltoetsen terugzet.\ **Uitgebreide uitleg:**
[gnome_keybindings_backup_restore.info]\ **RAW-script:**
[gnome_keybindings_backup_restore.sh]

### gpg_keygen_script.sh

**Beschrijving:** Dit script maakt een GPG-sleutelpaar voor veilige
communicatie. Het controleert de benodigde software, maakt het sleutelpaar en
logt de acties. Het script heeft ook opties voor uitgebreide uitvoer en voor de
GPG-map.\ **Uitgebreide uitleg:** [gpg_keygen_script.info]\ **RAW-script:**
[gpg_keygen_script.sh]

### install_latest_dart_sass.sh

**Beschrijving:** Dit script haalt de nieuwste versie van Dart Sass op uit de
officiële GitHub-repository, downloadt die, installeert die in
/usr/local/dart-sass en ruimt de gedownloade bestanden op.\ **Uitgebreide
uitleg:** [install_latest_dart_sass.info]\ **RAW-script:**
[install_latest_dart_sass.sh]

### install_latest_go.sh

**Beschrijving:** Dit script haalt de nieuwste versie van Go op van de officiële
downloadpagina van Go, downloadt die, installeert die in /usr/local/go en ruimt
de gedownloade bestanden op.\ **Uitgebreide uitleg:** [install_latest_go.info]\
**RAW-script:** [install_latest_go.sh]

### install_latest_hugo.sh

**Beschrijving:** Dit script haalt de nieuwste versie van Hugo op uit de
officiële GitHub-repository, downloadt die, installeert die in
/usr/local/hugo-extended en ruimt de gedownloade bestanden op.\ **Uitgebreide
uitleg:** [install_latest_hugo.info]\ **RAW-script:** [install_latest_hugo.sh]

### install_latest_jetbrains_mono.sh

**Beschrijving:** Het script haalt de nieuwste versie van JetBrains Mono op uit
de officiële GitHub-repository, downloadt die, installeert die in de
systeembrede lettertypemap en ruimt de gedownloade bestanden op.\ **Uitgebreide
uitleg:** [install_latest_jetbrains_mono.info]\ **RAW-script:**
[install_latest_jetbrains_mono.sh]

### install_latest_protoc.sh

**Beschrijving:** Dit script haalt de nieuwste versie van protoc (Protocol
Buffers) op uit de officiële GitHub-repository, downloadt die, installeert die
in /usr/local/protoc en ruimt de gedownloade bestanden op.\ **Uitgebreide
uitleg:** [install_latest_protoc.info]\ **RAW-script:**
[install_latest_protoc.sh]

### maintain_git_repo.sh

**Beschrijving:** Dit script automatiseert het onderhoud van een Git-repository.
Het ruimt overbodige bestanden op en zet de commitgeschiedenis opnieuw in, voor
een frisse start, een betere ordening en een kleinere repository. Dat is vooral
handig na een import uit een ander versiebeheersysteem, of voor een schone
geschiedenis.\ **Uitgebreide uitleg:** [maintain_git_repo.info]\ **RAW-script:**
[maintain_git_repo.sh]

### new_docker_compose_file.sh

**Beschrijving:** Dit script maakt een nieuw Docker Compose-bestand en
configuratiebestanden op basis van je invoer.\ **Uitgebreide uitleg:**
[new_docker_compose_file.info]\ **RAW-script:** [new_docker_compose_file.sh]

### new_docker_project.sh

**Beschrijving:** Dit script maakt een nieuwe mapstructuur voor een
Docker-container en configuratiebestanden op basis van je invoer.\ **Uitgebreide
uitleg:** [new_docker_project.info]\ **RAW-script:** [new_docker_project.sh]

### ssh_keygen_script.sh

**Beschrijving:** Dit script automatiseert het maken en omzetten van
SSH-sleutelparen voor veilige communicatie. Het ondersteunt ed25519 en RSA; je
kiest het soort sleutel, de bestandsnaam van het sleutelpaar en de SSH-map. Het
script logt alle acties en fouten in een logbestand, zodat je ze kunt nalopen.\
**Uitgebreide uitleg:** [ssh_keygen_script.info]\ **RAW-script:**
[ssh_keygen_script.sh]

### super_linter.sh

**Beschrijving:** Dit script maakt lokaal linten van repository's mogelijk met
GitHub Super Linter. Het start de Docker-container van Super Linter en kan een
lokale Git-repository of een bepaalde map linten.\ **Uitgebreide uitleg:**
[super_linter.info]\ **RAW-script:** [super_linter.sh]

### sync_containers.sh

**Beschrijving:** Dit script synchroniseert Docker-containerimages uit een vaste
lijst. Het controleert de vrije schijfruimte en het formaat van de labels van de
containers, en logt alle acties en fouten in een logbestand.\ **Uitgebreide
uitleg:** [sync_containers.info]\ **RAW-script:** [sync_containers.sh]

### uptime_kuma_pr_test_v2.sh

**Beschrijving:** Hiermee kunnen ontwikkelaars pull requests voor Uptime Kuma
testen, door een Docker-container met de opgegeven image van Uptime Kuma te
starten op aparte poorten voor de app en de API.\ **Uitgebreide uitleg:**
[uptime_kuma_pr_test_v2.info]\ **RAW-script:** [uptime_kuma_pr_test_v2.sh]

### user_accounts_info.sh

**Beschrijving:** Dit script haalt informatie op over de gebruikersaccounts van
het systeem en deelt ze in als systeemaccounts en gewone gebruikers.\
**Uitgebreide uitleg:** [user_accounts_info.info]\ **RAW-script:**
[user_accounts_info.sh]

## Functiescripts {#function-scripts}

Hier volgt een kort overzicht van de functiescripts in de repository
Homelab-Alpha Shell Script:

### cpg.sh

**Beschrijving:** Dit script biedt de functie 'cpg' om bestanden of mappen van
een bron naar een doel te kopiëren. Het werkt met losse bestanden en met mappen,
ook recursief.\ **Uitgebreide uitleg:** [cpg.info]\ **RAW-script:** [cpg.sh]

### dns_check.sh

**Beschrijving:** Dit script controleert de netwerkverbinding en of de
DNS-servers bereikbaar zijn. Het voert geen vaste taak uit, maar helpt bij het
zoeken naar netwerkproblemen.\ **Uitgebreide uitleg:** [dns_check.info]\
**RAW-script:** [dns_check.sh]

### encrypt_and_decrypt.sh

**Beschrijving:** Dit script biedt functies om bestanden of mappen te
versleutelen en te ontsleutelen met AES-256 en OpenSSL.\ **Uitgebreide uitleg:**
[encrypt_and_decrypt.info]\ **RAW-script:** [encrypt_and_decrypt.sh]

### ex.sh

**Beschrijving:** Dit script pakt eenvoudig allerlei archiefformaten uit, zoals
tar, zip, gzip, bzip2 en rar. Het herkent het formaat zelf en kiest de juiste
manier van uitpakken.\ **Uitgebreide uitleg:** [ex.info]\ **RAW-script:**
[ex.sh]

### health_check.sh

**Beschrijving:** Dit script controleert of een URL bereikbaar is via HTTP en
HTTPS.\ **Uitgebreide uitleg:** [health_check.info]\ **RAW-script:**
[health_check.sh]

### mkdirg.sh

**Beschrijving:** Dit script maakt een map als die nog niet bestaat en gaat
erin.\ **Uitgebreide uitleg:** [mkdirg.info]\ **RAW-script:** [mkdirg.sh]

### mvg.sh

**Beschrijving:** Dit script verplaatst een bestand of map naar een opgegeven
doel en gaat daarna naar de doelmap.\ **Uitgebreide uitleg:** [mvg.info]\
**RAW-script:** [mvg.sh]

### targzip.sh

**Beschrijving:** Dit script maakt een tar-archief van een map of bestand en
comprimeert het met gzip.\ **Uitgebreide uitleg:** [targzip.info]\
**RAW-script:** [targzip.sh]

### tarzip.sh

**Beschrijving:** Dit script maakt een gecomprimeerd archief (.zip) van een
opgegeven map met tar en zip.\ **Uitgebreide uitleg:** [tarzip.info]\
**RAW-script:** [tarzip.sh]

### up.sh

**Beschrijving:** Dit script definieert de functie 'up()' om een opgegeven
aantal mapniveaus omhoog te gaan. Voer het script uit in een terminal en geef
het aantal niveaus op.\ **Uitgebreide uitleg:** [up.info]\ **RAW-script:**
[up.sh]

## Dotfiles-scripts

Hier volgt een kort overzicht van de scripts in de repository Homelab-Alpha
Dotfiles:

### dotfiles_installer.sh

**Beschrijving:** Het script biedt een functie om dotfiles te installeren en te
verwijderen, met back-ups en het terugzetten ervan wanneer nodig.\ **Uitgebreide
uitleg:** [dotfiles_installer.info]\ **RAW-script:** [dotfiles_installer.sh]

## OpenSSL-scripts

Hier volgt een kort overzicht van de scripts in de repository Homelab-Alpha
OpenSSL:

### tls_dotfiles_installer.sh

**Beschrijving:** Dit script voegt inhoud toe aan het bestand ~/.bashrc zonder
dubbele items. Het controleert of ~/.bashrc bestaat en voegt de inhoud aan het
eind toe als die er nog niet staat.\ **Uitgebreide uitleg:**
[tls_dotfiles_installer.info]\ **RAW-script:** [tls_dotfiles_installer.sh]

### tls_directory_setup.sh

**Beschrijving:** Zet de mappen voor TLS-certificaatbeheer op, maakt een
database per autoriteit en kopieert de OpenSSL-configuratiebestanden. Het script
kan veilig opnieuw worden uitgevoerd.\ **Uitgebreide uitleg:**
[tls_directory_setup.info]\ **RAW-script:** [tls_directory_setup.sh]

### tls_directory_migrate.sh

**Beschrijving:** Dit script verplaatst de oude map ~/ssl naar ~/tls, laat een
symbolische koppeling achter en wijzigt het oude pad in de
OpenSSL-configuratiebestanden.\ **Uitgebreide uitleg:**
[tls_directory_migrate.info]\ **RAW-script:** [tls_directory_migrate.sh]

### trusted_id.sh

**Beschrijving:** Dit script maakt en beheert een vertrouwd rootcertificaat:
sleutels maken, het certificaat maken, controleren en formaten omzetten.\
**Uitgebreide uitleg:** [trusted-id.info]\ **RAW-script:** [trusted_id.sh]

### root_ca.sh

**Beschrijving:** Dit script zet een root-certificaatautoriteit op en beheert
die: sleutels maken, de CSR maken, het certificaat uitgeven en controleren.\
**Uitgebreide uitleg:** [root_ca.info]\ **RAW-script:** [root_ca.sh]

### ca.sh

**Beschrijving:** Dit script beheert een tussenliggende certificaatautoriteit:
sleutels maken, de CSR maken, het certificaat uitgeven en controleren.\
**Uitgebreide uitleg:** [ca.info]\ **RAW-script:** [ca.sh]

### cert_ecdsa_localhost.sh

**Beschrijving:** Dit script automatiseert het maken van een ECDSA-certificaat
voor localhost: sleutel, CSR, uitgifte en controle.\ **Uitgebreide uitleg:**
[cert_ecdsa_localhost.info]\ **RAW-script:** [cert_ecdsa_localhost.sh]

### cert_ecdsa_server.sh

**Beschrijving:** Dit script automatiseert het maken van een
ECDSA-servercertificaat: sleutel, CSR, uitgifte en controle.\ **Uitgebreide
uitleg:** [cert_ecdsa_server.info]\ **RAW-script:** [cert_ecdsa_server.sh]

### cert_ecdsa_client.sh

**Beschrijving:** Dit script automatiseert het maken van een
ECDSA-clientcertificaat: sleutel, CSR, uitgifte en controle.\ **Uitgebreide
uitleg:** [cert_ecdsa_client.info]\ **RAW-script:** [cert_ecdsa_client.sh]

### cert_rsa_server.sh

**Beschrijving:** Dit script automatiseert het maken en beheren van
RSA-certificaten voor serverauthenticatie: sleutel, CSR, uitgifte, controle en
het klaarzetten van de ketenbundels.\ **Uitgebreide uitleg:**
[cert_rsa_server.info]\ **RAW-script:** [cert_rsa_server.sh]

### cert_rsa_client.sh

**Beschrijving:** Automatiseert het maken en beheren van RSA-clientcertificaten:
sleutel, CSR, uitgifte, controle en het klaarzetten van de ketenbundels.\
**Uitgebreide uitleg:** [cert_rsa_client.info]\ **RAW-script:**
[cert_rsa_client.sh]

### cert.sh

**Beschrijving:** Dit script geeft elk server- en clientcertificaat uit, met een
ECDSA- of RSA-sleutel, ondertekend door de tussenliggende certificaatautoriteit.
De vijf scripts `cert_*.sh` starten het met vaste opties.\ **Uitgebreide
uitleg:** [cert.info]\ **RAW-script:** [cert.sh]

### common.sh

**Beschrijving:** De gedeelde functies van de OpenSSL-scripts: meldingen, de
basismap, invoercontroles, wachtwoordzinnen, de vergrendeling en het archief. De
andere scripts laden dit bestand met `source`.\ **Uitgebreide uitleg:**
[common.info]\ **RAW-script:** [common.sh]

### verify_tls_certificates.sh

**Beschrijving:** Dit script controleert TLS-certificaten tegen hun
vertrouwensketen. Met een optie toont het uitgebreide uitvoer van de controles.\
**Uitgebreide uitleg:** [verify_tls_certificates.info]\ **RAW-script:**
[verify_tls_certificates.sh]

## Logbestanden {#log-files}

Waar logbestanden staan, verschilt per besturingssysteem en toepassing.
Logbestanden staan vaak in een submap van de installatiemap van de toepassing,
of in een systeemmap zoals `/var/log` op Linux.

## Bijdragen aan Homelab-Alpha - Shell Script {#contribute-to-homelab-alpha---shell-script}

We waarderen je bijdrage en willen het zo makkelijk mogelijk maken om bij te
dragen aan de repository Homelab-Alpha - shell-script. Wijzigingen gaan via pull
requests naar de branch `main`. Zie [bijdragen][contribute] om te lezen hoe je
kunt bijdragen.

## Dankwoord {#acknowledgements}

- [ShellCheck]: een hulpmiddel dat shellscripts analyseert en verbeteringen
  voorstelt.
- [Bash Scripting Guide]: een uitgebreide handleiding voor Bash-scripts.

## Licentie {#license}

Dit project valt onder de **Creative Commons
Naamsvermelding-NietCommercieel-GelijkDelen 4.0 Internationaal-licentie** (CC
BY-NC-SA 4.0). Zie de pagina [licentie][license] voor de volledige licentietekst
en het bestand [NOTICE] voor de eisen aan de naamsvermelding.

[audio_converter.info]:
  docs/../../shell-script/script-information/audio_converter.info.md
[audio_converter.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/audio_converter.sh
[check_pi_throttling.info]:
  docs/../../shell-script/script-information/check_pi_throttling.info.md
[check_pi_throttling.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/check_pi_throttling.sh
[check_system_info.info]:
  docs/../../shell-script/script-information/check_system_info.info.md
[check_system_info.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/check_system_info.sh
[clearcache.info]: docs/../../shell-script/script-information/clearcache.info.md
[clearcache.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/clearcache.sh
[cronjob_template.info]:
  docs/../../shell-script/script-information/cronjob_template.info.md
[cronjob_template.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/cronjob_template.sh
[github_pr_inspector.info]:
  docs/../../shell-script/script-information/github_pr_inspector.info.md
[github_pr_inspector.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/github_pr_inspector.sh
[gnome_keybindings_backup_restore.info]:
  docs/../../shell-script/script-information/gnome_keybindings_backup_restore.info.md
[gnome_keybindings_backup_restore.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/gnome_keybindings_backup_restore.sh
[gpg_keygen_script.info]:
  docs/../../shell-script/script-information/gpg_keygen_script.info.md
[gpg_keygen_script.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/gpg_keygen_script.sh
[install_latest_dart_sass.info]:
  docs/../../shell-script/script-information/install_latest_dart_sass.info.md
[install_latest_dart_sass.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_dart_sass.sh
[install_latest_go.info]:
  docs/../../shell-script/script-information/install_latest_go.info.md
[install_latest_go.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_go.sh
[install_latest_hugo.info]:
  docs/../../shell-script/script-information/install_latest_hugo.info.md
[install_latest_hugo.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_hugo.sh
[install_latest_jetbrains_mono.info]:
  docs/../../shell-script/script-information/install_latest_jetbrains_mono.info.md
[install_latest_jetbrains_mono.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_jetbrains_mono.sh
[install_latest_protoc.info]:
  docs/../../shell-script/script-information/install_latest_protoc.info.md
[install_latest_protoc.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_protoc.sh
[maintain_git_repo.info]:
  docs/../../shell-script/script-information/maintain_git_repo.info.md
[maintain_git_repo.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/maintain_git_repo.sh
[new_docker_compose_file.info]:
  docs/../../shell-script/script-information/new_docker_compose_file.info.md
[new_docker_compose_file.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/new_docker_compose_file.sh
[new_docker_project.info]:
  docs/../../shell-script/script-information/new_docker_project.info.md
[new_docker_project.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/new_docker_project.sh
[ssh_keygen_script.info]:
  docs/../../shell-script/script-information/ssh_keygen_script.info.md
[ssh_keygen_script.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/ssh_keygen_script.sh
[super_linter.info]:
  docs/../../shell-script/script-information/super_linter.info.md
[super_linter.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/super_linter.sh
[sync_containers.info]:
  docs/../../shell-script/script-information/sync_containers.info.md
[sync_containers.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/sync_containers.sh
[uptime_kuma_pr_test_v2.info]:
  docs/../../shell-script/script-information/uptime_kuma_pr_test_v2.info.md
[uptime_kuma_pr_test_v2.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/uptime_kuma_pr_test_v2.sh
[user_accounts_info.info]:
  docs/../../shell-script/script-information/user_accounts_info.info.md
[user_accounts_info.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/user_accounts_info.sh
[cpg.info]: docs/../../shell-script/function-Information/cpg.info.md
[cpg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/cpg.sh
[dns_check.info]: docs/../../shell-script/function-Information/dns_check.info.md
[dns_check.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/dns_check.sh
[encrypt_and_decrypt.info]:
  docs/../../shell-script/function-Information/encrypt_and_decrypt.info.md
[encrypt_and_decrypt.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/encrypt_and_decrypt.sh
[ex.info]: docs/../../shell-script/function-Information/ex.info.md
[ex.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/ex.sh
[health_check.info]:
  docs/../../shell-script/function-Information/health_check.info.md
[health_check.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/health_check.sh
[mkdirg.info]: docs/../../shell-script/function-Information/mkdirg.info.md
[mkdirg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/mkdirg.sh
[mvg.info]: docs/../../shell-script/function-Information/mvg.info.md
[mvg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/mvg.sh
[targzip.info]: docs/../../shell-script/function-Information/targzip.info.md
[targzip.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/targzip.sh
[tarzip.info]: docs/../../shell-script/function-Information/tarzip.info.md
[tarzip.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/tarzip.sh
[up.info]: docs/../../shell-script/function-Information/up.info.md
[up.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/up.sh
[dotfiles_installer.info]: docs/../../dotfiles/dotfiles_install.info.md
[dotfiles_installer.sh]:
  https://raw.githubusercontent.com/homelab-alpha/dotfiles/main/dotfiles_installer.sh
[tls_dotfiles_installer.info]:
  docs/../../openssl/script-information/tls_dotfiles_installer.info.md
[tls_dotfiles_installer.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/tls_dotfiles_installer.sh
[tls_directory_setup.info]:
  docs/../../openssl/script-information/tls_directory_setup.info.md
[tls_directory_setup.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/tls_directory_setup.sh
[tls_directory_migrate.info]:
  docs/../../openssl/script-information/tls_directory_migrate.info.md
[tls_directory_migrate.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/tls_directory_migrate.sh
[trusted-id.info]: docs/../../openssl/script-information/trusted_id.info.md
[trusted_id.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/certificate-authority/trusted_id.sh
[root_ca.info]: docs/../../openssl/script-information/root_ca.info.md
[root_ca.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/certificate-authority/root_ca.sh
[ca.info]: docs/../../openssl/script-information/ca.info.md
[ca.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/intermediate-certificate-authority/ca.sh
[cert_ecdsa_localhost.info]:
  docs/../../openssl/script-information/cert_ecdsa_localhost.info.md
[cert_ecdsa_localhost.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/certificate/cert_ecdsa_localhost.sh
[cert_ecdsa_server.info]:
  docs/../../openssl/script-information/cert_ecdsa_server.info.md
[cert_ecdsa_server.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/certificate/cert_ecdsa_server.sh
[cert_ecdsa_client.info]:
  docs/../../openssl/script-information/cert_ecdsa_client.info.md
[cert_ecdsa_client.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/certificate/cert_ecdsa_client.sh
[cert_rsa_server.info]:
  docs/../../openssl/script-information/cert_rsa_server.info.md
[cert_rsa_server.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/certificate/cert_rsa_server.sh
[cert_rsa_client.info]:
  docs/../../openssl/script-information/cert_rsa_client.info.md
[cert_rsa_client.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/certificate/cert_rsa_client.sh
[cert.info]: docs/../../openssl/script-information/cert.info.md
[cert.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/certificate/cert.sh
[common.info]: docs/../../openssl/script-information/common.info.md
[common.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/lib/common.sh
[verify_tls_certificates.info]:
  docs/../../openssl/script-information/verify_tls_certificates.info.md
[verify_tls_certificates.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/main/scripts/verify_tls_certificates.sh
[contribute]: /contributing/contribute/
[ShellCheck]: https://www.shellcheck.net/
[Bash Scripting Guide]: https://www.tldp.org/LDP/abs/html/
[license]: /license/
[NOTICE]: https://github.com/homelab-alpha/shell-script/blob/main/NOTICE
