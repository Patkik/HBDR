/* ═══════════════════════════════════════════════════
   PAGE 1 — INTRO (Genshin-style cinematic + ragebait)
   ═══════════════════════════════════════════════════ */

import { delay, random, clamp, pick, createElement, isMobile } from '../utils/helpers.js';
import { ParticleSystem } from '../animations/particles.js';

const TAUNTS = [
  "Too slow! 😜",
  "Can't catch me~! 💨",
  "Nope! Try again! 🤭",
  "Almost! ...not really 😂",
  "Are you even trying? 🫣",
  "Hehe~ over here! ✨",
  "You thought?? 💀",
  "Sike!! 🏃‍♀️💨",
  "Nice try, Reign! 😏",
  "Keep dreaming~ 🌙",
  "L + too slow 😎",
  "Skill issue fr fr 💅",
  "LMAOOO 🤣",
  "This is embarrassing for you 😬",
  "My grandma moves faster 👵",
  "Imagine being this slow 🐌",
  "Bro is lagging irl 📶",
];

const BTN_TEXTS = [
  "🎁 Click for your gift!",
  "🎁 Okay fine, click me!",
  "🎁 I'll stay still now!",
  "🎁 For real this time!",
  "🎁 I promise! Click!",
  "🎁 ...okay maybe not",
  "🎁 Last time, for real!",
  "🎁 Trust me bro 🤝",
];

export function initIntro(container, onNavigate) {
  let attempts = 0;
  let caught = false;
  let particles = null;
  let btnTextIndex = 0;

  // === BUILD DOM ===
  const particleCanvas = createElement('canvas', { className: 'intro-particles canvas-layer' });
  const lightRays = createElement('div', { className: 'intro-light-rays' });
  const orb = createElement('div', { className: 'intro-orb' });

  const titleContainer = createElement('div', { className: 'intro-title-container' }, [
    createElement('div', { className: 'intro-subtitle', textContent: '✦ A SPECIAL CELEBRATION ✦' }),
    createElement('h1', { className: 'intro-title', textContent: 'Happy Birthday' }),
    createElement('div', { className: 'intro-year', textContent: '— 2026 —' }),
  ]);

  const attemptCounter = createElement('div', {
    className: 'attempt-counter',
    textContent: 'Attempts: 0',
  });

  const ragebaitContainer = createElement('div', { className: 'ragebait-container' });
  const ragebaitBtn = createElement('button', {
    className: 'ragebait-btn',
    textContent: '🎁 Click for your gift!',
  });
  ragebaitContainer.appendChild(ragebaitBtn);

  const continueBtn = createElement('button', {
    className: 'intro-continue-btn fantasy-btn',
    textContent: '✨ Continue to your message ✨',
    onClick: () => onNavigate(1),
  });

  container.append(particleCanvas, lightRays, orb, titleContainer, attemptCounter, ragebaitContainer, continueBtn);

  // === RAGEBAIT LOGIC ===
  function getContainerBounds() {
    const btnRect = ragebaitBtn.getBoundingClientRect();
    return {
      minX: 30,
      maxX: window.innerWidth - btnRect.width - 30,
      minY: window.innerHeight * 0.45,
      maxY: window.innerHeight - btnRect.height - 80,
    };
  }

  function dodgeButton(e) {
    if (caught) return;

    attempts++;
    attemptCounter.textContent = `Attempts: ${attempts}`;
    attemptCounter.classList.add('visible');

    // Update button text periodically
    if (attempts % 3 === 0 && btnTextIndex < BTN_TEXTS.length - 1) {
      btnTextIndex++;
      ragebaitBtn.textContent = BTN_TEXTS[btnTextIndex];
    }

    // Show taunt
    showTaunt(e);

    // Move button to random position
    const bounds = getContainerBounds();
    const newX = random(bounds.minX, bounds.maxX);
    const newY = random(bounds.minY, bounds.maxY);

    ragebaitBtn.style.left = newX + 'px';
    ragebaitBtn.style.top = newY + 'px';

    // After many attempts, let them catch it
    if (attempts >= 12) {
      catchButton();
    }
  }

  function showTaunt(e) {
    const taunt = createElement('div', {
      className: 'ragebait-taunt',
      textContent: pick(TAUNTS),
      style: {
        left: (e?.clientX || random(100, window.innerWidth - 200)) + 'px',
        top: (e?.clientY || random(200, window.innerHeight - 200)) - 30 + 'px',
      }
    });
    container.appendChild(taunt);
    requestAnimationFrame(() => taunt.classList.add('visible'));
    setTimeout(() => taunt.remove(), 1500);
  }

  function catchButton() {
    caught = true;
    ragebaitBtn.textContent = '🎁 Fine, you win! Click me! 🎉';
    ragebaitBtn.classList.add('caught');
    ragebaitBtn.style.left = '50%';
    ragebaitBtn.style.top = '50%';
    ragebaitBtn.style.transform = 'translate(-50%, -50%)';

    ragebaitBtn.removeEventListener('mouseenter', dodgeButton);
    ragebaitBtn.removeEventListener('touchstart', dodgeButton);
    ragebaitBtn.addEventListener('click', revealContinue);
  }

  function revealContinue() {
    ragebaitContainer.style.opacity = '0';
    ragebaitContainer.style.pointerEvents = 'none';
    attemptCounter.style.opacity = '0';

    setTimeout(() => {
      continueBtn.classList.add('visible');
    }, 500);
  }

  // Attach dodge events
  if (isMobile()) {
    ragebaitBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeButton(e.touches[0]);
    }, { passive: false });
  } else {
    ragebaitBtn.addEventListener('mouseenter', dodgeButton);
  }

  // Also handle click on mobile as backup dodge
  ragebaitBtn.addEventListener('click', (e) => {
    if (!caught) {
      dodgeButton(e);
    }
  });

  // === CINEMATIC SEQUENCE ===
  async function startSequence() {
    // Start particles
    particles = new ParticleSystem(particleCanvas);
    particles.start();

    await delay(800);
    lightRays.classList.add('visible');

    await delay(1000);
    orb.classList.add('visible');

    await delay(1500);
    titleContainer.classList.add('visible');

    await delay(2000);
    ragebaitContainer.classList.add('visible');
  }

  startSequence();

  return {
    destroy() {
      if (particles) particles.stop();
    }
  };
}
