---
title: "Logs en logrotate"
description:
  "Leer waar Ubuntu en Fedora hun logs bewaren, hoe je ze leest met journalctl,
  en hoe je logbestanden in de hand houdt met limieten voor journald en met
  logrotate."
url: "linux/logs-and-logrotate"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Linux
series:
  - Linux
tags:
  - Logging
  - Logrotate
  - journald
  - rsyslog
  - Ubuntu
  - Fedora
  - System Administration
keywords:
  - Linux logs
  - logrotate
  - journalctl
  - journald
  - var log
  - Ubuntu logs
  - Fedora logs

weight: 8901

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Inleiding {#introduction}

Logs vertellen wat een systeem deed en waarom iets misging. Zonder onderhoud
vullen ze ook een schijf. Deze handleiding behandelt beide kanten voor Ubuntu en
Fedora:

- Waar de logs staan.
- Hoe je ze leest.
- Hoe je hun omvang beperkt met journald en logrotate.

De voorbeelden zijn getest op Ubuntu 24.04 LTS en Fedora 43. De meeste
commando's hebben `sudo` nodig.

## Hoe logging werkt {#how-logging-works}

Moderne versies van Ubuntu en Fedora gebruiken allebei twee lagen:

- **systemd-journald**: verzamelt berichten van de kernel, services en
  programma's, en bewaart ze in een binair journaal. Je leest het met
  `journalctl`.
- **Tekstlogbestanden**: gewone bestanden in `/var/log/`. Ze worden geschreven
  door een syslog-daemon (rsyslog) of direct door een toepassing, zoals een
  webserver.

journald beheert de omvang van zijn eigen journaal. Tekstlogbestanden groeien
tot iets ze roteert; dat is de taak van logrotate.

## Ubuntu en Fedora vergeleken {#ubuntu-versus-fedora}

| Onderwerp                   | Ubuntu                                 | Fedora                                         |
| --------------------------- | -------------------------------------- | ---------------------------------------------- |
| Syslog-daemon               | rsyslog, standaard geïnstalleerd       | standaard geen; alleen journald                |
| Algemene systeemlog         | `/var/log/syslog`                      | `journalctl` (`/var/log/messages` met rsyslog) |
| Authenticatielog            | `/var/log/auth.log`                    | `journalctl` (`/var/log/secure` met rsyslog)   |
| Kernellog                   | `/var/log/kern.log`                    | `journalctl -k`                                |
| Log van pakketbeheer        | `/var/log/apt/` en `/var/log/dpkg.log` | `/var/log/dnf5.log` (DNF5)                     |
| Blijvend journaal           | ja, in `/var/log/journal/`             | ja, in `/var/log/journal/`                     |
| Planner van logrotate       | `logrotate.timer`                      | `logrotate.timer`                              |
| Statusbestand van logrotate | `/var/lib/logrotate/status`            | `/var/lib/logrotate/logrotate.status`          |
| Groep om logs te lezen      | `adm`                                  | `wheel` of `systemd-journal`                   |
| Extra toegangscontrole      | AppArmor                               | SELinux                                        |

{{% alert context="info" %}}
Op Fedora bestaan de meeste klassieke bestanden, zoals `/var/log/messages` en
`/var/log/secure`, niet tenzij je rsyslog installeert. Gebruik daar
`journalctl`.
{{% /alert %}}

## Belangrijke plekken voor logs {#important-log-locations}

### Ubuntu

| Bestand                         | Inhoud                                       |
| ------------------------------- | -------------------------------------------- |
| `/var/log/syslog`               | Algemene berichten van systeem en services   |
| `/var/log/auth.log`             | Aanmeldingen, `sudo` en SSH                  |
| `/var/log/kern.log`             | Kernelberichten                              |
| `/var/log/dpkg.log`             | Installaties en verwijderingen van pakketten |
| `/var/log/apt/history.log`      | APT-commando's en hun resultaat              |
| `/var/log/unattended-upgrades/` | Automatische beveiligingsupdates             |
| `/var/log/journal/`             | Blijvend systemd-journaal (binair)           |

### Fedora

| Bestand                    | Inhoud                                         |
| -------------------------- | ---------------------------------------------- |
| `/var/log/journal/`        | Blijvend systemd-journaal (binair)             |
| `/var/log/dnf5.log`        | Pakkettransacties van DNF5                     |
| `/var/log/audit/audit.log` | Weigeringen van SELinux en auditgebeurtenissen |
| `/var/log/firewalld`       | Berichten van firewalld, als dat aanstaat      |
| `/var/log/messages`        | Algemene berichten, alleen met rsyslog         |
| `/var/log/secure`          | Authenticatie, alleen met rsyslog              |

## Logs lezen {#reading-logs}

### Tekstbestanden {#text-files}

```bash
# Show the last 50 lines
sudo tail -n 50 /var/log/syslog

# Follow a file live
sudo tail -f /var/log/auth.log

# Search a file, including rotated and compressed copies
sudo grep "Failed password" /var/log/auth.log
sudo zgrep "Failed password" /var/log/auth.log.*.gz

# Page through a file
sudo less /var/log/syslog
```

### Het journaal met journalctl {#the-journal-with-journalctl}

`journalctl` werkt hetzelfde op Ubuntu en Fedora.

```bash
# Follow all new messages
journalctl -f

# Messages from the current boot
journalctl -b

# Messages from the previous boot
journalctl -b -1

# List all stored boots
journalctl --list-boots

# Messages from one service
journalctl -u ssh.service      # Ubuntu
journalctl -u sshd.service     # Fedora

# Only errors and worse
journalctl -p err -b

# A time range
journalctl --since "2026-11-24 08:00" --until "2026-11-24 12:00"
journalctl --since "1 hour ago"

# Kernel messages
journalctl -k

# Newest entries first, without the pager
journalctl -r --no-pager -n 100
```

Om het hele journaal zonder `sudo` te lezen, voeg je je gebruiker toe aan een
loggroep en meld je je opnieuw aan:

```bash
# Ubuntu
sudo usermod -aG adm "$USER"

# Fedora
sudo usermod -aG systemd-journal "$USER"
```

## De omvang van het journaal beheren {#managing-the-journal-size}

Standaard gebruikt journald maximaal 10% van het bestandssysteem waar
`/var/log/journal/` op staat, met een harde grens van 4 GiB. Bekijk de huidige
omvang:

```bash
journalctl --disk-usage
```

### Eenmalig opruimen {#clean-up-once}

```bash
# Keep at most 500 MB
sudo journalctl --vacuum-size=500M

# Remove entries older than 30 days
sudo journalctl --vacuum-time=30d
```

### Een vaste limiet instellen {#set-a-permanent-limit}

Gebruik een drop-inbestand in plaats van `/etc/systemd/journald.conf` aan te
passen. Een drop-in blijft behouden bij pakketupdates.

```bash
sudo mkdir -p /etc/systemd/journald.conf.d
sudo nano /etc/systemd/journald.conf.d/size_limit.conf
```

```ini
[Journal]
SystemMaxUse=500M
SystemKeepFree=1G
MaxRetentionSec=1month
```

Pas de wijziging toe:

```bash
sudo systemctl restart systemd-journald
journalctl --disk-usage
```

## Logrotate

logrotate geeft een logbestand een nieuwe naam, begint een nieuw leeg bestand,
en verwijdert of comprimeert oude kopieën. Het draait op beide distributies één
keer per dag via een systemd-timer.

### Installatie en status {#installation-and-status}

logrotate is standaard geïnstalleerd op Ubuntu en Fedora. Controleer het
programma en de timer:

```bash
# Ubuntu
dpkg -l logrotate

# Fedora
rpm -q logrotate

# Both
systemctl status logrotate.timer
systemctl list-timers logrotate.timer
```

Installeer het als het ontbreekt:

```bash
# Ubuntu
sudo apt install logrotate

# Fedora
sudo dnf install logrotate
sudo systemctl enable --now logrotate.timer
```

### Configuratiebestanden {#configuration-files}

| Pad                   | Doel                                             |
| --------------------- | ------------------------------------------------ |
| `/etc/logrotate.conf` | Algemene standaarden                             |
| `/etc/logrotate.d/`   | Eén bestand per toepassing of pakket             |
| Statusbestand         | Laatste rotatie per log (zie de tabel hierboven) |

Het algemene bestand stelt de standaarden in en laadt daarna
`/etc/logrotate.d/`. Een instelling in een bestand in `/etc/logrotate.d/` gaat
voor de algemene standaard van dat log.

Standaard algemene instellingen op Ubuntu:

```text
weekly
su root adm
rotate 4
create
#dateext
#compress
include /etc/logrotate.d
```

Standaard algemene instellingen op Fedora:

```text
weekly
rotate 4
create
dateext
#compress
include /etc/logrotate.d
```

Het belangrijkste verschil: Fedora zet een datum in de naam van geroteerde
bestanden (`messages-20261124`), en Ubuntu een nummer (`syslog.1`,
`syslog.2.gz`).

### Veelgebruikte instructies {#common-directives}

| Instructie                   | Betekenis                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `daily`, `weekly`, `monthly` | Hoe vaak er wordt geroteerd                                                       |
| `rotate 7`                   | Bewaar 7 oude kopieën; oudere worden verwijderd                                   |
| `maxsize 100M`               | Roteer ook eerder als het bestand groter is dan 100 MB                            |
| `size 100M`                  | Roteer alleen op omvang, negeer het tijdsinterval                                 |
| `maxage 30`                  | Verwijder geroteerde kopieën ouder dan 30 dagen                                   |
| `missingok`                  | Geen fout als het logbestand niet bestaat                                         |
| `notifempty`                 | Roteer geen leeg bestand                                                          |
| `compress`                   | Comprimeer oude kopieën met gzip                                                  |
| `delaycompress`              | Comprimeer één rotatie later; de nieuwste kopie blijft ongecomprimeerd            |
| `create 0640 user group`     | Maak het nieuwe bestand met deze rechten, eigenaar en groep                       |
| `copytruncate`               | Kopieer het bestand en maak het daarna leeg; voor programma's die het open houden |
| `dateext`                    | Zet een datum in de naam van het geroteerde bestand in plaats van een nummer      |
| `su user group`              | Roteer als deze gebruiker; nodig als de map niet van root is                      |
| `sharedscripts`              | Voer de scripts één keer uit voor alle passende bestanden                         |
| `postrotate` ... `endscript` | Commando's die na de rotatie worden uitgevoerd                                    |

### Voorbeeld: het log van een toepassing roteren {#example-rotate-an-application-log}

Dit voorbeeld roteert de logs van een toepassing in `/var/log/myapp/`. Het
bewaart 14 dagen en laat de service zijn logbestand opnieuw openen.

```bash
sudo nano /etc/logrotate.d/myapp
```

```text
/var/log/myapp/*.log {
    daily
    rotate 14
    maxsize 100M
    missingok
    notifempty
    compress
    delaycompress
    create 0640 myapp myapp
    sharedscripts
    postrotate
        systemctl reload myapp.service > /dev/null 2>&1 || true
    endscript
}
```

Kan de toepassing haar logbestand niet opnieuw openen na een signaal of
herlaadactie, vervang dan `create` en het blok `postrotate` door `copytruncate`.
Een paar regels die tijdens het kopiëren worden geschreven, kunnen verloren
gaan.

### Voorbeeld: logs in een thuismap roteren {#example-rotate-logs-in-a-home-directory}

Kan een andere gebruiker dan root in de logmap schrijven, dan weigert logrotate
die te roteren, tenzij je `su` instelt:

```text
/home/username/scripts/logs/*.log {
    su username username
    weekly
    rotate 8
    missingok
    notifempty
    compress
}
```

### Een configuratie testen {#test-a-configuration}

Test een nieuw bestand altijd voordat je erop vertrouwt.

```bash
# Dry run: show what would happen, change nothing
sudo logrotate -d /etc/logrotate.d/myapp

# Force a rotation now, with verbose output
sudo logrotate -vf /etc/logrotate.d/myapp

# Run the full configuration, as the timer does
sudo logrotate -v /etc/logrotate.conf

# Check the last run of the timer
journalctl -u logrotate.service -n 50
```

De bestandsnamen in het statusbestand laten zien wanneer elk log voor het laatst
is geroteerd:

```bash
sudo cat /var/lib/logrotate/status             # Ubuntu
sudo cat /var/lib/logrotate/logrotate.status   # Fedora
```

## Fedora: SELinux en eigen logpaden {#fedora-selinux-and-custom-log-paths}

Op Fedora laat SELinux logrotate alleen werken met bestanden met een loglabel,
zoals `var_log_t`. Bestanden in `/var/log/` krijgen dat label vanzelf. Logs in
een andere map, bijvoorbeeld `/srv/myapp/logs/`, hebben eerst het label nodig:

```bash
sudo semanage fcontext -a -t var_log_t "/srv/myapp/logs(/.*)?"
sudo restorecon -Rv /srv/myapp/logs
```

Controleer op weigeringen als een rotatie zonder duidelijke reden mislukt:

```bash
sudo ausearch -m AVC -ts recent -c logrotate
```

## Ubuntu: bestanden van rsyslog {#ubuntu-rsyslog-files}

Op Ubuntu schrijft rsyslog `/var/log/syslog`, `auth.log` en `kern.log`. De
rotatieregels staan in `/etc/logrotate.d/rsyslog`. Wil je deze logs langer
bewaren, pas dan `rotate` aan in dat bestand. Bij pakketupdates kan worden
gevraagd of je je aangepaste versie wilt houden.

## Optioneel: rsyslog op Fedora {#optional-rsyslog-on-fedora}

Wil je op Fedora liever klassieke tekstbestanden, installeer dan rsyslog. Het
heeft een eigen logrotate-bestand in `/etc/logrotate.d/rsyslog`.

```bash
sudo dnf install rsyslog
sudo systemctl enable --now rsyslog
```

## Problemen oplossen {#troubleshooting}

| Probleem                                                                | Oplossing                                                                        |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `error: skipping ... because parent directory has insecure permissions` | Voeg `su user group` toe aan het blok                                            |
| Log wordt niet geroteerd                                                | Voer `logrotate -d` uit; controleer `notifempty`, de omvang en het statusbestand |
| Service blijft naar het oude bestand schrijven                          | Voeg een herlaadactie toe in `postrotate`, of gebruik `copytruncate`             |
| Schijf nog vol na de rotatie                                            | Een proces houdt een verwijderd bestand open; controleer met `sudo lsof +L1`     |
| Rotatie mislukt alleen op Fedora                                        | Controleer het SELinux-label en `ausearch -m AVC`                                |
| Journaal gebruikt te veel ruimte                                        | Stel `SystemMaxUse` in met een drop-in voor journald                             |

## Aanbevolen werkwijzen {#best-practices}

1. **Beperk het journaal**: stel `SystemMaxUse` in, zodat het journaal de schijf
   niet kan vullen.
2. **Gebruik drop-inbestanden**: zet je eigen logrotate-regels in
   `/etc/logrotate.d/` en de instellingen van journald in
   `/etc/systemd/journald.conf.d/`.
3. **Combineer tijd en omvang**: gebruik `maxsize` naast `daily` of `weekly`
   voor logs die snel kunnen groeien.
4. **Comprimeer oude logs**: gebruik `compress` met `delaycompress` om ruimte te
   besparen.
5. **Test eerst**: voer na elke wijziging `logrotate -d` uit.
6. **Bescherm logbestanden**: gebruik `create` met strikte rechten zoals `0640`,
   want logs kunnen gevoelige gegevens bevatten.

## Conclusie {#conclusion}

Ubuntu en Fedora gebruiken allebei journald voor de meeste logging en logrotate
voor tekstlogbestanden. Ubuntu voegt klassieke bestanden van rsyslog toe,
terwijl Fedora bijna alles in het journaal houdt en SELinux-controles toevoegt.
Zie voor meer details `man journalctl`, `man journald.conf` en `man logrotate`.
