import { vec2, canvasFixedSize } from './littlejs';

import { HaloSaber } from './HaloSaber';
import { INftCollection } from './INftCollection';
import { LightSaber } from './LightSaber';
import { MySvg } from './MySvg';
import { SERIES_ID_HALO_SABER, SERIES_ID_LIGHT_SABER, haloSaberData, lightSaberData } from './NearConnection';
import { SceneManager } from './SceneManager';
import {
  createB,
  createE,
  createG,
  createI,
  createL,
  createN,
  createO,
  createP,
  createPlayButton,
  createQ,
  createU,
  createY,
} from './bambooFont';
import { emit, on } from './gameEvents';
import { handleSvgCollisions } from './handleSvgCollisions';
import { buyNftSword, getNftCollection, getNftTokensForOwner, initNear, isLoggedIn, isOwned, login } from './near';
import { setEquippedDragColor, setIsUseSelectedColor, setSelectedDragColor } from './inputUtils';
import { darkPink, lightBlue } from './colors';
import { tween } from './tween';

export class Web3Scene {
  lightSaber: LightSaber;
  haloSaber: HaloSaber;
  playBtn: MySvg[] = [];
  loginBtn: MySvg[] = [];
  equipHaloSaberBtn: MySvg[] = [];
  equipLightSaberBtn: MySvg[] = [];
  buyLightSaberBtn: MySvg[] = [];
  buyHaloSaberBtn: MySvg[] = [];

  isEventInProgress = false;

  equipButton: MySvg[] = [];
  constructor(private sceneManager: SceneManager) {
    on('split', this.onSplit);
  }

  createLoginButton() {
    const l = createL();
    const o = createO();
    const g = createG();
    const i = createI();
    const n = createN();
    o.forEach((svg) => svg.translateSvg(vec2(120, 0)));
    g.forEach((svg) => svg.translateSvg(vec2(255, 0)));
    i.forEach((svg) => svg.translateSvg(vec2(420, 0)));
    n.forEach((svg) => svg.translateSvg(vec2(470, 0)));
    return [...l, ...o, ...g, ...i, ...n];
  }

  createEquipButton() {
    const e = createE();
    const q = createQ();
    const u = createU();
    const i = createI();
    const p = createP();
    q.forEach((svg) => svg.translateSvg(vec2(120, 0)));
    u.forEach((svg) => svg.translateSvg(vec2(255, 0)));
    i.forEach((svg) => svg.translateSvg(vec2(400, 0)));
    p.forEach((svg) => svg.translateSvg(vec2(450, 0)));
    return [...e, ...q, ...u, ...i, ...p];
  }

  createBuyButton() {
    const b = createB();
    const u = createU();
    const y = createY();

    u.forEach((s) => s.translateSvg(vec2(120, 0)));
    y.forEach((s) => s.translateSvg(vec2(310, 15)));

    return [...b, ...u, ...y];
  }

  onSplit = (evt) => {
    if (this.sceneManager.currentScene != 'w') return;
    const other = evt.detail.data.svg;
    this.playBtn.forEach((svg) => {
      if (this.isEventInProgress) return;
      if (svg == other) {
        this.isEventInProgress = true;
        setIsUseSelectedColor(false); // use the equipped color instead
        emit('play');
      }
    });
    if (this.lightSaber) {
      this.lightSaber.getSvgs().forEach((svg) => {
        if (svg == other) {
          setSelectedDragColor(lightBlue);
        }
      });
    }
    if (this.haloSaber) {
      this.haloSaber.getSvgs().forEach((svg) => {
        if (svg == other) {
          setSelectedDragColor(darkPink);
        }
      });
    }
    this.loginBtn.forEach((svg) => {
      if (this.isEventInProgress) return;
      if (svg == other) {
        this.isEventInProgress = true;
        login();
      }
    });
    this.equipLightSaberBtn.forEach((svg) => {
      if (svg == other) {
        setSelectedDragColor(lightBlue);
        setEquippedDragColor(lightBlue);
      }
    });
    this.equipHaloSaberBtn.forEach((svg) => {
      if (svg == other) {
        setSelectedDragColor(darkPink);
        setEquippedDragColor(darkPink);
      }
    });
    this.buyLightSaberBtn.forEach((svg) => {
      if (this.isEventInProgress) return;
      if (svg == other) {
        this.isEventInProgress = true;
        if (isLoggedIn()) {
          buyNftSword(lightSaberData);
        } else {
          login();
        }
      }
    });
    this.buyHaloSaberBtn.forEach((svg) => {
      if (this.isEventInProgress) return;
      if (svg == other) {
        this.isEventInProgress = true;
        if (isLoggedIn()) {
          buyNftSword(haloSaberData);
        } else {
          login();
        }
      }
    });
  };

