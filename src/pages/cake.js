/* ═══════════════════════════════════════════════════
   PAGE 3 — BIRTHDAY CAKE (Interactive candles)
   ═══════════════════════════════════════════════════ */

import { delay, random, createElement } from '../utils/helpers.js';
import { ConfettiSystem } from '../animations/confetti.js';
import { playYipeee } from '../utils/audio.js';

export function initCake(container, onNavigate) {
  let confetti = null;
  let blown = false;

  // === BUILD DOM ===
  const confettiCanvas = createElement('canvas', { className: 'confetti-canvas canvas-layer' });
  const cakeAmbient = createElement('div', { className: 'cake-ambient' });

  // Title
  const cakeTitle = createElement('h2', {
    className: 'cake-title',
    innerHTML: '🎂 Make a Wish! 🎂',
  });

  // Build cake structure
  const cakeScene = createElement('div', { className: 'cake-scene' });

  // Candles
  const candlesEl = createElement('div', { className: 'candles' });
  const numCandles = 5;
  const flames = [];

  for (let i = 0; i < numCandles; i++) {
    const flame = createElement('div', { className: 'flame' });
    const flameGlow = createElement('div', { className: 'flame-glow' });
    flames.push({ flame, flameGlow });

    const stripes = [];
    for (let s = 0; s < 3; s++) {
      stripes.push(createElement('div', { className: 'candle-stripe' }));
    }

    const candle = createElement('div', { className: 'candle' }, [
      createElement('div', { className: 'flame-container' }, [flame, flameGlow]),
      createElement('div', { className: 'candle-stick' }, stripes),
    ]);
    candlesEl.appendChild(candle);
  }

  // Cake tiers
  const tierTop = createElement('div', { className: 'cake-tier tier-top' }, [
    createFrosting(6),
    createDecorations(['✨', '⭐', '💫'], 3),
  ]);

  const tierMiddle = createElement('div', { className: 'cake-tier tier-middle' }, [
    createFrosting(8),
    createDecorations(['🌸', '🌺', '💖'], 4),
  ]);

  const tierBottom = createElement('div', { className: 'cake-tier tier-bottom' }, [
    createFrosting(10),
    createDecorations(['🎀', '🦋', '🌙'], 5),
  ]);

  const cakePlate = createElement('div', { className: 'cake-plate' });

  const cake = createElement('div', { className: 'cake' }, [
    candlesEl, tierTop, tierMiddle, tierBottom, cakePlate,
  ]);

  // Blow instruction
  const blowInstruction = createElement('div', {
    className: 'blow-instruction',
    textContent: '✨ Tap the button to blow out the candles ✨',
  });

  // Blow button
  const blowBtn = createElement('button', {
    className: 'blow-btn',
    textContent: '🌬️',
    onClick: () => blowCandles(),
  });

  // Wish message (hidden initially)
  const wishMessage = createElement('div', { className: 'wish-message' }, [
    createElement('h2', { textContent: 'Happy Birthday!' }),
    createElement('p', { 
      innerHTML: `May all your wishes come true, Reign! ✨<br><br>
      <span style="font-size: 1.1rem; font-style: italic; color: var(--rose-gold); opacity: 0.95;">wishing you the best,<br>— Pat</span>`
    }),
    createElement('span', { className: 'wish-emoji', textContent: '🎉🥳🎊' }),
  ]);

  cakeScene.append(cakeTitle, cake, blowInstruction, blowBtn);
  container.append(confettiCanvas, cakeAmbient, cakeScene, wishMessage);

  // === HELPER: Create frosting drips ===
  function createFrosting(dripCount) {
    const frosting = createElement('div', { className: 'frosting' });
    for (let i = 0; i < dripCount; i++) {
      const drip = createElement('div', {
        className: 'drip',
        style: {
          left: (i / dripCount * 80 + 10) + '%',
          height: random(10, 25) + 'px',
          animationDelay: random(0.5, 2) + 's',
        }
      });
      frosting.appendChild(drip);
    }
    return frosting;
  }

  // === HELPER: Create emoji decorations ===
  function createDecorations(emojis, count) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const deco = createElement('div', {
        className: 'cake-decoration',
        textContent: emojis[i % emojis.length],
        style: {
          left: random(10, 85) + '%',
          top: random(20, 70) + '%',
          animationDelay: random(0.5, 2.5) + 's',
        }
      });
      frag.appendChild(deco);
    }
    return frag;
  }

  // === BLOW CANDLES ===
  async function blowCandles() {
    if (blown) return;
    blown = true;

    blowInstruction.classList.add('hidden');
    blowBtn.classList.add('hidden');

    // Blow out flames one by one with slight delay
    for (let i = 0; i < flames.length; i++) {
      await delay(150 + random(0, 100));
      flames[i].flame.classList.add('blown-out');
      flames[i].flameGlow.classList.add('blown-out');
      createSmoke(flames[i].flame);
    }

    await delay(800);

    // Launch confetti & play SFX!
    playYipeee();
    confetti = new ConfettiSystem(confettiCanvas);
    confetti.burst(200);

    await delay(300);
    confetti.burst(100);

    // Show wish message — hide the cake scene
    await delay(500);
    cakeScene.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
    cakeScene.style.opacity = '0';
    cakeScene.style.transform = 'translateY(60px) scale(0.7)';
    cakeScene.style.pointerEvents = 'none';

    await delay(600);
    wishMessage.classList.add('visible');

    // More confetti waves
    await delay(2000);
    confetti.burst(80);
    await delay(3000);
    confetti.burst(50);
  }

  // === SMOKE EFFECT ===
  function createSmoke(flameEl) {
    const rect = flameEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
      const smoke = createElement('div', {
        className: 'smoke',
        style: {
          left: (rect.left - containerRect.left + rect.width / 2) + 'px',
          top: (rect.top - containerRect.top) + 'px',
          '--sx': random(-15, 15) + 'px',
          animation: `smoke-rise ${random(0.8, 1.5)}s ease-out forwards`,
          animationDelay: (i * 0.1) + 's',
        }
      });
      container.appendChild(smoke);
      setTimeout(() => smoke.remove(), 2000);
    }
  }

  // === ENTER ===
  let started = false;

  function startSequence() {
    if (started) return;
    started = true;

    cakeAmbient.classList.add('visible');

    setTimeout(() => {
      cakeScene.classList.add('visible');
    }, 300);

    setTimeout(() => {
      cakeTitle.classList.add('visible');
    }, 800);

    setTimeout(() => {
      blowInstruction.classList.add('visible');
    }, 1500);

    setTimeout(() => {
      blowBtn.classList.add('visible');
    }, 1800);
  }

  return {
    enter() {
      startSequence();
    },
    destroy() {
      if (confetti) confetti.stop();
    }
  };
}
