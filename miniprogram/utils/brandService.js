// brandService.js - 品牌饮品数据服务
const { BRANDS } = require('./constants');

const BRAND_DRINKS_DATA = [
  // ===== 星巴克 =====
  { brand: 'starbucks', category: '美式', drinkName: '美式咖啡', sizes: [
    { name: 'Tall (小杯)', ml: 354, caffeine: 150, source: 'estimated', confidence: 'medium' },
    { name: 'Grande (中杯)', ml: 473, caffeine: 225, source: 'estimated', confidence: 'medium' },
    { name: 'Venti (大杯)', ml: 591, caffeine: 300, source: 'estimated', confidence: 'medium' }
  ]},
  { brand: 'starbucks', category: '拿铁', drinkName: '拿铁', sizes: [
    { name: 'Tall (小杯)', ml: 354, caffeine: 75, source: 'official', confidence: 'high' },
    { name: 'Grande (中杯)', ml: 473, caffeine: 150, source: 'official', confidence: 'high' },
    { name: 'Venti (大杯)', ml: 591, caffeine: 150, source: 'official', confidence: 'high' }
  ]},
  { brand: 'starbucks', category: '摩卡', drinkName: '摩卡', sizes: [
    { name: 'Tall (小杯)', ml: 354, caffeine: 95, source: 'estimated', confidence: 'medium' },
    { name: 'Grande (中杯)', ml: 473, caffeine: 175, source: 'estimated', confidence: 'medium' },
    { name: 'Venti (大杯)', ml: 591, caffeine: 185, source: 'estimated', confidence: 'medium' }
  ]},
  { brand: 'starbucks', category: '卡布奇诺', drinkName: '卡布奇诺', sizes: [
    { name: 'Tall (小杯)', ml: 354, caffeine: 75, source: 'estimated', confidence: 'low' },
    { name: 'Grande (中杯)', ml: 473, caffeine: 150, source: 'estimated', confidence: 'low' },
    { name: 'Venti (大杯)', ml: 591, caffeine: 150, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'starbucks', category: '冷萃', drinkName: '冷萃咖啡', sizes: [
    { name: 'Tall (小杯)', ml: 354, caffeine: 155, source: 'official', confidence: 'high' },
    { name: 'Grande (中杯)', ml: 473, caffeine: 205, source: 'official', confidence: 'high' },
    { name: 'Venti (大杯)', ml: 591, caffeine: 310, source: 'official', confidence: 'high' }
  ]},

  // ===== 瑞幸 =====
  { brand: 'luckin', category: '美式', drinkName: '美式咖啡', sizes: [
    { name: '中杯', ml: 355, caffeine: 150, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 473, caffeine: 225, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'luckin', category: '拿铁', drinkName: '拿铁', sizes: [
    { name: '中杯', ml: 355, caffeine: 75, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 473, caffeine: 150, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'luckin', category: '生椰系列', drinkName: '生椰拿铁', sizes: [
    { name: '中杯', ml: 355, caffeine: 75, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 473, caffeine: 150, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'luckin', category: '特调', drinkName: '橙C美式', sizes: [
    { name: '中杯', ml: 355, caffeine: 120, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 473, caffeine: 180, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'luckin', category: '特调', drinkName: '椰青美式', sizes: [
    { name: '中杯', ml: 355, caffeine: 130, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 473, caffeine: 200, source: 'estimated', confidence: 'low' }
  ]},

  // ===== 库迪 =====
  { brand: 'cotti', category: '美式', drinkName: '美式咖啡', sizes: [
    { name: '中杯', ml: 355, caffeine: 150, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 473, caffeine: 225, source: 'estimated', confidence: 'low' },
    { name: '超大杯', ml: 591, caffeine: 300, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'cotti', category: '拿铁', drinkName: '拿铁', sizes: [
    { name: '中杯', ml: 355, caffeine: 75, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 473, caffeine: 150, source: 'estimated', confidence: 'low' },
    { name: '超大杯', ml: 591, caffeine: 150, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'cotti', category: '生椰系列', drinkName: '生椰拿铁', sizes: [
    { name: '中杯', ml: 355, caffeine: 75, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 473, caffeine: 150, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'cotti', category: '特调', drinkName: '潘帕斯蓝生酪茉莉拿铁', sizes: [
    { name: '中杯', ml: 355, caffeine: 85, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 473, caffeine: 160, source: 'estimated', confidence: 'low' }
  ]},

  // ===== 麦当劳 (McCafe) =====
  { brand: 'mcdonalds', category: '美式', drinkName: '美式咖啡', sizes: [
    { name: '小杯', ml: 300, caffeine: 110, source: 'estimated', confidence: 'low' },
    { name: '中杯', ml: 400, caffeine: 165, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 500, caffeine: 220, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'mcdonalds', category: '拿铁', drinkName: '拿铁', sizes: [
    { name: '小杯', ml: 300, caffeine: 65, source: 'estimated', confidence: 'low' },
    { name: '中杯', ml: 400, caffeine: 130, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 500, caffeine: 130, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'mcdonalds', category: '特调', drinkName: '卡布奇诺', sizes: [
    { name: '小杯', ml: 300, caffeine: 65, source: 'estimated', confidence: 'low' },
    { name: '中杯', ml: 400, caffeine: 130, source: 'estimated', confidence: 'low' }
  ]},

  // ===== 肯德基 (KFC) =====
  { brand: 'kfc', category: '美式', drinkName: '美式咖啡', sizes: [
    { name: '中杯', ml: 350, caffeine: 140, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 470, caffeine: 210, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'kfc', category: '拿铁', drinkName: '拿铁', sizes: [
    { name: '中杯', ml: 350, caffeine: 70, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 470, caffeine: 140, source: 'estimated', confidence: 'low' }
  ]},

  // ===== Manner =====
  { brand: 'manner', category: '美式', drinkName: '美式咖啡', sizes: [
    { name: '小杯', ml: 240, caffeine: 130, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 360, caffeine: 200, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'manner', category: '拿铁', drinkName: '拿铁', sizes: [
    { name: '小杯', ml: 240, caffeine: 70, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 360, caffeine: 140, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'manner', category: '特调', drinkName: '澳白/Flat White', sizes: [
    { name: '小杯', ml: 240, caffeine: 130, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 360, caffeine: 195, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'manner', category: '特调', drinkName: 'Dirty', sizes: [
    { name: '标准', ml: 240, caffeine: 140, source: 'estimated', confidence: 'low' }
  ]},

  // ===== Tim Hortons =====
  { brand: 'tim-hortons', category: '美式', drinkName: '美式咖啡', sizes: [
    { name: '小杯', ml: 300, caffeine: 130, source: 'estimated', confidence: 'low' },
    { name: '中杯', ml: 425, caffeine: 200, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 560, caffeine: 270, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'tim-hortons', category: '拿铁', drinkName: '拿铁', sizes: [
    { name: '小杯', ml: 300, caffeine: 70, source: 'estimated', confidence: 'low' },
    { name: '中杯', ml: 425, caffeine: 140, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 560, caffeine: 140, source: 'estimated', confidence: 'low' }
  ]},

  // ===== Peet's Coffee =====
  { brand: 'peets', category: '美式', drinkName: '美式咖啡', sizes: [
    { name: '小杯', ml: 240, caffeine: 140, source: 'estimated', confidence: 'low' },
    { name: '中杯', ml: 360, caffeine: 210, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 470, caffeine: 280, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'peets', category: '拿铁', drinkName: '拿铁', sizes: [
    { name: '小杯', ml: 240, caffeine: 70, source: 'estimated', confidence: 'low' },
    { name: '中杯', ml: 360, caffeine: 140, source: 'estimated', confidence: 'low' },
    { name: '大杯', ml: 470, caffeine: 140, source: 'estimated', confidence: 'low' }
  ]},
  { brand: 'peets', category: '特调', drinkName: '澳白/Flat White', sizes: [
    { name: '小杯', ml: 240, caffeine: 130, source: 'estimated', confidence: 'low' },
    { name: '中杯', ml: 360, caffeine: 195, source: 'estimated', confidence: 'low' }
  ]}
];

function getCategories(brandId) {
  const categories = BRAND_DRINKS_DATA
    .filter(d => d.brand === brandId)
    .map(d => d.category);
  return [...new Set(categories)];
}

function getDrinks(brandId, category) {
  return BRAND_DRINKS_DATA
    .filter(d => d.brand === brandId && d.category === category)
    .map(d => ({ drinkName: d.drinkName }));
}

function getSizes(brandId, category, drinkName) {
  const drink = BRAND_DRINKS_DATA.find(
    d => d.brand === brandId && d.category === category && d.drinkName === drinkName
  );
  return drink ? drink.sizes : [];
}

function findCaffeine(brandId, category, drinkName, sizeName) {
  const sizes = getSizes(brandId, category, drinkName);
  return sizes.find(s => s.name === sizeName) || null;
}

module.exports = {
  BRAND_DRINKS_DATA,
  getCategories,
  getDrinks,
  getSizes,
  findCaffeine
};
