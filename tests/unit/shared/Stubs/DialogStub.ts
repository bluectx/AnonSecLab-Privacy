import type { Dialog, SaveFileOutcome, OpenFileOutcome } from '@/presentation/common/Dialog';
import { StubWithObservableMethodCalls } from './StubWithObservableMethodCalls';

export class DialogStub
  extends StubWithObservableMethodCalls<Dialog>
  implements Dialog {
  public saveFile(...args: Parameters<Dialog['saveFile']>): Promise<SaveFileOutcome> {
    this.registerMethodCall({
      methodName: 'saveFile',
      args: [...args],
    });
    return Promise.resolve({
      success: true,
    });
  }

  public showError(...args: Parameters<Dialog['showError']>): void {
    this.registerMethodCall({
      methodName: 'showError',
      args: [...args],
    });
  }

  public openFile(...args: Parameters<Dialog['openFile']>): Promise<OpenFileOutcome> {
    this.registerMethodCall({
      methodName: 'openFile',
      args: [...args],
    });
    return Promise.resolve({
      success: true,
      fileContents: '',
    });
  }
}
