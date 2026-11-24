const api = require('../../utils/api').api
const store = require('../../utils/store')
const toast = require('../../utils/toast').toast

const CATEGORIES = ['学术讲座', '文艺体育', '志愿服务', '社会实践']

function toDateTime(date, time) {
  if (!date || !time) return ''
  return date + 'T' + time + ':00'
}

Page({
  data: {
    isEdit: false,
    editingId: null,
    loading: false,
    categories: CATEGORIES,
    categoryIndex: 0,
    role: '游客',
    userName: '',
    demoMode: false,
    form: {
      title: '',
      description: '',
      category: CATEGORIES[0],
      location: '',
      startDate: '2026-12-20',
      startTime: '09:00',
      endDate: '2026-12-20',
      endTime: '12:00',
      capacity: '100'
    }
  },

  onLoad: function (options) {
    const id = options && options.id ? options.id : null
    this.setData({
      isEdit: !!id,
      editingId: id,
      role: store.state.role,
      userName: store.state.userName,
      demoMode: store.state.demoMode
    })
    if (id) {
      wx.setNavigationBarTitle({ title: '编辑活动' })
      this.loadActivity(id)
    } else {
      wx.setNavigationBarTitle({ title: '发布活动' })
    }
  },

  loadActivity: function (id) {
    const that = this
    this.setData({ loading: true })
    api
      .activity(id)
      .then(function (a) {
        const idx = CATEGORIES.indexOf(a.category)
        const startDate = a.startTime ? String(a.startTime).slice(0, 10) : that.data.form.startDate
        const startTime = a.startTime ? String(a.startTime).slice(11, 16) : that.data.form.startTime
        const endDate = a.endTime ? String(a.endTime).slice(0, 10) : that.data.form.endDate
        const endTime = a.endTime ? String(a.endTime).slice(11, 16) : that.data.form.endTime

        that.setData({
          loading: false,
          categoryIndex: idx > -1 ? idx : 0,
          form: {
            title: a.title || '',
            description: a.description || '',
            category: idx > -1 ? a.category : CATEGORIES[0],
            location: a.location || '',
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            capacity: String(Number(a.capacity) || 1)
          }
        })
      })
      .catch(function (e) {
        that.setData({ loading: false })
        toast.error((e && e.message) || '加载活动失败')
      })
  },

  onInput: function (e) {
    const field = e.currentTarget.dataset.field
    const patch = {}
    patch['form.' + field] = e.detail.value
    this.setData(patch)
  },

  onCategory: function (e) {
    const idx = Number(e.detail.value)
    this.setData({
      categoryIndex: idx,
      'form.category': CATEGORIES[idx]
    })
  },

  onStartDate: function (e) {
    this.setData({ 'form.startDate': e.detail.value })
  },

  onStartTime: function (e) {
    this.setData({ 'form.startTime': e.detail.value })
  },

  onEndDate: function (e) {
    this.setData({ 'form.endDate': e.detail.value })
  },

  onEndTime: function (e) {
    this.setData({ 'form.endTime': e.detail.value })
  },

  save: function () {
    const that = this
    const form = this.data.form
    if (!String(form.title).trim() || !String(form.location).trim()) {
      toast.warning('请填写活动名称和地点')
      return
    }

    const start = toDateTime(form.startDate, form.startTime)
    const end = toDateTime(form.endDate, form.endTime)
    if (!start || !end) {
      toast.warning('请选择开始和结束时间')
      return
    }
    if (new Date(end) <= new Date(start)) {
      toast.warning('结束时间必须晚于开始时间')
      return
    }
    if (this.data.loading) return

    this.setData({ loading: true })
    const body = {
      title: String(form.title).trim(),
      description: form.description,
      category: form.category,
      location: String(form.location).trim(),
      startTime: start,
      endTime: end,
      capacity: Number(form.capacity) || 1
    }

    const saving = this.data.editingId
      ? api.updateActivity(this.data.editingId, body)
      : api.createActivity(body)

    saving
      .then(function (r) {
        that.setData({ loading: false })
        if (r && r.success) {
          toast.success(r.message)
          setTimeout(function () {
            that.backToManage()
          }, 800)
        } else {
          toast.error((r && r.message) || '保存失败')
        }
      })
      .catch(function (e) {
        that.setData({ loading: false })
        toast.error((e && e.message) || '保存失败')
      })
  },

  backToManage: function () {
    const pages = getCurrentPages()
    if (pages.length > 1) wx.navigateBack({ delta: 1 })
    else wx.reLaunch({ url: '/pages/manage/manage' })
  }
})
