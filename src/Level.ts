import { vec2, canvasFixedSize } from 'littlejsengine/build/littlejs.esm.min';

import { Arrow } from './Arrow';
import { Lantern } from './Lantern';
import { MySvg } from './MySvg';

export class Level {
  arrows: Arrow[] = [];
  lanterns: Lantern[] = [];
  bamboos: MySvg[] = [];

  constructor() {
    // for (let i = 0; i < 5; i++) {
    //   this.arrows.push(new Arrow(vec2(i * 10 + Math.random() * 900, i * (10 + Math.random() * -100))));
    // }
    for (let i = 0; i < 2; i++) {
      this.lanterns.push(new Lantern(vec2(i * 146, canvasFixedSize.y + i * 14)));
    }
  }
  update() {
    this.arrows.forEach((s) => s.update());
    this.lanterns.forEach((s) => s.update());
    this.bamboos.forEach((s) => s.update());
  }
  render(ctx) {
    this.arrows.forEach((s) => s.render(ctx));
    this.lanterns.forEach((s) => s.render(ctx));
    this.bamboos.forEach((s) => s.render(ctx));
  }
}
