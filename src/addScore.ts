import { MySvg } from './MySvg';
import { off, on } from './gameEvents';
import { vec2, timeDelta, overlayContext } from './littlejs';
import { smoothstep } from './smoothstep';

export function addScore(svg: MySvg, point: vec2) {
  startScoreRoutine(svg, point);
}

function startScoreRoutine(svg: MySvg, point: vec2) {
  const to = vec2(0, 0);
  const duration = 1;
  let ellapsedTime = 0;
  let from: vec2 = point.copy();

  // TODO (johnedvard) maybe use tween instead
  const onTick = () => {
    ellapsedTime += timeDelta;
    const ratio = ellapsedTime / duration;
    const x = smoothstep(from.x, to.x, ratio);
    const y = smoothstep(from.y, to.y, ratio);
    overlayContext.save();
    overlayContext.font = '48px serif';
    overlayContext.fillStyle = svg.fill || 'white';
    overlayContext.fillText('10', x, y);
    overlayContext.restore();
    if (ellapsedTime >= duration) {
      off('tick', onTick);
    }
  };
  on('tick', onTick);
}
