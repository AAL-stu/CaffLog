// app.js - CaffLog 咖啡因摄入记录
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库');
      return;
    }
    wx.cloud.init({
      env: 'your-cloud-env-id',
      traceUser: true
    });
    this.loadSettings();
    this.checkLogin();
  },

  globalData: {
    userInfo: null,
    isLogin: false
  },

  checkLogin() {
    // 检查本地是否有登录态
    const userInfo = wx.getStorageSync('cafflog_user');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLogin = true;
    }
    // 静默登录获取 openid
    if (wx.cloud) {
      wx.cloud.callFunction({ name: 'caffeineService', data: { action: 'getOpenId' } })
        .then(res => {
          if (res.result && res.result.openid) {
            this.globalData.openid = res.result.openid;
          }
        }).catch(() => {});
    }
  },

  loadSettings() {
    const settings = wx.getStorageSync('caffeine_settings');
    if (!settings) {
      wx.setStorageSync('caffeine_settings', {
        enabled: true, warning: 350, danger: 400
      });
    }
  }
});
