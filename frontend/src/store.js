import { reactive } from 'vue'

/* ============================================================
   全局状态（纯前端演示原型，不连接真实后端；刷新后还原）
   role: 游客 / student 学生 / admin 管理员
   ============================================================ */

// 活动类别（与需求表格一致）
export const CATEGORIES = ['全部', '学术讲座', '文艺体育', '志愿服务', '社会实践']

// 演示活动数据：字段与需求表格中的卡片要素对应
export const ACTIVITIES = [
  {
    id: 1,
    title: '新学期程序设计经验分享会',
    organizer: '计算机学院学生会',
    category: '学术讲座',
    startAt: '2026-11-20 14:30',
    location: '信息楼 A301',
    capacity: 80,
    signed: 56,
    desc: '邀请高年级获奖同学分享算法训练、竞赛备赛与课程学习方法，现场设有提问交流环节，欢迎对程序设计感兴趣的同学参加。',
    status: 'signup-ongoing'
  },
  {
    id: 2,
    title: '校园十佳歌手大赛海选',
    organizer: '校团委 · 文艺部',
    category: '文艺体育',
    startAt: '2026-11-22 19:00',
    location: '大学生活动中心报告厅',
    capacity: 200,
    signed: 200,
    desc: '一年一度的校园歌手海选，演唱形式不限，个人或组合均可报名，海选通过者晋级复赛并进入决赛舞台。',
    status: 'full'
  },
  {
    id: 3,
    title: '社区敬老志愿服务日',
    organizer: '青年志愿者协会',
    category: '志愿服务',
    startAt: '2026-11-23 08:30',
    location: '春晖社区养老服务中心',
    capacity: 30,
    signed: 12,
    desc: '随同志愿者前往社区陪伴老人、协助开展手工与文娱活动，请报名同学按时集合，穿着便于活动的服装。',
    status: 'signup-ongoing'
  },
  {
    id: 4,
    title: '企业参观：智能制造生产线',
    organizer: '就业指导中心',
    category: '社会实践',
    startAt: '2026-11-25 13:30',
    location: '园区企业展厅（统一乘车）',
    capacity: 45,
    signed: 28,
    desc: '走进合作企业参观智能制造车间与研发实验室，了解岗位需求与行业现状，行程含企业宣讲与答疑。',
    status: 'signup-ongoing'
  },
  {
    id: 5,
    title: '秋季篮球友谊赛（院系组）',
    organizer: '校体育部',
    category: '文艺体育',
    startAt: '2026-11-27 16:00',
    location: '西区室外篮球场',
    capacity: 60,
    signed: 41,
    desc: '以院系为单位组队的友谊赛，设男女混合组别，赛后统一合影，欢迎参赛队员与观赛同学报名。',
    status: 'signup-ongoing'
  },
  {
    id: 6,
    title: '考研英语阅读专题讲座',
    organizer: '外国语学院',
    category: '学术讲座',
    startAt: '2026-12-02 18:30',
    location: '教学楼 B204',
    capacity: 120,
    signed: 96,
    desc: '围绕考研阅读题型拆解长难句与答题策略，配套讲义现场发放，建议携带真题资料听讲。',
    status: 'signup-ongoing'
  },
  {
    id: 7,
    title: '图书馆整理志愿行动',
    organizer: '图书馆 · 学生助理团',
    category: '志愿服务',
    startAt: '2026-12-05 09:00',
    location: '图书馆三楼借阅区',
    capacity: 25,
    signed: 25,
    desc: '协助馆员整理书架、引导归还图书，服务时长可记入志愿记录。名额已满，可留意后续场次。',
    status: 'full'
  },
  {
    id: 8,
    title: '创新创业项目路演观摩',
    organizer: '创新创业学院',
    category: '社会实践',
    startAt: '2026-12-08 15:00',
    location: '创客空间路演厅',
    capacity: 70,
    signed: 19,
    desc: '观摩在校创业团队项目路演，了解立项、答辩与孵化流程，有意向组队的同学可在交流区对接。',
    status: 'signup-ongoing'
  }
]

// 报名名单（管理员视角演示数据），键为活动 id
export const ROSTER = {
  1: [
    { name: '林同学', sid: '2024010101', phone: '138****2201', status: '已报名' },
    { name: '陈同学', sid: '2024010102', phone: '139****3312', status: '已报名' },
    { name: '赵同学', sid: '2024010103', phone: '137****4456', status: '已报名' },
    { name: '黄同学', sid: '2024010104', phone: '135****7789', status: '已报名' }
  ],
  2: [
    { name: '周同学', sid: '2024020201', phone: '136****1123', status: '已报名' },
    { name: '吴同学', sid: '2024020202', phone: '138****9034', status: '已报名' }
  ],
  3: [
    { name: '郑同学', sid: '2024030301', phone: '139****5567', status: '已报名' },
    { name: '孙同学', sid: '2024030302', phone: '137****2210', status: '已报名' },
    { name: '马同学', sid: '2024030303', phone: '135****8845', status: '已报名' }
  ]
}

// 全局响应式状态
export const state = reactive({
  role: '游客', // 游客 / student / admin
  userName: '',
  mySignups: [], // 当前学生报名记录 [{ activityId, signupAt, status }]
  favorites: [] // 收藏的活动 id 集合
})

// 预置一条学生报名记录，便于“我的报名”页演示取消流程
export function seedStudentSignup() {
  if (state.role === 'student' && state.mySignups.length === 0) {
    state.mySignups.push({
      activityId: 1,
      signupAt: '2026-11-16 10:24',
      status: '已报名'
    })
  }
}

// 活动状态推导：报名中 / 已满员 / 已结束
export function activityStatus(a) {
  if (a.status === 'ended') return { text: '已结束', type: 'info' }
  if (a.signed >= a.capacity) return { text: '已满员', type: 'danger' }
  return { text: '报名中', type: 'success' }
}

// 退出登录并清空个人相关状态
export function logout() {
  state.role = '游客'
  state.userName = ''
  state.mySignups = []
  state.favorites = []
}
