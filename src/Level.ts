import { vec2, canvasFixedSize, Music, timeDelta } from './littlejs';

import { Arrow } from './Arrow';
import { Lantern } from './Lantern';
import { MySvg } from './MySvg';
import { song } from './music';
import { ColorToSliceType } from './ColorToSliceType';
import { blue, red } from './colors';
import { smoothstep } from './smoothstep';
import { emit, on } from './gameEvents';
import { getColorFromSliceColor } from './colorUtils';
import { bambooPath } from './svgPaths';
import { handleSvgCollisions } from './handleSvgCollisions';
import { SceneManager } from './SceneManager';
import { addScore, setCurrentScore } from './scoreUtils';
import { setCurrentMusic } from './inputUtils';

export class Level {
  arrows: Arrow[] = [];
  lanterns: Lantern[] = [];
  bamboos: MySvg[] = [];
  music: Music;
  ellapsedPlayTime = 0;
  bpm = 120;
  bps = this.bpm / 60;
  currentColorToSlice: ColorToSliceType = 'r';
  nextColorToSlice: ColorToSliceType = 'b';
  maxColorSize = 6;
  currentWave = 0;
  sliceColorMaxLifeTime = 4; // how long the current slice color is active
  currentSliceColorEllapseTime = 0;
  waveDuration = 3;
  currentWaveEllapseTime = 0;

  constructor(private sceneManager: SceneManager) {
    this.music = new Music(song);
    on('split', this.onSplit);
    on('wave', this.onNewWave);
  }
  onSplit = (evt) => {
    if (this.sceneManager.currentScene != 'l') return;
    const other = evt.detail.data.svg;
    const point = evt.detail.data.intersectionPoint;
    const slicedColor = other.sliceColor;
    if (!slicedColor) {
      addScore(other, point);
      return; // slicing is OK regardless of sliceColor
    }
    if (slicedColor == this.currentColorToSlice) {
      addScore(other, point);
    } else {
      emit('killed', { msg: 'Sam, you cut the wrong color' });
    }
  };
  update() {
    this.arrows.forEach((s) => s.update());
    this.lanterns.forEach((s) => s.update());
    this.bamboos.forEach((s) => {
      s.update();
      handleSvgCollisions(s);
    });

    if (this.music.isPlaying()) {
      this.ellapsedPlayTime += timeDelta;
    }
    this.updateColorToSlice();
    this.handleWaves();
  }
  render(ctx) {
    this.arrows.forEach((s) => s.render(ctx));
    this.lanterns.forEach((s) => s.render(ctx));
    this.bamboos.forEach((s) => s.render(ctx));

    this.animateColorsToSliceBar(ctx);
  }

  updateColorToSlice() {
    if (this.ellapsedPlayTime == 0) return;
    this.currentSliceColorEllapseTime += timeDelta;
    if (this.currentSliceColorEllapseTime >= this.sliceColorMaxLifeTime) {
      this.currentSliceColorEllapseTime = 0;
      this.currentColorToSlice = this.nextColorToSlice;
      this.nextColorToSlice = this.getRandomSliceColor();
    }
  }

  handleWaves() {
    this.currentWaveEllapseTime += timeDelta;
    if (this.currentWaveEllapseTime >= this.waveDuration) {
      this.currentWaveEllapseTime = 0;
      emit('wave', { wave: ++this.currentWave });
    }
  }
  animateColorsToSliceBar(ctx) {
    // middle color
    ctx.beginPath();
    ctx.fillStyle = getColorFromSliceColor(this.currentColorToSlice);
    let centerPos = vec2(canvasFixedSize.x / 2, 50);
    const radius = smoothstep(10, 5, 0.5 + Math.sin(this.ellapsedPlayTime * 3) / 2);
    let outerRadius = 6;
    let innerRadius = 0;
    ctx.moveTo(centerPos.x, centerPos.y);
    ctx.arc(centerPos.x, centerPos.y, outerRadius + radius, 0, Math.PI * 2, false); // outer (filled)
    ctx.arc(centerPos.x, centerPos.y, innerRadius, 0, Math.PI * 2, true); // outer (unfills it)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    // animate next color coming
    ctx.beginPath();
    ctx.fillStyle = getColorFromSliceColor(this.nextColorToSlice);
    const distance = this.ellapsedPlayTime % this.sliceColorMaxLifeTime;
    const travelled = smoothstep(0, canvasFixedSize.x / 2, distance / this.sliceColorMaxLifeTime);
    centerPos = vec2(canvasFixedSize.x - travelled, 50);
    outerRadius = 1;
    innerRadius = radius / 1.5;
    ctx.moveTo(centerPos.x, centerPos.y);
    ctx.arc(centerPos.x, centerPos.y, outerRadius + radius, 0, Math.PI * 2, false); // outer (filled)
    ctx.arc(centerPos.x, centerPos.y, innerRadius, 0, Math.PI * 2, true); // outer (unfills it)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  renderColorToScliceCircle(ctx, color: ColorToSliceType, centerPos: vec2, isFirstCircle = false) {
    ctx.save();
    switch (color) {
      case 'r':
        ctx.fillStyle = red;
        break;
      case 'b':
        ctx.fillStyle = blue;
        break;
    }

    ctx.beginPath();
    const radius = smoothstep(10, 5, 0.5 + Math.sin(this.ellapsedPlayTime * 3) / 2);
    const outerRadius = isFirstCircle ? 6 : 1;
    const innerRadius = isFirstCircle ? 0 : radius / 1.5;
    ctx.moveTo(centerPos.x, centerPos.y);
    ctx.arc(centerPos.x, centerPos.y, outerRadius + radius, 0, Math.PI * 2, false); // outer (filled)
    ctx.arc(centerPos.x, centerPos.y, innerRadius, 0, Math.PI * 2, true); // outer (unfills it)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  start() {
    console.log('start level');
    setCurrentMusic(this.music);
    // Always start the first and second color with red and blue. Acts like a tutorial
    setCurrentScore(0);
    this.currentColorToSlice = 'r';
    this.nextColorToSlice = 'b';
    // reset
    this.lanterns.length = 0;
    this.bamboos.length = 0;
    this.arrows.length = 0;
    // start first wave
    for (let i = 0; i < 2; i++) {
      this.lanterns.push(new Lantern(vec2(i * 146, canvasFixedSize.y - 100), 'r'));
    }
    this.ellapsedPlayTime = 0;
    this.currentWave = 0;
    this.currentSliceColorEllapseTime = 0;
    this.currentWaveEllapseTime = 0;
    this.music.stop();
    this.music.play();
  }

