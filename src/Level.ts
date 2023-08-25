import { vec2, canvasFixedSize, Music, timeDelta } from 'littlejsengine/build/littlejs.esm.min';

import { Arrow } from './Arrow';
import { Lantern } from './Lantern';
import { MySvg } from './MySvg';
import { song } from './music';

export class Level {
  arrows: Arrow[] = [];
  lanterns: Lantern[] = [];
  bamboos: MySvg[] = [];
  music: Music;
  ellapsedPlayTime = 0;
  bpm = 120;
  bps = this.bpm / 60;
  constructor() {
    this.music = new Music(song);
    console.log('bps', this.bps);
    // for (let i = 0; i < 5; i++) {
    //   this.arrows.push(new Arrow(vec2(i * 10 + Math.random() * 900, i * (10 + Math.random() * -100))));
    // }
    for (let i = 0; i < 2; i++) {
      this.lanterns.push(new Lantern(vec2(i * 146, canvasFixedSize.y - 100)));
    }
  }
  update() {
    this.arrows.forEach((s) => s.update());
    this.lanterns.forEach((s) => s.update());
    this.bamboos.forEach((s) => s.update());

    if (this.music.isPlaying()) {
      this.ellapsedPlayTime += timeDelta;
    }
  }
  render(ctx) {
    this.arrows.forEach((s) => s.render(ctx));
    this.lanterns.forEach((s) => s.render(ctx));
    this.bamboos.forEach((s) => s.render(ctx));
    this.renderTimeCircle(ctx, 0.5, 3.5, this.lanterns[0].getCenterPos());
    this.renderTimeCircle(ctx, 1, 4, this.lanterns[1].getCenterPos());
  }
  renderTimeCircle(ctx, startTimeStamp: number, duration: number, centerPos: vec2) {
    if (this.ellapsedPlayTime < startTimeStamp) return;
    const durationLeft = duration - this.ellapsedPlayTime - startTimeStamp;
    if (durationLeft <= 0) return;

    const ratio = cubicSmoothstep(durationLeft / duration);
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.beginPath();

    const outerRadius = 200 * ratio;
    const innerRadius = 180 * ratio;
    ctx.moveTo(centerPos.x, centerPos.y);
    ctx.arc(centerPos.x, centerPos.y, outerRadius, 0, Math.PI * 2, false); // outer (filled)
    ctx.arc(centerPos.x, centerPos.y, innerRadius, 0, Math.PI * 2, true); // outer (unfills it)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  start() {
    this.music.play();
  }
}

function cubicSmoothstep(t) {
  // Define control points for a cubic Bezier curve that resembles smoothstep
  const p0 = 0;
  const p1 = 0;
  const p2 = 1;
  const p3 = 1;

  // Calculate the cubic Bezier lerp at parameter t
  const result = (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3;

  return result;
}
