export type Cmd = {
  command?: 'closepath' | 'moveto';
  code?: 'M' | 'C' | 'Z';
  isIntersectionPoint?: boolean;
  x?: number;
  y?: number;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
};
