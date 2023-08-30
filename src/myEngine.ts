export type vec2 = { x: number; y: number; copy; multiply; add; subtract };
export function vec2(x: number, y: number): vec2 {
  return {
    x,
    y,

    copy: function () {
      return vec2(this.x, this.y);
    },
    multiply: function (vec: vec2) {
      this.x *= vec.x;
      this.y *= vec.y;
      return this;
    },
    add: function (vec: vec2) {
      this.x += vec.x;
      this.y += vec.y;
      return this;
    },
    subtract: function (vec: vec2) {
      this.x -= vec.x;
      this.y -= vec.y;
      return this;
    },
  };
}
