---
title: "Richtlijnen voor commitberichten"
description:
  "Richtlijnen om duidelijke en consistente commitberichten te schrijven,
  ingedeeld naar soort wijziging, voor een betere samenwerking en een beter
  beheer van code bij softwareontwikkeling."
url: "back-to-basics/git/commit-messages"
aliases: ""
icon: "commit"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Git
tags:
  - Git
  - version control
  - commit messages
  - software development
  - collaboration
  - code management
keywords:
  - commit message guidelines
  - commit message categories
  - new file
  - modified
  - add
  - fix
  - update
  - remove
  - refactor
  - optimize
  - cleanup
  - fix typo
  - test
  - docs
  - style
  - chore
  - localization
  - internationalization
  - accessibility
  - security
  - performance testing
  - infrastructure
  - dependencies

weight: 2402

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Inleiding {#introduction}

Bij softwareontwikkeling is een duidelijke en consistente stijl voor
commitberichten essentieel om goed samen te werken en code te beheren. Hieronder
staan richtlijnen voor verschillende soorten commitberichten, elk met een eigen
doel en vorm.

## Afspraken voor commitberichten {#commit-message-conventions}

### Nieuwe functies of bestanden toevoegen {#addition-of-new-features-or-files}

```git
Added: Added user authentication module
```

```git
New File: Added README.md
```

### Functies of bestanden verwijderen {#removal-of-features-or-files}

```git
Deleted: Deleted old API endpoints
```

```git
Remove: Dropped support for deprecated API version
```

## Wijzigingen of verbeteringen {#modifications-or-improvements}

### Kleine aanpassingen of verbeteringen {#minor-adjustments-or-enhancements}

```git
Adjusted: Margin in header section for better alignment
```

```git
Modified: Updated CSS styles for mobile responsiveness
```

```git
Patch: Corrected typo in variable name
```

### Verbeteringen van prestaties of efficiëntie {#performance-or-efficiency-improvements}

```git
Optimize: Reduced image loading times by using compressed formats
```

### Code herstructureren zonder de werking te wijzigen {#code-refactoring-without-changing-functionality}

```git
Refactor: Reorganized user service methods for better readability
```

### Code of documentatie consistent maken {#making-code-or-documentation-consistent}

```git
Standardize: Applied consistent naming conventions across modules
```

### Wijzigingen in de codestijl (zonder invloed op de werking) {#code-style-changes-without-impacting-functionality}

```git
Style: Formatted code according to ESLint rules
```

## Bugfixes en kritieke oplossingen {#bugfixes-and-critical-solutions}

### Een bepaalde bug oplossen {#fixing-a-specific-bug}

```git
Bugfix: Corrected error handling in login form
```

```git
Fix: Resolved issue with user profile loading
```

### Dringende oplossing voor een kritiek probleem in productie {#urgent-fix-for-a-critical-production-issue}

```git
Hotfix: Fixed production crash when loading large datasets
```

### Een snelle bugfix die nog niet volledig is getest {#a-quick-bugfix-that-has-not-been-fully-tested}

```git
Coldfix: Temporary fix for navbar rendering issue
```

## Beveiliging en tests {#security-and-tests}

### Beveiligingsproblemen oplossen {#resolving-security-issues}

```git
Security: Fixed vulnerability in user authentication
```

### Testgevallen toevoegen of wijzigen {#adding-or-modifying-test-cases}

```git
Test: Added unit tests for login component
```

## Onderhoud en documentatie {#maintenance-and-documentation}

### Onderhoudstaken zonder invloed op de werking {#maintenance-tasks-without-functional-impact}

```git
Chore: Updated dependencies and cleaned up logs
```

### Code opruimen zonder de werking te wijzigen {#code-cleanup-without-functional-changes}

```git
Cleanup: Removed unused variables and redundant code
```

### Documentatie of commentaar toevoegen {#adding-documentation-or-comments}

```git
Note: Added explanation for caching mechanism in comments
```

```git
Docs: Updated API documentation with new endpoints
```

## Versiebeheer en terugdraaien {#version-control-and-reversions}

### Een versie verhogen of een afhankelijkheid bijwerken {#bumping-a-version-or-updating-a-dependency}

```git
Bump: Bumped version from 2.0.0 to 2.0.1
```

### Teruggaan naar een eerdere stabiele versie {#reverting-to-a-previous-stable-version}

```git
Roll Back: Reverted to version 1.4.0 due to instability
```

### Een commit ongedaan maken of terugdraaien {#undoing-or-reversing-a-commit}

```git
Revert: Reverted commit 123456a
```

```git
Reversed: Undid changes from commit 123456a
```

## Voorbereiden en klaarzetten {#preparation-and-staging}

### Wijzigingen voorbereiden voor een commit {#preparing-changes-for-a-commit}

```git
Staged: Prepared updates for new release
```
