export interface Dialog {
  showError(title: string, message: string): void;
  saveFile(fileContents: string, defaultFilename: string, type: FileType): Promise<SaveFileOutcome>;
  openFile(type: FileType): Promise<OpenFileOutcome>;
}

export type OpenFileOutcome = SuccessfulOpenFile | FailedOpenFile;

interface OpenFileStatus {
  readonly success: boolean;
  readonly error?: OpenFileError;
}

interface SuccessfulOpenFile extends OpenFileStatus {
  readonly success: true;
  readonly fileContents: string;
}

interface FailedOpenFile extends OpenFileStatus {
  readonly success: false;
  readonly error: OpenFileError;
}

export interface OpenFileError {
  readonly type: OpenFileErrorType;
  readonly message: string;
}

export type OpenFileErrorType =
  | 'FileReadError'
  | 'DialogDisplayError'
  | 'FileCanceled';

export enum FileType {
  BatchFile,
  ShellScript,
  Json,
}

export type SaveFileOutcome = SuccessfulSaveFile | FailedSaveFile;

interface SaveFileStatus {
  readonly success: boolean;
  readonly error?: SaveFileError;
}

interface SuccessfulSaveFile extends SaveFileStatus {
  readonly success: true;
  readonly error?: SaveFileError;
}

interface FailedSaveFile extends SaveFileStatus {
  readonly success: false;
  readonly error: SaveFileError;
}

export interface SaveFileError {
  readonly type: SaveFileErrorType;
  readonly message: string;
}

export type SaveFileErrorType =
  | 'FileCreationError'
  | 'FileReadbackVerificationError'
  | 'DialogDisplayError';
