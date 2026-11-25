---
title: "De belangrijkste Linux-commando's"
description:
  "Benut de kracht van Linux met deze uitgebreide handleiding over de
  belangrijkste commando's. Navigeer door mappen, beheer bestanden en regel
  systeembeheer moeiteloos. Geschikt voor beginners en ervaren gebruikers."
url: "linux/linux-commands"
aliases: ""
icon: "terminal"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Linux
series:
  - Linux
tags:
  - Linux Commands
  - System Administration
  - CLI
  - Terminal
  - Shell
keywords:
  - Linux
  - CLI commands
  - Linux tutorial
  - File management
  - System administration

weight: 8902

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Let op: de Linux-shell is hoofdlettergevoelig. {{% /alert %}}

## Inleiding

Zorg voordat je aan de lijst met commando's begint dat je weet hoe je de
opdrachtregel (CLI) opent. Heb je daar hulp bij nodig, volg dan eerst een
tutorial over de opdrachtregel.

Hoe je de opdrachtregel opent, verschilt per Linux-distributie, maar meestal
vind je hem bij Hulpmiddelen. Op Ubuntu open je hem bijvoorbeeld met
`Ctrl+Alt+T`.

## Overzicht van de basiscommando's

### pwd (huidige map tonen)

Met `pwd` toon je het absolute pad van de map waarin je werkt. Handig om te
controleren waar je bent in het bestandssysteem:

```bash
pwd
```

Voorbeeld van de uitvoer:

```bash
/home/username
```

### cd (van map wisselen)

Navigeer door mappen met `cd`. Geef het volledige pad of de naam van de map op:

```bash
cd Photos
cd /home/username/Movies
```

Snelkoppelingen:

- `cd ..` gaat één map omhoog.
- `cd` (zonder argumenten) gaat naar je thuismap.
- `cd -` gaat naar de vorige map.

### ls (lijst)

Bekijk de inhoud van een map met `ls`:

```bash
ls
ls /home/username/Documents
```

Varianten:

- `ls -R` toont ook de bestanden in submappen.
- `ls -a` toont verborgen bestanden (bestanden die met een punt (`.`) beginnen).
- `ls -al` geeft een gedetailleerde lijst, met rechten, aantal koppelingen,
  eigenaar, groep, grootte en wijzigingstijd.

Bijvoorbeeld:

```bash
ls -al /home/username
```

### cat (samenvoegen)

Toon de inhoud van een bestand met `cat`:

```bash
cat file.txt
```

Ander gebruik:

- `cat > filename` (een nieuw bestand maken en erin schrijven):

  ```bash
  cat > newfile.txt
  ```

  Typ daarna je tekst en druk op `Ctrl+D` om op te slaan.

- `cat filename1 filename2 > filename3` (bestanden samenvoegen):

  ```bash
  cat file1.txt file2.txt > combined.txt
  ```

### cp (kopiëren)

Kopieer bestanden met cp:

```bash
cp scenery.jpg /home/username/Pictures
```

Gebruik voor mappen `-r` (recursief):

```bash
cp -r /source_directory /destination_directory
```

### mv (verplaatsen/hernoemen)

Verplaats of hernoem bestanden met `mv`:

```bash
mv file.txt /home/username/Documents
mv oldname.ext newname.ext
```

### mkdir (map maken)

Maak mappen met `mkdir`:

```bash
mkdir Music
```

Extra opties:

- `mkdir Music/Newfile` (een map in een andere map maken):

  ```bash
  mkdir Music/Newfile
  ```

  `mkdir -p Music/2020/Newfile` (een geneste mapstructuur maken):

  ```bash
  mkdir -p Music/2020/Newfile
  ```

### rmdir (map verwijderen)

Verwijder lege mappen met `rmdir`:

```bash
rmdir emptydir
```

### rm (verwijderen)

Verwijder mappen met hun inhoud met `rm`.

{{% alert context="warning" %}}
Wees voorzichtig: dit kun je niet ongedaan maken. {{% /alert %}}

```bash
rm filename.ext
rm -r directoryname  # to delete a directory and its contents
```

### touch (bestand maken)

Maak lege bestanden met `touch`:

```bash
touch /home/username/Documents/Web.html
```

