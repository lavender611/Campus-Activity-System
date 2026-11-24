-- =============================================================
-- 学生账号与活动报名导入脚本（2026-2027-1 学期重补修申请名单）
-- 名单来源：2026-2027-1学期重补修申请表.xlsx（G 姓名 / H 学号，按姓名去重）
-- 规则：用户名=姓名，密码=123456，角色 STUDENT；每人报名 2 项 11 月社团活动
-- 特点：按用户名/活动标题查找 id，可重复执行；已存在的账号或报名会自动跳过
-- 执行：mysql --default-character-set=utf8mb4 -u root -p campus_activity < database/nov2026_student_signup.sql
-- =============================================================
USE campus_activity;

-- 1) 建账号（姓名 / 学号）
--    段浩宇 2022036207 · 胡雨生 2023031057 · 吴钰琳 2023031089 · 张战 2023031258
--    韦涵烁 2023031323 · 韩旭 2023031472 · 余邵卿 2023031515 · 赵齐文 2023033035
--    王彤 2023035024 · 邓翼枫 2023035044 · 陈娜 2023036003 · 杨珺涵 2023036097
INSERT INTO users (username, password, role)
SELECT v.username, '123456', 'STUDENT'
FROM (
  SELECT '段浩宇' AS username UNION ALL
  SELECT '胡雨生' UNION ALL
  SELECT '吴钰琳' UNION ALL
  SELECT '张战' UNION ALL
  SELECT '韦涵烁' UNION ALL
  SELECT '韩旭' UNION ALL
  SELECT '余邵卿' UNION ALL
  SELECT '赵齐文' UNION ALL
  SELECT '王彤' UNION ALL
  SELECT '邓翼枫' UNION ALL
  SELECT '陈娜' UNION ALL
  SELECT '杨珺涵'
) v
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.username = v.username);

-- 2) 报名记录：每人 2 项，分布在 11 月社团活动中
INSERT INTO registrations (user_id, activity_id, registration_time, status)
SELECT u.id, a.id, v.reg_time, 'REGISTERED'
FROM (
  SELECT '段浩宇' AS username, '“以纸寄初心·时光回信”书信征集' AS act, '2026-11-20 09:12:00' AS reg_time UNION ALL
  SELECT '段浩宇', '“写给未来的一封信”时光邮局', '2026-11-20 09:14:00' UNION ALL
  SELECT '胡雨生', '英聚阜理·青言汇英语趣味摊位', '2026-11-20 09:20:00' UNION ALL
  SELECT '胡雨生', '“晨光沐绿·绿色生活”卫生巡查', '2026-11-20 09:22:00' UNION ALL
  SELECT '吴钰琳', '“绿色银行”环保兑换', '2026-11-20 09:31:00' UNION ALL
  SELECT '吴钰琳', '“赴朝曦”校园长跑竞赛', '2026-11-20 09:33:00' UNION ALL
  SELECT '张战', '“急救进校园”应急救护培训', '2026-11-20 09:40:00' UNION ALL
  SELECT '张战', '“荚点妙想，‘豆’是惊喜”豆荚娃娃手工制作活动', '2026-11-20 09:42:00' UNION ALL
  SELECT '韦涵烁', '“小实验，大国重器”桌面实验', '2026-11-20 09:50:00' UNION ALL
  SELECT '韦涵烁', '“晨光启行·食安护航”晨跑花跑', '2026-11-20 09:52:00' UNION ALL
  SELECT '韩旭', '“以纸寄初心·时光回信”书信征集', '2026-11-20 10:01:00' UNION ALL
  SELECT '韩旭', '“绿色银行”环保兑换', '2026-11-20 10:03:00' UNION ALL
  SELECT '余邵卿', '“写给未来的一封信”时光邮局', '2026-11-20 10:10:00' UNION ALL
  SELECT '余邵卿', '英聚阜理·青言汇英语趣味摊位', '2026-11-20 10:12:00' UNION ALL
  SELECT '赵齐文', '“晨光沐绿·绿色生活”卫生巡查', '2026-11-20 10:20:00' UNION ALL
  SELECT '赵齐文', '“赴朝曦”校园长跑竞赛', '2026-11-20 10:22:00' UNION ALL
  SELECT '王彤', '“急救进校园”应急救护培训', '2026-11-20 10:30:00' UNION ALL
  SELECT '王彤', '“小实验，大国重器”桌面实验', '2026-11-20 10:32:00' UNION ALL
  SELECT '邓翼枫', '“晨光启行·食安护航”晨跑花跑', '2026-11-20 10:40:00' UNION ALL
  SELECT '邓翼枫', '“荚点妙想，‘豆’是惊喜”豆荚娃娃手工制作活动', '2026-11-20 10:42:00' UNION ALL
  SELECT '陈娜', '“以纸寄初心·时光回信”书信征集', '2026-11-20 10:50:00' UNION ALL
  SELECT '陈娜', '“荚点妙想，‘豆’是惊喜”豆荚娃娃手工制作活动', '2026-11-20 10:52:00' UNION ALL
  SELECT '杨珺涵', '“晨光沐绿·绿色生活”卫生巡查', '2026-11-20 11:00:00' UNION ALL
  SELECT '杨珺涵', '“绿色银行”环保兑换', '2026-11-20 11:02:00'
) v
JOIN users u ON u.username = v.username
JOIN activities a ON a.title = v.act
WHERE NOT EXISTS (
  SELECT 1 FROM registrations r WHERE r.user_id = u.id AND r.activity_id = a.id
);

-- 3) 导入结果自检
SELECT '学生账号数' AS item, COUNT(*) AS cnt FROM users WHERE username IN
  ('段浩宇','胡雨生','吴钰琳','张战','韦涵烁','韩旭','余邵卿','赵齐文','王彤','邓翼枫','陈娜','杨珺涵')
UNION ALL
SELECT '这批学生的报名数', COUNT(*) FROM registrations r
  JOIN users u ON u.id = r.user_id
  WHERE u.username IN ('段浩宇','胡雨生','吴钰琳','张战','韦涵烁','韩旭','余邵卿','赵齐文','王彤','邓翼枫','陈娜','杨珺涵');
