/* 临时联调自检脚本：用 Node 桩件跑通 utils 与页面业务逻辑，验证完即删 */
const http = require('http')
const path = require('path')

const storage = {}
const toasts = []

function request(o) {
  let u
  try {
    u = new URL(o.url)
  } catch (e) {
    o.fail && o.fail(e)
    return
  }
  const body = o.data === undefined || o.data === null ? null : JSON.stringify(o.data)
  const headers = Object.assign({}, o.header || {})
  if (body) headers['Content-Length'] = Buffer.byteLength(body)
  const req = http.request(
    {
      hostname: u.hostname,
      port: u.port || 80,
      path: u.pathname + u.search,
      method: o.method || 'GET',
      headers: headers,
      timeout: 8000
    },
    function (res) {
      let raw = ''
      res.on('data', function (d) {
        raw += d
      })
      res.on('end', function () {
        let data = raw
        try {
          data = raw ? JSON.parse(raw) : null
        } catch (e) {}
        o.success && o.success({ statusCode: res.statusCode, data: data })
      })
    }
  )
  req.on('error', function (e) {
    o.fail && o.fail(e)
  })
  req.on('timeout', function () {
    req.destroy(new Error('timeout'))
  })
  if (body) req.write(body)
  req.end()
}

global.wx = {
  getStorageSync: function (k) {
    return storage[k]
  },
  setStorageSync: function (k, v) {
    storage[k] = v
  },
  removeStorageSync: function (k) {
    delete storage[k]
  },
  showToast: function (o) {
    toasts.push(o.title)
  },
  showModal: function (o) {
    o.success && o.success({ confirm: true, cancel: false })
  },
  request: request,
  reLaunch: function () {},
  navigateTo: function () {},
  navigateBack: function () {},
  setNavigationBarTitle: function () {},
  stopPullDownRefresh: function () {}
}

let captured = null
global.Page = function (cfg) {
  captured = cfg
}
global.Component = function (cfg) {
  captured = cfg
}

function makeSetData(page) {
  return function (patch, cb) {
    Object.keys(patch).forEach(function (k) {
      if (k.indexOf('.') > -1) {
        const parts = k.split('.')
        let obj = page.data
        for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]]
        obj[parts[parts.length - 1]] = patch[k]
      } else {
        page.data[k] = patch[k]
      }
    })
    if (typeof cb === 'function') cb()
  }
}

function loadPage(rel) {
  captured = null
  const file = path.join(__dirname, rel)
  delete require.cache[require.resolve(file)]
  require(file)
  const cfg = captured
  const page = Object.assign({}, cfg)
  page.data = JSON.parse(JSON.stringify(cfg.data || {}))
  page.setData = makeSetData(page)
  return page
}

function wait(ms) {
  return new Promise(function (r) {
    setTimeout(r, ms)
  })
}

function ok(name, cond, extra) {
  console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '  →  ' + extra))
  if (!cond) failures++
}

let failures = 0

