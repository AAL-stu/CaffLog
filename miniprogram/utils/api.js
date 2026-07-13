// api.js - 小程序 HTTP 请求封装（JWT 自动附加 + 401 自动重登录）
const BASE_URL = 'http://localhost:8080'; // 开发环境，部署时修改为实际域名

let _token = '';

function setToken(token) {
  _token = token;
  try { wx.setStorageSync('cafflog_token', token); } catch (e) {}
}

function getToken() {
  if (_token) return _token;
  try { _token = wx.getStorageSync('cafflog_token') || ''; } catch (e) { _token = ''; }
  return _token;
}

function clearToken() {
  _token = '';
  try { wx.removeStorageSync('cafflog_token'); } catch (e) {}
}

/**
 * 通用请求方法
 * @param {string} method - GET/POST/DELETE
 * @param {string} path   - API 路径，如 /api/records
 * @param {object} data   - 请求体（GET 时转为 query string）
 * @param {object} options - { showLoading, skipAuth }
 * @returns {Promise<any>}
 */
function request(method, path, data, options = {}) {
  const url = BASE_URL + path;
  const token = getToken();
  const header = { 'Content-Type': 'application/json' };
  if (token && !options.skipAuth) {
    header['Authorization'] = 'Bearer ' + token;
  }

  if (options.showLoading) {
    wx.showLoading({ title: '加载中...', mask: true });
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      header,
      data: method === 'GET' ? undefined : data,
      timeout: 10000,
      success(res) {
        if (res.statusCode === 401) {
          // Token 过期，触发重新登录
          clearToken();
          wx.showToast({ title: '登录已过期，请重新打开', icon: 'none' });
          reject(new Error('Token expired'));
          return;
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const body = res.data;
          if (body && body.success !== false) {
            resolve(body.data !== undefined ? body.data : body);
          } else {
            reject(new Error((body && body.message) || '请求失败'));
          }
        } else {
          const msg = (res.data && res.data.message) || `服务器错误 (${res.statusCode})`;
          reject(new Error(msg));
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络请求失败'));
      },
      complete() {
        if (options.showLoading) wx.hideLoading();
      }
    });
  });
}

module.exports = {
  get: (path, params = {}, options) => {
    const qs = Object.keys(params).length
      ? '?' + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
      : '';
    return request('GET', path + qs, null, options);
  },
  post: (path, data, options) => request('POST', path, data, options),
  del: (path, options) => request('DELETE', path, null, options),
  setToken,
  getToken,
  clearToken,
  BASE_URL
};
