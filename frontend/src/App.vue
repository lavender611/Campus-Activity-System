<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { state, logout } from './store'

const router = useRouter()
const route = useRoute()

// 按角色生成导航项：学生侧 / 管理员侧
const navItems = computed(() => {
  if (state.role === 'admin') {
    return [
      { name: 'list', label: '活动列表' },
      { name: 'manage', label: '活动管理' },
      { name: 'roster', label: '报名名单' },
      { name: 'analytics', label: '数据分析' }
    ]
  }
  return [
    { name: 'list', label: '活动列表' },
    { name: 'mine', label: '我的报名' }
  ]
})

const roleText = computed(() => {
  if (state.role === 'admin') return '管理员'
  if (state.role === 'student') return '学生'
  return '游客'
})

function onLogout() {
  logout()
  ElMessage.success('已退出登录')
  router.push({ name: 'list' })
}
</script>

<template>
  <el-container class="app-shell">
    <el-header class="topbar" height="60px">
      <div class="topbar-inner">
        <router-link :to="{ name: 'list' }" class="brand">
          <el-icon :size="18" color="#fff"><Calendar /></el-icon>
          <span>校园活动报名管理系统</span>
        </router-link>

        <el-menu
          class="nav"
          mode="horizontal"
          :ellipsis="false"
          :default-active="route.name"
          router
        >
          <el-menu-item v-for="item in navItems" :key="item.name" :index="item.name">
            <router-link :to="{ name: item.name }">{{ item.label }}</router-link>
          </el-menu-item>
        </el-menu>

        <div class="nav-side">
          <template v-if="state.role === '游客'">
            <el-button type="primary" @click="router.push({ name: 'login' })">登录 / 注册</el-button>
          </template>
          <template v-else>
            <el-tag effect="plain">{{ roleText }} · {{ state.userName }}</el-tag>
            <el-button text @click="onLogout">退出</el-button>
          </template>
        </div>
      </div>
    </el-header>

    <el-main class="app-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}
.topbar {
  background: #fff;
  border-bottom: 1px solid var(--line);
  padding: 0 24px;
}
.topbar-inner {
  max-width: 1120px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 700;
  font-size: 17px;
  color: var(--ink);
  white-space: nowrap;
}
.nav {
  flex: 1;
  border-bottom: none;
  background: transparent;
}
.nav-side {
  display: flex;
  align-items: center;
  gap: 10px;
}
.app-main {
  padding: 0;
  background: var(--bg);
}
@media (max-width: 768px) {
  .topbar {
    padding: 0 16px;
  }
  .brand span {
    display: none;
  }
}
</style>
