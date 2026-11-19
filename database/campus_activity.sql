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

-- 初始报名数据为空，便于从零测试报名和取消报名。
