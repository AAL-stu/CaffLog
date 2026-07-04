// components/ring-progress/index.js
Component({
  properties: {
    current: { type: Number, value: 0 },
    max: { type: Number, value: 400 },
    size: { type: Number, value: 280 }
  },

  observers: {
    'current, max': function() {
      if (this._ready) this._tryDraw(0);
    }
  },

  data: {
    canvasWidth: 280, canvasHeight: 280,
    remaining: 400, percentage: 0
  },

  lifetimes: {
    attached() {
      this.setData({ canvasWidth: this.properties.size, canvasHeight: this.properties.size });
    },
    ready() {
      this._ready = true;
      this._tryDraw(30);
    },
    detached() { this._ready = false; }
  },

  methods: {
    _tryDraw(retryCount) {
      const { current, max, size } = this.properties;
      const query = this.createSelectorQuery();
      query.select('#ringCanvas').fields({ node: true, size: true }).exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          if (retryCount < 10) setTimeout(() => this._tryDraw(retryCount + 1), 30);
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, size, size);
        this._render(ctx, current, max, size);
      });

      const remaining = Math.max(0, max - current);
      const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
      this.setData({ remaining, percentage: pct });
    },

    _render(ctx, current, max, size) {
      const cx = size / 2, cy = size / 2;
      const r = size / 2 - 20;
      const lw = 16;
      const ratio = max > 0 ? Math.min(1, current / max) : 0;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#E8E0D5';
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.stroke();

      if (ratio > 0) {
        let color = '#5CB85C';
        if (ratio >= 0.875) color = '#E74C3C';
        else if (ratio >= 0.75) color = '#F0AD4E';
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI, -Math.PI + ratio * Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }
  }
});
