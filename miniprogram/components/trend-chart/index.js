// components/trend-chart/index.js
const { SAFE_LIMIT } = require('../../utils/constants');

Component({
  properties: {
    data: { type: Array, value: [] },
    days: { type: Number, value: 7 },
    chartType: { type: String, value: 'bar' },
    renderVersion: { type: Number, value: 0 }
  },

  observers: {
    'renderVersion, data': function() {
      if (this._ready) this._tryDraw(0);
    }
  },

  lifetimes: {
    ready() {
      this._ready = true;
      this._tryDraw(30);
    },
    detached() {
      this._ready = false;
    }
  },

  methods: {
    _tryDraw(retryCount) {
      const data = this.properties.data;
      if (!data || !data.length) return;

      const query = this.createSelectorQuery();
      query.select('#trendCanvas').fields({ node: true, size: true }).exec((res) => {
        if (!res || !res[0] || !res[0].node || !res[0].width || !res[0].height) {
          // Canvas 未就绪，重试（最多10次，每次间隔30ms）
          if (retryCount < 10) {
            setTimeout(() => this._tryDraw(retryCount + 1), 30);
          }
          return;
        }

        const dpr = wx.getSystemInfoSync().pixelRatio;
        const w = res[0].width, h = res[0].height;
        const canvas = res[0].node;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        if (this.properties.chartType === 'line') {
          this._drawLine(ctx, data, w, h);
        } else {
          this._drawBar(ctx, data, w, h);
        }
      });
    },

    _drawBar(ctx, data, w, h) {
      const pad = { top: 20, right: 20, bottom: 36, left: 50 };
      const cw = w - pad.left - pad.right;
      const ch = h - pad.top - pad.bottom;
      const vals = data.map(d => d.total);
      const yMax = Math.ceil(Math.max(SAFE_LIMIT, ...vals, 1) / 100) * 100;

      ctx.strokeStyle = '#E8E0D5'; ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (ch / 4) * i;
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
        ctx.fillStyle = '#8B8178'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
        ctx.fillText(String(Math.round(yMax - (yMax / 4) * i)), pad.left - 6, y + 3);
      }

      if (yMax > SAFE_LIMIT) {
        const sy = pad.top + ch * (1 - SAFE_LIMIT / yMax);
        ctx.setLineDash([4, 3]); ctx.strokeStyle = '#E74C3C';
        ctx.beginPath(); ctx.moveTo(pad.left, sy); ctx.lineTo(w - pad.right, sy); ctx.stroke();
        ctx.setLineDash([]);
      }

      const barW = Math.min(36, (cw / data.length) * 0.6);
      const gap = cw / data.length;
      data.forEach((item, i) => {
        const x = pad.left + gap * i + (gap - barW) / 2;
        const bh = Math.max(2, (item.total / yMax) * ch);
        const y = pad.top + ch - bh;
        ctx.fillStyle = item.total >= SAFE_LIMIT ? '#E74C3C' : item.total >= 350 ? '#F0AD4E' : '#6B4E3D';
        ctx.fillRect(x, y, barW, bh);
        ctx.fillStyle = '#8B8178'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(String(item.date || '').slice(0, 7), pad.left + gap * i + gap / 2, h - 10);
        if (item.total > 0) {
          ctx.fillStyle = '#2C2416'; ctx.font = 'bold 8px sans-serif';
          ctx.fillText(String(item.total), pad.left + gap * i + gap / 2, y - 4);
        }
      });
      ctx.strokeStyle = '#8B8178'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top + ch); ctx.lineTo(w - pad.right, pad.top + ch); ctx.stroke();
    },

    _drawLine(ctx, data, w, h) {
      const pad = { top: 24, right: 24, bottom: 36, left: 50 };
      const cw = w - pad.left - pad.right;
      const ch = h - pad.top - pad.bottom;
      const vals = data.map(d => d.total);
      const yMax = Math.ceil(Math.max(SAFE_LIMIT, ...vals, 1) / 100) * 100;

      ctx.strokeStyle = '#E8E0D5'; ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (ch / 4) * i;
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
        ctx.fillStyle = '#8B8178'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
        ctx.fillText(String(Math.round(yMax - (yMax / 4) * i)), pad.left - 6, y + 3);
      }

      if (yMax > SAFE_LIMIT) {
        const sy = pad.top + ch * (1 - SAFE_LIMIT / yMax);
        ctx.setLineDash([4, 3]); ctx.strokeStyle = '#E74C3C';
        ctx.beginPath(); ctx.moveTo(pad.left, sy); ctx.lineTo(w - pad.right, sy); ctx.stroke();
        ctx.setLineDash([]);
      }

      const gap = cw / Math.max(data.length - 1, 1);
      const pts = data.map((item, i) => ({
        x: pad.left + gap * i,
        y: pad.top + ch - Math.max(1, (item.total / yMax) * ch),
        val: item.total
      }));

      // 填充
      ctx.beginPath(); ctx.moveTo(pts[0].x, pad.top + ch);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length - 1].x, pad.top + ch);
      ctx.closePath();
      ctx.fillStyle = 'rgba(107,78,61,0.08)'; ctx.fill();

      // 折线
      ctx.beginPath(); ctx.strokeStyle = '#6B4E3D'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // 数据点
      pts.forEach(p => {
        if (p.val > 0) {
          ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = p.val >= SAFE_LIMIT ? '#E74C3C' : '#6B4E3D';
          ctx.fill();
        }
      });

      ctx.strokeStyle = '#8B8178'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top + ch); ctx.lineTo(w - pad.right, pad.top + ch); ctx.stroke();
    }
  }
});
