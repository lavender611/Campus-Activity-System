const api = require('../../utils/api').api
const store = require('../../utils/store')
const fmt = require('../../utils/format')
const toast = require('../../utils/toast').toast

function decorate(r) {
  return {
    id: r.id,
    activityId: r.activityId,
    activityTitle: r.activityTitle,
    activityLocation: r.activityLocation,
    startText: fmt.fmtShort(r.activityStartTime),
    regText: fmt.fmtShort(r.registrationTime),
    status: r.status,
    statusText: fmt.statusText(r.status),
    statusClass: r.status === 'REGISTERED' ? 'green' : 'gray',
    canCancel: r.status === 'REGISTERED'
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
    if (!store.state.userId || store.state.role !== 'student') {
      this.setData({ rows: [], loading: false })
      toast.warning('请先以学生身份登录')
      return Promise.resolve()
    }

    this.setData({ loading: true })
    return api
      .myRegistrations(store.state.userId)
      .then(function (list) {
        that.setData({ rows: (list || []).map(decorate), loading: false })
      })
      .catch(function (e) {
        that.setData({ loading: false })
        toast.error((e && e.message) || '加载失败')
      })
  },

  cancel: function (e) {
    const that = this
    const activityId = Number(e.currentTarget.dataset.activity)
    api
      .cancel(store.state.userId, activityId)
      .then(function (r) {
        if (r && r.success) toast.success(r.message)
        else toast.warning((r && r.message) || '取消报名失败')
        that.load()
      })
      .catch(function (err) {
        toast.error((err && err.message) || '取消报名失败')
      })
  },

  openDetail: function (e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id })
  },

  goList: function () {
    wx.reLaunch({ url: '/pages/list/list' })
  },

  goLogin: function () {
    wx.navigateTo({ url: '/pages/login/login' })
  }
})
