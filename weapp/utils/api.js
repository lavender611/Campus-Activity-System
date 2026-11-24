// 接口层：与 H5 版完全同一套接口约定，后端不可用时自动降级为演示数据
const config = require('./config')
const store = require('./store')
const mock = require('./mock')
const toast = require('./toast').toast

const BASE = String(config.baseUrl || '').replace(/\/$/, '')
const TIMEOUT = 6000

function fallback(path, options) {
  if (!store.state.demoMode) {
    store.setDemoMode(true)
    toast.warning('后端未连接，已自动使用演示数据')
  }
  return mock.mockRequest(path, options)
}

function request(path, options) {
  options = options || {}

  // 离线模式：不发任何网络请求，直接用内置数据，秒开
  if (config.offline) {
    if (!store.state.demoMode) store.setDemoMode(true)
    return mock.mockRequest(path, options)
  }

  if (store.state.demoMode) {
    return mock.mockRequest(path, options)
  }

  return new Promise(function (resolve, reject) {
    wx.request({
      url: BASE + path,
      method: String(options.method || 'GET').toUpperCase(),
      header: Object.assign({ 'Content-Type': 'application/json' }, options.header || {}),
      data: options.body ? JSON.parse(options.body) : undefined,
      timeout: TIMEOUT,
      success: function (res) {
        let data = res.data
        if (typeof data === 'string') {
          try {
            data = data ? JSON.parse(data) : null
          } catch (e) {
            // 返回的不是 JSON：多半是后端没起来或地址不对
            resolve(fallback(path, options))
            return
          }
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          const message = data && (data.message || data.error)
          // 4xx 且带业务信息按业务错误抛给页面；5xx 或空响应体说明后端不可用
          if (message && res.statusCode < 500) {
            reject(new Error(message))
            return
          }
          resolve(fallback(path, options))
          return
        }

        if (data === null || data === undefined) {
          resolve(fallback(path, options))
          return
        }
        resolve(data)
      },
      fail: function () {
        resolve(fallback(path, options))
      }
    })
  })
}

const api = {
  login: function (body) {
    return request('/users/login', { method: 'POST', body: JSON.stringify(body) })
  },
  activities: function () {
    return request('/activities')
  },
  activity: function (id) {
    return request('/activities/' + id)
  },
  createActivity: function (body) {
    return request('/activities', { method: 'POST', body: JSON.stringify(body) })
  },
  updateActivity: function (id, body) {
    return request('/activities/' + id, { method: 'PUT', body: JSON.stringify(body) })
  },
  deleteActivity: function (id) {
    return request('/activities/' + id, { method: 'DELETE' })
  },
  myRegistrations: function (userId) {
    return request('/registrations/user/' + userId)
  },
  activityRegistrations: function (id) {
    return request('/registrations/activity/' + id)
  },
  count: function (id) {
    return request('/registrations/count/' + id)
  },
  register: function (body) {
    return request('/registrations', { method: 'POST', body: JSON.stringify(body) })
  },
  cancel: function (userId, activityId) {
    return request('/registrations/cancel/' + userId + '/' + activityId, { method: 'PUT' })
  },
  reconnect: function () {
    if (config.offline) return
    store.setDemoMode(false)
  }
}

module.exports = { api: api, BASE: BASE }
