// constants.js - CaffLog 常量定义

// 咖啡豆品种
const COFFEE_BEANS = [
  { id: 'arabica', name: '阿拉比卡 (Arabica)', coefficient: 12, description: '全球产量最高，风味优雅，咖啡因含量中等' },
  { id: 'robusta', name: '罗布斯塔 (Robusta)', coefficient: 22, description: '咖啡因含量高，口感浓烈偏苦' },
  { id: 'blend', name: '混合豆 (Blend)', coefficient: 15, description: '阿拉比卡与罗布斯塔混合，风味均衡' },
  { id: 'decaf', name: '低因咖啡 (Decaf)', coefficient: 2, description: '去除97%以上咖啡因，适合控量人群' }
];

// 冲煮方式
const BREW_METHODS = [
  { id: 'pour-over', name: '手冲', rate: 0.88, description: '滴滤式萃取，口感干净明亮' },
  { id: 'espresso', name: '意式浓缩', rate: 0.75, description: '高压快速萃取，浓郁醇厚' },
  { id: 'french-press', name: '法压壶', rate: 0.90, description: '浸泡式萃取，保留油脂，口感厚重' },
  { id: 'cold-brew', name: '冷萃', rate: 0.85, description: '低温长时间萃取，酸度低口感柔和' },
  { id: 'moka-pot', name: '摩卡壶', rate: 0.80, description: '蒸汽压力萃取，接近意式浓缩浓度' }
];

// 品牌列表
const BRANDS = [
  { id: 'starbucks', name: '星巴克', enName: 'Starbucks' },
  { id: 'luckin', name: '瑞幸', enName: 'Luckin' },
  { id: 'cotti', name: '库迪', enName: 'Cotti' },
  { id: 'mcdonalds', name: '麦当劳', enName: "McCafe" },
  { id: 'kfc', name: '肯德基', enName: 'KFC' },
  { id: 'manner', name: 'Manner', enName: 'Manner' },
  { id: 'tim-hortons', name: 'Tims', enName: 'Tim Hortons' },
  { id: 'peets', name: "Peet's", enName: "Peet's Coffee" }
];

// 默认阈值设置
const DEFAULT_SETTINGS = {
  enabled: true,
  warning: 350,  // 黄色警告
  danger: 400    // 红色超标
};

// 最大安全摄入量（FDA建议）
const SAFE_LIMIT = 400;

// 咖啡豆重量限制
const WEIGHT_MIN = 1;
const WEIGHT_MAX = 200;

// 计算波动范围比例
const VARIANCE_RATIO = 0.2;

module.exports = {
  COFFEE_BEANS,
  BREW_METHODS,
  BRANDS,
  DEFAULT_SETTINGS,
  SAFE_LIMIT,
  WEIGHT_MIN,
  WEIGHT_MAX,
  VARIANCE_RATIO
};
