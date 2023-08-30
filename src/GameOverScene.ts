import { canvasFixedSize } from 'littlejsengine/build/littlejs.esm';

import { SceneManager } from './SceneManager';
import { MySvg } from './MySvg';
import { bambooPath } from './svgPaths';
import { red } from './colors';
import { handleSvgCollisions } from './handleSvgCollisions';
import { vec2 } from './myEngine';
import { on } from './gameEvents';

export class GameOverScene {
  cross: MySvg[] = [];
  constructor(private sceneManager: SceneManager) {
    const bamboo1 = new MySvg(bambooPath, null, null, red);
    const bamboo2 = new MySvg(bambooPath, null, null, red);
    bamboo1.setGravityScale(0);
    bamboo2.setGravityScale(0);
    for (let i = 0; i < 8; i++) {
      bamboo1.rotateSvg(5);
      bamboo2.rotateSvg(-5);
    }
    bamboo1.translateSvg(vec2(80, -15));

    this.cross.push(bamboo1, bamboo2);
    this.cross.forEach((svg) => svg.translateSvg(vec2(canvasFixedSize.x / 2 - 30, canvasFixedSize.y / 2)));
    on('split', this.onSplit);
  }
  onSplit = () => {
    if (this.sceneManager.currentScene != 'g') return;
  };
  update() {
    this.cross.forEach((svg) => {
      svg.update();
      handleSvgCollisions(svg, 2);
    });
  }
  render(ctx) {
    ctx.save();
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    this.cross.forEach((svg) => svg.render(ctx));
    ctx.restore();
  }
}
