<script setup>
import { ref } from 'vue'

const openArticle = (url) => {
  window.open(url, '_blank')
}

// Mock news data
const newsArticles = ref([
  {
    id: 1,
    title: 'Nuove scoperte nella missione spaziale su Marte: trovate tracce di acqua liquida',
    source: 'Scienza Oggi',
    time: '2 ore fa',
    url: '#'
  },
  {
    id: 2,
    title: 'Mercati azionari in rialzo dopo i recenti annunci delle banche centrali',
    source: 'Finanza 24',
    time: '4 ore fa',
    url: '#'
  },
  {
    id: 3,
    title: 'Svelato il nuovo smartphone top di gamma con batteria rivoluzionaria',
    source: 'Tech World',
    time: '5 ore fa',
    url: '#'
  }
])
</script>

<template>
  <div class="glass-panel news-widget">
    <h3 class="widget-title">Ultime Notizie</h3>
    
    <div class="news-list">
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

.widget-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  overflow-y: auto;
  /* hide scrollbar for webkit */
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.news-list::-webkit-scrollbar {
  display: none;
}

.news-item {
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: background 0.2s ease;
  border-left: 3px solid transparent;
}

.news-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-left-color: var(--accent-purple);
}

.news-title {
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 6px;
  color: var(--text-primary);
  /* Truncate text to 2 lines */
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
</style>
