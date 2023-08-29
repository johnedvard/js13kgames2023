import { vec2, canvasFixedSize, timeDelta } from 'littlejsengine/build/littlejs.esm.min';

import { MySvg } from './MySvg';
import { handleSvgCollisions } from './handleSvgCollisions';
import { tween } from './tween';
import { emit, on } from './gameEvents';
import { create3, createA, createB, createE, createM, createPlayButton, createS, createW } from './bambooFont';
import { SceneManager } from './SceneManager';

export class MainMenu {
  letters: MySvg[] = [];
  playButton: MySvg[] = [];
  web3Button: MySvg[] = [];
  startButton: MySvg;
  ellapsedTime = 0;

  constructor(private sceneManager: SceneManager) {
    this.createTitle();
    this.playButton = createPlayButton();
    this.createWeb3();

    on('split', this.onSplit);
  }

  createTitle() {
    const startOffset: vec2 = vec2(62, 0);
    const sSvgs = createS(startOffset);
    const aSvgs = createA(startOffset);
    const mSvgs = createM(startOffset);

    this.letters.push(...sSvgs);
    this.letters.push(...aSvgs);
    this.letters.push(...mSvgs);

    this.letters.forEach((s) => s.setGravityScale(0));
  }

  onSplit = (evt: CustomEvent) => {
    if (this.sceneManager.currentScene != 'm') return;
    console.log(evt.detail.data);
    this.playButton.forEach((svg) => {
      if (svg == evt.detail.data) {
        emit('play');
      }
    });
    this.web3Button.forEach((svg) => {
      if (svg == evt.detail.data) {
        emit('web3');
      }
    });
  };

  update() {
    this.ellapsedTime += timeDelta;
    this.letters.forEach((s) => handleSvgCollisions(s));
    this.playButton.forEach((s) => handleSvgCollisions(s, 1));
    this.web3Button.forEach((s) => handleSvgCollisions(s, 1));
  }

  render(ctx) {
    ctx.save();
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    this.letters.forEach((l) => l.render(ctx));
    this.playButton.forEach((s) => s.render(ctx));
    this.web3Button.forEach((s) => s.render(ctx));
    ctx.restore();
  }

  createWeb3() {
    const w = createW();
    w.forEach((l) => {
      l.setScale(0.25);
      l.translateSvg(vec2(30, 0));
    });
    const e = createE();
    const b = createB();
    const w3 = create3();

    e.forEach((e) => {
      e.setScale(0.25);
      e.translateSvg(vec2(70, 0));
    });
    b.forEach((svg) => {
      svg.setScale(0.25);
      svg.translateSvg(vec2(100, 0));
    });
    w3.forEach((svg) => {
      svg.setScale(0.25);
      svg.translateSvg(vec2(150, 0));
    });

    this.web3Button = [...w, ...e, ...b, ...w3];
    this.web3Button.forEach((s) => s.setGravityScale(0));
    tween(
      this.web3Button,
      vec2(canvasFixedSize.x / 2 - 100, canvasFixedSize.y),
      vec2(canvasFixedSize.x / 2 - 100, canvasFixedSize.y - 100),
      1
    );
  }
}
