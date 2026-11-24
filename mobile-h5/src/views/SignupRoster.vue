<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api'
import { toast } from '../ui'
import { fmtShort, statusText } from '../format'

const route = useRoute()
const rows = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    rows.value = await api.activityRegistrations(route.params.id)
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div style="display: flex; align-items: center; margin: 2px 4px 12px">
      <span class="section-label" style="margin: 0">共 {{ rows.length }} 条记录</span>
      <button type="button" class="btn btn-ghost btn-sm" style="margin-left: auto" @click="load">
        {{ loading ? '加载中…' : '刷新' }}
      </button>
    </div>

    <div v-if="loading && !rows.length" class="loading">
      <div class="spinner"></div>
      正在加载…
    </div>

    <div v-else-if="!rows.length" class="empty">
      <span class="empty-icon">👥</span>
      该活动暂无报名记录
    </div>

    <div v-else class="card" style="padding: 4px 15px">
      <div v-for="row in rows" :key="row.id" class="roster-row">
        <div class="avatar">{{ (row.username || '学生').slice(0, 1).toUpperCase() }}</div>
        <div class="who">
          <div class="name">{{ row.username }}</div>
          <div class="time">用户ID {{ row.userId }} · 报名于 {{ fmtShort(row.registrationTime) }}</div>
        </div>
        <span class="tag" :class="row.status === 'REGISTERED' ? 'green' : 'gray'">{{ statusText(row.status) }}</span>
      </div>
    </div>
  </div>
</template>
