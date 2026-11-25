---
title: "gnome_keybindings_backup_restore.info"
description:
  "Dit script maakt het beheer van de sneltoetsen van GNOME eenvoudiger: je
  maakt een back-up van je huidige sneltoetsen en zet die terug wanneer nodig.
  Zo bewaar en herstel je eigen sneltoetsen eenvoudig, bijvoorbeeld na een
  nieuwe installatie."
url: "shell-script/script-info/gnome-keybindings-backup-restore"
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
  - GNOME
  - keybindings
  - backup
  - restore
  - Linux
  - shell script
keywords:
  - GNOME keybindings
  - keybinding backup
  - keybinding restore
  - Linux customization
  - GNOME configuration
  - dconf
  - shell scripting

weight: 10207

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`gnome_keybindings_backup_restore.sh`, is geschreven door GJS (homelab-alpha) en
beheert de sneltoetsen van GNOME: je maakt een back-up van je huidige
sneltoetsen en zet die terug wanneer nodig.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `gnome_keybindings_backup_restore.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 18 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script maakt een back-up van de sneltoetsen van GNOME en
  zet die terug, een eenvoudige manier om de sneltoetsen van verschillende
  GNOME-onderdelen te bewaren en te herstellen.
- **RAW-script**: [gnome_keybindings_backup_restore.sh]

## Header van het script {#script-header}

Het script begint met een gebruikelijke Bash-header en commentaarregels met
gegevens over het script, de auteur, de versie en het doel. Ook de vereisten en
de gebruiksinstructies staan erin:

- Het script heeft het hulpmiddel `dconf` nodig.
- Je voert het script uit en kiest of je een back-up maakt of de sneltoetsen
  terugzet.

## De back-upmap controleren en maken {#check-and-create-backup-directory}

De functie `check_create_backup_dir` zorgt dat er een back-upmap is:

```bash
check_create_backup_dir() {
  backup_dir="$HOME/Backup/Gnome/Keybindings $(date +'[%b %d, %Y %H:%M:%S]')"
  if [ ! -d "$backup_dir" ]; then
    mkdir -p "$backup_dir"
    echo "Backup directory created: $backup_dir"
  fi
}
```

- **Doel**: maakt een unieke back-upmap met een tijdstempel in de thuismap van
  de gebruiker.
- **Werking**: controleert of de map bestaat; zo niet, dan maakt ze die en toont
  ze een melding.

## Back-up maken {#perform-backup}

De functie `perform_backup` maakt de back-up:

```bash
perform_backup() {
  check_create_backup_dir

  backup_dir="$HOME/Backup/Gnome/Keybindings $(date +'[%b %d, %Y %H:%M:%S]')"

  dconf dump / >"$backup_dir/dconf.conf"
  dconf dump /org/gnome/desktop/wm/keybindings/ >"$backup_dir/desktop_wm_keybindings"
  dconf dump /org/gnome/mutter/keybindings/ >"$backup_dir/mutter_keybindings"
  dconf dump /org/gnome/mutter/wayland/keybindings/ >"$backup_dir/mutter_wayland_keybindings"
  dconf dump /org/gnome/settings-daemon/plugins/media-keys/ >"$backup_dir/settings-daemon_plugins_media_keys"
  dconf dump /org/gnome/shell/keybindings/ >"$backup_dir/shell_keybindings"

  echo "Backup completed successfully. Backup directory: $backup_dir"
}
```

- **Doel**: schrijft de sneltoetsinstellingen van GNOME naar aparte bestanden in
  de back-upmap.
- **Werking**:
  - Roept `check_create_backup_dir` aan, zodat de back-upmap bestaat.
  - Exporteert met `dconf dump` de sneltoetsinstellingen van verschillende
    GNOME-onderdelen naar aparte bestanden.
  - Toont een melding met de locatie van de back-upmap.

## Terugzetten {#perform-restore}

De functie `perform_restore` zet een back-up terug:

```bash
perform_restore() {
  backup_recovery_dir="$HOME/Backup/Gnome"

  backups=("$backup_recovery_dir"/*)
  if [ ${#backups[@]} -eq 0 ]; then
    echo "No backups found."
    exit 1
  fi

  echo "Available backups:"
  for ((i = 0; i < ${#backups[@]}; i++)); do
    echo "$((i + 1)). $(basename "${backups[$i]}")"
  done
  read -r -p "Enter the number of the backup you want to restore: " choice

  re='^[0-9]+$'
  if ! [[ $choice =~ $re ]]; then
    echo "Invalid input: Please enter a number."
    exit 1
  fi

  index=$((choice - 1))
  if [ $index -lt 0 ] || [ $index -ge ${#backups[@]} ]; then
    echo "Invalid backup number."
    exit 1
  fi

  selected_backup="${backups[$index]}"

  dconf reset -f /org/gnome/desktop/wm/keybindings/
  dconf reset -f /org/gnome/mutter/keybindings/
  dconf reset -f /org/gnome/mutter/wayland/keybindings/
  dconf reset -f /org/gnome/settings-daemon/plugins/media-keys/
  dconf reset -f /org/gnome/shell/keybindings/

  sleep 0.5

  dconf load /org/gnome/desktop/wm/keybindings/ <"$selected_backup/desktop_wm_keybindings"
  dconf load /org/gnome/mutter/keybindings/ <"$selected_backup/mutter_keybindings"
  dconf load /org/gnome/mutter/wayland/keybindings/ <"$selected_backup/mutter_wayland_keybindings"
  dconf load /org/gnome/settings-daemon/plugins/media-keys/ <"$selected_backup/settings-daemon_plugins_media_keys"
  dconf load /org/gnome/shell/keybindings/ <"$selected_backup/shell_keybindings"

  echo "Backup restored successfully from: $selected_backup"
}
```

- **Doel**: zet de sneltoetsinstellingen van GNOME terug uit een gekozen
  back-up.
- **Werking**:
  - Zoekt de beschikbare back-ups en toont ze.
  - Controleert de keuze van de gebruiker en of die bij een beschikbare back-up
    hoort.
  - Zet de huidige sneltoetsen terug naar de standaardwaarden.
  - Wacht even, zodat het terugzetten is verwerkt.
  - Laadt de sneltoetsinstellingen uit de bestanden van de gekozen back-up.
  - Toont een melding met de bron van de teruggezette back-up.

## Hoofdmenu {#main-menu}

Het script toont een eenvoudig menu:

```bash
echo "Welcome to the GNOME Keybindings Backup and Restore Script."
echo "Please choose an option:"
echo "1. Perform Backup"
echo "2. Perform Restore"
read -r -p "Enter your choice (1 or 2): " choice

case $choice in
1) perform_backup ;;
2) perform_restore ;;
*) echo "Invalid choice. Please enter either 1 or 2." ;;
esac
```

- **Doel**: hier kies je tussen een back-up maken en terugzetten.
- **Werking**:
  - Toont een welkomstmelding en de opties.
  - Leest de keuze van de gebruiker.
  - Roept de juiste functie aan (`perform_backup` of `perform_restore`).
  - Toont een foutmelding bij ongeldige invoer.

## Einde van het script {#end-of-script}

Hier eindigt het script, nadat het de sneltoetsen van GNOME heeft geback-upt of
teruggezet, afhankelijk van je keuze.

## Conclusie {#conclusion}

Als je elk deel van het script begrijpt, zie je hoe het de sneltoetsinstellingen
van GNOME beheert: een eenvoudige manier om er een back-up van te maken en ze
terug te zetten wanneer nodig.

[gnome_keybindings_backup_restore.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/gnome_keybindings_backup_restore.sh
