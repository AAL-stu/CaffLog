# CaffLog 咖啡因摄入记录 — 技术开发文档

> 版本：v2.0 | 日期：2026-05-26 | 基于《需求文档_CoffeeMan.md》

---

## 1. 项目概述

### 1.1 项目信息

| 项目 | 内容 |
|------|------|
| 项目名称 | CaffLog（咖啡因摄入记录） |
| 项目类型 | 微信小程序 |
| AppID | wx3e30f4679b65d2bb |
| 基础库版本 | ≥ 2.20.1 |
| 后端服务 | Spring Boot 3.2 + MySQL + JPA + JWT 认证 |
| UI 组件 | TDesign Miniprogram |
| 图表库 | ECharts for WeChat（Apache 2.0 开源协议） |
| 代码管理 | Git + GitHub（私有仓库） |

### 1.2 技术栈总览

```
┌────────────────────────────────────────────┐
│              前端：微信小程序原生框架          │
│   WXML + WXSS + JS + TDesign 组件库          │
├────────────────────────────────────────────┤
│            业务逻辑：Page + Utils             │
│   api.js / authService.js / calculator.js   │
│   brandService.js / recordService.js        │
│   statsService.js                           │
├────────────────────────────────────────────┤
│            数据层：Spring Boot REST API       │
│   MySQL + JPA + JWT 认证 + 统计聚合          │
└────────────────────────────────────────────┘
```

### 1.3 实现范围

仅实现以下三个核心模块，需求文档中其他模块不在本次开发范围内：

| 模块 | 对应页面 | 内容 |
|------|---------|------|
| 咖啡因记录 | 记录页 | 自制咖啡计算 + 品牌饮品快速记录 |
| 个人仪表盘和趋势 | 首页 | 当日环形进度条 + 记录列表 + 7日/30日柱状图 |
| 我的设置 | 我的页 | 用户基础信息 + 阈值设置 |

---

## 2. 目录结构

```
CaffLog/
├── miniprogram/
│   ├── app.js                          # 应用入口，JWT 静默登录
│   ├── app.json                        # 全局配置，路由注册
│   ├── app.wxss                        # 全局样式
│   ├── assets/
│   │   ├── data/
│   │   │   └── brand_drinks.js         # 品牌饮品预置数据（本地缓存）
│   │   └── icons/                      # 图标资源（开源/自绘 SVG）
│   ├── components/
│   │   ├── ring-progress/              # 环形进度条组件（基于 ECharts）
│   │   ├── trend-chart/                # 趋势柱状图组件（基于 ECharts）
│   │   └── record-card/                # 摄入记录卡片组件
│   ├── pages/
│   │   ├── dashboard/                  # 仪表盘页
│   │   ├── history/                    # 历史记录页
│   │   ├── record/                     # 记录页
│   │   ├── mine/                       # 我的页
│   │   └── settings/                   # 设置页
│   └── utils/
│       ├── api.js                      # HTTP 请求封装（wx.request + JWT）
│       ├── authService.js              # 微信登录 + JWT 获取
│       ├── calculator.js               # 咖啡因计算引擎
│       ├── constants.js                # 常量定义
│       ├── brandService.js             # 品牌饮品数据服务
│       ├── recordService.js            # 摄入记录 CRUD 服务
│       └── statsService.js             # 统计数据聚合服务
├── backend/                            # Spring Boot 后端
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/cafflog/
│       │   ├── CafflogApplication.java
│       │   ├── config/                 # SecurityConfig, WebConfig
│       │   ├── controller/             # Auth/Record/Stats Controller
│       │   ├── dto/                    # 请求/响应 DTO
│       │   ├── entity/                 # User, IntakeRecord
│       │   ├── exception/              # GlobalExceptionHandler
│       │   ├── repository/             # JPA Repository
│       │   ├── security/               # JwtUtil, JwtFilter
│       │   └── service/                # Auth/Record/Stats Service
│       └── resources/
│           ├── application.yml
│           └── schema.sql
├── 需求文档_CoffeeMan.md
├── 技术文档_CaffLog.md
└── project.config.json
```

