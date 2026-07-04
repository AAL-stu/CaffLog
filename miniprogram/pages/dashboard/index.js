// pages/dashboard/index.js
const { SAFE_LIMIT } = require('../../utils/constants');
const { getTodayRecords, getTodayTotal, deleteRecord, addRecord } = require('../../utils/recordService');

Page({
  data: {
    todayDate: '',
    todayTotal: 0,
    maxLimit: SAFE_LIMIT,
    records: [],
    loading: true,
    isEmpty: false
  },

  onShow() {
    this.setData({ todayDate: this._fmtDate(new Date()) });
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().then(() => wx.stopPullDownRefresh());
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      const [total, records] = await Promise.all([
        getTodayTotal().catch(() => 0),
        getTodayRecords().catch(() => [])
      ]);
      this.setData({
        todayTotal: total,
        records: records.map(r => ({
          ...r,
          _time: (r.recorded_at || '').slice(11, 16),
          _desc: r.record_type === 'brand'
            ? `${r.brand_name || ''} · ${r.drink_name || ''} · ${r.size_name || ''}`
            : `${r.bean_name || ''} · ${r.method_name || ''} · ${r.bean_weight_g || 0}g`
        })),
        isEmpty: records.length === 0,
        loading: false
      });
    } catch (err) {
      this.setData({ loading: false });
    }
  },

  // 点击记录 — 操作菜单
  onRecordTap(e) {
    const { id } = e.currentTarget.dataset;
    const record = this.data.records.find(r => r._id === id);
    if (!record) return;
    wx.showActionSheet({
      itemList: ['编辑咖啡因量', '删除记录'],
      success: (res) => {
        if (res.tapIndex === 0) this._editRecord(record);
        else if (res.tapIndex === 1) this._deleteRecord(id);
      }
    });
  },

  _editRecord(record) {
    wx.showModal({
      title: '编辑咖啡因量',
      editable: true,
      placeholderText: '输入毫克数',
      content: String(record.caffeine_mg),
      confirmText: '保存',
      confirmColor: '#6B4E3D',
      success: async (res) => {
        if (res.confirm && res.content) {
          const val = parseInt(res.content);
          if (isNaN(val) || val <= 0) {
            wx.showToast({ title: '请输入有效数值', icon: 'none' });
            return;
          }
          await deleteRecord(record._id);
          await addRecord({ ...record, caffeine_mg: val, _id: undefined });
          wx.showToast({ title: '已更新', icon: 'success' });
          this.loadData();
        }
      }
    });
  },

  _deleteRecord(id) {
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条记录吗？',
      confirmColor: '#E74C3C',
      success: async (res) => {
        if (res.confirm) {
          await deleteRecord(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadData();
        }
      }
    });
  },

  _fmtDate(d) {
    const wd = ['周日','周一','周二','周三','周四','周五','周六'];
    return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${wd[d.getDay()]}`;
  }
});
