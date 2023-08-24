import { vec2, canvasFixedSize, timeDelta } from 'littlejsengine/build/littlejs.esm.min';

import { MySvg } from './MySvg';
import { red } from './colors';
import { bambooPath } from './svgPaths';
import { handleSvgCollisions } from './handleSvgCollisions';
import { tween } from './tween';

export class MainMenu {
  letters: MySvg[] = [];
  playButton: MySvg[] = [];
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
    const pSvgs = this.createP();
    const lSvgs = this.createL();
    const aSvgs2 = this.createA();
    const ySvgs = this.createY();
    lSvgs.forEach((svg) => svg.translateSvg(vec2(100, 0)));
    aSvgs2.forEach((svg) => svg.translateSvg(vec2(30, -140)));
    ySvgs.forEach((svg) => svg.translateSvg(vec2(390, 20)));

    this.playButton = [...pSvgs, ...lSvgs, ...aSvgs2, ...ySvgs];
    this.playButton.forEach((s) => s.setScale(0.5));
    this.letters.push(...sSvgs);
    this.letters.push(...aSvgs);
    this.letters.push(...mSvgs);

    this.letters.forEach((s) => s.setGravityScale(0));
    this.playButton.forEach((s) => s.setGravityScale(0));

    tween(
      this.playButton,
      vec2(canvasFixedSize.x / 2 - 90, canvasFixedSize.y),
      vec2(canvasFixedSize.x / 2 - 90, 700),
      this.startBtnAnimDuration
    );
  }

  update() {
    this.ellapsedTime += timeDelta;
    this.letters.forEach((s) => {
      handleSvgCollisions(s);
    });
    this.playButton.forEach((s) => {
      handleSvgCollisions(s, 5);
    });
  }
  render(ctx) {
    ctx.save();
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    this.letters.forEach((l) => l.render(ctx));
    this.playButton.forEach((s) => s.render(ctx));
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

  createP() {
    const p1 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    const p2 = new MySvg(bambooPath, null, red, red, vec2(0, 0));

    for (let i = 0; i < 5; i++) {
      p2.rotateSvg(-10);
    }
    p2.translateSvg(vec2(-20, -5));
    const p3 = new MySvg(bambooPath, null, red, red, vec2(0, 0));

    for (let i = 0; i < 5; i++) {
      p3.rotateSvg(10);
    }
    p3.translateSvg(vec2(70, 20));

    return [p1, p2, p3];
  }

  createL() {
    const l1 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    const l2 = new MySvg(bambooPath, null, red, red, vec2(0, 0));

    for (let i = 0; i < 17; i++) {
      l2.rotateSvg(5);
    }
    l2.translateSvg(vec2(100, 100));
    return [l1, l2];
  }
  createY() {
    const y1 = new MySvg(bambooPath, null, red, red, vec2(0, 0));
    const y2 = new MySvg(bambooPath, null, red, red, vec2(0, 0));

    for (let i = 0; i < 3; i++) {
      y1.rotateSvg(10);
      y2.rotateSvg(-10);
    }
    y2.translateSvg(vec2(-75, -20));

    return [y1, y2];
  }
}
