CREATE DATABASE IF NOT EXISTS campus_activity
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE campus_activity;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE activities (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  location VARCHAR(150) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  capacity INT NOT NULL DEFAULT 100,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE registrations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  activity_id BIGINT NOT NULL,
  registration_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'REGISTERED',
  CONSTRAINT fk_registration_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_registration_activity FOREIGN KEY (activity_id) REFERENCES activities(id),
  CONSTRAINT uk_user_activity UNIQUE (user_id, activity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (id, username, password, role) VALUES
(1, 'student01', '123456', 'STUDENT'),
(2, 'admin', '123456', 'ADMIN'),
(3, 'student02', '123456', 'STUDENT');

INSERT INTO activities
(id, title, description, category, location, start_time, end_time, capacity) VALUES
(1, '校园迎新活动', '欢迎新同学参加校园迎新活动，认识校园并结交朋友。', '文艺体育', '学校操场', '2026-12-01 09:00:00', '2026-12-01 12:00:00', 80),
(2, '校园辩论赛比赛', '围绕校园热点话题开展辩论交流。', '文艺体育', '教学楼A栋', '2026-12-05 09:00:00', '2026-12-05 17:00:00', 60),
(3, '学术交流讲座', '邀请教师分享学术研究与学习方法。', '学术讲座', '学术报告厅', '2026-12-09 09:00:00', '2026-12-09 12:00:00', 120),
(4, '校园志愿服务', '参与校园志愿服务活动。', '志愿服务', '学校操场', '2026-12-12 09:00:00', '2026-12-12 17:00:00', 50),
(5, '社会实践分享会', '交流社会实践经验与成果。', '社会实践', '大学生活动中心', '2026-12-15 14:00:00', '2026-12-15 16:00:00', 100);

-- 2026 年 11 月学生社团系列活动（共青团阜阳理工学院委员会 宣），共 10 项
INSERT INTO activities
(id, title, description, category, location, start_time, end_time, capacity) VALUES
(6, '“以纸寄初心·时光回信”书信征集', '承办：思想政治教育研究会；QQ群号：1006359614。面向全校学生征集书信作品，写下初心与期许，优秀作品将在大学生活动中心展出。', '文艺体育', '大学生活动中心大礼堂前厅', '2026-11-23 09:00:00', '2026-11-23 17:00:00', 100),
(7, '“写给未来的一封信”时光邮局', '承办：西湖文学社；QQ群号：1132957914。把想对未来自己说的话写成信，由社团统一保管，并在约定时间寄出。', '文艺体育', '大学生活动中心大礼堂前厅', '2026-11-24 09:00:00', '2026-11-25 17:00:00', 200),
(8, '英聚阜理·青言汇英语趣味摊位', '承办：外国语协会；QQ群号：1136239265。通过英语猜词、配音、口语闯关等摊位游戏练习英语表达，现场可领取小礼品。', '学术讲座', '大学生活动中心大礼堂前厅', '2026-11-27 14:00:00', '2026-11-27 17:00:00', 80),
(9, '“晨光沐绿·绿色生活”卫生巡查', '承办：绿笙环境保护协会；QQ群号：806463111。每周三早上 7:10 在教学楼区域开展卫生巡查与文明劝导，持续一学期。', '志愿服务', '1-8号教学楼', '2026-11-25 07:10:00', '2027-01-13 07:10:00', 60),
(10, '“绿色银行”环保兑换', '承办：绿笙环境保护协会；QQ群号：1135943506。用可回收物兑换绿植和学习用品，倡导低碳校园生活。', '志愿服务', '大学生活动中心大礼堂前厅', '2026-11-26 09:00:00', '2026-11-27 17:00:00', 100),
(11, '“晨光启行·食安护航”晨跑花跑', '承办：食安先锋社；QQ群号：1130571837。清晨集体晨跑，沿途宣传食品安全知识，完成打卡可获纪念徽章。', '文艺体育', '风雨操场', '2026-11-23 06:30:00', '2026-12-01 07:30:00', 80),
(12, '“赴朝曦”校园长跑竞赛', '承办：跑步爱好者协会；QQ群号：240219215。校园长跑竞赛，按完赛成绩分组排名，设男女组奖项。', '文艺体育', '风雨操场', '2026-11-29 09:00:00', '2026-12-06 17:00:00', 150),
(13, '“急救进校园”应急救护培训', '承办：大学生应急救护社团；QQ群号：1131948138。心肺复苏、AED 使用与创伤包扎培训，考核合格颁发急救员证书。', '志愿服务', '图书馆一楼报告厅', '2026-11-29 14:00:00', '2026-11-29 17:00:00', 100),
(14, '“荚点妙想，‘豆’是惊喜”豆荚娃娃手工制作活动', '承办：大学生创新创业协会；QQ群号：635044224。用豆荚、布料等材料制作娃娃，作品可参与创意市集展示。', '文艺体育', '4号教学楼109', '2026-11-23 09:00:00', '2026-11-29 17:00:00', 60),
(15, '“小实验，大国重器”桌面实验', '承办：电子爱好者协会；QQ群号：1134186713。现场演示电磁、光学等桌面小实验，并可动手组装简易装置。', '学术讲座', '一期食堂北侧操场', '2026-11-22 09:00:00', '2026-11-22 17:00:00', 80);

-- 初始报名数据为空，便于从零测试报名和取消报名。
