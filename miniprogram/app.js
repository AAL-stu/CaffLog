// app.js - CaffLog 咖啡因摄入记录
const { silentLogin } = require('./utils/authService');

App({
  onLaunch() {
    this.loadSettings();
    this.checkLogin();
    // 静默登录获取 JWT
    silentLogin()
      .then(data => {
        this.globalData.openid = data.openid;
        this.globalData.userId = data.userId;
        console.log('JWT 登录成功, userId:', data.userId);
      })
      .catch(err => {
        console.warn('静默登录失败:', err);
      });
  },

  globalData: {
    userInfo: null,
    isLogin: false,
    openid: '',
    userId: null
  },

  checkLogin() {
    // 检查本地是否有登录态
    const userInfo = wx.getStorageSync('cafflog_user');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLogin = true;
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
