<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api'
import { formatDateTime } from '../format'
import { ElMessage } from 'element-plus'

const route = useRoute()
const rows = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try { rows.value = await api.activityRegistrations(route.params.id) }
  catch (e) { ElMessage.error(e.message) }
  finally { loading.value = false }
})
</script>

<template>
  <main class="page">
    <h2>活动报名名单</h2>
    <div class="panel">
      <el-table :data="rows" stripe v-loading="loading">
        <el-table-column prop="username" label="学生账号" />
        <el-table-column prop="userId" label="用户ID" />
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
      </el-table>
      <el-empty v-if="!rows.length && !loading" description="该活动暂无报名记录" />
    </div>
  </main>
</template>
