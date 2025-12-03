<template>
  <div v-if="hasCode" class="container">
    <CodePreviewButton class="code-button" />
    <CodeRunButton class="code-button" />
    <CodeSaveButton class="code-button" />
    <CodeCopyButton class="code-button" />
    <ConfigurationExportButton class="code-button" />
    <ConfigurationImportButton class="code-button" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, computed,
} from 'vue';
import { injectKey } from '@/presentation/injectionSymbols';
import CodeRunButton from './CodeRunButton.vue';
import CodeCopyButton from './CodeCopyButton.vue';
import CodeSaveButton from './Save/CodeSaveButton.vue';
import CodePreviewButton from './CodePreviewButton.vue';
import ConfigurationExportButton from './ConfigurationExportButton.vue';
import ConfigurationImportButton from './ConfigurationImportButton.vue';

export default defineComponent({
  components: {
    CodeRunButton,
    CodeCopyButton,
    CodeSaveButton,
    CodePreviewButton,
    ConfigurationExportButton,
    ConfigurationImportButton,
  },
  setup() {
    const { currentCode } = injectKey((keys) => keys.useCurrentCode);

    const hasCode = computed<boolean>(() => currentCode.value.length > 0);

    return {
      hasCode,
    };
  },
});
</script>

<style scoped lang="scss">
@use "@/presentation/assets/styles/main" as *;

.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: $spacing-absolute-xx-large;
}

.code-button {
  width: 10%;
  min-width: 90px;
}
</style>
