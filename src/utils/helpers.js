/* ═══════════════════════════════════════════════════
   UTILITY HELPERS
   ═══════════════════════════════════════════════════ */

/**
 * Random number between min and max
 */
export function random(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Random integer between min and max (inclusive)
 */
export function randomInt(min, max) {
  return Math.floor(random(min, max + 1));
}

/**
 * Pick a random element from an array
 */
export function pick(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

/**
 * Delay / sleep promise
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clamp a value between min and max
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Map value from one range to another
 */
export function mapRange(val, inMin, inMax, outMin, outMax) {
  return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Easing functions
 */
export const ease = {
  inOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  outBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  outElastic: t => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
  },
  inOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
};

/**
 * Create a DOM element with attributes
 */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') el.className = val;
    else if (key === 'textContent') el.textContent = val;
    else if (key === 'innerHTML') el.innerHTML = val;
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
    else if (key === 'style' && typeof val === 'object') {
      Object.assign(el.style, val);
    }
    else el.setAttribute(key, val);
  }
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  });
  return el;
}

/**
 * Check if device is mobile
 */
export function isMobile() {
  return window.innerWidth <= 768 || ('ontouchstart' in window);
}

/**
 * Get device pixel ratio (capped)
 */
export function getDPR() {
  return Math.min(window.devicePixelRatio || 1, 2);
}
