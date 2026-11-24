const TABS = [
  { path: '/pages/list/list', label: '活动', icon: '📅', roles: ['student', 'admin', '游客'] },
  { path: '/pages/mine/mine', label: '我的报名', icon: '🎟', roles: ['student'] },
  { path: '/pages/manage/manage', label: '活动管理', icon: '🗂', roles: ['admin'] },
  { path: '/pages/me/me', label: '我的', icon: '👤', roles: ['student', 'admin', '游客'] }
]

Component({
  properties: {
    current: {
      type: String,
      value: ''
    },
    role: {
      type: String,
      value: '游客',
      observer: function () {
        this.build()
      }
    }
  },
  data: {
    tabs: []
  },
  lifetimes: {
    attached: function () {
      this.build()
    }
  },
  methods: {
    build: function () {
      const role = this.data.role || '游客'
      const tabs = TABS.filter(function (tab) {
        return tab.roles.indexOf(role) > -1
      })
      this.setData({ tabs: tabs })
    },
    onTap: function (e) {
      const path = e.currentTarget.dataset.path
      if (!path || path === this.data.current) return
      wx.reLaunch({ url: path })
    }
  }
})
