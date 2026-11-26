---
title: "Spiekbriefje voor DNF-commando's"
description:
  "Leer DNF kennen, de krachtige pakketbeheerder van Fedora en andere
  distributies op basis van RPM, met dit uitgebreide spiekbriefje. Leer de
  belangrijkste commando's voor pakketbeheer, repository's, systeemupgrades en
  meer."
url: "linux/fedora/dnf-cheat-sheet"
aliases: ""
icon: "terminal"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Linux
series:
  - Fedora
tags:
  - DNF
  - package management
  - RPM
  - Fedora
  - Linux administration
  - system upgrades
  - repository management
  - kernel management
keywords:
  - DNF commands cheat sheet
  - DNF package manager
  - RPM package management
  - Fedora DNF tutorial
  - Linux system upgrades
  - manage repositories in Linux
  - remove old kernels Fedora

weight: 8102

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Let op: de Linux-shell is hoofdlettergevoelig. {{% /alert %}}

{{% alert context="primary" %}}
Fedora 41 en nieuwer gebruiken **DNF5**. RHEL, CentOS Stream, AlmaLinux en Rocky
Linux gebruiken nog DNF4. Waar de syntaxis verschilt, staan beide vormen erbij.
{{% /alert %}}

## Basispakketbeheer {#basic-package-management}

### Een pakket installeren {#install-a-package}

```bash
sudo dnf install <package_name>
```

Installeert het opgegeven pakket.

### Een pakket verwijderen {#remove-a-package}

```bash
sudo dnf remove <package_name>
```

Verwijdert het opgegeven pakket.

### Een bepaald pakket bijwerken {#update-a-specific-package}

```bash
sudo dnf upgrade <package_name>
```

Werkt het opgegeven pakket bij naar de nieuwste versie.

### Alle pakketten bijwerken {#update-all-packages}

```bash
sudo dnf upgrade
```

Werkt alle geïnstalleerde pakketten bij naar de nieuwste versie.

### Alle geïnstalleerde pakketten tonen {#list-all-installed-packages}

```bash
dnf list --installed
```

Toont een lijst van alle geïnstalleerde pakketten.

### Informatie over een pakket tonen {#show-package-information}

```bash
dnf info <package_name>
```

Toont gedetailleerde informatie over het opgegeven pakket.

### Pakketten zoeken op naam {#search-for-packages-by-name}

```bash
dnf search <package_name>
```

Zoekt pakketten op naam.

### Pakketten zoeken op beschrijving {#search-for-packages-by-description}

```bash
dnf search <keyword>
```

Zoekt pakketten op trefwoorden in de beschrijving.

### Een pakket downloaden zonder te installeren {#download-a-package-without-installing}

```bash
dnf download <package_name>
```

Downloadt het opgegeven pakket zonder het te installeren.

## Repository's beheren {#repository-management}

### Een repository toevoegen {#add-a-repository}

Een repository toevoegen via de URL van een `.repo`-bestand (DNF5):

```bash
sudo dnf config-manager addrepo --from-repofile=<repo_file_url>
```

Gebruik op DNF4 `sudo dnf config-manager --add-repo <repo_file_url>`.

Of maak met de hand een `.repo`-bestand:

1. Maak een `.repo`-bestand in `/etc/yum.repos.d/`:
   ```bash
   sudo nano /etc/yum.repos.d/<repo_name>.repo
   ```
2. Zet de gegevens van de repository in het bestand.

### Een repository uitschakelen {#disable-a-repository}

```bash
sudo dnf config-manager setopt <repo_name>.enabled=0
```

Schakelt de opgegeven repository uit. Gebruik op DNF4
`sudo dnf config-manager --set-disabled <repo_name>`.

### Een repository inschakelen {#enable-a-repository}

```bash
sudo dnf config-manager setopt <repo_name>.enabled=1
```

Schakelt de opgegeven repository in. Gebruik op DNF4
`sudo dnf config-manager --set-enabled <repo_name>`.

### Alle repository's tonen {#list-all-repositories}

```bash
dnf repolist
```

Toont een lijst van alle ingestelde repository's.

## Opruimen {#cleaning-up}

### Ongebruikte pakketten verwijderen {#remove-unused-packages}

```bash
sudo dnf autoremove
```

Verwijdert pakketten die als afhankelijkheid zijn geïnstalleerd maar niet meer
nodig zijn.

### De cache opschonen {#clean-cache}

```bash
sudo dnf clean all
```

Verwijdert alle bestanden in de cache.

### De metadatacache opschonen {#clean-metadata-cache}

```bash
sudo dnf clean metadata
```

Schoont de metadatacache op.

### De pakketcache opschonen {#clean-packages-cache}

```bash
sudo dnf clean packages
```

Schoont de pakketcache op.

### Verlopen cache opschonen {#clean-expired-cache}

```bash
sudo dnf clean expire-cache
```

Schoont de verlopen cache op.

## Groepen beheren {#group-management}

### Beschikbare groepen tonen {#list-available-groups}

```bash
dnf group list
```

