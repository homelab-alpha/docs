---
title: "Snelstart AdGuard Home"
description:
  "Ga snel aan de slag met AdGuard Home met deze beknopte snelstarthandleiding,
  en verbeter de veiligheid en privacy van je internet."
url: "adguard-home/quickstart"
aliases: ""
icon: "rocket_launch"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - AdGuard Home
series:
  - AdGuard Home
tags:
  - AdGuard Home
  - ad blocking
  - DNS filtering
  - internet security
  - network protection
  - privacy protection
  - home network
  - quickstart guide
keywords:
  - AdGuard Home
  - ad blocking
  - DNS filtering
  - internet security
  - network protection
  - privacy protection
  - home network
  - quickstart guide

weight: 1002

toc: true
katex: true
---

## Linux and macOS

### Met `curl`

Gebruik je liever `curl`, voer dan het volgende commando uit in je terminal:

```bash
curl -s -S -L https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
```

Dit commando downloadt het installatiescript en voert het uit. De vlaggen zorgen
voor `-s` stil, `-S` fouten tonen en `-L` omleidingen volgen. De vlag `-v` is
optioneel en geeft uitgebreide uitvoer.

### Met `wget`

Gebruik je liever `wget`, voer dan dit commando uit in je terminal:

```bash
wget --no-verbose -O - https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
```

Net als bij `curl` downloadt dit commando het script en voert het uit. De vlag
`--no-verbose` beperkt de uitvoer, en `-O` stuurt de uitvoer naar stdout.

### Met `fetch`

Gebruik je FreeBSD of liever `fetch`, voer dan het volgende commando uit in je
terminal:

```bash
fetch -o - https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
```

Dit commando downloadt het script met `fetch` en voert het daarna uit. De vlag
`-o` stuurt de uitvoer naar stdout.

Na het downloaden en uitvoeren van het installatiescript staat AdGuard Home op
je systeem. Bekijk de inhoud van het script wel eerst goed voordat je het
uitvoert, zodat je zeker weet dat het past bij je beveiligingspraktijken.

### Scriptopties

Het installatiescript heeft verschillende opties:

- `-c <channel>`: gebruik een bepaald kanaal.
- `-r`: installeer AdGuard Home opnieuw.
- `-u`: verwijder AdGuard Home.
- `-v`: toon uitgebreide uitvoer.

{{% alert context="warning" %}}
Let op: de opties `-r` en `-u` sluiten elkaar uit en kun je niet samen
gebruiken. {{% /alert %}}

## Andere methoden

Installeer je liever met de hand, lees dan het artikel **[getting
started][wiki-start]** op de website van AdGuard Home voor gedetailleerde
instructies.

Je kunt ook de officiële Docker-image op [Docker Hub] gebruiken, of AdGuard Home
veilig en eenvoudig installeren uit de [Snap Store] als je Ubuntu gebruikt.

Met deze methoden kies je wat het beste past bij je voorkeuren en je systeem.

[wiki-start]: https://adguard-dns.io/kb/adguard-home/getting-started
[Docker Hub]: https://hub.docker.com/r/adguard/adguardhome
[Snap Store]: https://snapcraft.io/adguard-home
