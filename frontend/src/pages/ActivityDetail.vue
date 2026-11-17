
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const activity = ref(null)
const signed = ref(0)
const hasRegistered = ref(false)
const loading = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

// 当前测试用户 ID
const userId = 1

// 剩余名额
const remaining = computed(() => {
  if (!activity.value) return 0
  return Math.max(0, activity.value.capacity - signed.value)
})

// 获取活动详情
async function loadActivity() {
  loading.value = true
  errorMessage.value = ''

  try {
    const id = route.params.id

    const response = await fetch(
        `http://localhost:8080/api/activities/${id}`
    )

    if (!response.ok) {
      throw new Error('活动查询失败，状态码：' + response.status)
    }

    const data = await response.json()

    activity.value = {
      id: data.id,
      title: data.title,
      description: data.description,
      location: data.location,
      startTime: data.startTime,
      endTime: data.endTime,
      capacity: data.capacity,
      status: data.status,
      organizer: '校园活动主办方'
    }

    await loadRegistrationInfo(id)

  } catch (error) {
    console.error('获取活动详情失败：', error)
    errorMessage.value = '活动详情加载失败，请检查后端接口'
  } finally {
    loading.value = false
  }
}

// 获取报名人数和当前用户报名状态
async function loadRegistrationInfo(id) {
  try {
    const countResponse = await fetch(
        `http://localhost:8080/api/registrations/count/${id}`
    )

    if (!countResponse.ok) {
      throw new Error('报名人数查询失败')
    }

    signed.value = Number(await countResponse.json())

    const listResponse = await fetch(
        'http://localhost:8080/api/registrations'
    )

    if (!listResponse.ok) {
      throw new Error('报名记录查询失败')
    }

    const registrations = await listResponse.json()

    hasRegistered.value = registrations.some(item =>
        Number(item.userId) === userId &&
        Number(item.activityId) === Number(id) &&
        item.status === 'REGISTERED'
    )

  } catch (error) {
    console.error('获取报名信息失败：', error)
    ElMessage.error('报名信息加载失败')
  }
}

// 提交报名
async function registerActivity() {
  if (!activity.value) return

  if (remaining.value <= 0) {
    ElMessage.warning('活动名额已满')
    return
  }

  try {
    await ElMessageBox.confirm(
        `确定报名参加“${activity.value.title}”吗？`,
        '报名确认',
        {
          confirmButtonText: '确认报名',
          cancelButtonText: '暂不报名',
          type: 'info'
        }
    )

    submitting.value = true

    const response = await fetch(
        'http://localhost:8080/api/registrations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            activityId: activity.value.id
          })
        }
    )

    if (!response.ok) {
      throw new Error('报名请求失败')
    }

    const result = await response.json()

    if (result.success) {
      ElMessage.success('报名成功！')
      await loadRegistrationInfo(activity.value.id)
    } else {
      ElMessage.warning(result.message || '报名失败')
    }

  } catch (error) {
    if (error !== 'cancel') {
      console.error('报名失败：', error)
      ElMessage.error('报名请求失败，请检查后端')
    }
  } finally {
    submitting.value = false
  }
}

// 取消报名
async function cancelActivity() {
  if (!activity.value) return

  try {
    await ElMessageBox.confirm(
        `确定取消“${activity.value.title}”的报名吗？`,
        '取消报名确认',
        {
          confirmButtonText: '确认取消',
          cancelButtonText: '暂不取消',
          type: 'warning'
        }
    )

    submitting.value = true

    const response = await fetch(
        `http://localhost:8080/api/registrations/cancel/${userId}/${activity.value.id}`,
        {
          method: 'PUT'
        }
    )

    if (!response.ok) {
      throw new Error('取消报名请求失败')
    }

    const result = await response.json()

    if (result.success) {
      ElMessage.success('取消报名成功')
      await loadRegistrationInfo(activity.value.id)
    } else {
      ElMessage.warning(result.message || '取消报名失败')
    }

  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消报名失败：', error)
      ElMessage.error('取消报名请求失败，请检查后端')
    }
  } finally {
    submitting.value = false
  }
}

// 格式化时间
function formatTime(time) {
  if (!time) return '暂未填写'
  return String(time).replace('T', ' ').slice(0, 16)
}

onMounted(() => {
  loadActivity()
})
</script>

<template>
  <div class="detail-page">
    <el-button @click="router.back()" class="back-button">
      返回活动列表
    </el-button>

    <div v-if="loading" class="message">
      正在加载活动详情...
    </div>

    <el-empty
        v-else-if="errorMessage"
        :description="errorMessage"
    />

    <el-card v-else-if="activity" class="detail-card">
      <div class="detail-header">
        <h2>{{ activity.title }}</h2>
        <el-tag type="success">
          {{ activity.status === 'ACTIVE' ? '报名中' : activity.status }}
        </el-tag>
      </div>

      <el-divider />

      <div class="detail-item">
        <span class="label">活动主办方：</span>
        <span>{{ activity.organizer }}</span>
      </div>

      <div class="detail-item">
        <span class="label">活动地点：</span>
        <span>{{ activity.location || '暂未填写' }}</span>
      </div>

      <div class="detail-item">
        <span class="label">开始时间：</span>
        <span>{{ formatTime(activity.startTime) }}</span>
      </div>

      <div class="detail-item">
        <span class="label">结束时间：</span>
        <span>{{ formatTime(activity.endTime) }}</span>
      </div>

      <div class="detail-item">
        <span class="label">活动人数上限：</span>
        <span>{{ activity.capacity }} 人</span>
      </div>

      <div class="detail-item">
        <span class="label">已报名人数：</span>
        <span>{{ signed }} 人</span>
      </div>

      <div class="detail-item">
        <span class="label">剩余名额：</span>
        <span>{{ remaining }} 人</span>
      </div>

      <el-progress
          :percentage="activity.capacity > 0
          ? Math.min(100, Math.round(signed / activity.capacity * 100))
          : 0"
          :stroke-width="12"
      />

      <el-divider />

      <h3>活动介绍</h3>

      <p class="description">
        {{ activity.description || '暂无活动介绍' }}
      </p >

      <el-button
          v-if="!hasRegistered"
          type="primary"
          size="large"
          class="register-button"
          :loading="submitting"
          :disabled="remaining <= 0 || activity.status !== 'ACTIVE'"
          @click="registerActivity"
      >
        {{ remaining <= 0 ? '名额已满' : '立即报名' }}
      </el-button>

      <el-button
          v-else
          type="danger"
          size="large"
          class="register-button"
          :loading="submitting"
          @click="cancelActivity"
      >
        取消报名
      </el-button>

    </el-card>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
.back-button {
  margin-bottom: 18px;
}

.detail-card {
  border-radius: 12px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.detail-header h2 {
  margin: 0;
  font-size: 23px;
  color: var(--ink, #303133);
}

.detail-item {
  display: flex;
  margin: 18px 0;
  font-size: 15px;
  line-height: 1.6;
}

.label {
  width: 130px;
  flex-shrink: 0;
  color: var(--ink-2, #606266);
}

.description {
  line-height: 1.9;
  white-space: pre-wrap;
  color: var(--ink-2, #606266);
}
.message {
  padding: 40px;
  text-align: center;
}

.register-button {
  width: 100%;
  margin-top: 24px;
}
</style>