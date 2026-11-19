import { reactive } from 'vue'

function loadUser() {
  try { return JSON.parse(localStorage.getItem('campusUser') || 'null') } catch { return null }
}

function normalizeRole(role) {
  if (role === 'ADMIN') return 'admin'
  if (role === 'STUDENT') return 'student'
  return '游客'
}

const saved = loadUser()
export const state = reactive({
  userId: saved?.id ?? null,
  userName: saved?.username ?? '',
  role: normalizeRole(saved?.role)
})

export function setUser(user) {
  state.userId = Number(user.id)
  state.userName = user.username
  state.role = normalizeRole(user.role)
  localStorage.setItem('campusUser', JSON.stringify({ id: state.userId, username: state.userName, role: user.role }))
}

export function logout() {
  state.userId = null
  state.userName = ''
  state.role = '游客'
  localStorage.removeItem('campusUser')
}
