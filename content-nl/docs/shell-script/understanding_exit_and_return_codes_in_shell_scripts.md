---
title: "Afsluit- en returncodes in shellscripts begrijpen"
description:
  "Een uitgebreide gids over afsluit- en returncodes in shellscripts. Leer wat
  deze codes betekenen, welke waarden veel voorkomen en hoe je ze goed gebruikt
  in je scripts."
url: "shell-script/understanding-exit-and-return-codes-in-shell-scripts"
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
  - Shell Scripting
  - Exit Codes
  - Return Codes
  - Script Debugging
keywords:
  - shell script exit codes
  - return codes in shell scripting
  - handling errors in shell scripts
  - script status codes

weight: 10903

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Inleiding {#introduction}

Afsluitcodes en returncodes zijn essentieel voor het verloop en de
foutafhandeling van shellscripts. Ze geven aan of commando's en functies zijn
gelukt of mislukt, en geven zo belangrijke informatie voor het debuggen en het
sturen van processen. Deze gids behandelt veelvoorkomende afsluit- en
returncodes, wat ze betekenen en hoe je ze in de praktijk gebruikt.

## Afsluitcodes in shellscripts {#exit-codes-in-shell-scripts}

Afsluitcodes geven de status van een script aan nadat het is gestopt. Ze laten
zien of het script goed is uitgevoerd of op een fout is gestuit. Hieronder staan
enkele veelvoorkomende afsluitcodes en hun betekenis:

| **Afsluitcode** | **Betekenis**                                                                                |
| --------------- | -------------------------------------------------------------------------------------------- |
| **0**           | Uitgevoerd zonder fouten. Het commando of script gaf geen fouten.                            |
| **1**           | Algemene fout. Er ging iets mis tijdens de uitvoering.                                       |
| **2**           | Verkeerd gebruik van ingebouwde shellcommando's.                                             |
| **126**         | Het aangeroepen commando kan niet worden uitgevoerd (bijv. door ontbrekende uitvoerrechten). |
| **127**         | Het commando is niet gevonden.                                                               |
| **128**         | Ongeldig argument voor exit.                                                                 |
| **128 + N**     | Fatale fout door signaal N (N is het nummer van het signaal, bijv. `137` voor `SIGKILL`).    |
| **130**         | Afgebroken met Ctrl+C (SIGINT).                                                              |
| **143**         | Beëindigd door SIGTERM (bijv. een verzoek om te stoppen).                                    |
| **255**         | Afsluitstatus buiten bereik of een niet nader bepaalde fout.                                 |

### Voorbeeld van afsluitcodes {#example-of-using-exit-codes}

```bash
#!/bin/bash

# Check if the file "config.txt" exists
if [ ! -f config.txt ]; then
  echo "Error: The file 'config.txt' does not exist."
  exit 66  # Custom code for file not found
fi

echo "The file 'config.txt' has been found. Proceeding with processing."

# Further actions can be performed here

exit 0  # Successfully executed
```

## Returncodes in shellscripts {#return-codes-in-shell-scripts}

Returncodes worden in shellfuncties gebruikt om de status van de functie aan te
geven. Je stelt ze in met `return`, en het script kan ze na de aanroep van de
functie controleren. Hieronder staan veelvoorkomende returncodes en hun
betekenis:

| **Returncode** | **Betekenis**                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------- |
| **0**          | Uitgevoerd zonder fouten. De functie werkte zonder fouten.                                    |
| **1**          | Algemene fout. Er ging iets mis tijdens de uitvoering van de functie.                         |
| **2**          | Verkeerd gebruik van functieparameters of -argumenten.                                        |
| **64**         | Fout in het gebruik van argumenten (bijv. verkeerde argumenten of een ontbrekende parameter). |
| **65**         | Fout in het gegevensformaat.                                                                  |
| **66**         | Kan het invoerbestand niet openen.                                                            |
| **67**         | Kan het uitvoerbestand niet openen.                                                           |
| **68**         | Kan het tijdelijke bestand niet openen.                                                       |
| **69**         | Fout in de opties of instellingen van de functie.                                             |
| **70**         | Systeemfout (bijv. een verkeerde systeemstatus).                                              |
| **71**         | Bestandsfout (bijv. bestand niet gevonden).                                                   |
| **72**         | Geheugenfout.                                                                                 |
| **73**         | Toegang geweigerd (bijv. onvoldoende rechten).                                                |
| **74**         | Bron tijdelijk niet beschikbaar.                                                              |
| **75**         | Bron uitgeput.                                                                                |
| **76**         | Bestand niet gevonden.                                                                        |
| **77**         | Commando of functie niet gevonden.                                                            |
| **78**         | Commando of functie mislukt.                                                                  |
| **79**         | Time-out (bijv. tijdens een lange bewerking).                                                 |
| **80**         | Bewerking afgebroken door een externe oorzaak.                                                |
| **126**        | De functie kan niet worden uitgevoerd (bijv. door ontbrekende uitvoerrechten).                |
| **127**        | De functie of het commando is niet gevonden.                                                  |
| **128**        | Ongeldige argumenten voor de returncode.                                                      |
| **128 + N**    | Fatale fout door signaal N (N is het nummer van het signaal, bijv. `137` voor `SIGKILL`).     |
| **130**        | Afgebroken met Ctrl+C (SIGINT).                                                               |
| **143**        | Beëindigd door SIGTERM (bijv. een verzoek om te stoppen).                                     |
| **255**        | Returnstatus buiten bereik of een niet nader bepaalde fout.                                   |

### Voorbeeld van returncodes {#example-of-using-return-codes}

```bash
#!/bin/bash

# Function to check a file
check_file() {
  local file="$1"

  if [ -z "$file" ]; then
    echo "Error: No file provided."
    return 2  # Misuse of function parameters
  fi

  if [ ! -f "$file" ]; then
    echo "Error: The file '$file' does not exist."
    return 66  # Cannot open input file
  fi

  echo "The file '$file' has been found."
  return 0  # Successfully executed
}

# Call the function
check_file "$1"
# Save the return code of the function
ret_code=$?

# Check the return code
if [ $ret_code -ne 0 ]; then
  echo "The script terminated with an error. Return code: $ret_code"
  exit $ret_code
fi

echo "Proceeding with processing."

exit 0  # Successfully executed
```

## Overeenkomsten en verschillen tussen afsluitcodes en returncodes {#similarities-and-differences-between-exit-codes-and-return-codes}

### Overeenkomsten {#similarities}

- **Getallen**: zowel afsluit- als returncodes zijn getallen en geven de status
  van de uitvoering aan, gelukt of met fouten.

### Verschillen {#differences}

1. **Waar ze worden gebruikt**:
   - **Afsluitcode**: geeft de status van een heel script aan na de uitvoering.
     Een afsluitcode `0` betekent meestal dat alles is gelukt.
   - **Returncode**: wordt in shellfuncties gebruikt om de status van de functie
     aan te geven. De functie stelt de returncode in en het script controleert
     die.

2. **Gebruik in een shellscript**:
   - **Afsluitcode**:
     - Ingesteld met `exit <code>` aan het eind van een script.
     - Voorbeeld: `exit 1` geeft aan dat het script met een fout is gestopt.
   - **Returncode**:
     - Ingesteld met `return <code>` in een functie.
     - Voorbeeld: `return 2` geeft aan dat de functie met een bepaalde
       foutstatus is geëindigd.

Met afsluit- en returncodes beheer en meld je de status en de fouten van je
scripts en functies.

## Debuggen en logging {#debugging-and-logging}

### Tips voor debuggen {#debugging-tips}

Zo debug je scripts goed:

- **Zet de uitgebreide modus aan**: gebruik `set -x` om de uitvoering van
  commando's te volgen.
- **Gebruik hulpmiddelen voor debuggen**: hulpmiddelen als `shellcheck` helpen
  mogelijke problemen in je scripts te vinden.

### Voorbeelden van logging {#logging-examples}

Log afsluit- en returncodes om ze later te analyseren:

```bash
#!/bin/bash

LOGFILE="script.log"

echo "Script started at $(date)" >> $LOGFILE

# Example command
command_output=$(your_command 2>&1)
exit_code=$?
echo "Command output: $command_output" >> $LOGFILE
echo "Exit code: $exit_code" >> $LOGFILE

exit $exit_code
```

## Afsluitcodes in complexe situaties {#exit-codes-in-complex-scenarios}

### Gekoppelde commando's {#chained-commands}

Bij gekoppelde commando's (bijv. `command1 && command2`) hangt de afsluitstatus
van `command2` af van de afsluitstatus van `command1`.

### Subshells

Vang de afsluitcode van een subshell op met `$?`, direct na het commando in de
subshell:

```bash
(
  command1
  command2
)
subshell_exit_code=$?
```

## Returncodes in complexe situaties {#return-codes-in-complex-scenarios}

### Geneste functies {#nested-functions}

Vang de returncodes van geneste functies op:

```bash
nested_function() {
  # Do something
  return 1
}

parent_function() {
  nested_function
  return_code=$?
  if [ $return_code -ne 0 ]; then
    echo "Nested function failed with code $return_code"
    return $return_code
  fi
}

parent_function
```

## Eigen afsluit- en returncodes {#custom-exit-and-return-codes}

### Eigen codes bepalen {#defining-custom-codes}

Bepaal en gebruik eigen afsluit- en returncodes voor specifieke situaties:

```bash
#!/bin/bash

CUSTOM_ERROR_CODE=99

if [ some_condition ]; then
  echo "Custom error occurred."
  exit $CUSTOM_ERROR_CODE
fi
```

## Integratie met CI/CD {#cicd-integration}

### CI/CD-pipelines

Stel pipelines in CI/CD-omgevingen zo in dat ze specifieke afsluitcodes goed
afhandelen, om build- en deploymentprocessen te beheren.

### Automatische foutafhandeling {#automatic-error-handling}

Pas automatische foutafhandeling toe:

```bash
#!/bin/bash

command || {
  echo "Command failed with exit code $?"
  exit 1
}
```

## Veelgestelde vragen {#faqs}

### Wat doe ik als een script een onverwachte afsluitcode geeft? {#what-should-i-do-if-a-script-returns-an-unexpected-exit-code}

**Antwoord:** zo los je onverwachte afsluitcodes op:

1. **Controleer de afsluitcode**: bekijk welke afsluitcode is teruggegeven.
2. **Bekijk de logs**: zoek in de logbestanden naar meer context.
3. **Debug je script**: volg de commando's met hulpmiddelen voor debuggen.
4. **Lees de foutmeldingen**: analyseer de foutmeldingen voor aanwijzingen.
5. **Raadpleeg de documentatie**: zoek de betekenis van specifieke afsluitcodes
   op.
6. **Test in kleine stappen**: zonder de fout af door kleinere delen van het
   script uit te voeren.

### Hoe ga ik om met afsluitcodes op verschillende platformen? {#how-can-i-handle-exit-codes-in-a-cross-platform-environment}

**Antwoord:** zo beheer je afsluitcodes op verschillende platformen:

1. **Gebruik standaardcodes**: houd je aan standaardcodes voor consistentie.
2. **Gebruik platformonafhankelijke hulpmiddelen**: kies hulpmiddelen en shells
   die op meerdere platformen werken.
3. **Ken de platformen**: begrijp hoe elk platform afsluitcodes afhandelt.
4. **Test op meerdere platformen**: zorg dat je scripts op alle doelplatformen
   werken.
5. **Gebruik CI/CD-pipelines**: automatiseer het testen op meerdere platformen
   in CI/CD-pipelines.
6. **Documenteer verschillen per platform**: noteer de aanpassingen die per
   platform nodig zijn.

### Hoe gebruik en documenteer ik eigen afsluitcodes goed? {#how-can-i-effectively-use-and-document-custom-exit-codes}

**Antwoord:** voor eigen afsluitcodes:

1. **Kies duidelijke codes**: kies unieke codes met een duidelijke betekenis.
2. **Documenteer eigen codes**: leg de codes en hun betekenis duidelijk vast.
3. **Gebruik ze consequent**: pas eigen codes in alle scripts op dezelfde manier
   toe.
4. **Overleg met je team**: zorg dat je team de eigen codes begrijpt.
5. **Voorkom conflicten**: voorkom botsingen met standaardcodes of andere eigen
   codes.

### Hoe beheer ik afsluitcodes in complexe scripts? {#how-can-i-manage-exit-codes-in-complex-scripts}

**Antwoord:** zo beheer je afsluitcodes in complexe scripts:

1. **Gebruik duidelijke codes**: pas duidelijke, consequente codes toe.
2. **Log afsluitcodes**: leg afsluitcodes en foutmeldingen vast.
3. **Schrijf unittests**: test functies en delen van het script.
4. **Let op subshells en gekoppelde commando's**: ga in deze situaties
   zorgvuldig om met afsluitcodes.
5. **Bouw foutafhandeling in**: controleer afsluitcodes en handel fouten passend
   af.

## Conclusie {#conclusion}

Afsluit- en returncodes begrijpen en goed gebruiken is essentieel voor degelijke
shellscripts. Deze codes geven informatie over de uitvoering van een script en
helpen fouten te beheren. Als je ze beheerst, worden je scripts betrouwbaarder
en makkelijker te debuggen. Raadpleeg voor meer informatie andere bronnen en
documentatie.
