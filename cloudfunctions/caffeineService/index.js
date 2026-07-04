// cloudfunctions/caffeineService/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { action } = event;

  switch (action) {

    // ========== 获取 OpenId ==========
    case 'getOpenId': {
      return { success: true, openid };
    }

    // ========== 添加记录 ==========
    case 'addRecord': {
      const record = {
        _openid: openid,
        record_type: event.record_type,
        caffeine_mg: event.caffeine_mg,
        recorded_at: event.recorded_at || new Date().toISOString(),
        createTime: new Date()
      };

      if (event.record_type === 'homemade') {
        record.bean_name = event.bean_name;
        record.bean_weight_g = event.bean_weight_g;
        record.method_name = event.method_name;
        record.range_min = event.range_min;
        record.range_max = event.range_max;
      } else if (event.record_type === 'brand') {
        record.brand_name = event.brand_name;
        record.drink_name = event.drink_name;
        record.size_name = event.size_name;
        record.data_source = event.data_source;
        record.data_confidence = event.data_confidence;
      }

      try {
        const res = await db.collection('intake_records').add({ data: record });
        return { success: true, id: res._id };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    // ========== 获取当日记录 ==========
    case 'getTodayRecords': {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      try {
        const res = await db.collection('intake_records')
          .where({
            _openid: openid,
            recorded_at: _.gte(todayStr).and(_.lt(tomorrowStr))
          })
          .orderBy('recorded_at', 'desc')
          .get();
        return { success: true, data: res.data };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    // ========== 获取当日总计 ==========
    case 'getTodayTotal': {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      try {
        const res = await db.collection('intake_records')
          .where({
            _openid: openid,
            recorded_at: _.gte(todayStr).and(_.lt(tomorrowStr))
          })
          .get();

        const total = res.data.reduce((sum, r) => sum + (r.caffeine_mg || 0), 0);
        return { success: true, total, count: res.data.length };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    // ========== 获取每日趋势 ==========
    case 'getDailyTrend': {
      const days = event.days || 7;
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - days + 1);
      startDate.setHours(0, 0, 0, 0);

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      try {
        const res = await db.collection('intake_records')
          .where({
            _openid: openid,
            recorded_at: _.gte(startStr).and(_.lte(endStr))
          })
          .get();

        // 按日期聚合
        const dailyMap = {};
        res.data.forEach(record => {
          const date = record.recorded_at.split('T')[0];
          if (!dailyMap[date]) dailyMap[date] = { total: 0, count: 0 };
          dailyMap[date].total += record.caffeine_mg || 0;
          dailyMap[date].count += 1;
        });

        // 生成完整日期序列
        const result = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          result.push({
            date: dateStr,
            total: dailyMap[dateStr]?.total || 0,
            count: dailyMap[dateStr]?.count || 0
          });
        }

        return { success: true, data: result };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    // ========== 获取累计记录数 ==========
    case 'getTotalCount': {
      try {
        const res = await db.collection('intake_records')
          .where({ _openid: openid })
          .count();
        return { success: true, total: res.total };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    // ========== 删除记录 ==========
    case 'deleteRecord': {
      try {
        await db.collection('intake_records').doc(event.id).remove();
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    // ========== 清除所有记录 ==========
    case 'clearAllRecords': {
      try {
        const res = await db.collection('intake_records')
          .where({ _openid: openid })
          .remove();
        return { success: true, removed: res.stats.removed };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    // ========== 获取品牌饮品数据 ==========
    case 'getBrandDrinks': {
      const { brand } = event;
      try {
        let query = db.collection('brand_drinks');
        if (brand) query = query.where({ brand });
        const res = await query.get();
        return { success: true, data: res.data };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    default:
      return { success: false, error: `未知操作: ${action}` };
  }
};
