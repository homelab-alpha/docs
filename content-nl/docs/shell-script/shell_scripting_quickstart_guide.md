---
title: "Snelstartgids voor shellscripts"
description: "Begin aan je reis met shellscripts met deze snelstartgids"
url: "shell-script/quickstart"
aliases: ""
icon: "rocket_launch"

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
keywords:
  - shell scripting
  - quickstart guide
  - shell script basics
  - shell script introduction
  - shell script tutorial
  - shell script commands
  - shell script examples

weight: 10902

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Kennismaking met shellscripts {#introduction-to-shell-scripting}

Shellscripts zijn een krachtig hulpmiddel: je automatiseert taken, bewerkt
bestanden en stroomlijnt je werk door een reeks commando's in een scriptbestand
uit te voeren. Een shellscript is de brug tussen jou en het besturingssysteem en
maakt herhalende taken eenvoudiger en sneller.

## Aan de slag {#getting-started}

### Je omgeving inrichten {#setting-up-your-environment}

Richt eerst je omgeving in voordat je shellscripts gaat schrijven:

1. **Kies een shell**: de meest gebruikte shell is `bash` (Bourne Again Shell),
   maar ook `sh`, `zsh` en `ksh` worden veel gebruikt.
2. **Teksteditor**: schrijf je scripts in een teksteditor. Populaire keuzes zijn
   `vim`, `nano` en `VSCode`.
3. **Toegang tot een terminal**: zorg dat je een terminal hebt. Op macOS of
   Linux heb je er al een. Op Windows kun je Git Bash, WSL (Windows Subsystem
   for Linux) of Cygwin gebruiken.

### Basiscommando's {#basic-commands}

Dit zijn enkele basiscommando's die je vaak gebruikt in shellscripts:

- `echo`: toont tekst in de terminal.
- `cd`: gaat naar een andere map.
- `ls`: toont bestanden en mappen.
- `pwd`: toont de huidige werkmap.
- `mkdir`: maakt een nieuwe map.
- `rm`: verwijdert bestanden of mappen.

## Je eerste script schrijven {#writing-your-first-script}

Laten we een eenvoudig script schrijven om te beginnen:

1. **Maak een nieuw bestand**:

   ```sh
   touch myscript.sh
   ```

2. Open het bestand in je teksteditor en voeg deze regels toe:

   ```sh
   #!/bin/bash
   echo "Hello, World!"
   ```

3. Maak het script uitvoerbaar:

   ```sh
   chmod +x myscript.sh
   ```

4. Voer het script uit:

   ```bash
   ./myscript.sh
   ```

Je ziet nu de uitvoer Hello, World! in je terminal.

## Veelgebruikte commando's in shellscripts {#common-shell-script-commands}

Dit zijn nog meer commando's en begrippen die belangrijk zijn voor shellscripts:

- Variabelen: bewaar waarden om ze opnieuw te gebruiken.

```sh
name="Alice"
echo "Hello, $name"
```

- Lussen: herhaal commando's meerdere keren.

```sh
for i in {1..5}
do
  echo "Number: $i"
done
```

- Voorwaarden: neem beslissingen op basis van voorwaarden.

```sh
if [ $name == "Alice" ]; then
  echo "Hello, Alice"
else
  echo "You are not Alice"
fi
```

- Functies: groepeer commando's in herbruikbare blokken.

```sh
greet() {
  echo "Hello, $1"
}
greet "Bob"
```

## Voorbeelden van shellscripts {#shell-script-examples}

### Voorbeeld 1: back-upscript {#example-1-backup-script}

Dit script maakt een back-up van een map naar een opgegeven plek:

```sh
#!/bin/bash

SOURCE_DIR="/path/to/source"
BACKUP_DIR="/path/to/backup"

if [ -d "$SOURCE_DIR" ]; then
  tar -czf "$BACKUP_DIR/backup_$(date +%F).tar.gz" "$SOURCE_DIR"
  echo "Backup completed successfully."
else
  echo "Source directory does not exist."
fi
```

### Voorbeeld 2: script voor gebruikersbeheer {#example-2-user-management-script}

Dit script voegt een nieuwe gebruiker toe aan het systeem:

```sh
#!/bin/bash

read -p "Enter username: " username
sudo useradd -m "$username"
echo "User $username has been added."
```

## Gevorderde onderwerpen {#advanced-topics}

Als je de basis beheerst, kun je verder met gevorderde onderwerpen, zoals:

- Foutafhandeling: degelijke controles om onverwachte situaties op te vangen.
- Logging: een log van de acties van je script bijhouden, om te debuggen en te
  controleren.
- Debuggen: hulpmiddelen als set -x gebruiken om de uitvoering van je script te
  volgen.
- Goede gewoonten: schone, onderhoudbare en efficiënte scripts schrijven.

## Bronnen {#resources}

Bekijk deze bronnen om je vaardigheden met shellscripts verder te ontwikkelen:

- **Boeken**:
  - _"Learning the bash Shell"_ van Cameron Newham
  - _"Linux Command-Line and Shell Scripting Bible"_ van Richard Blum en
    Christine Bresnahan

- **Online handleidingen**:
  - [Shell Scripting Tutorial]
  - [Bash Guide for Beginners]

- **Gemeenschappen**:
  - [Stack Overflow]
  - [Reddit - r/bash]

Begin met vertrouwen aan je reis met shellscripts! Oefen regelmatig, probeer
verschillende commando's uit en vraag gerust hulp aan de gemeenschap. Veel
plezier met scripten!

[Shell Scripting Tutorial]: https://www.shellscript.sh
[Bash Guide for Beginners]: https://tldp.org/LDP/Bash-Beginners-Guide/html
[Stack Overflow]: https://stackoverflow.com/questions/tagged/bash
[Reddit - r/bash]: https://www.reddit.com/r/bash
