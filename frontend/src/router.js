import { createRouter, createWebHistory } from 'vue-router'
import { state } from './store'
import Login from './views/Login.vue'
import ActivityList from './views/ActivityList.vue'
import ActivityDetail from './views/ActivityDetail.vue'
import MyRegistrations from './views/MyRegistrations.vue'
import ActivityManage from './views/ActivityManage.vue'
import ActivityForm from './views/ActivityForm.vue'
import SignupRoster from './views/SignupRoster.vue'

const routes = [
  { path: '/', redirect: '/list' },
  { path: '/login', component: Login },
  { path: '/list', component: ActivityList },
  { path: '/detail/:id', component: ActivityDetail },
  { path: '/mine', component: MyRegistrations, meta: { student: true } },
  { path: '/manage', component: ActivityManage, meta: { admin: true } },
  { path: '/publish', component: ActivityForm, meta: { admin: true } },
  { path: '/roster/:id', component: SignupRoster, meta: { admin: true } },
  // 兜底：地址写错时回到列表，而不是白屏
  { path: '/:pathMatch(.*)*', redirect: '/list' }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  if (to.meta.admin && state.role !== 'admin') return '/login'
  if (to.meta.student && state.role !== 'student') {
    return state.role === 'admin' ? '/manage' : '/login'
  }
  return true
})

export default router
