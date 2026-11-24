// 内置演示数据：手机连不上后端时自动接管，接口语义与 Spring Boot 后端保持一致
const KEY = 'campusDemoData'

const USERS = [
  { id: 1, username: 'student01', password: '123456', role: 'STUDENT' },
  { id: 2, username: 'student02', password: '123456', role: 'STUDENT' },
  { id: 3, username: 'admin', password: '123456', role: 'ADMIN' }
]

function seedActivities() {
  return [
    {
      id: 1,
      title: '人工智能前沿讲座：大模型与智能体',
      description: '邀请计算机学院老师讲解大模型基本原理、智能体应用与学习路线，现场设有提问环节，欢迎各专业同学参加。',
      category: '学术讲座',
      location: '图书馆报告厅',
      startTime: '2026-11-25T14:00:00',
      endTime: '2026-11-25T16:30:00',
      capacity: 120
    },
    {
      id: 2,
      title: '校园歌手大赛初赛',
      description: '一年一度的校园歌手大赛开始报名，初赛采用清唱形式，每人 3 分钟，晋级选手进入决赛。',
      category: '文艺体育',
      location: '大学生活动中心',
      startTime: '2026-12-05T18:30:00',
      endTime: '2026-12-05T21:00:00',
      capacity: 200
    },
    {
      id: 3,
      title: '图书馆图书整理志愿活动',
      description: '协助图书馆完成新到图书上架与书架整理，服务时长可计入志愿时长，提供饮用水与志愿证明。',
      category: '志愿服务',
      location: '图书馆一楼大厅',
      startTime: '2026-11-28T09:00:00',
      endTime: '2026-11-28T11:30:00',
      capacity: 30
    },
    {
      id: 4,
      title: '乡村振兴调研社会实践',
      description: '走访周边乡镇，围绕特色农业与乡村文旅开展问卷调研与访谈，形成调研报告，往返统一安排车辆。',
      category: '社会实践',
      location: '阜阳市颍上县',
      startTime: '2026-12-12T08:00:00',
      endTime: '2026-12-13T18:00:00',
      capacity: 20
    },
    {
      id: 5,
      title: '冬季校园迷你马拉松',
      description: '5 公里校园环跑，全程设置补给点与医疗点，完赛发放纪念奖牌，建议提前做好热身准备。',
      category: '文艺体育',
      location: '学校田径场',
      startTime: '2026-12-19T07:30:00',
      endTime: '2026-12-19T09:30:00',
      capacity: 150
    },
    {
      id: 6,
      title: 'Python 数据分析工作坊',
      description: '从 Pandas 数据清洗到可视化输出，带着笔记本电脑即可上手，课程结束后提供练习数据与代码。',
      category: '学术讲座',
      location: '实验楼 B302',
      startTime: '2026-12-02T19:00:00',
      endTime: '2026-12-02T21:00:00',
      capacity: 40
    }
  ]
}

function seedRegistrations() {
  return [
    {
      id: 1,
      userId: 1,
      activityId: 1,
      registrationTime: '2026-11-18T10:22:00',
      status: 'REGISTERED'
    },
    {
      id: 2,
      userId: 2,
      activityId: 2,
      registrationTime: '2026-11-19T15:41:00',
      status: 'REGISTERED'
    }
  ]
}

function seed() {
  return { activities: seedActivities(), registrations: seedRegistrations(), seq: 100 }
}

let data

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.activities)) return parsed
    }
  } catch { /* ignore */ }
  const fresh = seed()
  persist(fresh)
  return fresh
}

function persist(next = data) {
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
}

data = load()

function countRegistered(activityId) {
  return data.registrations.filter(
    (r) => Number(r.activityId) === Number(activityId) && r.status === 'REGISTERED'
  ).length
}

function activityView(a) {
  return { ...a, registeredCount: countRegistered(a.id) }
}

function registrationView(r) {
  const activity = data.activities.find((a) => Number(a.id) === Number(r.activityId))
  const user = USERS.find((u) => Number(u.id) === Number(r.userId))
  return {
    id: r.id,
    userId: r.userId,
    activityId: r.activityId,
    registrationTime: r.registrationTime,
    status: r.status,
    username: user ? user.username : `student${r.userId}`,
    activityTitle: activity ? activity.title : '活动已删除',
    activityLocation: activity ? activity.location : '-',
    activityStartTime: activity ? activity.startTime : null,
    activityEndTime: activity ? activity.endTime : null
  }
}

