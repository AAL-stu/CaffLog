// brand_drinks.js - 品牌饮品预置数据（用于云数据库 / 本地初始化）
// 数据来源标注：official=品牌官方数据, estimated=同类产品估算值
// 置信度：high(高), medium(中), low(低)

module.exports = [
  // ===== 星巴克 =====
  { brand: 'starbucks', brand_name: '星巴克', brand_en: 'Starbucks', category: '美式', drink_name: '美式咖啡', size_name: 'Tall (小杯)', size_ml: 354, caffeine_mg: 150, data_source: 'estimated', confidence: 'medium' },
  { brand: 'starbucks', brand_name: '星巴克', brand_en: 'Starbucks', category: '美式', drink_name: '美式咖啡', size_name: 'Grande (中杯)', size_ml: 473, caffeine_mg: 225, data_source: 'estimated', confidence: 'medium' },
  { brand: 'starbucks', brand_name: '星巴克', brand_en: 'Starbucks', category: '美式', drink_name: '美式咖啡', size_name: 'Venti (大杯)', size_ml: 591, caffeine_mg: 300, data_source: 'estimated', confidence: 'medium' },
  { brand: 'starbucks', brand_name: '星巴克', brand_en: 'Starbucks', category: '拿铁', drink_name: '拿铁', size_name: 'Tall (小杯)', size_ml: 354, caffeine_mg: 75, data_source: 'official', confidence: 'high' },
  { brand: 'starbucks', brand_name: '星巴克', brand_en: 'Starbucks', category: '拿铁', drink_name: '拿铁', size_name: 'Grande (中杯)', size_ml: 473, caffeine_mg: 150, data_source: 'official', confidence: 'high' },
  { brand: 'starbucks', brand_name: '星巴克', brand_en: 'Starbucks', category: '拿铁', drink_name: '拿铁', size_name: 'Venti (大杯)', size_ml: 591, caffeine_mg: 150, data_source: 'official', confidence: 'high' },
  { brand: 'starbucks', brand_name: '星巴克', brand_en: 'Starbucks', category: '摩卡', drink_name: '摩卡', size_name: 'Tall (小杯)', size_ml: 354, caffeine_mg: 95, data_source: 'estimated', confidence: 'medium' },
  { brand: 'starbucks', brand_name: '星巴克', brand_en: 'Starbucks', category: '摩卡', drink_name: '摩卡', size_name: 'Grande (中杯)', size_ml: 473, caffeine_mg: 175, data_source: 'estimated', confidence: 'medium' },
  { brand: 'starbucks', brand_name: '星巴克', brand_en: 'Starbucks', category: '冷萃', drink_name: '冷萃咖啡', size_name: 'Tall (小杯)', size_ml: 354, caffeine_mg: 155, data_source: 'official', confidence: 'high' },
  { brand: 'starbucks', brand_name: '星巴克', brand_en: 'Starbucks', category: '冷萃', drink_name: '冷萃咖啡', size_name: 'Grande (中杯)', size_ml: 473, caffeine_mg: 205, data_source: 'official', confidence: 'high' },

  // ===== 瑞幸 =====
  { brand: 'luckin', brand_name: '瑞幸', brand_en: 'Luckin', category: '美式', drink_name: '美式咖啡', size_name: '中杯', size_ml: 355, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: 'luckin', brand_name: '瑞幸', brand_en: 'Luckin', category: '美式', drink_name: '美式咖啡', size_name: '大杯', size_ml: 473, caffeine_mg: 225, data_source: 'estimated', confidence: 'low' },
  { brand: 'luckin', brand_name: '瑞幸', brand_en: 'Luckin', category: '拿铁', drink_name: '拿铁', size_name: '中杯', size_ml: 355, caffeine_mg: 75, data_source: 'estimated', confidence: 'low' },
  { brand: 'luckin', brand_name: '瑞幸', brand_en: 'Luckin', category: '拿铁', drink_name: '拿铁', size_name: '大杯', size_ml: 473, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: 'luckin', brand_name: '瑞幸', brand_en: 'Luckin', category: '生椰系列', drink_name: '生椰拿铁', size_name: '中杯', size_ml: 355, caffeine_mg: 75, data_source: 'estimated', confidence: 'low' },
  { brand: 'luckin', brand_name: '瑞幸', brand_en: 'Luckin', category: '生椰系列', drink_name: '生椰拿铁', size_name: '大杯', size_ml: 473, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },

  // ===== 库迪 =====
  { brand: 'cotti', brand_name: '库迪', brand_en: 'Cotti', category: '美式', drink_name: '美式咖啡', size_name: '中杯', size_ml: 355, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: 'cotti', brand_name: '库迪', brand_en: 'Cotti', category: '美式', drink_name: '美式咖啡', size_name: '大杯', size_ml: 473, caffeine_mg: 225, data_source: 'estimated', confidence: 'low' },
  { brand: 'cotti', brand_name: '库迪', brand_en: 'Cotti', category: '拿铁', drink_name: '拿铁', size_name: '中杯', size_ml: 355, caffeine_mg: 75, data_source: 'estimated', confidence: 'low' },
  { brand: 'cotti', brand_name: '库迪', brand_en: 'Cotti', category: '拿铁', drink_name: '拿铁', size_name: '大杯', size_ml: 473, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },

  // ===== 麦当劳 =====
  { brand: 'mcdonalds', brand_name: '麦当劳', brand_en: 'McCafe', category: '美式', drink_name: '美式咖啡', size_name: '小杯', size_ml: 300, caffeine_mg: 110, data_source: 'estimated', confidence: 'low' },
  { brand: 'mcdonalds', brand_name: '麦当劳', brand_en: 'McCafe', category: '美式', drink_name: '美式咖啡', size_name: '中杯', size_ml: 400, caffeine_mg: 165, data_source: 'estimated', confidence: 'low' },
  { brand: 'mcdonalds', brand_name: '麦当劳', brand_en: 'McCafe', category: '美式', drink_name: '美式咖啡', size_name: '大杯', size_ml: 500, caffeine_mg: 220, data_source: 'estimated', confidence: 'low' },
  { brand: 'mcdonalds', brand_name: '麦当劳', brand_en: 'McCafe', category: '拿铁', drink_name: '拿铁', size_name: '小杯', size_ml: 300, caffeine_mg: 65, data_source: 'estimated', confidence: 'low' },
  { brand: 'mcdonalds', brand_name: '麦当劳', brand_en: 'McCafe', category: '拿铁', drink_name: '拿铁', size_name: '中杯', size_ml: 400, caffeine_mg: 130, data_source: 'estimated', confidence: 'low' },

  // ===== 肯德基 =====
  { brand: 'kfc', brand_name: '肯德基', brand_en: 'KFC', category: '美式', drink_name: '美式咖啡', size_name: '中杯', size_ml: 350, caffeine_mg: 140, data_source: 'estimated', confidence: 'low' },
  { brand: 'kfc', brand_name: '肯德基', brand_en: 'KFC', category: '美式', drink_name: '美式咖啡', size_name: '大杯', size_ml: 470, caffeine_mg: 210, data_source: 'estimated', confidence: 'low' },
  { brand: 'kfc', brand_name: '肯德基', brand_en: 'KFC', category: '拿铁', drink_name: '拿铁', size_name: '中杯', size_ml: 350, caffeine_mg: 70, data_source: 'estimated', confidence: 'low' },
  { brand: 'kfc', brand_name: '肯德基', brand_en: 'KFC', category: '拿铁', drink_name: '拿铁', size_name: '大杯', size_ml: 470, caffeine_mg: 140, data_source: 'estimated', confidence: 'low' },

  // ===== Manner =====
  { brand: 'manner', brand_name: 'Manner', brand_en: 'Manner', category: '美式', drink_name: '美式咖啡', size_name: '小杯', size_ml: 240, caffeine_mg: 130, data_source: 'estimated', confidence: 'low' },
  { brand: 'manner', brand_name: 'Manner', brand_en: 'Manner', category: '美式', drink_name: '美式咖啡', size_name: '大杯', size_ml: 360, caffeine_mg: 200, data_source: 'estimated', confidence: 'low' },
  { brand: 'manner', brand_name: 'Manner', brand_en: 'Manner', category: '拿铁', drink_name: '拿铁', size_name: '小杯', size_ml: 240, caffeine_mg: 70, data_source: 'estimated', confidence: 'low' },
  { brand: 'manner', brand_name: 'Manner', brand_en: 'Manner', category: '拿铁', drink_name: '拿铁', size_name: '大杯', size_ml: 360, caffeine_mg: 140, data_source: 'estimated', confidence: 'low' },

  // ===== Tim Hortons =====
  { brand: 'tim-hortons', brand_name: 'Tims', brand_en: 'Tim Hortons', category: '美式', drink_name: '美式咖啡', size_name: '小杯', size_ml: 300, caffeine_mg: 130, data_source: 'estimated', confidence: 'low' },
  { brand: 'tim-hortons', brand_name: 'Tims', brand_en: 'Tim Hortons', category: '美式', drink_name: '美式咖啡', size_name: '中杯', size_ml: 425, caffeine_mg: 200, data_source: 'estimated', confidence: 'low' },
  { brand: 'tim-hortons', brand_name: 'Tims', brand_en: 'Tim Hortons', category: '拿铁', drink_name: '拿铁', size_name: '小杯', size_ml: 300, caffeine_mg: 70, data_source: 'estimated', confidence: 'low' },
  { brand: 'tim-hortons', brand_name: 'Tims', brand_en: 'Tim Hortons', category: '拿铁', drink_name: '拿铁', size_name: '中杯', size_ml: 425, caffeine_mg: 140, data_source: 'estimated', confidence: 'low' },

  // ===== Peet's =====
  { brand: 'peets', brand_name: "Peet's", brand_en: "Peet's Coffee", category: '美式', drink_name: '美式咖啡', size_name: '小杯', size_ml: 240, caffeine_mg: 140, data_source: 'estimated', confidence: 'low' },
  { brand: 'peets', brand_name: "Peet's", brand_en: "Peet's Coffee", category: '美式', drink_name: '美式咖啡', size_name: '中杯', size_ml: 360, caffeine_mg: 210, data_source: 'estimated', confidence: 'low' },
  { brand: 'peets', brand_name: "Peet's", brand_en: "Peet's Coffee", category: '拿铁', drink_name: '拿铁', size_name: '小杯', size_ml: 240, caffeine_mg: 70, data_source: 'estimated', confidence: 'low' },
  { brand: 'peets', brand_name: "Peet's", brand_en: "Peet's Coffee", category: '拿铁', drink_name: '拿铁', size_name: '中杯', size_ml: 360, caffeine_mg: 140, data_source: 'estimated', confidence: 'low' }
];
