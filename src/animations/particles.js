/* ═══════════════════════════════════════════════════
   PARTICLE SYSTEM — Intro page star field + particles
   ═══════════════════════════════════════════════════ */

import { random, getDPR } from '../utils/helpers.js';

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.stars = [];
    this.animationId = null;
    this.dpr = getDPR();
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

  initStars(count = 120) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: random(0, this.width),
        y: random(0, this.height),
        size: random(0.5, 2.5),
        alpha: random(0.2, 0.8),
        twinkleSpeed: random(0.005, 0.02),
        twinklePhase: random(0, Math.PI * 2),
      });
    }
  }

  addRisingParticles(count = 30) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: random(0, this.width),
        y: this.height + random(0, 100),
        size: random(1, 4),
        speedY: random(-0.3, -1.2),
        speedX: random(-0.2, 0.2),
        alpha: random(0.3, 0.8),
        color: this._randomColor(),
        life: 1,
        decay: random(0.001, 0.005),
      });
    }
  }

  _randomColor() {
    const colors = [
      '255, 215, 0',    // gold
      '255, 107, 157',  // pink
      '195, 177, 225',  // lavender
      '106, 13, 173',   // purple
      '74, 144, 217',   // blue
      '232, 168, 124',  // rose gold
    ];
    return colors[Math.floor(random(0, colors.length))];
  }

  start() {
    this.initStars();
    this.addRisingParticles(40);
    this._loop();
  }

  _loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw stars
    for (const star of this.stars) {
      star.twinklePhase += star.twinkleSpeed;
      const alpha = star.alpha * (0.5 + 0.5 * Math.sin(star.twinklePhase));
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(240, 230, 255, ${alpha})`;
      this.ctx.fill();
    }

    // Draw & update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.alpha * p.life})`;
      this.ctx.fill();

      // Glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      grad.addColorStop(0, `rgba(${p.color}, ${0.2 * p.life})`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);
      this.ctx.fillStyle = grad;
      this.ctx.fill();
    }

    // Replenish particles
    if (this.particles.length < 30) {
      this.addRisingParticles(5);
    }

    this.animationId = requestAnimationFrame(() => this._loop());
  }

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this._onResize);
  }
}
