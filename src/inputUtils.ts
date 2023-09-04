import { mouseIsDown, mousePosScreen, Sound, mouseWasPressed, Music } from './littlejs';

import { darkPink, lightBlue } from './colors';
import { lightSaberDrawSfx, haloSaberDrawSfx } from './music';

export const mousePoints = [];
export const maxDraws = 6;
let selectedDrawColor = 'white';
let equippedDrawColor = 'white';
let isUseSelectedColor = false; // swap between selected and equipped
let lightSaberDrawSound = new Sound(lightSaberDrawSfx);
let haloSaberDrawSound = new Sound(haloSaberDrawSfx);
let selectedDrawSound: Sound;
let equippedDrawSound: Sound;
let music: Music;
let hasInteracted = false;

function removeMouseDraggings() {
  for (let i = mousePoints.length - 1; i >= 0; i--) {
    if (mousePoints[i].draws <= 0) {
      mousePoints.splice(i, 1);
    }
  }
}

function getColorToDraw() {
  if (isUseSelectedColor) return selectedDrawColor;
  return equippedDrawColor;
}

function getDrawSound() {
  if (isUseSelectedColor) return selectedDrawSound;
  return equippedDrawSound;
}

export function drawTouchLine(ctx) {
  if (!mousePoints.length) return;

  // cleanup leftover mouse points
  if (!mouseIsDown(0)) {
    mousePoints[0].draws--;
  }

  ctx.strokeStyle = getColorToDraw();
  const drawSound = getDrawSound();
  if (drawSound) {
    drawSound.play();
  }
  for (let i = 0; i < mousePoints.length - 1; i++) {
    const prev = mousePoints[i];
    const next = mousePoints[i + 1];
    if (prev.draws > 0 && next.draws > 0) {
      ctx.lineWidth = prev.draws * 2;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
    prev.draws--;
  }
  removeMouseDraggings();
}

export function updateMouseControls() {
  if (mouseWasPressed() || mouseIsDown(0)) {
    hasInteracted = true;
    // playMusic();
  }
  if (!mouseIsDown(0)) return;
  const pos = mousePosScreen;

  mousePoints.splice(mousePoints.length, 0, {
    x: pos.x,
    y: pos.y,
    draws: maxDraws,
  }); // add to start of queue
}

export function setIsUseSelectedColor(value: boolean) {
  isUseSelectedColor = value;
}
export function setSelectedDragColor(color: string) {
  selectedDrawColor = color;
  selectedDrawSound = getDrawSoundFromColor(color);
}
export function setEquippedDragColor(color: string) {
  equippedDrawColor = color;
  equippedDrawSound = getDrawSoundFromColor(color);
}
export function hasClicked() {
  return hasInteracted;
}
export function setCurrentMusic(newMusic: Music) {
  music = newMusic;
}

// function playMusic() {
//   if (music && !music.isPlaying()) {
//     music.play();
//   }
// }
function getDrawSoundFromColor(color: string) {
  switch (color) {
    case lightBlue:
      return lightSaberDrawSound;
    case darkPink:
      return haloSaberDrawSound;
    default:
      return null;
  }
}
