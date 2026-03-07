<script setup>
import TodoList from '../components/TodoList.vue'
</script>

<template>
  <div class="tasks-view">
    <TodoList />
  </div>
</template>

<style scoped>
.tasks-view {
  animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
