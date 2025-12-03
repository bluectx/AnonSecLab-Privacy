<template>
  <FlatButton
    label="Statistics"
    icon="circle-info"
    flat
    @click="showStatistics"
  />
  <ModalDialog v-model="isStatisticsVisible">
    <StatisticsDashboard />
  </ModalDialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FlatButton from '@/presentation/components/Shared/FlatButton.vue';
import ModalDialog from '@/presentation/components/Shared/Modal/ModalDialog.vue';
import StatisticsDashboard from './StatisticsDashboard.vue';

export default defineComponent({
  components: {
    FlatButton,
    ModalDialog,
    StatisticsDashboard,
  },
  setup() {
    const isStatisticsVisible = ref(false);

    function showStatistics() {
      isStatisticsVisible.value = true;
    }

    return {
      isStatisticsVisible,
      showStatistics,
    };
  },
});
</script>
