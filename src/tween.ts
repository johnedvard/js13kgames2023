import { vec2, timeDelta } from 'littlejsengine/build/littlejs.esm.min';

import { MySvg } from './MySvg';
import { smoothstep } from './smoothstep';
import { off, on } from './gameEvents';

export function tween(svgs: MySvg[], from: vec2, to: vec2, duration: number) {
  let ellapsedTime = 0;
  svgs.forEach((svg) => svg.setPos(vec2(from.x, from.y)));
  const onTick = () => {
    ellapsedTime += timeDelta;
    const ratio = ellapsedTime / duration;
    const x = smoothstep(from.x, to.x, ratio);
    const y = smoothstep(from.y, to.y, ratio);
    svgs.forEach((svg) => svg.setPos(vec2(x, y)));
    if (ellapsedTime >= duration) {
      off('tick', onTick);
    }
  };
  on('tick', onTick);
}
