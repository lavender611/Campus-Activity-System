const BASE = 'http://localhost:8080/api'
async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || `请求失败：${response.status}`)
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
