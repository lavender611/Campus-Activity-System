<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { api } from '../api'
import { formatDateTime } from '../format'
import { state } from '../store'

const route = useRoute()
const router = useRouter()
const activity = ref(null)
const count = ref(0)
const registered = ref(false)
const loading = ref(false)
const submitting = ref(false)

async function load() {
  loading.value = true
  try {
    activity.value = await api.activity(route.params.id)
    const c = await api.count(route.params.id)
    count.value = c.count
    if (state.userId && state.role === 'student') {
      const records = await api.myRegistrations(state.userId)
      registered.value = records.some(
        (r) => Number(r.activityId) === Number(route.params.id) && r.status === 'REGISTERED'
      )
    } else {
      registered.value = false
    }
  } catch (e) {
    activity.value = null
    ElMessage.error(e.message)
  } finally {
    loading.value = false
  }
}

async function register() {
  if (state.role !== 'student' || !state.userId) {
    ElMessage.warning('请先以学生身份登录')
    return router.push('/login')
  }
  submitting.value = true
  try {
    const r = await api.register({ userId: state.userId, activityId: Number(route.params.id) })
    ElMessage[r.success ? 'success' : 'warning'](r.message)
    await load()
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    submitting.value = false
  }
}

async function cancel() {
  submitting.value = true
  try {
    const r = await api.cancel(state.userId, Number(route.params.id))
    ElMessage[r.success ? 'success' : 'warning'](r.message)
    await load()
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    submitting.value = false
  }
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
      <p>开始时间：{{ formatDateTime(activity.startTime) }}</p>
      <p>结束时间：{{ formatDateTime(activity.endTime) }}</p>
      <p>报名人数：{{ count }} / {{ activity.capacity }}</p>
      <el-tag v-if="registered" type="success">已报名</el-tag>
      <el-button
        v-if="!registered"
        type="primary"
        :loading="submitting"
        :disabled="count >= activity.capacity"
        @click="register"
      >{{ count >= activity.capacity ? '名额已满' : '立即报名' }}</el-button>
      <el-button v-else type="danger" :loading="submitting" @click="cancel">取消报名</el-button>
    </div>
    <div v-else class="panel" style="margin-top:16px">活动不存在或已被删除</div>
  </main>
</template>
