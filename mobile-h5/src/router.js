import { createRouter, createWebHashHistory } from 'vue-router'
import { state } from './store'
import Login from './views/Login.vue'
import ActivityList from './views/ActivityList.vue'
import ActivityDetail from './views/ActivityDetail.vue'
import MyRegistrations from './views/MyRegistrations.vue'
import ActivityManage from './views/ActivityManage.vue'
import ActivityForm from './views/ActivityForm.vue'
import SignupRoster from './views/SignupRoster.vue'
import Profile from './views/Profile.vue'

const routes = [
  { path: '/', redirect: '/list' },
  { path: '/login', component: Login, meta: { title: '登录' } },
  { path: '/list', component: ActivityList, meta: { title: '校园活动' } },
  { path: '/detail/:id', component: ActivityDetail, meta: { title: '活动详情' } },
  { path: '/mine', component: MyRegistrations, meta: { title: '我的报名', student: true } },
  { path: '/manage', component: ActivityManage, meta: { title: '活动管理', admin: true } },
  { path: '/publish', component: ActivityForm, meta: { title: '发布活动', admin: true } },
  { path: '/roster/:id', component: SignupRoster, meta: { title: '报名名单', admin: true } },
  { path: '/me', component: Profile, meta: { title: '个人中心' } }
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to) => {
  if (to.meta.admin && state.role !== 'admin') return '/login'
  if (to.meta.student && state.role !== 'student') return '/login'
})

export default router
