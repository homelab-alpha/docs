---
title: "Logs and Logrotate"
description:
  "Learn where Ubuntu and Fedora store their logs, how to read them with
  journalctl, and how to keep log files under control with journald limits and
  logrotate."
url: "linux/logs-and-logrotate"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Linux
series:
  - Linux
tags:
  - Logging
  - Logrotate
  - journald
  - rsyslog
  - Ubuntu
  - Fedora
  - System Administration
keywords:
  - Linux logs
  - logrotate
  - journalctl
  - journald
  - var log
  - Ubuntu logs
  - Fedora logs

weight: 7800

toc: true
katex: true
---

<br />

## Introduction

Logs tell you what a system did and why something failed. Without maintenance,
they also fill up a disk. This guide covers both sides for Ubuntu and Fedora:

- Where the logs are stored.
- How to read them.
- How to limit their size with journald and logrotate.

The examples are tested against Ubuntu 24.04 LTS and Fedora 43. Most commands
need `sudo`.

<br />

## How Logging Works

Modern Ubuntu and Fedora both use two layers:

- **systemd-journald**: collects messages from the kernel, services, and
  programs, and stores them in a binary journal. You read it with `journalctl`.
- **Text log files**: plain files in `/var/log/`. They are written by a syslog
  daemon (rsyslog) or directly by an application, such as a web server.

journald manages the size of its own journal. Text log files grow until
something rotates them; that is the job of logrotate.

<br />

## Ubuntu Versus Fedora

| Topic                | Ubuntu                                  | Fedora                                          |
| -------------------- | --------------------------------------- | ----------------------------------------------- |
| Syslog daemon        | rsyslog, installed by default           | none by default; journald only                  |
| General system log   | `/var/log/syslog`                       | `journalctl` (`/var/log/messages` with rsyslog) |
| Authentication log   | `/var/log/auth.log`                     | `journalctl` (`/var/log/secure` with rsyslog)   |
| Kernel log           | `/var/log/kern.log`                     | `journalctl -k`                                 |
| Package manager log  | `/var/log/apt/` and `/var/log/dpkg.log` | `/var/log/dnf5.log` (DNF5)                      |
| Persistent journal   | yes, in `/var/log/journal/`             | yes, in `/var/log/journal/`                     |
| Logrotate scheduler  | `logrotate.timer`                       | `logrotate.timer`                               |
| Logrotate state file | `/var/lib/logrotate/status`             | `/var/lib/logrotate/logrotate.status`           |
| Group to read logs   | `adm`                                   | `wheel` or `systemd-journal`                    |
| Extra access control | AppArmor                                | SELinux                                         |

<br />

{{% alert context="info" %}}
On Fedora, most classic files such as `/var/log/messages` and `/var/log/secure`
do not exist unless you install rsyslog. Use `journalctl` instead.
{{% /alert %}}

<br />

## Important Log Locations

### Ubuntu

| File                            | Content                             |
| ------------------------------- | ----------------------------------- |
| `/var/log/syslog`               | General system and service messages |
| `/var/log/auth.log`             | Logins, `sudo`, and SSH             |
| `/var/log/kern.log`             | Kernel messages                     |
| `/var/log/dpkg.log`             | Package installs and removals       |
| `/var/log/apt/history.log`      | APT commands and their results      |
| `/var/log/unattended-upgrades/` | Automatic security updates          |
| `/var/log/journal/`             | Persistent systemd journal (binary) |

<br />

### Fedora

| File                       | Content                                       |
| -------------------------- | --------------------------------------------- |
| `/var/log/journal/`        | Persistent systemd journal (binary)           |
| `/var/log/dnf5.log`        | DNF5 package transactions                     |
| `/var/log/audit/audit.log` | SELinux denials and audit events              |
| `/var/log/firewalld`       | firewalld messages, if enabled                |
| `/var/log/messages`        | General messages, only with rsyslog installed |
| `/var/log/secure`          | Authentication, only with rsyslog installed   |

<br />

## Reading Logs

### Text Files

```bash
# Show the last 50 lines
sudo tail -n 50 /var/log/syslog

# Follow a file live
sudo tail -f /var/log/auth.log

# Search a file, including rotated and compressed copies
sudo grep "Failed password" /var/log/auth.log
sudo zgrep "Failed password" /var/log/auth.log.*.gz

# Page through a file
sudo less /var/log/syslog
```

<br />

### The Journal With journalctl

