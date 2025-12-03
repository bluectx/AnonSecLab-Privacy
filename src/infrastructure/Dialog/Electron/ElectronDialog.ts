import { readFile } from 'node:fs/promises';
import { dialog } from 'electron/main';
import type {
  Dialog, FileType, SaveFileOutcome, OpenFileOutcome,
} from '@/presentation/common/Dialog';
import { NodeElectronSaveFileDialog, getDialogFileFilters } from './NodeElectronSaveFileDialog';
import type { ElectronSaveFileDialog } from './ElectronSaveFileDialog';

export class ElectronDialog implements Dialog {
  constructor(
    private readonly saveFileDialog: ElectronSaveFileDialog = new NodeElectronSaveFileDialog(),
    private readonly electron: ElectronDialogAccessor = {
      showErrorBox: dialog.showErrorBox.bind(dialog),
      showOpenDialog: dialog.showOpenDialog.bind(dialog),
    },
  ) { }

  public saveFile(
    fileContents: string,
    defaultFilename: string,
    type: FileType,
  ): Promise<SaveFileOutcome> {
    return this.saveFileDialog.saveFile(fileContents, defaultFilename, type);
  }

  public async openFile(type: FileType): Promise<OpenFileOutcome> {
    try {
      const result = await this.electron.showOpenDialog({
        title: 'Select configuration file',
        filters: getDialogFileFilters(type),
        properties: ['openFile'],
      });

      if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
        return {
          success: false,
          error: { type: 'FileCanceled', message: 'File selection canceled' },
        };
      }

      const filePath = result.filePaths[0];
      const fileContents = await readFile(filePath, 'utf-8');

      return {
        success: true,
        fileContents,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          type: 'FileReadError',
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  public showError(title: string, message: string): void {
    this.electron.showErrorBox(title, message);
  }
}

export interface ElectronDialogAccessor {
  readonly showErrorBox: typeof dialog.showErrorBox;
  readonly showOpenDialog: typeof dialog.showOpenDialog;
}
