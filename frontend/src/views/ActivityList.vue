<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api'
import { formatDateTime } from '../format'
import { ElMessage } from 'element-plus'

const items = ref([])
const loading = ref(false)
const keyword = ref('')
const category = ref('全部')
const categories = ['全部', '学术讲座', '文艺体育', '志愿服务', '社会实践']

const filtered = computed(() => {
  const kw = keyword.value.trim()
  return items.value.filter((a) =>
    (category.value === '全部' || a.category === category.value) &&
    (!kw || `${a.title || ''}${a.description || ''}${a.location || ''}`.includes(kw))
  )
})

async function load() {
  loading.value = true
  try { items.value = await api.activities() }
  catch (e) { ElMessage.error(e.message) }
  finally { loading.value = false }
}

onMounted(load)
</script>

<template>
  <main class="page">
    <div class="toolbar">
      <h2 style="margin-right:auto">活动列表</h2>
      <el-input v-model="keyword" placeholder="搜索活动名称或地点" clearable style="width:220px" />
      <el-select v-model="category" style="width:150px">
        <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
      </el-select>
      <el-button :loading="loading" @click="load">刷新</el-button>
    </div>
    <div v-if="!filtered.length" class="panel">{{ loading ? '正在加载...' : '暂无符合条件的活动' }}</div>
    <div class="grid">
      <div v-for="a in filtered" :key="a.id" class="card">
        <h3>{{ a.title }}</h3>
        <el-tag>{{ a.category }}</el-tag>
        <p>{{ a.description }}</p>
        <p class="muted">地点：{{ a.location }}</p>
        <p class="muted">开始：{{ formatDateTime(a.startTime) }}</p>
        <p class="muted">报名：{{ a.registeredCount || 0 }} / {{ a.capacity }}</p>
        <el-button type="primary" @click="$router.push(`/detail/${a.id}`)">查看详情</el-button>
      </div>
    </div>
  </main>
</template>