### locate

Vind bestanden snel op naam:

```bash
locate filename
```

Gebruik `-i` om hoofdletters te negeren en sterretjes `*` voor gedeeltelijke
overeenkomsten:

```bash
locate -i *partoffilename*
```

### find

Zoek bestanden in opgegeven mappen:

```bash
find /home/username -name "filename.ext"
```

Vind alle .txt-bestanden:

```bash
find /home/username -type f -name "*.txt"
```

### grep

Zoek tekst in bestanden met `grep`:

```bash
grep "search_term" file.txt
```

Zoek recursief in alle bestanden in een map:

```bash
grep -r "search_term" /home/username/Documents
```

### sudo

Voer commando's uit met beheerdersrechten:

```bash
sudo apt update
```

### df (vrije schijfruimte)

Bekijk het gebruik van de schijfruimte met `df`:

```bash
df -h  # human-readable format
```

### du (schijfgebruik)

Bekijk hoeveel ruimte een bestand of map gebruikt met `du`:

```bash
du -sh /home/username/Documents
```

### head

Toon de eerste regels van een tekstbestand:

```bash
head -n 5 filename.ext  # show first 5 lines
```

### tail

Toon de laatste regels van een tekstbestand:

```bash
tail -n 5 filename.ext  # show last 5 lines
```

### diff

Vergelijk de inhoud van bestanden regel voor regel:

```bash
diff file1.txt file2.txt
```

### tar

Pak bestanden in een tar-archief met `tar`:

Een tar-archief maken:

```bash
tar -cvf archive.tar /path/to/directory
```

Een tar-archief uitpakken:

```bash
tar -xvf archive.tar
```

### chmod (rechten wijzigen)

Wijzig de rechten van een bestand of map met `chmod`:

```bash
chmod 755 filename.ext  # owner can read/write/execute, others can read/execute
```

### chown (eigenaar wijzigen)

Wijzig de eigenaar van een bestand of map met `chown`:

```bash
sudo chown username:groupname filename.ext
```

### jobs

Toon de huidige taken en hun status:

```bash
jobs
```

### kill

Stop programma's die niet reageren met `kill`:

```bash
kill PID  # replace PID with the process ID
```

Veelgebruikte signalen:

- `SIGTERM (15)`: vraag het programma te stoppen.
- `SIGKILL (9)`: stop het programma direct.

```bash
kill -9 PID
```

### ping

Controleer de verbinding met een server:

```bash
ping example.com
```

### wget

Download bestanden van internet:

```bash
wget http://example.com/file.zip
```

### uname

Toon systeeminformatie:

```bash
uname -a  # all information
```

### top

Bekijk lopende processen en het processorgebruik:

```bash
top
```

### history

Bekijk eerder ingevoerde commando's:

```bash
history
```

### man (handleiding)

Open de handleiding van een commando:

```bash
man ls
```

### echo

Schrijf gegevens naar een bestand met `echo`:

```bash
echo "Hello World" > hello.txt
```

### zip, unzip

Comprimeer bestanden met `zip`:

```bash
zip archive.zip file1 file2
```

Pak zipbestanden uit met `unzip`:

```bash
unzip archive.zip
```

### hostname

Toon of wijzig de hostnaam van het systeem:

```bash
hostname
hostnamectl  # show or set the hostname on systemd-based distributions
```

### useradd, userdel

Beheer gebruikersaccounts:

Een nieuwe gebruiker maken:

```bash
sudo useradd newusername
```

Een gebruiker verwijderen:

```bash
sudo userdel username
```

## Meer commando's

### ps (processtatus)

Toont een lijst van actieve processen:

```bash
ps aux
```

### whoami

Toont de naam van de gebruiker die is aangemeld:

```bash
whoami
```

### uname -r

Toont de kernelversie van het systeem:

```bash
uname -r
```

### df -i (vrije inodes)

Toont het aantal beschikbare inodes:

```bash
df -i
```

### free (geheugengebruik)

Toont informatie over het geheugengebruik:

```bash
free -h
```

### scp (veilig kopiëren)

Kopieert bestanden tussen hosts via SSH:

```bash
scp file.txt username@remote_host:/path/to/destination
```

### rsync

