<script setup>
import { ref, onMounted } from 'vue'

const WEATHER_API_KEY = '21b13a4ed1bbb0539f38e9f537f5cc75'
const CITY = 'Milano'

const weather = ref({
  location: 'Caricamento...',
  temperature: '--',
  description: '',
  icon: '⛅'
})

const getIconEmoji = (iconCode) => {
  const iconMap = {
    '01d': '☀️', '01n': '🌑',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  }
  return iconMap[iconCode] || '⛅'
}

const fetchWeather = async () => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=it&appid=${WEATHER_API_KEY}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Network response was not ok')
    
    const data = await response.json()
    
    weather.value = {
      location: data.name,
      temperature: Math.round(data.main.temp) + '°',
      description: data.weather[0].description,
      icon: getIconEmoji(data.weather[0].icon)
    }
  } catch (error) {
    console.error('Errore durante il recupero del meteo:', error)
    weather.value.location = 'Errore Meteo'
  }
}

onMounted(() => {
  fetchWeather()
})
</script>

<template>
  <div class="glass-panel weather-widget">
    <div class="weather-info">
      <div class="location">{{ weather.location }}</div>
      <div class="description">{{ weather.description }}</div>
    </div>
    <div class="weather-display">
      <div class="icon">{{ weather.icon }}</div>
      <div class="temperature">{{ weather.temperature }}</div>
    </div>
  </div>
</template>

<style scoped>
.weather-widget {
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.weather-widget:hover {
  background: rgba(255, 255, 255, 0.08);
}

.weather-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location {
  font-size: 1.2rem;
  font-weight: 600;
}

.description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: capitalize;
}

.weather-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.icon {
  font-size: 2.5rem;
}

.temperature {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -1px;
}
</style>
