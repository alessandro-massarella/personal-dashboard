<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const time = ref('')
const date = ref('')
const currentDateObj = ref(new Date())
const showCalendar = ref(false)
let timer

const updateTime = () => {
  const now = new Date()
  time.value = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  date.value = now.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  // Aggiorna l'oggetto data solo a mezzanotte circa per evitare ricalcoli costanti del calendario
  if (now.getDate() !== currentDateObj.value.getDate()) {
    currentDateObj.value = now
  }
}

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

// Logica per generare i giorni del mese corrente nel calendario
const calendarDays = computed(() => {
  const year = currentDateObj.value.getFullYear()
  const month = currentDateObj.value.getMonth()
  const today = currentDateObj.value.getDate()
  
  // 0 = Domenica, 1 = Lunedì, ecc.
  // getDay() restituisce 0 per Domenica. Modifichiamo per far iniziare la settimana di Lunedì (Lunedì = 0).
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = []
  
  // Celle vuote prima dell'inizio del mese
  for (let i = 0; i < startingDay; i++) {
    days.push({ id: `empty-${i}`, text: '', isToday: false, empty: true })
  }
  
  // Giorni effettivi
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ 
      id: `day-${i}`, 
      text: i, 
      isToday: i === today,
      empty: false 
    })
  }
  
  return days
})

const weekDays = ['L', 'M', 'M', 'G', 'V', 'S', 'D']

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="glass-panel clock-widget" @click="toggleCalendar" :class="{ 'expanded': showCalendar }">
    <div class="time">{{ time }}</div>
    <div class="date">{{ date }}</div>
    
    <!-- Mini Calendar -->
    <div v-if="showCalendar" class="calendar-container">
      <div class="calendar-header">
        <span v-for="day in weekDays" :key="day" class="weekday">{{ day }}</span>
      </div>
      <div class="calendar-grid">
        <div 
          v-for="day in calendarDays" 
          :key="day.id" 
          class="calendar-cell"
          :class="{ 'today': day.isToday, 'empty': day.empty }"
        >
          {{ day.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clock-widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.clock-widget:hover {
  background: rgba(255, 255, 255, 0.08);
}

.clock-widget.expanded {
  padding-bottom: var(--spacing-md);
}

.time {
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1;
  margin-bottom: var(--spacing-sm);
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: font-size 0.3s ease;
}

.clock-widget.expanded .time {
  font-size: 3rem; /* Leggermente più piccolo quando il calendario è aperto */
}

.date {
  font-size: 1.1rem;
  color: var(--text-secondary);
  text-transform: capitalize;
  font-weight: 500;
}

/* Calendar Styles */
.calendar-container {
  width: 100%;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--glass-border);
  animation: fadeIn 0.3s ease;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}

.weekday {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  border-radius: 50%;
  color: var(--text-primary);
}

.calendar-cell.empty {
  visibility: hidden;
}

.calendar-cell.today {
  background: var(--accent-gradient);
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