  async initWeapons() {
    const [nftCollection] = await Promise.all([getNftCollection()]);
    console.log('nftCollection', nftCollection);
    nftCollection.forEach((c: INftCollection) => {
      switch (c['token_series_id']) {
        case SERIES_ID_LIGHT_SABER:
          this.lightSaber = new LightSaber(c);
          break;
        case SERIES_ID_HALO_SABER:
          this.haloSaber = new HaloSaber(c);
          break;
      }
    });
  }
  update() {
    if (this.lightSaber) this.lightSaber.update();
    if (this.haloSaber) this.haloSaber.update();

    if (isLoggedIn() && isOwned(lightSaberData)) {
      this.equipLightSaberBtn.forEach((s) => {
        s.update();
        handleSvgCollisions(s, 1);
      });
    } else {
      this.buyLightSaberBtn.forEach((s) => {
        s.update();
        handleSvgCollisions(s, 1);
      });
    }
    if (isLoggedIn() && isOwned(haloSaberData)) {
      this.equipHaloSaberBtn.forEach((s) => {
        s.update();
        handleSvgCollisions(s, 1);
      });
    } else {
      this.buyHaloSaberBtn.forEach((s) => {
        s.update();
        handleSvgCollisions(s, 1);
      });
    }

    this.playBtn.forEach((s) => {
      s.update();
      handleSvgCollisions(s, 2);
    });
    if (!isLoggedIn()) {
      this.loginBtn.forEach((s) => {
        s.update();
        handleSvgCollisions(s, 1);
      });
    }
  }
  render(ctx) {
    if (this.lightSaber) this.lightSaber.render(ctx);
    if (this.haloSaber) this.haloSaber.render(ctx);

    ctx.save();
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;

    if (isLoggedIn() && isOwned(lightSaberData)) {
      this.equipLightSaberBtn.forEach((s) => s.render(ctx));
    } else {
      this.buyLightSaberBtn.forEach((s) => s.render(ctx));
    }
    if (isLoggedIn() && isOwned(haloSaberData)) {
      this.equipHaloSaberBtn.forEach((s) => s.render(ctx));
    } else {
      this.buyHaloSaberBtn.forEach((s) => s.render(ctx));
    }

    this.playBtn.forEach((s) => s.render(ctx));
    if (!isLoggedIn()) {
      this.loginBtn.forEach((s) => s.render(ctx));
    }
    ctx.restore();
  }
  start() {
    console.log('start web 3');
    this.playBtn.length = 0;
    this.buyLightSaberBtn.length = 0;
    this.buyHaloSaberBtn.length = 0;
    this.loginBtn.length = 0;
    this.equipHaloSaberBtn.length = 0;
    this.equipLightSaberBtn.length = 0;

    this.playBtn = createPlayButton();
    this.buyLightSaberBtn = this.createBuyButton();
    this.buyHaloSaberBtn = this.createBuyButton();
    this.loginBtn = this.createLoginButton();
    this.equipHaloSaberBtn = this.createEquipButton();
    this.equipLightSaberBtn = this.createEquipButton();
    this.buyLightSaberBtn.forEach((s) => {
      s.setScale(0.25);
      s.setGravityScale(0);
      s.translateSvg(vec2(375, 500));
    });
    this.buyHaloSaberBtn.forEach((s) => {
      s.setScale(0.25);
      s.setGravityScale(0);
      s.translateSvg(vec2(150, 500));
    });
    this.equipHaloSaberBtn.forEach((s) => {
      s.setGravityScale(0);
      s.setScale(0.25);
      s.translateSvg(vec2(150, 500));
    });
    this.equipLightSaberBtn.forEach((s) => {
      s.setGravityScale(0);
      s.setScale(0.25);
      s.translateSvg(vec2(375, 500));
    });
    this.loginBtn.forEach((s) => {
      s.setGravityScale(0);
      s.setScale(0.25);
    });
    tween(
      this.loginBtn,
      vec2(canvasFixedSize.x / 2 - 70, canvasFixedSize.y),
      vec2(canvasFixedSize.x / 2 - 70, canvasFixedSize.y - 100),
      1
    );
    this.isEventInProgress = false;
    initNear().then(async () => {
      if (isLoggedIn()) {
        const tokensOwned = await getNftTokensForOwner();
        console.log('tokensOwned', tokensOwned);
      }
    });
    setIsUseSelectedColor(true);
    this.initWeapons();
  }
}
