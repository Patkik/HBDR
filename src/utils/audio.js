/* ═══════════════════════════════════════════════════
   GLOBAL AUDIO MANAGER
   ═══════════════════════════════════════════════════ */

import bdaySongUrl from '../music/bday-song.mp3';
import thirdPageSongUrl from '../music/3rdPageSound.mp3';
import laughUrl from '../music/laugh.mp3';
import yipeeeUrl from '../music/yipeee.mp3';

// Initialize audio elements with loop options
const bdaySong = new Audio(bdaySongUrl);
bdaySong.loop = true;
bdaySong.volume = 0.5; // Moderate volume

const thirdPageSong = new Audio(thirdPageSongUrl);
thirdPageSong.loop = true;
thirdPageSong.volume = 0.5;

const laughSfx = new Audio(laughUrl);
laughSfx.volume = 0.6;

const yipeeeSfx = new Audio(yipeeeUrl);
yipeeeSfx.volume = 0.7;

let audioContextStarted = false;

/**
 * Handle browser autoplay restrictions by starting background music on first user click/touch
 */
export function initAutoplay() {
  const startAutoplay = () => {
    if (audioContextStarted) return;
    audioContextStarted = true;

    // Only play background song if we are on page 1 or 2
    const currentActivePage = getCurrentPage();
    if (currentActivePage === 0 || currentActivePage === 1) {
      playBdaySong();
    } else if (currentActivePage === 2) {
      play3rdPageSong();
    }

    // Remove event listeners once started
    document.removeEventListener('click', startAutoplay);
    document.removeEventListener('touchstart', startAutoplay);
  };

  document.addEventListener('click', startAutoplay);
  document.addEventListener('touchstart', startAutoplay);
}

/**
 * Helper to get current page index from DOM state
 */
function getCurrentPage() {
  const pages = document.querySelectorAll('.page');
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].classList.contains('active')) {
      return i;
    }
  }
  return 0;
}

/**
 * Play Birthday Song (Page 1 & 2 background)
 */
export function playBdaySong() {
  thirdPageSong.pause();
  bdaySong.play().catch(err => {
    console.log('Autoplay blocked playBdaySong: ', err);
  });
}

/**
 * Pause Birthday Song
 */
export function pauseBdaySong() {
  bdaySong.pause();
}

/**
 * Play 3rd Page Song (Page 3 background)
 */
export function play3rdPageSong() {
  bdaySong.pause();
  thirdPageSong.play().catch(err => {
    console.log('Autoplay blocked play3rdPageSong: ', err);
  });
}

/**
 * Pause 3rd Page Song
 */
export function pause3rdPageSong() {
  thirdPageSong.pause();
}

/**
 * Play Laugh SFX (Silly dodge button click/interaction)
 */
export function playLaugh() {
  // Reset playback to start immediately even if already playing
  laughSfx.currentTime = 0;
  laughSfx.play().catch(err => {
    console.log('Autoplay blocked playLaugh: ', err);
  });
}

/**
 * Play Yipeee SFX (Final blow candles / wish reveal)
 */
export function playYipeee() {
  yipeeeSfx.currentTime = 0;
  yipeeeSfx.play().catch(err => {
    console.log('Autoplay blocked playYipeee: ', err);
  });
}
