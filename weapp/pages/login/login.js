const api = require('../../utils/api').api
const store = require('../../utils/store')
const toast = require('../../utils/toast').toast

Page({
  data: {
    username: 'student01',
    password: '123456',
    loading: false,
    role: '游客',
    userName: '',
    demoMode: false
  },

  onLoad: function () {
    this.setData({
      role: store.state.role,
      userName: store.state.userName,
      demoMode: store.state.demoMode
    })
  },

  onUsername: function (e) {
    this.setData({ username: e.detail.value })
  },

  onPassword: function (e) {
    this.setData({ password: e.detail.value })
  },

  fill: function (e) {
    this.setData({
      username: e.currentTarget.dataset.name,
      password: '123456'
    })
  },

  submit: function () {
    const that = this
    const username = (this.data.username || '').trim()
    const password = this.data.password

    if (!username || !password) {
      toast.warning('请输入账号和密码')
      return
    }
    if (this.data.loading) return

    this.setData({ loading: true })
    api
      .login({ username: username, password: password })
      .then(function (result) {
        that.setData({ loading: false })
        if (!result || !result.success || !result.user) {
          toast.error((result && result.message) || '登录失败')
          return
        }
        store.setUser(result.user)
        that.setData({
          role: store.state.role,
          userName: store.state.userName,
          demoMode: store.state.demoMode
        })
        toast.success('登录成功，用户ID：' + result.user.id)
        const target = result.user.role === 'ADMIN' ? '/pages/manage/manage' : '/pages/list/list'
        setTimeout(function () {
          wx.reLaunch({ url: target })
        }, 600)
      })
      .catch(function (e) {
        that.setData({ loading: false })
        toast.error((e && e.message) || '无法连接后端')
        that.setData({ demoMode: store.state.demoMode })
      })
  }
})
