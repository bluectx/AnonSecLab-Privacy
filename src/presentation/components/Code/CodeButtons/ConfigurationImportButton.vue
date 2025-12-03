<template>
  <IconButton
    text="Import Config"
    icon-name="folder-open"
    @click="importConfiguration"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { injectKey } from '@/presentation/injectionSymbols';
import { FileType } from '@/presentation/common/Dialog';
import { ConfigurationImporter } from '@/application/Services/ConfigurationImporter';
import IconButton from './IconButton.vue';

export default defineComponent({
  components: {
    IconButton,
  },
  setup() {
    const { currentState, modifyCurrentState: modifyState } = injectKey(
      (keys) => keys.useCollectionState,
    ); // eslint-disable-line vue/max-len
    const { dialog } = injectKey((keys) => keys.useDialog);

    const importer = new ConfigurationImporter();

    async function importConfiguration() {
      const result = await dialog.openFile(FileType.Json);
      if (!result.success) {
        if (result.error && result.error.type !== 'FileCanceled') {
          dialog.showError('Import Error', result.error.message);
        }
        return;
      }

      const importResult = importer.importFromJson(
        result.fileContents,
        currentState.value.collection,
      );
      if (!importResult.success) {
        const errorMessage = importResult.errors.join('\n');
        dialog.showError('Import Error', errorMessage);
        return;
      }

      modifyState((state) => {
        state.selection.scripts.deselectAll();

        const changes = importResult.selectedScripts.map((selectedScript) => ({
          scriptId: selectedScript.script.executableId,
          newStatus: {
            isSelected: true as const,
            isReverted: selectedScript.revert,
          },
        }));

        state.selection.scripts.processChanges({ changes });
      });
    }

    return {
      importConfiguration,
    };
  },
});
</script>
