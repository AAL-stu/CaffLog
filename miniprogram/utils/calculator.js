// calculator.js - CaffLog 咖啡因计算引擎

const { VARIANCE_RATIO } = require('./constants');

/**
 * 计算自制咖啡的咖啡因含量
 * @param {number} weight - 咖啡豆重量（克）
 * @param {number} coefficient - 品种咖啡因系数（mg/g）
 * @param {number} extractionRate - 冲煮萃取率（0-1）
 * @returns {{ caffeine: number, rangeMin: number, rangeMax: number }}
 */
function calculate(weight, coefficient, extractionRate) {
  const raw = weight * coefficient * extractionRate;
  const caffeine = Math.round(raw);
  const rangeMin = Math.round(raw * (1 - VARIANCE_RATIO));
  const rangeMax = Math.round(raw * (1 + VARIANCE_RATIO));
  return { caffeine, rangeMin, rangeMax };
}

/**
 * 获取当前阈值设置
 * @returns {{ enabled: boolean, warning: number, danger: number }}
 */
function getSettings() {
  const defaults = { enabled: true, warning: 350, danger: 400 };
  try {
    return wx.getStorageSync('caffeine_settings') || defaults;
  } catch (e) {
    return defaults;
  }
}

/**
 * 检查是否触发提醒阈值
 * @param {number} todayTotal - 当日累计摄入量
 * @returns {{ triggered: boolean, level: string|null, message: string }}
 */
function checkThreshold(todayTotal) {
  const settings = getSettings();

  if (!settings.enabled) {
    return { triggered: false, level: null, message: '' };
  }

  if (todayTotal >= settings.danger) {
    return {
      triggered: true,
      level: 'danger',
      message: `今日已摄入 ${todayTotal}mg，超过 ${settings.danger}mg 安全上限，请注意健康！`
    };
  }

  if (todayTotal >= settings.warning) {
    return {
      triggered: true,
      level: 'warning',
      message: `今日已摄入 ${todayTotal}mg，接近 ${settings.warning}mg 提醒阈值`
    };
  }

  return { triggered: false, level: null, message: '' };
}

module.exports = { calculate, getSettings, checkThreshold };
