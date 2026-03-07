<script setup>
import { ref } from 'vue'
import { signIn, signUp, signOut, user } from '../composables/useAuth'

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMsg.value = ''
}

const handleSubmit = async () => {
  errorMsg.value = ''
  loading.value = true
  try {
    if (isLogin.value) {
      await signIn(email.value, password.value)
    } else {
      await signUp(email.value, password.value)
      alert('Registrazione completata! (Se hai abilitato la conferma, controlla l\'email prima di loggarti)')
    }
    email.value = ''
    password.value = ''
  } catch (e) {
    errorMsg.value = e.message || 'Si è verificato un errore.'
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  try {
    await signOut()
  } catch (e) {
    errorMsg.value = e.message
  }
}
</script>

<template>
  <div class="auth-view">
    <div class="glass-panel auth-panel">
      
      <!-- Se l'utente è GIÀ LOGGATO -->
      <div v-if="user" class="logged-in-state">
        <div class="auth-header">
          <h2>Bentornato!</h2>
          <p class="subtitle">Sei autenticato come:</p>
          <div class="user-email">{{ user.email }}</div>
        </div>
        <button @click="handleLogout" class="primary-btn logout-btn">Esci</button>
      </div>

      <!-- Se l'utente NON È LOGGATO -->
      <div v-else class="auth-box">
        <div class="auth-header">
          <h2>{{ isLogin ? 'Bentornato' : 'Crea Account' }}</h2>
          <p class="subtitle">
            {{ isLogin ? 'Accedi per gestire le tue liste tramite Supabase' : 'Registrati per iniziare' }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              v-model="email" 
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              v-model="password" 
              placeholder="••••••••"
              required
            />
          </div>

          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

          <button type="submit" class="primary-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>{{ isLogin ? 'Accedi' : 'Registrati' }}</span>
          </button>
        </form>

        <div class="auth-footer">
          <span class="text">{{ isLogin ? 'Non hai un account?' : 'Hai già un account?' }}</span>
          <button class="text-btn" @click="toggleMode" type="button">
            {{ isLogin ? 'Registrati' : 'Accedi' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.auth-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.auth-panel {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.auth-header h2 {
  font-size: 1.8rem;
  margin-bottom: var(--spacing-xs);
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.user-email {
  margin-top: var(--spacing-sm);
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--accent-blue);
  word-break: break-all;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  padding-left: 4px;
}

.form-group input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
  padding: 12px 14px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

.form-group input:focus {
  border-color: var(--accent-blue);
  background: rgba(255, 255, 255, 0.08);
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  text-align: center;
  background: rgba(239, 68, 68, 0.1);
  padding: 8px;
  border-radius: 4px;
}

.primary-btn {
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  margin-top: var(--spacing-sm);
  transition: transform 0.1s, box-shadow 0.2s, opacity 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.primary-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.primary-btn:hover:not(:disabled) {
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.logout-btn {
  width: 100%;
}

.auth-footer {
  margin-top: var(--spacing-lg);
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer .text {
  color: var(--text-secondary);
  margin-right: 6px;
}

.text-btn {
  background: none;
  border: none;
  color: var(--accent-blue);
  font-weight: 600;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}

/* Semplice spinner animato css */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
