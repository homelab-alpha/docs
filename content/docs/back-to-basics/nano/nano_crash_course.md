---
title: "Nano Crash Course"
description:
  "Quickly get up to speed with Nano, covering basic navigation, editing,
  saving, and more."
url: "back-to-basics/nano/crash-course"
icon: "bug_report"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - nano – Text editor
tags:
  - Nano
  - text editor
  - crash course
  - basic navigation
  - editing
  - saving
  - commands
keywords:
  - Nano
  - text editor
  - crash course
  - basic navigation
  - editing
  - saving
  - Nano commands
  - Nano shortcuts
  - Nano customization
  - text editing basics
  - Nano features
  - Nano tutorial

weight: 105001

toc: true
katex: true
---

<br />

{{% alert context="warning" %}}
**Caution** - This documentation is in progress
{{% /alert %}}

<br />

## Introduction to Nano – The Text Editor

To open Nano, simply type `nano` followed by the name of the file you want to
edit. If the file doesn't exist, Nano will create a new one with that name.

```bash
nano filename.txt
```

<br />

## Basic Navigation

Use the arrow keys to move the cursor around the text. Page up and page down
keys move up and down a page at a time.

- Use `Ctrl + A` moves to the beginning of the line.
- Use `Ctrl + E` moves to the end of the line.
- Use `Ctrl + Y` scrolls up one line.
- Use `Ctrl + V` scrolls down one line.

<br />

## Editing Text

Type directly into the editor to add or modify text. Use the backspace key to
delete characters. To delete entire lines, use `Ctrl + K` to cut the line. Use
`Ctrl + U` to paste the cut line.

<br />

## Saving and Exiting

To save your changes, press `Ctrl + O` (WriteOut). You'll be prompted to confirm
the filename. To exit Nano, press `Ctrl + X` (Exit). If you haven't saved your
changes, Nano will prompt you to save before exiting.

<br />

## Searching

Press `Ctrl + W` to search for text within the file. Type the word or phrase you
want to search for and press Enter. Use `Ctrl + W` again to find the next
occurrence.

<br />

## Other Useful Commands

Use `Ctrl + G` displays the help menu with all available commands. Use\
`Ctrl + C` shows the current cursor position. Use `Ctrl + \_` (underscore)
enables or disables soft wrapping of long lines.

<br />

## Customization

Nano can be customized by creating or modifying a configuration file called\
`.nanorc` in your home directory. You can adjust settings like syntax
highlighting, key bindings, and more.
