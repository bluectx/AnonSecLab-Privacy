<template>
  <IconButton
    text="Export Config"
    icon-name="file-arrow-down"
    @click="exportConfiguration"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { injectKey } from '@/presentation/injectionSymbols';
import { FileType } from '@/presentation/common/Dialog';
import { ConfigurationExporter } from '@/application/Services/ConfigurationExporter';
import { EnvironmentVariablesFactory } from '@/infrastructure/EnvironmentVariables/EnvironmentVariablesFactory';
import IconButton from './IconButton.vue';

export default defineComponent({
  components: {
    IconButton,
  },
  setup() {
    const { currentState } = injectKey((keys) => keys.useCollectionState);
    const { dialog } = injectKey((keys) => keys.useDialog);
    const { os } = injectKey((keys) => keys.useRuntimeEnvironment);

    const exporter = new ConfigurationExporter(
      EnvironmentVariablesFactory.Current.instance,
    );

    async function exportConfiguration() {
      if (!os) {
        dialog.showError('Export Error', 'Operating system not detected');
        return;
      }

      const { selectedScripts } = currentState.value.selection.scripts;
      if (selectedScripts.length === 0) {
        dialog.showError('Export Error', 'No scripts selected');
        return;
      }

      const json = exporter.exportToJson(selectedScripts, os);
      const filename = `anonseclab-config-${new Date().toISOString().split('T')[0]}.json`;

      const { success, error } = await dialog.saveFile(json, filename, FileType.Json);
      if (!success && error) {
        dialog.showError('Export Error', error.message);
      }
    }

    return {
      exportConfiguration,
    };
  },
});
</script>
