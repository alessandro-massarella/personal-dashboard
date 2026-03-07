<script setup>
import ClockWidget from '../components/ClockWidget.vue'
import WeatherWidget from '../components/WeatherWidget.vue'
import NewsWidget from '../components/NewsWidget.vue'
</script>

<template>
  <div class="dashboard-container">
    <ClockWidget />
    <WeatherWidget />
    <NewsWidget />
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
