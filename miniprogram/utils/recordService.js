// recordService.js - 摄入记录 CRUD 服务（本地优先，HTTP 异步同步）
const api = require('./api');

const STORAGE_KEY = 'caffeine_records';

// ---- 本地存储 ----
function _readLocal() {
  try { return wx.getStorageSync(STORAGE_KEY) || []; } catch (e) { return []; }
}
function _writeLocal(records) {
  try { wx.setStorageSync(STORAGE_KEY, records); } catch (e) {}
}
function _todayStr() { return new Date().toISOString().split('T')[0]; }

// ---- 公开 API ----

function addRecord(record) {
  return new Promise((resolve) => {
    const newRecord = {
      _id: 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      ...record,
      recorded_at: record.recorded_at || new Date().toISOString()
    };
    // 本地立即写入
    const local = _readLocal();
    local.unshift(newRecord);
    _writeLocal(local);

    // HTTP 异步写入（不阻塞，不关心结果）
    api.post('/api/records', {
      record_type: record.record_type,
      caffeine_mg: record.caffeine_mg,
      bean_name: record.bean_name,
      bean_weight_g: record.bean_weight_g,
      method_name: record.method_name,
      range_min: record.range_min,
      range_max: record.range_max,
      brand_name: record.brand_name,
      drink_name: record.drink_name,
      size_name: record.size_name,
      data_source: record.data_source,
      data_confidence: record.data_confidence,
      recorded_at: newRecord.recorded_at
    }).catch(() => {});

    resolve({ success: true, id: newRecord._id });
  });
}

function _getAllRecords() {
  return new Promise((resolve) => {
    const local = _readLocal();

    // HTTP 异步拉取服务端数据（用于合并，优先返回本地）
    api.get('/api/records').then(serverRecords => {
      if (serverRecords && Array.isArray(serverRecords) && serverRecords.length > 0) {
        // 服务端记录转本地格式
        const serverMapped = serverRecords.map(r => ({
          _id: 's_' + r.id,
          serverId: r.id,
          record_type: r.recordType,
          caffeine_mg: r.caffeineMg,
          bean_name: r.beanName,
          bean_weight_g: r.beanWeightG,
          method_name: r.methodName,
          range_min: r.rangeMin,
          range_max: r.rangeMax,
          brand_name: r.brandName,
          drink_name: r.drinkName,
          size_name: r.sizeName,
          data_source: r.dataSource,
          data_confidence: r.dataConfidence,
          recorded_at: r.recordedAt
        }));

        // 合并去重（按 recorded_at + caffeine_mg 去重）
        const map = {};
        serverMapped.forEach(r => {
          const key = (r.recorded_at || '') + '_' + (r.caffeine_mg || 0) + '_' + (r.record_type || '');
          map[key] = r;
        });
        local.forEach(r => {
          const key = (r.recorded_at || '') + '_' + (r.caffeine_mg || 0) + '_' + (r.record_type || '');
          if (!map[key]) map[key] = r;
        });
        const merged = Object.values(map).sort((a, b) =>
          (b.recorded_at || '').localeCompare(a.recorded_at || '')
        );
        _writeLocal(merged);
        resolve(merged);
      } else {
        resolve(local);
      }
    }).catch(() => resolve(local));
  });
}

function getTodayRecords() {
  return _getAllRecords().then(all => {
    const today = _todayStr();
    return all.filter(r => (r.recorded_at || '').split('T')[0] === today);
  });
}

function getTodayTotal() {
  return getTodayRecords().then(rs => rs.reduce((s, r) => s + (r.caffeine_mg || 0), 0));
}

function getTotalCount() {
  return _getAllRecords().then(all => all.length);
}

function deleteRecord(id) {
  return new Promise((resolve) => {
    // 检查是否是服务端记录
    const local = _readLocal();
    const target = local.find(r => r._id === id);
    const filtered = local.filter(r => r._id !== id);
    _writeLocal(filtered);

    // HTTP 异步删除
    if (target && target.serverId) {
      api.del('/api/records/' + target.serverId).catch(() => {});
    }

    resolve({ success: true });
  });
}

function clearAllRecords() {
  return new Promise((resolve) => {
    wx.removeStorageSync(STORAGE_KEY);
    // HTTP 异步清空
    api.del('/api/records/clear').catch(() => {});
    resolve({ success: true });
  });
}

function getRecordsByDate(dateStr) {
  return _getAllRecords().then(all =>
    all.filter(r => (r.recorded_at || '').split('T')[0] === dateStr)
  );
}

module.exports = {
  addRecord, getTodayRecords, getTodayTotal,
  getTotalCount, deleteRecord, clearAllRecords, getRecordsByDate,
  _getAllRecords
};
