# 校园活动报名管理系统

## 技术环境
- JDK 21
- Maven 3.9+
- MySQL 8.x
- Node.js 20+
- IntelliJ IDEA

## 项目结构
- `backend`：Spring Boot 3.5.7 + MyBatis
- `frontend`：Vue 3 + Vite + Element Plus
- `database/campus_activity.sql`：建库、建表、演示账号和活动数据
- `database/backup_before_fix_20261119.sql`：修复前旧库的备份（仅作留档，可删除）

## 一、初始化数据库
1. 打开 IDEA 的 Database 工具窗口，或 MySQL 命令行。
2. 执行 `database/campus_activity.sql`。**注意：该脚本会删除并重建 `campus_activity` 数据库中的原有三张业务表，原有数据会丢失；如果要保留旧数据，请先备份。**

   > 本项目的代码依赖 `activities.category` 字段、`users.student02` 等演示数据。
   > 如果数据库是更早版本留下的，结构与代码不一致，接口会报
   > `Unknown column 'a.category' in 'field list'`，此时必须重新执行本脚本。

   命令行方式（推荐指定字符集，避免中文变 `?`）：

   ```bash
   mysql --default-character-set=utf8mb4 -u root -p < database/campus_activity.sql
   ```

3. 默认数据库名为 `campus_activity`。

演示账号：
- 学生：`student01` / `123456`
- 学生测试账号：`student02` / `123456`（用于验证不同学生的报名数据隔离）
- 管理员：`admin` / `123456`

## 二、配置后端数据库密码
`backend/src/main/resources/application.properties` 默认连接本机 MySQL：

```properties
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:123456}
```

- 你的 root 密码是 `123456` 时，**无需任何修改**即可运行。
- 密码不同时，把默认值改成你的密码，或设置环境变量 `DB_PASSWORD`
  （IDEA：Run/Debug Configurations → Environment variables）。
- 端口被占用时可设置 `SERVER_PORT`，或在运行配置中加 `--server.port=8081`。

> 不要把真实密码提交到公共仓库。

## 三、运行后端
1. IDEA 选择 Open，打开 `backend` 文件夹（或打开根目录后加载 `backend/pom.xml`）。
2. 等待 Maven 下载依赖。
3. 运行 `backend/src/main/java/com/campus/CampusActivityApplication.java`。
4. 后端地址：`http://localhost:8080`
5. 可访问 `http://localhost:8080/api/activities` 检查活动接口。

## 四、运行前端
在 IDEA Terminal 中执行：
```bash
cd frontend
npm install
npm run dev
```
打开终端显示的地址，通常为 `http://localhost:5173`。

如果 5173 被占用，Vite 会自动改用 5174 等端口；后端 CORS 已允许
`http://localhost:*` 与 `http://127.0.0.1:*`，无需改配置。

前端默认请求 `http://localhost:8080/api`，如需修改可设置环境变量
`VITE_API_BASE`（例如在 `frontend/.env.local` 中写入）。

## 功能
- 学生/管理员登录与退出
- 活动列表、详情、搜索和分类筛选
- 管理员发布、编辑、删除活动
- 学生报名、取消报名
- 我的报名记录
- 管理员查看报名名单
- 报名人数统计
- 登录状态刷新后保留（演示项目使用 localStorage）

## 五、常见问题排查（IDEA）

| 现象 | 原因 | 解决 |
| --- | --- | --- |
| 启动报 `Port 8080 was already in use` | 上一次运行的后端进程没有退出，一直占用 8080 | 结束占用进程后重新运行：`netstat -ano \| findstr :8080` 找到 PID，再 `taskkill /PID <PID> /F`；或把 `SERVER_PORT` 改成 8081 |
| 每个接口都 500，日志为 `Access denied for user 'root'@'localhost'` | `application.properties` 中的密码与实际 root 密码不一致（旧版本默认是占位符 `CHANGE_ME`） | 修改 `application.properties` 或设置 `DB_PASSWORD`，见第二节 |
| 接口 500，日志为 `Unknown column 'a.category' in 'field list'` | 数据库还是旧版结构，缺少 `category` 等字段 | 重新执行 `database/campus_activity.sql`，见第一节 |
| 接口 500，日志为 `Unknown database 'campus_activity'` | 还没建库 | 执行 `database/campus_activity.sql` |
| 页面提示“无法连接后端服务” | 后端没启动 / 端口不是 8080 / 被 CORS 拦截 | 先确认 `http://localhost:8080/api/activities` 能打开，再刷新页面 |
| 浏览器控制台 `CORS policy` 报错 | 前端端口与后端白名单不一致 | 已用 `allowedOriginPatterns` 放行 localhost / 127.0.0.1 的任意端口；若换了主机名，需同步修改 `CorsConfig` |
| 中文变成 `???` 或乱码 | 建库脚本以非 UTF-8 客户端执行 | 用 `--default-character-set=utf8mb4` 重新执行脚本；IDEA 项目编码已统一为 UTF-8 |
| IDEA 里 `Cannot resolve symbol` / 找不到依赖 | Maven 工程未导入 | 右键 `backend/pom.xml` → Add as Maven Project，或 Maven 面板点刷新 |

> 说明：本项目已加入统一异常处理，后端出错时会返回
> `{ "success": false, "message": "中文提示" }`，前端会直接弹出该提示，
> 不会再只显示一个空白 500 页面。

## 六、Python 接口自动化测试

测试代码在 `python-tests/`，基于 **pytest + requests**，共 65 个用例，覆盖登录、活动增删改查、
报名/取消、参数校验和 CORS。

```powershell
cd python-tests
.\run_tests.ps1              # 一键安装依赖并运行（Windows）
```

```bash
cd python-tests
./run_tests.sh               # macOS / Linux / Git Bash
```

测试框架会**自动探活**：8080 已有后端就直接复用，没有就启动 `backend/target` 下的 jar
（跑完自动关闭）。所以运行前请先构建一次：

```bash
mvn -f backend/pom.xml -DskipTests package
```

`mysql` 需已导入 `database/campus_activity.sql`。用例自建活动并在结束时删除，
不会污染演示数据。HTML 报告输出到 `python-tests/reports/report.html`。

详细说明见 [python-tests/README.md](python-tests/README.md)。

## 说明
这是课程演示项目。当前登录采用明文密码比对，前端 localStorage 中的角色和用户 ID 不能作为生产环境身份认证。正式部署应改用 BCrypt、Spring Security、JWT/Session 和服务端权限校验。
