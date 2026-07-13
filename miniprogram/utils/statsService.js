// statsService.js - 统计数据服务（优先 HTTP 聚合，降级本地计算）
const { _getAllRecords } = require('./recordService');
const api = require('./api');

const WEEKDAYS = ['周一','周二','周三','周四','周五','周六','周日'];

function _dateStr(d) {
  return d.toISOString().split('T')[0];
}

function _aggregateLocally(records, days) {
  const end = new Date(); end.setHours(23,59,59,999);
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0,0,0,0);

  const map = {};
  records.forEach(r => {
    const d = (r.recorded_at || '').split('T')[0];
    if (!map[d]) map[d] = { total: 0, count: 0 };
    map[d].total += r.caffeine_mg || 0;
    map[d].count += 1;
  });

  const result = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const ds = _dateStr(d);
    result.push({ date: ds, total: map[ds]?.total || 0, count: map[ds]?.count || 0 });
  }
  return result;
}

function getDailyTrend(days) {
  // 优先 HTTP 服务端聚合，降级本地计算
  return api.get('/api/stats/daily', { days }).then(data => {
    // 服务端返回 { success, data: [{ date, total, count }] }
    if (Array.isArray(data)) return data;
    if (data && data.data && Array.isArray(data.data)) return data.data;
    throw new Error('格式错误');
  }).catch(() => {
    // 降级为本地聚合
    return _getAllRecords().then(records => _aggregateLocally(records, days)).catch(() => []);
  });
}

function getWeeklyTrend() {
  return api.get('/api/stats/weekly').then(data => {
    if (Array.isArray(data)) return data;
    if (data && data.data && Array.isArray(data.data)) return data.data;
    throw new Error('格式错误');
  }).catch(() => {
    return _getAllRecords().then(records => _aggregateLocally(records, 7)).catch(() => []);
  });
}

function getMonthlyTrend() {
  return api.get('/api/stats/monthly').then(data => {
    if (Array.isArray(data)) return data;
    if (data && data.data && Array.isArray(data.data)) return data.data;
    throw new Error('格式错误');
  }).catch(() => {
    const today = new Date();
    const daysInMonth = today.getDate();
    return _getAllRecords().then(records => _aggregateLocally(records, daysInMonth)).catch(() => []);
  });
}

module.exports = { getDailyTrend, getWeeklyTrend, getMonthlyTrend };
