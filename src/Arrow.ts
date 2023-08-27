import { vec2, timeDelta } from 'littlejsengine/build/littlejs.esm.min';

import { MySvg } from './MySvg';
import { pink, yellow } from './colors';
import { arrowFeatherPath, arrowFlamePath, arrowPath } from './svgPaths';
import { handleSvgCollisions } from './handleSvgCollisions';
import { Cmd } from './types/Cmd';

export class Arrow {
  arrowFlameSvg = new MySvg(arrowFlamePath, null, null, yellow, vec2(0, 180));
  arrowSvg = new MySvg(arrowPath, null, null, 'white', vec2(30, 14));
  arrowFeatherSvg = new MySvg(arrowFeatherPath, null, null, yellow, vec2(20, 0));
  maxTipX: number;
  minTipX: number;
  ellapsedTime: number = 0;
  constructor(startPos = vec2(0, 0), vel = vec2(0, -1)) {
    this.getSvgs().forEach((s) => {
      s.setPos(vec2(s.pos.x + startPos.x, s.pos.y + startPos.y));
      s.setScale(0.5);
      s.setGravityScale(0);
      s.velocity = vel;
    });

    this.minTipX = this.arrowFlameSvg.cmds[2].x - 2;
    this.maxTipX = this.arrowFlameSvg.cmds[2].x + 2;
  }
  render(ctx) {
    // this.debugPoint(ctx, this.arrowFlameSvg.cmds[2]);
    this.getSvgs().forEach((s) => s.render(ctx));
  }
  update() {
    this.getSvgs().forEach((s) => s.update());
    if (this.arrowFeatherSvg.isCut()) {
      this.arrowFeatherSvg.children[0].fill = yellow;
      this.arrowFeatherSvg.children[1].fill = pink;
      this.arrowFeatherSvg.children[0].velocity.x = 2;
      this.arrowFeatherSvg.children[1].velocity.x = -2;
      this.arrowFeatherSvg.children[0].setGravityScale(15);
      this.arrowFeatherSvg.children[1].setGravityScale(10);
    }
    if (this.arrowSvg.isCut()) {
      this.arrowFlameSvg.setScale(0.93);
      this.arrowFlameSvg.setPos(vec2(this.arrowFlameSvg.pos.x + 5, this.arrowFlameSvg.pos.y + 16));
      const c1 = this.arrowSvg.children[0];
      const c2 = this.arrowSvg.children[1];
      c1.setPos(vec2(c1.pos.x - 1, c1.pos.y - 2));
      c2.setPos(vec2(c2.pos.x + 1, c2.pos.y - 2));
      c2.rotateSvg(3);
      c1.rotateSvg(-3);
      c2.setScale(0.95);
      c1.setScale(0.95);
    }
    this.updateFlameAnim();
    handleSvgCollisions(this.arrowFeatherSvg, 0.1);
    handleSvgCollisions(this.arrowSvg, 0.1);
  }

  updateFlameAnim() {
    this.ellapsedTime += timeDelta;
    // flameTip.x1 -= 0.1;
    // flameTip.y1 -= 0.4;
  }

  debugPoint(ctx, c: Cmd) {
    ctx.save();
    ctx.fillStyle = 'green';
    ctx.moveTo(c.x, c.y);
    ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI); // startpoint
    ctx.fill();
    ctx.restore();
  }

  getSvgs() {
    return [this.arrowFeatherSvg, this.arrowSvg, this.arrowFlameSvg];
  }
}
