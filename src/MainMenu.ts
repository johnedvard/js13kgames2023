import { vec2, canvasFixedSize, timeDelta } from 'littlejsengine/build/littlejs.esm.min';

import { MySvg } from './MySvg';
import { black, red } from './colors';
import { bambooPath, buttonPath } from './svgPaths';
import { handleSvgCollisions } from './handleSvgCollisions';
import { tween } from './tween';
import { smoothstep } from './smoothstep';

export class MainMenu {
  letters: MySvg[] = [];
  startButton: MySvg;
  ellapsedTime = 0;
  startBtnAnimDuration = 1;
  constructor() {
    this.createTitle();
  }

  createTitle() {
    const startOffset: vec2 = vec2(62, 0);
    const sSvgs = this.createS(startOffset);
    const aSvgs = this.createA(startOffset);
    const mSvgs = this.createM(startOffset);
    this.startButton = this.createButton();
    this.letters.push(...sSvgs);
    this.letters.push(...aSvgs);
    this.letters.push(...mSvgs);

    this.letters.forEach((s) => s.setGravityScale(0));

    tween(
      this.startButton,
      vec2(canvasFixedSize.x / 2 - this.startButton.size.x / 2, canvasFixedSize.y),
      vec2(canvasFixedSize.x / 2 - this.startButton.size.x / 2, 700),
      this.startBtnAnimDuration
    );
  }

  update() {
    this.ellapsedTime += timeDelta;
    this.letters.forEach((svg) => {
      handleSvgCollisions(svg);
      handleSvgCollisions(this.startButton);
    });
  }
  render(ctx) {
    ctx.save();
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    this.letters.forEach((l) => l.render(ctx));
    ctx.restore();
    this.renderStartButton(ctx);
  }
  private renderStartButton(ctx) {
    ctx.save();
    this.startButton.render(ctx);
    if (!this.startButton.isCut()) {
      const ratio = this.ellapsedTime / this.startBtnAnimDuration;

      const y = smoothstep(canvasFixedSize.y + 50, 745, ratio);
      ctx.font = 'bold 38px serif';
      ctx.fillStyle = black;
      ctx.shadowBlur = 0;
      ctx.fillText('Slice to Play', canvasFixedSize.x / 2 - 100, y);
    }
    ctx.restore();
  }
  private createS(startOffset = vec2(0, 0)) {
    const offsetX = startOffset.x;
    const s1 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    s1.rotateSvg(10);
    s1.rotateSvg(10);
    s1.rotateSvg(10);
    s1.rotateSvg(10);
    s1.rotateSvg(5);
    s1.translateSvg(vec2(140 + offsetX, 100));
    const s2 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    s2.rotateSvg(-10);
    s2.rotateSvg(-10);
    s2.rotateSvg(-10);
    s2.rotateSvg(-10);
    s2.rotateSvg(-5);
    s2.translateSvg(vec2(50 + offsetX, 160));
    const s3 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    s3.rotateSvg(10);
    s3.rotateSvg(10);
    s3.rotateSvg(10);
    s3.rotateSvg(10);
    s3.rotateSvg(5);
    s3.translateSvg(vec2(140 + offsetX, 190));
    return [s1, s2, s3];
  }
  createA(startOffset = vec2(0, 0)) {
    const offsetX = startOffset.x;
    const a1 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    a1.rotateSvg(10);
    a1.rotateSvg(10);
    a1.translateSvg(vec2(220 + offsetX, 150));
    const a2 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    a2.rotateSvg(-10);
    a2.rotateSvg(-10);
    a2.translateSvg(vec2(230 + offsetX, 160));
    const a3 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    for (let i = 0; i < 8; i++) {
      a3.rotateSvg(10);
    }
    a3.rotateSvg(5);
    a3.translateSvg(vec2(290 + offsetX, 200));
    return [a1, a2, a3];
  }
  createM(startOffset = vec2(0, 0)) {
    const offsetX = startOffset.x;
    const m1 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    m1.translateSvg(vec2(320 + offsetX, 150));
    const m2 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    m2.rotateSvg(-10);
    m2.rotateSvg(-10);
    m2.rotateSvg(-5);
    m2.translateSvg(vec2(330 + offsetX, 150));
    const m3 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    m3.rotateSvg(10);
    m3.rotateSvg(10);
    m3.rotateSvg(5);
    m3.translateSvg(vec2(430 + offsetX, 150));
    const m4 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    m4.translateSvg(vec2(435 + offsetX, 150));
    return [m1, m2, m3, m4];
  }
  createButton() {
    const b = new MySvg(buttonPath, null, red, red, vec2(0, 0), vec2(0, 0), vec2(250, 100));
    b.setGravityScale(0);
    return b;
  }
}
