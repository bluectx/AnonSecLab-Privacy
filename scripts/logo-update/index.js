/**
 * Description:
 *  This script updates the logo images across the project based on the primary
 *  logo file ('img/logo.svg' file).
 *
 *  It handles the creation and update of various icon sizes for different purposes,
 *  including desktop launcher icons, tray icons, and web favicons from a single source
 *  SVG logo file.
 *
 * Usage:
 *    node ./scripts/logo-update
 *
 * Notes:
 *    ImageMagick must be installed and accessible in the system's PATH
 */

import { resolve, join, dirname } from 'node:path';
import { stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { URL, fileURLToPath } from 'node:url';
import electronBuilderConfig from '../../electron-builder.cjs';
import { optimizeSvg } from './svg-optimizer.js'; // eslint-disable-line import/extensions
import { runCommand } from './run-command.js'; // eslint-disable-line import/extensions

const DesktopTrayIconSize = '512x512';

class ImageAssetPaths {
  constructor(currentScriptDirectory) {
    const projectRoot = resolve(currentScriptDirectory, '../../');
    const logoPng = join(projectRoot, 'img/logo.png');
    const logoSvg = join(projectRoot, 'img/logo.svg');
    this.sourceImage = existsSync(logoPng) ? logoPng : logoSvg;
    this.publicDirectory = join(projectRoot, 'src/presentation/public');
    this.electronBuildResourcesDirectory = electronBuilderConfig.directories.buildResources;
  }

  get electronTrayIconFile() {
    return join(this.publicDirectory, `icon-${DesktopTrayIconSize}.png`);
  }

  get webFaviconFile() {
    return join(this.publicDirectory, 'favicon.ico');
  }

  get appLogoSvgFile() {
    return join(this.publicDirectory, 'icon.svg');
  }

  toString() {
    return `Source image: ${this.sourceImage}`
      + `\nPublic directory: ${this.publicDirectory}`
      + `\n\t Electron tray icon file: ${this.electronTrayIconFile}`
      + `\n\t App logo SVG file: ${this.appLogoSvgFile}`
      + `\nElectron build directory: ${this.electronBuildResourcesDirectory}`;
  }
}

async function main() {
  const paths = new ImageAssetPaths(getCurrentScriptDirectory());
  console.log(`Paths:\n\t${paths.toString().replaceAll('\n', '\n\t')}`);
  const convertCommand = await findAvailableImageMagickCommand();
  await generateDesktopAndTrayIcons(
    paths.sourceImage,
    paths.electronTrayIconFile,
    convertCommand,
  );
  await generateWebFavicon(
    paths.sourceImage,
    paths.webFaviconFile,
    convertCommand,
  );
  await generateDesktopIcons(
    paths.sourceImage,
    paths.electronBuildResourcesDirectory,
    convertCommand,
  );
  await generateAppLogoSvg(
    paths.sourceImage,
    paths.appLogoSvgFile,
    convertCommand,
  );
  console.log('🎉 (Re)created icons successfully.');
}

async function generateDesktopAndTrayIcons(sourceImage, targetFile, convertCommand) {
  // Reference: https://web.archive.org/web/20240502124306/https://www.electronjs.org/docs/latest/api/tray
  console.log(`Updating desktop launcher and tray icon at ${targetFile}.`);
  await ensureFileExists(sourceImage);
  await ensureParentFolderExists(targetFile);
  await convertFromSvgToPng(
    convertCommand,
    sourceImage,
    targetFile,
    DesktopTrayIconSize,
  );
}

async function generateWebFavicon(sourceImage, faviconFilePath, convertCommand) {
  console.log(`Updating favicon at ${faviconFilePath}.`);
  await ensureFileExists(sourceImage);
  await ensureParentFolderExists(faviconFilePath);
  await convertFromSvgToIco(
    convertCommand,
    sourceImage,
    faviconFilePath,
    [16, 24, 32, 48, 64, 128, 256],
  );
}

async function generateDesktopIcons(sourceImage, electronBuildResourcesDirectory, convertCommand) {
  console.log(`Creating Electron icon files to ${electronBuildResourcesDirectory}.`);
  // Reference: https://web.archive.org/web/20240501103645/https://www.electron.build/icons.html
  await ensureFolderExists(electronBuildResourcesDirectory);
  await ensureFileExists(sourceImage);
  const electronMainIconFile = join(electronBuildResourcesDirectory, 'icon.png');
  await convertFromSvgToPng(
    convertCommand,
    sourceImage,
    electronMainIconFile,
    '1024x1024', // Should be at least 512x512
  );
  // Relying on `electron-builder`s conversion from png to ico results in pixelated look on Windows
  // 10 and 11 according to tests, see:
  //  - https://web.archive.org/web/20240502114650/https://github.com/electron-userland/electron-builder/issues/7328
  //  - https://web.archive.org/web/20240502115448/https://github.com/electron-userland/electron-builder/issues/3867
  const electronWindowsIconFile = join(electronBuildResourcesDirectory, 'icon.ico');
  await convertFromSvgToIco(
    convertCommand,
    sourceImage,
    electronWindowsIconFile,
    [16, 24, 32, 48, 64, 128, 256],
  );
}

async function generateAppLogoSvg(sourceImage, targetSvgFile, convertCommand) {
  await ensureFileExists(sourceImage);
  await ensureParentFolderExists(targetSvgFile);
  if (sourceImage.endsWith('.svg')) {
    // Use ImageMagick to do basic SVG processing
    // This won't do extensive optimization but can clean up some aspects
    await optimizeSvg(
      sourceImage,
      targetSvgFile,
    );
    console.log(`Created optimized SVG at ${targetSvgFile}`);
  } else {
    // For PNG, convert to SVG (simple approach: embed as base64)
    const { readFile } = await import('node:fs/promises');
    const pngData = await readFile(sourceImage);
    const base64 = pngData.toString('base64');
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512">
  <image xlink:href="data:image/png;base64,${base64}" width="512" height="512"/>
</svg>`;
    const { writeFile } = await import('node:fs/promises');
    await writeFile(targetSvgFile, svgContent);
    console.log(`Created SVG from PNG at ${targetSvgFile}`);
  }
}

async function ensureFileExists(filePath) {
  const path = await stat(filePath);
  if (!path.isFile()) {
    throw new Error(`Not a file: ${filePath}`);
  }
}

async function ensureFolderExists(folderPath) {
  if (!folderPath) {
    throw new Error('Path is missing');
  }
  const path = await stat(folderPath);
  if (!path.isDirectory()) {
    throw new Error(`Not a directory: ${folderPath}`);
  }
}

function ensureParentFolderExists(filePath) {
  return ensureFolderExists(dirname(filePath));
}

const BaseImageMagickConvertArguments = Object.freeze([
  '-background none', // Transparent, so they do not get filled with white.
  '-strip', // Strip metadata.
  '-gravity Center', // Center the image when there's empty space
]);

async function convertFromSvgToIco(
  convertCommand,
  inputFile,
  outputFile,
  sizes,
) {
  const maxSize = Math.max(...sizes);
  await runCommand(
    convertCommand,
    ...BaseImageMagickConvertArguments,
    `-resize ${maxSize}x${maxSize}`, // Resize to max size first
    `-extent ${maxSize}x${maxSize}`, // Force square canvas
    `-density ${maxSize}`, // High enough for sharpness
    `-define icon:auto-resize=${sizes.map((s) => s.toString()).join(',')}`, // Automatically store multiple sizes in an ico image
    '-compress None',
    inputFile,
    outputFile,
  );
}

async function convertFromSvgToPng(
  convertCommand,
  inputFile,
  outputFile,
  size = undefined,
) {
  await runCommand(
    convertCommand,
    ...BaseImageMagickConvertArguments,
    ...(size === undefined ? [] : [
      `-resize ${size}`,
      `-extent ${size}`, // Force square canvas with exact size for proper centering
      `-density ${size}`, // High enough for sharpness
    ]),
    inputFile,
    outputFile,
  );
}

function getCurrentScriptDirectory() {
  return fileURLToPath(new URL('.', import.meta.url));
}

async function findAvailableImageMagickCommand() {
  // Reference: https://web.archive.org/web/20240502120041/https://imagemagick.org/script/convert.php
  const potentialBaseCommands = [
    'convert', // Legacy command, usually available on Linux/macOS installations
    'magick convert', // Newer command, available on Windows installations
  ];
  for (const baseCommand of potentialBaseCommands) {
    const testCommand = `${baseCommand} -version`;
    try {
      await runCommand(testCommand); // eslint-disable-line no-await-in-loop
      console.log(`Confirmed: ImageMagick command '${baseCommand}' is available and operational.`);
      return baseCommand;
    } catch (err) {
      console.log(`Error: The command '${baseCommand}' is not found or failed to execute. Detailed error: ${err.message}"`);
    }
  }
  throw new Error([
    'Unable to locate any operational ImageMagick command.',
    `Attempted commands were: ${potentialBaseCommands.join(', ')}.`,
    'Please ensure ImageMagick is correctly installed and accessible.',
  ].join('\n'));
}

await main();
