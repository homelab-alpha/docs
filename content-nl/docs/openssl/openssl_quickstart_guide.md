---
title: "Snelstart OpenSSL"
description: "Begin snel met OpenSSL met deze snelstarthandleiding"
url: "openssl/quickstart-guide"
aliases: ""
icon: "rocket_launch"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - OpenSSl
series:
  - OpenSSl
tags:
  - openssl
  - quickstart
  - tls
  - certificate-authority
  - security
keywords:
  - openssl tutorial
  - openssl setup guide
  - tls certificate management
  - tls certificates
  - self-signed certificates
  - openssl configuration

weight: 9902

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="warning" %}}
De certificaten zijn bedoeld voor een homelab en om te testen. Gebruik ze niet
in productie. {{% /alert %}}

## Vereisten {#requirements}

Een Linux-systeem met Bash, Git en OpenSSL.

## Snel installeren {#quick-install}

Voer voor een snelle installatie het volgende commando uit:

```bash
git clone https://github.com/homelab-alpha/openssl.git ~/openssl && cd ~/openssl/scripts && ./tls_dotfiles_installer.sh && cd && exec bash
```

Heb je de snelle installatie gebruikt, ga dan door naar [aan de
slag][get started].

## Normale installatie {#normal-install}

Installeer je liever met de hand, volg dan deze stappen:

1. Kloon de OpenSSL-repository naar `~/openssl`. De aliassen verwachten de
   repository op deze plek:

   ```bash
   git clone https://github.com/homelab-alpha/openssl.git ~/openssl
   ```

2. Ga naar de map `scripts`:

   ```bash
   cd ~/openssl/scripts
   ```

3. Voer het installatiescript uit:

   ```bash
   ./tls_dotfiles_installer.sh
   ```

4. Herstart je shellomgeving om de wijzigingen toe te passen:

   ```bash
   cd && exec bash
   ```

## Aan de slag {#get-started}

### 1. De mappen en configuratiebestanden van OpenSSL maken {#1-set-up-openssl-directories-and-config-files}

Voer het volgende commando uit om de benodigde mappen en configuratiebestanden
te maken:

```bash
new-tls-directory-setup
```

### Upgraden vanaf de map `ssl` {#upgrading-from-the-ssl-directory}

Eerdere versies van de scripts gebruikten de map `~/ssl`. De scripts werken nog
met die map zolang `~/tls` niet bestaat, en tonen dan een waarschuwing. De oude
scriptnamen en de oude alias `new-ssl-directorie-setup` werken ook nog, tot de
volgende grote versie.

Om naar `~/tls` over te stappen, werk je de repository bij, open je een nieuwe
shell en voer je de migratie uit. Gebruik eerst `--dry-run` om te zien wat er
gebeurt:

```bash
git -C ~/openssl pull
exec bash
openssl-migrate-tls --dry-run
openssl-migrate-tls
```

