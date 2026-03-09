<script setup>
import { ref, onMounted } from 'vue'

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY
const newsArticles = ref([])
const loading = ref(true)
const error = ref(null)

const fetchNews = async () => {
  loading.value = true
  error.value = null
  try {
    // Top headlines in Italy
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=it&apiKey=${NEWS_API_KEY}`)
    if (!response.ok) throw new Error('Errore nel caricamento delle notizie')
    
    const data = await response.json()
    newsArticles.value = data.articles.map((article, index) => ({
      id: index,
      title: article.title,
      source: article.source.name,
      time: new Date(article.publishedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      url: article.url
    }))
  } catch (err) {
    console.error('News Error:', err)
    error.value = 'Impossibile caricare le notizie.'
  } finally {
    loading.value = false
  }
}

const openArticle = (url) => {
  if (url) window.open(url, '_blank')
}

onMounted(() => {
  if (NEWS_API_KEY) {
    fetchNews()
  } else {
    error.value = 'API Key mancante nel file .env'
    loading.value = false
  }
})
</script>

<template>
  <div class="glass-panel news-widget">
    <div class="widget-header">
      <h3 class="widget-title">Ultime Notizie</h3>
      <button @click="fetchNews" class="refresh-btn" :disabled="loading" title="Aggiorna">
        <span :class="{ 'spinning': loading }">🔄</span>
      </button>
    </div>
    
    <div v-if="loading && newsArticles.length === 0" class="status-message">
      <div class="spinner-small"></div>
      Caricamento...
    </div>

    <div v-else-if="error" class="status-message error">
      {{ error }}
    </div>

    <div v-else class="news-list">
      <div 
        v-for="article in newsArticles" 
        :key="article.id" 
        class="news-item"
        @click="openArticle(article.url)"
      >
        <h4 class="news-title">{{ article.title }}</h4>
        <div class="news-meta">
          <span class="news-source">{{ article.source }}</span>
          <span class="news-time">{{ article.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-widget {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-height: 400px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.widget-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.refresh-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.refresh-btn:active {
  transform: scale(0.9);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  display: inline-block;
  animation: spin 1s linear infinite;
}

.status-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
  min-height: 150px;
}

.status-message.error {
  color: #ef4444;
}

.spinner-small {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  overflow-y: auto;
  padding-right: 4px;
}

.news-list::-webkit-scrollbar {
  width: 4px;
}

.news-list::-webkit-scrollbar-track {
  background: transparent;
}

.news-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.news-item {
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.news-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-left-color: var(--accent-purple);
  transform: translateX(4px);
}

.news-title {
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 6px;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.news-source {
  font-weight: 600;
  color: var(--accent-blue);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