Toont alle beschikbare pakketgroepen.

### Een groep installeren {#install-a-group}

```bash
sudo dnf group install "<group_name>"
```

Installeert alle pakketten in de opgegeven groep.

### Een groep verwijderen {#remove-a-group}

```bash
sudo dnf group remove "<group_name>"
```

Verwijdert alle pakketten in de opgegeven groep.

## Geschiedenis en terugdraaien {#history-and-rollback}

### De transactiegeschiedenis bekijken {#view-transaction-history}

```bash
dnf history list
```

Toont de transactiegeschiedenis. Op DNF4 werkt ook `dnf history`.

### Details van een bepaalde transactie bekijken {#view-details-of-a-specific-transaction}

```bash
dnf history info <transaction_id>
```

Toont de details van de opgegeven transactie.

### Een bepaalde transactie ongedaan maken {#undo-a-specific-transaction}

```bash
sudo dnf history undo <transaction_id>
```

Maakt de opgegeven transactie ongedaan.

### Een bepaalde transactie opnieuw uitvoeren {#redo-a-specific-transaction}

```bash
sudo dnf history redo <transaction_id>
```

Voert de opgegeven transactie opnieuw uit.

## Meer commando's {#additional-commands}

### Controleren op beschikbare updates {#check-for-available-updates}

```bash
dnf check-upgrade
```

Controleert of er updates zijn (`check-update` is een alias).

### Ingeschakelde repository's tonen {#list-enabled-repositories}

```bash
dnf repolist --enabled
```

Toont alle ingeschakelde repository's.

### Uitgeschakelde repository's tonen {#list-disabled-repositories}

```bash
dnf repolist --disabled
```

Toont alle uitgeschakelde repository's.

### Het systeem upgraden naar een nieuwe release {#upgrade-system-to-a-new-release}

```bash
sudo dnf system-upgrade download --releasever=<version>
sudo dnf offline reboot
```

Upgradet het systeem naar een nieuwe release. Op DNF4 is het tweede commando
`sudo dnf system-upgrade reboot`. Maak een back-up en werk de huidige release
volledig bij voordat je begint.

### Geïnstalleerde pakketten synchroniseren met de nieuwste versies {#synchronize-installed-packages-to-latest-available-versions}

```bash
sudo dnf distro-sync
```

Synchroniseert de geïnstalleerde pakketten met de nieuwste beschikbare versies.

### De versie van DNF tonen {#display-dnf-version}

```bash
dnf --version
```

Toont de huidige versie van DNF.

### Hulp bij DNF-commando's {#get-help-on-dnf-commands}

```bash
dnf help
```

Toont hulpinformatie over DNF-commando's.

## Oude kernels verwijderen {#removing-old-kernels}

### Geïnstalleerde kernels tonen {#list-installed-kernels}

```bash
dnf list --installed 'kernel*'
```

Toont alle geïnstalleerde kernels.

### De kernel die nu draait controleren {#check-current-running-kernel}

```bash
uname -r
```

Toont de versie van de kernel die nu draait.

### Oude kernels automatisch verwijderen {#automatically-remove-old-kernels}

1. Stel DNF zo in dat alleen de twee nieuwste kernels blijven (Fedora houdt er
   standaard drie):
   ```bash
   sudo nano /etc/dnf/dnf.conf
   ```
   Voeg de volgende regel toe of pas hem aan:
   ```ini
   installonly_limit=2
   ```
   Oude kernels worden dan automatisch verwijderd als er een nieuwe kernel wordt
   geïnstalleerd.
2. Verwijder de oude kernels direct (DNF5). De kernel die draait, wordt
   overgeslagen:
   ```bash
   sudo dnf remove --oldinstallonly
   ```
   Om de ingestelde limiet één keer te omzeilen, voeg je `--limit=2` toe.

Gebruik op DNF4:

```bash
sudo dnf remove $(dnf repoquery --installonly --latest-limit=-2 -q)
```

### Bepaalde oude kernels met de hand verwijderen {#manually-remove-specific-old-kernels}

1. Toon alle geïnstalleerde kernels:
   ```bash
   dnf list --installed 'kernel*'
   ```
2. Bepaal welke oude kernelversies je wilt verwijderen. Verwijder niet de kernel
   die nu draait (die controleer je met `uname -r`).
3. Verwijder een bepaalde oude kernel:
   ```bash
   sudo dnf remove kernel-core-<version>
   ```

### `package-cleanup` gebruiken op DNF4 {#using-package-cleanup-on-dnf4}

De tool `package-cleanup` hoort bij `dnf-utils` en is alleen beschikbaar op DNF4
(bijvoorbeeld op RHEL en klonen daarvan). Op DNF5 bestaat hij niet.

1. Installeer `dnf-utils`:
   ```bash
   sudo dnf install dnf-utils
   ```
2. Houd alleen de twee nieuwste kernels:
   ```bash
   sudo package-cleanup --oldkernels --count=2
   ```

Houd dit spiekbriefje bij de hand voor efficiënt en effectief systeembeheer met
DNF!
