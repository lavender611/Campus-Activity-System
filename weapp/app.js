const store = require('./utils/store')

App({
  onLaunch: function () {
    // 首次进入把登录态兜底成游客，避免页面读到 undefined
    if (!store.state.userId) {
      store.state.userId = null
      store.state.userName = ''
      store.state.role = '游客'
    }
    // 演示模式只在单次运行内有效：每次冷启动都重试真实后端，
    // 避免上一次网络没通导致后面一直走演示数据
    store.setDemoMode(false)
  },
  globalData: {}
})
