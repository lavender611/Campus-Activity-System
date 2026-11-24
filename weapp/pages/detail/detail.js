const api = require('../../utils/api').api
const store = require('../../utils/store')
const fmt = require('../../utils/format')
const toast = require('../../utils/toast').toast

Page({
  data: {
    id: null,
    loading: true,
    submitting: false,
    activity: null,
    count: 0,
    rate: 0,
    isFull: false,
    registered: false,
    statusText: '可报名',
    statusClass: '',
    role: '游客',
    userName: '',
    demoMode: false
  },

  onLoad: function (options) {
    const id = options && options.id ? options.id : null
    this.setData({ id: id })
    this.syncHeader()
    this.load()
  },

  onShow: function () {
    this.syncHeader()
    if (this.data.id) this.load()
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
    const id = this.data.id
    if (!id) return

    this.setData({ loading: true })

    Promise.all([api.activity(id), api.count(id)])
      .then(function (res) {
        const activity = res[0]
        const count = Number(res[1] && res[1].count) || 0

        if (!store.state.userId) {
          that.apply(activity, count, false)
          return
        }

        return api
          .myRegistrations(store.state.userId)
          .then(function (records) {
            const registered = (records || []).some(function (r) {
              return Number(r.activityId) === Number(id) && r.status === 'REGISTERED'
            })
            that.apply(activity, count, registered)
          })
          .catch(function () {
            that.apply(activity, count, false)
          })
      })
      .catch(function (e) {
        that.setData({ loading: false })
        toast.error((e && e.message) || '加载失败')
      })
  },

  apply: function (activity, count, registered) {
    const capacity = Number(activity.capacity) || 0
    const rate = capacity ? Math.min(100, Math.round((count / capacity) * 100)) : 0
    const isFull = capacity ? count >= capacity : false

    let statusText = '可报名'
    let statusClass = ''
    if (registered) {
      statusText = '已报名'
      statusClass = 'green'
    } else if (isFull) {
      statusText = '名额已满'
      statusClass = 'orange'
    }

    this.setData({
      loading: false,
      activity: {
        id: activity.id,
        title: activity.title,
        category: activity.category,
        description: activity.description || '',
        location: activity.location,
        capacity: activity.capacity,
        dateText: fmt.fmtDate(activity.startTime),
        timeText: fmt.fmtTime(activity.startTime),
        rangeText: fmt.fmtRange(activity.startTime, activity.endTime)
      },
      count: count,
      rate: rate,
      isFull: isFull,
      registered: registered,
      statusText: statusText,
      statusClass: statusClass,
      demoMode: store.state.demoMode
    })
  },

  register: function () {
    const that = this
    if (store.state.role !== 'student' || !store.state.userId) {
      toast.warning('请先以学生身份登录')
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    if (this.data.submitting) return

    this.setData({ submitting: true })
    api
      .register({ userId: store.state.userId, activityId: Number(this.data.id) })
      .then(function (r) {
        that.setData({ submitting: false })
        if (r && r.success) toast.success(r.message)
        else toast.warning((r && r.message) || '报名失败')
        that.load()
      })
      .catch(function (e) {
        that.setData({ submitting: false })
        toast.error((e && e.message) || '报名失败')
      })
  },

  cancel: function () {
    const that = this
    if (this.data.submitting) return
    this.setData({ submitting: true })
    api
      .cancel(store.state.userId, Number(this.data.id))
      .then(function (r) {
        that.setData({ submitting: false })
        if (r && r.success) toast.success(r.message)
        else toast.warning((r && r.message) || '取消报名失败')
        that.load()
      })
      .catch(function (e) {
        that.setData({ submitting: false })
        toast.error((e && e.message) || '取消报名失败')
      })
  },

  goLogin: function () {
    wx.navigateTo({ url: '/pages/login/login' })
  },

  goRoster: function () {
    wx.navigateTo({ url: '/pages/roster/roster?id=' + this.data.id })
  }
})
