---
title: "dotfiles_installer.info"
description:
  "Een script dat dotfiles installeert en verwijdert. Het maakt een back-up van
  bestaande dotfiles, installeert nieuwe en zet bij het verwijderen de back-up
  terug. Het controleert ook of Git is geïnstalleerd."
url: "dotfiles/installer"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Dotfiles
series:
  - Script Information
tags:
  - dotfiles
  - script
  - installation
  - backup
  - uninstallation
  - Git
keywords:
  - dotfiles installer
  - dotfiles script
  - backup dotfiles
  - install dotfiles
  - uninstall dotfiles
  - manage dotfiles
  - Git dotfiles
  - Homelab-Alpha

weight: 5003

toc: true
katex: true
---

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we stap voor stap bekijken wat dit script doet. Het script heet
`dotfiles_installer.sh`, is geschreven door GJS (homelab-alpha) en installeert
en verwijdert dotfiles. Het maakt een back-up van de bestaande dotfiles voordat
het nieuwe installeert, en kan die back-up bij het verwijderen terugzetten. Het
controleert ook of Git is geïnstalleerd, omdat dat nodig is om repository's met
dotfiles te beheren.

Hier volgt een uitgebreide uitleg:

## Scriptgegevens

- **Bestandsnaam**: `dotfiles_installer.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 28 oktober 2024
- **Versie**: 1.1.0
- **Beschrijving**: het script installeert en verwijdert dotfiles, en maakt
  daarbij back-ups en zet die zo nodig terug.
- **RAW-script**: [dotfiles_installer.sh]

## Uitgebreide uitleg

### Controleren of Git is geïnstalleerd

```bash
check_git() {
    if ! command -v git &>/dev/null; then
        echo "Git is not installed. Please install Git before running this script."
        exit 1
    fi
}
```

Deze functie controleert of Git op het systeem staat. Zo niet, dan vraagt het
script de gebruiker Git te installeren en stopt het.

### Een back-up maken van de bestaande dotfiles

```bash
create_backup() {
    local backup_dir="$HOME/dotfiles-backup/before-installation"
    mkdir -p "$backup_dir"

    for file in ~/.bash_* ~/.bash-* ~/.bashrc ~/.gitconfig ~/.nano ~/.nanorc ~/.profile ~/.selected_editor ~/.tmux.conf ~/.vimrc ~/.zshrc; do
        if [ -e "$file" ]; then
            cp -r "$file" "$backup_dir" || {
                echo "Error: Unable to create backup for $file" >&2
                exit 1
            }
            echo "Backup created for $file"
        else
            echo "Skipping $file as it does not exist"
        fi
    done
    echo "Backup completed at: $backup_dir"
}
```

Deze functie maakt een back-up van de bestaande dotfiles. Ze maakt een map voor
de back-ups en kopieert elke dotfile die bestaat. Lukt het kopiëren van een
bestand niet, dan toont ze een fout en stopt het script.

### Dotfiles installeren

```bash
install_dotfiles() {
    if [ -d "$HOME/dotfiles/dotfiles" ]; then
        find "$HOME/dotfiles/dotfiles" -name '.bash_*' -exec cp {} "$HOME" \; &&
            cp "$HOME/dotfiles/dotfiles/.bashrc" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.gitconfig" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.nanorc" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.selected_editor" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.tmux.conf" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.vimrc" "$HOME" &&
            cp "$HOME/dotfiles/dotfiles/.zshrc" "$HOME" &&
            cp -r "$HOME/dotfiles/.bash-script" "$HOME" &&
            cp -r "$HOME/dotfiles/.nano" "$HOME" &&
            if [ ! -d "$HOME/.versioning" ]; then
                mkdir "$HOME/.versioning"
            fi
        rm -rf "$HOME/dotfiles/.git" "$HOME/dotfiles/.github" "$HOME/dotfiles/.gitignore"
        echo "dotfiles successfully installed"
    else
        echo "Error: dotfiles directory not found" >&2
        exit 1
    fi
}
```

Deze functie installeert de nieuwe dotfiles. Ze kopieert de dotfiles uit de map
`dotfiles` in de thuismap van de gebruiker naar de juiste plekken. Daarna
verwijdert ze de mappen en bestanden van Git.

### Back-up maken voor het verwijderen

```bash
backup_files() {
    local backup_dir="$HOME/dotfiles-backup/before-uninstallation"
    mkdir -p "$backup_dir"

    for file in ~/.bash_* ~/.bash-* ~/.bashrc ~/.gitconfig ~/.nano ~/.nanorc ~/.profile ~/.selected_editor ~/.tmux.conf ~/.vimrc ~/.zshrc; do
        if [ -e "$file" ]; then
            cp -r "$file" "$backup_dir" || {
                echo "Error: Unable to create backup for $file" >&2
                exit 1
            }
            echo "Backup created for $file"
        else
            echo "Skipping $file as it does not exist"
        fi
    done
    echo "Backup completed at: $backup_dir"
}
```

Deze functie maakt een back-up van de huidige dotfiles voordat ze worden
verwijderd. Ze lijkt op de functie `create_backup`, maar wordt gebruikt bij het
verwijderen.

### Dotfiles verwijderen

```bash
remove_dotfiles() {
    rm -rf ~/.bash_* ~/.bash-* ~/.bashrc ~/.gitconfig ~/.nano ~/.nanorc ~/.profile ~/.selected_editor ~/.tmux.conf ~/.vimrc ~/.zshrc ||
        {
            echo "Error: Unable to remove dotfiles" >&2
            return 1
        }
    echo "dotfiles successfully removed"
}
```

Deze functie verwijdert de dotfiles uit de thuismap. Gaat er iets mis bij het
verwijderen, dan toont ze een foutmelding.

### De back-up terugzetten

```bash
restore_backup() {
    local backup_dir="$HOME/dotfiles-backup/before-installation"
    cp -a "$backup_dir"/. "$HOME" || {
        echo "Error: Unable to restore backup" >&2
        exit 1
    }
    echo "Backup successfully restored"
}
```

Deze functie zet de back-up terug van de oorspronkelijke dotfiles die vóór de
installatie is gemaakt. Gaat er iets mis, dan toont ze een foutmelding en stopt
het script.

### Hoofdfunctie voor de installatie

```bash
install() {
    create_backup &&
        install_dotfiles &&
        echo "$(date '+%Y-%m-%d %H:%M:%S') - dotfiles installation completed" >>"$HOME/dotfiles.log" &&
        echo "Installation completed. Check dotfiles_installation.log for details."
}
```

Deze functie regelt de installatie door de functies `create_backup` en
`install_dotfiles` aan te roepen. Ze legt vast wanneer de installatie klaar is.

### Hoofdfunctie voor het verwijderen

```bash
uninstall() {
    if backup_files &&
        remove_dotfiles &&
        sleep 0.5 &&
        restore_backup; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - dotfiles uninstallation completed" >>"$HOME/dotfiles.log"
        echo "Uninstallation completed. Check dotfiles_installation.log for details."
    else
        echo "$(date '+%Y-%m-%d %H:%M:%S') - dotfiles uninstallation encountered errors" >>"$HOME/dotfiles.log"
        echo "Uninstallation encountered errors. Check dotfiles_installation.log for details."
    fi
    sleep 0.5
    rm -rf ~/dotfiles
}
```

Deze functie regelt het verwijderen door de functies `backup_files`,
`remove_dotfiles` en `restore_backup` aan te roepen. Ze legt vast wanneer het
verwijderen klaar is en verwijdert de map `dotfiles` uit de thuismap.

### Menu om een actie te kiezen

```bash
echo "Welcome to the dotfiles installation/uninstallation tool"
echo "1. Install dotfiles"
echo "2. Uninstall dotfiles"
read -r -p "Enter your choice: " choice
if [ "$choice" == "1" ]; then
    check_git
    install
elif [ "$choice" == "2" ]; then
    uninstall
else
    echo "Invalid choice. Exiting."
fi
```

Het script toont een menu waarin de gebruiker kiest tussen installeren en
verwijderen. Afhankelijk van de keuze roept het de functies `check_git` en
`install` aan om te installeren, of de functie `uninstall` om te verwijderen.
Bij een ongeldige keuze stopt het script.

## Conclusie

Het script `dotfiles_installer.sh` is een compleet hulpmiddel om dotfiles te
beheren. Het controleert of Git is geïnstalleerd, maakt back-ups van bestaande
dotfiles, installeert nieuwe dotfiles en kan bij het verwijderen de
oorspronkelijke bestanden terugzetten. Het script is gebruiksvriendelijk: je
kiest een actie in een menu en het proces wordt in een logbestand vastgelegd.

[dotfiles_installer.sh]:
  https://raw.githubusercontent.com/homelab-alpha/dotfiles/main/dotfiles_installer.sh
