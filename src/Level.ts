import { vec2, canvasFixedSize, Music, timeDelta } from 'littlejsengine/build/littlejs.esm.min';

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
  ellapsedTime = 0;
  currentWave = 0;
  sliceColorMaxLifeTime = 4; // how long the current slice color is active
  currentSliceColorEllapseTime = 0;
  waveDuration = 3;
  currentWaveEllapseTime = 0;
  constructor() {
    this.music = new Music(song);
    // start first wave in constructor
    for (let i = 0; i < 2; i++) {
      this.lanterns.push(new Lantern(vec2(i * 146, canvasFixedSize.y - 100), 'r'));
    }
    on('split', this.onSplit);
    on('wave', this.onNewWave);
  }
  onSplit = (evt) => {
    console.log('evt', evt.detail.data);
    const slicedColor = evt?.detail?.data?.sliceColor;
    if (!slicedColor) return; // slicing is OK regardless of sliceColor
    if (slicedColor == this.currentColorToSlice) {
      console.log('add points');
    } else {
      // loose game (loose life?)
      console.log('killed');
    }
  };
  update() {
    this.arrows.forEach((s) => s.update());
    this.lanterns.forEach((s) => s.update());
    this.bamboos.forEach((s) => {
      s.update();
      handleSvgCollisions(s);
    });

    this.ellapsedTime += timeDelta;
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

  onNewWave = (evt) => {
    console.log('onNew wave', evt?.detail?.data);
    console.log('onNew wave', this.currentWave);
    if (this.currentWave == 1) {
      for (let i = 0; i < 2; i++) {
        this.lanterns.push(new Lantern(vec2(600 + i * 146, canvasFixedSize.y + 200), 'b', vec2(-1, 0)));
      }
    }
    // skip wave 2
    if (this.currentWave == 3 || this.currentWave == 4) {
      for (let i = 0; i < 2; i++) {
        const sliceColor = i ? 'r' : 'b';
        let x = 50 + Math.floor(Math.random() * (canvasFixedSize.x / 2 - 100));
        if (i) x = 50 + canvasFixedSize.x / 2 + Math.floor(Math.random() * (canvasFixedSize.x / 2 - 100));
        this.bamboos.push(new MySvg(bambooPath, null, sliceColor, getColorFromSliceColor(sliceColor), vec2(x, -200)));
      }
    }
    if (this.currentWave == 5) {
      for (let i = 0; i < 3; i++) {
        this.arrows.push(new Arrow(vec2(i * 10 + Math.random() * 900, -300 + i * (Math.random() * 20))));
      }
    }
  };
}
