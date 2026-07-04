// recordService.js - 摄入记录 CRUD 服务（本地优先，云端异步同步）
const STORAGE_KEY = 'caffeine_records';
const COLLECTION = 'intake_records';

let _cloudOk = true; // 云端是否可用（发生过超时则标记 false）

// ---- 本地存储 ----
function _readLocal() {
  try { return wx.getStorageSync(STORAGE_KEY) || []; } catch (e) { return []; }
}
function _writeLocal(records) {
  try { wx.setStorageSync(STORAGE_KEY, records); } catch (e) {}
}
function _genId() {
  return 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}
function _todayStr() { return new Date().toISOString().split('T')[0]; }

// ---- 云端调用（带超时保护，永不阻塞） ----
function _cloudCall(promiseFn) {
  if (!_cloudOk) return Promise.resolve(null);
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      _cloudOk = false;
      resolve(null);
    }, 5000); // 5秒超时
    promiseFn().then(r => { clearTimeout(timer); _cloudOk = true; resolve(r); })
              .catch(() => { clearTimeout(timer); _cloudOk = true; resolve(null); });
  });
}

function _getDb() {
  try { return wx.cloud.database(); } catch (e) { return null; }
}

// ---- 公开 API ----

function addRecord(record) {
  return new Promise((resolve) => {
    const newRecord = {
      _id: _genId(),
      ...record,
      recorded_at: new Date().toISOString()
    };
    // 本地立即写入
    const local = _readLocal();
    local.unshift(newRecord);
    _writeLocal(local);

    // 云端异步写入（不阻塞，不关心结果）
    const db = _getDb();
    if (db && _cloudOk) {
      _cloudCall(() => db.collection(COLLECTION).add({ data: newRecord }));
    }

    resolve({ success: true, id: newRecord._id });
  });
}

function _getAllRecords() {
  return new Promise(async (resolve) => {
    const local = _readLocal();

    // 云端异步读取（不阻塞本地返回）
    const db = _getDb();
    if (db && _cloudOk) {
      _cloudCall(() => db.collection(COLLECTION).limit(500).get()).then(cloudRes => {
        if (cloudRes && cloudRes.data && cloudRes.data.length > 0) {
          // 合并去重后写入本地
          const map = {};
          cloudRes.data.forEach(r => { map[r._id] = r; });
          local.forEach(r => { if (!map[r._id]) map[r._id] = r; });
          const merged = Object.values(map).sort((a, b) =>
            (b.recorded_at || '').localeCompare(a.recorded_at || '')
          );
          _writeLocal(merged);
          resolve(merged);
        } else {
          resolve(local);
        }
      }).catch(() => resolve(local));
    } else {
      resolve(local);
    }
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
    const local = _readLocal().filter(r => r._id !== id);
    _writeLocal(local);
    // 云端异步删除
    const db = _getDb();
    if (db && _cloudOk) {
      _cloudCall(() => db.collection(COLLECTION).doc(id).remove());
    }
    resolve({ success: true });
  });
}

function clearAllRecords() {
  return new Promise((resolve) => {
    wx.removeStorageSync(STORAGE_KEY);
    const db = _getDb();
    if (db && _cloudOk) {
      _cloudCall(() => wx.cloud.callFunction({ name: 'caffeineService', data: { action: 'clearAllRecords' } }));
    }
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
