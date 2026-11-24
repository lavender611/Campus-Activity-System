const api = require('../../utils/api').api
const store = require('../../utils/store')
const fmt = require('../../utils/format')
const ui = require('../../utils/toast')

function decorate(row) {
  const count = row.registeredCount || 0
  const capacity = Number(row.capacity) || 1
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    location: row.location,
    startText: fmt.fmtShort(row.startTime),
    registeredCount: count,
    capacity: row.capacity,
    rate: Math.min(100, Math.round((count / capacity) * 100))
  }
}

Page({
  data: {
    rows: [],
    loading: false,
    role: '游客',
    userName: '',
    demoMode: false
  },

  onLoad: function () {
    this.syncHeader()
  },

  onShow: function () {
    this.syncHeader()
    this.load()
  },

  onPullDownRefresh: function () {
    const that = this
    this.load().then(function () {
      wx.stopPullDownRefresh()
    })
  },

  syncHeader: function () {
    this.setData({
      role: store.state.role,
      userName: store.state.userName,
      demoMode: store.state.demoMode
    })
  },

  load: function () {
    const that = this
    if (store.state.role !== 'admin') {
      this.setData({ rows: [], loading: false })
      return Promise.resolve()
    }
    this.setData({ loading: true })
    return api
      .activities()
      .then(function (list) {
        that.setData({ rows: (list || []).map(decorate), loading: false })
      })
      .catch(function (e) {
        that.setData({ loading: false })
        ui.toast.error((e && e.message) || '加载失败')
      })
  },

  publish: function () {
    wx.navigateTo({ url: '/pages/publish/publish' })
  },

  edit: function (e) {
    wx.navigateTo({ url: '/pages/publish/publish?id=' + e.currentTarget.dataset.id })
  },

  roster: function (e) {
    wx.navigateTo({ url: '/pages/roster/roster?id=' + e.currentTarget.dataset.id })
  },

  remove: function (e) {
    const that = this
    const row = this.data.rows.find(function (r) {
      return Number(r.id) === Number(e.currentTarget.dataset.id)
    })
    if (!row) return

    ui.askConfirm('确定删除活动“' + row.title + '”吗？删除后相关报名记录也会一并删除。', '确认删除').then(
      function (ok) {
        if (!ok) return
        api
          .deleteActivity(row.id)
          .then(function (r) {
            if (r && r.success) ui.toast.success(r.message)
            else ui.toast.error((r && r.message) || '删除失败')
            that.load()
          })
          .catch(function (err) {
            ui.toast.error((err && err.message) || '删除失败')
          })
      }
    )
  },

  goLogin: function () {
    wx.navigateTo({ url: '/pages/login/login' })
  }
})