`journalctl` works the same on Ubuntu and Fedora.

```bash
# Follow all new messages
journalctl -f

# Messages from the current boot
journalctl -b

# Messages from the previous boot
journalctl -b -1

# List all stored boots
journalctl --list-boots

# Messages from one service
journalctl -u ssh.service      # Ubuntu
journalctl -u sshd.service     # Fedora

# Only errors and worse
journalctl -p err -b

# A time range
journalctl --since "2026-11-24 08:00" --until "2026-11-24 12:00"
journalctl --since "1 hour ago"

# Kernel messages
journalctl -k

# Newest entries first, without the pager
journalctl -r --no-pager -n 100
```

To read the full journal without `sudo`, add your user to a log group and log in
again:

```bash
# Ubuntu
sudo usermod -aG adm "$USER"

# Fedora
sudo usermod -aG systemd-journal "$USER"
```

<br />

## Managing the Journal Size

By default, journald uses at most 10% of the file system that holds
`/var/log/journal/`, with a hard cap of 4 GiB. Check the current size:

```bash
journalctl --disk-usage
```

<br />

### Clean Up Once

```bash
# Keep at most 500 MB
sudo journalctl --vacuum-size=500M

# Remove entries older than 30 days
sudo journalctl --vacuum-time=30d
```

<br />

### Set a Permanent Limit

Use a drop-in file instead of editing `/etc/systemd/journald.conf`. A drop-in
survives package updates.

```bash
sudo mkdir -p /etc/systemd/journald.conf.d
sudo nano /etc/systemd/journald.conf.d/size_limit.conf
```

```ini
[Journal]
SystemMaxUse=500M
SystemKeepFree=1G
MaxRetentionSec=1month
```

Apply the change:

```bash
sudo systemctl restart systemd-journald
journalctl --disk-usage
```

<br />

## Logrotate

logrotate renames a log file, starts a new empty one, and removes or compresses
old copies. It runs once a day through a systemd timer on both distributions.

<br />

### Installation and Status

logrotate is installed by default on Ubuntu and Fedora. Check it and its timer:

```bash
# Ubuntu
dpkg -l logrotate

# Fedora
rpm -q logrotate

# Both
systemctl status logrotate.timer
systemctl list-timers logrotate.timer
```

Install it if it is missing:

```bash
# Ubuntu
sudo apt install logrotate

# Fedora
sudo dnf install logrotate
sudo systemctl enable --now logrotate.timer
```

<br />

### Configuration Files

| Path                  | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `/etc/logrotate.conf` | Global defaults                             |
| `/etc/logrotate.d/`   | One file per application or package         |
| State file            | Last rotation per log (see the table above) |

The global file sets the defaults and then loads `/etc/logrotate.d/`. A setting
in a file in `/etc/logrotate.d/` overrides the global default for that log.

Default global settings on Ubuntu:

```text
weekly
su root adm
rotate 4
create
#dateext
#compress
include /etc/logrotate.d
```

Default global settings on Fedora:

```text
weekly
rotate 4
create
dateext
#compress
include /etc/logrotate.d
```

The main difference: Fedora adds a date to rotated files (`messages-20261124`),
and Ubuntu adds a number (`syslog.1`, `syslog.2.gz`).

<br />

### Common Directives

| Directive                    | Meaning                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| `daily`, `weekly`, `monthly` | How often to rotate                                                 |
| `rotate 7`                   | Keep 7 old copies; older ones are removed                           |
| `maxsize 100M`               | Also rotate early when the file is larger than 100 MB               |
| `size 100M`                  | Rotate only on size, ignore the time interval                       |
| `maxage 30`                  | Remove rotated copies older than 30 days                            |
| `missingok`                  | No error if the log file does not exist                             |
| `notifempty`                 | Do not rotate an empty file                                         |
| `compress`                   | Compress old copies with gzip                                       |
| `delaycompress`              | Compress one rotation later; the newest copy stays plain            |
| `create 0640 user group`     | Create the new file with this mode, owner, and group                |
| `copytruncate`               | Copy the file, then empty it; for programs that keep it open        |
| `dateext`                    | Add a date to the rotated filename instead of a number              |
| `su user group`              | Rotate as this user; needed when the directory is not owned by root |
| `sharedscripts`              | Run the scripts once for all matching files                         |
| `postrotate` ... `endscript` | Commands to run after the rotation                                  |

<br />

