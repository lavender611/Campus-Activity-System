<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'
import { formatDateTime } from '../format'
import { state } from '../store'
import { ElMessage } from 'element-plus'

const rows = ref([])
const loading = ref(false)

async function load() {
  if (!state.userId || state.role !== 'student') {
    ElMessage.warning('请先以学生身份登录')
    return
  }
  loading.value = true
  try { rows.value = await api.myRegistrations(state.userId) }
  catch (e) { ElMessage.error(e.message) }
  finally { loading.value = false }
}

async function cancel(row) {
  try {
    const r = await api.cancel(state.userId, row.activityId)
    ElMessage[r.success ? 'success' : 'warning'](r.message)
    await load()
  } catch (e) {
    ElMessage.error(e.message)
  }
}

onMounted(load)
</script>

<template>
  <main class="page">
    <h2>我的报名</h2>
    <div class="panel">
      <el-table :data="rows" stripe v-loading="loading">
        <el-table-column prop="activityTitle" label="活动名称" min-width="160" />
        <el-table-column prop="activityLocation" label="地点" />
        <el-table-column label="开始时间" min-width="170">
          <template #default="{ row }">{{ formatDateTime(row.activityStartTime) }}</template>
        </el-table-column>
        <el-table-column label="报名时间" min-width="170">
          <template #default="{ row }">{{ formatDateTime(row.registrationTime) }}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'REGISTERED' ? 'success' : 'info'">
              {{ row.status === 'REGISTERED' ? '已报名' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template #default="{ row }">
            <el-button v-if="row.status === 'REGISTERED'" link type="danger" @click="cancel(row)">取消报名</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!rows.length && !loading" description="暂无报名记录" />
    </div>
  </main>
</template>
