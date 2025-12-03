<template>
  <ModalDialog v-model="isVisible">
    <div class="preview-dialog">
      <h2 class="preview-dialog__title">
        Preview Changes
      </h2>
      <div class="preview-dialog__content">
        <div class="preview-dialog__summary">
          <p>
            <strong>{{ selectedScriptsCount }}</strong> script(s) will be executed
          </p>
          <p v-if="revertScriptsCount > 0">
            <strong>{{ revertScriptsCount }}</strong> script(s) will be reverted
          </p>
        </div>
        <div class="preview-dialog__scripts">
          <h3>Selected Scripts:</h3>
          <ul class="preview-dialog__list">
            <li
              v-for="script in selectedScripts"
              :key="script.script.executableId"
              class="preview-dialog__item"
            >
              <span class="preview-dialog__script-name">{{ script.script.name }}</span>
              <span
                v-if="script.revert"
                class="preview-dialog__badge preview-dialog__badge--revert"
              >
                Revert
              </span>
            </li>
          </ul>
        </div>
        <div class="preview-dialog__code">
          <h3>Generated Code:</h3>
          <pre class="preview-dialog__code-block">{{ previewCode }}</pre>
        </div>
      </div>
    </div>
  </ModalDialog>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import ModalDialog from '@/presentation/components/Shared/Modal/ModalDialog.vue';
import type { SelectedScript } from '@/application/Context/State/Selection/Script/SelectedScript';

export default defineComponent({
  components: {
    ModalDialog,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    selectedScripts: {
      type: Array as PropType<readonly SelectedScript[]>,
      required: true,
    },
    previewCode: {
      type: String,
      required: true,
    },
  },
  emits: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    'update:modelValue': (_value: boolean) => true,
    /* eslint-enable @typescript-eslint/no-unused-vars */
  },
  setup(props, { emit }) {
    const isVisible = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val),
    });

    const selectedScriptsCount = computed(() => props.selectedScripts.length);
    const revertScriptsCount = computed(
      () => props.selectedScripts.filter((s) => s.revert).length,
    );

    return {
      isVisible,
      selectedScriptsCount,
      revertScriptsCount,
    };
  },
});
</script>

<style scoped lang="scss">
@use "@/presentation/assets/styles/main" as *;

.preview-dialog {
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;

  &__title {
    margin: 0 0 $spacing-absolute-large 0;
    font-size: $font-size-absolute-x-large;
    color: $color-primary;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-absolute-large;
  }

  &__summary {
    padding: $spacing-absolute-medium;
    background-color: $color-surface;
    border-radius: 4px;

    p {
      margin: $spacing-absolute-small 0;
    }
  }

  &__scripts {
    h3 {
      margin: 0 0 $spacing-absolute-medium 0;
      font-size: $font-size-absolute-large;
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-absolute-small $spacing-absolute-medium;
    margin-bottom: $spacing-absolute-small;
    background-color: $color-surface;
    border-radius: 4px;
  }

  &__script-name {
    flex: 1;
  }

  &__badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: $font-size-absolute-small;
    font-weight: bold;

    &--revert {
      background-color: $color-secondary;
      color: $color-on-secondary;
    }
  }

  &__code {
    h3 {
      margin: 0 0 $spacing-absolute-medium 0;
      font-size: $font-size-absolute-large;
    }
  }

  &__code-block {
    padding: $spacing-absolute-medium;
    background-color: $color-surface;
    border-radius: 4px;
    overflow-x: auto;
    font-family: monospace;
    font-size: $font-size-absolute-small;
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>
