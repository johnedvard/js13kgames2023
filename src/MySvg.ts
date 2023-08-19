import { vec2, EngineObject, gravity } from 'littlejsengine/build/littlejs.esm.min';

import { parseSVG } from 'svg-path-parser';

import { makeSvgPathCommandsAbsolute } from './makeSvgPathCommandsAbsolute';
import { Cmd } from './types/Cmd';
import { translateCoordinates } from './translateCoordinates';
import { IntersectionPoint } from './types/IntersectionPoint';
import { createNewSvgs } from './createNewSvgs';
import { splitCubicCurve } from './splitCubicCurve';
import { splitSvgInTwo } from './splitSvgInTwo';

export class MySvg extends EngineObject {
  public path: string;
  public stroke: string;
  public fill: string;
  public pos: vec2;
  public velocity: vec2;
  public cmds: Cmd[];
  public current2DPath: { path?: string; path2D?: Path2D } = {};

  private children: MySvg[] = [];
  private intersectionPoints: IntersectionPoint[] = [];
  // TODO constructor override if we want to use cmd instead of path?
  constructor(
    path: string,
    cmds: Cmd[],
    stroke: string,
    fill: string,
    pos: vec2 = vec2(0, 0),
    velocity: vec2 = vec2(0, 0),
    size: vec2 = vec2(1, 1)
  ) {
    super(pos, size);
    this.pos = pos;
    this.path = path;
    this.stroke = stroke;
    this.fill = fill;
    this.velocity = velocity;
    if (this.path) {
      this.cmds = parseSVG(path);
      makeSvgPathCommandsAbsolute(this.cmds); // Note: mutates the commands in place!
      translateCoordinates(this.cmds, this.pos); // move the svg according to position
    } else if (cmds) {
      this.cmds = [...cmds];
    }
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }

  update() {
    // console.log('pos update: ', this.velocity);
    // console.log('pos update: ', this.pos);
    const prevPos = vec2(this.pos.x, this.pos.y);
    this.velocity.y += gravity;
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
    translateCoordinates(this.cmds, prevPos.subtract(this.pos));
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }
  render(ctx) {
    if (!ctx) return;
    if (this.children.length) {
      this.children.forEach((svg) => svg.render(ctx));
      return;
    }
    ctx.lineWidth = 5;
    ctx.beginPath(); // Start a new path
    ctx.strokeStyle = this.stroke || 'blue';
    ctx.fillStyle = this.fill || 'blue';
    // Only for debugging:
    // this.cmds.forEach((c) => {
    //   if (!c) return;
    //   switch (c.code) {
    //     case 'M':
    //       ctx.moveTo(c.x, c.y);
    //       break;
    //     case 'Z':
    //       ctx.lineTo(c.x, c.y);
    //       break;
    //     case 'C':
    //       const { x0, y0, x1, y1, x2, y2, x, y } = c;
    //       ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
    //       ctx.moveTo(x0, y0);
    //       ctx.arc(x0, y0, 2, 0, 2 * Math.PI); // startpoint
    //       ctx.moveTo(x1, y1);
    //       // ctx.arc(x1, y1, 2, 0, 2 * Math.PI); // controlpoint 1
    //       ctx.moveTo(x2, y2);
    //       // ctx.arc(x2, y2, 2, 0, 2 * Math.PI); // controlpoint 2
    //       ctx.moveTo(x, y);
    //       ctx.arc(x, y, 2, 0, 2 * Math.PI);
    //       break;
    //   }
    //   if (c.command == 'closepath') {
    //     ctx.closePath();
    //   }
    // });
    ctx.fill(this.current2DPath.path2D);
    ctx.stroke(); // Render the path
  }

  addCmds(start, deleteCount, cmds: Cmd[]) {
    translateCoordinates(cmds, this.pos);
    this.cmds.splice(start, deleteCount, ...cmds);
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }

  getIntersectionPoints() {
    return this.intersectionPoints;
  }

  addIntersectionPoint(intersectionPoint: IntersectionPoint) {
    this.intersectionPoints.push(intersectionPoint);
    if (this.intersectionPoints.length == 1) {
      const newSvg1 = new MySvg(null, this.cmds, 'yellow', 'yellow', this.pos.copy());
      // add the intersection point to the existing SVG, splitting the curve
      const p = this.intersectionPoints[0];
      const cmd: Cmd = this.cmds[p.id];
      if (!cmd) return;
      if (cmd.code == 'C') {
        const newCurves2 = splitCubicCurve(cmd, p.intersectionPoint);
        newCurves2[1].isIntersectionPoint = true;

        translateCoordinates(newCurves2, newSvg1.pos.copy().multiply(vec2(-1, -1))); // translate the coordinates back to origin.
        newSvg1.addCmds(p.id, 1, newCurves2);
        this.setCmds(newSvg1.cmds);
      }
    }

    if (this.intersectionPoints.length == 2) {
      // create new svgs if the object has more than 1 cut
      // TODO make one cut on the existing SVG instead of checking intersection points. If the svg has two cuts, split it
      const newSvgs = createNewSvgs(this, this.intersectionPoints[1]);
      if (newSvgs && newSvgs.length && !this.children.length) {
        splitSvgInTwo(newSvgs);
        newSvgs.forEach((svg) => {
          this.children.push(svg);
        });
      }
    }
  }

  getCmdsAsPathString(): string {
    let res = '';
    this.cmds.forEach((cmd) => {
      switch (cmd.code) {
        case 'M':
          res += `M${cmd.x},${cmd.y}`;
          break;
        case 'C':
          // res += `C146.847,3.02 163.476,37.537 168.534,79.245`
          res += `C${cmd.x1},${cmd.y1} ${cmd.x2},${cmd.y2} ${cmd.x},${cmd.y}`;
          break;
        case 'Z':
          res += 'Z';
          break;
      }
    });
    return res;
  }

  setCmds(cmds: Cmd[]) {
    this.cmds = cmds;
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }
}
