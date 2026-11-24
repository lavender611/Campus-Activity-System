// 内置演示数据：连不上后端时自动接管，接口语义与 Spring Boot 后端保持一致
const KEY = 'campusDemoData'

const USERS = [
  { id: 1, username: 'student01', password: '123456', role: 'STUDENT' },
  { id: 2, username: 'student02', password: '123456', role: 'STUDENT' },
  { id: 3, username: 'admin', password: '123456', role: 'ADMIN' },
  // 2026-2027-1 学期重补修名单学生（用户名=姓名，密码 123456）
  { id: 4, username: '段浩宇', password: '123456', role: 'STUDENT' },
  { id: 5, username: '胡雨生', password: '123456', role: 'STUDENT' },
  { id: 6, username: '吴钰琳', password: '123456', role: 'STUDENT' },
  { id: 7, username: '张战', password: '123456', role: 'STUDENT' },
  { id: 8, username: '韦涵烁', password: '123456', role: 'STUDENT' },
  { id: 9, username: '韩旭', password: '123456', role: 'STUDENT' },
  { id: 10, username: '余邵卿', password: '123456', role: 'STUDENT' },
  { id: 11, username: '赵齐文', password: '123456', role: 'STUDENT' },
  { id: 12, username: '王彤', password: '123456', role: 'STUDENT' },
  { id: 13, username: '邓翼枫', password: '123456', role: 'STUDENT' },
  { id: 14, username: '陈娜', password: '123456', role: 'STUDENT' },
  { id: 15, username: '杨珺涵', password: '123456', role: 'STUDENT' }
]

function seedActivities() {
  // 2026 年 11 月学生社团系列活动（共青团阜阳理工学院委员会 宣），与数据库 seed 保持一致
  return [
    {
      id: 190,
      title: '“以纸寄初心·时光回信”书信征集',
      description: '承办：思想政治教育研究会；QQ群号：1006359614。面向全校学生征集书信作品，写下初心与期许，优秀作品将在大学生活动中心展出。',
      category: '文艺体育',
      location: '大学生活动中心大礼堂前厅',
      startTime: '2026-11-23T09:00:00',
      endTime: '2026-11-23T17:00:00',
      capacity: 100
    },
    {
      id: 191,
      title: '“写给未来的一封信”时光邮局',
      description: '承办：西湖文学社；QQ群号：1132957914。把想对未来自己说的话写成信，由社团统一保管，并在约定时间寄出。',
      category: '文艺体育',
      location: '大学生活动中心大礼堂前厅',
      startTime: '2026-11-24T09:00:00',
      endTime: '2026-11-25T17:00:00',
      capacity: 200
    },
    {
      id: 192,
      title: '英聚阜理·青言汇英语趣味摊位',
      description: '承办：外国语协会；QQ群号：1136239265。通过英语猜词、配音、口语闯关等摊位游戏练习英语表达，现场可领取小礼品。',
      category: '学术讲座',
      location: '大学生活动中心大礼堂前厅',
      startTime: '2026-11-27T14:00:00',
      endTime: '2026-11-27T17:00:00',
      capacity: 80
    },
    {
      id: 193,
      title: '“晨光沐绿·绿色生活”卫生巡查',
      description: '承办：绿笙环境保护协会；QQ群号：806463111。每周三早上 7:10 在教学楼区域开展卫生巡查与文明劝导，持续一学期。',
      category: '志愿服务',
      location: '1-8号教学楼',
      startTime: '2026-11-25T07:10:00',
      endTime: '2027-01-13T07:10:00',
      capacity: 60
    },
    {
      id: 194,
      title: '“绿色银行”环保兑换',
      description: '承办：绿笙环境保护协会；QQ群号：1135943506。用可回收物兑换绿植和学习用品，倡导低碳校园生活。',
      category: '志愿服务',
      location: '大学生活动中心大礼堂前厅',
      startTime: '2026-11-26T09:00:00',
      endTime: '2026-11-27T17:00:00',
      capacity: 100
    },
    {
      id: 195,
      title: '“晨光启行·食安护航”晨跑花跑',
      description: '承办：食安先锋社；QQ群号：1130571837。清晨集体晨跑，沿途宣传食品安全知识，完成打卡可获纪念徽章。',
      category: '文艺体育',
      location: '风雨操场',
      startTime: '2026-11-23T06:30:00',
      endTime: '2026-12-01T07:30:00',
      capacity: 80
    },
    {
      id: 196,
      title: '“赴朝曦”校园长跑竞赛',
      description: '承办：跑步爱好者协会；QQ群号：240219215。校园长跑竞赛，按完赛成绩分组排名，设男女组奖项。',
      category: '文艺体育',
      location: '风雨操场',
      startTime: '2026-11-29T09:00:00',
      endTime: '2026-12-06T17:00:00',
      capacity: 150
    },
    {
      id: 197,
      title: '“急救进校园”应急救护培训',
      description: '承办：大学生应急救护社团；QQ群号：1131948138。心肺复苏、AED 使用与创伤包扎培训，考核合格颁发急救员证书。',
      category: '志愿服务',
      location: '图书馆一楼报告厅',
      startTime: '2026-11-29T14:00:00',
      endTime: '2026-11-29T17:00:00',
      capacity: 100
    },
    {
      id: 198,
      title: '“荚点妙想，‘豆’是惊喜”豆荚娃娃手工制作活动',
      description: '承办：大学生创新创业协会；QQ群号：635044224。用豆荚、布料等材料制作娃娃，作品可参与创意市集展示。',
      category: '文艺体育',
      location: '4号教学楼109',
      startTime: '2026-11-23T09:00:00',
      endTime: '2026-11-29T17:00:00',
      capacity: 60
    },
    {
      id: 199,
      title: '“小实验，大国重器”桌面实验',
      description: '承办：电子爱好者协会；QQ群号：1134186713。现场演示电磁、光学等桌面小实验，并可动手组装简易装置。',
      category: '学术讲座',
      location: '一期食堂北侧操场',
      startTime: '2026-11-22T09:00:00',
      endTime: '2026-11-22T17:00:00',
      capacity: 80
    }
  ]
}

