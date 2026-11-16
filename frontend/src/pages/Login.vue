<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { state, seedStudentSignup } from '../store'

const router = useRouter()
const mode = ref('login') // login / reg

// 表单数据与校验规则
const form = reactive({
  name: '',
  account: '',
  password: '',
  password2: '',
  role: 'student'
})

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const formRef = ref()

function switchMode(m) {
  mode.value = m
}

function pickRole(r) {
  form.role = r
}

async function onSubmit() {
  await formRef.value.validate()
  if (mode.value === 'reg') {
    if (!form.name.trim()) {
      ElMessage.warning('请输入姓名或昵称')
      return
    }
    if (form.password !== form.password2) {
      ElMessage.warning('两次输入的密码不一致')
      return
    }
  }

  state.userName = mode.value === 'reg' ? form.name.trim() : form.account.trim()
  // 演示模式：注册身份按选择；登录账号含 admin 视为管理员
  state.role = mode.value === 'reg' ? form.role : form.account.indexOf('admin') >= 0 ? 'admin' : 'student'
  seedStudentSignup()

  ElMessage.success(state.role === 'admin' ? '登录成功，进入管理后台' : '登录成功，欢迎回来')
  router.push(state.role === 'admin' ? { name: 'manage' } : { name: 'list' })
}
</script>

<template>
  <div class="auth-wrap">
    <el-card class="auth-card">
      <template #header>
        <div class="auth-title">{{ mode === 'login' ? '登录系统' : '注册账号' }}</div>
        <div class="auth-sub">校园活动报名管理系统 · 学生与管理员两类角色</div>
      </template>

      <el-tabs v-model="mode" @tab-change="switchMode">
        <el-tab-pane label="登录" name="login" />
        <el-tab-pane label="注册" name="reg" />
      </el-tabs>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="onSubmit">
        <el-form-item v-if="mode === 'reg'" label="姓名 / 昵称">
          <el-input v-model="form.name" placeholder="请输入姓名或昵称" />
        </el-form-item>

        <el-form-item label="账号（学号 / 工号）" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>

        <el-form-item v-if="mode === 'reg'" label="确认密码">
          <el-input v-model="form.password2" type="password" show-password placeholder="请再次输入密码" />
        </el-form-item>

        <el-form-item v-if="mode === 'reg'" label="注册身份">
          <el-radio-group v-model="form.role">
            <el-radio value="student">学生</el-radio>
            <el-radio value="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-button type="primary" class="submit-btn" @click="onSubmit">
          {{ mode === 'reg' ? '注册并登录' : '登录' }}
        </el-button>
        <div class="hint">演示原型：任意账号密码即可提交，不连接真实后端</div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.auth-wrap {
  display: grid;
  place-items: center;
  padding: 40px 0;
}
.auth-card {
  width: 100%;
  max-width: 420px;
}
.auth-title {
  font-size: 19px;
  font-weight: 700;
}
.auth-sub {
  font-size: 13px;
  color: var(--ink-3);
  margin-top: 4px;
}
.submit-btn {
  width: 100%;
  padding: 12px 0;
}
.hint {
  text-align: center;
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 12px;
}
</style>
