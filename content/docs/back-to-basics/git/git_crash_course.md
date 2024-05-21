---
title: "Git Crash Course"
description:
  "Learn Git from scratch with this comprehensive crash course. Master basic and
  advanced commands, manage repositories, resolve conflicts, and more."
url: "back-to-basics/git/crash-course"
aliases: ""
icon: "bug_report"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Git
tags:
  - version control
  - collaboration
  - repository management
  - Git commands
  - Git workflow
keywords:
  - Git crash course
  - Git basics
  - Git commands
  - Git workflow
  - version control system

weight: 103001

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this
document. Therefore, it's advisable to treat the information here with caution
and verify it if necessary.
{{% /alert %}}

<br />

## Introduction to Git: A Beginner's Guide

Welcome to the Git crash course! Git is a powerful version control system used
by developers worldwide to manage and track changes to their codebase
efficiently. Whether you're a seasoned developer or just starting your coding
journey, understanding Git is essential for collaborating on projects and
maintaining a well-organized codebase.

In this crash course, we'll cover everything you need to know to get started
with Git, from setting up your environment to mastering basic and advanced
commands. By the end, you'll have the knowledge and confidence to leverage Git
for your projects effectively.

Let's dive in and explore the world of version control with Git!

<br />

## Setting Up Git

- Install Git on your system if you haven't already.
- Configure your username and email:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

<br />

### Initializing a Repository

- Create a new repository:
  ```bash
  git init my_project
  cd my_project
  ```

<br />

### Basic Commands

- Check the status of your repository:
  ```bash
  git status
  ```
- Add changes to the staging area:
  ```bash
  git add <file>
  ```
- Commit changes to the repository:
  ```bash
  git commit -m "Commit message"
  ```
- View commit history:
  ```bash
  git log
  ```

<br />

### Working with Branches

- Create a new branch:
  ```bash
  git branch new_feature
  ```
- Switch to a different branch:
  ```bash
  git checkout new_feature
  ```
- Merge branches:
  ```bash
  git merge <branch_name>
  ```

<br />

### Remote Repositories

- Add a remote repository:
  ```bash
  git remote add origin <remote_url>
  ```
- Push changes to a remote repository:
  ```bash
  git push -u origin <branch_name>
  ```
- Clone a repository:
  ```bash
  git clone <repository_url>
  ```

<br />

### Resolving Conflicts

- When merging branches, conflicts may arise. Resolve conflicts manually in the
  affected files, then:
  ```bash
  git add <resolved_file>
  git commit -m "Resolved conflicts"
  ```

<br />

### Undoing Changes

- Discard changes in the working directory:
  ```bash
  git checkout -- <file>
  ```
- Undo the last commit:
  ```bash
  git reset HEAD~1
  ```

<br />

### Miscellaneous

- Create a .gitignore file to specify files to ignore:

  ```bash
  touch .gitignore
  echo "file_to_ignore.txt" >> .gitignore
  ```

- View the difference between files:

  ```bash
  git diff <file>
  ```

<br />

## Example Workflow

### Initialize a repository

```bash
git init my_project
cd my_project
```

<br />

### Create a new file and add some content

Add the file to the staging area:

```bash
git add new_file.txt
```

<br />

### Commit the changes

```bash
git commit -m "Added: new_file.txt"
```

<br />

### Create a new branch for a new feature

```bash
git branch new_feature
```

<br />

### Switch to the new branch

```bash
git checkout new_feature
```

<br />

### Make changes, add them, and commit

```bash
git add modified_file.txt
git commit -m "Implemented new feature"
```

<br />

### Switch back to the main branch and merge the new feature

```bash
git checkout main
git merge new_feature
```

<br />

### Resolve any conflicts if they occur

Push changes to a remote repository

```bash
git remote add origin <repository_url>
git push -u origin main
```

This crash course covers the fundamental concepts and commands in Git to get you
started. Practice these commands to become comfortable with Git's workflow.
