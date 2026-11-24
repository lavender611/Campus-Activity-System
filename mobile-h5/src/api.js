import { state, setDemoMode } from './store'
import { mockRequest } from './mock'
import { toast } from './ui'

// 手机端默认走相对路径 /api，由 Vite 代理转发到本机 8080 后端（同源，无跨域）
const BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '')
const TIMEOUT = 6000

class ApiError extends Error {}

function fallbackToDemo(path, options) {
  if (!state.demoMode) {
    setDemoMode(true)
    toast.warning('后端未连接，已自动使用演示数据')
  }
  return mockRequest(path, options)
}

async function request(path, options = {}) {
  if (state.demoMode) return mockRequest(path, options)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    const response = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal,
      ...options
    })

    const raw = await response.text()
    let data
    try {
      data = raw ? JSON.parse(raw) : null
    } catch {
      // 返回的不是 JSON：多半是代理报错或后端没启动
      throw new Error('后端返回格式异常')
    }

    if (!response.ok) {
      const message = data && (data.message || data.error)
      // 4xx 且带业务信息的按业务错误处理；5xx 或空响应体说明后端/代理不可用
      if (message && response.status < 500) throw new ApiError(message)
      throw new Error(`后端不可用（${response.status}）`)
    }

    if (data === null) throw new Error('后端返回空响应')
    return data
  } catch (error) {
    // 业务错误直接抛给页面；网络类错误则降级为演示数据
    if (error instanceof ApiError) throw error
    return fallbackToDemo(path, options)
  } finally {
    clearTimeout(timer)
  }
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
  cancel: (userId, activityId) => request(`/registrations/cancel/${userId}/${activityId}`, { method: 'PUT' }),
  reconnect: () => setDemoMode(false)
}
