<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ACTIVITIES, state, activityStatus } from '../store'

const router = useRouter()
const route = useRoute()

const activity = computed(() => {
  const id = Number(route.params.id)
  return ACTIVITIES.find((x) => x.id === id) || ACTIVITIES[0]
})

const remain = computed(() => activity.value.capacity - activity.value.signed)
const pct = computed(() =>
  Math.min(100, Math.round((activity.value.signed / activity.value.capacity) * 100))
)
const signed = computed(() => state.mySignups.some((s) => s.activityId === activity.value.id))
const fav = computed(() => state.favorites.includes(activity.value.id))

function toggleFav() {
  const idx = state.favorites.indexOf(activity.value.id)
  if (idx >= 0) {
    state.favorites.splice(idx, 1)
    ElMessage.info('已取消收藏')
  } else {
    state.favorites.push(activity.value.id)
    ElMessage.success('已加入收藏')
  }
}

function signup() {
  if (state.role === '游客') {
    ElMessage.warning('请先登录后再报名')
    router.push({ name: 'login' })
    return
  }
  if (signed.value) {
    ElMessage.info('你已报名该活动')
    return
  }
  if (activity.value.signed >= activity.value.capacity) {
    ElMessage.warning('名额已满，无法报名')
    return
  }
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const signupAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
  state.mySignups.push({ activityId: activity.value.id, signupAt, status: '已报名' })
  activity.value.signed += 1
  ElMessage.success('报名成功，可在「我的报名」中查看')
}

async function cancelSignup() {
  try {
    await ElMessageBox.confirm('确定要取消该活动的报名吗？取消后名额将释放给其他同学。', '取消报名', {
      type: 'warning',
      confirmButtonText: '确认取消',
      cancelButtonText: '再想想'
    })
    state.mySignups = state.mySignups.filter((s) => s.activityId !== activity.value.id)
    if (activity.value.signed > 0) activity.value.signed -= 1
    ElMessage.success('已取消报名，名额已释放')
  } catch {
    // 用户取消弹窗，不处理
  }
}
</script>

<template>
  <div class="page-wrap">
    <el-breadcrumb separator="/" class="crumb">
      <el-breadcrumb-item><router-link :to="{ name: 'list' }">返回列表</router-link></el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="detail-grid">
      <el-card class="detail-main">
        <el-tag effect="plain">{{ activity.category }}</el-tag>
        <h2 class="detail-title">{{ activity.title }}</h2>
        <div class="detail-meta">
          <div class="meta-line"><el-icon><OfficeBuilding /></el-icon>主办方：{{ activity.organizer }}</div>
          <div class="meta-line"><el-icon><Clock /></el-icon>时间：{{ activity.startAt }}</div>
          <div class="meta-line"><el-icon><Location /></el-icon>地点：{{ activity.location }}</div>
        </div>
        <div class="detail-desc">{{ activity.desc }}</div>
      </el-card>

      <el-card class="detail-side">
        <div class="side-block">
          <div class="side-label">报名状态</div>
          <el-tag :type="activityStatus(activity).type" effect="light">{{ activityStatus(activity).text }}</el-tag>
        </div>
        <div class="side-block">
          <div class="side-label">名额余量</div>
          <div class="side-value">剩余 {{ remain }} / {{ activity.capacity }} 人</div>
          <el-progress :percentage="pct" :stroke-width="8" class="quota-bar" />
        </div>
        <div class="detail-actions">
          <el-button :type="fav ? 'success' : 'default'" plain @click="toggleFav">
            {{ fav ? '已收藏' : '收藏活动' }}
          </el-button>
          <el-button v-if="!signed" type="primary" size="large" @click="signup">立即报名</el-button>
          <el-button v-else size="large" @click="cancelSignup">取消报名</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.crumb {
  margin-bottom: 12px;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
}
.detail-title {
  font-size: 22px;
  font-weight: 700;
  margin: 10px 0 12px;
}
.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--ink-2);
}
.meta-line {
  display: flex;
  gap: 8px;
  align-items: center;
}
.meta-line .el-icon {
  color: var(--ink-3);
}
.detail-desc {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #edf1f6;
  font-size: 14px;
  color: var(--ink-2);
  white-space: pre-line;
}
.side-block {
  margin-bottom: 18px;
}
.side-block:last-child {
  margin-bottom: 0;
}
.side-label {
  font-size: 12px;
  color: var(--ink-3);
  margin-bottom: 6px;
}
.side-value {
  font-size: 16px;
  font-weight: 600;
}
.quota-bar {
  margin-top: 8px;
}
.detail-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
}
.detail-actions .el-button {
  width: 100%;
}
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
