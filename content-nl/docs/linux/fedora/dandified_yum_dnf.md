---
title: "Dandified YUM (DNF)"
description: "DNF, de krachtige pakketbeheerder van Fedora en Red Hat Enterprise Linux"
(RHEL), and their derivatives."
url: "linux/fedora/dnf"
aliases:
  - /dnf
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
  - package manager
  - RPM
  - software management
  - Linux administration
  - Fedora tools
  - DNF
  - YUM
keywords:
  - Dandified YUM
  - DNF Fedora
  - RPM-based distributions
  - Fedora package manager
  - Linux package management
  - Red Hat Enterprise Linux
  - DNF commands

weight: 8101

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Let op: de Linux-shell is hoofdlettergevoelig. {{% /alert %}}

## Wat is DNF?

DNF, kort voor Dandified YUM, is de opvolger van de pakketbeheerder Yellowdog
Updater, Modified (YUM) voor distributies op basis van RPM. Het is gemaakt om
YUM te verbeteren op het gebied van prestaties, het oplossen van
afhankelijkheden en het omgaan met grote aantallen pakketten.

{{% alert context="primary" %}}
Fedora 41 en nieuwer gebruiken **DNF5**, een volledig herschreven versie van DNF
in C++ die sneller is en minder geheugen gebruikt. RHEL, CentOS Stream,
AlmaLinux en Rocky Linux gebruiken nog DNF4. De meeste commando's in deze
handleiding werken op beide versies. Waar de syntaxis verschilt, staan beide
vormen erbij. Het oudere commando `yum` is alleen nog een alias voor `dnf`.
{{% /alert %}}

## Pakketten installeren en bijwerken

### Een pakket installeren

Een pakket installeer je met het commando `install`, gevolgd door de naam van
het pakket. Om bijvoorbeeld `nano` te installeren:

```bash
sudo dnf install nano
```

### Een pakket verwijderen

Een pakket verwijder je met het commando `remove`:

```bash
sudo dnf remove nano
```

### Een pakket bijwerken

Een bepaald pakket werk je bij met het commando `upgrade` (`update` is een alias
die nog steeds werkt):

```bash
sudo dnf upgrade nano
```

### Alle pakketten bijwerken

Alle geïnstalleerde pakketten bijwerken naar de nieuwste versie:

```bash
sudo dnf upgrade
```

## Pakketten zoeken

### Zoeken op naam

Je zoekt pakketten op naam met het commando `search`:

```bash
dnf search nano
```

### Zoeken op beschrijving

Weet je de precieze naam van het pakket niet, dan kun je zoeken op beschrijving
of andere kenmerken:

```bash
dnf search editor
```

## Repository's beheren

### Een repository toevoegen

Een nieuwe repository voeg je meestal toe met een `.repo`-bestand in de map
`/etc/yum.repos.d/`. Bijvoorbeeld:

```bash
sudo nano /etc/yum.repos.d/newrepo.repo
```

Zet daarna de gegevens van de repository in het bestand (gebruik
`https://`-URL's als je repository dat ondersteunt):

```shell
[newrepo]
name=New Repository
baseurl=https://repository.url/path/
enabled=1
gpgcheck=1
gpgkey=https://repository.url/path/RPM-GPG-KEY
```

Je kunt met DNF5 ook een repository toevoegen via de URL van een
`.repo`-bestand:

```bash
sudo dnf config-manager addrepo --from-repofile=https://repository.url/path/newrepo.repo
```

Installeer op DNF4 `dnf-plugins-core` en gebruik
`sudo dnf config-manager --add-repo https://repository.url/path/newrepo.repo`.

### Een repository uitschakelen

Een repository uitschakelen:

```bash
sudo dnf config-manager setopt newrepo.enabled=0
```

Op DNF4: `sudo dnf config-manager --set-disabled newrepo`.

### Een repository inschakelen

Een repository inschakelen:

```bash
sudo dnf config-manager setopt newrepo.enabled=1
```

Op DNF4: `sudo dnf config-manager --set-enabled newrepo`.

## Opruimen

### Ongebruikte pakketten verwijderen

Na verloop van tijd verzamel je pakketten die niet meer nodig zijn. Deze
verweesde pakketten verwijder je zo:

```bash
sudo dnf autoremove
```

### De cache opschonen

DNF bewaart gegevens in een cache om sneller te werken, maar soms moet je die
cache opschonen:

```bash
sudo dnf clean all
```

## Meer commando's en tips

### Geïnstalleerde pakketten tonen

Alle geïnstalleerde pakketten tonen:

```bash
dnf list --installed
```

### Informatie over een pakket tonen

Gedetailleerde informatie over een pakket tonen:

```bash
dnf info nano
```

### Pakketten downloaden zonder te installeren

Wil je een pakket downloaden zonder het te installeren (handig voor installaties
zonder internet):

```bash
dnf download nano
```

### Groepen installeren

DNF kan groepen pakketten installeren, handig om een omgeving in te richten.
Beschikbare groepen tonen:

```bash
dnf group list
```

Een groep installeren:

```bash
sudo dnf group install development-tools
```

DNF5 toont de ID van de groep in de uitvoer van `dnf group list`. Met de ID
voorkom je problemen met spaties en hoofdletters in groepsnamen.

### Geschiedenis en terugdraaien

DNF houdt alle transacties bij, zodat je wijzigingen ongedaan kunt maken. De
transactiegeschiedenis bekijken:

```bash
dnf history list
```

Op DNF4 werkt `dnf history` ook zonder subcommando.

Een bepaalde transactie maak je ongedaan met de transactie-ID uit de
geschiedenis:

```bash
sudo dnf history undo <transaction_id>
```

## Aanbevolen werkwijzen

1. **Regelmatig bijwerken**: werk je systeem regelmatig bij voor veiligheid en
   stabiliteit.
2. **Repository's beheren**: schakel alleen repository's in die je vertrouwt en
   nodig hebt.
3. **Opruimen**: ruim regelmatig ongebruikte pakketten en de cache op om ruimte
   vrij te maken.
4. **Let op afhankelijkheden**: houd rekening met afhankelijkheden als je
   pakketten installeert of verwijdert, zodat je je systeem niet stukmaakt.

## Conclusie

DNF is een krachtige en flexibele pakketbeheerder die softwarebeheer op systemen
met RPM een eitje maakt. Met deze commando's en tips regel je het meeste
pakketbeheer efficiënt. Voor geavanceerder gebruik zijn het commando `man dnf`
en de officiële [DNF-documentatie](https://dnf.readthedocs.io/en/latest/)
uitstekende bronnen. Veel plezier met pakketbeheer!
