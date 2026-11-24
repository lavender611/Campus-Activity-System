<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'
import { state } from '../store'
import { toast } from '../ui'
import { fmtShort, statusText } from '../format'

const rows = ref([])
const loading = ref(false)

async function load() {
  if (!state.userId || state.role !== 'student') {
    toast.warning('请先以学生身份登录')
    return
  }
  loading.value = true
  try {
    rows.value = await api.myRegistrations(state.userId)
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}

async function cancel(row) {
  try {
    const r = await api.cancel(state.userId, row.activityId)
    toast[r.success ? 'success' : 'warning'](r.message)
    await load()
  } catch (e) {
    toast.error(e.message)
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div style="display: flex; align-items: center; margin: 2px 4px 12px">
      <span class="section-label" style="margin: 0">共 {{ rows.length }} 条报名记录</span>
      <button type="button" class="btn btn-ghost btn-sm" style="margin-left: auto" @click="load">
        {{ loading ? '加载中…' : '刷新' }}
      </button>
    </div>

    <div v-if="loading && !rows.length" class="loading">
      <div class="spinner"></div>
      正在加载…
    </div>

    <div v-else-if="!rows.length" class="empty">
      <span class="empty-icon">🎟</span>
      暂无报名记录<br />
      <button type="button" class="btn btn-ghost btn-sm" style="margin-top: 14px" @click="$router.push('/list')">去看看活动</button>
    </div>

    <article v-for="row in rows" :key="row.id" class="activity-card" style="cursor: default">
      <div class="ac-top">
        <h3>{{ row.activityTitle }}</h3>
        <span class="tag" :class="row.status === 'REGISTERED' ? 'green' : 'gray'">{{ statusText(row.status) }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-icon">📍</span>
        <span>{{ row.activityLocation }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-icon">🕒</span>
        <span>活动开始：{{ fmtShort(row.activityStartTime) }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-icon">✍️</span>
        <span>报名时间：{{ fmtShort(row.registrationTime) }}</span>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 12px">
        <button type="button" class="btn btn-plain btn-sm" @click="$router.push(`/detail/${row.activityId}`)">查看详情</button>
        <button v-if="row.status === 'REGISTERED'" type="button" class="btn btn-danger btn-sm" @click="cancel(row)">取消报名</button>
      </div>
    </article>
  </div>
</template>
