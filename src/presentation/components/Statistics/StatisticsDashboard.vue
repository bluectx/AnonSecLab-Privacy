<template>
  <div class="statistics-dashboard">
    <h2 class="statistics-dashboard__title">
      Statistics
    </h2>
    <div class="statistics-dashboard__grid">
      <div class="statistics-card">
        <h3>Total Scripts</h3>
        <p class="statistics-card__value">
          {{ totalScripts }}
        </p>
      </div>
      <div class="statistics-card">
        <h3>Selected Scripts</h3>
        <p class="statistics-card__value">
          {{ selectedScriptsCount }}
        </p>
      </div>
      <div class="statistics-card">
        <h3>Categories</h3>
        <p class="statistics-card__value">
          {{ totalCategories }}
        </p>
      </div>
      <div class="statistics-card">
        <h3>Reverted Scripts</h3>
        <p class="statistics-card__value">
          {{ revertedScriptsCount }}
        </p>
      </div>
    </div>
    <div class="statistics-dashboard__breakdown">
      <h3>Scripts by Level</h3>
      <div class="statistics-breakdown">
        <div
          v-for="level in levelBreakdown"
          :key="level.level"
          class="statistics-breakdown__item"
        >
          <span class="statistics-breakdown__label">{{ level.label }}</span>
          <span class="statistics-breakdown__value">{{ level.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { injectKey } from '@/presentation/injectionSymbols';
import { RecommendationLevel } from '@/domain/Executables/Script/RecommendationLevel';

export default defineComponent({
  setup() {
    const { currentState } = injectKey((keys) => keys.useCollectionState);

    const totalScripts = computed(() => currentState.value.collection.totalScripts);
    const totalCategories = computed(() => currentState.value.collection.totalCategories);
    const selectedScriptsCount = computed(
      () => currentState.value.selection.scripts.selectedScripts.length,
    );
    const revertedScriptsCount = computed(
      () => currentState.value.selection.scripts.selectedScripts.filter(
        (s) => s.revert,
      ).length,
    );

    const levelBreakdown = computed(() => {
      const { collection } = currentState.value;
      return [
        {
          level: RecommendationLevel.Standard,
          label: 'Standard',
          count: collection.getScriptsByLevel(RecommendationLevel.Standard).length,
        },
        {
          level: RecommendationLevel.Strict,
          label: 'Strict',
          count: collection.getScriptsByLevel(RecommendationLevel.Strict).length,
        },
      ];
    });

    return {
      totalScripts,
      totalCategories,
      selectedScriptsCount,
      revertedScriptsCount,
      levelBreakdown,
    };
  },
});
</script>

<style scoped lang="scss">
@use "@/presentation/assets/styles/main" as *;

.statistics-dashboard {
  padding: $spacing-absolute-large;

  &__title {
    margin: 0 0 $spacing-absolute-large 0;
    font-size: $font-size-absolute-x-large;
    color: $color-primary;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-absolute-medium;
    margin-bottom: $spacing-absolute-large;
  }

  &__breakdown {
    margin-top: $spacing-absolute-large;
  }
}

.statistics-card {
  padding: $spacing-absolute-medium;
  background-color: $color-surface;
  border-radius: 4px;
  text-align: center;

  h3 {
    margin: 0 0 $spacing-absolute-small 0;
    font-size: $font-size-absolute-normal;
    color: $color-primary-darker;
  }

  &__value {
    margin: 0;
    font-size: $font-size-absolute-xx-large;
    font-weight: bold;
    color: $color-primary;
  }
}

.statistics-breakdown {
  display: flex;
  flex-direction: column;
  gap: $spacing-absolute-small;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-absolute-small $spacing-absolute-medium;
    background-color: $color-surface;
    border-radius: 4px;
  }

  &__label {
    font-weight: 500;
  }

  &__value {
    font-weight: bold;
    color: $color-primary;
  }
}
</style>
