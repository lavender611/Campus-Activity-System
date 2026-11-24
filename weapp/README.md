# 校园活动报名 · 微信原生小程序

把原来的 Vue 3 + Element Plus PC 版改写成了**微信原生小程序**（WXML / WXSS / JS，无 npm、无框架、无构建步骤），导入微信开发者工具即可运行。功能与之前交付的手机 H5 版一一对应，业务逻辑、接口约定、提示文案都保持一致。

原 `frontend`（PC 版）、`backend`、`mobile-h5`（H5 版）均未改动，可以并存对照。

## 一、跑起来（3 步）

**最快方式：双击本目录的 `一键启动.bat`。** 它会依次做完：探测当前电脑 IP 并写进 `utils/config.js` → 确认 MySQL80 在跑 → 新窗口启动后端（`mvn spring-boot:run`）→ 等到 `http://localhost:8080/api/activities` 返回 200 → 让微信开发者工具打开本项目。全程不用手动开任何东西。停止服务双击 `一键停止.bat`。

想完全不用管：双击一次 `开机自动启动.bat`，它把后端挂进 Windows 启动文件夹（窗口最小化），以后开机后端自己就在跑；`取消开机自动启动.bat` 可撤销。

手动方式（不想用脚本时）：

1. **装微信开发者工具**（稳定版），用微信扫码登录。
2. **导入项目**：选择本目录 `CampusActivity_FullProject\weapp`，AppID 填自己的或「测试号」，不使用云服务。
3. **起后端**：双击 `backend\run-backend.cmd`（基于 JDK 21 + Maven 3.9）。后端起好后 `utils\config.js` 里的 `baseUrl` 要指向本机 IP：本机调试用 `http://localhost:8080/api`，手机真机用 `http://电脑局域网IP:8080/api`。IP 变了双击 `更新后端地址.bat` 自动同步。

导入后在「详情 → 本地设置」勾选 **不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书**，否则 `http://` 的局域网地址会被拦截。

手机上运行：点工具栏「预览」，用微信扫码即可在真机打开（真机同样继承上面这条"不校验域名"的设置）。

## 二、手机连真实后端要满足的条件

1. 后端在跑：IDEA 里启动 `CampusActivityApplication`，8080 有监听。
2. 数据库密码已改：`backend/src/main/resources/application.properties` 里的 `spring.datasource.password` 不能是 `CHANGE_ME`。
3. 电脑防火墙放行 8080：双击 **`放行后端8080.bat`**（右键「以管理员身份运行」）。已代为添加规则 `CampusActivity-Backend-8080`（入站、TCP 8080、专用+公用网络）。
4. 手机和电脑连**同一个 Wi-Fi**，用手机浏览器先访问 `http://电脑IP:8080/api/activities`，能看到 JSON 再回小程序。

四条都满足后，小程序顶部的橙色「演示数据」标记会消失，登录、报名等操作都落到真实数据库。

## 三、连不上会怎样

后端不可达（没启动、IP 错、防火墙拦、跨网段）时，小程序会自动切到**内置演示数据**：6 条活动、3 个账号、2 条报名记录，全部操作存在本机微信缓存里，页面不会白屏，顶栏显示橙色「演示数据」。

在「我的」页可以：
- **重新连接后端**：清掉演示模式，重新走真实接口；
- **重置演示数据**：恢复初始 6 条活动。

演示模式下的账号与真实后端一致：`student01 / 123456`、`student02 / 123456`、`admin / 123456`。

## 四、功能对照

| 原 PC 版（Vue + Element Plus） | 微信小程序 |
| --- | --- |
| 顶部横向导航 | 微信原生导航栏 + 自绘底部 Tab（活动 / 我的报名 / 活动管理 / 我的，按角色显示） |
| Element Plus 表格 | 卡片式列表 |
| el-input / el-select | 原生 `input` / `picker` |
| el-date-picker | `picker mode="date"` + `picker mode="time"` 两段选择 |
| ElMessage / ElMessageBox | 原生 `wx.showToast` / `wx.showModal` |
| 活动列表、搜索、分类筛选 | 保留（输入即筛，5 个分类 chips） |
| 详情、报名、取消报名、名额进度 | 保留，详情页底部固定操作栏 |
| 我的报名、取消报名 | 保留 |
| 管理员发布 / 编辑 / 删除、报名名单、人数统计 | 保留，删除走原生确认弹窗 |
| 登录态 `localStorage: campusUser` | 登录态 `wx.setStorageSync('campusUser')`，字段一致（id / username / role） |

