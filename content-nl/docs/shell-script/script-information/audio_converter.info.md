---
title: "audio_converter.info"
description:
  "Een shellscript dat audiobestanden in verschillende formaten (m4a, mp3, wma)
  omzet naar MP3, met een vaste bitrate, samplefrequentie en kanaalindeling."
url: "shell-script/script-info/audio-converter"
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
  - audio conversion
  - shell script
  - mp3 conversion
  - avconv
  - ffmpeg
  - audio tools
  - linux
  - command line
  - scripting
keywords:
  - audio converter
  - convert m4a to mp3
  - convert wma to mp3
  - shell script audio conversion
  - ffmpeg mp3 conversion
  - avconv audio conversion
  - linux audio tools
  - command line audio converter
  - automate audio conversion

weight: 10201

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`audio_converter.sh`, is geschreven door GJS (homelab-alpha) en zet
audiobestanden in verschillende formaten (m4a, mp3, wma) om naar MP3, met vaste
instellingen voor de bitrate, de samplefrequentie en de kanaalindeling.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `audio_converter.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 18 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script zet audiobestanden in formaten zoals m4a, mp3 en
  wma om naar MP3 met een bitrate van 128k, een samplefrequentie van 44,1 kHz en
  2 kanalen.
- **Afhankelijkheden**: `avconv`, `ffmpeg`
- **RAW-script**: [audio_converter.sh]

## Voorbereiding {#setup}

1. **Hoofdletterongevoelig zoeken aanzetten**:

   ```bash
   shopt -s nocasematch
   ```

   Zo herkent het script bestandsextensies los van hoofdletters (bijvoorbeeld
   `.MP3` en `.mp3` worden hetzelfde behandeld).

2. **De werkmap bepalen**:

   ```bash
   working_directory="./mp3_converted"
   ```

   Dit bepaalt de map waarin de omgezette MP3-bestanden worden bewaard.

3. **De map controleren en maken**:
   ```bash
   if [ ! -d "$working_directory" ]; then
     echo "Convert directory does not exist: $working_directory"
     mkdir -p "$working_directory"
     echo "Convert directory created: $working_directory"
   fi
   ```
   Dit blok controleert of de opgegeven map bestaat. Zo niet, dan maakt het de
   map.

## Bestanden omzetten {#file-conversion}

4. **De bestanden in de huidige map doorlopen**:

   ```bash
   for i in *; do
   ```

   Deze lus doorloopt elk bestand in de huidige map.

5. **Case-statement voor de bestandstypen**:

   ```bash
   case $i in
   *.mp3)
   ```

   Dit deel van het script behandelt de bestanden op basis van hun extensie.
   Laten we elk geval bekijken:
   - **MP3-bestanden**:

     ```bash
     avconv -analyzeduration 999999999 -map_metadata 0 -i "$i" -vn -acodec libmp3lame -ac 2 -ab 128k -ar 44100 "$working_directory/$(basename "$i" .mp3).mp3"
     echo "$i converted to MP3"
     ```

     Dit zet MP3-bestanden om met `avconv` en vaste instellingen: een bitrate
     van 128k, een samplefrequentie van 44,1 kHz en 2 kanalen. De metadata
     blijft behouden en het uitvoerbestand wordt in de opgegeven map bewaard.

   - **M4A-bestanden**:

     ```bash
     ffmpeg -i "$i" -n -acodec libmp3lame -ab 128k "$working_directory/$(basename "$i" .m4a).mp3"
     echo "$i converted to MP3"
     ```

     Dit zet M4A-bestanden om met `ffmpeg` en vergelijkbare instellingen. De
     optie `-n` voorkomt dat bestaande bestanden worden overschreven.

   - **WMA-bestanden**:

     ```bash
     avconv -analyzeduration 999999999 -map_metadata 0 -i "$i" -vn -acodec libmp3lame -ac 2 -ab 128k -ar 44100 "$working_directory/$(basename "$i" .wma).mp3"
     echo "$i converted to MP3"
     ```

     Dit zet WMA-bestanden om met `avconv` en dezelfde instellingen als voor
     MP3-bestanden.

   - **Onbekende bestanden**:
     ```bash
     echo "Skipping unrecognized file: $i"
     ```
     Past het bestand bij geen van de bekende extensies, dan slaat het script
     het over en toont het een melding.

## Opruimen {#cleanup}

6. **Hoofdletterongevoelig zoeken uitzetten**:

   ```bash
   shopt -u nocasematch
   ```

   Dit zet de instelling voor hoofdletters terug naar de oorspronkelijke waarde.

7. **Het script beëindigen**:
   ```bash
   exit 0
   ```
   Dit beëindigt het script.

## Conclusie {#conclusion}

Het script `audio_converter.sh` automatiseert het omzetten van verschillende
audioformaten naar MP3 met steeds dezelfde instellingen. Het bewaart de
omgezette bestanden in een vaste map, handelt fouten netjes af en overschrijft
geen bestaande bestanden.

Dit script zet verschillende audioformaten goed om naar MP3, met behoud van de
oorspronkelijke mapstructuur en een nette foutafhandeling.

[audio_converter.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/audio_converter.sh
