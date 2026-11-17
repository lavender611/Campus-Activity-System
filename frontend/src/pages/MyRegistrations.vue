
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const registrations = ref([])
const loading = ref(false)
const errorMessage = ref('')

// 当前测试用户 ID
const userId = 1

// 查询个人报名记录
async function loadRegistrations() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
        `http://localhost:8080/api/registrations/user/${userId}`
    )

    if (!response.ok) {
      throw new Error('获取报名记录失败')
    }

    registrations.value = await response.json()
  } catch (error) {
    errorMessage.value = '加载失败，请检查后端是否启动'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 返回活动列表
function goBack() {
  router.push('/list')
}

// 页面加载时查询
onMounted(() => {
  loadRegistrations()
})
</script>

<template>
  <div class="page">
    <div class="header">
      <h2>我的报名记录</h2>
      <el-button @click="goBack">返回活动列表</el-button>
    </div>

    <div v-if="loading" class="message">
      正在加载报名记录...
    </div>

    <div v-else-if="errorMessage" class="message error">
      {{ errorMessage }}
      <el-button @click="loadRegistrations">重新加载</el-button>
    </div>

    <div v-else-if="registrations.length === 0" class="message">
      暂无报名记录
    </div>

    <div v-else class="registration-list">
      <el-card
          v-for="item in registrations"
          :key="item.id"
          class="registration-card"
      >
        <h3>活动 ID：{{ item.activityId }}</h3>

        <p>
          报名时间：
          {{ item.registrationTime || '暂无数据' }}
        </p >

        <p>
          报名状态：
          <el-tag
              :type="item.status === 'REGISTERED' ? 'success' : 'info'"
          >
            {{ item.status === 'REGISTERED' ? '报名成功' : '已取消' }}
          </el-tag>
        </p >
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.registration-card {
  margin-bottom: 15px;
}

.message {
  padding: 30px;
  text-align: center;
  color: #666;
}

.error {
  color: #f56c6c;
}
</style>