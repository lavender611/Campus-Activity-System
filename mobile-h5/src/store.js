import { reactive } from 'vue'

// 与原 PC 版 store.js 保持同一套本地登录状态（localStorage: campusUser）
function loadUser() {
  try { return JSON.parse(localStorage.getItem('campusUser') || 'null') } catch { return null }
}

const saved = loadUser()

export const state = reactive({
  userId: saved?.id ?? null,
  userName: saved?.username ?? '',
  role: saved?.role === 'ADMIN' ? 'admin' : saved?.role === 'STUDENT' ? 'student' : '游客',
  demoMode: sessionStorage.getItem('campusDemoMode') === '1'
})

export function setUser(user) {
  state.userId = Number(user.id)
  state.userName = user.username
  state.role = user.role === 'ADMIN' ? 'admin' : 'student'
  localStorage.setItem('campusUser', JSON.stringify({ id: state.userId, username: state.userName, role: user.role }))
}

export function logout() {
  state.userId = null
  state.userName = ''
  state.role = '游客'
  localStorage.removeItem('campusUser')
}

// 后端不可达时切换到内置演示数据，避免手机上白屏
export function setDemoMode(on) {
  state.demoMode = !!on
  if (on) sessionStorage.setItem('campusDemoMode', '1')
  else sessionStorage.removeItem('campusDemoMode')
}
