# CaffLog 咖啡因摄入记录小程序

一款记录和管理每日咖啡因摄入量的微信小程序。支持自制咖啡计算（品种 × 重量 × 萃取率）和品牌饮品快速记录，提供每日摄入仪表盘和历史趋势分析。

## 功能概览

| 模块 | 说明 |
|------|------|
| 咖啡因记录 | 自制咖啡计算引擎 + 8 个连锁品牌三级联动快速记录 |
| 仪表盘 | 当日环形进度条（Canvas 2D）+ 记录列表 + 阈值告警 |
| 历史趋势 | 7 日 / 30 日柱状图（Canvas 2D） |
| 设置 | 自定义警告/超标阈值（默认 350mg / 400mg） |

## 技术亮点

- **咖啡因计算引擎**：`咖啡因(mg) = 重量(g) × 品种系数(mg/g) × 冲煮萃取率(%)`，给出 ±20% 估计区间，体现科学不确定性
- **品牌饮品数据库**：预置 8 个品牌 60+ 款饮品数据，每项标注 `data_source`（官方/估算）和 `confidence`（高/中/低）
- **Canvas 2D 自绘图表**：环形进度条和趋势柱状图均为原生 Canvas 2D API 绘制，不依赖第三方图表库
- **JWT 无状态认证**：微信登录换取 JWT token，支持黑名单吊销（Redis）
- **统计缓存**：Spring Cache + Redis 缓存趋势查询，5 分钟自动过期
- **前后端分离**：小程序通过 REST API 与后端通信，前端本地优先缓存 + 异步同步策略

## 技术栈

- **前端**：微信小程序原生框架（WXML + WXSS + JS）
- **图表**：Canvas 2D API
- **后端**：Spring Boot 3.2 + MySQL + JPA + JWT 认证
- **缓存**：Redis（统计缓存 + JWT 黑名单 + Session 管理）

## 快速开始

### 1. 环境准备

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- JDK 17+
- MySQL 8.0+ 和 Redis 7.0+
- Maven 3.8+

### 2. 启动后端

1. 创建 MySQL 数据库：
   ```sql
   CREATE DATABASE cafflog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. 修改 `backend/src/main/resources/application.yml`：
   - `spring.datasource.password` → MySQL 密码
   - `wechat.appid` 和 `wechat.secret` → 微信小程序凭据
   - `jwt.secret` → 自定义 JWT 密钥
3. 确保 Redis 已启动（默认 `localhost:6379`）
4. 启动 Spring Boot：
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### 3. 配置小程序

1. 打开微信开发者工具，导入项目目录
2. 在 `project.config.json` 中，将 `"appid"` 改为你的小程序 AppID
3. 在 `miniprogram/utils/api.js` 中，将 `BASE_URL` 改为后端实际地址

## 项目结构

```
CaffLog/
├── miniprogram/                # 小程序前端
│   ├── app.js / json / wxss    # 应用入口
│   ├── assets/
│   │   ├── data/               # 品牌饮品数据（JS 模块）
│   │   └── icons/              # TabBar 图标（SVG + PNG）
│   ├── components/
│   │   ├── ring-progress/      # 环形进度条（Canvas 2D）
│   │   ├── trend-chart/        # 趋势柱状图（Canvas 2D）
│   │   └── record-card/        # 记录卡片
│   ├── pages/
│   │   ├── record/             # 咖啡因记录（自制 + 品牌）
│   │   ├── dashboard/          # 仪表盘和趋势
│   │   ├── history/            # 历史记录
│   │   ├── mine/               # 我的
│   │   └── settings/           # 设置
│   └── utils/
│       ├── api.js              # HTTP 请求封装（wx.request + JWT）
│       ├── authService.js      # 微信登录 + JWT 获取
│       ├── calculator.js       # 咖啡因计算引擎
│       ├── constants.js        # 常量定义（品种/冲煮方式/阈值）
│       ├── brandService.js     # 品牌饮品数据服务
│       ├── recordService.js    # 记录增删查
│       └── statsService.js     # 统计分析服务
├── backend/                    # Spring Boot 后端
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/cafflog/
│       │   ├── config/         # Security / Web / Redis 配置
│       │   ├── controller/     # Auth / Record / Stats Controller
│       │   ├── dto/            # 请求/响应 DTO
│       │   ├── entity/         # User / IntakeRecord 实体
│       │   ├── exception/      # 全局异常处理
│       │   ├── repository/     # JPA Repository
│       │   ├── security/       # JWT 工具类 + 认证过滤器
│       │   └── service/        # Auth / Record / Stats / Session 服务
│       └── resources/
│           ├── application.yml
│           └── schema.sql
├── 需求文档_CoffeeMan.md
├── 技术文档_CaffLog.md
└── README.md
```

## API 设计

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 微信登录获取 JWT | 否 |
| POST | `/api/auth/logout` | 退出登录（token 加黑名单） | JWT |
| POST | `/api/records` | 添加摄入记录 | JWT |
| GET | `/api/records` | 获取全部记录 | JWT |
| GET | `/api/records/today` | 获取当日记录 | JWT |
| GET | `/api/records/today/total` | 获取当日总量 | JWT |
| GET | `/api/records/count` | 获取累计记录数 | JWT |
| DELETE | `/api/records/{id}` | 删除单条记录 | JWT |
| DELETE | `/api/records/clear` | 清空全部记录 | JWT |
| GET | `/api/stats/daily?days=7` | 日趋势聚合 | JWT |
| GET | `/api/stats/weekly` | 周趋势聚合 | JWT |
| GET | `/api/stats/monthly` | 月趋势聚合 | JWT |

## 免责声明

本项目提供的咖啡因数值仅基于公开数据和估算模型计算，仅供参考，不构成任何医疗建议。不同咖啡豆批次、冲煮手法、杯量误差等因素均可能导致实际咖啡因含量存在较大偏差。如有健康疑虑，请咨询专业医师。
