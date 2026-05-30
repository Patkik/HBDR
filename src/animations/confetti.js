/* ═══════════════════════════════════════════════════
   CONFETTI SYSTEM — Cake page celebration
   ═══════════════════════════════════════════════════ */

import { random, getDPR } from '../utils/helpers.js';

export class ConfettiSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = getDPR();
    this.confetti = [];
    this.animationId = null;
    this.active = false;
    this.resize();
    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize);
  }

  resize() {
    this.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.parentElement.clientHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  burst(count = 150) {
    this.active = true;
    const colors = [
      '#ffd700', '#ff6b9d', '#6a0dad', '#4ecdc4',
      '#ff8ec8', '#c3b1e1', '#e8a87c', '#4a90d9',
      '#ff4757', '#2ed573', '#ffa502', '#ff6348',
    ];

    const shapes = ['rect', 'circle', 'star', 'ribbon'];

    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const velocity = random(4, 14);
      this.confetti.push({
        x: this.width / 2,
        y: this.height * 0.4,
        vx: Math.cos(angle) * velocity * random(0.5, 1.5),
        vy: Math.sin(angle) * velocity * random(0.5, 1) - random(2, 8),
        width: random(6, 14),
        height: random(4, 10),
        color: colors[Math.floor(random(0, colors.length))],
        shape: shapes[Math.floor(random(0, shapes.length))],
        rotation: random(0, Math.PI * 2),
        rotSpeed: random(-0.15, 0.15),
        gravity: 0.12,
        drag: 0.98,
        alpha: 1,
        wobble: random(0.02, 0.06),
        wobblePhase: random(0, Math.PI * 2),
        shimmer: random(0.5, 1),
      });
    }

    if (!this.animationId) this._loop();
  }

  _loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];

      c.vy += c.gravity;
      c.vx *= c.drag;
      c.vy *= c.drag;
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotSpeed;
      c.wobblePhase += c.wobble;
      c.x += Math.sin(c.wobblePhase) * 1.5;

      // Fade when near bottom
      if (c.y > this.height * 0.85) {
        c.alpha -= 0.02;
      }

      if (c.alpha <= 0 || c.y > this.height + 50) {
        this.confetti.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.rotation);
      this.ctx.globalAlpha = c.alpha;

      switch (c.shape) {
        case 'rect':
          this.ctx.fillStyle = c.color;
          this.ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
          break;
        case 'circle':
          this.ctx.beginPath();
          this.ctx.arc(0, 0, c.width / 2, 0, Math.PI * 2);
          this.ctx.fillStyle = c.color;
          this.ctx.fill();
          break;
        case 'star':
          this._drawStar(0, 0, c.width / 2, c.color);
          break;
        case 'ribbon':
          this.ctx.fillStyle = c.color;
          this.ctx.beginPath();
          this.ctx.moveTo(-c.width / 2, -c.height);
          this.ctx.quadraticCurveTo(0, -c.height / 2, c.width / 2, -c.height);
          this.ctx.lineTo(c.width / 3, c.height);
          this.ctx.quadraticCurveTo(0, c.height / 2, -c.width / 3, c.height);
          this.ctx.closePath();
          this.ctx.fill();
          break;
      }

      this.ctx.restore();
    }

    if (this.confetti.length > 0) {
      this.animationId = requestAnimationFrame(() => this._loop());
    } else {
      this.animationId = null;
    }
  }

  _drawStar(cx, cy, r, color) {
    const ctx = this.ctx;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this._onResize);
  }
}
