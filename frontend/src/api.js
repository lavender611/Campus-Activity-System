const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    })
  } catch {
    // 后端没启动、端口不对，或浏览器因 CORS 拦截，fetch 只会抛 TypeError
    throw new Error(`无法连接后端服务（${BASE}），请确认后端已在 8080 端口启动`)
  }

  const text = await response.text()
  let data = null
  if (text) {
    try { data = JSON.parse(text) } catch { data = null }
  }

  if (!response.ok) {
    throw new Error((data && data.message) || `请求失败：HTTP ${response.status}`)
  }
  if (data === null) {
    throw new Error('后端返回了空响应，请检查后端日志')
  }
  return data
}

export const api = {
  login: (body) => request('/users/login', { method: 'POST', body: JSON.stringify(body) }),
  activities: () => request('/activities'),
  activity: (id) => request(`/activities/${id}`),
  createActivity: (body) => request('/activities', { method: 'POST', body: JSON.stringify(body) }),
  updateActivity: (id, body) => request(`/activities/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteActivity: (id) => request(`/activities/${id}`, { method: 'DELETE' }),
  registrations: () => request('/registrations'),
  myRegistrations: (userId) => request(`/registrations/user/${userId}`),
  activityRegistrations: (id) => request(`/registrations/activity/${id}`),
  count: (id) => request(`/registrations/count/${id}`),
  register: (body) => request('/registrations', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (userId, activityId) => request(`/registrations/cancel/${userId}/${activityId}`, { method: 'PUT' })
}
