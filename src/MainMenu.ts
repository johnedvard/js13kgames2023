import { vec2, canvasFixedSize, timeDelta } from './littlejs';

import { MySvg } from './MySvg';
import { handleSvgCollisions } from './handleSvgCollisions';
import { tween, tweenRot } from './tween';
import { emit, on } from './gameEvents';
import {
  create3,
  createA,
  createB,
  createE,
  createM,
  createPlayButton,
  createS,
  createW,
  createWeb3Button,
} from './bambooFont';
import { SceneManager } from './SceneManager';

export class MainMenu {
  letters: MySvg[] = [];
  playButton: MySvg[] = [];
  web3Button: MySvg[] = [];
  ellapsedTime = 0;

  constructor(private sceneManager: SceneManager) {
    this.createTitle();
    this.playButton = createPlayButton();
    this.web3Button = createWeb3Button();

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
    tweenRot(this.letters, -0.1, 0.1, 2, true);
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
}
