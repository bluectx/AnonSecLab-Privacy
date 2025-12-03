<template>
  <IconButton
    v-if="canRun"
    text="Run"
    icon-name="play"
    @click="runCode"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { injectKey } from '@/presentation/injectionSymbols';
import { OperatingSystem } from '@/domain/OperatingSystem';
import type { CodeRunError } from '@/application/CodeRunner/CodeRunner';
import { NotificationType } from '@/application/Services/NotificationService';
import IconButton from './IconButton.vue';
import { createScriptErrorDialog } from './ScriptErrorDialog';

export default defineComponent({
  components: {
    IconButton,
  },
  setup() {
    const { currentState, currentContext } = injectKey((keys) => keys.useCollectionState);
    const { os, isRunningAsDesktopApplication } = injectKey((keys) => keys.useRuntimeEnvironment);
    const { codeRunner } = injectKey((keys) => keys.useCodeRunner);
    const { dialog } = injectKey((keys) => keys.useDialog);
    const { scriptDiagnosticsCollector } = injectKey((keys) => keys.useScriptDiagnosticsCollector);
    const { notificationService } = injectKey((keys) => keys.useNotificationService);

    const canRun = computed<boolean>(() => getCanRunState(
      currentState.value.os,
      isRunningAsDesktopApplication,
      os,
    ));

    async function runCode() {
      if (!codeRunner) { throw new Error('missing code runner'); }
      const { success, error } = await codeRunner.runCode(
        currentContext.state.code.current,
        currentContext.state.collection.scriptMetadata.fileExtension,
      );
      if (!success) {
        await handleCodeRunFailure(error);
      } else {
        await notificationService.show({
          title: 'Script executed successfully',
          body: 'Your privacy configuration has been applied.',
          type: NotificationType.Success,
        });
      }
    }

    async function handleCodeRunFailure(error: CodeRunError) {
      const isCritical = error.type === 'FileExecutionError'
        || error.type === 'ExternalProcessTermination';
      if (isCritical) {
        await notificationService.show({
          title: 'Critical error during script execution',
          body: error.message,
          type: NotificationType.Error,
        });
      }
      dialog.showError(...(await createScriptErrorDialog({
        errorContext: 'run',
        errorType: error.type,
        errorMessage: error.message,
        isFileReadbackError: error.type === 'FileReadbackVerificationError',
      }, scriptDiagnosticsCollector)));
    }

    return {
      canRun,
      runCode,
    };
  },
});

function getCanRunState(
  selectedOs: OperatingSystem,
  isRunningAsDesktopApplication: boolean,
  hostOs: OperatingSystem | undefined,
): boolean {
  const isRunningOnSelectedOs = selectedOs === hostOs;
  return isRunningAsDesktopApplication && isRunningOnSelectedOs;
}
</script>
