<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { state } from './store'
import { ui, resolveConfirm } from './ui'

const route = useRoute()
const router = useRouter()

const TABS = [
  { path: '/list', label: '活动', icon: 'calendar', roles: ['student', 'admin', '游客'] },
  { path: '/mine', label: '我的报名', icon: 'ticket', roles: ['student'] },
  { path: '/manage', label: '活动管理', icon: 'grid', roles: ['admin'] },
  { path: '/me', label: '我的', icon: 'user', roles: ['student', 'admin', '游客'] }
]

const tabs = computed(() => TABS.filter((tab) => tab.roles.includes(state.role)))
const isTabPage = computed(() => tabs.value.some((tab) => tab.path === route.path))
const showTabs = computed(() => isTabPage.value)

const title = computed(() => {
  if (route.path === '/publish' && route.query.id) return '编辑活动'
  return route.meta.title || '校园活动报名'
})

function go(path) {
  if (route.path !== path) router.push(path)
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/list')
}
</script>

<template>
  <div class="app-shell">
    <header class="app-bar">
      <button v-if="!isTabPage" class="bar-back" type="button" aria-label="返回" @click="goBack">‹</button>
      <div class="bar-title">{{ title }}</div>
      <div class="bar-right">
        <span v-if="state.demoMode" class="demo-flag">演示数据</span>
        <span>{{ state.userName || '游客' }}</span>
      </div>
    </header>

    <main class="app-main" :class="{ 'with-tabbar': showTabs }">
      <router-view />
    </main>

    <nav v-if="showTabs" class="tabbar">
      <div class="tabbar-inner">
        <button
          v-for="tab in tabs"
          :key="tab.path"
          type="button"
          class="tab-item"
          :class="{ active: route.path === tab.path }"
          @click="go(tab.path)"
        >
          <svg v-if="tab.icon === 'calendar'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
          <svg v-else-if="tab.icon === 'ticket'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
            <path d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6Z" />
            <path d="M13 6v12" stroke-dasharray="3 3" />
          </svg>
          <svg v-else-if="tab.icon === 'grid'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
            <rect x="4" y="4" width="7" height="7" rx="2" />
            <rect x="13" y="4" width="7" height="7" rx="2" />
            <rect x="4" y="13" width="7" height="7" rx="2" />
            <rect x="13" y="13" width="7" height="7" rx="2" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
            <circle cx="12" cy="8" r="3.6" />
            <path d="M4.5 20c.8-3.8 3.8-5.6 7.5-5.6s6.7 1.8 7.5 5.6" />
          </svg>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </nav>

    <div class="toast-wrap">
      <div v-for="t in ui.toasts" :key="t.id" class="toast" :class="t.type">{{ t.message }}</div>
    </div>

    <div v-if="ui.confirm" class="mask" @click.self="resolveConfirm(false)">
      <div class="sheet">
        <h3>{{ ui.confirm.title }}</h3>
        <p>{{ ui.confirm.message }}</p>
        <div class="sheet-actions">
          <button type="button" class="btn btn-plain" @click="resolveConfirm(false)">取消</button>
          <button type="button" class="btn btn-primary" @click="resolveConfirm(true)">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
