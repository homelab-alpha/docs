---
title: "Vim Crash Course"
description:
  "Jumpstart your Vim journey with this crash course, covering essential
  commands and modes for efficient text editing."
url: "back-to-basics/vim/crash-course"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Vim
tags:
  - Vim
  - text editor
  - productivity
  - text editing
  - crash course
keywords:
  - Vim
  - text editor
  - productivity
  - text editing
  - Vim modes
  - Vim navigation
  - Vim editing
  - Vim commands
  - Vim customization
  - Vim resources
  - Vim tutorial
  - Vim basics
  - Vim features

weight: 2800

toc: true
katex: true
---

<br />

## Introduction to Vim

Vim, short for `Vi IMproved`, is an enhanced version of the classic Unix text
editor, Vi. Highly customizable, Vim offers features tailored for efficient text
editing.

<br />

## Modes in Vim

Vim operates in different modes, each with specific functions:

1. **Normal Mode**: Default for navigation and executing commands.
2. **Insert Mode**: For inserting and editing text.
3. **Visual Mode**: Selecting and manipulating text visually.
4. **Command-Line Mode**: Entering Vim commands.

<br />

## Basic Navigation

- `h`, `j`, `k`, `l`: Move left, down, up, and right respectively.
- `w`: Move to the beginning of the next word.
- `b`: Move to the beginning of the previous word.
- `0`: Move to the beginning of the current line.
- `$`: Move to the end of the current line.
- `gg`: Move to the beginning of the file.
- `G`: Move to the end of the file.
- `Ctrl + f`: Scroll down one page.
- `Ctrl + b`: Scroll up one page.

<br />

## Editing Text

- `i`: Enter Insert Mode before the cursor.
- `a`: Enter Insert Mode after the cursor.
- `o`: Open a new line below and enter Insert Mode.
- `O`: Open a new line above and enter Insert Mode.
- `x`: Delete the character under the cursor.
- `dd`: Delete the current line.
- `yy`: Yank (copy) the current line.
- `p`: Paste yanked or deleted text after the cursor.
- `u`: Undo the last action.
- `Ctrl + r`: Redo the last undone action.

<br />

## Visual Mode

- `v`: Select text character by character.
- `V`: Select entire lines.
- `Ctrl + v`: Select rectangular blocks of text.

<br />

## Command-Line Mode

- `:w`: Save changes.
- `:q`: Quit Vim.
- `:q!`: Quit Vim without saving changes.
- `:wq` or `:x`: Save changes and quit.
- `:e [file]`: Open a file for editing.
- `:set nu`: Show line numbers.
- `:set nonu`: Hide line numbers.

<br />

## Advanced Features

- **Search**: `/` followed by the search term. Press `n` for next occurrence.
- **Substitution**: `:%s/old/new/g` to replace all "old" with "new".
- **Buffers**: `:ls` to list open buffers, `:b [number]` to switch buffer.
- **Tabs**: `:tabnew [file]` to open a file in a new tab, `gt` to switch tabs.

<br />

## Customization

- **.vimrc**: Customize settings and mappings in Vim configuration file.

<br />

## Resources for Further Learning

- **Vimtutor**: Run `vimtutor` in the terminal for built-in Vim tutorial.
- **Online Guides and Tutorials**: Explore various online resources for
  comprehensive Vim guides.

<br />

## Conclusion

Vim, though initially challenging, offers unparalleled efficiency once mastered.
Practice regularly and explore its features to unleash its full potential. Happy
editing!
