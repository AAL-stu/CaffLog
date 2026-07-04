// pages/settings/index.js
const { DEFAULT_SETTINGS } = require('../../utils/constants');
const { clearAllRecords, _getAllRecords } = require('../../utils/recordService');

Page({
  data: { enabled: true, warning: 350, danger: 400 },

  onShow() { this.loadSettings(); },

  loadSettings() {
    try {
      const s = wx.getStorageSync('caffeine_settings') || DEFAULT_SETTINGS;
      this.setData({ enabled: s.enabled, warning: s.warning, danger: s.danger });
    } catch (e) {
      this.setData({ enabled: DEFAULT_SETTINGS.enabled, warning: DEFAULT_SETTINGS.warning, danger: DEFAULT_SETTINGS.danger });
    }
  },

  saveSettings() {
    const { enabled, warning, danger } = this.data;
    wx.setStorageSync('caffeine_settings', { enabled, warning, danger });
  },

  onToggleReminder(e) { this.setData({ enabled: e.detail.value }); this.saveSettings(); },

  onWarningChange(e) { this.setData({ warning: parseInt(e.detail.value) || 0 }); this.saveSettings(); },

  onDangerChange(e) { this.setData({ danger: parseInt(e.detail.value) || 0 }); this.saveSettings(); },

  async onClearAll() {
    wx.showModal({
      title: '确认清除', content: '此操作将清除所有摄入记录，且不可恢复。',
      confirmText: '确认清除', confirmColor: '#E74C3C',
      success: async (res) => {
        if (res.confirm) {
          await clearAllRecords();
          wx.showToast({ title: '已清除', icon: 'success' });
        }
      }
    });
  },

  async onExport() {
    wx.showLoading({ title: '导出中...' });
    try {
      const records = await _getAllRecords();
      wx.hideLoading();

      if (!records.length) {
        wx.showToast({ title: '暂无记录', icon: 'none' });
        return;
      }

      // 格式化文本
      let text = 'CaffLog 咖啡因摄入记录\n';
      text += '导出时间：' + new Date().toLocaleString() + '\n';
      text += '─'.repeat(40) + '\n\n';

      let lastDate = '';
      records.forEach((r, i) => {
        const date = (r.recorded_at || '').split('T')[0];
        const time = (r.recorded_at || '').slice(11, 16);
        if (date !== lastDate) {
          text += `\n📅 ${date}\n`;
          text += '─'.repeat(30) + '\n';
          lastDate = date;
        }
        const type = r.record_type === 'homemade' ? '自制' : '品牌';
        let desc = '';
        if (r.record_type === 'homemade') {
          desc = `${r.bean_name || ''} · ${r.method_name || ''} · ${r.bean_weight_g || 0}g`;
        } else {
          desc = `${r.brand_name || ''} · ${r.drink_name || ''} · ${r.size_name || ''}`;
        }
        text += `${time}  ${type}  ${desc}  —  ${r.caffeine_mg}mg\n`;
      });

      text += '\n' + '─'.repeat(40) + '\n';
      text += `共 ${records.length} 条记录\n`;
      text += '数据来源：CaffLog 咖啡因摄入记录小程序\n';
      text += '免责声明：咖啡因数值仅供参考，不构成医疗建议\n';

      // 复制到剪贴板
      wx.setClipboardData({
        data: text,
        success: () => {
          wx.showModal({
            title: '导出成功',
            content: '记录已复制到剪贴板，可粘贴至备忘录或发送给他人',
            showCancel: false,
            confirmText: '知道了'
          });
        }
      });
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  }
});
