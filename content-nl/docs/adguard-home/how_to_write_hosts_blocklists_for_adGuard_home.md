---
title: "Hosts-blokkeerlijsten schrijven voor AdGuard Home"
description:
  "Leer hoe je hosts-blokkeerlijsten schrijft voor AdGuard Home, met de
  Adblock-syntaxis, de syntaxis van /etc/hosts of alleen domeinnamen. Maak
  effectieve blokkeerlijsten die werken met adblockers in browsers en met
  AdGuard Home."
url: "adguard-home/how-to-write-hosts-blocklists"
aliases: ""
icon: "description"

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
  - blocklists
  - hostlists
  - Adblock syntax
  - /etc/hosts syntax
  - domains-only syntax
  - DNS filtering
keywords:
  - AdGuard Home blocklists
  - writing blocklists
  - Adblock-style syntax
  - /etc/hosts syntax
  - domains-only syntax
  - hosts blocklists
  - DNS filtering

weight: 1003

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="warning" %}}
**Let op** - Deze documentatie is nog in bewerking {{% /alert %}}

{{% alert context="primary" %}}
[Officieel: documentatie over het schrijven van
hosts-blokkeerlijsten][Official: Documentation for write hosts blocklists]
{{% /alert %}}

## Inleiding {#introduction}

Er zijn drie manieren om hosts-blokkeerlijsten te schrijven:

