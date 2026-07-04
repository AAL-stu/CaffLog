// cloudfunctions/dataInit/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 预置咖啡豆品种数据
const COFFEE_BEANS_DATA = [
  { name: '阿拉比卡 (Arabica)', caffeine_per_gram: 12, origin: '埃塞俄比亚', description: '全球产量最高的咖啡品种，风味优雅，咖啡因含量中等' },
  { name: '罗布斯塔 (Robusta)', caffeine_per_gram: 22, origin: '越南', description: '咖啡因含量高，口感浓烈偏苦，常用于速溶咖啡' },
  { name: '混合豆 (Blend)', caffeine_per_gram: 15, origin: '多产地', description: '阿拉比卡与罗布斯塔混合拼配，风味均衡' },
  { name: '低因咖啡 (Decaf)', caffeine_per_gram: 2, origin: '—', description: '经去咖啡因处理，去除97%以上咖啡因，适合控量人群' }
];

// 预置冲煮方式数据
const BREW_METHODS_DATA = [
  { name: '手冲', extraction_rate: 0.88, description: '滴滤式萃取，水流均匀通过咖啡粉层，口感干净明亮' },
  { name: '意式浓缩', extraction_rate: 0.75, description: '9bar高压热水快速通过细粉，浓郁醇厚，是拿铁/美式的基底' },
  { name: '法压壶', extraction_rate: 0.90, description: '浸泡式萃取，咖啡粉与水充分接触，保留油脂，口感厚重' },
  { name: '冷萃', extraction_rate: 0.85, description: '冷水/冰水长时间浸泡（8-24小时），酸度低，口感柔和顺滑' },
  { name: '摩卡壶', extraction_rate: 0.80, description: '蒸汽压力驱动热水通过咖啡粉，浓度介于手冲和意式之间' }
];

// 预置品牌饮品数据（精简版）
const BRAND_DRINKS_DATA = [
  // 星巴克
  { brand: '星巴克 (Starbucks)', category: '美式', drink_name: '美式咖啡', size_name: 'Tall (小杯)', size_ml: 354, caffeine_mg: 150, data_source: 'estimated', confidence: 'medium' },
  { brand: '星巴克 (Starbucks)', category: '美式', drink_name: '美式咖啡', size_name: 'Grande (中杯)', size_ml: 473, caffeine_mg: 225, data_source: 'estimated', confidence: 'medium' },
  { brand: '星巴克 (Starbucks)', category: '美式', drink_name: '美式咖啡', size_name: 'Venti (大杯)', size_ml: 591, caffeine_mg: 300, data_source: 'estimated', confidence: 'medium' },
  { brand: '星巴克 (Starbucks)', category: '拿铁', drink_name: '拿铁', size_name: 'Tall (小杯)', size_ml: 354, caffeine_mg: 75, data_source: 'official', confidence: 'high' },
  { brand: '星巴克 (Starbucks)', category: '拿铁', drink_name: '拿铁', size_name: 'Grande (中杯)', size_ml: 473, caffeine_mg: 150, data_source: 'official', confidence: 'high' },
  { brand: '星巴克 (Starbucks)', category: '拿铁', drink_name: '拿铁', size_name: 'Venti (大杯)', size_ml: 591, caffeine_mg: 150, data_source: 'official', confidence: 'high' },
  { brand: '星巴克 (Starbucks)', category: '摩卡', drink_name: '摩卡', size_name: 'Tall (小杯)', size_ml: 354, caffeine_mg: 95, data_source: 'estimated', confidence: 'medium' },
  { brand: '星巴克 (Starbucks)', category: '摩卡', drink_name: '摩卡', size_name: 'Grande (中杯)', size_ml: 473, caffeine_mg: 175, data_source: 'estimated', confidence: 'medium' },
  { brand: '星巴克 (Starbucks)', category: '摩卡', drink_name: '摩卡', size_name: 'Venti (大杯)', size_ml: 591, caffeine_mg: 185, data_source: 'estimated', confidence: 'medium' },
  { brand: '星巴克 (Starbucks)', category: '卡布奇诺', drink_name: '卡布奇诺', size_name: 'Tall (小杯)', size_ml: 354, caffeine_mg: 75, data_source: 'estimated', confidence: 'low' },
  { brand: '星巴克 (Starbucks)', category: '卡布奇诺', drink_name: '卡布奇诺', size_name: 'Grande (中杯)', size_ml: 473, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: '星巴克 (Starbucks)', category: '卡布奇诺', drink_name: '卡布奇诺', size_name: 'Venti (大杯)', size_ml: 591, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: '星巴克 (Starbucks)', category: '冷萃', drink_name: '冷萃咖啡', size_name: 'Tall (小杯)', size_ml: 354, caffeine_mg: 155, data_source: 'official', confidence: 'high' },
  { brand: '星巴克 (Starbucks)', category: '冷萃', drink_name: '冷萃咖啡', size_name: 'Grande (中杯)', size_ml: 473, caffeine_mg: 205, data_source: 'official', confidence: 'high' },
  { brand: '星巴克 (Starbucks)', category: '冷萃', drink_name: '冷萃咖啡', size_name: 'Venti (大杯)', size_ml: 591, caffeine_mg: 310, data_source: 'official', confidence: 'high' },
  // 瑞幸
  { brand: '瑞幸 (Luckin)', category: '美式', drink_name: '美式咖啡', size_name: '中杯', size_ml: 355, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: '瑞幸 (Luckin)', category: '美式', drink_name: '美式咖啡', size_name: '大杯', size_ml: 473, caffeine_mg: 225, data_source: 'estimated', confidence: 'low' },
  { brand: '瑞幸 (Luckin)', category: '拿铁', drink_name: '拿铁', size_name: '中杯', size_ml: 355, caffeine_mg: 75, data_source: 'estimated', confidence: 'low' },
  { brand: '瑞幸 (Luckin)', category: '拿铁', drink_name: '拿铁', size_name: '大杯', size_ml: 473, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: '瑞幸 (Luckin)', category: '生椰系列', drink_name: '生椰拿铁', size_name: '中杯', size_ml: 355, caffeine_mg: 75, data_source: 'estimated', confidence: 'low' },
  { brand: '瑞幸 (Luckin)', category: '生椰系列', drink_name: '生椰拿铁', size_name: '大杯', size_ml: 473, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: '瑞幸 (Luckin)', category: '特调', drink_name: '橙C美式', size_name: '中杯', size_ml: 355, caffeine_mg: 120, data_source: 'estimated', confidence: 'low' },
  { brand: '瑞幸 (Luckin)', category: '特调', drink_name: '橙C美式', size_name: '大杯', size_ml: 473, caffeine_mg: 180, data_source: 'estimated', confidence: 'low' },
  { brand: '瑞幸 (Luckin)', category: '特调', drink_name: '椰青美式', size_name: '中杯', size_ml: 355, caffeine_mg: 130, data_source: 'estimated', confidence: 'low' },
  { brand: '瑞幸 (Luckin)', category: '特调', drink_name: '椰青美式', size_name: '大杯', size_ml: 473, caffeine_mg: 200, data_source: 'estimated', confidence: 'low' },
  // 库迪
  { brand: '库迪 (Cotti)', category: '美式', drink_name: '美式咖啡', size_name: '中杯', size_ml: 355, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: '库迪 (Cotti)', category: '美式', drink_name: '美式咖啡', size_name: '大杯', size_ml: 473, caffeine_mg: 225, data_source: 'estimated', confidence: 'low' },
  { brand: '库迪 (Cotti)', category: '美式', drink_name: '美式咖啡', size_name: '超大杯', size_ml: 591, caffeine_mg: 300, data_source: 'estimated', confidence: 'low' },
  { brand: '库迪 (Cotti)', category: '拿铁', drink_name: '拿铁', size_name: '中杯', size_ml: 355, caffeine_mg: 75, data_source: 'estimated', confidence: 'low' },
  { brand: '库迪 (Cotti)', category: '拿铁', drink_name: '拿铁', size_name: '大杯', size_ml: 473, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: '库迪 (Cotti)', category: '拿铁', drink_name: '拿铁', size_name: '超大杯', size_ml: 591, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: '库迪 (Cotti)', category: '生椰系列', drink_name: '生椰拿铁', size_name: '中杯', size_ml: 355, caffeine_mg: 75, data_source: 'estimated', confidence: 'low' },
  { brand: '库迪 (Cotti)', category: '生椰系列', drink_name: '生椰拿铁', size_name: '大杯', size_ml: 473, caffeine_mg: 150, data_source: 'estimated', confidence: 'low' },
  { brand: '库迪 (Cotti)', category: '特调', drink_name: '潘帕斯蓝生酪茉莉拿铁', size_name: '中杯', size_ml: 355, caffeine_mg: 85, data_source: 'estimated', confidence: 'low' },
  { brand: '库迪 (Cotti)', category: '特调', drink_name: '潘帕斯蓝生酪茉莉拿铁', size_name: '大杯', size_ml: 473, caffeine_mg: 160, data_source: 'estimated', confidence: 'low' }
];

