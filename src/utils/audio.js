/* ═══════════════════════════════════════════════════
   GLOBAL AUDIO MANAGER
   ═══════════════════════════════════════════════════ */

import bdaySongUrl from '../music/bday-song.mp3';
import thirdPageSongUrl from '../music/3rdPageSound.mp3';
import laughUrl from '../music/laugh.mp3';
import yipeeeUrl from '../music/yipeee.mp3';

// Initialize audio elements with loop options and preloading
const bdaySong = new Audio(bdaySongUrl);
bdaySong.loop = true;
bdaySong.volume = 0.55;
bdaySong.preload = 'auto';

const thirdPageSong = new Audio(thirdPageSongUrl);
thirdPageSong.loop = true;
thirdPageSong.volume = 0.55;
thirdPageSong.preload = 'auto';

const laughSfx = new Audio(laughUrl);
laughSfx.volume = 0.6;
laughSfx.preload = 'auto';

const yipeeeSfx = new Audio(yipeeeUrl);
yipeeeSfx.volume = 0.7;
yipeeeSfx.preload = 'auto';

// Global playback states
let isPlaying = false;
let currentTrack = bdaySong;
let audioContextStarted = false;
let onStateChangeCallback = null;

/**
 * Handle browser autoplay restrictions by starting background music on first user click/touch
 */
export function initAutoplay(onStateChange) {
  onStateChangeCallback = onStateChange;

  const startAutoplay = () => {
    if (audioContextStarted) return;
    audioContextStarted = true;

    // Determine current active track based on page state
    const currentActivePage = getCurrentPage();
    if (currentActivePage === 2) {
      currentTrack = thirdPageSong;
    } else {
      currentTrack = bdaySong;
    }

    // Attempt to play the current active track
    isPlaying = true;
    currentTrack.play()
      .then(() => {
        if (onStateChangeCallback) onStateChangeCallback(true);
      })
      .catch(err => {
        console.log('Autoplay play blocked: ', err);
        isPlaying = false;
        if (onStateChangeCallback) onStateChangeCallback(false);
      });

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
 * Toggle background music play/pause state
 */
export function toggleMusic() {
  audioContextStarted = true; // User interacted directly

  if (isPlaying) {
    currentTrack.pause();
    isPlaying = false;
    if (onStateChangeCallback) onStateChangeCallback(false);
  } else {
    isPlaying = true;
    currentTrack.play()
      .then(() => {
        if (onStateChangeCallback) onStateChangeCallback(true);
      })
      .catch(err => {
        console.log('Toggle play failed: ', err);
        isPlaying = false;
        if (onStateChangeCallback) onStateChangeCallback(false);
      });
  }
  return isPlaying;
}

/**
 * Check if music is currently playing
 */
export function isMusicPlaying() {
  return isPlaying;
}

/**
 * Play Birthday Song (Page 1 & 2 background)
 */
export function playBdaySong() {
  const previousTrack = currentTrack;
  currentTrack = bdaySong;

  if (previousTrack !== currentTrack) {
    previousTrack.pause();
  }

  if (isPlaying) {
    bdaySong.play().catch(err => {
      console.log('Transition to bdaySong failed: ', err);
    });
  }
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
  const previousTrack = currentTrack;
  currentTrack = thirdPageSong;

  if (previousTrack !== currentTrack) {
    previousTrack.pause();
  }

  if (isPlaying) {
    thirdPageSong.play().catch(err => {
      console.log('Transition to thirdPageSong failed: ', err);
    });
  }
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
