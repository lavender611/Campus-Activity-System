<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { state, logout } from './store'
const router = useRouter()
function signOut() {
  logout()
  ElMessage.success('已退出登录')
  router.push('/list')
}
</script>
<template>
  <header class="nav">
    <div class="brand">校园活动报名管理系统</div>
    <router-link to="/list">活动列表</router-link>
    <router-link v-if="state.role==='student'" to="/mine">我的报名</router-link>
    <router-link v-if="state.role==='admin'" to="/manage">活动管理</router-link>
    <span>{{ state.userName || '游客' }}</span>
    <router-link v-if="state.role==='游客'" to="/login">登录</router-link>
    <el-button v-else size="small" plain @click="signOut">退出</el-button>
  </header>
  <router-view />
</template>
