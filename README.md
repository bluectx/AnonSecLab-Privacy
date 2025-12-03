# AnonSecLab Privacy Tools

> Enforce privacy & security best-practices on Windows, macOS and Linux.

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img
    src="https://privacy.anonseclab.org/assets/images/logo.svg"
    alt="AnonSecLab Logo"
    style="width: 200px; height: auto; margin-bottom: 20px;"
  />
</p>
<p align="center">
  <img
    src="https://views-counter.vercel.app/badge?pageId=AnonSecLab&leftColor=0D0D0D&rightColor=66CCFF&type=total&label=Views&style=none"
    alt="Views Counter"
  />
  <a href="https://github.com/bluectx/AnonSecLab-Privacy/releases/" target="_blank" rel="noopener noreferrer">
    <img
      src="https://img.shields.io/github/downloads/bluectx/AnonSecLab-Privacy/total.svg"
      alt="GitHub all releases"
    />
  </a>
</p>
<!-- markdownlint-restore -->

## Get started

- 🌍️ **Online**: [https://anonseclab.org](https://anonseclab.org).
- 🖥️ **Offline**: Download directly for: [Windows](https://github.com/BlueCtx/anonseclab-privacy/releases/download/0.13.7/anonseclab-privacy-Setup-0.13.7.exe), [macOS](https://github.com/BlueCtx/anonseclab-privacy/releases/download/0.13.7/anonseclab-privacy-0.13.7.dmg), [Linux](https://github.com/BlueCtx/anonseclab-privacy/releases/download/0.13.7/anonseclab-privacy-0.13.7.AppImage).

See also:

- [Desktop vs. Web Features](./docs/desktop/desktop-vs-web-features.md): Differences and unique aspects of desktop and web versions.
- [System Requirements](./docs/desktop/system-requirements.md): Hardware and software requirements for the desktop version.

💡 Regularly applying your configuration with AnonSecLab Privacy Tools is recommended, especially after each new release and major operating system updates. Each version updates scripts to enhance stability, privacy, and security.

<p align="center">
  <a href="https://anonseclab.org" target="_blank" rel="noopener noreferrer">
    <img
      alt="AnonSecLab Privacy Tools application"
      src="img/screenshot.png?raw=true"
      style="width: 100%; max-width: 1800px; height: auto; display: block; margin: 0 auto;"
    />
  </a>
</p>

## Features

- **Rich**: Thousands of scripts designed to give you control of your data.
- **Free**: Both free as in "beer" and free as in "speech".
- **Transparent**: You have full visibility into the effect of modifications as soon as they are activated.
- **Reversible**: Go back if something goes wrong.
- **Secure**: Security is an absolute priority at AnonSecLab.org, which implements comprehensive protection measures.
- **Open**: The code you see in this repository is what you get. The application itself, its infrastructure and deployments are open source and automated thanks to [bump-everywhere](https://github.com/BlueCtx/bump-everywhere).
- **Tested**: Many tests. Automated and manual. Community testing and verification. Stability improvements come before adding new features.
- **Easily extensible**: Extend and customize your scripts with a templating language.
- **Portable and simple**: Every script is independently executable without cross-dependencies.

## Development

Refer to [development.md](./docs/development.md) for more information on using Docker and setting up your development environment.

Check [architecture.md](./docs/architecture.md) for an overview of the design and how different parts and layers work together. [application.md](./docs/application.md) details the application layer source code, while [presentation.md](./docs/presentation.md) presents the code related to the graphical interface. [collection-files.md](./docs/collection-files.md) explains the YAML files that form the core of the application, and [templating.md](./docs/templating.md) documents the use of the templating language in these files. Finally, [ci-cd.md](./docs/ci-cd.md) provides information on the pipelines that automate maintenance tasks and ensure the expected result.

The [docs/](./docs/) folder contains all remaining documentation.

## Security

Security is an absolute priority at AnonSecLab Privacy Tools. A significant commitment to security verification ensures this priority. For any security questions or vulnerabilities, please consult the [security policy](./SECURITY.md).