---

## 3. 页面架构

### 3.1 Tab Bar 设计

小程序采用底部三 Tab 导航，简洁清晰：

| Tab | 页面路径 | 标题 | 说明 |
|-----|---------|------|------|
| 记录 | pages/record/index | 记录 | 咖啡因摄入记录入口（自制 + 品牌） |
| 仪表盘 | pages/dashboard/index | 仪表盘 | 当日摄入汇总 + 趋势图表 |
| 我的 | pages/mine/index | 我的 | 用户信息 + 设置入口 |

app.json 配置：

```json
{
  "pages": [
    "pages/record/index",
    "pages/dashboard/index",
    "pages/mine/index",
    "pages/settings/index"
  ],
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#6B4E3D",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/record/index",
        "text": "记录",
        "iconPath": "assets/icons/record.svg",
        "selectedIconPath": "assets/icons/record-active.svg"
      },
      {
        "pagePath": "pages/dashboard/index",
        "text": "仪表盘",
        "iconPath": "assets/icons/dashboard.svg",
        "selectedIconPath": "assets/icons/dashboard-active.svg"
      },
      {
        "pagePath": "pages/mine/index",
        "text": "我的",
        "iconPath": "assets/icons/mine.svg",
        "selectedIconPath": "assets/icons/mine-active.svg"
      }
    ]
  }
}
```

