---
title: "Overzicht van OpenSSL"
description: "Ontdek OpenSSL met dit uitgebreide overzicht"
url: "openssl/overview"
aliases: ""
icon: "overview"

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
keywords:
  - cryptographic library
  - encryption
  - decryption
  - secure communication
  - TLS
  - certificates
  - cryptographic algorithms
  - security protocols

weight: 9901

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Inleiding {#introduction}

OpenSSL is een veelgebruikte cryptografische opensourcebibliotheek met tools,
bibliotheken en protocollen voor veilige communicatie via computernetwerken. Het
ondersteunt allerlei versleutelingsalgoritmen, cryptografische hashfuncties en
protocollen, en is daarmee een veelzijdig hulpmiddel om gegevensoverdracht te
beveiligen en de integriteit van gegevens te bewaken.

## Zelfondertekende certificaten {#self-signed-certificates}

Deze repository bevat scripts en configuratiebestanden om met OpenSSL
zelfondertekende certificaten te maken, te controleren, te vernieuwen en in te
trekken. Ze maken een vertrouwde identiteit, een rootcertificaatautoriteit (CA),
een tussenliggende CA, en ECDSA- en RSA-certificaten voor servers, clients en
localhost.

{{% alert context="warning" %}}
De certificaten zijn bedoeld voor een homelab en om te testen. Gebruik ze niet
in productie, waar je validatie door een derde partij nodig hebt. {{% /alert %}}

## Wat je krijgt {#what-you-get}

Elke taak heeft een alias. De alias start het script, en de scriptpagina legt
het uitgebreid uit.

- **De mappen en configuraties maken**: `new-tls-directory-setup`. Scriptpagina:
  [tls_directory_setup](/openssl/script-info/tls-directory-setup/).
- **De autoriteiten maken**: `new-trusted-id`, `new-root-ca`, `new-ca`.
  Scriptpagina's: [trusted_id](/openssl/script-info/trusted-id/),
  [root_ca](/openssl/script-info/root-ca/), [ca](/openssl/script-info/ca/).
- **Een certificaat uitgeven**: `new-cert-localhost`, `new-cert-server`,
  `new-cert-client`, `new-cert-rsa-server`, `new-cert-rsa-client`.
  Scriptpagina's:
  [cert_ecdsa_localhost](/openssl/script-info/cert-ecdsa-localhost/),
  [cert_ecdsa_server](/openssl/script-info/cert-ecdsa-server/),
  [cert_ecdsa_client](/openssl/script-info/cert-ecdsa-client/),
  [cert_rsa_server](/openssl/script-info/cert-rsa-server/),
  [cert_rsa_client](/openssl/script-info/cert-rsa-client/). Deze vijf scripts
  starten [cert](/openssl/script-info/cert/), dat het werk doet.
- **De vertrouwensketen controleren**: `openssl-verify`. Scriptpagina:
  [verify_tls_certificates](/openssl/script-info/verify-tls-certificates/).
- **De vervaldatum controleren**: `openssl-status`. Scriptpagina:
  [tls_certificate_status](/openssl/script-info/tls-certificate-status/).
- **Vernieuwen voordat het certificaat verloopt**: `openssl-renew`.
  Scriptpagina:
  [renew_tls_certificates](/openssl/script-info/renew-tls-certificates/).
- **Intrekken en een CRL maken**: `openssl-revoke`. Scriptpagina:
  [revoke_tls_certificates](/openssl/script-info/revoke-tls-certificates/).
- **Een oude map `~/ssl` verplaatsen naar `~/tls`**: `openssl-migrate-tls`.
  Scriptpagina:
  [tls_directory_migrate](/openssl/script-info/tls-directory-migrate/).

De scripts delen hun functies in één bestand. Scriptpagina:
[common](/openssl/script-info/common/).

Alles wordt bewaard in `~/tls`. Volg de [snelstart][Quickstart Guide] om de
scripts te installeren en je eerste certificaat te maken.

## Voorbeelden {#examples}

In de OpenSSL-repository staat een map `examples` met voorbeeldconfiguraties die
laten zien hoe de TLS-mappen zijn opgebouwd, met de bijbehorende certificaten en
bestanden. De certificaten en privésleutels staan erin, maar de inhoud is om
veiligheidsredenen aangepast. De echte gegevens van certificaten en sleutels
zijn vervangen door voorbeeldtekst, zoals:

### .csr/.pem - voorbeeld van een certificaataanvraag {#csrpem---certificate-signing-request-example}

```pem
-----BEGIN CERTIFICATE REQUEST-----
This is a demonstration Certificate Signing Request (CSR).

**WARNING:**
This CSR is for demonstration purposes only.
**DO NOT use in testing or production environments.**
-----END CERTIFICATE REQUEST-----
```

### .crt/.pem - voorbeeld van een certificaat {#crtpem---certificate-example}

```pem
-----BEGIN CERTIFICATE-----
This is a demonstration certificate.

**WARNING:**
This certificate is for demonstration purposes only.
**DO NOT use in testing or production environments.**
-----END CERTIFICATE-----
```

### .key/.pem - voorbeeld van een privésleutel {#keypem---private-key-example}

```pem
-----BEGIN EC PARAMETERS-----
This is a demonstration Elliptic Curve (EC) parameter set.
-----END EC PARAMETERS-----
-----BEGIN EC PRIVATE KEY-----
**WARNING:**
This private key is for demonstration purposes only.
**DO NOT use in testing or production environments.**
-----END EC PRIVATE KEY-----
```

De sleutels van de vertrouwde identiteit en de root-CA zijn versleuteld met een
wachtwoordzin, daarom hebben hun voorbeeldbestanden de kopregel
`BEGIN ENCRYPTED PRIVATE KEY`. De voorbeeldsleutel van de tussenliggende CA
heeft de kopregel `BEGIN PRIVATE KEY`.

Zo worden er geen echte certificaten of privésleutels gedeeld, terwijl de juiste
opbouw toch te zien is.

## Bijdragen aan Homelab-Alpha - OpenSSL {#contribute-to-homelab-alpha---openssl}

We waarderen je bijdrage en maken het je zo makkelijk mogelijk om bij te dragen
aan de repository Homelab-Alpha - openssl. Wijzigingen aan openssl lopen via
pull requests naar de branch `main`. Lees [hoe je bijdraagt][contribute].

## Beveiliging {#security-considerations}

OpenSSL biedt krachtige cryptografische functies, maar het is belangrijk om
goede werkwijzen te volgen en de bibliotheek actueel te houden om
beveiligingslekken te dichten. Controleer regelmatig op updates en
beveiligingsadviezen van het OpenSSL-project.

## Bronnen {#resources}

- [Officiële site van OpenSSL][OpenSSL Official Site]
- [OpenSSL-wiki][OpenSSL Wiki]
- [Documentatie van OpenSSL][OpenSSL Documentation]
- [GitHub-repository][GitHub Repository]

## Disclaimer

Dit overzicht van OpenSSL is alleen bedoeld ter informatie en vervangt de
officiële documentatie of goede beveiligingspraktijken niet. Raadpleeg altijd de
officiële documentatie van OpenSSL en volg goede werkwijzen als je
cryptografische bibliotheken en protocollen gebruikt.

## Licentie {#license}

Dit project valt onder de **Creative Commons
Naamsvermelding-NietCommercieel-GelijkDelen 4.0 Internationaal-licentie** (CC
BY-NC-SA 4.0). Zie de pagina [licentie][license] voor de volledige licentietekst
en het bestand [NOTICE] voor de eisen aan de naamsvermelding.

[Quickstart Guide]: /openssl/quickstart-guide/
[contribute]: /contributing/contribute/
[OpenSSL Official Site]: https://www.openssl.org
[OpenSSL Wiki]: https://wiki.openssl.org
[OpenSSL Documentation]: https://www.openssl.org/docs
[GitHub Repository]: https://github.com/openssl/openssl
[license]: /license/
[NOTICE]: https://github.com/homelab-alpha/openssl/blob/main/NOTICE
