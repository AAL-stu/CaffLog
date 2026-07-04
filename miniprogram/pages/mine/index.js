// pages/mine/index.js
const { getTotalCount } = require('../../utils/recordService');

Page({
  data: {
    avatarUrl: '',
    nickName: '点击登录',
    totalRecords: 0,
    isLogin: false
  },

  onShow() {
    this.checkLoginState();
    this.loadTotalCount();
  },

  checkLoginState() {
    const app = getApp();
    const userInfo = wx.getStorageSync('cafflog_user');
    if (userInfo) {
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        isLogin: true
      });
      app.globalData.userInfo = userInfo;
      app.globalData.isLogin = true;
    } else if (app.globalData.userInfo) {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        isLogin: true
      });
    }
  },

  async loadTotalCount() {
    try {
      const count = await getTotalCount();
      this.setData({ totalRecords: count });
    } catch (e) {}
  },

  onLogin() {
    if (this.data.isLogin) return;

    wx.getUserProfile({
      desc: '用于展示头像和昵称',
      success: (res) => {
        const userInfo = res.userInfo;
        this.setData({
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          isLogin: true
        });
        wx.setStorageSync('cafflog_user', userInfo);
        const app = getApp();
        app.globalData.userInfo = userInfo;
        app.globalData.isLogin = true;
        wx.showToast({ title: '登录成功', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: '需要授权才能使用', icon: 'none' });
      }
    });
  },

  goSettings() {
    wx.navigateTo({ url: '/pages/settings/index' });
  },

  showAbout() {
    wx.showModal({
      title: '关于 CaffLog',
      content: '版本 v1.0\n\nCaffLog 是一款咖啡因摄入记录助手，帮助你科学管理每日咖啡因摄入。\n\n咖啡因数值为估算值，仅供参考，不构成医疗建议。',
      showCancel: false, confirmText: '知道了', confirmColor: '#6B4E3D'
    });
  }
});
