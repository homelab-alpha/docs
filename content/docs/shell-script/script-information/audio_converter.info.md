---
title: "audio_converter.info"
description:
  "A shell script for converting audio files in various formats (m4a, mp3, wma)
  to MP3 format with specified bitrate, sampling rate, and channel
  configuration."
url: "shell-script/script-info/audio-converter"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Script Information
tags:
  - audio conversion
  - shell script
  - mp3 conversion
  - avconv
  - ffmpeg
  - audio tools
  - linux
  - command line
  - scripting
keywords:
  - audio converter
  - convert m4a to mp3
  - convert wma to mp3
  - shell script audio conversion
  - ffmpeg mp3 conversion
  - avconv audio conversion
  - linux audio tools
  - command line audio converter
  - automate audio conversion

weight: 6100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`audio_converter.sh`, authored by GJS (homelab-alpha), and its purpose is to
convert audio files in various formats (m4a, mp3, wma) to MP3 format with
specific settings for bitrate, sampling rate, and channel configuration.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `audio_converter.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.0.1
- **Description**: This script converts audio files in formats such as m4a, mp3,
  and wma to MP3 format with a bitrate of 128k, a sampling rate of 44.1kHz, and
  2-channel audio.
- **Dependencies**: `avconv`, `ffmpeg`
- **RAW Script**: [audio_converter.sh]

<br />

## Setup

1. **Enable Case-Insensitive Matching**:

   ```bash
   shopt -s nocasematch
   ```

   This allows the script to match file extensions without regard to case (e.g.,
   `.MP3` and `.mp3` are treated the same).

2. **Define the Working Directory**:

   ```bash
   working_directory="./mp3_converted"
   ```

   This sets the directory where the converted MP3 files will be stored.

3. **Check and Create the Directory**:
   ```bash
   if [ ! -d "$working_directory" ]; then
     echo "Convert directory does not exist: $working_directory"
     mkdir -p "$working_directory"
     echo "Convert directory created: $working_directory"
   fi
   ```
   This block checks if the specified directory exists. If it doesn't, it
   creates the directory.

<br />

## File Conversion

4. **Loop Through Files in the Current Directory**:

   ```bash
   for i in *; do
   ```

   This loop iterates over each file in the current directory.

5. **Case Statement for File Types**:

   ```bash
   case $i in
   *.mp3)
   ```

   This part of the script handles files based on their extensions. Let's break
   down each case:

   - **MP3 Files**:

     ```bash
     avconv -analyzeduration 999999999 -map_metadata 0 -i "$i" -vn -acodec libmp3lame -ac 2 -ab 128k -ar 44100 "$working_directory/$(basename "$i" .mp3).mp3"
     echo "$i converted to MP3"
     ```

     This converts MP3 files using `avconv` with specific parameters: 128k
     bitrate, 44.1kHz sampling rate, and 2 channels. The metadata is preserved,
     and the output file is saved in the specified directory.

   - **M4A Files**:

     ```bash
     ffmpeg -i "$i" -n -acodec libmp3lame -ab 128k "$working_directory/$(basename "$i" .m4a).mp3"
     echo "$i converted to MP3"
     ```

     This converts M4A files using `ffmpeg` with similar settings. The `-n`
     option prevents overwriting existing files.

   - **WMA Files**:

     ```bash
     avconv -analyzeduration 999999999 -map_metadata 0 -i "$i" -vn -acodec libmp3lame -ac 2 -ab 128k -ar 44100 "$working_directory/$(basename "$i" .wma).mp3"
     echo "$i converted to MP3"
     ```

     This converts WMA files using `avconv` with the same parameters as for MP3
     files.

   - **Unrecognized Files**:
     ```bash
     echo "Skipping unrecognized file: $i"
     ```
     If the file doesn't match any of the recognized extensions, the script
     skips it and prints a message.

<br />

## Cleanup

6. **Disable Case-Insensitive Matching**:

   ```bash
   shopt -u nocasematch
   ```

   This reverts the case-matching setting to its original state.

7. **Exit the Script**:
   ```bash
   exit 0
   ```
   This ends the script.

<br />

## Conclusion

The `audio_converter.sh` script is designed to automate the conversion of
various audio file formats to MP3 with consistent settings. It ensures the
converted files are stored in a designated directory, handles errors gracefully,
and avoids overwriting existing files.

This script effectively converts various audio formats to MP3 while maintaining
the original directory structure and handling errors gracefully.

[audio_converter.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/audio_converter.sh
