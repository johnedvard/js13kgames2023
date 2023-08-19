import { vec2 } from 'littlejsengine/build/littlejs.esm.min';

import { getCubicControlPoints } from './getCubicControlPoints';
import { mousePoints } from './inputUtils';
import { getLineIntersection } from './getLineIntersection';
import { IntersectionPoint } from './types/IntersectionPoint';
import { MySvg } from './MySvg';

export function containsUniqueIntersectionPoint(points: IntersectionPoint[], newPoint: vec2) {
  const tolerance = 1; // ignore points that are close enough to p
  let containsPoint = false;
  for (let existingPoint of points) {
    if (Math.abs(existingPoint.intersectionPoint.x - newPoint.x) <= tolerance) containsPoint = true;
    if (Math.abs(existingPoint.intersectionPoint.y - newPoint.y) <= tolerance) containsPoint = true;
    if (containsPoint) break;
  }
  return containsPoint;
}

export function containsUniquePoint(points: vec2[], newPoint: vec2) {
  const tolerance = 1; // ignore points that are close enough to p
  let isUniquePoint = true;
  for (let existingPoint of points) {
    if (Math.abs(existingPoint.x - newPoint.x) >= tolerance) isUniquePoint = false;
    if (Math.abs(existingPoint.y - newPoint.y) >= tolerance) isUniquePoint = false;
    if (isUniquePoint) break;
  }
  return !isUniquePoint;
}
/**
 * Handle all collisions for the svg object, making sure that all collisions that happen in the same function is the same object
 * We check against the line the mouse creates
 */
export function handleLineCollisions(svg: MySvg): IntersectionPoint[] {
  const intersectionPoints = []; // {id, point}, the id of the curve, and the point
  svg.cmds.forEach((cmd, index) => {
    if (cmd.code === 'C') {
      const { x0, y0, x1, y1, x2, y2, x, y } = cmd;
      for (let i = 0; i < 0.99; i = i + 0.01) {
        const p1 = getCubicControlPoints(x0, y0, x1, y1, x2, y2, x, y, i);
        const p2 = getCubicControlPoints(x0, y0, x1, y1, x2, y2, x, y, i + 0.01);
        for (let i = 0; i < mousePoints.length - 1; i++) {
          const prev = mousePoints[i];
          const next = mousePoints[i + 1];
          const intersectionPoint = getLineIntersection(prev, next, p1.t0, p2.t0);
          if (intersectionPoint) {
            if (!containsUniquePoint(intersectionPoints, intersectionPoint)) {
              intersectionPoints.push({ id: index, intersectionPoint });
            }
          }
        }
      }
    }
  });
  return intersectionPoints;
}
