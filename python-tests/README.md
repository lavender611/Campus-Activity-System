# Python 接口自动化测试

基于 **pytest + requests** 的接口自动化测试，覆盖登录、活动增删改查、报名/取消、参数校验和 CORS。

## 快速开始

```powershell
# Windows（在 python-tests 目录下）
.\run_tests.ps1
```

```bash
# macOS / Linux / Git Bash
./run_tests.sh
```

脚本会自动：创建 `.venv` 虚拟环境 → 安装依赖 → 运行 pytest → 在 `reports/report.html` 生成 HTML 报告。

## 后端从哪来？

测试框架有三种获取后端的方式，按优先级：

1. `--base-url http://127.0.0.1:8080`（命令行指定）
2. 环境变量 `API_BASE_URL`
3. 默认探测 `http://127.0.0.1:8080`

- **8080 已有后端在跑**（比如你在 IDEA 里点的运行）→ 直接复用，不会重复启动。
- **8080 没有服务** → 自动启动 `backend/target/campus-activity-1.0.0.jar`，分配一个空闲端口，跑完自动关闭。日志在 `reports/backend.log`。

因此跑测试前需要先构建 jar：

```bash
mvn -f backend/pom.xml -DskipTests package
```

不想让测试启动后端（只测已有服务）时：

```powershell
.\run_tests.ps1 --no-autostart
```

## 常用命令

```powershell
.\run_tests.ps1 -m smoke          # 只跑冒烟用例
.\run_tests.ps1 -m regression     # 只跑回归用例
.\run_tests.ps1 -k registrations  # 按名字筛选
.\run_tests.ps1 -v                # 详细输出
```

## 用例覆盖

| 文件 | 覆盖内容 |
| --- | --- |
| `tests/test_health_and_schema.py` | 服务可用性、活动字段结构、ISO 时间格式、排序、404/405 |
| `tests/test_auth.py` | 三个演示账号登录、错误密码、空账号、SQL 注入尝试、密码不回传、畸形 JSON |
| `tests/test_activities_crud.py` | 新增/详情/修改/删除、列表可见性、404、删除活动级联清理报名 |
| `tests/test_registrations.py` | 报名、重复报名、取消、重复取消、重新报名、数据隔离、报名名单、名额已满、非法用户/活动 |
| `tests/test_validation.py` | 空字段、缺字段、名额非法、结束早于开始、时间格式错误、超长文本、非数字路径参数 |
| `tests/test_cors.py` | 5173 / 5174 / 127.0.0.1 预检与响应头、不可信来源被拒 |

## 数据隔离

每个用例通过 `activity_factory` 自己创建活动，用例结束后 `DELETE` 该活动，报名记录由后端级联删除。
所以测试**不会**污染 `database/campus_activity.sql` 导入的演示数据，也不会互相干扰。

用户 ID 通过登录接口动态解析（不写死 1/2/3），重新导入数据库后依然可用。

## 前置条件

| 依赖 | 说明 |
| --- | --- |
| Python 3.9+ | 已在 3.13 上验证 |
| JDK 21 | 自动启动 jar 时需要；`JAVA_HOME` 或 PATH 中的 `java` |
| MySQL 8 | 已导入 `database/campus_activity.sql`，密码与 `application.properties` 一致 |

## 常见问题

| 现象 | 处理 |
| --- | --- |
| `未找到后端 jar` | 先执行 `mvn -f backend/pom.xml -DskipTests package` |
| 后端启动失败，日志含 `Access denied` | MySQL 密码不对，设置 `DB_PASSWORD` 环境变量 |
| 日志含 `Unknown column 'a.category'` | 数据库是旧结构，重新执行 `database/campus_activity.sql` |
| 用例提示演示数据不足 5 条 | 同上，重新导入数据库脚本 |
| 全部用例被 skip | 指定了 `--no-autostart` 且后端没运行 |