function seedRegistrations() {
  // 重补修名单学生的报名记录：每人 2 项 11 月社团活动（与数据库 seed 一致）
  return [
    { id: 1, userId: 4, activityId: 190, registrationTime: '2026-11-20T09:12:00', status: 'REGISTERED' },
    { id: 2, userId: 4, activityId: 191, registrationTime: '2026-11-20T09:14:00', status: 'REGISTERED' },
    { id: 3, userId: 5, activityId: 192, registrationTime: '2026-11-20T09:20:00', status: 'REGISTERED' },
    { id: 4, userId: 5, activityId: 193, registrationTime: '2026-11-20T09:22:00', status: 'REGISTERED' },
    { id: 5, userId: 6, activityId: 194, registrationTime: '2026-11-20T09:31:00', status: 'REGISTERED' },
    { id: 6, userId: 6, activityId: 196, registrationTime: '2026-11-20T09:33:00', status: 'REGISTERED' },
    { id: 7, userId: 7, activityId: 197, registrationTime: '2026-11-20T09:40:00', status: 'REGISTERED' },
    { id: 8, userId: 7, activityId: 198, registrationTime: '2026-11-20T09:42:00', status: 'REGISTERED' },
    { id: 9, userId: 8, activityId: 199, registrationTime: '2026-11-20T09:50:00', status: 'REGISTERED' },
    { id: 10, userId: 8, activityId: 195, registrationTime: '2026-11-20T09:52:00', status: 'REGISTERED' },
    { id: 11, userId: 9, activityId: 190, registrationTime: '2026-11-20T10:01:00', status: 'REGISTERED' },
    { id: 12, userId: 9, activityId: 194, registrationTime: '2026-11-20T10:03:00', status: 'REGISTERED' },
    { id: 13, userId: 10, activityId: 191, registrationTime: '2026-11-20T10:10:00', status: 'REGISTERED' },
    { id: 14, userId: 10, activityId: 192, registrationTime: '2026-11-20T10:12:00', status: 'REGISTERED' },
    { id: 15, userId: 11, activityId: 193, registrationTime: '2026-11-20T10:20:00', status: 'REGISTERED' },
    { id: 16, userId: 11, activityId: 196, registrationTime: '2026-11-20T10:22:00', status: 'REGISTERED' },
    { id: 17, userId: 12, activityId: 197, registrationTime: '2026-11-20T10:30:00', status: 'REGISTERED' },
    { id: 18, userId: 12, activityId: 199, registrationTime: '2026-11-20T10:32:00', status: 'REGISTERED' },
    { id: 19, userId: 13, activityId: 195, registrationTime: '2026-11-20T10:40:00', status: 'REGISTERED' },
    { id: 20, userId: 13, activityId: 198, registrationTime: '2026-11-20T10:42:00', status: 'REGISTERED' },
    { id: 21, userId: 14, activityId: 190, registrationTime: '2026-11-20T10:50:00', status: 'REGISTERED' },
    { id: 22, userId: 14, activityId: 198, registrationTime: '2026-11-20T10:52:00', status: 'REGISTERED' },
    { id: 23, userId: 15, activityId: 193, registrationTime: '2026-11-20T11:00:00', status: 'REGISTERED' },
    { id: 24, userId: 15, activityId: 194, registrationTime: '2026-11-20T11:02:00', status: 'REGISTERED' }
  ]
}

