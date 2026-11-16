<script setup>
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ACTIVITIES, state, activityStatus } from '../store'

const router = useRouter()

function openPublish() {
  router.push({ name: 'publish' })
}

function openEdit(row) {
  router.push({ name: 'publish', query: { id: row.id } })
}

async function removeActivity(row) {
  try {
    await ElMessageBox.confirm(
      `确定删除「${row.title}」吗？删除后相关报名记录将一并移除，此操作不可恢复。`,
      '删除活动',
      { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' }
    )
    const idx = ACTIVITIES.findIndex((x) => x.id === row.id)
    ACTIVITIES.splice(idx, 1)
    state.mySignups = state.mySignups.filter((s) => s.activityId !== row.id)
    ElMessage.success('活动已删除')
  } catch {
    // 取消弹窗
  }
}
</script>

<template>
  <div class="page-wrap">
    <div class="page-head manage-head">
      <div>
        <h2>活动管理</h2>
        <p>维护已发布活动，可修改信息或删除活动</p>
      </div>
      <el-button type="primary" @click="openPublish">发布新活动</el-button>
    </div>

    <el-card>
      <el-table :data="ACTIVITIES" stripe>
        <el-table-column label="活动名称" min-width="240">
          <template #default="{ row }">
            <div class="t-main">{{ row.title }}</div>
            <div class="t-sub">{{ row.category }} · {{ row.organizer }}</div>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startAt" min-width="160" />
        <el-table-column label="报名人数" min-width="120">
          <template #default="{ row }">{{ row.signed }} / {{ row.capacity }}</template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="activityStatus(row).type" effect="light">{{ activityStatus(row).text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">修改</el-button>
            <el-button link type="danger" @click="removeActivity(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.manage-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.t-main {
  color: var(--ink);
  font-weight: 600;
}
.t-sub {
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 2px;
}
</style>