- [Adblock-syntaxis](#adblock-style-syntax): de moderne manier om filterregels
  te schrijven, met een deel van de Adblock-syntaxis. Zo werken blokkeerlijsten
  ook met adblockers in browsers.

- [Syntaxis van `/etc/hosts`](#hosts-style-syntax): de oude, beproefde manier,
  met dezelfde syntaxis die besturingssystemen gebruiken voor hun
  hosts-bestanden.

- [Alleen domeinnamen](#domains-only-syntax): een eenvoudige lijst met
  domeinnamen.

Maak je een blokkeerlijst voor AdGuard Home, dan raden we de
[Adblock-syntaxis](#adblock-style-syntax) aan. Die heeft een paar belangrijke
voordelen ten opzichte van de oude syntaxis:

- **Omvang van de blokkeerlijst.** Met patronen heb je één regel nodig in plaats
  van honderden regels in `/etc/hosts`.

- **Compatibiliteit.** Je blokkeerlijst werkt met adblockers in browsers, en je
  deelt regels makkelijker met een filterlijst voor browsers.

- **Uitbreidbaarheid.** De Adblock-syntaxis is de afgelopen tien jaar sterk
  ontwikkeld, en we zien geen reden om die niet verder uit te breiden met extra
  functies voor blokkeerders op netwerkniveau.

Onderhoud je een blokkeerlijst in de stijl van etc-hosts, of meerdere
filterlijsten van welk type dan ook, dan is er een tool om blokkeerlijsten voor
AdGuard Home samen te stellen. Die heet [Hostlist compiler], en AdGuard gebruikt
hem zelf voor het [AdGuard DNS filter].

## Eenvoudige voorbeelden {#basic-examples}

- `||example.org^`: blokkeer het domein `example.org` en al zijn subdomeinen,
  zoals `www.example.org`.

- `@@||example.org^`: deblokkeer het domein `example.org` en al zijn
  subdomeinen.

- `1.2.3.4 example.org`: (let op: de oude syntaxis van `/etc/hosts`) antwoord
  met `1.2.3.4` op verzoeken voor het domein `example.org`, maar **niet** voor
  zijn subdomeinen. `www.example.org` blijft toegestaan.

  Het onbepaalde IP-adres (`0.0.0.0`) of een lokaal adres (`127.0.0.1` en
  dergelijke) gebruiken voor een host is in feite hetzelfde als die host
  blokkeren.

  ```adblock
  # Returns the IP address 1.2.3.4 for example.org.
  1.2.3.4 example.org
  # Blocks example.com by responding with 0.0.0.0.
  0.0.0.0 example.com
  ```

- `example.org`: een eenvoudige domeinregel. Blokkeert het domein `example.org`,
  maar **niet** zijn subdomeinen. `www.example.org` blijft toegestaan.

- `! Here goes a comment` en `# Also a comment`: opmerkingen.

- `/REGEX/`: blokkeer de domeinen die passen bij de opgegeven reguliere
  expressie.

## Adblock-syntaxis {#adblock-style-syntax}

Dit is een deel van de [traditionele
Adblock-syntaxis][traditional Adblock-style] die adblockers in browsers
gebruiken.

```plaintext
     rule = ["@@"] pattern [ "$" modifiers ]
modifiers = [modifier0, modifier1[, ...[, modifierN]]]
```

- `pattern`: het masker voor de hostnaam. Elke hostnaam wordt met dit masker
  vergeleken. Het patroon kan ook speciale tekens bevatten, die hieronder worden
  beschreven.

- `@@`: de markering voor uitzonderingsregels. Begin je regel hiermee als je het
  filteren voor de passende hostnamen wilt uitschakelen.

- `modifiers`: parameters die de regel verduidelijken. Ze kunnen de werking van
  de regel beperken of zelfs helemaal veranderen.

## Speciale tekens {#special-characters}

- `*`: het jokerteken. Het staat voor elke reeks tekens. Dat kan ook een lege
  tekenreeks zijn, of een reeks van elke lengte.

- `||`: past bij het begin van een hostnaam, met elk subdomein. Zo past
  `||example.org` bij `example.org` en `test.example.org`, maar niet bij
  `testexample.org`.

- `^`: het scheidingsteken. Anders dan bij het blokkeren in een browser valt er
  in een hostnaam niets te scheiden, dus dit teken markeert alleen het einde van
  de hostnaam.

- `|`: een verwijzing naar het begin of het einde van de hostnaam. De betekenis
  hangt af van de plek van het teken in het masker. Zo past de regel
  `ample.org|` bij `example.org`, maar niet bij `example.org.com`. `|example`
  past bij `example.org`, maar niet bij `test.example`.

## Reguliere expressies {#regular-expressions}

Wil je nog meer vrijheid bij het maken van regels, dan kun je [reguliere
expressies][regular expressions] gebruiken in plaats van de standaard,
vereenvoudigde syntaxis. Een reguliere expressie ziet er bijvoorbeeld zo uit:

```plaintext
pattern = "/" regexp "/"
```

- `/example.*/` blokkeert hosts die passen bij de reguliere expressie
  `example.*`.

- `@@/example.*/$important` deblokkeert hosts die passen bij de reguliere
  expressie `example.*`.

{{% alert context="primary" %}}
Let op: deze regel bevat ook de modifier `important`.{{% /alert %}}

## Opmerkingen {#comments}

Elke regel die begint met een uitroepteken of een hekje is een opmerking en
wordt door de filter genegeerd. Opmerkingen staan meestal boven regels en
beschrijven wat een regel doet, bijvoorbeeld:

```adblock
! This is a comment.
# This is also a comment.
```

## Modifiers {#rule-modifiers}

Je kunt de werking van een regel aanpassen met modifiers. Modifiers staan aan
het einde van de regel, na het teken `$`, en worden gescheiden door komma's.

{{% alert context="primary" %}}
Modifiers werken niet met regels in de stijl van `/etc/hosts`. Zo schakelt
`127.0.0.1 example.org$badfilter` de oorspronkelijke regel
`127.0.0.1 example.org` **niet** uit, bijvoorbeeld: {{% /alert %}}

- ```adblock
    ||example.org^$important
  ```

  `||example.org^` is het patroon. `$` is het scheidingsteken: wat erna komt,
  zijn modifiers. `important` is de modifier.

- Je kunt meerdere modifiers in één regel gebruiken. Scheid ze dan met komma's:

  ```adblock
  ||example.org^$client=127.0.0.1,dnstype=A
  ```

  `||example.org^` is het patroon. `$` is het scheidingsteken: wat erna komt,
  zijn modifiers. `client=127.0.0.1` is de modifier [`client`](#client) met de
  waarde `127.0.0.1`, en `,` is het scheidingsteken. Ten slotte is `dnstype=A`
  de modifier [`dnstype`](#dns-type) met de waarde `A`.

{{% alert context="primary" %}}
Bevat een regel een modifier die niet in dit document staat, dan **moet de hele
regel worden genegeerd**. Zo voorkomen we valse positieven als mensen
ongewijzigde filterlijsten voor adblockers in browsers proberen te gebruiken,
zoals EasyList of EasyPrivacy.
{{% /alert %}}

## Client

Met de modifier `client` geef je aan voor welke clients de regel geldt. Je kunt
een client op twee manieren aanduiden:

- Met het IP-adres of het CIDR-voorvoegsel. Dit werkt voor alle soorten clients.

- Met de naam. Dit werkt alleen voor vaste clients, dus clients die je met de
  hand hebt toegevoegd op de pagina “Instellingen → Clientinstellingen”.

{{% alert context="primary" %}}
ClientID's worden nog niet ondersteund, alleen namen. Heb je een client
toegevoegd met de naam “My Client” en de ClientID `my-client`, schrijf je
modifier dan als `$client='My Client'` en niet als `$client=my-client`.
{{% /alert %}}

De syntaxis is:

```adblock
$client=value1|value2|...
```

Je kunt clients ook uitsluiten door een `~` voor de waarde te zetten. Dan geldt
de regel niet voor de DNS-verzoeken van die client.

```adblock
$client=~value1
```

Clientnamen bevatten vaak spaties of andere speciale tekens, daarom zet je de
naam tussen aanhalingstekens. Enkele en dubbele ASCII-aanhalingstekens worden
allebei ondersteund. Gebruik de backslash (`\`) om aanhalingstekens (`"` en
`'`), komma's (`,`) en sluistekens (`|`) te escapen.

{{% alert context="primary" %}}
Sluit je een client uit, dan **moet** de `~` buiten de aanhalingstekens staan,
bijvoorbeeld:
{{% /alert %}}

- `@@||*^$client=127.0.0.1`: deblokkeer alles voor localhost.

- `||example.org^$client='Frank\'s laptop'`: blokkeer `example.org` alleen voor
  de client met de naam `Frank's laptop`. Let op: het aanhalingsteken (`'`) in
  de naam moet worden geëscapet.

- `||example.org^$client=~'Mary\'s\, John\'s\, and Boris\'s laptops'`: blokkeer
  `example.org` voor iedereen behalve de client met de naam
  `Mary's, John's, and Boris's laptops`. Let op: ook de komma (`,`) moet worden
  geëscapet.

- `||example.org^$client=~Mom|~Dad|Kids`: blokkeer `example.org` voor `Kids`,
  maar niet voor `Mom` en `Dad`. Dit voorbeeld laat zien hoe je meerdere clients
  in één regel opgeeft.

- `||example.org^$client=192.168.0.0/24`: blokkeer `example.org` voor alle
  clients met een IP-adres van `192.168.0.0` tot `192.168.0.255`.

## DenyAllow

Beschikbaar sinds **v0.106.0**.

Met de modifier `denyallow` sluit je domeinen uit van de blokkeerregel. Voeg je
meerdere domeinen toe aan één regel, scheid ze dan met het teken `|`.

De syntaxis is:

```adblock
$denyallow=domain1|domain2|...
```

Met deze modifier hoef je geen overbodige uitzonderingsregels te maken als je
blokkeerregel te veel domeinen omvat. Misschien wil je alles blokkeren behalve
een paar TLD's. Op de gewone manier gebruik je dan regels als deze:

```adblock
! Block everything.
/.*/

! Unblock a couple of TLDs.
@@||com^
@@||net^
```

Het nadeel daarvan is dat je dan ook trackingdomeinen op die TLD's deblokkeert
(bijvoorbeeld `google-analytics.com`). Zo los je dat op met `denyallow`:

```adblock
*$denyallow=com|net
```

- `*$denyallow=com|net`: blokkeer alles behalve `*.com` en `*.net`.

- `@@*$denyallow=com|net`: deblokkeer alles behalve `*.com` en `*.net`.

- `||example.org^$denyallow=sub.example.org`: blokkeer `example.org` en
  `*.example.org`, maar niet `sub.example.org`.

## DNS Type

Beschikbaar sinds **v0.105.0**.

Met de modifier `dnstype` geef je aan bij welk type DNS-verzoek of -antwoord de
regel geldt.

De syntaxis is:

```adblock
$dnstype=value1|value2|...
$dnstype=~value1|~value2|~...
```

De namen van de typen zijn niet hoofdlettergevoelig, maar worden gecontroleerd
tegen de bestaande typen DNS-resourcerecords (RR).

Combineer geen uitsluitingsregels met insluitingsregels, bijvoorbeeld:

```adblock
$dnstype=~value1|value2
```

is hetzelfde als:

```adblock
$dnstype=value2
```

- `||example.org^$dnstype=AAAA`: blokkeer DNS-verzoeken voor de IPv6-adressen
  van `example.org`.

- `||example.org^$dnstype=~A|~CNAME`: sta voor `example.org` alleen
  DNS-verzoeken van het type `A` en `CNAME` toe en blokkeer de rest.

{{% alert context="primary" %}}
Vóór versie **v0.108.0** gebruikte AdGuard Home het type van het verzoek om de
records in het antwoord te filteren, in plaats van het type van het record zelf.
Daardoor kon je geen regels schrijven die bepaalde `CNAME`-records in antwoorden
op `A`- en `AAAA`-verzoeken toestaan. In **v0.108.0** is dat veranderd, dus nu:
{{% /alert %}}

```adblock
||canon.example.com^$dnstype=~CNAME
```

voorkomt dit dat het volgende antwoord wordt gefilterd:

```plaintext
ANSWERS:
->  example.com
    canonical name = canon.example.com.
    ttl = 60
->  canon.example.com
    internet address = 1.2.3.4
    ttl = 60
```

## DNS Rewrite

Beschikbaar sinds **v0.105.0**.

Met de antwoordmodifier `dnsrewrite` vervang je de inhoud van het antwoord op
het DNS-verzoek voor de passende hosts. Regels met de modifier `dnsrewrite`
hebben in AdGuard Home voorrang op andere regels.

De korte syntaxis is:

```adblock
$dnsrewrite=1.2.3.4
$dnsrewrite=abcd::1234
$dnsrewrite=example.net
$dnsrewrite=REFUSED
```

De trefwoorden MOETEN in hoofdletters (bijvoorbeeld `NOERROR`). Herschrijvingen
met trefwoorden gaan voor de andere en geven een leeg antwoord met de
bijbehorende antwoordcode.

Vóór **v0.107.3** was `REFUSED` het enige mogelijke trefwoord.

Sinds **v0.107.3** worden ook de antwoordcodes `NOERROR`, `NXDOMAIN` en
`SERVFAIL` ondersteund.

De volledige syntaxis heeft de vorm `RCODE;RRTYPE;VALUE`:

```adblock
$dnsrewrite=NOERROR;A;1.2.3.4
$dnsrewrite=NOERROR;AAAA;abcd::1234
$dnsrewrite=NOERROR;CNAME;example.net
$dnsrewrite=REFUSED;;
```

Sinds **v0.107.3** mag een modifier `$dnsrewrite` met de antwoordcode `NOERROR`
ook lege velden `RRTYPE` en `VALUE` hebben.

`CNAME` is bijzonder, omdat AdGuard Home dan de host opzoekt en de gegevens
daarvan aan het antwoord toevoegt. Heeft `example.net` bijvoorbeeld het IP-adres
`1.2.3.4` en staat dit in de filterregels van de gebruiker:

```adblock
||example.com^$dnsrewrite=example.net
! Or:
||example.com^$dnsrewrite=NOERROR;CNAME;example.net
```

dan ziet het antwoord er ongeveer zo uit:

```sh
nslookup example.com my.adguard.local
```

```plaintext
Server:		my.adguard.local
Address:	127.0.0.1#53

Non-authoritative answer:
example.com	canonical name = example.net.
Name:	example.net
Address: 1.2.3.4
```

Daarna komt de `CNAME`-herschrijving. Vervolgens worden de waarden van alle
andere records samengevoegd tot één antwoord, dus dit:

```adblock
||example.com^$dnsrewrite=NOERROR;A;1.2.3.4
||example.com^$dnsrewrite=NOERROR;A;1.2.3.5
```

geeft een antwoord met twee `A`-records.

Ondersteunde RR-typen, met voorbeelden:

- `||4.3.2.1.in-addr.arpa^$dnsrewrite=NOERROR;PTR;example.net.` voegt een
  `PTR`-record toe voor reverse DNS. Reverse-DNS-verzoeken voor `1.2.3.4` aan de
  DNS-server van AdGuard Home geven `example.net`.

{{% alert context="primary" %}}
Het IP-adres MOET in omgekeerde volgorde staan. Vóór **v0.106.0** moest de
waarde eindigen op een punt, maar sinds **v0.106.0** zijn beide vormen
toegestaan. Zie [RFC 1035].
{{% /alert %}}

- `||example.com^$dnsrewrite=NOERROR;A;1.2.3.4` voegt een `A`-record toe met de
  waarde `1.2.3.4`.

- `||example.com^$dnsrewrite=NOERROR;AAAA;abcd::1234` voegt een `AAAA`-record
  toe met de waarde `abcd::1234`.

- `||example.com^$dnsrewrite=NOERROR;CNAME;example.org` voegt een `CNAME`-record
  toe. Zie de uitleg hierboven.

- `||example.com^$dnsrewrite=NOERROR;HTTPS;32 example.com alpn=h3` voegt een
  `HTTPS`-record toe. Slechts een deel van de parameterwaarden wordt
  ondersteund: waarden moeten `contiguous` zijn, en waar een `value-list` wordt
  verwacht, wordt nu maar één waarde ondersteund:

  ```plaintext
  ipv4hint=127.0.0.1             // Supported.
  ipv4hint="127.0.0.1"           // Unsupported.
  ipv4hint=127.0.0.1,127.0.0.2   // Unsupported.
  ipv4hint="127.0.0.1,127.0.0.2" // Unsupported.
  ```

  Dit verandert in de toekomst.

- `||example.com^$dnsrewrite=NOERROR;MX;32 example.mail` voegt een `MX`-record
  toe met de prioriteit `32` en de mailserver `example.mail`.

- `||example.com^$dnsrewrite=NOERROR;SVCB;32 example.com alpn=h3` voegt een
  `SVCB`-waarde toe. Zie het `HTTPS`-voorbeeld hierboven.

- `||example.com^$dnsrewrite=NOERROR;TXT;hello_world` voegt een `TXT`-record toe
  met de waarde `hello_world`.

- `||_svctype._tcp.example.com^$dnsrewrite=NOERROR;SRV;10 60 8080 example.com`
  voegt een `SRV`-record toe met de prioriteit `10`, het gewicht `60`, de poort
  `8080` en het doel `example.com`.

- `||example.com^$dnsrewrite=NXDOMAIN;;` antwoordt met de code `NXDOMAIN`.

- `$dnstype=AAAA,denyallow=example.org,dnsrewrite=NOERROR;;` geeft een leeg
  antwoord `NOERROR` op alle `AAAA`-verzoeken, behalve die voor `example.org`.

{{% alert context="primary" %}}
Dit is beschikbaar sinds **v0.107.3**. {{% /alert %}}

Uitzonderingsregels verwijderen één regel of alle regels, bijvoorbeeld:

- `@@||example.com^$dnsrewrite` verwijdert alle DNS-herschrijfregels.

- `@@||example.com^$dnsrewrite=1.2.3.4` verwijdert de DNS-herschrijfregel die
  een `A`-record met de waarde `1.2.3.4` toevoegt.

## Important

De modifier `important` geeft een regel voorrang op elke regel zonder deze
modifier. Zelfs op gewone uitzonderingsregels, bijvoorbeeld:

- In dit voorbeeld:

  ```adblock
  ||example.org^$important
  @@||example.org^
  ```

  blokkeert `||example.org^$important` alle verzoeken aan `*.example.org`,
  ondanks de uitzonderingsregel.

- In dit voorbeeld:

  ```adblock
  ||example.org^$important
  @@||example.org^$important
  ```

  heeft de uitzonderingsregel ook de modifier `important`, dus die werkt.

## Badfilter

Regels met de modifier `badfilter` schakelen andere gewone regels uit waarnaar
ze verwijzen. De tekst van de uitgeschakelde regel moet dus gelijk zijn aan de
tekst van de `badfilter`-regel (zonder de modifier `badfilter`), bijvoorbeeld:

- `||example.com$badfilter` schakelt `||example.com` uit.

- `@@||example.org^$badfilter` schakelt `@@||example.org^` uit.

## Ctags

Met de modifier `ctag` blokkeer je domeinen alleen voor bepaalde soorten
DNS-clienttags. Je kent tags aan clients toe in de interface van AdGuard Home.
In de toekomst willen we tags automatisch toekennen door het gedrag van elke
client te analyseren.

De syntaxis is:

```adblock
$ctag=value1|value2|...
```

Past een van de tags van een client bij de `ctag`-waarden, dan geldt deze regel
voor die client. De syntaxis voor uitsluiten is:

```adblock
$ctag=~value1|~value2|...
```

Past een van de tags van een client bij de uitgesloten `ctag`-waarden, dan geldt
deze regel niet voor die client, bijvoorbeeld:

- `||example.org^$ctag=device_pc|device_phone`: blokkeer `example.org` voor
  clients met de tag `device_pc` of `device_phone`.

- `||example.org^$ctag=~device_phone`: blokkeer `example.org` voor alle clients,
  behalve die met de tag `device_phone`.

De lijst met toegestane tags:

- Per soort apparaat:
  - `device_audio`: audioapparaten.
  - `device_camera`: camera's.
  - `device_gameconsole`: spelcomputers.
  - `device_laptop`: laptops.
  - `device_nas`: NAS (netwerkopslag).
  - `device_pc`: pc's.
  - `device_phone`: telefoons.
  - `device_printer`: printers.
  - `device_securityalarm`: alarmsystemen.
  - `device_tablet`: tablets.
  - `device_tv`: tv's.
  - `device_other`: andere apparaten.

- Per besturingssysteem:
  - `os_android`: Android.
  - `os_ios`: iOS.
  - `os_linux`: Linux.
  - `os_macos`: macOS.
  - `os_windows`: Windows.
  - `os_other`: andere besturingssystemen.

- Per gebruikersgroep:
  - `user_admin`: beheerders.
  - `user_regular`: gewone gebruikers.
  - `user_child`: kinderen.

## Syntaxis van hosts-bestanden {#hosts-style-syntax}

Voor elke host staat er één regel met de volgende gegevens:

```plaintext
IP_address canonical_hostname [aliases...]
```

De velden worden gescheiden door een willekeurig aantal spaties of tabs. Tekst
vanaf het teken `#` tot het einde van de regel is een opmerking en wordt
genegeerd. Modifiers, zoals `client` of `badfilter`, werken niet met deze
regels.

Hostnamen mogen alleen letters, cijfers, koppeltekens (`-`) en punten (`.`)
bevatten. Ze moeten beginnen met een letter en eindigen met een letter of
cijfer. Met optionele aliassen geef je andere namen, andere schrijfwijzen,
kortere hostnamen of algemene hostnamen op (bijvoorbeeld `localhost`):

```adblock
# This is a comment
127.0.0.1 example.org example.info
127.0.0.1 example.com
127.0.0.1 example.net # this is also a comment
```

De IP-adressen worden gebruikt als antwoord op DNS-verzoeken voor deze domeinen.

## Alleen domeinnamen {#domains-only-syntax}

Een eenvoudige lijst met domeinnamen, één naam per regel, bijvoorbeeld:

```adblock
# This is a comment
example.com
example.org
example.net # this is also a comment
```

Is een tekenreeks geen geldig domein (bijvoorbeeld `*.example.org`), dan
behandelt AdGuard Home die als een regel in de
[Adblock-syntaxis](#adblock-style-syntax).

## Hostlists Compiler

Onderhoud je een blokkeerlijst met verschillende bronnen, dan kan de [Hostlists
compiler] handig zijn. Het is een eenvoudige tool waarmee je makkelijker een
hosts-blokkeerlijst samenstelt voor AdGuard Home of een ander AdGuard-product
met DNS-filtering.

Wat de tool kan:

1. Eén blokkeerlijst samenstellen uit meerdere bronnen.

2. Regels weglaten die je niet nodig hebt.

3. De lijst opschonen: dubbele regels verwijderen, ongeldige regels verwijderen
   en de lijst comprimeren.

[Official: Documentation for write hosts blocklists]:
  https://github.com/AdguardTeam/AdGuardHome/wiki/Hosts-Blocklists
[Hostlist compiler]: https://github.com/AdguardTeam/HostlistCompiler
[traditional Adblock-style]:
  https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters
[regular expressions]: https://github.com/google/re2/wiki/Syntax
[RFC 1035]: https://tools.ietf.org/html/rfc1035#section-3.5
[Hostlists compiler]: https://github.com/AdguardTeam/HostlistCompiler
[AdGuard DNS filter]: https://github.com/AdguardTeam/AdGuardSDNSFilter
