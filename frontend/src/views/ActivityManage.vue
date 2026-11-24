<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'
const rows = ref([])
async function load(){ try{ rows.value=await api.activities() }catch(e){ElMessage.error(e.message)} }
async function remove(row){
  try { await ElMessageBox.confirm(`确定删除活动“${row.title}”吗？删除后相关报名记录也会删除。`,'确认删除'); const r=await api.deleteActivity(row.id); ElMessage[r.success?'success':'error'](r.message); await load() } catch(e) { if(e!=='cancel') ElMessage.error(e.message) }
}
onMounted(load)
</script>
<template>
  <main class="page">
    <div class="toolbar"><h2 style="margin-right:auto">活动管理</h2><el-button type="primary" @click="$router.push('/publish')">发布活动</el-button><el-button @click="load">刷新</el-button></div>
    <div class="panel">
      <el-table :data="rows" stripe>
        <el-table-column prop="title" label="活动名称" min-width="160"/>
        <el-table-column prop="category" label="类别"/>
        <el-table-column prop="location" label="地点"/>
        <el-table-column prop="registeredCount" label="报名人数"/>
        <el-table-column prop="capacity" label="名额"/>
        <el-table-column label="操作" width="240">
          <template #default="{row}">
            <el-button link type="primary" @click="$router.push({path:'/publish',query:{id:row.id}})">编辑</el-button>
            <el-button link type="success" @click="$router.push(`/roster/${row.id}`)">报名名单</el-button>
            <el-button link type="danger" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </main>
</template>
