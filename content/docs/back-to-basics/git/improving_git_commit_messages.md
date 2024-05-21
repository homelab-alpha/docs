---
title: "Commit Message Guidelines"
description:
  "Guidelines for writing clear and consistent commit messages, categorized by
  type of change, to enhance collaboration and code management in software
  development."
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

weight: 103004

toc: true
katex: true
---

<br />

## Introduction

In software development, maintaining a clear and consistent style for commit
messages is essential for effective collaboration and code management. Below are
guidelines for different categories of commit messages, each with a specific
purpose and format.

<br />

## Commit Message Categories

## New file

Used when adding a new file to the project. Mention the name and purpose of the
new file.

```text
new file: Routes auth.js
```

<br />

## Modified

Used when making modifications to an existing file. Specify the file being
modified.

```text
modified: Models user.js
```

<br />

## Add

Used when adding new functionality, files, or resources to the project for
example:

```text
add: User authentication feature auth.js
```

<br />

## Fix

Used when fixing a bug, error, or issue for example:

```text
fix: Issue with login form validation login.js
```

<br />

## Update

Used when updating existing functionality, documentation, dependencies, or
resources for example:

```text
update: Dependencies to latest versions package.json
```

<br />

## Remove

Used when removing code, files, or functionality from the project for example:

```text
remove: Deprecated API endpoint api.js
```

<br />

## Refactor

Used when restructuring existing code without changing its functionality for
example:

```text
refactor: User authentication logic for readability auth.js
```

<br />

## Optimize

Used when improving performance, efficiency, or code quality without changing
the functionality for example:

```text
optimize: Database queries for faster response times database.js
```

<br />

## Cleanup

Used when performing code cleanup tasks, such as removing unused variables or
imports for example:

```text
cleanup: Unused CSS stylesheets styles.css
```

<br />

## Fix typo

Used when correcting a spelling or typographical error in the code or
documentation for example:

```text
fix: Typo in README.md
```

<br />

## Test

Used when adding, modifying, or running tests for the codebase for example:

```text
add: Unit tests for user authentication module auth.test.js
```

<br />

## Docs

Used when adding, updating, or improving documentation for example:

```text
update: Installation instructions in README.md
```

<br />

## Style

Used when making changes to the formatting, indentation, or style of the code
without changing the functionality for example:

```text
standardize: Code formatting using Prettier app.js
```

<br />

## Chore

Used for general tasks that do not directly affect the codebase, such as
updating configuration files or performing maintenance tasks for example:

```text
update: Development environment setup script setup.sh
```

<br />

## Localization/Internationalization

Used when adding support for multiple languages in the project for example:

```text
add: Localization support for Spanish language es.json
```

<br />

## Accessibility

Used when making improvements to the project's accessibility for example:

```text
update: Accessibility improvements for screen readers
```

<br />

## Security

Used when implementing changes to enhance the security of the project for
example:

```text
update: Security patches for XSS vulnerability
```

<br />

## Performance Testing

Used when conducting performance tests or implementing optimizations based on
test results for example:

```text
optimize: API response time based on performance test results
```

<br />

## Infrastructure

Used for changes in the infrastructure, such as server configurations or cloud
provider settings for example:

```text
update: AWS infrastructure configurations for scalability
```

<br />

## Dependencies

Used when updating or changing dependencies along with the reason for the change
for example:

```text
update: Upgraded React library to address security vulnerabilities
```
