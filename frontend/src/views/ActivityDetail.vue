<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { api } from '../api'
import { state } from '../store'
const route = useRoute(), router = useRouter()
const activity = ref(null), count = ref(0), registered = ref(false), loading = ref(false)
async function load() {
  loading.value = true
  try {
    activity.value = await api.activity(route.params.id)
    const c = await api.count(route.params.id); count.value = c.count
    if (state.userId) {
      const records = await api.myRegistrations(state.userId)
      registered.value = records.some(r => Number(r.activityId) === Number(route.params.id) && r.status === 'REGISTERED')
    } else registered.value = false
  } catch(e) { ElMessage.error(e.message) }
  finally { loading.value = false }
}
async function register() {
  if (state.role !== 'student' || !state.userId) { ElMessage.warning('请先以学生身份登录'); return router.push('/login') }
  try { const r = await api.register({ userId: state.userId, activityId: Number(route.params.id) }); ElMessage[r.success?'success':'warning'](r.message); await load() }
  catch(e) { ElMessage.error(e.message) }
}
async function cancel() {
  try { const r = await api.cancel(state.userId, Number(route.params.id)); ElMessage[r.success?'success':'warning'](r.message); await load() }
  catch(e) { ElMessage.error(e.message) }
}
onMounted(load)
</script>
<template>
  <main class="page">
    <el-button @click="$router.back()">返回</el-button>
    <div v-if="loading" class="panel">正在加载...</div>
    <div v-else-if="activity" class="panel" style="margin-top:16px">
      <h2>{{ activity.title }}</h2>
      <el-tag>{{ activity.category }}</el-tag>
      <p>{{ activity.description }}</p>
      <p>地点：{{ activity.location }}</p>
      <p>开始时间：{{ activity.startTime?.replace('T',' ') }}</p>
      <p>结束时间：{{ activity.endTime?.replace('T',' ') }}</p>
      <p>报名人数：{{ count }} / {{ activity.capacity }}</p>
      <el-tag v-if="registered" type="success">已报名</el-tag>
      <el-button v-if="!registered" type="primary" :disabled="count>=activity.capacity" @click="register">立即报名</el-button>
      <el-button v-else type="danger" @click="cancel">取消报名</el-button>
    </div>
  </main>
</template>
