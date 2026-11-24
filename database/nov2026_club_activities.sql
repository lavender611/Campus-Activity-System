-- =============================================================
-- 2026 年 11 月学生社团系列活动 —— 增量导入脚本
-- 来源：共青团阜阳理工学院委员会 宣传展板（共 10 项）
-- 用途：在已有数据的 campus_activity 库上追加这 10 项活动，
--       不删表、不删数据、不影响已有报名记录。
-- 可重复执行：已存在同名活动时自动跳过（按 title 判重）。
-- 执行：mysql --default-character-set=utf8mb4 -u root -p campus_activity < database/nov2026_club_activities.sql
-- =============================================================
USE campus_activity;

INSERT INTO activities (title, description, category, location, start_time, end_time, capacity)
SELECT '“以纸寄初心·时光回信”书信征集', '承办：思想政治教育研究会；QQ群号：1006359614。面向全校学生征集书信作品，写下初心与期许，优秀作品将在大学生活动中心展出。', '文艺体育', '大学生活动中心大礼堂前厅', '2026-11-23 09:00:00', '2026-11-23 17:00:00', 100
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE title = '“以纸寄初心·时光回信”书信征集');

INSERT INTO activities (title, description, category, location, start_time, end_time, capacity)
SELECT '“写给未来的一封信”时光邮局', '承办：西湖文学社；QQ群号：1132957914。把想对未来自己说的话写成信，由社团统一保管，并在约定时间寄出。', '文艺体育', '大学生活动中心大礼堂前厅', '2026-11-24 09:00:00', '2026-11-25 17:00:00', 200
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE title = '“写给未来的一封信”时光邮局');

INSERT INTO activities (title, description, category, location, start_time, end_time, capacity)
SELECT '英聚阜理·青言汇英语趣味摊位', '承办：外国语协会；QQ群号：1136239265。通过英语猜词、配音、口语闯关等摊位游戏练习英语表达，现场可领取小礼品。', '学术讲座', '大学生活动中心大礼堂前厅', '2026-11-27 14:00:00', '2026-11-27 17:00:00', 80
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE title = '英聚阜理·青言汇英语趣味摊位');

INSERT INTO activities (title, description, category, location, start_time, end_time, capacity)
SELECT '“晨光沐绿·绿色生活”卫生巡查', '承办：绿笙环境保护协会；QQ群号：806463111。每周三早上 7:10 在教学楼区域开展卫生巡查与文明劝导，持续一学期。', '志愿服务', '1-8号教学楼', '2026-11-25 07:10:00', '2027-01-13 07:10:00', 60
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE title = '“晨光沐绿·绿色生活”卫生巡查');

INSERT INTO activities (title, description, category, location, start_time, end_time, capacity)
SELECT '“绿色银行”环保兑换', '承办：绿笙环境保护协会；QQ群号：1135943506。用可回收物兑换绿植和学习用品，倡导低碳校园生活。', '志愿服务', '大学生活动中心大礼堂前厅', '2026-11-26 09:00:00', '2026-11-27 17:00:00', 100
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE title = '“绿色银行”环保兑换');

INSERT INTO activities (title, description, category, location, start_time, end_time, capacity)
SELECT '“晨光启行·食安护航”晨跑花跑', '承办：食安先锋社；QQ群号：1130571837。清晨集体晨跑，沿途宣传食品安全知识，完成打卡可获纪念徽章。', '文艺体育', '风雨操场', '2026-11-23 06:30:00', '2026-12-01 07:30:00', 80
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE title = '“晨光启行·食安护航”晨跑花跑');

INSERT INTO activities (title, description, category, location, start_time, end_time, capacity)
SELECT '“赴朝曦”校园长跑竞赛', '承办：跑步爱好者协会；QQ群号：240219215。校园长跑竞赛，按完赛成绩分组排名，设男女组奖项。', '文艺体育', '风雨操场', '2026-11-29 09:00:00', '2026-12-06 17:00:00', 150
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE title = '“赴朝曦”校园长跑竞赛');

INSERT INTO activities (title, description, category, location, start_time, end_time, capacity)
SELECT '“急救进校园”应急救护培训', '承办：大学生应急救护社团；QQ群号：1131948138。心肺复苏、AED 使用与创伤包扎培训，考核合格颁发急救员证书。', '志愿服务', '图书馆一楼报告厅', '2026-11-29 14:00:00', '2026-11-29 17:00:00', 100
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE title = '“急救进校园”应急救护培训');

INSERT INTO activities (title, description, category, location, start_time, end_time, capacity)
SELECT '“荚点妙想，‘豆’是惊喜”豆荚娃娃手工制作活动', '承办：大学生创新创业协会；QQ群号：635044224。用豆荚、布料等材料制作娃娃，作品可参与创意市集展示。', '文艺体育', '4号教学楼109', '2026-11-23 09:00:00', '2026-11-29 17:00:00', 60
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE title = '“荚点妙想，‘豆’是惊喜”豆荚娃娃手工制作活动');

INSERT INTO activities (title, description, category, location, start_time, end_time, capacity)
SELECT '“小实验，大国重器”桌面实验', '承办：电子爱好者协会；QQ群号：1134186713。现场演示电磁、光学等桌面小实验，并可动手组装简易装置。', '学术讲座', '一期食堂北侧操场', '2026-11-22 09:00:00', '2026-11-22 17:00:00', 80
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE title = '“小实验，大国重器”桌面实验');