Synchroniseert bestanden en mappen tussen twee plekken:

```bash
rsync -avh /source/directory /destination/directory
```

### cron (Crontab)

Beheert geplande taken. Zo werken geplande taken:

```bash
crontab -e
```

### iptables

Beheert netwerkverkeer en firewallregels. Dit is een gevorderd onderwerp, maar
handig voor systeembeheer:

```bash
sudo iptables -L
```

{{% alert context="primary" %}}
De meeste huidige distributies gebruiken **nftables** als firewall, en
`iptables` is vaak alleen een compatibele laag daaromheen. De actieve regels
toon je met nftables via `sudo nft list ruleset`. Voor dagelijks gebruik is een
schil makkelijker: `ufw` op Ubuntu en Debian, of `firewalld` (`firewall-cmd`) op
Fedora en systemen op basis van RHEL.
{{% /alert %}}

```bash
sudo ufw status               # Ubuntu / Debian
sudo firewall-cmd --list-all  # Fedora / RHEL
```

### systemctl

Beheert systemd-services. Onmisbaar op moderne Linux-distributies:

```bash
sudo systemctl status service_name
sudo systemctl start service_name
sudo systemctl stop service_name
sudo systemctl enable service_name
sudo systemctl disable service_name
```

## Meer onderwerpen

### Omgevingsvariabelen

Omgevingsvariabelen instellen en gebruiken:

```bash
export VAR_NAME="value"
echo $VAR_NAME
```

### Aliassen

Zo maak je eigen aliassen voor commando's die je vaak gebruikt:

```bash
alias ll='ls -la'
```

### SSH

Veilige toegang tot een andere computer via het netwerk:

```bash
ssh username@hostname
```

### Pakketbeheer

Voorbeelden van pakketbeheerders, zoals `apt` voor Debian/Ubuntu en `dnf` voor
Fedora en distributies op basis van RHEL (het oudere commando `yum` is nu een
alias voor `dnf`):

```bash
sudo apt install package_name
sudo dnf install package_name
```

### Netwerkcommando's

Gebruik de commando's `ip` en `ss` voor netwerkbeheer. Ze vervangen de
verouderde commando's `ifconfig` en `netstat` uit het pakket `net-tools`, dat op
de meeste distributies niet meer standaard wordt geïnstalleerd:

```bash
ip a         # show IP addresses (replaces ifconfig)
ip route     # show the routing table (replaces route)
ss -tuln     # show listening TCP and UDP ports (replaces netstat -tuln)
```

### Logbestanden

Zo bekijk je systeemlogs. De meeste moderne distributies gebruiken het
systemd-journaal, dat je leest met `journalctl`. Sommige distributies bewaren
ook gewone tekstlogbestanden in `/var/log` (bijvoorbeeld `/var/log/syslog` op
Debian en Ubuntu, dat op Fedora mogelijk niet bestaat):

```bash
dmesg                     # kernel messages
journalctl -f             # follow the system journal
journalctl -u service_name  # logs of a single service
tail -f /var/log/syslog   # plain text log (Debian / Ubuntu)
```

### Shellscripts

Een inleiding in shellscripts voor automatisering en ingewikkeldere taken:

```bash
#!/bin/bash
echo "Hello, World!"
```

## Extra tips en trucs

- Gebruik `clear` om het terminalscherm leeg te maken:

  ```bash
  clear
  ```

- Gebruik TAB om commando's of bestandsnamen automatisch aan te vullen.
- `Ctrl+C` stopt een lopend commando.
- `Ctrl+Z` pauzeert een lopend commando, en `bg` laat het op de achtergrond
  verder lopen.
- `Ctrl+S` bevriest de uitvoer in de terminal; `Ctrl+Q` heft dat op.
- `Ctrl+A` zet de cursor aan het begin van de regel; `Ctrl+E` aan het einde.
- Voer meerdere commando's na elkaar uit met `;` of alleen bij succes met `&&`:

  ```bash
  command1; command2
  command1 && command2  # command2 runs only if command1 is successful
  ```

Met deze voorbeelden heb je een goede basis om de Linux-opdrachtregel te
gebruiken. Experimenteer met deze commando's om je thuis te voelen op de
opdrachtregel.
