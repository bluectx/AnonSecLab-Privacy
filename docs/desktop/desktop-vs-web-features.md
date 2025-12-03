# Desktop Application Features

AnonSecLab Privacy Tools is a **desktop-only application** available for Windows, macOS, and Linux.

The website [anonseclab.org](https://anonseclab.org) is a separate information resource providing comprehensive guides, tutorials, and security information. It does not host the application itself.

## Desktop Application Features

| Feature | Availability |
| ------- | ------------ |
| [Offline usage](#offline-usage) | 🟢 Available |
| [Auto-updates](#auto-updates) | 🟢 Available |
| [Logging](#logging) | 🟢 Available |
| [Secure script execution/storage](#secure-script-executionstorage) | 🟢 Available |
| [Native dialogs](#native-dialogs) | 🟢 Available |

## Feature descriptions

### Installation

The desktop application requires download and installation.

> **Note for Linux users:** On Linux, AnonSecLab Privacy Tools is available as an `AppImage`, a portable format that doesn't need traditional installation.

### Offline usage

The desktop application inherently allows offline usage once installed.

### Auto-updates

The desktop application provides timely access to the latest features and security improvements. Updates are automatically deployed from source code, reflecting the latest changes for enhanced security and reliability. For more details, see [CI/CD documentation](./../ci-cd.md).

The desktop version ensures secure delivery through cryptographic signatures and version checks.

[Security is a top priority](./../../SECURITY.md#update-security-and-integrity) at AnonSecLab Privacy Tools.

> **Note for macOS users:**
> On macOS, the desktop version's auto-update process involves manual steps due to Apple's code signing costs.
> Users get notified about updates but might need to complete the installation manually.
> Updater stores update installation files temporarily at `$HOME/Library/Application Support/anonseclab-privacy/updates`.
> Consider [donating](https://github.com/sponsors/BlueCtx) to help improve this process ❤️.

### Logging

The desktop application supports logging of activities to aid in troubleshooting.

Log file locations vary by operating system:

- macOS: `$HOME/Library/Logs/AnonSecLab`
- Linux: `$HOME/.config/AnonSecLab/logs`
- Windows: `%APPDATA%\AnonSecLab\logs`

> 💡 AnonSecLab Privacy Tools provides scripts to securely erase these logs.

### Secure script execution/storage

The desktop application enables direct script execution, providing a seamless and integrated experience.

**Script execution history:**

For enhanced auditability and easier troubleshooting, the desktop application keeps a record of executed scripts in designated directories.
These locations vary based on the operating system:

- macOS: `$HOME/Library/Application Support/AnonSecLab/runs`
- Linux: `$HOME/.config/AnonSecLab/runs`
- Windows: `%APPDATA%\AnonSecLab\runs`

> 💡 AnonSecLab Privacy Tools provides scripts to securely erase your script execution history.

**Script antivirus scans:**

To enhance system protection, the desktop application automatically verifies the security of script
execution files by reading them back.
This process triggers antivirus scans to verify that scripts are safe before the execution.

**Script integrity checks:**

The desktop application implements robust integrity checks for both script execution and storage.
Featuring tamper protection, the application actively verifies the integrity of script files before executing or saving them.
If the actual contents of a script file do not align with the expected contents, the application refuses to execute or save the script.
This proactive approach ensures only unaltered and verified scripts undergo processing, thereby enhancing both security and reliability.

**Error handling:**

The desktop application features advanced error handling capabilities.
In scenarios where script execution or storage encounters failure, the application initiates automated troubleshooting and self-healing processes.
It employs robust and reliable execution strategies, including self-healing mechanisms, and provides guidance and troubleshooting information to resolve issues effectively.
This proactive error handling and user guidance enhances the application's security and reliability.

### Native dialogs

The desktop application uses native dialogs, offering more features and reliability compared to browser-based file system dialogs.
These native dialogs provide a more integrated and user-friendly experience, aligning with the operating system's standard interface and functionalities.
