// statsService.js - 统计数据服务
const { _getAllRecords } = require('./recordService');

const WEEKDAYS = ['周一','周二','周三','周四','周五','周六','周日'];

function _dateStr(d) {
  return d.toISOString().split('T')[0];
}

function getDailyTrend(days) {
  return _getAllRecords().then(records => {
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
  }).catch(() => []);
}

function getWeeklyTrend() {
  return _getAllRecords().then(records => {
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    monday.setHours(0,0,0,0);

    const map = {};
    records.forEach(r => {
      const d = (r.recorded_at || '').split('T')[0];
      if (!map[d]) map[d] = { total: 0, count: 0 };
      map[d].total += r.caffeine_mg || 0;
      map[d].count += 1;
    });

    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ds = _dateStr(d);
      result.push({ date: WEEKDAYS[i], total: map[ds]?.total || 0, count: map[ds]?.count || 0 });
    }
    return result;
  }).catch(() => []);
}

function getMonthlyTrend() {
  return _getAllRecords().then(records => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDay.setHours(0,0,0,0);

    const map = {};
    records.forEach(r => {
      const d = (r.recorded_at || '').split('T')[0];
      if (!map[d]) map[d] = { total: 0, count: 0 };
      map[d].total += r.caffeine_mg || 0;
      map[d].count += 1;
    });

    const result = [];
    for (let d = new Date(firstDay); d <= today; d.setDate(d.getDate() + 1)) {
      const ds = _dateStr(d);
      result.push({ date: d.getDate() + '日', total: map[ds]?.total || 0, count: map[ds]?.count || 0 });
    }
    return result;
  }).catch(() => []);
}

module.exports = { getDailyTrend, getWeeklyTrend, getMonthlyTrend };