function seed() {
  return { activities: seedActivities(), registrations: seedRegistrations(), seq: 199 }
}


let data = null

function load() {
  try {
    const raw = wx.getStorageSync(KEY)
    if (raw && typeof raw === 'object' && Array.isArray(raw.activities)) return raw
  } catch (e) {}
  const fresh = seed()
  persist(fresh)
  return fresh
}

function persist(next) {
  try {
    wx.setStorageSync(KEY, next || data)
  } catch (e) {}
}

data = load()

function countRegistered(activityId) {
  return data.registrations.filter(function (r) {
    return Number(r.activityId) === Number(activityId) && r.status === 'REGISTERED'
  }).length
}

function activityView(a) {
  const copy = Object.assign({}, a)
  copy.registeredCount = countRegistered(a.id)
  return copy
}

function registrationView(r) {
  const activity = data.activities.find(function (a) {
    return Number(a.id) === Number(r.activityId)
  })
  const user = USERS.find(function (u) {
    return Number(u.id) === Number(r.userId)
  })
  return {
    id: r.id,
    userId: r.userId,
    activityId: r.activityId,
    registrationTime: r.registrationTime,
    status: r.status,
    username: user ? user.username : 'student' + r.userId,
    activityTitle: activity ? activity.title : '活动已删除',
    activityLocation: activity ? activity.location : '-',
    activityStartTime: activity ? activity.startTime : null,
    activityEndTime: activity ? activity.endTime : null
  }
}

function nowText() {
  const d = new Date()
  const p = function (n) {
    return String(n).padStart(2, '0')
  }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' +
    p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
}

function nextId() {
  data.seq = (data.seq || 100) + 1
  return data.seq
}

function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms == null ? 240 : ms)
  })
}