async function demoSuite() {
  console.log('\n=== A. 演示数据模式（后端不可达时的兜底链路） ===')
  const store = require('./utils/store')
  store.setDemoMode(true)
  const api = require('./utils/api').api

  const login = await api.login({ username: 'student01', password: '123456' })
  ok('登录 student01', login.success === true && login.user.id === 1, login.message)

  const badLogin = await api.login({ username: 'student01', password: 'wrong' })
  ok('密码错误被拒', badLogin.success === false, badLogin.message)

  const list = await api.activities()
  ok('活动列表 6 条', list.length === 6, '条数 ' + list.length)

  const before = await api.count(3)
  ok('活动3 初始报名数 0', before.count === 0, before.count)

  const reg = await api.register({ userId: 1, activityId: 3 })
  ok('报名活动3', reg.success === true, reg.message)

  const after = await api.count(3)
  ok('报名后计数 +1', after.count === 1, after.count)

  const dup = await api.register({ userId: 1, activityId: 3 })
  ok('重复报名被拦', dup.success === false, dup.message)

  const mine = await api.myRegistrations(1)
  ok('我的报名含活动3', mine.some(function (r) {
    return Number(r.activityId) === 3 && r.status === 'REGISTERED'
  }), '共 ' + mine.length + ' 条')

  const cancel = await api.cancel(1, 3)
  ok('取消报名', cancel.success === true, cancel.message)

  const created = await api.createActivity({
    title: '自检活动',
    description: '脚本创建',
    category: '学术讲座',
    location: '测试地点',
    startTime: '2026-12-25T10:00:00',
    endTime: '2026-12-25T12:00:00',
    capacity: 5
  })
  ok('发布活动', created.success === true, 'id ' + created.id)

  const detail = await api.activity(created.id)
  ok('新建活动详情可读', detail.title === '自检活动' && detail.registeredCount === 0, detail.title)

  const updated = await api.updateActivity(created.id, {
    title: '自检活动（已改）',
    description: '脚本修改',
    category: '志愿服务',
    location: '测试地点2',
    startTime: '2026-12-25T10:00:00',
    endTime: '2026-12-25T12:00:00',
    capacity: 8
  })
  ok('编辑活动', updated.success === true, updated.message)

  const roster = await api.activityRegistrations(2)
  ok('活动2 名单有记录', roster.length >= 1, '共 ' + roster.length + ' 条')

  const del = await api.deleteActivity(created.id)
  ok('删除活动', del.success === true, del.message)

  const listAfter = await api.activities()
  ok('删除后活动数回到 6', listAfter.length === 6, '条数 ' + listAfter.length)
}

async function pageSuite() {
  console.log('\n=== B. 页面逻辑（list / detail） ===')
  const store = require('./utils/store')
  store.setDemoMode(true)
  store.setUser({ id: 3, username: 'admin', role: 'ADMIN' })

  const listPage = loadPage('pages/list/list.js')
  listPage.onLoad()
  await wait(400)
  ok('列表页加载 6 条', listPage.data.items.length === 6, '条数 ' + listPage.data.items.length)
  ok('列表页 role=admin 传给 tabbar', listPage.data.role === 'admin', listPage.data.role)
  ok('首条含日期文案', !!listPage.data.items[0].dateText, listPage.data.items[0].dateText)

  listPage.onKeyword({ detail: { value: 'Python' } })
  ok('搜索 Python 命中 1 条', listPage.data.items.length === 1, '条数 ' + listPage.data.items.length)

  listPage.onKeyword({ detail: { value: '' } })
  listPage.onCategory({ currentTarget: { dataset: { cat: '志愿服务' } } })
  ok('筛选志愿服务 1 条', listPage.data.items.length === 1, '条数 ' + listPage.data.items.length)

  store.setUser({ id: 1, username: 'student01', role: 'STUDENT' })
  const detailPage = loadPage('pages/detail/detail.js')
  detailPage.onLoad({ id: '3' })
  await wait(500)
  ok('详情页标题正确', detailPage.data.activity && detailPage.data.activity.title === '图书馆图书整理志愿活动', detailPage.data.activity && detailPage.data.activity.title)
  ok('详情页状态可报名', detailPage.data.statusText === '可报名', detailPage.data.statusText)
  ok('详情页进度百分比', detailPage.data.rate === 0, detailPage.data.rate)

  detailPage.register()
  await wait(1400)
  ok('详情页报名后变已报名', detailPage.data.statusText === '已报名', detailPage.data.statusText)

  detailPage.cancel()
  await wait(1400)
  ok('详情页取消后回到可报名', detailPage.data.statusText === '可报名', detailPage.data.statusText)

  const managePage = loadPage('pages/manage/manage.js')
  store.setUser({ id: 3, username: 'admin', role: 'ADMIN' })
  managePage.onLoad()
  managePage.onShow()
  await wait(500)
  ok('管理页加载 6 条', managePage.data.rows.length === 6, '条数 ' + managePage.data.rows.length)

  const minePage = loadPage('pages/mine/mine.js')
  store.setUser({ id: 1, username: 'student01', role: 'STUDENT' })
  minePage.onLoad()
  minePage.onShow()
  await wait(400)
  ok('我的报名页有记录', minePage.data.rows.length >= 1, '条数 ' + minePage.data.rows.length)
  ok('报名行带状态文案', minePage.data.rows[0].statusText.length > 0, minePage.data.rows[0].statusText)

  const rosterPage = loadPage('pages/roster/roster.js')
  rosterPage.onLoad({ id: '2' })
  await wait(400)
  ok('报名名单页有记录', rosterPage.data.rows.length >= 1, '条数 ' + rosterPage.data.rows.length)
  ok('名单首字母头像有值', !!rosterPage.data.rows[0].initial, rosterPage.data.rows[0].initial)

  const mePage = loadPage('pages/me/me.js')
  mePage.onLoad()
  ok('个人页角色文案=学生', mePage.data.roleText === '学生', mePage.data.roleText)
  ok('个人页数据来源=演示数据', mePage.data.demoMode === true, mePage.data.demoMode)

  const publishPage = loadPage('pages/publish/publish.js')
  publishPage.onLoad({ id: '2' })
  await wait(500)
  ok('编辑页回填标题', publishPage.data.form.title === '校园歌手大赛初赛', publishPage.data.form.title)
  ok('编辑页回填开始日期', publishPage.data.form.startDate === '2026-12-05', publishPage.data.form.startDate)
  ok('编辑页回填开始时间', publishPage.data.form.startTime === '18:30', publishPage.data.form.startTime)
  ok('编辑页识别为编辑态', publishPage.data.isEdit === true, publishPage.data.isEdit)
}

