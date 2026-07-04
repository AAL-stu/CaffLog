# CaffLog 咖啡因摄入记录小程序

一款记录和管理每日咖啡因摄入量的微信小程序。

## 快速开始

### 1. 环境准备

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 微信云开发环境（在开发者工具中开通）

### 2. 配置云开发环境

1. 打开微信开发者工具，导入项目目录
2. 在 `miniprogram/app.js` 中，将 `env: ''` 改为你的云开发环境 ID
3. 点击工具栏「云开发」按钮，开通云开发

### 3. 初始化数据库

1. 在微信开发者工具中，右键 `cloudfunctions/dataInit` →「上传并部署：云端安装依赖」
2. 同样部署 `cloudfunctions/caffeineService`
3. 在云开发控制台 → 云函数中，手动触发一次 `dataInit`
4. 或在开发者工具中执行：`wx.cloud.callFunction({ name: 'dataInit' })`

### 4. 设置数据库安全规则

在云开发控制台 → 数据库 → 安全规则中，设置各集合权限。详见 `cloudfunctions/DATABASE_RULES.md`。

### 5. 安装 UI 组件（可选，当前已使用原生实现）

如需使用 TDesign 组件库：

```bash
cd miniprogram
npm init -y
npm install tdesign-miniprogram --save
# 在微信开发者工具：工具 → 构建 npm
```

## 项目结构

```
CaffLog/
├── miniprogram/           # 小程序前端
│   ├── app.js/json/wxss   # 应用入口
│   ├── assets/data/       # 品牌饮品预置 JSON 数据
│   ├── assets/icons/      # SVG 图标
│   ├── components/        # 组件
│   │   ├── ring-progress/  # 环形进度条（Canvas 2D）
│   │   ├── trend-chart/    # 趋势柱状图（Canvas 2D）
│   │   └── record-card/    # 记录卡片
│   ├── pages/             # 页面
│   │   ├── record/         # 咖啡因记录（自制 + 品牌）
│   │   ├── dashboard/      # 仪表盘和趋势
│   │   ├── mine/           # 我的
│   │   └── settings/       # 设置
│   └── utils/             # 工具模块
├── cloudfunctions/        # 云函数
│   ├── caffeineService/   # 核心业务（记录增删查、统计）
│   └── dataInit/          # 数据初始化（预置咖啡品种、品牌饮品）
├── 需求文档_CoffeeMan.md
├── 技术文档_CaffLog.md
└── CLAUDE.md
```

## 开发说明

- 咖啡因计算模型：`咖啡因(mg) = 重量(g) × 品种系数(mg/g) × 冲煮萃取率(%)`
- 阈值默认值：警告 350mg（黄色），超标 400mg（红色）
- 所有图标为自绘 SVG，可替换为 Feather Icons（MIT 协议）
- 品牌饮品数据标注来源和置信度
- 咖啡因数值仅供参考，不构成医疗建议
