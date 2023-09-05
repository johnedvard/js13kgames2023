import { canvasFixedSize, timeDelta } from './littlejs';

import { lightBlack } from './colors';
import { on } from './gameEvents';

let currentBgScroll = 900; // padding + rect height + num rectangles/2
const maxBgScroll = 900;
const rectangles = 20;
const bgPadding = 130;
const minScrollSpeed = 35;
const maxScrollSpeed = 180;
let currentScrollSpeed = 23;

export function listenForSplitEvents() {
  const onSplit = (_evt) => {
    console.log('on split in bg scroll', currentScrollSpeed);
    currentScrollSpeed += 35;
    if (currentScrollSpeed >= maxScrollSpeed) currentScrollSpeed = maxScrollSpeed;
  };
  on('split', onSplit);
}

export function renderBackgroundScroll(ctx) {
  currentBgScroll = (currentBgScroll + timeDelta * currentScrollSpeed) % maxBgScroll;
  currentScrollSpeed -= timeDelta * 30;
  if (currentScrollSpeed <= minScrollSpeed) currentScrollSpeed = minScrollSpeed;

  ctx.save();
  ctx.fillStyle = lightBlack;
  for (let i = -10; i < rectangles; i++) {
    const posY = currentBgScroll + i * bgPadding;
    ctx.fillRect(-10, posY, canvasFixedSize.x + 20, 30);
  }
  ctx.restore();
}

listenForSplitEvents();