  getRandomSliceColor() {
    const randomNum = Math.floor(Math.random() * 2);
    switch (randomNum) {
      case 0:
        return 'r';
      case 1:
        return 'b';
      default:
        return 'r';
    }
  }

  onNewWave = (_evt) => {
    this.removeUnusedObjects();
    if (this.sceneManager.currentScene != 'l') return;
    if (this.currentWave == 1) {
      for (let i = 0; i < 2; i++) {
        this.lanterns.push(new Lantern(vec2(600 + i * 146, canvasFixedSize.y + 200), 'b', vec2(-1, 0)));
      }
    }
    // skip wave 2
    if (this.currentWave == 3 || this.currentWave == 4) {
      for (let i = 0; i < 2; i++) {
        const sliceColor = i ? 'r' : 'b';
        let x = 70 + Math.floor(Math.random() * (canvasFixedSize.x / 2 - 70));
        if (i) x = 70 + canvasFixedSize.x / 2 + Math.floor(Math.random() * (canvasFixedSize.x / 2 - 70));
        const bamboo = new MySvg(bambooPath, null, sliceColor, getColorFromSliceColor(sliceColor));
        bamboo.setScale(2);
        bamboo.translateSvg(vec2(x, -300));
        this.bamboos.push(bamboo);
      }
    }
    // Add arrows for every 5 wave
    if (this.currentWave % 5 == 0) {
      let speed = Math.max(-4, (this.currentWave / 5) * -1);
      for (let i = 0; i < 3; i++) {
        this.arrows.push(
          new Arrow(vec2(i * 10 + Math.random() * 900, -300 + i * (Math.random() * 20)), vec2(0, speed))
        );
      }
    }
    // skipe wave 6 (player needs time to destroy arrows)
    if (this.currentWave == 7 || this.currentWave == 8) {
      this.spawnBamboos();
    }
    if (this.currentWave >= 10) {
      if (this.currentWave % 2 == 0) {
        const sliceColor = this.getRandomSliceColor();
        let x = 70 + Math.floor(100 + Math.random() * (canvasFixedSize.x - 140));
        const bamboo = new MySvg(bambooPath, null, sliceColor, getColorFromSliceColor(sliceColor));
        bamboo.setScale(2);
        bamboo.translateSvg(vec2(x, -200));
        this.bamboos.push(bamboo);
      }
      if (this.currentWave % 4 == 0) {
        this.spawnLanterns();
      }
      if (this.currentWave % 3 == 0) {
        this.spawnBamboos();
      }
    }
  };

  spawnBamboos() {
    for (let i = 0; i < 5; i++) {
      let sliceColor = this.getRandomSliceColor();
      setTimeout(
        (sliceColor) => {
          let x = 70 + Math.floor(100 + Math.random() * (canvasFixedSize.x - 140));
          const bamboo = new MySvg(bambooPath, null, sliceColor, getColorFromSliceColor(sliceColor));
          bamboo.setScale(1.25);
          bamboo.translateSvg(vec2(x, -200));
          this.bamboos.push(bamboo);
        },
        i * 100,
        sliceColor
      );
    }
  }

  spawnLanterns() {
    for (let i = 0; i < 4; i++) {
      const lantern = new Lantern(
        vec2(50 + Math.random() * (canvasFixedSize.x - 50), canvasFixedSize.y),
        this.getRandomSliceColor()
      );
      if (lantern.pos.x >= canvasFixedSize.x / 2 - 100) {
        lantern.velocity = vec2(-0.5, 0);
      } else {
        lantern.velocity = vec2(0.5, 0);
      }
      lantern.shouldRotate = true;
      this.lanterns.push(lantern);
    }
  }

  removeUnusedObjects() {
    for (let i = this.bamboos.length - 1; i >= 0; i--) {
      const svg = this.bamboos[i];
      if (Math.abs(svg.pos.y) >= canvasFixedSize.y + 1000 || (svg.isCut() && svg.killedTime >= 5)) {
        this.bamboos.splice(i, 1);
      }
    }
    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const lantern = this.lanterns[i];
      if (
        Math.abs(lantern.getCenterPos().y) >= canvasFixedSize.y + 1000 ||
        (lantern.isCut() && lantern.killedTime >= 5)
      ) {
        this.lanterns.splice(i, 1);
      }
    }
    for (let i = this.arrows.length - 1; i >= 0; i--) {
      const arrow = this.arrows[i];
      if (Math.abs(arrow.getPos().y) >= canvasFixedSize.y + 1000 || (arrow.isCut() && arrow.killedTime >= 5)) {
        this.arrows.splice(i, 1);
      }
    }
  }
}