function probeBackend() {
  return new Promise(function (resolve) {
    let u
    try {
      u = new URL(require('./utils/config').baseUrl)
    } catch (e) {
      resolve(false)
      return
    }
    const req = http.request(
      { hostname: u.hostname, port: u.port || 80, path: u.pathname + '/activities', method: 'GET', timeout: 4000 },
      function (res) {
        res.resume()
        res.on('end', function () {
          resolve(res.statusCode >= 200 && res.statusCode < 300)
        })
      }
    )
    req.on('error', function () {
      resolve(false)
    })
    req.on('timeout', function () {
      req.destroy()
      resolve(false)
    })
    req.end()
  })
}

async function realBackendSuite() {
  console.log('\n=== C. 真实后端（8080）读取链路 ===')
  const store = require('./utils/store')
  store.setDemoMode(false)
  const api = require('./utils/api').api

  const alive = await probeBackend()
  if (!alive) {
    console.log('SKIP  后端 8080 当前没在运行，跳过真实链路（连不上时自动降级已被 A 套件覆盖）')
    return
  }

  const list = await api.activities()
  ok('真实后端有活动数据', Array.isArray(list) && list.length > 0, '条数 ' + (list && list.length))
  ok('未触发演示降级', store.state.demoMode === false, 'demoMode=' + store.state.demoMode)

  if (list.length) {
    const first = list[0]
    const detail = await api.activity(first.id)
    ok('真实后端详情可读', !!detail && detail.title === first.title, detail && detail.title)
    const count = await api.count(first.id)
    ok('真实后端报名数接口可读', typeof count.count === 'number', 'count=' + count.count)
  }

  const login = await api.login({ username: 'admin', password: '123456' })
  ok('真实后端管理员登录', login.success === true && login.user.role === 'ADMIN', login.message)
}

(async function main() {
  console.log('小程序自检开始（BASE 见 utils/config.js）')
  await demoSuite()
  await pageSuite()
  await realBackendSuite()
  console.log('\n===== 结果：' + (failures ? failures + ' 项失败' : '全部通过') + ' =====')
  if (toasts.length) console.log('toast 记录（前 8 条）：' + toasts.slice(0, 8).join(' | '))
  process.exit(failures ? 1 : 0)
})()
