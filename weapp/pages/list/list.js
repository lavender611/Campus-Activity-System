const api = require('../../utils/api').api
const store = require('../../utils/store')
const fmt = require('../../utils/format')
const toast = require('../../utils/toast').toast

function decorate(a) {
  const count = a.registeredCount || 0
  const capacity = Number(a.capacity) || 0
  const rate = capacity ? Math.min(100, Math.round((count / capacity) * 100)) : 0
  return {
    id: a.id,
    title: a.title,
    category: a.category,
    description: a.description || '',
    location: a.location,
    dateText: fmt.fmtDate(a.startTime),
    timeText: fmt.fmtTime(a.startTime),
    registeredCount: count,
    capacity: a.capacity,
    rate: rate,
    full: rate >= 100
  }
}

Page({
  data: {
    keyword: '',
    category: '全部',
    categories: ['全部', '学术讲座', '文艺体育', '志愿服务', '社会实践'],
    all: [],
    items: [],
    loading: false,
    role: '游客',
    userName: '',
    demoMode: false
  },

  onLoad: function () {
    this.syncHeader()
    this.load()
  },

  onShow: function () {
    this.syncHeader()
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
    this.setData({ loading: true })
    return api
      .activities()
      .then(function (list) {
        const all = (list || []).map(decorate)
        that.setData({ all: all, loading: false }, function () {
          that.filter()
          that.syncHeader()
        })
      })
      .catch(function (e) {
        that.setData({ loading: false })
        toast.error(e && e.message ? e.message : '加载失败')
      })
  },

  onKeyword: function (e) {
    this.setData({ keyword: e.detail.value }, this.filter.bind(this))
  },

  onCategory: function (e) {
    this.setData({ category: e.currentTarget.dataset.cat }, this.filter.bind(this))
  },

  filter: function () {
    const keyword = (this.data.keyword || '').trim()
    const category = this.data.category
    const items = this.data.all.filter(function (a) {
      const inCategory = category === '全部' || a.category === category
      if (!inCategory) return false
      if (!keyword) return true
      return (a.title + (a.description || '') + a.location).indexOf(keyword) > -1
    })
    this.setData({ items: items })
  },

  openDetail: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
  },

  goMe: function () {
    wx.reLaunch({ url: '/pages/me/me' })
  }
})
