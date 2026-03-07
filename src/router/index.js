import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHashHistory(), // Using Hash history for easier GitHub Pages deployment
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    }
  ]
})

export default router
