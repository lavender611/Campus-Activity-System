<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'
import { toast, askConfirm } from '../ui'
import { fmtShort } from '../format'

const router = useRouter()
const rows = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    rows.value = await api.activities()
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}

async function remove(row) {
  const ok = await askConfirm(`确定删除活动“${row.title}”吗？删除后相关报名记录也会一并删除。`, '确认删除')
  if (!ok) return
  try {
    const r = await api.deleteActivity(row.id)
    toast[r.success ? 'success' : 'error'](r.message)
    await load()
  } catch (e) {
    toast.error(e.message)
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div style="display: flex; gap: 8px; margin: 2px 0 14px">
      <button type="button" class="btn btn-primary btn-sm" style="flex: 1" @click="router.push('/publish')">＋ 发布活动</button>
      <button type="button" class="btn btn-ghost btn-sm" @click="load">{{ loading ? '加载中…' : '刷新' }}</button>
    </div>

    <div v-if="loading && !rows.length" class="loading">
      <div class="spinner"></div>
      正在加载…
    </div>

    <div v-else-if="!rows.length" class="empty">
      <span class="empty-icon">📋</span>
      还没有活动，点击上方按钮发布
    </div>

    <article v-for="row in rows" :key="row.id" class="manage-card">
      <div style="display: flex; align-items: flex-start; gap: 8px">
        <h3 style="flex: 1">{{ row.title }}</h3>
        <span class="tag">{{ row.category }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-icon">📍</span>
        <span>{{ row.location }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-icon">🕒</span>
        <span>{{ fmtShort(row.startTime) }}</span>
      </div>
      <div class="seat" style="margin-top: 8px">
        <div class="progress">
          <i :style="{ width: Math.min(100, Math.round(((row.registeredCount || 0) / (row.capacity || 1)) * 100)) + '%' }"></i>
        </div>
        <span class="seat-text">{{ row.registeredCount || 0 }} / {{ row.capacity }}</span>
      </div>
      <div class="actions">
        <button type="button" class="btn btn-plain btn-sm" @click="router.push({ path: '/publish', query: { id: row.id } })">编辑</button>
        <button type="button" class="btn btn-ghost btn-sm" @click="router.push(`/roster/${row.id}`)">报名名单</button>
        <button type="button" class="btn btn-danger btn-sm" @click="remove(row)">删除</button>
      </div>
    </article>
  </div>
</template>
