<script setup>
import { onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { initAuth, user } from './composables/useAuth.js'

onMounted(() => {
  initAuth()
})
</script>

<template>
  <header class="app-header">
    <h1 class="app-title">Dashboard</h1>
    <div v-if="user" class="user-badge">🔑 Logged in</div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>

  <nav class="bottom-nav">
    <RouterLink to="/" class="nav-item">
      <!-- Icon outline (home/dashboard) -->
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </RouterLink>
    <RouterLink to="/tasks" class="nav-item">
      <!-- Icon outline (tasks) -->
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    </RouterLink>
    <RouterLink to="/auth" class="nav-item">
      <!-- Icon outline (user) -->
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </RouterLink>
  </nav>
</template>

<style scoped>
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.nav-item svg {
  width: 20px;
  height: 20px;
}
</style>
