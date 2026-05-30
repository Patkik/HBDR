/* ═══════════════════════════════════════════════════
   PAGE 2 — MESSAGE (Fantasy flower bloom)
   ═══════════════════════════════════════════════════ */

import { delay, random, createElement } from '../utils/helpers.js';
import { FlowerBloom } from '../animations/flowers.js';

export function initMessage(container, onNavigate) {
  let flowerBloom = null;

  // === BUILD DOM ===
  const bloomCanvas = createElement('canvas', { className: 'bloom-canvas canvas-layer' });
  const bloomAmbient = createElement('div', { className: 'bloom-ambient' });

  // Fireflies
  const fireflyContainer = document.createDocumentFragment();
  for (let i = 0; i < 20; i++) {
    const firefly = createElement('div', {
      className: 'firefly',
      style: {
        left: random(5, 95) + '%',
        top: random(5, 95) + '%',
        animationDelay: random(0, 8) + 's',
        animationDuration: random(6, 12) + 's',
        '--fx': random(-60, 60) + 'px',
        '--fy': random(-100, -30) + 'px',
        '--fx2': random(-40, 40) + 'px',
        '--fy2': random(-140, -60) + 'px',
      }
    });
    fireflyContainer.appendChild(firefly);
  }

  // Message
  const messageWrapper = createElement('div', { className: 'message-wrapper' }, [
    createElement('div', { className: 'message-crown', textContent: '👑' }),
    createElement('h2', { className: 'message-name', textContent: 'Dear Reign,' }),
    createElement('hr', { className: 'message-divider' }),
    createElement('p', {
      className: 'message-text',
      innerHTML: `In this special day, I want you to <span class="highlight">fully appreciate yourself</span>. 
      You've worked so hard in being on this world today. 
      This is all I can do for now to show how much I <span class="highlight">appreciate you</span>. 
      I'm really grateful for you! <span class="heart">❤️</span><br><br>
      <span class="highlight">Thank you for existing!</span>`,
    }),
    createElement('div', {
      className: 'message-signature',
      innerHTML: '— with all my heart ✨',
    }),
  ]);

  // Continue arrow
  const continueArrow = createElement('div', {
    className: 'message-continue',
    onClick: () => onNavigate(2),
  }, [
    createElement('span', { className: 'arrow', textContent: '▼' }),
  ]);

  container.append(bloomCanvas, bloomAmbient, fireflyContainer, messageWrapper, continueArrow);

  // === ANIMATION SEQUENCE ===
  let started = false;

  function startSequence() {
    if (started) return;
    started = true;

    // Start flower bloom
    flowerBloom = new FlowerBloom(bloomCanvas);
    bloomAmbient.classList.add('visible');

    flowerBloom.startBloom(async () => {
      // Flower is fully bloomed, reveal message
      await delay(500);
      messageWrapper.classList.add('visible');

      await delay(300);
      messageWrapper.querySelector('.message-divider').classList.add('visible');

      await delay(400);
      messageWrapper.querySelector('.message-text').classList.add('visible');

      await delay(800);
      messageWrapper.querySelector('.message-signature').classList.add('visible');

      await delay(1000);
      continueArrow.classList.add('visible');
    });
  }

  return {
    enter() {
      startSequence();
    },
    destroy() {
      if (flowerBloom) flowerBloom.stop();
    }
  };
}
