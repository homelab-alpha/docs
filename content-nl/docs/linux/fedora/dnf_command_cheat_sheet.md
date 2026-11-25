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

## Basispakketbeheer

### Een pakket installeren

```bash
sudo dnf install <package_name>
```

Installeert het opgegeven pakket.

### Een pakket verwijderen

```bash
sudo dnf remove <package_name>
```

Verwijdert het opgegeven pakket.

### Een bepaald pakket bijwerken

```bash
sudo dnf upgrade <package_name>
```

Werkt het opgegeven pakket bij naar de nieuwste versie.

### Alle pakketten bijwerken

```bash
sudo dnf upgrade
```

Werkt alle geïnstalleerde pakketten bij naar de nieuwste versie.

### Alle geïnstalleerde pakketten tonen

```bash
dnf list --installed
```

Toont een lijst van alle geïnstalleerde pakketten.

### Informatie over een pakket tonen

```bash
dnf info <package_name>
```

Toont gedetailleerde informatie over het opgegeven pakket.

### Pakketten zoeken op naam

```bash
dnf search <package_name>
```

Zoekt pakketten op naam.

### Pakketten zoeken op beschrijving

```bash
dnf search <keyword>
```

Zoekt pakketten op trefwoorden in de beschrijving.

### Een pakket downloaden zonder te installeren

```bash
dnf download <package_name>
```

Downloadt het opgegeven pakket zonder het te installeren.

## Repository's beheren

### Een repository toevoegen

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

### Een repository uitschakelen

```bash
sudo dnf config-manager setopt <repo_name>.enabled=0
```

Schakelt de opgegeven repository uit. Gebruik op DNF4
`sudo dnf config-manager --set-disabled <repo_name>`.

### Een repository inschakelen

```bash
sudo dnf config-manager setopt <repo_name>.enabled=1
```

Schakelt de opgegeven repository in. Gebruik op DNF4
`sudo dnf config-manager --set-enabled <repo_name>`.

### Alle repository's tonen

```bash
dnf repolist
```

Toont een lijst van alle ingestelde repository's.

## Opruimen

### Ongebruikte pakketten verwijderen

```bash
sudo dnf autoremove
```

Verwijdert pakketten die als afhankelijkheid zijn geïnstalleerd maar niet meer
nodig zijn.

### De cache opschonen

```bash
sudo dnf clean all
```

Verwijdert alle bestanden in de cache.

### De metadatacache opschonen

```bash
sudo dnf clean metadata
```

Schoont de metadatacache op.

### De pakketcache opschonen

```bash
sudo dnf clean packages
```

Schoont de pakketcache op.

### Verlopen cache opschonen

```bash
sudo dnf clean expire-cache
```

Schoont de verlopen cache op.

## Groepen beheren

### Beschikbare groepen tonen

```bash
dnf group list
```

Toont alle beschikbare pakketgroepen.

### Een groep installeren

```bash
sudo dnf group install "<group_name>"
```

Installeert alle pakketten in de opgegeven groep.

### Een groep verwijderen

```bash
sudo dnf group remove "<group_name>"
```

Verwijdert alle pakketten in de opgegeven groep.

## Geschiedenis en terugdraaien

### De transactiegeschiedenis bekijken

```bash
dnf history list
```

Toont de transactiegeschiedenis. Op DNF4 werkt ook `dnf history`.

### Details van een bepaalde transactie bekijken

```bash
dnf history info <transaction_id>
```

Toont de details van de opgegeven transactie.

### Een bepaalde transactie ongedaan maken

```bash
sudo dnf history undo <transaction_id>
```

Maakt de opgegeven transactie ongedaan.

### Een bepaalde transactie opnieuw uitvoeren

```bash
sudo dnf history redo <transaction_id>
```

Voert de opgegeven transactie opnieuw uit.

## Meer commando's

### Controleren op beschikbare updates

```bash
dnf check-upgrade
```

Controleert of er updates zijn (`check-update` is een alias).

### Ingeschakelde repository's tonen

```bash
dnf repolist --enabled
```

Toont alle ingeschakelde repository's.

### Uitgeschakelde repository's tonen

```bash
dnf repolist --disabled
```

Toont alle uitgeschakelde repository's.

### Het systeem upgraden naar een nieuwe release

```bash
sudo dnf system-upgrade download --releasever=<version>
sudo dnf offline reboot
```

Upgradet het systeem naar een nieuwe release. Op DNF4 is het tweede commando
`sudo dnf system-upgrade reboot`. Maak een back-up en werk de huidige release
volledig bij voordat je begint.

### Geïnstalleerde pakketten synchroniseren met de nieuwste versies

```bash
sudo dnf distro-sync
```

Synchroniseert de geïnstalleerde pakketten met de nieuwste beschikbare versies.

### De versie van DNF tonen

```bash
dnf --version
```

Toont de huidige versie van DNF.

### Hulp bij DNF-commando's

```bash
dnf help
```

Toont hulpinformatie over DNF-commando's.

## Oude kernels verwijderen

### Geïnstalleerde kernels tonen

```bash
dnf list --installed 'kernel*'
```

Toont alle geïnstalleerde kernels.

### De kernel die nu draait controleren

```bash
uname -r
```

Toont de versie van de kernel die nu draait.

### Oude kernels automatisch verwijderen

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

### Bepaalde oude kernels met de hand verwijderen

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

### `package-cleanup` gebruiken op DNF4

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
