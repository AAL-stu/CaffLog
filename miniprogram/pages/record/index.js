// pages/record/index.js
const { COFFEE_BEANS, BREW_METHODS, BRANDS, WEIGHT_MIN, WEIGHT_MAX } = require('../../utils/constants');
const { calculate, checkThreshold } = require('../../utils/calculator');
const { getCategories, getDrinks, getSizes, findCaffeine } = require('../../utils/brandService');
const { addRecord, getTodayTotal } = require('../../utils/recordService');

Page({
  data: {
    activeTab: 'brand', // 默认品牌饮品 Tab

    // 自制咖啡表单项
    beans: COFFEE_BEANS,
    beanIndex: 0,
    methods: BREW_METHODS,
    methodIndex: 0,
    weight: '',
    weightFocused: false,

    // 品牌饮品选择状态
    brands: BRANDS,
    brandId: 'starbucks',
    categories: [],
    categoryIndex: 0,
    drinks: [],
    drinkIndex: 0,
    sizes: [],
    sizeIndex: 0,

    // 计算结果
    resultCaffeine: 0,
    resultMin: 0,
    resultMax: 0,
    resultSource: '',
    resultConfidence: '',
    canSave: false,

    // 加载状态
    saving: false
  },

  onLoad() {
    this.updateBrandData('starbucks');
  },

  // ========== Tab 切换 ==========
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab,
      resultCaffeine: 0,
      resultMin: 0,
      resultMax: 0,
      resultSource: '',
      resultConfidence: '',
      canSave: false
    });
  },

  // ========== 自制咖啡 ==========
  onBeanChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ beanIndex: index });
    this.recalcHomemade();
  },

  onMethodChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ methodIndex: index });
    this.recalcHomemade();
  },

  onWeightInput(e) {
    const val = e.detail.value;
    const filtered = val.replace(/[^\d.]/g, '');
    this.setData({ weight: filtered });
    this.recalcHomemade();
  },

  onWeightBlur() {
    this.setData({ weightFocused: false });
  },

  onWeightFocus() {
    this.setData({ weightFocused: true });
  },

  recalcHomemade() {
    const weight = parseFloat(this.data.weight);
    if (isNaN(weight) || weight < WEIGHT_MIN || weight > WEIGHT_MAX) {
      this.setData({ resultCaffeine: 0, resultMin: 0, resultMax: 0, canSave: false });
      return;
    }

    const bean = COFFEE_BEANS[this.data.beanIndex];
    const method = BREW_METHODS[this.data.methodIndex];
    const result = calculate(weight, bean.coefficient, method.rate);

    this.setData({
      resultCaffeine: result.caffeine,
      resultMin: result.rangeMin,
      resultMax: result.rangeMax,
      canSave: true
    });
  },

  // ========== 品牌饮品 ==========
  updateBrandData(brandId) {
    const categories = getCategories(brandId);
    const catIndex = 0;
    let drinkNames = [];
    let sizeNames = [];

    if (categories.length > 0) {
      const drinks = getDrinks(brandId, categories[catIndex]);
      drinkNames = drinks.map(d => d.drinkName);
      if (drinks.length > 0) {
        const sizes = getSizes(brandId, categories[catIndex], drinks[0].drinkName);
        sizeNames = sizes.map(s => s.name);
      }
    }

    this.setData({
      brandId,
      categories,
      categoryIndex: catIndex,
      drinks: drinkNames,
      drinkIndex: 0,
      sizes: sizeNames,
      sizeIndex: 0
    });

    const firstDrink = drinkNames.length > 0 ? drinkNames[0] : '';
    const firstSize = sizeNames.length > 0 ? sizeNames[0] : '';
    this.recalcBrand(brandId, categories[catIndex] || '', firstDrink, firstSize);
  },

  // 品牌选择 — 使用自定义视图 bindtap，从 dataset 取 brandId
  onBrandChange(e) {
    const brandId = e.currentTarget.dataset.id;
    if (!brandId || brandId === this.data.brandId) return;
    this.updateBrandData(brandId);
  },

  onCategoryChange(e) {
    const index = parseInt(e.detail.value);
    const { brandId, categories } = this.data;
    const category = categories[index];
    const drinks = getDrinks(brandId, category);
    let sizeNames = [];

    if (drinks.length > 0) {
      const sizes = getSizes(brandId, category, drinks[0].drinkName);
      sizeNames = sizes.map(s => s.name);
    }

    this.setData({
      categoryIndex: index,
      drinks: drinks.map(d => d.drinkName),
      drinkIndex: 0,
      sizes: sizeNames,
      sizeIndex: 0
    });

    this.recalcBrand(brandId, category, drinks[0]?.drinkName || '', sizeNames[0] || '');
  },

  onDrinkChange(e) {
    const index = parseInt(e.detail.value);
    const { brandId, categories, categoryIndex, drinks } = this.data;
    const category = categories[categoryIndex];
    const drinkName = drinks[index];
    const sizes = getSizes(brandId, category, drinkName);

    this.setData({
      drinkIndex: index,
      sizes: sizes.map(s => s.name),
      sizeIndex: 0
    });

    this.recalcBrand(brandId, category, drinkName, sizes[0]?.name || '');
  },

  onSizeChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ sizeIndex: index });

    const { brandId, categories, categoryIndex, drinks, drinkIndex, sizes } = this.data;
    this.recalcBrand(brandId, categories[categoryIndex], drinks[drinkIndex], sizes[index]);
  },

  recalcBrand(brandId, category, drinkName, sizeName) {
    if (!brandId || !category || !drinkName || !sizeName) {
      this.setData({ resultCaffeine: 0, resultSource: '', resultConfidence: '', canSave: false });
      return;
    }

    const result = findCaffeine(brandId, category, drinkName, sizeName);
    if (result) {
      const sourceLabel = result.source === 'official' ? '官方数据' : '估算值';
      const confidenceLabel = result.confidence === 'high' ? '高' : result.confidence === 'medium' ? '中' : '低';
      this.setData({
        resultCaffeine: result.caffeine,
        resultSource: sourceLabel,
        resultConfidence: confidenceLabel,
        canSave: true
      });
    } else {
      this.setData({ resultCaffeine: 0, resultSource: '', resultConfidence: '', canSave: false });
    }
  },

  // ========== 保存记录 ==========
  async onSubmit() {
    if (!this.data.canSave || this.data.saving) return;

    this.setData({ saving: true });

    try {
      const {
        activeTab, beanIndex, methodIndex, weight,
        brandId, categories, categoryIndex, drinks, drinkIndex, sizes, sizeIndex,
        resultCaffeine, resultSource, resultConfidence
      } = this.data;

      let record;
      if (activeTab === 'homemade') {
        record = {
          record_type: 'homemade',
          bean_name: COFFEE_BEANS[beanIndex].name,
          bean_weight_g: parseFloat(weight),
          method_name: BREW_METHODS[methodIndex].name,
          caffeine_mg: resultCaffeine,
          range_min: this.data.resultMin,
          range_max: this.data.resultMax
        };
      } else {
        const brand = BRANDS.find(b => b.id === brandId);
        record = {
          record_type: 'brand',
          brand_name: brand ? brand.name : '',
          drink_name: drinks[drinkIndex] || '',
          size_name: sizes[sizeIndex] || '',
          caffeine_mg: resultCaffeine,
          data_source: resultSource === '官方数据' ? 'official' : 'estimated',
          data_confidence: resultConfidence
        };
      }

      await addRecord(record);

      // 检查阈值
      const todayTotal = await getTodayTotal();
      const threshold = checkThreshold(todayTotal);

      // 先 toast，再弹窗
      wx.showToast({ title: '已记录', icon: 'success', duration: 1200 });

      // 延迟弹窗，避免与 toast 冲突
      if (threshold.triggered) {
        setTimeout(() => {
          wx.showModal({
            title: threshold.level === 'danger' ? '摄入超标' : '摄入提醒',
            content: threshold.message,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#6B4E3D'
          });
        }, 1500);
      }

      // 重置表单
      this.setData({
        weight: '',
        resultCaffeine: 0,
        resultMin: 0,
        resultMax: 0,
        resultSource: '',
        resultConfidence: '',
        canSave: false
      });

    } catch (err) {
      console.error('保存失败:', err);
      wx.showToast({ title: '保存失败，请重试', icon: 'none', duration: 2000 });
    } finally {
      this.setData({ saving: false });
    }
  }
});
