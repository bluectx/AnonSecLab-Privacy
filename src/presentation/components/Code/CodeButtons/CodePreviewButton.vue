<template>
  <IconButton
    v-if="hasCode"
    text="Preview"
    icon-name="circle-info"
    @click="showPreview"
  />
  <PreviewDialog
    v-model="isPreviewVisible"
    :selected-scripts="selectedScripts"
    :preview-code="previewCode"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { injectKey } from '@/presentation/injectionSymbols';
import IconButton from './IconButton.vue';
import PreviewDialog from './PreviewDialog.vue';

export default defineComponent({
  components: {
    IconButton,
    PreviewDialog,
  },
  setup() {
    const { currentState } = injectKey((keys) => keys.useCollectionState);
    const isPreviewVisible = ref(false);

    const hasCode = computed(() => currentState.value.code.current.length > 0);
    const selectedScripts = computed(
      () => currentState.value.selection.scripts.selectedScripts,
    );
    const previewCode = computed(() => currentState.value.code.current);

    function showPreview() {
      if (selectedScripts.value.length === 0) {
        return;
      }
      isPreviewVisible.value = true;
    }

    return {
      hasCode,
      selectedScripts,
      previewCode,
      isPreviewVisible,
      showPreview,
    };
  },
});
</script>
