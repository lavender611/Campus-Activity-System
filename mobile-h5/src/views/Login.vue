<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'
import { setUser } from '../store'
import { toast } from '../ui'

const router = useRouter()
const loading = ref(false)
const form = reactive({ username: 'student01', password: '123456' })

function fill(username) {
  form.username = username
  form.password = '123456'
}

async function submit() {
  if (!form.username.trim() || !form.password) return toast.warning('请输入账号和密码')
  loading.value = true
  try {
    const result = await api.login({ username: form.username.trim(), password: form.password })
    if (!result.success || !result.user) return toast.error(result.message || '登录失败')
    setUser(result.user)
    toast.success(`登录成功，用户ID：${result.user.id}`)
    router.push(result.user.role === 'ADMIN' ? '/manage' : '/list')
  } catch (e) {
    toast.error(e.message || '无法连接后端')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-wrap">
    <div class="login-brand">
      <div class="logo">🎓</div>
      <h2>校园活动报名</h2>
      <p>学生与管理员使用数据库账号登录</p>
    </div>

    <div class="card">
      <div class="field">
        <label class="field-label" for="username">账号</label>
        <input id="username" v-model="form.username" type="text" autocomplete="username" placeholder="请输入账号" />
      </div>

      <div class="field">
        <label class="field-label" for="password">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          placeholder="请输入密码"
          @keyup.enter="submit"
        />
      </div>

      <div class="quick-fill">
        <button type="button" class="chip" :class="{ active: form.username === 'student01' }" @click="fill('student01')">学生账号</button>
        <button type="button" class="chip" :class="{ active: form.username === 'admin' }" @click="fill('admin')">管理员账号</button>
      </div>

      <button type="button" class="btn btn-primary btn-block" :disabled="loading" @click="submit">
        {{ loading ? '登录中…' : '登录' }}
      </button>

      <p class="field-hint" style="margin-top: 12px; text-align: center">
        student01 / 123456（学生）；admin / 123456（管理员）
      </p>
    </div>
  </div>
</template>
