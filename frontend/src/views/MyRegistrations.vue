<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'
import { state } from '../store'
import { ElMessage } from 'element-plus'
const rows = ref([])
async function load() {
  if (!state.userId || state.role !== 'student') return ElMessage.warning('请先以学生身份登录')
  try { rows.value = await api.myRegistrations(state.userId) }
  catch(e) { ElMessage.error(e.message) }
}
async function cancel(row) {
  try { const r = await api.cancel(state.userId, row.activityId); ElMessage[r.success?'success':'warning'](r.message); await load() }
  catch(e) { ElMessage.error(e.message) }
}
onMounted(load)
</script>
<template>
  <main class="page">
    <h2>我的报名</h2>
    <div class="panel">
      <el-table :data="rows" stripe>
        <el-table-column prop="activityTitle" label="活动名称" min-width="160" />
        <el-table-column prop="activityLocation" label="地点" />
        <el-table-column prop="activityStartTime" label="开始时间" min-width="170" />
        <el-table-column prop="registrationTime" label="报名时间" min-width="170" />
        <el-table-column label="状态">
          <template #default="{row}"><el-tag :type="row.status==='REGISTERED'?'success':'info'">{{ row.status==='REGISTERED'?'已报名':'已取消' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template #default="{row}"><el-button v-if="row.status==='REGISTERED'" link type="danger" @click="cancel(row)">取消报名</el-button></template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!rows.length" description="暂无报名记录" />
    </div>
  </main>
</template>
