---
title: "ASUS Q-CODE (foutcode)"
description:
  "Voor het ASUS ROG STRIX B650E-E GAMING WIFI (moederbord voor AMD Socket AM5)"
url: "help/qcode"
aliases:
  - /qcode
icon: "tools_wrench"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Homelab-Alpha
series:
  - Help
tags:
  - Troubleshooting
  - ASUS
  - Q-CODE
keywords:
  - Q-CODE

weight: 6001

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="warning" %}}
**Let op** - Deze documentatie is nog in bewerking {{% /alert %}}

{{% alert context="primary" %}}
[Officiële ASUS-documentatie over
Q-Code][Official ASUS Documentation For Q-Code] {{% /alert %}}

Welkom bij de handleiding voor probleemoplossing, je vaste bron om oplossingen
voor veelvoorkomende problemen te vinden. Of je nu te maken hebt met
hardwareproblemen, softwarefouten of verbindingsproblemen, deze handleiding
helpt je de meest voorkomende problemen te herkennen en op te lossen. De
beschrijvingen van de codes in de tabel komen van ASUS en zijn niet vertaald.

## Q-Code

| Q-CODE | Beschrijving                                                                  | Vaak | SOORT | Oplossing                  |
| ------ | ----------------------------------------------------------------------------- | ---- | ----- | -------------------------- |
| 00     | Not used                                                                      | JA   | 6     |                            |
| 01     | Power on. Reset type detection (soft/hard).                                   |      |       |                            |
| 02     | AP initialization before microcode loading                                    |      |       |                            |
| 03     | System Agent initialization before microcode loading                          |      |       |                            |
| 04     | PCH initialization before microcode loading                                   |      |       |                            |
| 06     | Microcode loading                                                             |      |       |                            |
| 07     | AP initialization after microcode loading                                     |      |       |                            |
| 08     | System Agent initialization after microcode loading                           |      |       |                            |
| 09     | PCH initialization after microcode loading                                    |      |       |                            |
| 0B     | Cache initialization                                                          |      |       |                            |
| 0C–0D  | Reserved for future AMI SEC error codes                                       |      |       |                            |
| 0E     | Microcode not found                                                           |      |       |                            |
| 0F     | Microcode not loaded                                                          |      |       |                            |
| 10     | PEI Core is started                                                           |      |       |                            |
| 11–14  | Pre-memory CPU initialization is started                                      |      |       |                            |
| 15–18  | Pre-memory System Agent initialization is started                             | JA   | 4     |                            |
| 19–1C  | Pre-memory PCH initialization is started                                      | JA   | 6     |                            |
| 2B–2F  | Memory initialization                                                         |      |       |                            |
| 30     | Reserved for ASL (see ASL Status Codes section below)                         | JA   | 6     |                            |
| 31     | Memory Installed                                                              |      |       |                            |
| 32–36  | CPU post-memory initialization                                                |      |       |                            |
| 37–3A  | Post-Memory System Agent initialization is started                            |      |       |                            |
| 3B–3E  | Post-Memory PCH initialization is started                                     |      |       |                            |
| 4F     | DXE IPL is started                                                            |      |       |                            |
| 50–53  | Memory initialization error. Invalid memory type or incompatible memoryspeed  | JA   | 3     |                            |
| 54     | Unspecified memory initialization error                                       |      |       |                            |
| 55     | Memory not installed                                                          | JA   | 3     |                            |
| 56     | Invalid CPU type or Speed                                                     |      |       |                            |
| 57     | CPU mismatch                                                                  |      |       |                            |
| 58     | CPU self test failed or possible CPU cache error                              |      |       |                            |
| 59     | CPU micro-code is not found or micro-code update is failed                    |      |       |                            |
| 5A     | Internal CPU error                                                            |      |       |                            |
| 5B     | Reset PPI is not available                                                    |      |       |                            |
| 5C–5F  | Reserved for future AMI error codes                                           |      |       |                            |
| E0     | S3 Resume is stared (S3 Resume PPI is called by the DXE IPL)                  |      |       |                            |
| E1     | S3 Boot Script execution                                                      |      |       |                            |
| E2     | Video repost                                                                  |      |       |                            |
| E3-OS  | S3 wake vector call                                                           |      |       |                            |
| E4–E7  | Reserved for future AMI progress codes                                        |      |       |                            |
| E8     | S3 Resume Failed                                                              |      |       |                            |
| E9     | S3 Resume PPI not Found                                                       |      |       |                            |
| EA     | S3 Resume Boot Script Error                                                   |      |       |                            |
| EB     | S3 OS Wake Error                                                              |      |       |                            |
| EC–EF  | Reserved for future AMI error codes                                           |      |       |                            |
| F0     | Recovery condition triggered by firmware (Auto recovery)                      |      |       |                            |
| F1     | Recovery condition triggered by user (Forced recovery)                        |      |       |                            |
| F2     | Recovery process started                                                      |      |       |                            |
| F3     | Recovery firmware image is found                                              |      |       |                            |
| F4     | Recovery firmware image is loaded                                             |      |       |                            |
| F5–F7  | Reserved for future AMI progress codes                                        |      |       |                            |
| F8     | Recovery PPI is not available                                                 |      |       |                            |
| F9     | Recovery capsule is not found                                                 | JA   | 3     |                            |
| FA     | Invalid recovery capsule                                                      |      |       |                            |
| FB–FF  | Reserved for future AMI error codes                                           |      |       |                            |
| 60     | DXE Core is started                                                           |      |       |                            |
| 61     | NVRAM initialization                                                          |      |       |                            |
| 62     | Installation of the PCH Runtime Services                                      |      |       |                            |
| 63–67  | CPU DXE initialization is started                                             |      |       |                            |
| 68     | PCI host bridge initialization                                                |      |       |                            |
| 69     | System Agent DXE initialization is started                                    |      |       |                            |
| 6A     | System Agent DXE SMM initialization is started                                |      |       |                            |
| 6B–6F  | System Agent DXE initialization (System Agent module specific)                |      |       |                            |
| 70     | PCH DXE initialization is started                                             |      |       |                            |
| 71     | PCH DXE SMM initialization is started                                         |      |       |                            |
| 72     | PCH devices initialization                                                    |      |       |                            |
| 73–77  | PCH DXE Initialization (PCH module specific)                                  |      |       |                            |
| 78     | ACPI module initialization                                                    |      |       |                            |
| 79     | CSM initialization                                                            |      |       |                            |
| 7A–7F  | Reserved for future AMI DXE codes                                             |      |       |                            |
| 90     | Boot Device Selection (BDS) phase is started                                  |      |       |                            |
| 91     | Driver connecting is started                                                  |      |       |                            |
| 92     | PCI Bus initialization is started                                             |      |       |                            |
| 93     | PCI Bus Hot Plug Controller Initialization                                    |      |       |                            |
| 94     | PCI Bus Enumeration                                                           |      |       |                            |
| 95     | PCI Bus Request Resources                                                     |      |       |                            |
| 96     | PCI Bus Assign Resources                                                      |      |       |                            |
| 97     | Console Output devices connect                                                |      |       |                            |
| 98     | Console input devices connect                                                 |      |       |                            |
| 99     | Super IO Initialization                                                       | JA   | 4     |                            |
| 9A     | USB initialization is started                                                 |      |       |                            |
| 9B     | USB Reset                                                                     |      |       |                            |
| 9C     | USB Detect                                                                    |      |       |                            |
| 9D     | USB Enable                                                                    |      |       |                            |
| 9E–9F  | Reserved for future AMI codes                                                 |      |       |                            |
| A0     | IDE initialization is started                                                 | JA   | 7     |                            |
| A1     | IDE Reset                                                                     |      |       |                            |
| A2     | IDE Detect                                                                    | JA   | 7     | Probeer het CMOS te wissen |
| A3     | IDE Enable                                                                    |      |       |                            |
| A4     | SCSI initialization is started                                                |      |       |                            |
| A5     | SCSI Reset                                                                    |      |       |                            |
| A6     | SCSI Detect                                                                   |      |       |                            |
| A7     | SCSI Enable                                                                   |      |       |                            |
| A8     | Setup Verifying Password                                                      |      |       |                            |
| A9     | Start of Setup                                                                | JA   | 9     |                            |
| AA     | Reserved for ASL (see ASL Status Codes section below)                         | JA   | 10    |                            |
| AB     | Setup Input Wait                                                              |      |       |                            |
| AC     | Reserved for ASL (see ASL Status Codes section below)                         |      |       |                            |
| AD     | Ready To Boot event                                                           |      |       |                            |
| AE     | Legacy Boot event                                                             |      |       |                            |
| AF     | Exit Boot Services event                                                      |      |       |                            |
| B0     | Runtime Set Virtual Address MAP Begin                                         | JA   | 4     |                            |
| B1     | Runtime Set Virtual Address MAP End                                           |      |       |                            |
| B2     | Legacy Option ROM Initialization                                              | JA   | 8     |                            |
| B3     | System Reset                                                                  |      |       |                            |
| B4     | USB hot plug                                                                  |      |       |                            |
| B5     | PCI bus hot plug                                                              |      |       |                            |
| B6     | Clean-up of NVRAM                                                             |      |       |                            |
| B7     | Configuration Reset (reset of NVRAM settings)                                 |      |       |                            |
| B8–BF  | Reserved for future AMI codes                                                 |      |       |                            |
| D0     | CPU initialization error                                                      |      |       |                            |
| D1     | System Agent initialization error                                             |      |       |                            |
| D2     | PCH initialization error                                                      |      |       |                            |
| D3     | Some of the Architectural Protocols are not available                         |      |       |                            |
| D4     | PCI resource allocation error. Out of Resources                               |      |       |                            |
| D5     | No Space for Legacy Option ROM                                                |      |       |                            |
| D6     | No Console Output Devices are found                                           | JA   | 5     |                            |
| D7     | No Console Input Devices are found                                            |      |       |                            |
| D8     | Invalid password                                                              |      |       |                            |
| D9     | Error loading Boot Option (LoadImage returned error)                          |      |       |                            |
| DA     | Boot Option is failed (StartImage returned error)                             |      |       |                            |
| DB     | Flash update is failed                                                        |      |       |                            |
| DC     | Reset protocol is not available                                               |      |       |                            |
| 0x01   | System is entering S1 sleep state                                             |      |       |                            |
| 0x01   | System is entering S2 sleep state                                             |      |       |                            |
| 0x03   | System is entering S3 sleep state                                             |      |       |                            |
| 0x04   | System is entering S4 sleep state                                             |      |       |                            |
| 0x05   | System is entering S5 sleep state                                             |      |       |                            |
| 0x10   | System is waking up from the S1 sleep state                                   |      |       |                            |
| 0x20   | System is waking up from the S2 sleep state                                   |      |       |                            |
| 0x30   | System is waking up from the S3 sleep state                                   |      |       |                            |
| 0x40   | System is waking up from the S4 sleep state                                   | JA   | 6     |                            |
| 0xAC   | System has transitioned into ACPI mode. Interrupt controller is in PIC mode.  |      |       |                            |
| 0xAA   | System has transitioned into ACPI mode. Interrupt controller is in APIC mode. |      |       |                            |

