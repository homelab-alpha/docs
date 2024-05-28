---
title: "Advanced Git Guide"
description:
  "Enhance your Git skills with advanced techniques and workflows. Learn how to
  branch, merge, rebase, stash, and rewrite history effectively."
url: "back-to-basics/git/advanced-guide"
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
  - Git
  - Version Control
  - Branching
  - Merging
  - Rebasing
  - Stashing
  - History Rewriting
  - Git Hooks
  - Git Workflows
keywords:
  - Advanced Git commands
  - Git branching
  - Git merging
  - Git rebasing
  - Git stashing
  - Git history rewriting
  - Git hooks
  - Git workflows

weight: 103002

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

## Welcome to the Advanced Git Guide

In this guide, we'll explore advanced Git techniques and commands to elevate
your version control skills. Whether you're collaborating on a large project or
managing complex development workflows, mastering these advanced Git concepts
will make you a more efficient and effective developer.

We assume you have a basic understanding of Git and are familiar with common
commands like `git clone`, `git add`, `git commit`, and `git push`. Now, let's
dive deeper into the world of Git and uncover its hidden treasures.

Let's get started!

<br />

## Branching and Merging

### Create a new branch

```bash
git checkout -b new-feature
```

<br />

### Switch between branches

```bash
git checkout master  # Switch to master branch
git checkout new-feature  # Switch to new-feature branch
```

<br />

### Merge branches

```bash
git checkout master  # Switch to the branch you want to merge into
git merge new-feature  # Merge new-feature branch into master
```

<br />

### Resolve merge conflicts

When there are merge conflicts, Git will indicate which files have conflicts.
Open those files, resolve the conflicts manually, then add the changes and
commit them.

<br />

### Delete a branch

```bash
git branch -d new-feature  # Deletes the branch if changes are merged
git branch -D new-feature  # Forcefully deletes the branch
```

<br />

## Rebasing

### Rebase your branch onto another branch

```bash
git checkout feature-branch
git rebase master
```

<br />

### Squash commits during rebase

During the rebase process, you can squash multiple commits into one for cleaner
history.

```bash
git rebase -i HEAD~3  # Squash last 3 commits
```

<br />

## Stashing

### Stash changes

```bash
git stash save "Work in progress"  # Stash changes with a message
```

<br />

### Apply stashed changes

```bash
git stash apply stash@{0}  # Apply the first stash
```

<br />

### List stashed changes

```bash
git stash list  # List all stashed changes
```

<br />

### Drop stashed changes

```bash
git stash drop stash@{0}  # Drop the first stash
```

<br />

## Rewriting History

### Amend the last commit

```bash
git commit --amend
```

<br />

### Interactive rebase to edit, squash, or reorder commits

```bash
git rebase -i HEAD~3  # Interactively rebase last 3 commits
```

<br />

## Git Hooks

### Pre-commit hook

Automate checks before committing changes, like linting or running tests.

```bash
# Create a file named pre-commit in .git/hooks/ and make it executable
```

<br />

### Post-merge hook

Automate tasks after a merge, like updating dependencies or generating
documentation.

```bash
# Create a file named post-merge in .git/hooks/ and make it executable
```

<br />

## Git Workflows

### Git Flow

A branching model for larger projects with multiple developers.

```bash
git flow feature start new-feature  # Start a new feature
git flow feature finish new-feature  # Finish a feature
```

<br />

### GitHub Flow

A simpler workflow focusing on pull requests for collaboration.

```bash
# Create a new branch, make changes, push branch, create a pull request, review, merge
```

<br />

## Conclusion

These advanced Git commands and workflows will enhance your productivity and
help you manage complex development scenarios more effectively. Experiment with
them in your projects to become a Git expert. Remember, with great power comes
great responsibility, so use these commands wisely!
