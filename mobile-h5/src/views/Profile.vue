<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { state, logout } from '../store'
import { api } from '../api'
import { resetMockData } from '../mock'
import { toast, askConfirm } from '../ui'

const router = useRouter()

const roleText = computed(() =>
  state.role === 'admin' ? '管理员' : state.role === 'student' ? '学生' : '未登录游客'
)

const initial = computed(() => (state.userName || '游').slice(0, 1).toUpperCase())

async function signOut() {
  const ok = await askConfirm('确定退出当前账号吗？', '退出登录')
  if (!ok) return
  logout()
  toast.success('已退出登录')
  router.push('/list')
}

function retryBackend() {
  api.reconnect()
  toast('正在尝试重新连接后端…')
  setTimeout(() => window.location.reload(), 400)
}

async function resetDemo() {
  const ok = await askConfirm('将清空演示数据（活动与报名记录）并恢复初始示例，确定继续吗？', '重置演示数据')
  if (!ok) return
  resetMockData()
  toast.success('演示数据已重置')
  setTimeout(() => window.location.reload(), 600)
}
</script>

<template>
  <div>
    <section class="profile-card">
      <div style="display: flex; align-items: center; gap: 14px">
        <div class="avatar-lg">{{ initial }}</div>
        <div>
          <div class="name">{{ state.userName || '未登录' }}</div>
          <div class="role">{{ roleText }}<span v-if="state.userId"> · ID {{ state.userId }}</span></div>
        </div>
      </div>
    </section>

    <div class="card" style="margin-top: 12px">
      <div class="profile-row">
        <span class="k">数据来源</span>
        <span>
          <span v-if="state.demoMode" class="tag orange">演示数据</span>
          <span v-else class="tag green">后端接口</span>
        </span>
      </div>
      <div class="profile-row">
        <span class="k">登录状态</span>
        <span>{{ state.userId ? '已登录' : '未登录' }}</span>
      </div>
      <div class="profile-row">
        <span class="k">账号角色</span>
        <span>{{ roleText }}</span>
      </div>
    </div>

    <div class="section-label">快捷入口</div>
    <div class="card" style="padding: 4px 15px">
      <div class="profile-row" style="cursor: pointer" @click="router.push('/list')">
        <span>浏览全部活动</span><span style="color: var(--muted)">›</span>
      </div>
      <div v-if="state.role === 'student'" class="profile-row" style="cursor: pointer" @click="router.push('/mine')">
        <span>我的报名记录</span><span style="color: var(--muted)">›</span>
      </div>
      <div v-if="state.role === 'admin'" class="profile-row" style="cursor: pointer" @click="router.push('/manage')">
        <span>活动管理与名单</span><span style="color: var(--muted)">›</span>
      </div>
      <div v-if="!state.userId" class="profile-row" style="cursor: pointer" @click="router.push('/login')">
        <span>登录账号</span><span style="color: var(--muted)">›</span>
      </div>
    </div>

    <div class="section-label">演示设置</div>
    <div class="card" style="padding: 4px 15px">
      <div class="profile-row" style="cursor: pointer" @click="retryBackend">
        <span>重新连接后端</span><span style="color: var(--muted); font-size: 12px">{{ state.demoMode ? '当前用演示数据' : '连接正常' }}</span>
      </div>
      <div class="profile-row" style="cursor: pointer" @click="resetDemo">
        <span>重置演示数据</span><span style="color: var(--muted)">›</span>
      </div>
    </div>

    <button v-if="state.userId" type="button" class="btn btn-danger btn-block" style="margin-top: 18px" @click="signOut">退出登录</button>
    <button v-else type="button" class="btn btn-primary btn-block" style="margin-top: 18px" @click="router.push('/login')">去登录</button>

    <p class="field-hint" style="text-align: center; margin-top: 14px">
      演示提示：若手机未连上后端，将自动使用内置演示数据，所有操作只保存在本机浏览器。
    </p>
  </div>
</template>
