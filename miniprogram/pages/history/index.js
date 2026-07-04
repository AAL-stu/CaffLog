// pages/history/index.js
const { getWeeklyTrend } = require('../../utils/statsService');
const { deleteRecord, addRecord, _getAllRecords } = require('../../utils/recordService');

Page({
  data: {
    groupedRecords: [],
    totalCount: 0,
    loading: true,
    weekData: [],
    chartVersion: 0
  },

  onShow() { this.loadAll(); },
  onPullDownRefresh() { this.loadAll().then(() => wx.stopPullDownRefresh()); },

  async loadAll() {
    this.setData({ loading: true });
    try {
      const records = await _getAllRecords();
      const grouped = this._groupByDate(records);
      const weekData = await getWeeklyTrend().catch(() => []);
      const ver = this.data.chartVersion + 1;
      this.setData({ groupedRecords: grouped, totalCount: records.length,
        weekData, chartVersion: ver, loading: false });
    } catch (e) { this.setData({ loading: false }); }
  },

  _groupByDate(records) {
    const map = {};
    records.forEach(r => {
      const date = (r.recorded_at || '').split('T')[0];
      if (!map[date]) map[date] = { date, total: 0, items: [] };
      map[date].total += r.caffeine_mg || 0;
      map[date].items.push({ ...r, _time: (r.recorded_at || '').slice(11, 16) });
    });
    return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
  },

  onRecordTap(e) {
    const id = e.currentTarget.dataset.id;
    let record = null;
    for (const g of this.data.groupedRecords) {
      const f = g.items.find(r => r._id === id);
      if (f) { record = f; break; }
    }
    if (!record) return;
    wx.showActionSheet({
      itemList: ['编辑咖啡因量', '删除记录'],
      success: (res) => {
        if (res.tapIndex === 0) this._editRecord(record);
        else if (res.tapIndex === 1) this._delRecord(id);
      }
    });
  },

  _editRecord(record) {
    wx.showModal({
      title: '编辑咖啡因量', editable: true,
      placeholderText: '输入毫克数', content: String(record.caffeine_mg),
      confirmText: '保存', confirmColor: '#6B4E3D',
      success: async (res) => {
        if (res.confirm && res.content) {
          const v = parseInt(res.content);
          if (isNaN(v) || v <= 0) { wx.showToast({ title: '请输入有效数值', icon: 'none' }); return; }
          await deleteRecord(record._id);
          await addRecord({ ...record, caffeine_mg: v, _id: undefined });
          wx.showToast({ title: '已更新', icon: 'success' }); this.loadAll();
        }
      }
    });
  },

  _delRecord(id) {
    wx.showModal({
      title: '删除记录', content: '确定删除这条记录吗？', confirmColor: '#E74C3C',
      success: async (res) => { if (res.confirm) { await deleteRecord(id); wx.showToast({ title: '已删除', icon: 'success' }); this.loadAll(); }}
    });
  },

  onDeleteDay(e) {
    const date = e.currentTarget.dataset.date;
    wx.showModal({
      title: '删除当日全部', content: `删除 ${date} 的所有记录？`, confirmColor: '#E74C3C',
      success: async (res) => {
        if (res.confirm) {
          const all = await _getAllRecords();
          const td = all.filter(r => (r.recorded_at || '').split('T')[0] === date);
          for (const r of td) await deleteRecord(r._id);
          wx.showToast({ title: `已删除 ${td.length} 条`, icon: 'success' }); this.loadAll();
        }
      }
    });
  }
});