/**
 * 批量写入数据（分批处理，避免单次写入过多）
 */
async function batchInsert(collectionName, dataArray) {
  const batchSize = 20;
  for (let i = 0; i < dataArray.length; i += batchSize) {
    const batch = dataArray.slice(i, i + batchSize);
    await Promise.all(batch.map(item =>
      db.collection(collectionName).add({ data: item })
    ));
  }
  return dataArray.length;
}

exports.main = async (event, context) => {
  const results = {};

  try {
    // 1. 初始化咖啡豆品种数据
    const beansCount = await db.collection('coffee_beans').count();
    if (beansCount.total === 0) {
      const count = await batchInsert('coffee_beans', COFFEE_BEANS_DATA);
      results.beans = `已写入 ${count} 条咖啡豆数据`;
    } else {
      results.beans = `已存在 ${beansCount.total} 条数据，跳过`;
    }

    // 2. 初始化冲煮方式数据
    const methodsCount = await db.collection('brew_methods').count();
    if (methodsCount.total === 0) {
      const count = await batchInsert('brew_methods', BREW_METHODS_DATA);
      results.methods = `已写入 ${count} 条冲煮方式数据`;
    } else {
      results.methods = `已存在 ${methodsCount.total} 条数据，跳过`;
    }

    // 3. 初始化品牌饮品数据
    const drinksCount = await db.collection('brand_drinks').count();
    if (drinksCount.total === 0) {
      const count = await batchInsert('brand_drinks', BRAND_DRINKS_DATA);
      results.drinks = `已写入 ${count} 条品牌饮品数据`;
    } else {
      results.drinks = `已存在 ${drinksCount.total} 条数据，跳过`;
    }

    // 4. 确保 intake_records 集合存在
    try {
      await db.createCollection('intake_records');
      results.records = '已创建摄入记录集合';
    } catch (e) {
      results.records = '摄入记录集合已存在';
    }

    return { success: true, message: '数据初始化完成', results };
  } catch (e) {
    return { success: false, error: e.message };
  }
};
