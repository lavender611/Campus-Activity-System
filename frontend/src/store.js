import { reactive } from 'vue'

function loadUser() {
  try { return JSON.parse(localStorage.getItem('campusUser') || 'null') } catch { return null }
}
const saved = loadUser()
export const state = reactive({
  userId: saved?.id ?? null,
  userName: saved?.username ?? '',
  role: saved?.role === 'ADMIN' ? 'admin' : saved?.role === 'STUDENT' ? 'student' : '游客'
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
