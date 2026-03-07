<script setup>
import { ref, watch, onMounted } from 'vue'
import { supabase } from '../supabase'
import { user } from '../composables/useAuth'

const tasks = ref([])
const newTaskText = ref('')
const loading = ref(false)

const fetchTasks = async () => {
  if (!user.value) return
  loading.value = true
  
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Errore caricamento todos:', error)
  } else {
    tasks.value = data || []
  }
  loading.value = false
}

// Quando l'utente fa il login/logout, ricarica o svuota i task
watch(user, () => {
  if (user.value) {
    fetchTasks()
  } else {
    tasks.value = []
  }
})

onMounted(() => {
  if (user.value) fetchTasks()
})

const addTask = async () => {
  if (newTaskText.value.trim() === '' || !user.value) return
  
  const text = newTaskText.value
  newTaskText.value = ''
  
  const { data, error } = await supabase
    .from('todos')
    .insert([{ text, completed: false, user_id: user.value.id }])
    .select()
    .single()
    
  if (error) {
    console.error('Errore aggiunta todo:', error)
    alert('Errore: non è stato possibile salvare il task. Assicurati di aver creato la tabella "todos" su Supabase!')
  } else if (data) {
    tasks.value.unshift(data)
  }
}

const toggleTask = async (task) => {
  // Aggiornamento ottimistico dell'UI
  task.completed = !task.completed
  
  const { error } = await supabase
    .from('todos')
    .update({ completed: task.completed })
    .eq('id', task.id)
    
  if (error) {
    // Revert se fallisce
    task.completed = !task.completed
    console.error('Errore aggiornamento todo:', error)
  }
}

const deleteTask = async (id) => {
  const prevTasks = [...tasks.value]
  // Aggiornamento ottimistico
  tasks.value = tasks.value.filter(t => t.id !== id)
  
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    
  if (error) {
    // Revert
    tasks.value = prevTasks
    console.error('Errore cancellazione todo:', error)
  }
}
</script>

<template>
  <div class="glass-panel todo-container">
    <h2 class="widget-title">Le tue attività</h2>
    
    <!-- Se NON loggato -->
    <div v-if="!user" class="empty-state auth-prompt">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 12px; opacity: 0.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      <p>Accedi o registrati alla sezione "Utente" per visualizzare e salvare la tua lista delle cose da fare privata.</p>
    </div>

    <!-- Se loggato -->
    <div v-else>
      <form @submit.prevent="addTask" class="add-task-form">
        <input 
          v-model="newTaskText" 
          type="text" 
          placeholder="Aggiungi una nuova attività..." 
          class="task-input"
        />
        <button type="submit" class="add-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </form>

      <div v-if="loading" class="empty-state">
        <span class="spinner"></span> Caricamento...
      </div>
      
      <div v-else class="task-list">
        <div 
          v-for="task in tasks" 
          :key="task.id" 
          class="task-item"
          :class="{ completed: task.completed }"
        >
          <button class="check-btn" @click="toggleTask(task)">
            <span v-if="task.completed" class="check-icon">✓</span>
          </button>
          <span class="task-text" @click="toggleTask(task)">{{ task.text }}</span>
          <button class="delete-btn" @click="deleteTask(task.id)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="tasks.length === 0" class="empty-state">
          Nessuna attività pendente. Bravo! 🎉
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-height: 400px;
}

.widget-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.add-task-form {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.task-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
  padding: 10px 14px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.task-input:focus {
  border-color: var(--accent-blue);
}

.task-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.add-button {
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s;
}

.add-button:active {
  transform: scale(0.95);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.task-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-sm);
  transition: all 0.2s ease;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.task-item.completed {
  opacity: 0.6;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.check-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--text-secondary);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
}

.task-item.completed .check-btn {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
}

.check-icon {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.task-text {
  flex: 1;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
}

.delete-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, background 0.2s;
}

.delete-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--text-secondary);
  font-style: italic;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.auth-prompt {
  font-style: normal;
  padding: var(--spacing-md);
  background: rgba(0,0,0,0.2);
  border-radius: var(--border-radius-sm);
  margin-top: var(--spacing-sm);
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
