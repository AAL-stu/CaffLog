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
- **云函数路由设计**：单函数按 `action` 字段路由处理 7 种业务操作，减少冷启动次数
- **数据库安全规则**：基于 `openid` 的用户数据隔离，摄入记录仅创建者可读写
- **模块化设计**：工具层（calculator / brandService / recordService / statsService）与 UI 层解耦

## 技术栈

- **前端**：微信小程序原生框架（WXML + WXSS + JS）
- **图表**：Canvas 2D API
- **后端**：微信云开发（云函数 + 云数据库 + 云存储）

## 快速开始

### 1. 环境准备

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 微信云开发环境（在开发者工具中开通）

### 2. 配置项目

1. 打开微信开发者工具，导入项目目录
2. 在 `project.config.json` 中，将 `"appid"` 改为你的小程序 AppID
3. 在 `miniprogram/app.js` 中，将 `env` 改为你的云开发环境 ID
4. 点击工具栏「云开发」按钮，开通云开发

### 3. 初始化数据库

1. 在微信开发者工具中，右键 `cloudfunctions/dataInit` →「上传并部署：云端安装依赖」
2. 同样部署 `cloudfunctions/caffeineService`
3. 在云开发控制台 → 云函数中，手动触发一次 `dataInit`

### 4. 设置数据库安全规则

在云开发控制台 → 数据库 → 安全规则中，为各集合配置权限。详见 `cloudfunctions/DATABASE_RULES.md`。

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
│       ├── calculator.js       # 咖啡因计算引擎
│       ├── constants.js        # 常量定义（品种/冲煮方式/阈值）
│       ├── brandService.js     # 品牌饮品数据服务
│       ├── recordService.js    # 记录增删查
│       └── statsService.js     # 统计分析服务
├── cloudfunctions/
│   ├── caffeineService/        # 核心业务 API（7 个 action 路由）
│   └── dataInit/               # 数据库初始化（预置数据写入）
├── 需求文档_CoffeeMan.md
├── 技术文档_CaffLog.md
└── README.md
```

## 开发说明

- 咖啡因计算模型：`咖啡因(mg) = 重量(g) × 品种系数(mg/g) × 冲煮萃取率(%)`
- 内置 4 种咖啡豆品种（阿拉比卡 12mg/g / 罗布斯塔 22mg/g / 混合豆 15mg/g / 低因 2mg/g）
- 内置 5 种冲煮方式（手冲 88% / 意式 75% / 法压壶 90% / 冷萃 85% / 摩卡壶 80%）
- 阈值默认值：警告 350mg（黄色），超标 400mg（红色），可在设置中自定义
- FDA 建议健康成年人每日咖啡因摄入不超过 400mg

## 免责声明

本项目提供的咖啡因数值仅基于公开数据和估算模型计算，仅供参考，不构成任何医疗建议。不同咖啡豆批次、冲煮手法、杯量误差等因素均可能导致实际咖啡因含量存在较大偏差。如有健康疑虑，请咨询专业医师。

