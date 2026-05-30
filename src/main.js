/* ═══════════════════════════════════════════════════
   MAIN — App entry point & page navigation
   ═══════════════════════════════════════════════════ */

import './styles/global.css';
import './styles/intro.css';
import './styles/message.css';
import './styles/cake.css';

import { initIntro } from './pages/intro.js';
import { initMessage } from './pages/message.js';
import { initCake } from './pages/cake.js';

// Page state
let currentPage = 0;
let maxVisitedPage = 0;
const pageElements = [];
const pageControllers = [];

function init() {
  // Get page containers
  pageElements.push(document.getElementById('page-intro'));
  pageElements.push(document.getElementById('page-message'));
  pageElements.push(document.getElementById('page-cake'));

  // Initialize page indicator (hidden initially)
  initPageIndicator();

  // Initialize all pages
  pageControllers.push(initIntro(pageElements[0], navigateTo));
  pageControllers.push(initMessage(pageElements[1], navigateTo));
  pageControllers.push(initCake(pageElements[2], navigateTo));
}

function initPageIndicator() {
  const indicator = document.getElementById('page-indicator');
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      // Only allow going to visited pages or the next one
      if (i <= maxVisitedPage) {
        navigateTo(i);
      }
    });
    indicator.appendChild(dot);
  }
}

function navigateTo(pageIndex) {
  if (pageIndex === currentPage || pageIndex < 0 || pageIndex > 2) return;

  const oldPage = pageElements[currentPage];
  const newPage = pageElements[pageIndex];

  // Animate out
  oldPage.classList.add('exiting');
  oldPage.classList.remove('active');

  // Animate in
  setTimeout(() => {
    newPage.classList.add('active');
    oldPage.classList.remove('exiting');

    // Trigger page enter
    const controller = pageControllers[pageIndex];
    if (controller && controller.enter) {
      controller.enter();
    }

    currentPage = pageIndex;
    if (pageIndex > maxVisitedPage) {
      maxVisitedPage = pageIndex;
    }
    updateIndicator();

    // Show indicator after first navigation
    document.getElementById('page-indicator').classList.add('visible');
  }, 600);
}

function updateIndicator() {
  const dots = document.querySelectorAll('#page-indicator .dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentPage);
  });
}

// Boot
document.addEventListener('DOMContentLoaded', init);
