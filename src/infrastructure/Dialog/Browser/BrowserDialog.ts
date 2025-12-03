import type { Dialog, SaveFileOutcome, OpenFileOutcome } from '@/presentation/common/Dialog';
import { FileType } from '@/presentation/common/Dialog';
import { FileSaverDialog } from './FileSaverDialog';
import type { BrowserSaveFileDialog } from './BrowserSaveFileDialog';

export class BrowserDialog implements Dialog {
  constructor(
    private readonly window: WindowDialogAccessor = globalThis.window,
    private readonly saveFileDialog: BrowserSaveFileDialog = new FileSaverDialog(),
  ) {

  }

  public showError(title: string, message: string): void {
    this.window.alert(`❌ ${title}\n\n${message}`);
  }

  public saveFile(
    fileContents: string,
    defaultFilename: string,
    type: FileType,
  ): Promise<SaveFileOutcome> {
    return Promise.resolve(
      this.saveFileDialog.saveFile(fileContents, defaultFilename, type),
    );
  }

  public openFile(type: FileType): Promise<OpenFileOutcome> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = type === FileType.Json ? '.json' : '*';

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve({
            success: false,
            error: { type: 'FileCanceled', message: 'No file selected' },
          });
          return;
        }

        try {
          const text = await file.text();
          resolve({
            success: true,
            fileContents: text,
          });
        } catch (error) {
          resolve({
            success: false,
            error: {
              type: 'FileReadError',
              message: error instanceof Error ? error.message : String(error),
            },
          });
        }
      };

      input.oncancel = () => {
        resolve({
          success: false,
          error: { type: 'FileCanceled', message: 'File selection canceled' },
        });
      };

      input.click();
    });
  }
}

export interface WindowDialogAccessor {
  readonly alert: typeof window.alert;
}
