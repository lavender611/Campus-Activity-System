<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'
import { toast } from '../ui'
import { fmtDate, fmtTime } from '../format'

const router = useRouter()
const items = ref([])
const keyword = ref('')
const category = ref('全部')
const loading = ref(false)
const categories = ['全部', '学术讲座', '文艺体育', '志愿服务', '社会实践']

const filtered = computed(() =>
  items.value.filter(
    (a) =>
      (category.value === '全部' || a.category === category.value) &&
      (!keyword.value || `${a.title}${a.description || ''}${a.location}`.includes(keyword.value))
  )
)

async function load() {
  loading.value = true
  try {
    items.value = await api.activities()
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}

function seatRate(a) {
  if (!a.capacity) return 0
  return Math.min(100, Math.round(((a.registeredCount || 0) / a.capacity) * 100))
}

function openDetail(a) {
  router.push(`/detail/${a.id}`)
}

onMounted(load)
</script>

<template>
  <div>
    <div class="search-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4.5 4.5" />
      </svg>
      <input v-model="keyword" type="search" placeholder="搜索活动名称、地点" />
    </div>

    <div class="chip-row" style="margin-top: 12px">
      <button
        v-for="c in categories"
        :key="c"
        type="button"
        class="chip"
        :class="{ active: category === c }"
        @click="category = c"
      >{{ c }}</button>
    </div>

    <div style="display: flex; align-items: center; margin: 4px 4px 10px">
      <span class="section-label" style="margin: 0">共 {{ filtered.length }} 个活动</span>
      <button type="button" class="btn btn-ghost btn-sm" style="margin-left: auto" @click="load">
        {{ loading ? '加载中…' : '刷新' }}
      </button>
    </div>

    <div v-if="loading && !items.length" class="loading">
      <div class="spinner"></div>
      正在加载活动…
    </div>

    <div v-else-if="!filtered.length" class="empty">
      <span class="empty-icon">🗓</span>
      暂无符合条件的活动
    </div>

    <div v-else>
      <article v-for="a in filtered" :key="a.id" class="activity-card" @click="openDetail(a)">
        <div class="ac-top">
          <h3>{{ a.title }}</h3>
          <span class="tag">{{ a.category }}</span>
        </div>
        <p class="desc">{{ a.description }}</p>
        <div class="meta-row">
          <span class="meta-icon">📍</span>
          <span>{{ a.location }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-icon">🕒</span>
          <span>{{ fmtDate(a.startTime) }} {{ fmtTime(a.startTime) }} 开始</span>
        </div>
        <div class="seat">
          <div class="progress">
            <i :class="{ full: seatRate(a) >= 100 }" :style="{ width: seatRate(a) + '%' }"></i>
          </div>
          <span class="seat-text">{{ a.registeredCount || 0 }} / {{ a.capacity }} 人</span>
        </div>
      </article>
    </div>
  </div>
</template>