function mockRequest(path, options) {
  options = options || {}
  return delay().then(function () {
    const method = String(options.method || 'GET').toUpperCase()
    const body = options.body ? JSON.parse(options.body) : {}
    const url = String(path).split('?')[0]

    // ---- 登录 ----
    if (/^\/users\/login$/.test(url) && method === 'POST') {
      const user = USERS.find(function (u) {
        return u.username === String(body.username || '').trim() && u.password === body.password
      })
      if (!user) return { success: false, message: '账号或密码错误' }
      return { success: true, message: '登录成功', user: { id: user.id, username: user.username, role: user.role } }
    }

    // ---- 活动 ----
    if (/^\/activities$/.test(url) && method === 'GET') {
      return data.activities
        .slice()
        .sort(function (a, b) {
          return String(a.startTime).localeCompare(String(b.startTime))
        })
        .map(activityView)
    }

    if (/^\/activities$/.test(url) && method === 'POST') {
      const id = nextId()
      data.activities.push({
        id: id,
        title: body.title,
        description: body.description,
        category: body.category,
        location: body.location,
        startTime: body.startTime,
        endTime: body.endTime,
        capacity: Number(body.capacity) || 0
      })
      persist()
      return { success: true, message: '活动发布成功', id: id }
    }

    const activityMatch = url.match(/^\/activities\/(\d+)$/)
    if (activityMatch) {
      const id = Number(activityMatch[1])
      const activity = data.activities.find(function (a) {
        return Number(a.id) === id
      })
      if (method === 'GET') {
        if (!activity) throw new Error('活动不存在')
        return activityView(activity)
      }
      if (method === 'PUT') {
        if (!activity) return { success: false, message: '活动不存在' }
        Object.assign(activity, {
          title: body.title,
          description: body.description,
          category: body.category,
          location: body.location,
          startTime: body.startTime,
          endTime: body.endTime,
          capacity: Number(body.capacity) || 0
        })
        persist()
        return { success: true, message: '活动修改成功' }
      }
      if (method === 'DELETE') {
        if (!activity) return { success: false, message: '活动不存在' }
        data.activities = data.activities.filter(function (a) {
          return Number(a.id) !== id
        })
        data.registrations = data.registrations.filter(function (r) {
          return Number(r.activityId) !== id
        })
        persist()
        return { success: true, message: '活动删除成功' }
      }
    }

    // ---- 报名 ----
    if (/^\/registrations$/.test(url) && method === 'GET') {
      return data.registrations
        .slice()
        .sort(function (a, b) {
          return String(b.registrationTime).localeCompare(String(a.registrationTime))
        })
        .map(registrationView)
    }

    const userRegs = url.match(/^\/registrations\/user\/(\d+)$/)
    if (userRegs && method === 'GET') {
      const userId = Number(userRegs[1])
      return data.registrations
        .filter(function (r) {
          return Number(r.userId) === userId
        })
        .sort(function (a, b) {
          return String(b.registrationTime).localeCompare(String(a.registrationTime))
        })
        .map(registrationView)
    }

    const activityRegs = url.match(/^\/registrations\/activity\/(\d+)$/)
    if (activityRegs && method === 'GET') {
      const activityId = Number(activityRegs[1])
      return data.registrations
        .filter(function (r) {
          return Number(r.activityId) === activityId
        })
        .sort(function (a, b) {
          return String(b.registrationTime).localeCompare(String(a.registrationTime))
        })
        .map(registrationView)
    }

    const countMatch = url.match(/^\/registrations\/count\/(\d+)$/)
    if (countMatch && method === 'GET') {
      const activityId = Number(countMatch[1])
      return { activityId: activityId, count: countRegistered(activityId) }
    }

    if (/^\/registrations$/.test(url) && method === 'POST') {
      const userId = Number(body.userId)
      const activityId = Number(body.activityId)
      const activity = data.activities.find(function (a) {
        return Number(a.id) === activityId
      })
      if (!activity) return { success: false, message: '活动不存在' }
      const old = data.registrations.find(function (r) {
        return Number(r.userId) === userId && Number(r.activityId) === activityId
      })
      if (old && old.status === 'REGISTERED') return { success: false, message: '你已经报名该活动' }
      if (countRegistered(activityId) >= Number(activity.capacity)) {
        return { success: false, message: '活动名额已满' }
      }
      if (old) {
        old.status = 'REGISTERED'
        old.registrationTime = nowText()
      } else {
        data.registrations.push({
          id: nextId(),
          userId: userId,
          activityId: activityId,
          registrationTime: nowText(),
          status: 'REGISTERED'
        })
      }
      persist()
      return { success: true, message: '报名成功' }
    }

    const cancelMatch = url.match(/^\/registrations\/cancel\/(\d+)\/(\d+)$/)
    if (cancelMatch && method === 'PUT') {
      const userId = Number(cancelMatch[1])
      const activityId = Number(cancelMatch[2])
      const record = data.registrations.find(function (r) {
        return Number(r.userId) === userId && Number(r.activityId) === activityId && r.status === 'REGISTERED'
      })
      if (!record) return { success: false, message: '没有找到有效报名记录' }
      record.status = 'CANCELLED'
      persist()
      return { success: true, message: '取消报名成功' }
    }

    throw new Error('演示数据不支持该接口：' + method + ' ' + url)
  })
}

function resetMockData() {
  const fresh = seed()
  data = fresh
  persist(fresh)
}

module.exports = { mockRequest: mockRequest, resetMockData: resetMockData }
