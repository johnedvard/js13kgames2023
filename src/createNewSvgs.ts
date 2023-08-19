import { vec2 } from 'littlejsengine/build/littlejs.esm.min';

import { splitCubicCurve } from './splitCubicCurve';
import { Cmd } from './types/Cmd';
import { IntersectionPoint } from './types/IntersectionPoint';
import { MySvg } from './MySvg';
import { translateCoordinates } from './translateCoordinates';

export function createNewSvgs(svg: MySvg, p: IntersectionPoint): MySvg[] {
  if (!svg || !p) return [];
  const newSvg1 = new MySvg(null, svg.cmds, 'red', 'red', svg.pos.copy().add(vec2(0, 0)), svg.velocity);
  const newSvg2 = new MySvg(null, svg.cmds, 'gray', 'gray', svg.pos.copy().add(vec2(0, 0), svg.velocity));

  const cmd: Cmd = svg.cmds[p.id];
  if (!cmd) return;
  if (cmd.code == 'C') {
    const newCurves1 = splitCubicCurve(cmd, p.intersectionPoint);
    newCurves1[1].isIntersectionPoint = true;
    const newCurves2 = splitCubicCurve(cmd, p.intersectionPoint);
    newCurves2[1].isIntersectionPoint = true;
    translateCoordinates(newCurves1, svg.pos.copy().multiply(vec2(-1, -1))); // translate the coordinates back to origin.
    translateCoordinates(newCurves2, svg.pos.copy().multiply(vec2(-1, -1))); // translate the coordinates back to origin.
    newSvg1.addCmds(p.id, 1, newCurves1);
    newSvg2.addCmds(p.id, 1, newCurves2);
  }

  return [newSvg1, newSvg2];
}
