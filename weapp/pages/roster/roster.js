const api = require('../../utils/api').api
const store = require('../../utils/store')
const fmt = require('../../utils/format')
const toast = require('../../utils/toast').toast

function decorate(r) {
  const name = r.username || '学生'
  return {
    id: r.id,
    userId: r.userId,
    username: name,
    initial: String(name).slice(0, 1).toUpperCase(),
    regText: fmt.fmtShort(r.registrationTime),
    statusText: fmt.statusText(r.status),
    statusClass: r.status === 'REGISTERED' ? 'green' : 'gray'
  }
}

Page({
  data: {
    id: null,
    rows: [],
    loading: false,
    role: '游客',
    userName: '',
    demoMode: false
  },

  onLoad: function (options) {
    this.setData({
      id: options && options.id ? options.id : null,
      role: store.state.role,
      userName: store.state.userName,
      demoMode: store.state.demoMode
    })
    this.load()
  },

  onPullDownRefresh: function () {
    const that = this
    this.load().then(function () {
      wx.stopPullDownRefresh()
    })
  },

  load: function () {
    const that = this
    if (!this.data.id) return Promise.resolve()
    this.setData({ loading: true })
    return api
      .activityRegistrations(this.data.id)
      .then(function (list) {
        that.setData({ rows: (list || []).map(decorate), loading: false })
      })
      .catch(function (e) {
        that.setData({ loading: false })
        toast.error((e && e.message) || '加载失败')
      })
  }
})