## 五、目录结构

```
weapp/
├─ app.js / app.json / app.wxss      # 小程序入口、页面注册、全局样式（深蓝主色）
├─ project.config.json               # 导入用配置（已关闭域名校验）
├─ sitemap.json
├─ utils/
│  ├─ config.js                      # ★ 后端地址，改这里
│  ├─ api.js                         # wx.request 封装，超时 6 秒，失败自动降级
│  ├─ mock.js                        # 内置演示数据，语义与后端一致
│  ├─ store.js                       # 登录态
│  ├─ format.js                      # 日期短格式
│  └─ toast.js                       # toast 与确认弹窗
├─ components/
│  ├─ tabbar/                        # 自绘底部导航（按角色渲染）
│  └─ status-bar/                    # 顶部「演示数据」标记 + 用户名
├─ pages/
│  ├─ list/                          # 活动列表（搜索、筛选、下拉刷新）
│  ├─ detail/                        # 活动详情（报名 / 取消 / 名单入口）
│  ├─ login/                         # 登录
│  ├─ mine/                          # 我的报名
│  ├─ manage/                        # 活动管理（发布 / 编辑 / 名单 / 删除）
│  ├─ publish/                       # 发布与编辑表单
│  ├─ roster/                        # 报名名单
│  └─ me/                            # 个人中心（数据来源、重连、重置、退出）
├─ 放行后端8080.bat                   # 右键管理员运行，放行 8080
└─ self-check.js                     # 逻辑自检脚本（node self-check.js）
```

## 六、自检

不装开发者工具也能验业务逻辑：

```bash
cd CampusActivity_FullProject\weapp
node self-check.js
```

用 Node 桩件模拟 `wx` 接口，覆盖：登录、错误密码、活动列表、报名数、报名、重复报名拦截、我的报名、取消报名、发布、详情、编辑、删除、名单，以及列表/详情/管理/我的报名/名单/个人中心/编辑回填等页面的数据处理。后端在跑时会额外验证真实接口链路，没跑则自动跳过。

## 七、正式发布需要做的事

目前是**开发/体验阶段**的跑法（http + 局域网 IP）。要真正发布到微信，还需要：

1. 后端部署到有 HTTPS 的服务器（域名需备案）；
2. 小程序后台「开发管理 → 开发设置 → 服务器域名」把该域名加到 `request` 合法域名；
3. `utils/config.js` 改成 `https://你的域名/api`；
4. 用正式 AppID 上传代码、提交审核。

## 八、已知限制

- 登录仍是明文密码比对（沿用课程项目原设计），生产环境应改 BCrypt + 服务端会话/JWT。
- 小程序端角色判断只用于界面展示，真正的权限校验必须在后端做。
- 电脑 IP 由 DHCP 分配，换网络后会变，需要同步改 `utils/config.js`。

## 九、模拟器白屏怎么处理（已排查）

现象：开发者工具里只有导航栏，页面主体一片白，调试器报
`error: SystemError (appServiceSDKScriptError) ["Page route 错误(system error)」routeDone with a webviewId 19 is not found`。

这不是代码问题（把页面换成一行纯文字照样白屏），是**模拟器的 webview 实例没建起来**。按顺序试：

1. 点模拟器下方工具条上的 **↻ 刷新**（或右键模拟器「重新编译」）。绝大多数情况一次就好。
2. 还不行就关掉模拟器再开：工具栏「工具 → 重新启动模拟器」。
3. 再不行重启整个开发者工具（项目配置会保留，直接重开就行）。
4. 顺手把「详情 → 本地设置 → 调试基础库」从灰度版切到稳定版（原来是 `3.18.0` 灰度版，本目录的 `project.private.config.json` 已改为 `3.0.0`，重启工具后生效）。

补充一条已修的隐患：早期 `app.js` 不做处理时，只要某次请求失败，`演示数据` 标志会存进缓存，后面即使后端恢复也一直走 mock。现在 `app.js` 的 `onLaunch` 会把它重置，每次冷启动都重新尝试真实后端。
