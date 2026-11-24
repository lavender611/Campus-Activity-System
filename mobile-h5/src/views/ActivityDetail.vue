<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'
import { state } from '../store'
import { toast } from '../ui'
import { fmtRange, fmtDate, fmtTime } from '../format'

const route = useRoute()
const router = useRouter()
const activity = ref(null)
const count = ref(0)
const registered = ref(false)
const loading = ref(false)
const submitting = ref(false)

const isFull = computed(() => activity.value && count.value >= Number(activity.value.capacity))

async function load() {
  loading.value = true
  try {
    activity.value = await api.activity(route.params.id)
    const c = await api.count(route.params.id)
    count.value = c.count
    if (state.userId) {
      const records = await api.myRegistrations(state.userId)
      registered.value = records.some(
        (r) => Number(r.activityId) === Number(route.params.id) && r.status === 'REGISTERED'
      )
    } else {
      registered.value = false
    }
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}

async function register() {
  if (state.role !== 'student' || !state.userId) {
    toast.warning('请先以学生身份登录')
    return router.push('/login')
  }
  submitting.value = true
  try {
    const r = await api.register({ userId: state.userId, activityId: Number(route.params.id) })
    toast[r.success ? 'success' : 'warning'](r.message)
    await load()
  } catch (e) {
    toast.error(e.message)
  } finally {
    submitting.value = false
  }
}

async function cancel() {
  submitting.value = true
  try {
    const r = await api.cancel(state.userId, Number(route.params.id))
    toast[r.success ? 'success' : 'warning'](r.message)
    await load()
  } catch (e) {
    toast.error(e.message)
  } finally {
    submitting.value = false
  }
}

onMounted(load)
watch(() => route.params.id, (id) => { if (id) load() })
</script>

<template>
  <div class="detail-page">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      正在加载…
    </div>

    <template v-else-if="activity">
      <section class="detail-head">
        <span class="tag">{{ activity.category }}</span>
        <h2>{{ activity.title }}</h2>
        <p class="sub">{{ fmtDate(activity.startTime) }} {{ fmtTime(activity.startTime) }} · {{ activity.location }}</p>
        <div class="seat" style="margin-top: 12px">
          <div class="progress" style="background: rgba(255, 255, 255, .22)">
            <i
              :class="{ full: isFull }"
              :style="{ width: Math.min(100, Math.round((count / (activity.capacity || 1)) * 100)) + '%' }"
            ></i>
          </div>
          <span class="seat-text" style="color: #fff">{{ count }} / {{ activity.capacity }} 人</span>
        </div>
      </section>

      <div class="card" style="margin-top: 12px">
        <div class="info-list">
          <div class="info-item">
            <span class="k">活动地点</span>
            <span class="v">{{ activity.location }}</span>
          </div>
          <div class="info-item">
            <span class="k">活动时间</span>
            <span class="v">{{ fmtRange(activity.startTime, activity.endTime) }}</span>
          </div>
          <div class="info-item">
            <span class="k">报名名额</span>
            <span class="v">{{ activity.capacity }} 人（已报 {{ count }} 人）</span>
          </div>
          <div class="info-item">
            <span class="k">活动状态</span>
            <span class="v">
              <span v-if="registered" class="tag green">已报名</span>
              <span v-else-if="isFull" class="tag orange">名额已满</span>
              <span v-else class="tag">可报名</span>
            </span>
          </div>
        </div>
      </div>

      <div class="section-label">活动介绍</div>
      <div class="card">
        <p style="margin: 0; color: #4d5e72; font-size: 14px; line-height: 1.75; white-space: pre-wrap">{{ activity.description || '暂无详细介绍' }}</p>
      </div>

      <div class="bottom-action">
        <template v-if="state.role === 'admin'">
          <div class="hint">管理员账号不参与报名，可在“活动管理”中查看报名名单</div>
          <button type="button" class="btn btn-ghost btn-block" @click="router.push(`/roster/${activity.id}`)">查看报名名单</button>
        </template>
        <template v-else-if="state.role === '游客'">
          <div class="hint">登录学生账号后即可报名</div>
          <button type="button" class="btn btn-primary btn-block" @click="router.push('/login')">去登录</button>
        </template>
        <template v-else-if="registered">
          <button type="button" class="btn btn-danger btn-block" :disabled="submitting" @click="cancel">
            {{ submitting ? '处理中…' : '取消报名' }}
          </button>
        </template>
        <template v-else>
          <div v-if="isFull" class="hint">该活动名额已满，可稍后再来看看</div>
          <button type="button" class="btn btn-primary btn-block" :disabled="isFull || submitting" @click="register">
            {{ submitting ? '提交中…' : isFull ? '名额已满' : '立即报名' }}
          </button>
        </template>
      </div>
    </template>
  </div>
</template>
