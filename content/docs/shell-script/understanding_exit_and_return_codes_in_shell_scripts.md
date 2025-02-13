---
title: "Understanding Exit and Return Codes in Shell Scripts"
description:
  "A comprehensive guide to exit and return codes in shell scripts. Learn what
  these codes mean, their common values, and how to use them effectively in your
  scripts."
url: "shell-script/understanding-exit-and-return-codes-in-shell-scripts"
aliases: ""
icon: "overview"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Shell Script
tags:
  - Shell Scripting
  - Exit Codes
  - Return Codes
  - Script Debugging
keywords:
  - shell script exit codes
  - return codes in shell scripting
  - handling errors in shell scripts
  - script status codes

weight: 9903

toc: true
katex: true
---

<br />

## Introduction

Exit codes and return codes are crucial for managing execution flow and error
handling within shell scripts. They indicate whether commands and functions
succeeded or failed, providing essential feedback for debugging and process
control. This guide explores common exit and return codes, their meanings, and
practical examples of how to use them effectively in your scripts.

<br />

## Exit Codes in Shell Scripts

Exit codes signal the status of a script after it has finished running. They
help determine whether the script executed successfully or encountered an error.
Below are some common exit codes and their meanings:

| **Exit Code** | **Meaning**                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| **0**         | Successfully executed. The command or script did not produce any errors.                              |
| **1**         | General error. An issue occurred during execution.                                                    |
| **2**         | Misuse of shell built-in commands.                                                                    |
| **126**       | The command invoked cannot be executed (e.g., due to lack of execute permissions).                    |
| **127**       | The command was not found.                                                                            |
| **128**       | Invalid exit argument.                                                                                |
| **128 + N**   | Fatal error due to signal N (where N is a number representing the signal, e.g., `137` for `SIGKILL`). |
| **130**       | Canceled by Ctrl+C (SIGINT).                                                                          |
| **143**       | Terminated by SIGTERM (e.g., a request to terminate).                                                 |
| **255**       | Exit status out of range or unspecified error.                                                        |

<br />

### Example of Using Exit Codes

```bash
#!/bin/bash

# Check if the file "config.txt" exists
if [ ! -f config.txt ]; then
  echo "Error: The file 'config.txt' does not exist."
  exit 66  # Custom code for file not found
fi

echo "The file 'config.txt' has been found. Proceeding with processing."

# Further actions can be performed here

exit 0  # Successfully executed
```

<br />

## Return Codes in Shell Scripts

Return codes are used within shell functions to indicate the function's status.
These are set using the `return` statement and can be checked by the script
after calling the function. Below are common return codes and their meanings:

| **Return Code** | **Meaning**                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| **0**           | Successfully executed. The function worked without errors.                                            |
| **1**           | General error. An issue occurred during the execution of the function.                                |
| **2**           | Misuse of function parameters or arguments.                                                           |
| **64**          | Error in using arguments (e.g., incorrect arguments or a missing parameter).                          |
| **65**          | Data format error.                                                                                    |
| **66**          | Cannot open input file.                                                                               |
| **67**          | Cannot open output file.                                                                              |
| **68**          | Cannot open temporary file.                                                                           |
| **69**          | Error in function options or settings.                                                                |
| **70**          | System error (e.g., incorrect system status).                                                         |
| **71**          | File error (e.g., file not found).                                                                    |
| **72**          | Memory error.                                                                                         |
| **73**          | Permission denied (e.g., insufficient permissions).                                                   |
| **74**          | Resource temporarily unavailable.                                                                     |
| **75**          | Resource exhausted.                                                                                   |
| **76**          | File not found.                                                                                       |
| **77**          | Command or function not found.                                                                        |
| **78**          | Command or function failed.                                                                           |
| **79**          | Timeout (e.g., during a long operation).                                                              |
| **80**          | Operation aborted by an external factor.                                                              |
| **126**         | The function cannot be executed (e.g., due to lack of execute permissions).                           |
| **127**         | The function or command was not found.                                                                |
| **128**         | Invalid arguments for the return code.                                                                |
| **128 + N**     | Fatal error due to signal N (where N is a number representing the signal, e.g., `137` for `SIGKILL`). |
| **130**         | Canceled by Ctrl+C (SIGINT).                                                                          |
| **143**         | Terminated by SIGTERM (e.g., a request to terminate).                                                 |
| **255**         | Return status out of range or unspecified error.                                                      |

<br />

### Example of Using Return Codes

```bash
#!/bin/bash

# Function to check a file
check_file() {
  local file="$1"

  if [ -z "$file" ]; then
    echo "Error: No file provided."
    return 2  # Misuse of function parameters
  fi

  if [ ! -f "$file" ]; then
    echo "Error: The file '$file' does not exist."
    return 66  # Cannot open input file
  fi

  echo "The file '$file' has been found."
  return 0  # Successfully executed
}

# Call the function
check_file "$1"
# Save the return code of the function
ret_code=$?

# Check the return code
if [ $ret_code -ne 0 ]; then
  echo "The script terminated with an error. Return code: $ret_code"
  exit $ret_code
fi

echo "Proceeding with processing."

exit 0  # Successfully executed
```

<br />

## Similarities and Differences between Exit Codes and Return Codes

