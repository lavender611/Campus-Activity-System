<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api'
import { ElMessage } from 'element-plus'
const route=useRoute(), rows=ref([])
onMounted(async()=>{try{rows.value=await api.activityRegistrations(route.params.id)}catch(e){ElMessage.error(e.message)}})
</script>
<template>
  <main class="page">
    <h2>活动报名名单</h2>
    <div class="panel">
      <el-table :data="rows" stripe>
        <el-table-column prop="username" label="学生账号"/>
        <el-table-column prop="userId" label="用户ID"/>
        <el-table-column prop="registrationTime" label="报名时间"/>
        <el-table-column label="状态"><template #default="{row}"><el-tag :type="row.status==='REGISTERED'?'success':'info'">{{row.status==='REGISTERED'?'已报名':'已取消'}}</el-tag></template></el-table-column>
      </el-table>
      <el-empty v-if="!rows.length" description="该活动暂无报名记录"/>
    </div>
  </main>
</template>
