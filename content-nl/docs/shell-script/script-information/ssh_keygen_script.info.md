---
title: "ssh_keygen_script.info"
description:
  "Dit script automatiseert het maken en omzetten van SSH-sleutelparen, met
  ondersteuning voor ed25519 en RSA. Je kiest het soort sleutel, de bestandsnaam
  en de SSH-map, en alle acties en fouten worden gelogd, zodat je ze kunt
  nalopen."
url: "shell-script/script-info/ssh-keygen-script"
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
  - SSH
  - Key Generation
  - Shell Script
  - Automation
  - Security
keywords:
  - SSH keygen
  - shell script
  - SSH automation
  - ed25519 key
  - RSA key
  - SSH key conversion
  - SSH directory
  - secure communication
  - script logging

weight: 10217

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`ssh_keygen_script.sh`, is geschreven door GJS (homelab-alpha) en automatiseert
het maken en omzetten van SSH-sleutelparen voor veilige communicatie. Het
ondersteunt `ed25519` en `RSA`; je kiest het soort sleutel, de bestandsnaam van
het sleutelpaar en de SSH-map. Daarnaast logt het script alle acties en fouten
in een logbestand, zodat je ze kunt nalopen.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `ssh_keygen_script.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 7 december 2024
- **Versie**: 1.0.1
- **Beschrijving**: dit script automatiseert het maken en omzetten van
  SSH-sleutelparen voor veilige communicatie. Het ondersteunt `ed25519` en
  `RSA`; je kiest het soort sleutel, de bestandsnaam van het sleutelpaar en de
  SSH-map. Het script logt alle acties en fouten in een logbestand, zodat je ze
  kunt nalopen.
- **RAW-script**: [ssh_keygen_script.sh]

## Gebruiksinstructies {#usage-instructions}

- **Gebruik**: `./ssh_keygen_script.sh [-v] [-d /path/to/ssh_directory]`
- **Opties**:
  - `-v, --verbose`: zet de uitgebreide modus aan, met meer informatie tijdens
    de uitvoering.
  - `-d, --directory`: geeft het pad naar de SSH-map. De standaardmap is
    `$HOME/.ssh`.
- **Voorbeelden**:
  1. Een SSH-sleutelpaar maken en omzetten: `./ssh_keygen_script.sh`
  2. Een SSH-sleutelpaar maken en omzetten met uitgebreide uitvoer:
     `./ssh_keygen_script.sh -v`
  3. Een SSH-sleutelpaar maken en omzetten met een eigen SSH-map:
     `./ssh_keygen_script.sh -d /custom/path/to/ssh_directory`

## Standaardwaarden en instellingen {#default-values-and-configuration}

- **Standaard SSH-map**: `$HOME/.ssh`
- **Standaardextensie voor omgezette sleutels**: `ppk`
- **Pad van het logbestand**: `$ssh_dir/ssh_keygen_script.log`

## Functies van het script {#script-functions}

### Hulpfuncties {#utility-functions}

1. **In cyaan tonen**: de functie `print_cyan` toont tekst in cyaan, zodat die
   beter leesbaar is in de terminal.

   ```sh
   print_cyan() {
     echo -e "\e[36m$1\e[0m"
   }
   ```

2. **Kopjes tonen**: de functie `print_section_header` toont kopjes in cyaan.

   ```sh
   print_section_header() {
     echo ""
     echo ""
     echo -e "$(print_cyan "=== $1 ===")"
   }
   ```

3. **Uitgebreide informatie tonen**: de functie `display_verbose_info` toont de
   inhoud van de gemaakte en omgezette publieke sleutels als de uitgebreide
   modus aan staat.

   ```sh
   display_verbose_info() {
     local key_type="$1"
     local key_file="$2"
     local extension="$3"

     if [ "$verbose" == "true" ]; then
       print_cyan "${key_type} public key:"
       cat "${key_file}.pub"
       print_cyan "Converted ${key_type} public key:"
       cat "${key_file}.${extension}"
     fi
   }
   ```

4. **Meldingen loggen**: de functie `log_message` logt acties en fouten met een
   tijdstempel in het logbestand.

   ```sh
   log_message() {
     local timestamp
     timestamp=$(date +"%Y-%m-%d %H:%M:%S")

     echo "${timestamp} - ${1}" >>"$log_file" 2>&1
   }
   ```

### Hoofdfuncties {#main-functionalities}

1. **Logging starten**: begint de logging aan het begin van de uitvoering.

   ```sh
   echo "" >>"$log_file"
   log_message "=== beginning of the log ==="
   log_message "Script execution started"
   ```

2. **Gebruiksinstructies tonen**: toont de gebruiksinformatie van het script.

   ```sh
   display_usage() {
     echo "Usage: $0 [-v] [-d /path/to/ssh_directory]"
     echo "Options:"
     echo "  -v, --verbose    Enable verbose mode"
     echo "  -d, --directory  Specify the path to the SSH directory (default is \$HOME/.ssh)"
     exit 1
   }
   ```

3. **Benodigde software controleren**: zorgt dat de benodigde software
   (`ssh-keygen` en `putty`) is geïnstalleerd. Ontbreekt er iets, dan stopt het
   met een fout.

   ```sh
   check_required_software() {
     local software_list=("ssh-keygen" "putty")
     local missing_software=()

     for software in "${software_list[@]}"; do
       if ! command -v "$software" >/dev/null 2>&1; then
         missing_software+=("$software")
       fi
     done

     if [ ${#missing_software[@]} -eq 0 ]; then
       log_message "All required software is installed."
     else
       log_message "Error: The following required software is not installed: ${missing_software[*]}"
       log_message "Please install the missing software manually."
       exit 1
     fi
   }
   ```

4. **Signalen opvangen**: vangt onderbrekingssignalen op, zodat het script
   netjes stopt.

   ```sh
   trap_handler() {
     echo ""
     log_message "Script execution interrupted. Cleaning up..."
     echo "=== end of the log ===" >>"$log_file"
     exit 1
   }
   ```

5. **Sleutelpaar maken**: maakt een SSH-sleutelpaar van het opgegeven soort.

   ```sh
   generate_key_pair() {
     local key_type="$1"
     local file_name="$2"

     log_message "Generating new ${key_type} SSH key pair for server: ${server}, filename: ${file_name}"
     print_section_header "Generating new ${key_type} SSH key pair"
     if ssh-keygen -a 100 -C "${server}" -f "${ssh_dir}/id_${key_type}_${file_name}" -t "${key_type}" >>"$log_file" 2>&1; then
       log_message "Successfully generated ${key_type} SSH key pair for filename: ${file_name}"
     else
       log_message "Failed to generate ${key_type} SSH key pair for filename: ${file_name}"
       log_message "=== end of the log ==="
       exit 1
     fi
   }
   ```

6. **Sleutelpaar omzetten**: zet het gemaakte SSH-sleutelpaar met `puttygen` om
   naar een opgegeven formaat.

   ```sh
   convert_key_pair() {
     local key_type="$1"
     local file_name="$2"

     log_message "Convert ${key_type} SSH key pair to ${file_name}.${file_extension}"
     print_section_header "Convert ${key_type} SSH key pair to ${file_name}.${file_extension}"
     if puttygen "${ssh_dir}/id_${key_type}_${file_name}" -o "${ssh_dir}/id_${key_type}_${file_name}.${file_extension}" >>"$log_file" 2>&1; then
       log_message "Successfully converted ${key_type} SSH key pair for filename: ${file_name}"
     else
       log_message "Failed to convert ${key_type} SSH key pair for filename: ${file_name}"
       log_message "=== end of the log ==="
       exit 1
     fi
   }
   ```

7. **Controleren of het sleutelbestand bestaat**: zorgt dat het opgegeven
   sleutelbestand nog niet bestaat, zodat het niet wordt overschreven.

   ```sh
   check_key_file_existence() {
     local key_type="$1"
     local file_name="$2"

     if [ -f "${ssh_dir}/id_${key_type}_${file_name}" ]; then
       log_message "The ${key_type} SSH key pair already exists for filename: ${file_name}"
       log_message "=== end of the log ==="
       echo "$(print_cyan "Error:") The ${key_type} SSH key pair already exists for filename: ${file_name}"
       exit 1
     fi
   }
   ```

8. **Soort sleutel kiezen**: vraagt welk soort SSH-sleutel je wilt en maakt en
   zet daarna het sleutelpaar om.
   ```sh
   choose_key_type() {
     echo ""
     print_cyan "Choose the SSH key type:"
     PS3="Enter your choice (1 for ed25519, 2 for RSA): "
     options=("ed25519" "RSA")
     select KEY_TYPE in "${options[@]}"; do
       case $KEY_TYPE in
       "ed25519")
         check_key_file_existence "ed25519" "${file_name}"
         generate_key_pair "ed25519" "${file_name}"
         convert_key_pair "ed25519" "${file_name}"
         display_verbose_info "ed25519" "${ssh_dir}/id_ed25519_${file_name}" "${file_extension}"
         log_message "Ed25519 SSH key pair generated and converted for filename: ${file_name}"
         break
         ;;
       "RSA")
         check_key_file_existence "rsa" "${file_name}"
         generate_key_pair "rsa" "${file_name}"
         convert_key_pair "rsa" "${file_name}"
         display_verbose_info "RSA" "${ssh_dir}/id_rsa_${file_name}" "${file_extension}"
         log_message "RSA SSH key pair generated and converted for filename: ${file_name}"
         break
         ;;
       *)
         echo "Invalid option. Choose 1 for ed25519 or 2 for RSA."
         ;;
       esac
     done
   }
   ```

### Uitvoering van het script {#script-execution}

1. **Benodigde software controleren**: zorgt dat de benodigde software is
   geïnstalleerd.

   ```sh
   check_required_software
   ```

2. **Opties instellen**: verwerkt de opties op de opdrachtregel voor de
   uitgebreide modus en een eigen SSH-map.

   ```sh
   verbose=false
   while [[ $# -gt 0 ]]; do
     case "$1" in
     -v | --verbose)
       verbose=true
       shift
       ;;
     -d | --directory)
       shift
       ssh_dir="$1"
       shift
       ;;
     *)
       display_usage
       ;;
     esac
   done
   ```

3. **Onderbrekingen opvangen**: stelt handlers in voor onderbrekingen van het
   script.

   ```sh
   trap trap_handler SIGINT SIGTERM
   ```

4. **Gegevens van het SSH-sleutelpaar vragen**: vraagt om de servernaam en de
   bestandsnaam.

   ```sh
   read -r -p "$(print_cyan "Enter the server name: ")" server
   read -r -p "$(print_cyan "Enter the filename for the new SSH key pair: ")" file_name
   ```

5. **Controleren of het sleutelbestand bestaat**: zorgt dat het opgegeven
   sleutelbestand nog niet bestaat.

   ```sh
   check_key_file_existence "ed25519" "${file_name}"
   check_key_file_existence "rsa" "${file_name}"
   ```

6. **Soort sleutel kiezen**: vraagt welk soort sleutel je wilt en gaat verder
   met maken en omzetten.

   ```sh
   choose_key_type
   ```

7. **Afronding loggen**: logt dat de uitvoering van het script klaar is.
   ```sh
   log_message "Script execution completed for filename: ${file_name}"
   log_message "=== end of the log ==="
   ```

Deze uitgebreide uitleg geeft een volledig beeld van het script
`ssh_keygen_script.sh`: het doel, het gebruik, de belangrijkste functies en het
verloop van de uitvoering.

## Conclusie {#conclusion}

Dit script is een complete oplossing om SSH-sleutelparen te maken en om te
zetten, met ingebouwde logging, uitgebreide uitvoer en degelijke
foutafhandeling, voor een soepele uitvoering die je kunt nalopen.

[ssh_keygen_script.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/ssh_keygen_script.sh
