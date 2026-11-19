<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { api } from '../api'
import { setUser } from '../store'
const router = useRouter()
const loading = ref(false)
const form = reactive({ username: 'student01', password: '123456' })
async function submit() {
  if (!form.username.trim() || !form.password) return ElMessage.warning('请输入账号和密码')
  loading.value = true
  try {
    const result = await api.login({ username: form.username.trim(), password: form.password })
    if (!result.success || !result.user) return ElMessage.error(result.message || '登录失败')
    setUser(result.user)
    ElMessage.success(`登录成功，用户ID：${result.user.id}`)
    router.push(result.user.role === 'ADMIN' ? '/manage' : '/list')
  } catch (e) { ElMessage.error(e.message || '无法连接后端') }
  finally { loading.value = false }
}
</script>
<template>
  <div class="page" style="max-width:480px;margin-top:70px">
    <div class="panel">
      <h2>系统登录</h2>
      <p class="muted">学生与管理员使用数据库账号登录</p>
      <el-form label-position="top" @submit.prevent="submit">
        <el-form-item label="账号"><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="form.password" type="password" show-password @keyup.enter="submit" /></el-form-item>
        <el-button type="primary" :loading="loading" style="width:100%" @click="submit">登录</el-button>
      </el-form>
      <p class="muted">学生：student01 / 123456；管理员：admin / 123456</p>
    </div>
  </div>
</template>
