const api = require('../../utils/api').api
const store = require('../../utils/store')
const mock = require('../../utils/mock')
const ui = require('../../utils/toast')

Page({
  data: {
    role: '游客',
    userName: '',
    userId: null,
    demoMode: false,
    roleText: '未登录游客',
    initial: '游',
    loggedIn: false
  },

  onLoad: function () {
    this.refresh()
  },

  onShow: function () {
    this.refresh()
  },

  refresh: function () {
    const role = store.state.role
    this.setData({
      role: role,
      userName: store.state.userName,
      userId: store.state.userId,
      demoMode: store.state.demoMode,
      roleText: role === 'admin' ? '管理员' : role === 'student' ? '学生' : '未登录游客',
      initial: (store.state.userName || '游').slice(0, 1).toUpperCase(),
      loggedIn: !!store.state.userId
    })
  },

  signOut: function () {
    const that = this
    ui.askConfirm('确定退出当前账号吗？', '退出登录').then(function (ok) {
      if (!ok) return
      store.logout()
      that.refresh()
      ui.toast.success('已退出登录')
      setTimeout(function () {
        wx.reLaunch({ url: '/pages/list/list' })
      }, 600)
    })
  },

  retryBackend: function () {
    api.reconnect()
    this.refresh()
    ui.toast('正在尝试重新连接后端…')
    setTimeout(function () {
      wx.reLaunch({ url: '/pages/me/me' })
    }, 600)
  },

  resetDemo: function () {
    ui.askConfirm('将清空演示数据（活动与报名记录）并恢复初始示例，确定继续吗？', '重置演示数据').then(function (ok) {
      if (!ok) return
      mock.resetMockData()
      ui.toast.success('演示数据已重置')
      setTimeout(function () {
        wx.reLaunch({ url: '/pages/me/me' })
      }, 800)
    })
  },

  goList: function () {
    wx.reLaunch({ url: '/pages/list/list' })
  },

  goMine: function () {
    wx.reLaunch({ url: '/pages/mine/mine' })
  },

  goManage: function () {
    wx.reLaunch({ url: '/pages/manage/manage' })
  },

  goLogin: function () {
    wx.navigateTo({ url: '/pages/login/login' })
  }
})