## Soort probleem

| SOORT | Probleem                                                    |
| ----- | ----------------------------------------------------------- |
| 1     | [Processor werkt niet goed][CPU abnormal]                   |
| 2     | [Videokaart werkt niet goed][Graphic Card abnormal]         |
| 3     | [Geheugen werkt niet goed][Memory abnormal]                 |
| 4     | Processor en/of geheugen werken niet goed                   |
| 5     | Videokaart en/of geheugen werken niet goed                  |
| 6     | Processor, videokaart en/of geheugen werken niet goed       |
| 7     | [Opstartapparaat werkt niet goed][Boot up device abnormal]  |
| 8     | [Extern apparaat werkt niet goed][External device abnormal] |
| 9     | [Opstarten in het BIOS][Boot into the BIOS]                 |
| 10    | Opstarten in het systeem                                    |

[Official ASUS Documentation For Q-Code]:
  https://www.asus.com/support/faq/1043948/
[CPU abnormal]: https://www.asus.com/support/faq/1043948/#2
[Graphic Card abnormal]: https://www.asus.com/support/faq/1043948/#3
[Memory abnormal]: https://www.asus.com/support/faq/1043948/#4
[Boot up device abnormal]: https://www.asus.com/support/faq/1043948/#5
[External device abnormal]: https://www.asus.com/support/faq/1043948/#6
[Boot into the BIOS]: https://www.asus.com/support/faq/1043948/#7
