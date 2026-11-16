<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ACTIVITIES, ROSTER } from '../store'

const route = useRoute()
const router = useRouter()

// 选中活动 id：优先路由参数，否则取第一个活动
const selectedId = ref(Number(route.query.id) || ACTIVITIES[0].id)

const activity = computed(() => ACTIVITIES.find((x) => x.id === selectedId.value) || ACTIVITIES[0])
const list = computed(() => ROSTER[activity.value.id] || [])

function onSelect(id) {
  selectedId.value = id
  router.replace({ name: 'roster', query: { id } })
}

// 导出名单为 CSV（前端 Blob 下载，不落库）
function exportRoster() {
  const head = ['姓名', '学号', '联系方式', '报名状态']
  const rows = list.value.map((r) => [r.name, r.sid, r.phone, r.status])
  const csv = [head, ...rows].map((r) => r.join(',')).join('\r\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `报名名单_${activity.value.title}.csv`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('名单已导出（CSV）')
}
</script>

<template>
  <div class="page-wrap">
    <div class="page-head roster-head">
      <div>
        <h2>报名名单</h2>
        <p>查看指定活动的报名学生，可导出名单（CSV）</p>
      </div>
      <el-button :icon="Download" @click="exportRoster">导出名单</el-button>
    </div>

    <div class="filter-row">
      <el-select :model-value="selectedId" class="roster-select" @change="onSelect">
        <el-option v-for="a in ACTIVITIES" :key="a.id" :label="a.title" :value="a.id" />
      </el-select>
      <span class="hint">当前活动已报名 {{ list.length }} 人</span>
    </div>

    <el-card>
      <el-table :data="list" stripe>
        <el-table-column label="姓名" prop="name" min-width="140" />
        <el-table-column label="学号" prop="sid" min-width="160" />
        <el-table-column label="联系方式" prop="phone" min-width="160" />
        <el-table-column label="报名状态" width="120">
          <template #default="{ row }">
            <el-tag type="success" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!list.length" description="该活动暂无报名记录" />
    </el-card>
  </div>
</template>

<style scoped>
.roster-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.roster-select {
  width: 320px;
}
.hint {
  font-size: 13px;
  color: var(--ink-3);
}
</style>
