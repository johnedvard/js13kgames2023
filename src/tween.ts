import { vec2, timeDelta } from 'littlejsengine/build/littlejs.esm.min';

import { MySvg } from './MySvg';
import { smoothstep } from './smoothstep';

export function tween(svg: MySvg, from: vec2, to: vec2, duration: number) {
  let ellapsedTime = 0;
  svg.setPos(vec2(from.x, from.y));
  const onTick = () => {
    ellapsedTime += timeDelta;
    const ratio = ellapsedTime / duration;
    const x = smoothstep(from.x, to.x, ratio);
    const y = smoothstep(from.y, to.y, ratio);
    svg.setPos(vec2(x, y));
    if (ellapsedTime >= duration) {
      window.removeEventListener('tick', onTick);
    }
  };
  window.addEventListener('tick', onTick);
}
