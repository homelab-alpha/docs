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

weight: 2300

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

## Commit Message Conventions

### Addition of New Features or Files

```git
Added: Added user authentication module
```

```git
New File: Added README.md
```

<br />

### Removal of Features or Files

```git
Deleted: Deleted old API endpoints
```

```git
Remove: Dropped support for deprecated API version
```

<br />

## Modifications or Improvements

### Minor Adjustments or Enhancements

```git
Adjusted: Margin in header section for better alignment
```

```git
Modified: Updated CSS styles for mobile responsiveness
```

```git
Patch: Corrected typo in variable name
```

<br />

### Performance or Efficiency Improvements

```git
Optimize: Reduced image loading times by using compressed formats
```

<br />

### Code Refactoring Without Changing Functionality

```git
Refactor: Reorganized user service methods for better readability
```

<br />

### Making Code or Documentation Consistent

```git
Standardize: Applied consistent naming conventions across modules
```

<br />

### Code Style Changes (Without Impacting Functionality)

```git
Style: Formatted code according to ESLint rules
```

<br />

## Bugfixes and Critical Solutions

### Fixing a Specific Bug

```git
Bugfix: Corrected error handling in login form
```

```git
Fix: Resolved issue with user profile loading
```

<br />

### Urgent Fix for a Critical Production Issue

```git
Hotfix: Fixed production crash when loading large datasets
```

<br />

### A Quick Bugfix That Has Not Been Fully Tested

```git
Coldfix: Temporary fix for navbar rendering issue
```

<br />

## Security and Tests

### Resolving Security Issues

```git
Security: Fixed vulnerability in user authentication
```

<br />

### Adding or Modifying Test Cases

```git
Test: Added unit tests for login component
```

<br />

## Maintenance and Documentation

### Maintenance Tasks Without Functional Impact

```git
Chore: Updated dependencies and cleaned up logs
```

<br />

### Code Cleanup Without Functional Changes

```git
Cleanup: Removed unused variables and redundant code
```

<br />

### Adding Documentation or Comments

```git
Note: Added explanation for caching mechanism in comments
```

```git
Docs: Updated API documentation with new endpoints
```

<br />

## Version Control and Reversions

### Bumping a Version or Updating a Dependency

```git
Bump: Bumped version from 2.0.0 to 2.0.1
```

<br />

### Reverting to a Previous Stable Version

```git
Roll Back: Reverted to version 1.4.0 due to instability
```

<br />

### Undoing or Reversing a Commit

```git
Revert: Reverted commit 123456a
```

```git
Reversed: Undid changes from commit 123456a
```

<br />

## Preparation and Staging

### Preparing Changes for a Commit

```git
Staged: Prepared updates for new release
```
