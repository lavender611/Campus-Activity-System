import { createRouter, createWebHashHistory } from 'vue-router'
import { state } from '../store'

// 页面路由表：路径 / 组件 / 角色要求
const routes = [
  { path: '/', redirect: '/list' },
  { path: '/list', name: 'list', component: () => import('../pages/ActivityList.vue'), meta: { role: null } },
  { path: '/detail/:id', name: 'detail', component: () => import('../pages/ActivityDetail.vue'), meta: { role: null } },
  { path: '/login', name: 'login', component: () => import('../pages/Login.vue'), meta: { role: null } },
  { path: '/mine', name: 'mine', component: () => import('../pages/MySignups.vue'), meta: { role: 'student' } },
  { path: '/publish', name: 'publish', component: () => import('../pages/PublishActivity.vue'), meta: { role: 'admin' } },
  { path: '/manage', name: 'manage', component: () => import('../pages/ActivityManage.vue'), meta: { role: 'admin' } },
  { path: '/roster', name: 'roster', component: () => import('../pages/SignupRoster.vue'), meta: { role: 'admin' } },
  { path: '/analytics', name: 'analytics', component: () => import('../pages/Analytics.vue'), meta: { role: 'admin' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫：专属页面按角色拦截；游客访问受限页先跳登录
router.beforeEach((to) => {
  const need = to.meta.role
  if (!need) return true
  if (state.role === '游客') {
    return { name: 'login' }
  }
  if (state.role !== need) {
    return { name: 'list' }
  }
  return true
})

export default router
