import { Cmd } from './types/Cmd';

export function scaleCoordinates(cmds: Cmd[], scale: number) {
  cmds.forEach((c) => {
    const { x0, y0, x1, y1, x2, y2, x, y } = c;
    if (!Number.isNaN(x0)) c.x0 *= scale;
    if (!Number.isNaN(y0)) c.y0 *= scale;
    if (!Number.isNaN(x1)) c.x1 *= scale;
    if (!Number.isNaN(y1)) c.y1 *= scale;
    if (!Number.isNaN(x2)) c.x2 *= scale;
    if (!Number.isNaN(y2)) c.y2 *= scale;
    if (!Number.isNaN(x)) c.x *= scale;
    if (!Number.isNaN(y)) c.y *= scale;
  });
}
