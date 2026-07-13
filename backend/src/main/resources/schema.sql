-- CaffLog 数据库初始化脚本 (MySQL)
-- 注意：JPA 已配置 ddl-auto=update，应用启动后自动建表。
-- 本文件仅供参考和手动部署场景。

CREATE DATABASE IF NOT EXISTS cafflog
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE cafflog;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    openid      VARCHAR(64)  NOT NULL UNIQUE COMMENT '微信 openid',
    nickname    VARCHAR(64)  DEFAULT NULL COMMENT '用户昵称',
    avatar_url  VARCHAR(512) DEFAULT NULL COMMENT '头像 URL',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_openid (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 摄入记录表
CREATE TABLE IF NOT EXISTS intake_records (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT       NOT NULL COMMENT '关联用户 ID',
    record_type     VARCHAR(20)  NOT NULL COMMENT '记录类型: homemade / brand',
    caffeine_mg     INT          NOT NULL COMMENT '咖啡因含量 (mg)',

    -- 自制咖啡字段
    bean_name       VARCHAR(64)  DEFAULT NULL COMMENT '咖啡豆品种名',
    bean_weight_g   DOUBLE       DEFAULT NULL COMMENT '咖啡豆重量 (g)',
    method_name     VARCHAR(64)  DEFAULT NULL COMMENT '冲煮方式名',
    range_min       INT          DEFAULT NULL COMMENT '估算下限 (mg)',
    range_max       INT          DEFAULT NULL COMMENT '估算上限 (mg)',

    -- 品牌饮品字段
    brand_name      VARCHAR(64)  DEFAULT NULL COMMENT '品牌名',
    drink_name      VARCHAR(128) DEFAULT NULL COMMENT '饮品名',
    size_name       VARCHAR(64)  DEFAULT NULL COMMENT '杯型名',
    data_source     VARCHAR(20)  DEFAULT NULL COMMENT '数据来源: official / estimated',
    data_confidence VARCHAR(10)  DEFAULT NULL COMMENT '置信度: high / medium / low',

    -- 元数据
    recorded_at     VARCHAR(30)  NOT NULL COMMENT '记录时间 (ISO 8601)',
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_date (user_id, recorded_at),
    CONSTRAINT fk_record_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='咖啡因摄入记录表';
