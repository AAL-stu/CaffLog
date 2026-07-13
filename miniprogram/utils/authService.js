// authService.js - 微信登录 + JWT 获取服务
const api = require('./api');

/**
 * 静默登录：wx.login 获取 code → 后端换取 JWT
 * @returns {Promise<{token: string, openid: string, userId: number}>}
 */
function silentLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (loginRes) => {
        if (!loginRes.code) {
          reject(new Error('wx.login 失败'));
          return;
        }
        api.post('/api/auth/login', { code: loginRes.code }, { skipAuth: true })
          .then(data => {
            api.setToken(data.token);
            // 存储 openid 和 userId 供全局使用
            try {
              wx.setStorageSync('cafflog_openid', data.openid);
              wx.setStorageSync('cafflog_userId', data.userId);
            } catch (e) {}
            resolve(data);
          })
          .catch(err => {
            console.error('登录失败:', err);
            reject(err);
          });
      },
      fail: (err) => {
        reject(new Error('wx.login 调用失败: ' + (err.errMsg || '')));
      }
    });
  });
}

module.exports = { silentLogin };