### Example: Rotate an Application Log

This example rotates the logs of an application in `/var/log/myapp/`. It keeps
14 days and tells the service to reopen its log file.

```bash
sudo nano /etc/logrotate.d/myapp
```

```text
/var/log/myapp/*.log {
    daily
    rotate 14
    maxsize 100M
    missingok
    notifempty
    compress
    delaycompress
    create 0640 myapp myapp
    sharedscripts
    postrotate
        systemctl reload myapp.service > /dev/null 2>&1 || true
    endscript
}
```

If the application cannot reopen its log file on a signal or reload, replace
`create` and the `postrotate` block with `copytruncate`. A few lines written
during the copy can be lost.

<br />

### Example: Rotate Logs in a Home Directory

When the log directory is writable by a user other than root, logrotate refuses
to rotate it unless you set `su`:

```text
/home/username/scripts/logs/*.log {
    su username username
    weekly
    rotate 8
    missingok
    notifempty
    compress
}
```

<br />

### Test a Configuration

Always test a new file before you rely on it.

```bash
# Dry run: show what would happen, change nothing
sudo logrotate -d /etc/logrotate.d/myapp

# Force a rotation now, with verbose output
sudo logrotate -vf /etc/logrotate.d/myapp

# Run the full configuration, as the timer does
sudo logrotate -v /etc/logrotate.conf

# Check the last run of the timer
journalctl -u logrotate.service -n 50
```

The filenames in the state file show when each log was last rotated:

```bash
sudo cat /var/lib/logrotate/status             # Ubuntu
sudo cat /var/lib/logrotate/logrotate.status   # Fedora
```

<br />

## Fedora: SELinux and Custom Log Paths

On Fedora, SELinux allows logrotate to work only on files with a log label, such
as `var_log_t`. Files in `/var/log/` get that label automatically. Logs in
another directory, for example `/srv/myapp/logs/`, need the label first:

```bash
sudo semanage fcontext -a -t var_log_t "/srv/myapp/logs(/.*)?"
sudo restorecon -Rv /srv/myapp/logs
```

Check for denials when a rotation fails without a clear reason:

```bash
sudo ausearch -m AVC -ts recent -c logrotate
```

<br />

## Ubuntu: rsyslog Files

On Ubuntu, rsyslog writes `/var/log/syslog`, `auth.log`, and `kern.log`. Its
rotation rules are in `/etc/logrotate.d/rsyslog`. To keep these logs longer,
change `rotate` in that file. Package updates may ask you whether to keep your
changed version.

<br />

## Optional: rsyslog on Fedora

If you prefer classic text files on Fedora, install rsyslog. It ships its own
logrotate file in `/etc/logrotate.d/rsyslog`.

```bash
sudo dnf install rsyslog
sudo systemctl enable --now rsyslog
```

<br />

## Troubleshooting

| Problem                                                                 | Solution                                                         |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `error: skipping ... because parent directory has insecure permissions` | Add `su user group` to the block                                 |
| Log is not rotated                                                      | Run `logrotate -d`; check `notifempty`, size, and the state file |
| Service keeps writing to the old file                                   | Add a `postrotate` reload, or use `copytruncate`                 |
| Disk still full after rotation                                          | A process holds a deleted file open; check with `sudo lsof +L1`  |
| Rotation fails on Fedora only                                           | Check the SELinux label and `ausearch -m AVC`                    |
| Journal uses too much space                                             | Set `SystemMaxUse` in a journald drop-in                         |

<br />

## Best Practices

1. **Limit the journal**: Set `SystemMaxUse` so the journal cannot fill the
   disk.
2. **Use drop-in files**: Put your own logrotate rules in `/etc/logrotate.d/`
   and journald settings in `/etc/systemd/journald.conf.d/`.
3. **Combine time and size**: Use `maxsize` next to `daily` or `weekly` for logs
   that can grow fast.
4. **Compress old logs**: Use `compress` with `delaycompress` to save space.
5. **Test first**: Run `logrotate -d` after every change.
6. **Protect log files**: Use `create` with a strict mode such as `0640`, as
   logs can contain sensitive data.

<br />

## Conclusion

Ubuntu and Fedora both rely on journald for most logging and on logrotate for
text log files. Ubuntu adds classic rsyslog files, while Fedora keeps almost
everything in the journal and adds SELinux checks. For more detail, see
`man journalctl`, `man journald.conf`, and `man logrotate`.
