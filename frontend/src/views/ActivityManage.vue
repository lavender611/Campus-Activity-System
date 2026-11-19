<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const rows = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  try { rows.value = await api.activities() }
  catch (e) { ElMessage.error(e.message) }
  finally { loading.value = false }
}

async function remove(row) {
  try {
    await ElMessageBox.confirm(`确定删除活动“${row.title}”吗？删除后相关报名记录也会删除。`, '确认删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })
    const r = await api.deleteActivity(row.id)
    ElMessage[r.success ? 'success' : 'error'](r.message)
    await load()
  } catch (e) {
    // ElMessageBox 取消时抛出的是 'cancel' / 'close' 字符串，不是 Error
    if (e !== 'cancel' && e !== 'close') {
      ElMessage.error(e?.message || '删除失败')
    }
  }
}

onMounted(load)
</script>

<template>
  <main class="page">
    <div class="toolbar">
      <h2 style="margin-right:auto">活动管理</h2>
      <el-button type="primary" @click="$router.push('/publish')">发布活动</el-button>
      <el-button :loading="loading" @click="load">刷新</el-button>
    </div>
    <div class="panel">
      <el-table :data="rows" stripe v-loading="loading">
        <el-table-column prop="title" label="活动名称" min-width="160" />
        <el-table-column prop="category" label="类别" />
        <el-table-column prop="location" label="地点" />
        <el-table-column prop="registeredCount" label="报名人数" />
        <el-table-column prop="capacity" label="名额" />
        <el-table-column label="操作" width="240">
          <template #default="{ row }">
            <el-button link type="primary" @click="$router.push({ path: '/publish', query: { id: row.id } })">编辑</el-button>
            <el-button link type="success" @click="$router.push(`/roster/${row.id}`)">报名名单</el-button>
            <el-button link type="danger" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!rows.length && !loading" description="还没有活动，点击右上角发布活动" />
    </div>
  </main>
</template>
