---
title: "check_pi_throttling.info"
description:
  "Bewaak met dit shellscript of je Raspberry Pi wordt afgeknepen. Het
  controleert met het hulpmiddel `vcgencmd` op te lage spanning, een begrensde
  frequentie en temperatuurgrenzen."
url: "shell-script/script-info/check-pi-throttling"
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
  - Raspberry Pi
  - Throttling
  - System Monitoring
  - Shell Script
keywords:
  - Raspberry Pi throttling
  - vcgencmd
  - undervolting
  - frequency capping
  - temperature limits
  - system health monitoring
  - shell scripting

weight: 10202

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`check_pi_throttling.sh`, is geschreven door GJS (homelab-alpha) en controleert
met het hulpmiddel `vcgencmd` of een Raspberry Pi wordt afgeknepen (throttling).
Dat is handig om de gezondheid van het systeem te bewaken en te zorgen dat het
binnen veilige grenzen werkt.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `check_pi_throttling.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 18 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script controleert met het hulpmiddel `vcgencmd` of een
  Raspberry Pi wordt afgeknepen.
- **RAW-script**: [check_pi_throttling.sh]

## Vlagbits {#flag-bits}

Dit zijn hexadecimale constanten voor de verschillende situaties van afknijpen:

```bash
UNDERVOLTED=0x1
CAPPED=0x2
THROTTLED=0x4
SOFT_TEMPLIMIT=0x8
HAS_UNDERVOLTED=0x10000
HAS_CAPPED=0x20000
HAS_THROTTLED=0x40000
HAS_SOFT_TEMPLIMIT=0x80000
```

- `UNDERVOLTED`: geeft aan of de Pi nu een te lage spanning heeft.
- `CAPPED`: geeft aan of de CPU-frequentie nu is begrensd.
- `THROTTLED`: geeft aan of de Pi nu wordt afgeknepen.
- `SOFT_TEMPLIMIT`: geeft aan of de Pi een zachte temperatuurgrens heeft
  bereikt.
- `HAS_UNDERVOLTED`: geeft aan of de Pi sinds de laatste herstart ooit een te
  lage spanning had.
- `HAS_CAPPED`: geeft aan of de CPU-frequentie sinds de laatste herstart ooit is
  begrensd.
- `HAS_THROTTLED`: geeft aan of de Pi sinds de laatste herstart ooit is
  afgeknepen.
- `HAS_SOFT_TEMPLIMIT`: geeft aan of de Pi sinds de laatste herstart ooit een
  zachte temperatuurgrens heeft bereikt.

## Tekstkleuren {#text-colors}

Deze bepalen met `tput` de kleurcodes voor de uitvoer, zodat die beter leesbaar
is:

```bash
GREEN=$(tput setaf 2)
RED=$(tput setaf 1)
NC=$(tput sgr0)
```

- `GREEN`: maakt de tekst groen.
- `RED`: maakt de tekst rood.
- `NC`: zet de tekstkleur terug naar de standaard.

## Uitvoerteksten {#output-strings}

Deze zorgen voor vaste meldingen voor een "goede" en een "slechte" status:

```bash
GOOD="${GREEN}NO${NC}"
BAD="${RED}YES${NC}"
```

- `GOOD`: een status zonder probleem, met de groene tekst "NO".
- `BAD`: een status met een probleem, met de rode tekst "YES".

## De status ophalen en de hexwaarde eruit halen {#get-status-and-extract-hex-value}

Dit deel vraagt de status op bij het hulpmiddel `vcgencmd` en haalt die eruit:

```bash
STATUS=$(vcgencmd get_throttled)
STATUS=${STATUS#*=}
```

- `STATUS=$(vcgencmd get_throttled)`: voert het commando
  `vcgencmd get_throttled` uit, dat de status van het afknijpen teruggeeft.
- `STATUS=${STATUS#*=}`: haalt het voorvoegsel "throttled=" weg, zodat alleen de
  hexwaarde overblijft.

## De status tonen {#display-status}

Dit deel van het script toont de huidige status in een leesbare vorm:

```bash
echo -n "Status: "
((STATUS != 0)) && echo "${RED}${STATUS}${NC}" || echo "${GREEN}${STATUS}${NC}"
echo ""
```

- `echo -n "Status: "`: toont "Status: " zonder nieuwe regel.
- `((STATUS != 0)) && echo "${RED}${STATUS}${NC}" || echo "${GREEN}${STATUS}${NC}"`:
  controleert of `STATUS` niet nul is. Zo ja, dan toont het de status in rood;
  anders in groen.

## Controle per situatie {#detailed-condition-checks}

Daarna controleert en toont het script of elke situatie nu speelt en of die ooit
heeft gespeeld:

```bash
echo "Undervolted:"
echo -n "Now: "
((STATUS & UNDERVOLTED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo -n "Run: "
((STATUS & HAS_UNDERVOLTED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo ""

echo "Throttled:"
echo -n "Now: "
((STATUS & THROTTLED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo -n "Run: "
((STATUS & HAS_THROTTLED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo ""

echo "Frequency Capped:"
echo -n "Now: "
((STATUS & CAPPED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo -n "Run: "
((STATUS & HAS_CAPPED != 0)) && echo "${BAD}" || echo "${GOOD}"
echo ""

echo "Softlimit:"
echo -n "Now: "
((STATUS & SOFT_TEMPLIMIT != 0)) && echo "${BAD}" || echo "${GOOD}"
echo -n "Run: "
((STATUS & HAS_SOFT_TEMPLIMIT != 0)) && echo "${BAD}" || echo "${GOOD}"
echo ""
```

Voor elke situatie (Undervolted, Throttled, Frequency Capped en Softlimit):

1. **Huidige status**:
   - `echo -n "Now: "`: toont "Now: " zonder nieuwe regel.
   - `((STATUS & CONDITION != 0)) && echo "${BAD}" || echo "${GOOD}"`:
     controleert of de situatie nu speelt en toont dan "YES" (in rood), anders
     "NO" (in groen).

2. **Eerdere status**:
   - `echo -n "Run: "`: toont "Run: " zonder nieuwe regel.
   - `((STATUS & HAS_CONDITION != 0)) && echo "${BAD}" || echo "${GOOD}"`:
     controleert of de situatie ooit heeft gespeeld en toont dan "YES" (in
     rood), anders "NO" (in groen).

## Conclusie {#conclusion}

Met dit script zie je snel of je Raspberry Pi problemen met de voeding of de
temperatuur heeft gehad die de prestaties kunnen beïnvloeden. Door de kleuren in
de uitvoer zie je problemen in één oogopslag.

[check_pi_throttling.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/check_pi_throttling.sh
