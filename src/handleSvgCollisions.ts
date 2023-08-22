import { MySvg } from './MySvg';
import { containsUniqueIntersectionPoint, handleLineCollisions } from './handleLineCollisions';

export function handleSvgCollisions(svg: MySvg) {
  const intersectionPoints = handleLineCollisions(svg);
  intersectionPoints.forEach((p) => {
    if (!containsUniqueIntersectionPoint(svg.intersectionPoints, p)) {
      svg.addIntersectionPoint(p);
    }
  });
}
