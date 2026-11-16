# 校园活动报名管理系统（前端原型）

基于 **Vue 3 + Vite + Element Plus + Vue Router + ECharts** 的纯前端演示工程，对应实验一「需求分析」阶段的界面原型。

## 技术栈

- 框架：Vue 3（组合式 API，`<script setup>`）
- 构建：Vite 8
- UI 组件库：Element Plus 2.x + @element-plus/icons-vue
- 路由：Vue Router 4（hash 模式，含角色守卫）
- 图表：ECharts 6（热门活动柱状图、类别分布饼图）
- 状态：Vue `reactive` 全局状态（`src/store.js`），无后端、无持久化

## 目录结构

```
campus-vue/
├── index.html              # 页面入口
├── package.json            # 依赖与脚本
├── vite.config.js           # Vite 配置（含 Vue 插件）
└── src/
    ├── main.js             # 应用入口：注册 Element Plus、图标、路由
    ├── App.vue             # 全局布局：顶部导航 + 角色分流菜单
    ├── style.css           # 全局基础样式
    ├── store.js            # 全局状态、演示活动数据、报名名单、工具函数
    ├── router/index.js     # 路由表与角色守卫
    └── pages/
        ├── Login.vue           # 登录 / 注册（游客）
        ├── ActivityList.vue     # 活动列表（学生、游客）
        ├── ActivityDetail.vue  # 活动详情（学生、游客）
        ├── MySignups.vue        # 我的报名（学生）
        ├── PublishActivity.vue  # 发布 / 修改活动（管理员）
        ├── ActivityManage.vue    # 活动管理（管理员）
        ├── SignupRoster.vue    # 报名名单（管理员）
        └── Analytics.vue       # 数据分析（管理员）
```

## 本地运行

前置环境：Node.js 18+（本机为 Node v22）。

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 3. 生产构建（输出到 dist/）
npm run build

# 4. 预览生产构建
npm run preview
```

## 演示账号与角色

原型为纯前端演示，不校验真实密码，登录时按账号区分角色：

- 学生：任意学号 / 密码登录，进入学生侧（活动列表、我的报名）
- 管理员：账号含 `admin`（如 `admin`）登录，进入管理侧（活动管理、报名名单、数据分析、发布活动）
- 注册页可手动选择身份（学生 / 管理员）

## 已实现的业务规则（演示口径）

- 同一学生对同一活动仅保留一条有效报名；取消报名后名额释放。
- 名额为正整数；活动开始时间不得早于当前时间（发布 / 修改表单校验）。
- 未登录点击报名跳转登录页；学生页与管理员页由路由守卫按角色拦截。
- 报名名单可导出为 CSV（前端 Blob 下载）。

## 边界说明

- 本工程为**纯前端原型**：业务数据固化在 `src/store.js`，无后端接口、无数据库、无持久化；刷新页面后数据还原，换设备不共享。
- 课程真实开发栈为 Vue 3 + Element Plus（前端）、Spring Boot（后端）、MySQL（存储）、Python Pandas / Matplotlib（分析）；本原型尚未对接后端与数据库。
- 图表数据来自内置演示活动，切换类别 / 时间范围后在前端重新聚合。
