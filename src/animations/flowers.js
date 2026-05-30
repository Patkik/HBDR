/* ═══════════════════════════════════════════════════
   FLOWER BLOOM ANIMATION — Message page
   ═══════════════════════════════════════════════════ */

import { random, getDPR, ease } from '../utils/helpers.js';

export class FlowerBloom {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = getDPR();
    this.petals = [];
    this.sparkles = [];
    this.bloomProgress = 0;
    this.blooming = false;
    this.bloomed = false;
    this.animationId = null;
    this.centerX = 0;
    this.centerY = 0;
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
    this.centerX = this.width / 2;
    this.centerY = this.height * 0.65;
  }

  startBloom(onComplete) {
    this.blooming = true;
    this.onComplete = onComplete;
    this._generatePetals();
    this._loop();
  }

  _generatePetals() {
    // Multiple layers of petals
    const layers = [
      { count: 8, radius: 80, size: 45, color: [255, 107, 157], delay: 0 },
      { count: 10, radius: 55, size: 35, color: [255, 150, 180], delay: 0.15 },
      { count: 6, radius: 30, size: 25, color: [255, 182, 193], delay: 0.3 },
      { count: 5, radius: 15, size: 18, color: [255, 215, 200], delay: 0.45 },
    ];

    for (const layer of layers) {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2 - Math.PI / 2;
        const jitter = random(-0.15, 0.15);
        this.petals.push({
          angle: angle + jitter,
          targetRadius: layer.radius,
          currentRadius: 0,
          size: layer.size,
          color: layer.color,
          delay: layer.delay,
          rotation: angle + random(-0.3, 0.3),
          alpha: 0,
          sway: random(0.5, 1.5),
          swayPhase: random(0, Math.PI * 2),
        });
      }
    }

    // Center pistil sparkles
    for (let i = 0; i < 20; i++) {
      this.sparkles.push({
        angle: random(0, Math.PI * 2),
        dist: random(5, 25),
        size: random(1.5, 4),
        alpha: 0,
        twinkle: random(0.02, 0.05),
        phase: random(0, Math.PI * 2),
        color: `rgba(255, 215, 0, `,
      });
    }
  }

  _loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.blooming && this.bloomProgress < 1) {
      this.bloomProgress += 0.007;
      if (this.bloomProgress >= 1) {
        this.bloomProgress = 1;
        this.bloomed = true;
        if (this.onComplete) this.onComplete();
      }
    }

    const t = this.bloomProgress;

    // Draw petals back to front (outer first)
    for (const petal of this.petals) {
      const petalT = Math.max(0, Math.min(1, (t - petal.delay) / (1 - petal.delay)));
      if (petalT <= 0) continue;

      const eased = ease.outBack(petalT);
      petal.currentRadius = petal.targetRadius * eased;
      petal.alpha = Math.min(1, petalT * 1.5);
      petal.swayPhase += 0.01 * petal.sway;

      const swayOffset = Math.sin(petal.swayPhase) * 3 * (1 - petalT * 0.5);
      const x = this.centerX + Math.cos(petal.angle) * petal.currentRadius;
      const y = this.centerY + Math.sin(petal.angle) * petal.currentRadius + swayOffset;

      this._drawPetal(x, y, petal);
    }

    // Draw center
    if (t > 0.3) {
      const centerT = ease.outExpo(Math.min(1, (t - 0.3) / 0.4));
      this._drawCenter(centerT);
    }

    // Draw sparkles
    for (const s of this.sparkles) {
      s.phase += s.twinkle;
      const sparkleT = Math.max(0, (t - 0.5) / 0.5);
      if (sparkleT <= 0) continue;
      s.alpha = sparkleT * (0.5 + 0.5 * Math.sin(s.phase));
      const sx = this.centerX + Math.cos(s.angle) * s.dist;
      const sy = this.centerY + Math.sin(s.angle) * s.dist;

      this.ctx.beginPath();
      this.ctx.arc(sx, sy, s.size * sparkleT, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color + s.alpha + ')';
      this.ctx.fill();
    }

    // Scatter petals after full bloom
    if (this.bloomed) {
      this._drawScatterPetals();
    }

    this.animationId = requestAnimationFrame(() => this._loop());
  }

  _drawPetal(x, y, petal) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(petal.rotation);
    ctx.globalAlpha = petal.alpha * 0.85;

    const s = petal.size;
    const [r, g, b] = petal.color;

    // Petal shape
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-s * 0.4, -s * 0.6, -s * 0.2, -s, 0, -s * 1.1);
    ctx.bezierCurveTo(s * 0.2, -s, s * 0.4, -s * 0.6, 0, 0);
    ctx.closePath();

    const grad = ctx.createRadialGradient(0, -s * 0.5, 0, 0, -s * 0.5, s);
    grad.addColorStop(0, `rgba(${r + 40}, ${g + 40}, ${b + 40}, 0.95)`);
    grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.8)`);
    grad.addColorStop(1, `rgba(${r - 30}, ${g - 30}, ${b - 20}, 0.4)`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Petal vein
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.quadraticCurveTo(1, -s * 0.5, 0, -s * 0.9);
    ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }

  _drawCenter(t) {
    const ctx = this.ctx;
    const radius = 12 * t;

    // Outer glow
    const grad = ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, radius * 3
    );
    grad.addColorStop(0, `rgba(255, 215, 0, ${0.4 * t})`);
    grad.addColorStop(0.5, `rgba(255, 180, 100, ${0.2 * t})`);
    grad.addColorStop(1, 'rgba(255, 180, 100, 0)');
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Center circle
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
    const centerGrad = ctx.createRadialGradient(
      this.centerX - 2, this.centerY - 2, 0,
      this.centerX, this.centerY, radius
    );
    centerGrad.addColorStop(0, `rgba(255, 235, 150, ${t})`);
    centerGrad.addColorStop(1, `rgba(255, 200, 100, ${t * 0.8})`);
    ctx.fillStyle = centerGrad;
    ctx.fill();
  }

  _scatterPetals = [];
  _scatterInit = false;

  _drawScatterPetals() {
    if (!this._scatterInit) {
      this._scatterInit = true;
      for (let i = 0; i < 15; i++) {
        this._scatterPetals.push({
          x: random(0, this.width),
          y: random(-50, -200),
          size: random(6, 14),
          speedX: random(-0.5, 0.5),
          speedY: random(0.3, 1.0),
          rotation: random(0, Math.PI * 2),
          rotSpeed: random(-0.02, 0.02),
          alpha: random(0.3, 0.7),
          color: [255, random(150, 200), random(180, 210)],
        });
      }
    }

    for (const p of this._scatterPetals) {
      p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      if (p.y > this.height + 50) {
        p.y = random(-50, -100);
        p.x = random(0, this.width);
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.alpha;

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color.join(',')}, 0.6)`;
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this._onResize);
  }
}
