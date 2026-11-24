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

## 一、初始化数据库
1. 打开 IDEA 的 Database 工具窗口，或 MySQL 命令行。
2. 执行 `database/campus_activity.sql`。**注意：该脚本会删除并重建 `campus_activity` 数据库中的原有三张业务表，原有数据会丢失；如果要保留旧数据，请先备份。**
3. 默认数据库名为 `campus_activity`。

演示账号：
- 学生：`student01` / `123456`
- 学生测试账号：`student02` / `123456`（用于验证不同学生的报名数据隔离）
- 管理员：`admin` / `123456`

## 二、配置后端数据库密码
打开 `backend/src/main/resources/application.properties`，将：
`spring.datasource.password=CHANGE_ME`
改成你自己电脑 MySQL 的 root 密码。不要把密码发给别人。

## 三、运行后端
1. IDEA 选择 Open，打开 `backend` 文件夹（或打开根目录后加载 backend/pom.xml）。
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

## 功能
- 学生/管理员登录与退出
- 活动列表、详情、搜索和分类筛选
- 管理员发布、编辑、删除活动
- 学生报名、取消报名
- 我的报名记录
- 管理员查看报名名单
- 报名人数统计
- 登录状态刷新后保留（演示项目使用 localStorage）

## 说明
这是课程演示项目。当前登录采用明文密码比对，前端 localStorage 中的角色和用户 ID 不能作为生产环境身份认证。正式部署应改用 BCrypt、Spring Security、JWT/Session 和服务端权限校验。
