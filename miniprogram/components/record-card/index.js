// components/record-card/index.js
Component({
  properties: {
    record: {
      type: Object,
      value: {}
    }
  },

  data: {
    timeLabel: '',
    typeLabel: '',
    descLabel: '',
    iconClass: ''
  },

  observers: {
    'record': function(record) {
      if (!record || !record.recorded_at) return;
      this.processRecord(record);
    }
  },

  methods: {
    processRecord(record) {
      // 格式化时间
      const date = new Date(record.recorded_at);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      // 记录类型标签
      const isHomemade = record.record_type === 'homemade';
      const typeLabel = isHomemade ? '自制' : '品牌';
      const descLabel = isHomemade
        ? `${record.bean_name || ''} · ${record.method_name || ''} · ${record.bean_weight_g || 0}g`
        : `${record.brand_name || ''} · ${record.drink_name || ''} · ${record.size_name || ''}`;

      this.setData({
        timeLabel: `${hours}:${minutes}`,
        typeLabel,
        descLabel,
        isHomemade
      });
    },

    onTap() {
      this.triggerEvent('tap', { record: this.properties.record });
    },

    onLongPress() {
      this.triggerEvent('longpress', { record: this.properties.record });
    }
  }
});