De migratie verplaatst `~/ssl` naar `~/tls`, laat de koppeling `~/ssl -> tls`
achter en past het pad in de configuratiebestanden van OpenSSL aan, nadat er een
kopie is bewaard. Voer `new-tls-directory-setup` niet uit zolang `~/ssl`
bestaat; het script stopt dan met een fout om een tweede, lege map te voorkomen.
Zie het
[deel over migratie in de README](https://github.com/homelab-alpha/openssl#migrating-from-ssl-to-tls)
voor details.

### Upgraden vanaf een oudere versie {#upgrading-from-an-older-version}

Na het bijwerken van de repository blijft een bestaande `~/tls` werken met de
oude configuratiebestanden. Om de nieuwe configuratiebestanden te krijgen, voer
je uit:

```bash
git -C ~/openssl pull
new-tls-directory-setup --update-config
```

Van elk vervangen bestand wordt eerst een kopie bewaard met de extensie
`.bak-<date>`. Het script verplaatst ook de database-items van de root- en
tussenliggende certificaatautoriteit naar hun eigen database
(`~/tls/db/trusted_id/` en `~/tls/db/root_ca/`), nadat er een kopie van
`index.txt` in `~/tls/archive/_database/` is gemaakt. Zie het
[deel over upgraden in de README](https://github.com/homelab-alpha/openssl#upgrading-from-an-older-version)
voor alle wijzigingen in gedrag.

### 2. Vertrouwde autoriteit {#2-trusted-authority}

Maak een zelfondertekend certificaat dat dienstdoet als vertrouwde autoriteit:

```bash
new-trusted-id
```

Het script vraagt om een wachtwoordzin en versleutelt de privésleutel daarmee.
Bewaar de wachtwoordzin goed: zonder die zin kan de sleutel geen nieuwe
rootcertificaatautoriteit ondertekenen.

### 3. Rootcertificaatautoriteit {#3-root-certificate-authority}

Maak een rootcertificaatautoriteit, ondertekend door je vertrouwde autoriteit:

```bash
new-root-ca
```

Ook dit script vraagt om een nieuwe wachtwoordzin voor de eigen sleutel, en om
de wachtwoordzin van de vertrouwde autoriteit, omdat die sleutel het certificaat
ondertekent.

### 4. Tussenliggende certificaatautoriteit {#4-intermediate-certificate-authority}

Maak een tussenliggende certificaatautoriteit, ondertekend door de
rootcertificaatautoriteit:

```bash
new-ca
```

Het script vraagt om de wachtwoordzin van de rootcertificaatautoriteit. De
sleutel van de tussenliggende certificaatautoriteit zelf is niet versleuteld,
omdat de certificaatscripts en het vernieuwen die bij elke run gebruiken. Zie
[Wachtwoordzinnen van de sleutels van de
autoriteiten][Passphrases of the Authority Keys] voor de opties.

### 5. Certificaat {#5-certificate}

Maak ten slotte een certificaat voor localhost, ondertekend door de
tussenliggende certificaatautoriteit:

```bash
new-cert-localhost
```

Het script stelt geen vragen: de `Common Name` is `localhost`. Je hebt nu je
eerste certificaat gemaakt. Het script maakt ook een bundel voor HAProxy.

Controleer de vertrouwensketen van de hele keten, met het nieuwe certificaat:

```bash
openssl-verify localhost
```

## Wachtwoordzinnen van de sleutels van de autoriteiten {#passphrases-of-the-authority-keys}

`new-trusted-id` en `new-root-ca` versleutelen de privésleutel met een
wachtwoordzin (AES-256). De scripts vragen erom, of lezen hem uit de
omgevingsvariabelen `TLS_TRUSTED_ID_PASSPHRASE` en `TLS_ROOT_CA_PASSPHRASE`.
Gebruik `--no-passphrase` om een sleutel te maken die niet is versleuteld.

Gebruik `new-ca --passphrase` om ook de sleutel van de tussenliggende
certificaatautoriteit te versleutelen. De scripts vragen dan om de
wachtwoordzin, of lezen hem uit `TLS_CA_PASSPHRASE`. Een vernieuwing die zonder
toezicht draait, heeft die variabele nodig.

## Naambeperkingen (optioneel) {#name-constraints-optional}

Standaard kan een autoriteit voor elke naam een certificaat ondertekenen. De
optie `--name-constraints` beperkt de namen waarvoor een autoriteit, en elke
autoriteit daaronder, mag ondertekenen. Standaard staat ze niet aan:

```bash
new-root-ca --name-constraints "DNS:example.test, DNS:localhost, IP:192.168.0.0/16, IP:127.0.0.0/8"
new-ca      --name-constraints "DNS:example.test, DNS:localhost, IP:192.168.0.0/16, IP:127.0.0.0/8"
```

- `DNS:<domain>` staat het domein en de subdomeinen toe. `IP:<network>/<prefix>`
  staat een IPv4-netwerk toe. Een spatie na een komma mag.
- Een type dat niet in de lijst staat, wordt niet beperkt. Noem zowel de
  DNS-namen als de IP-netwerken.
- Voeg `DNS:localhost` en `IP:127.0.0.0/8` toe als je `new-cert-localhost`
  gebruikt.
- De certificaatscripts weigeren een naam buiten de lijst voordat ze iets maken.
- De lijst hoort bij het certificaat van de autoriteit. Om haar te wijzigen,
  maak je de autoriteit opnieuw.

## Een autoriteit vervangen {#replace-an-authority}

Een bestaande autoriteit wordt nooit per ongeluk gewijzigd. Om er opnieuw een te
maken, bijvoorbeeld voordat de tussenliggende certificaatautoriteit verloopt,
gebruik je `--replace`:

```bash
new-ca --replace
new-ca --replace --yes
```

Het eerste commando toont een waarschuwing en vraagt eerst om bevestiging.
`new-root-ca` en `new-trusted-id` hebben dezelfde opties. Het script kopieert de
oude sleutel en het oude certificaat naar `~/tls/archive/_ca/`, geeft het nieuwe
certificaat uit en markeert het oude database-item als vervangen.

De autoriteiten en certificaten onder een vervangen autoriteit moeten opnieuw
worden gemaakt: voer na een nieuwe rootcertificaatautoriteit `new-ca --replace`
uit, en na een nieuwe tussenliggende certificaatautoriteit
`openssl-renew --all --within 400 --yes`.

## Unieke onderwerpen in OpenSSL {#unique-subject-in-openssl}

{{% alert context="primary" %}}
**Belangrijk:** `new-tls-directory-setup` zet `unique_subject = yes`. OpenSSL
weigert dan een tweede geldig certificaat met dezelfde **Common Name**.
{{% /alert %}}

### Wat moet je doen? {#what-should-you-do}

Houd voor de meeste gebruikers de standaard aan. Om een certificaat te vervangen
dat verloopt, gebruik je `openssl-renew`. Dat archiveert de oude bestanden,
regelt de instelling voor je en zet die daarna terug. Zie [Certificaten
vernieuwen][Renew Certificates].

Wijzig de instelling alleen als je meerdere geldige certificaten met dezelfde
**Common Name** wilt, bijvoorbeeld tijdens het testen. Open de terminal en voer
uit:

```bash
echo "unique_subject = no" > $HOME/tls/db/index.txt.attr
```

Controleer daarna de wijziging:

```bash
cat $HOME/tls/db/index.txt.attr
```

Om terug te gaan naar de standaard, voer je uit:

```bash
echo "unique_subject = yes" > $HOME/tls/db/index.txt.attr
```

### Wat gebeurt er bij elke instelling? {#what-happens-with-each-setting}

Met `unique_subject = yes` (de standaard):

- Een certificaatscript stopt met een fout als er al een geldig certificaat met
  dezelfde **Common Name** in `index.txt` staat. Er wordt niets gemaakt.
- Elke naam heeft hooguit één geldig item, waardoor intrekken en vernieuwen
  eenvoudig blijven.

Met `unique_subject = no`:

- Je kunt meerdere certificaten met dezelfde **Common Name** maken.
- Een naam kan meerdere geldige items hebben. `openssl-revoke` trekt alle
  geldige certificaten met die naam in.

Ga verder met het volgende hoofdstuk: **[Je eigen certificaat
maken][Create Your Own Certificate]**.

## Je eigen certificaat maken {#create-your-own-certificate}

### 1. Certificaat voor een servertoepassing {#1-certificate-for-server-application}

Maak een certificaat voor je servertoepassing, ondertekend door de
tussenliggende certificaatautoriteit:

```bash
new-cert-server
```

Voor RSA:

```bash
new-cert-rsa-server
```

### 2. Certificaat voor een clienttoepassing {#2-certificate-for-client-application}

Maak een certificaat voor je clienttoepassing, ondertekend door de
tussenliggende certificaatautoriteit:

```bash
new-cert-client
```

Voor RSA:

```bash
new-cert-rsa-client
```

Deze commando's vragen om de volledige domeinnaam (FQDN) en, voor servers, een
of meer IPv4-adressen. Om zonder vragen te werken, geef je ze mee als opties:

```bash
new-cert-server --fqdn example.test --ip 192.0.2.10
new-cert-client --fqdn client.example.test
```

Scheid meerdere IPv4-adressen met komma's:

```bash
new-cert-server --fqdn example.test --ip 192.0.2.10,192.0.2.11
```

Een spatie na een komma mag, zodat een lange lijst leesbaar blijft:

```bash
new-cert-server --fqdn example.test --ip 192.0.2.10, 192.0.2.11, 192.0.2.12
```

Voer de FQDN in zonder `www.`. Een servercertificaat (ECDSA of RSA) dekt zowel
de FQDN als `www.<fqdn>`, dus `--fqdn example.test` geeft een certificaat voor
`example.test` en `www.example.test`. Een clientcertificaat bevat alleen de
FQDN; gebruik `--www` om `www.<fqdn>` toe te voegen. De **Common Name** is
altijd de FQDN. De commando's die de naam van een bestaand certificaat
gebruiken, zoals `openssl-verify`, `openssl-renew` en `openssl-revoke`,
gebruiken ook de FQDN die je hier invoert.

Zet bij een wildcardcertificaat de FQDN tussen enkele aanhalingstekens, zodat de
shell de `*` niet uitbreidt:

```bash
new-cert-server --fqdn '*.example.test'
```

Een wildcardcertificaat bevat `*.example.test` en `example.test` zelf. Het bevat
geen `www.<fqdn>`, omdat de wildcard `www.example.test` al dekt. Een wildcard
dekt maar één niveau, dus `a.b.example.test` valt er niet onder.

## Certificaten controleren {#verify-certificates}

Controleer een certificaat tegen de vertrouwensketen. Gebruik voor je eigen
certificaten de bestandsnaam zonder `.pem`:

```bash
openssl-verify root_ca.pem
openssl-verify -v ca.pem
openssl-verify example.test
```

Zie [verify_tls_certificates] voor de opties.

## De vervaldatum controleren {#check-the-expiry}

Toon elk certificaat onder `~/tls/certs`, gesorteerd op het aantal resterende
dagen. Het script wijzigt nooit een bestand:

```bash
openssl-status
openssl-status --quiet
```

Server- en clientcertificaten waarschuwen 30 dagen van tevoren, de autoriteiten
180 dagen. De afsluitcode is `0` als alles langer geldig is dan de drempel,
zodat je het script in cron of een systemd-timer kunt gebruiken. Zie
[tls_certificate_status] voor alle afsluitcodes.

## Certificaten vernieuwen {#renew-certificates}

Vernieuw server- en clientcertificaten voordat ze verlopen. Het script
archiveert de oude bestanden in `~/tls/archive/<fqdn>/<date>/` en verwijdert
nooit iets:

```bash
openssl-renew --dry-run example.test
openssl-renew example.test
openssl-renew --all --within 30 --yes
```

De autoriteiten (vertrouwde identiteit, root en tussenliggend) worden niet
vernieuwd. Zie [renew_tls_certificates] voor de opties, de hooks en een
planning.

## Certificaten intrekken {#revoke-certificates}

Trek een server- of clientcertificaat in, bijvoorbeeld als een privésleutel is
uitgelekt. Het script markeert het als ingetrokken in de database en maakt een
lijst met ingetrokken certificaten (CRL) in `~/tls/crl/ca_crl.pem`:

```bash
openssl-revoke --dry-run example.test
openssl-revoke --reason keyCompromise example.test
openssl-revoke --crl-only
```

De certificaten hebben geen CRL-distributiepunt, dus clients vinden de CRL niet
vanzelf. Installeer `ca_crl.pem` waar je hem gebruikt, bijvoorbeeld in de
configuratie van HAProxy of nginx. Een CRL van de tussenliggende
certificaatautoriteit is 30 dagen geldig, dus maak op tijd een nieuwe met
`openssl-revoke --crl-only`.

Om een autoriteit in te trekken, noem je die met `--authority`. Het script
gebruikt dan de database van de autoriteit die haar heeft ondertekend, en maakt
de CRL van die ondertekenaar:

```bash
openssl-revoke --authority ca --reason caCompromise
openssl-revoke --authority root_ca --reason caCompromise
```

Zie [revoke_tls_certificates] voor de details.

[get started]: #get-started
[Create Your Own Certificate]: #create-your-own-certificate
[Renew Certificates]: #renew-certificates
[Passphrases of the Authority Keys]: #passphrases-of-the-authority-keys
[verify_tls_certificates]: /openssl/script-info/verify-tls-certificates/
[tls_certificate_status]: /openssl/script-info/tls-certificate-status/
[renew_tls_certificates]: /openssl/script-info/renew-tls-certificates/
[revoke_tls_certificates]: /openssl/script-info/revoke-tls-certificates/