### Similarities

- **Numeric Values**: Both exit and return codes are numeric and indicate the
  status of execution, whether successful or with errors.

<br />

### Differences

1. **Context of Use**:

   - **Exit Code**: Indicates the status of an entire script after execution. An
     exit code of `0` generally indicates success.
   - **Return Code**: Used within shell functions to indicate the status of the
     function. The return code is set by the function and checked by the script.

2. **Usage in Shell Script**:
   - **Exit Code**:
     - Set with `exit <code>` at the end of a script.
     - Example: `exit 1` indicates that the script terminated with an error.
   - **Return Code**:
     - Set with `return <code>` within a function.
     - Example: `return 2` indicates that the function ended with a specific
       error status.

By using both exit and return codes, you can effectively manage and report the
status and errors of your scripts and functions.

<br />

## Debugging and Logging

### Debugging Tips

To debug scripts effectively:

- **Enable Verbose Mode**: Use `set -x` to trace command execution.
- **Use Debugging Tools**: Tools like `shellcheck` can help identify potential
  issues in your scripts.

<br />

### Logging Examples

Log exit and return codes for later analysis:

```bash
#!/bin/bash

LOGFILE="script.log"

echo "Script started at $(date)" >> $LOGFILE

# Example command
command_output=$(your_command 2>&1)
exit_code=$?
echo "Command output: $command_output" >> $LOGFILE
echo "Exit code: $exit_code" >> $LOGFILE

exit $exit_code
```

<br />

## Exit Codes in Complex Scenarios

### Chained Commands

When using chained commands (e.g., `command1 && command2`), the exit status of
`command2` depends on the exit status of `command1`.

<br />

### Subshells

Capture exit codes from subshells using `$?` immediately after the subshell
command:

```bash
(
  command1
  command2
)
subshell_exit_code=$?
```

<br />

## Return Codes in Complex Scenarios

### Nested Functions

Capture return codes from nested functions:

```bash
nested_function() {
  # Do something
  return 1
}

parent_function() {
  nested_function
  return_code=$?
  if [ $return_code -ne 0 ]; then
    echo "Nested function failed with code $return_code"
    return $return_code
  fi
}

parent_function
```

<br />

## Custom Exit and Return Codes

### Defining Custom Codes

Define and use custom exit and return codes for specific conditions:

```bash
#!/bin/bash

CUSTOM_ERROR_CODE=99

if [ some_condition ]; then
  echo "Custom error occurred."
  exit $CUSTOM_ERROR_CODE
fi
```

<br />

## CI/CD Integration

### CI/CD Pipelines

In CI/CD

environments, configure pipelines to handle specific exit codes effectively to
manage build and deployment processes.

<br />

### Automatic Error Handling

Implement automatic error handling:

```bash
#!/bin/bash

command || {
  echo "Command failed with exit code $?"
  exit 1
}
```

<br />

## FAQs

### What should I do if a script returns an unexpected exit code?

**Answer:** To resolve unexpected exit codes:

1. **Check the Exit Code**: Review the returned exit code.
2. **Examine Logs**: Check log files for additional context.
3. **Debug Your Script**: Use debugging tools to trace commands.
4. **Review Error Messages**: Analyze any error messages for insights.
5. **Consult Documentation**: Refer to documentation for specific exit codes.
6. **Test in Small Steps**: Isolate the error by running smaller script
   segments.

<br />

### How can I handle exit codes in a cross-platform environment?

**Answer:** To manage exit codes across platforms:

1. **Use Standard Codes**: Stick to standard codes for consistency.
2. **Use Platform-Agnostic Tools**: Choose tools and shells compatible with
   multiple platforms.
3. **Check Platform Specifications**: Understand platform-specific handling of
   exit codes.
4. **Test on Multiple Platforms**: Ensure scripts work across all target
   platforms.
5. **Use CI/CD Pipelines**: Automate cross-platform testing in CI/CD pipelines.
6. **Document Platform-Specific Behavior**: Note any required platform-specific
   adjustments.

<br />

### How can I effectively use and document custom exit codes?

**Answer:** For custom exit codes:

1. **Define Clear Codes**: Choose unique, meaningful codes.
2. **Document Custom Codes**: Clearly document codes and their meanings.
3. **Use Consistently**: Apply custom codes consistently across scripts.
4. **Communicate with Your Team**: Ensure your team understands custom codes.
5. **Check for Conflicts**: Avoid conflicts with standard or other custom codes.

<br />

### How can I manage exit codes in complex scripts?

**Answer:** To manage exit codes in complex scripts:

1. **Use Clear Codes**: Apply clear, consistent codes.
2. **Log Exit Codes**: Record exit codes and error messages.
3. **Implement Unit Tests**: Test functions and script sections.
4. **Handle Subshells and Chained Commands**: Manage exit codes carefully in
   these scenarios.
5. **Implement Error Handling Logic**: Check exit codes and implement
   appropriate error handling.

<br />

## Conclusion

Understanding and effectively using exit and return codes is crucial for robust
shell scripting. These codes provide feedback on script execution and help
manage errors. By mastering exit and return codes, you can enhance your scripts'
reliability and debugging capabilities. For further information, consult
additional resources and documentation.
