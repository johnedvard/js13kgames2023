import { mouseIsDown, mousePosScreen } from 'littlejsengine/build/littlejs.esm.min';
export const mousePoints = [];
const maxDraws = 6;

function removeMouseDraggings() {
  for (let i = mousePoints.length - 1; i >= 0; i--) {
    if (mousePoints[i].draws <= 0) {
      mousePoints.splice(i, 1);
    }
  }
}

export function drawTouchLine(ctx) {
  if (!mousePoints.length) return;
  // cleanup leftover mouse points
  if (!mouseIsDown(0)) {
    mousePoints[0].draws--;
  }

  ctx.strokeStyle = 'white';
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
  if (!mouseIsDown(0)) return;
  const pos = mousePosScreen;

  mousePoints.splice(mousePoints.length, 0, {
    x: pos.x,
    y: pos.y,
    draws: maxDraws,
  }); // add to start of queue
}