function nowText() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function nextId() {
  data.seq = (data.seq || 100) + 1
  return data.seq
}

function delay(ms = 260) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockRequest(path, options = {}) {
  await delay()
  const method = (options.method || 'GET').toUpperCase()
  const body = options.body ? JSON.parse(options.body) : {}
  const url = path.split('?')[0]

  // ---- 登录 ----
  if (/^\/users\/login$/.test(url) && method === 'POST') {
    const user = USERS.find(
      (u) => u.username === (body.username || '').trim() && u.password === body.password
    )
    if (!user) return { success: false, message: '账号或密码错误' }
    return { success: true, message: '登录成功', user: { id: user.id, username: user.username, role: user.role } }
  }

  // ---- 活动 ----
  if (/^\/activities$/.test(url) && method === 'GET') {
    return [...data.activities]
      .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)))
      .map(activityView)
  }

  if (/^\/activities$/.test(url) && method === 'POST') {
    const id = nextId()
    data.activities.push({
      id,
      title: body.title,
      description: body.description,
      category: body.category,
      location: body.location,
      startTime: body.startTime,
      endTime: body.endTime,
      capacity: Number(body.capacity) || 0
    })
    persist()
    return { success: true, message: '活动发布成功', id }
  }

  const activityMatch = url.match(/^\/activities\/(\d+)$/)
  if (activityMatch) {
    const id = Number(activityMatch[1])
    const activity = data.activities.find((a) => Number(a.id) === id)
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
      data.activities = data.activities.filter((a) => Number(a.id) !== id)
      data.registrations = data.registrations.filter((r) => Number(r.activityId) !== id)
      persist()
      return { success: true, message: '活动删除成功' }
    }
  }

  // ---- 报名 ----
  if (/^\/registrations$/.test(url) && method === 'GET') {
    return [...data.registrations]
      .sort((a, b) => String(b.registrationTime).localeCompare(String(a.registrationTime)))
      .map(registrationView)
  }

  const userRegs = url.match(/^\/registrations\/user\/(\d+)$/)
  if (userRegs && method === 'GET') {
    const userId = Number(userRegs[1])
    return data.registrations
      .filter((r) => Number(r.userId) === userId)
      .sort((a, b) => String(b.registrationTime).localeCompare(String(a.registrationTime)))
      .map(registrationView)
  }

  const activityRegs = url.match(/^\/registrations\/activity\/(\d+)$/)
  if (activityRegs && method === 'GET') {
    const activityId = Number(activityRegs[1])
    return data.registrations
      .filter((r) => Number(r.activityId) === activityId)
      .sort((a, b) => String(b.registrationTime).localeCompare(String(a.registrationTime)))
      .map(registrationView)
  }

  const countMatch = url.match(/^\/registrations\/count\/(\d+)$/)
  if (countMatch && method === 'GET') {
    const activityId = Number(countMatch[1])
    return { activityId, count: countRegistered(activityId) }
  }

  if (/^\/registrations$/.test(url) && method === 'POST') {
    const userId = Number(body.userId)
    const activityId = Number(body.activityId)
    const activity = data.activities.find((a) => Number(a.id) === activityId)
    if (!activity) return { success: false, message: '活动不存在' }
    const old = data.registrations.find(
      (r) => Number(r.userId) === userId && Number(r.activityId) === activityId
    )
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
        userId,
        activityId,
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
    const record = data.registrations.find(
      (r) =>
        Number(r.userId) === userId &&
        Number(r.activityId) === activityId &&
        r.status === 'REGISTERED'
    )
    if (!record) return { success: false, message: '没有找到有效报名记录' }
    record.status = 'CANCELLED'
    persist()
    return { success: true, message: '取消报名成功' }
  }

  throw new Error(`演示数据不支持该接口：${method} ${url}`)
}

export function resetMockData() {
  const fresh = seed()
  data = fresh
  persist(fresh)
}