> **图标说明**：Tab 图标使用自绘 SVG 文件，各 81x81 像素。推荐使用羽量级开源 SVG 路径，也可从 [Feather Icons](https://feathericons.com/)（MIT 协议）获取对应图标后转换为小程序可用格式。

### 3.2 页面关系与导航

```
┌──────────────┐   点击设置    ┌──────────────┐
│   我的页      │ ──────────→ │   设置页      │
│  (mine)      │ ←────────── │  (settings)  │
└──────────────┘   返回        └──────────────┘
       │
       │ Tab 切换
       ↓
┌──────────────┐              ┌──────────────┐
│   记录页      │              │  仪表盘页     │
│  (record)    │              │ (dashboard)  │
│              │              │              │
│ · 自制咖啡   │              │ · 环形进度条  │
│ · 品牌饮品   │              │ · 今日列表    │
└──────────────┘              │ · 7/30日趋势  │
                              └──────────────┘
```

---

## 4. 页面详细设计

### 4.1 记录页（pages/record/index）

#### 4.1.1 页面结构

```
┌─────────────────────────────────┐
│  [自制咖啡]  [品牌饮品]          │  ← 顶部双Tab切换
├─────────────────────────────────┤
│                                 │
│  ┌─ 自制咖啡 Tab ────────────┐  │
│  │                            │  │
│  │  咖啡豆品种  [下拉选择 ▼]   │  │
│  │  咖啡豆重量  [____] 克      │  │
│  │  冲煮方式    [下拉选择 ▼]   │  │
│  │                            │  │
│  │  ┌──────────────────────┐  │  │
│  │  │    预估结果区域        │  │  │
│  │  │    ≈ 158 mg          │  │  │
│  │  │  范围 120-190 mg     │  │  │
│  │  └──────────────────────┘  │  │
│  │                            │  │
│  │  [      确认记录      ]    │  │
│  └────────────────────────────┘  │
│                                 │
│  ┌─ 品牌饮品 Tab ────────────┐  │
│  │                            │  │
│  │  品牌选择  [库迪|瑞幸|星巴克]│  │
│  │  饮品种类  [下拉选择 ▼]     │  │
│  │  杯型选择  [下拉选择 ▼]     │  │
│  │                            │  │
│  │  ┌──────────────────────┐  │  │
│  │  │   咖啡因含量          │  │  │
│  │  │   150 mg             │  │  │
│  │  │   数据来源：官方      │  │  │
│  │  └──────────────────────┘  │  │
│  │                            │  │
│  │  [      确认记录      ]    │  │
│  └────────────────────────────┘  │
└─────────────────────────────────┘
```

#### 4.1.2 交互逻辑

**自制咖啡 Tab：**
1. 用户从下拉列表选择咖啡豆品种（数据源：本地 `constants.js`）
2. 输入咖啡豆重量（数字输入框，单位：克，范围 1-200g）
3. 从下拉列表选择冲煮方式（数据源：本地 `constants.js`）
4. 实时计算并显示预估咖啡因含量（调用 `calculator.js`）
5. 点击"确认记录"通过 HTTP API 保存到后端 MySQL 数据库

**品牌饮品 Tab：**
1. 品牌选择：三个按钮切换（库迪/瑞幸/星巴克）
2. 饮品种类：根据选中品牌动态加载菜单列表
3. 杯型选择：根据选中饮品动态加载杯型列表
4. 显示匹配的咖啡因含量及数据来源
5. 点击"确认记录"通过 HTTP API 保存到后端 MySQL 数据库

#### 4.1.3 数据流

```
record/index.js (Page)
  │
  ├── onLoad: 加载品牌数据（纯本地 brandService.js）
  │
  ├── onSubmit: 保存记录
  │     ├── 调用 calculator.js 计算（自制）或查表（品牌）
  │     ├── 调用 recordService.addRecord() → POST /api/records
  │     ├── 调用 checkThreshold() 判断是否弹窗提醒
  │     └── wx.showToast({ title: "记录成功" })
  │
  └── checkThreshold():
        ├── 查询当日 SUM(caffeine_mg)
        ├── ≥ 400mg → wx.showModal 红色警告
        ├── ≥ 350mg → wx.showModal 黄色提示
        └── < 350mg → 不提示
```

### 4.2 仪表盘页（pages/dashboard/index）

#### 4.2.1 页面结构

```
┌─────────────────────────────────┐
│         2026年5月26日 周二        │
│                                 │
│        ┌─────────────┐          │
│        │   环形进度条  │          │
│        │   158 mg     │          │
│        │  / 400 mg   │          │
│        │ 剩余 242 mg  │          │
│        └─────────────┘          │
│                                 │
│  ─── 今日记录 ────────────────  │
│  ┌ 09:30  手冲咖啡    158mg ─┐  │
│  ├ 14:00  瑞幸美式    150mg ─┤  │
│  └───────────────────────────┘  │
│                                 │
│  ─── 摄入趋势 ────────────────  │
│  [ 7天 ]  [ 30天 ]   ← 切换    │
│  ┌─────────────────────────┐   │
│  │  ▐ ▐                     │   │
│  │  ▐ ▐   ▐                 │   │
│  │  ▐ ▐ ▐ ▐ ▐  ← 柱状图    │   │
│  │  ▐ ▐ ▐ ▐ ▐              │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

#### 4.2.2 环形进度条组件（ring-progress）

基于 ECharts for WeChat 的 pie 类型实现：
- 两个扇区：已摄入量（咖啡色 `#6B4E3D`）+ 剩余量（浅灰 `#E8E0D5`）
- 中心叠加文字：当前摄入量（大号）+ 剩余额度（小号）
- 环宽：建议 12-16rpx
- 动画：加载时从 0 旋转到实际值

#### 4.2.3 趋势柱状图组件（trend-chart）

基于 ECharts for WeChat 的 bar 类型实现：
- X 轴：日期（7 天或 30 天）
- Y 轴：咖啡因摄入量（mg）
- 柱子颜色：`#6B4E3D`（咖啡棕）
- 400mg 参考线：红色虚线 `#E74C3C`
- 支持点击柱子查看具体数值（tooltip）

> **注意**：ECharts for WeChat 通过 [GitHub - ecomfe/echarts-for-weixin](https://github.com/ecomfe/echarts-for-weixin) 获取（Apache 2.0 协议），需将 `ec-canvas` 目录放入项目根目录。

#### 4.2.4 数据流

```
dashboard/index.js (Page)
  │
  ├── onShow: 每次展示时重新拉取最新数据
  │     ├── 查询当日 intake_records（按 recorded_at 降序）
  │     ├── 聚合当日 SUM(caffeine_mg)
  │     ├── 更新环形进度条数据
  │     ├── 更新今日记录列表
  │     └── 查询近 7/30 日趋势数据 → 更新柱状图
  │
  └── onSwitchTrend(period): 7天/30天切换
        └── 重新查询对应天数的聚合数据
```

### 4.3 我的页（pages/mine/index）

#### 4.3.1 页面结构

> **约束**：我的页仅保留基本功能，不扩展需求文档之外的模块。

```
┌─────────────────────────────────┐
│                                 │
│        ┌──────────┐             │
│        │  头像    │             │  ← 微信头像
│        └──────────┘             │
│          用户昵称               │  ← 微信昵称
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ┌ 累计记录  128 次 ─────────┐  │
│  └───────────────────────────┘  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ┌ 设置 ────────────────── → ┐  │  ← 跳转设置页
│  └───────────────────────────┘  │
│                                 │
│  ┌ 关于 CaffLog v1.0 ─────── ┐  │  ← 版本信息
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

#### 4.3.2 功能清单

| 功能 | 说明 |
|------|------|
| 用户头像昵称 | 通过 `<open-data>` 或 `wx.getUserProfile` 获取展示 |
| 累计记录数 | 从 `intake_records` 集合 count 当前用户的记录总数 |
| 设置入口 | 跳转至 `pages/settings/index` |
| 关于信息 | 展示应用版本号（v1.0） |

#### 4.3.3 设置页（pages/settings/index）

```
┌─────────────────────────────────┐
│  ─── 提醒设置 ────────────────  │
│                                 │
│  开启预警提醒        [Switch]   │
│                                 │
│  警告阈值（黄色）    [350] mg   │  ← 可编辑
│  超标阈值（红色）    [400] mg   │  ← 可编辑
│                                 │
│  ─── 数据管理 ────────────────  │
│                                 │
│  清除全部记录        [按钮]     │  ← 二次确认弹窗
│                                 │
│  ─── 关于 ────────────────────  │
│                                 │
│  CaffLog v1.0                   │
│  咖啡因摄入记录助手              │
│  数据仅供参考，不构成医疗建议     │
└─────────────────────────────────┘
```

阈值存储方式：`wx.setStorageSync('caffeine_settings', { enabled: true, warning: 350, danger: 400 })`

---

## 5. 数据模型

### 5.1 云数据库集合设计

#### 集合1：coffee_beans（咖啡豆品种）

```javascript
{
  _id: "auto_generated",
  name: "阿拉比卡 (Arabica)",       // String, 品种名称
  caffeine_per_gram: 12,            // Number, 每克咖啡因 mg/g
  origin: "埃塞俄比亚",             // String, 产地
  description: "全球产量最高的咖啡品种，风味优雅", // String
  is_custom: false                  // Boolean, 是否用户自定义
}
```

**预置数据**（通过 dataInit 云函数写入）：

| name | caffeine_per_gram | origin |
|------|-------------------|--------|
| 阿拉比卡 (Arabica) | 12 | 埃塞俄比亚 |
| 罗布斯塔 (Robusta) | 22 | 越南 |
| 混合豆 (Blend) | 15 | 多产地 |
| 低因咖啡 (Decaf) | 2 | — |

#### 集合2：brew_methods（冲煮方式）

```javascript
{
  _id: "auto_generated",
  name: "手冲",                      // String
  extraction_rate: 0.88,            // Number, 萃取率 0-1
  description: "滴滤式萃取，口感干净明亮"  // String
}
```

**预置数据**：

| name | extraction_rate |
|------|-----------------|
| 手冲 | 0.88 |
| 意式浓缩 | 0.75 |
| 法压壶 | 0.90 |
| 冷萃 | 0.85 |
| 摩卡壶 | 0.80 |

#### 集合3：brand_drinks（品牌饮品）

```javascript
{
  _id: "auto_generated",
  brand: "瑞幸 (Luckin)",           // String
  category: "美式",                 // String, 品类
  drink_name: "美式咖啡",            // String
  size_name: "中杯",                // String
  size_ml: 355,                     // Number
  caffeine_mg: 150,                 // Number
  data_source: "official",          // String: official / estimated
  confidence: "high"                // String: high / medium / low
}
```

**预置数据示例**：

| brand | category | drink_name | size_name | size_ml | caffeine_mg | data_source | confidence |
|-------|----------|------------|-----------|---------|-------------|-------------|------------|
| 星巴克 | 美式 | 美式咖啡 | Tall | 354 | 150 | estimated | medium |
| 星巴克 | 美式 | 美式咖啡 | Grande | 473 | 225 | estimated | medium |
| 星巴克 | 美式 | 美式咖啡 | Venti | 591 | 300 | estimated | medium |
| 星巴克 | 拿铁 | 拿铁 | Tall | 354 | 75 | estimated | medium |
| 星巴克 | 拿铁 | 拿铁 | Grande | 473 | 150 | estimated | medium |
| 星巴克 | 拿铁 | 拿铁 | Venti | 591 | 150 | estimated | medium |
| 瑞幸 | 美式 | 美式咖啡 | 中杯 | 355 | 150 | estimated | low |
| 瑞幸 | 美式 | 美式咖啡 | 大杯 | 473 | 225 | estimated | low |
| 瑞幸 | 拿铁 | 拿铁 | 中杯 | 355 | 75 | estimated | low |
| 瑞幸 | 拿铁 | 拿铁 | 大杯 | 473 | 150 | estimated | low |
| 库迪 | 美式 | 美式咖啡 | 中杯 | 355 | 150 | estimated | low |
| 库迪 | 美式 | 美式咖啡 | 大杯 | 473 | 225 | estimated | low |
| 库迪 | 拿铁 | 拿铁 | 中杯 | 355 | 75 | estimated | low |
| 库迪 | 拿铁 | 拿铁 | 大杯 | 473 | 150 | estimated | low |

#### 集合4：intake_records（摄入记录）

```javascript
{
  _id: "auto_generated",
  _openid: "user_openid",           // String, 自动关联用户
  record_type: "homemade",          // String: "homemade" | "brand"
  caffeine_mg: 158,                 // Number
  // --- 以下字段按 record_type 选填 ---
  bean_id: "bean_doc_id",           // String, 关联 coffee_beans (homemade)
  bean_weight_g: 15,                // Number, 豆重 (homemade)
  method_id: "method_doc_id",       // String, 关联 brew_methods (homemade)
  drink_id: "drink_doc_id",         // String, 关联 brand_drinks (brand)
  // --- 通用字段 ---
  recorded_at: "2026-05-26T09:30:00+08:00",  // String, ISO8601
  notes: ""                         // String, 备注
}
```

**索引建议**：

```
intake_records:
  - _openid + recorded_at（复合索引，用于按用户按时间查询）
  - _openid + record_type（复合索引，用于分类统计）
```

### 5.2 本地存储设计

| Key | 内容 | 用途 |
|-----|------|------|
| `caffeine_settings` | `{ enabled: true, warning: 350, danger: 400 }` | 阈值设置，离线可读 |
| `brand_data_version` | `"2026-05-26"` | 品牌数据版本号，判断是否需要更新 |

---

## 6. 核心逻辑设计

### 6.1 咖啡因计算引擎（utils/calculator.js）

```javascript
/**
 * 计算自制咖啡的咖啡因含量
 * @param {number} weight - 咖啡豆重量（克）
 * @param {number} caffeinePerGram - 品种咖啡因系数（mg/g）
 * @param {number} extractionRate - 冲煮萃取率（0-1）
 * @returns {{ caffeine: number, rangeMin: number, rangeMax: number }}
 */
function calculate(weight, caffeinePerGram, extractionRate) {
  const caffeine = Math.round(weight * caffeinePerGram * extractionRate);
  const rangeMin = Math.round(caffeine * 0.8);
  const rangeMax = Math.round(caffeine * 1.2);
  return { caffeine, rangeMin, rangeMax };
}
```

**计算示例**：15g 阿拉比卡手冲 = `15 × 12 × 0.88 ≈ 158mg`（范围 126-190mg）

### 6.2 阈值检测逻辑

```javascript
/**
 * 检查是否触发提醒阈值
 * @param {number} todayTotal - 当日累计摄入量
 * @returns {{ triggered: boolean, level: 'warning'|'danger'|null }}
 */
function checkThreshold(todayTotal) {
  const settings = wx.getStorageSync('caffeine_settings') || {
    enabled: true, warning: 350, danger: 400
  };

  if (!settings.enabled) return { triggered: false, level: null };
  if (todayTotal >= settings.danger) return { triggered: true, level: 'danger' };
  if (todayTotal >= settings.warning) return { triggered: true, level: 'warning' };
  return { triggered: false, level: null };
}
```

### 6.3 品牌数据服务（utils/brandService.js）

三级联动核心逻辑：

```javascript
/**
 * 获取指定品牌的饮品分类列表
 */
function getCategories(brand) {
  // 从 brand_drinks 集合或本地缓存中查询
  // 返回去重后的 category 列表
}

/**
 * 获取指定品牌+分类的饮品列表
 */
function getDrinks(brand, category) {
  // 返回去重后的 drink_name 列表
}

/**
 * 获取指定品牌+分类+饮品的杯型列表
 */
function getSizes(brand, category, drinkName) {
  // 返回 { size_name, size_ml, caffeine_mg, data_source, confidence }
}
```

### 6.4 统计服务（utils/statsService.js）

采用 HTTP API 优先 + 本地降级策略：

```javascript
/**
 * 获取指定天数的每日摄入趋势
 * @param {number} days - 天数（7 或 30）
 * @returns {Array<{ date: string, total: number, count: number }>}
 */
async function getDailyTrend(days) {
  // 优先调用后端聚合 API：
  // GET /api/stats/daily?days=7
  // 返回 [{ date, total, count }, ...]
  // HTTP 失败时降级为本地聚合计算
}
```

---

## 7. REST API 设计

### 7.1 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 微信登录获取 JWT | 否 |

**POST /api/auth/login**
- Request: `{ "code": "wx.login() 返回的 code" }`
- Response: `{ "success": true, "data": { "token": "xxx", "openid": "xxx", "userId": 1 } }`

### 7.2 记录接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/records` | 添加摄入记录 | JWT |
| GET | `/api/records` | 获取全部记录 | JWT |
| GET | `/api/records/today` | 获取当日记录 | JWT |
| GET | `/api/records/today/total` | 获取当日总量 | JWT |
| GET | `/api/records/count` | 获取累计记录数 | JWT |
| DELETE | `/api/records/{id}` | 删除单条记录 | JWT |
| DELETE | `/api/records/clear` | 清空全部记录 | JWT |

### 7.3 统计接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/stats/daily?days=7` | 获取日趋势聚合 | JWT |
| GET | `/api/stats/weekly` | 获取周趋势聚合 | JWT |
| GET | `/api/stats/monthly` | 获取月趋势聚合 | JWT |

所有接口统一响应格式：`{ success: boolean, message: string, data: any }`

---

## 8. UI 设计规范

### 8.1 色彩系统

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色（咖啡棕） | `#6B4E3D` | 品牌主色，Tab 选中、按钮、进度条 |
| 辅色（奶白） | `#F5F0EB` | 页面背景 |
| 辅色（浅棕） | `#E8E0D5` | 进度条底色、卡片背景 |
| 文字主色 | `#2C2416` | 标题、重要文字 |
| 文字辅色 | `#8B8178` | 次要信息、时间戳 |
| 警告色（黄） | `#F0AD4E` | 350mg 阈值提示 |
| 危险色（红） | `#E74C3C` | 400mg 超标警告、删除按钮 |
| 安全色（绿） | `#5CB85C` | 摄入量安全范围内 |
| 卡片白 | `#FFFFFF` | 卡片、列表项背景 |

### 8.2 字体规范

| 级别 | 字号 | 用途 |
|------|------|------|
| 大标题 | 36rpx | 环形进度条中心数字 |
| 页面标题 | 32rpx | 页面主标题 |
| 正文 | 28rpx | 列表项、表单标签 |
| 辅助文字 | 24rpx | 时间、数据来源标注 |
| 小字 | 20rpx | 免责声明、置信度标注 |

### 8.3 间距规范

| 级别 | 值 | 用途 |
|------|---|------|
| 页面边距 | 32rpx | 页面左右内边距 |
| 卡片内边距 | 24rpx | 卡片内容内边距 |
| 组件间距 | 16rpx | 列表项、表单项之间 |
| 小间距 | 8rpx | 标签、图标与文字之间 |

### 8.4 图标资源

所有图标使用开源/自绘 SVG 方案，存放于 `miniprogram/assets/icons/`。

**Tab 图标设计描述**（均 81x81px，线条风格，2px 描边）：

| 图标 | 设计描述 |
|------|---------|
| record.svg / record-active.svg | 咖啡杯轮廓 + 加号，表示记录操作 |
| dashboard.svg / dashboard-active.svg | 仪表盘/表盘轮廓，表示数据概览 |
| mine.svg / mine-active.svg | 人物轮廓，表示个人中心 |

**功能图标**：可使用 [Feather Icons](https://feathericons.com/)（MIT 协议）对应图标。Feather Icons 提供 SVG 源码，可直接提取 path 数据用于小程序。

| 图标 | Feather 对应 | 用途 |
|------|-------------|------|
| 添加 | `plus-circle` | 记录页添加按钮 |
| 咖啡豆 | 自绘 | 自制咖啡 Tab 装饰 |
| 品牌咖啡 | `coffee` | 品牌饮品 Tab 装饰 |
| 警告 | `alert-triangle` | 阈值提醒弹窗 |
| 删除 | `trash-2` | 记录删除按钮 |
| 右箭头 | `chevron-right` | 列表项跳转指示 |
| 设置 | `settings` | 设置页入口 |
| 信息 | `info` | 关于/数据来源说明 |

---

## 9. 关键技术实现要点

### 9.1 小程序页面间数据同步

采用"每次 onShow 重新拉取"策略，确保数据一致性：

```javascript
Page({
  onShow() {
    // 每次页面展示时重新拉取最新数据
    this.loadTodayData();
  }
});
```

优点：简单可靠，不需要复杂的事件总线或状态管理库。

### 9.2 数据查询优化

- 首页仅加载当日记录和近 7 日摘要数据
- 统计计算在后端用 Java 聚合完成，不在小程序端遍历全量数据
- 品牌饮品预置数据本地缓存（`brandService.js`），无需网络请求
- 前端 HTTP 失败时自动降级为本地缓存数据

### 9.3 兼容性处理

- 微信客户端版本检查：`wx.getSystemInfoSync().SDKVersion`
- 弱网环境：HTTP 超时/失败后降级为本地缓存数据
- Token 过期：401 响应自动清除本地 token，提示用户重新打开

### 9.4 安全性

- 微信登录：小程序端 `wx.login()` 获取 code → 后端调用微信 `code2Session` 换取 openid
- JWT 认证：所有数据接口需携带 Bearer token，后端通过 `@AuthenticationPrincipal` 注入当前用户
- 用户数据隔离：所有数据库操作按 `user_id` 过滤，确保用户只能操作自己的数据
- 隐私声明：在设置页底部展示"数据仅供参考，不构成医疗建议"

---

## 10. 开发环境与依赖

### 10.1 开发工具

| 微信开发者工具 | 代码编辑、实时预览、真机调试 |
| IntelliJ IDEA / VS Code | Spring Boot 后端开发 |
| Git + GitHub | 版本控制（私有仓库） |
| MySQL Workbench / DBeaver | 数据库可视化管理 |


### 10.2 核心依赖

| 依赖 | 版本 | 协议 | 安装方式 |
|------|------|------|---------|
| TDesign Miniprogram | latest | MIT | npm 或手动复制 dist |
| ECharts for WeChat | latest | Apache 2.0 | 手动复制 ec-canvas 目录 |

### 10.3 TDesign 安装

```bash
# 方案一：npm 安装
cd miniprogram
npm init -y
npm install tdesign-miniprogram --save

# 在微信开发者工具中：工具 → 构建 npm
```

TDesign 组件仅在代码中 `usingComponents` 按需引用，避免打包体积膨胀。本项目中推荐使用的 TDesign 组件：

| 组件 | 用途 |
|------|------|
| `t-cell` | 设置页列表项、我的页菜单项 |
| `t-button` | 确认记录、清除数据等操作按钮 |
| `t-input` | 咖啡豆重量输入 |
| `t-switch` | 提醒开关 |
| `t-popup` / `t-action-sheet` | 品种/冲煮方式选择器 |
| `t-toast` | 操作结果提示 |
| `t-dialog` | 二次确认弹窗、阈值警告弹窗 |
| `t-tag` | 数据来源标注（官方/估算） |

### 10.4 ECharts 安装

从 [echarts-for-weixin GitHub 仓库](https://github.com/ecomfe/echarts-for-weixin) 下载 `ec-canvas` 目录，放入 `miniprogram/components/ec-canvas/`。

在需要图表的页面 json 中注册：

```json
{
  "usingComponents": {
    "ec-canvas": "/components/ec-canvas/ec-canvas"
  }
}
```

---

## 11. 测试要点

### 11.1 核心功能测试

| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| T01 | 阿拉比卡 15g + 手冲 | 显示约 158mg（范围 126-190mg） |
| T02 | 罗布斯塔 18g + 意式浓缩 | 显示约 297mg（范围 238-356mg） |
| T03 | 低因咖啡 20g + 法压壶 | 显示约 36mg（范围 29-43mg） |
| T04 | 输入 0g 或负数 | 提示"请填写有效重量" |
| T05 | 输入超过 500g | 提示"重量超出合理范围" |
| T06 | 品牌饮品三级联动 | 选品牌后饮品列表正确更新，选饮品后杯型列表正确更新 |
| T07 | 当日摄入 340mg 后再记录 20mg | 弹出黄色警告 |
| T08 | 当日摄入 390mg 后再记录 20mg | 弹出红色警告 |
| T09 | 关闭提醒后记录 | 不弹窗 |
| T10 | 自定义阈值 200mg 后记录 210mg | 按自定义阈值触发 |

### 11.2 非功能测试

| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| N01 | 冷启动时间 | < 2 秒 |
| N02 | 数据库查询响应 | < 500ms |
| N03 | 连续记录 50 条后页面滚动 | 流畅无卡顿 |
| N04 | 微信 8.0+ iOS/Android | 均正常运行 |
| N05 | 弱网环境 | 查询超时后显示本地缓存数据或友好提示 |

---

## 12. 部署检查清单

- [ ] `project.config.json` 中 `appid` 已替换为正式 AppID
- [ ] `application.yml` 中 `wechat.appid` 和 `wechat.secret` 已配置
- [ ] MySQL 数据库 `cafflog` 已创建，`application.yml` 中数据库连接已配置
- [ ] Spring Boot 后端已启动并可访问（默认 http://localhost:8080）
- [ ] `utils/api.js` 中 `BASE_URL` 已配置为实际后端地址
- [ ] Tab 图标文件存在于 `assets/icons/` 目录
- [ ] TDesign 组件库已构建 npm
- [ ] ec-canvas 目录已放置到位
- [ ] 真机预览测试通过（iOS + Android）
- [ ] 代码已提交至 Git 仓库

