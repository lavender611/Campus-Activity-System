// 登录状态：与 PC 版 / 手机 H5 版使用同一套字段（id、username、role）
const KEY_USER = 'campusUser'
const KEY_DEMO = 'campusDemoMode'

let saved = null
try {
  saved = wx.getStorageSync(KEY_USER) || null
} catch (e) {
  saved = null
}

const state = {
  userId: saved && saved.id != null ? Number(saved.id) : null,
  userName: (saved && saved.username) || '',
  role: saved && saved.role === 'ADMIN' ? 'admin' : saved && saved.role === 'STUDENT' ? 'student' : '游客',
  demoMode: false
}

try {
  state.demoMode = wx.getStorageSync(KEY_DEMO) === '1'
} catch (e) {
  state.demoMode = false
}

function setUser(user) {
  state.userId = Number(user.id)
  state.userName = user.username
  state.role = user.role === 'ADMIN' ? 'admin' : 'student'
  try {
    wx.setStorageSync(KEY_USER, { id: state.userId, username: state.userName, role: user.role })
  } catch (e) {}
}

function logout() {
  state.userId = null
  state.userName = ''
  state.role = '游客'
  try {
    wx.removeStorageSync(KEY_USER)
  } catch (e) {}
}

// 后端不可达时切到内置演示数据，避免白屏
function setDemoMode(on) {
  state.demoMode = !!on
  try {
    if (on) wx.setStorageSync(KEY_DEMO, '1')
    else wx.removeStorageSync(KEY_DEMO)
  } catch (e) {}
}

module.exports = { state, setUser, logout, setDemoMode }
