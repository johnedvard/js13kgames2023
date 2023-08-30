import { GameOverScene } from './GameOverScene';
import { Level } from './Level';
import { MainMenu } from './MainMenu';
import { Web3Scene } from './Web3Scene';
import { on } from './gameEvents';
import { startSceneTransition } from './startSceneTransition';

type SceneType = 'm' | 'l' | 'w' | 'g' | '';
export class SceneManager {
  currentScene: SceneType = 'm';
  mainMenu: MainMenu;
  level: Level;
  web3Scene: Web3Scene;
  gameOverScene: GameOverScene;
  isChangingScenes = false;

  constructor() {
    // TODO (johnedvard) create level or main menu depending on current scene instead
    this.mainMenu = new MainMenu(this);
    this.level = new Level(this);
    this.web3Scene = new Web3Scene(this);
    this.gameOverScene = new GameOverScene(this);
    on('play', this.onPlay);
    on('web3', this.onWeb3);
    on('killed', this.onKilled);
  }

  changeScene(sceneType: SceneType) {
    this.isChangingScenes = true;
    // TODO (johnedvard) start an animation, and return a p
    const onMiddle = () => {
      console.log('onMiddle');
      this.currentScene = '';
    };
    const onEnded = () => {
      console.log('onEnded');
      this.currentScene = sceneType;
      this.isChangingScenes = false;
      switch (sceneType) {
        case 'l':
          return this.level.start();

        case 'w':
          return this.web3Scene.start();
      }
    };
    startSceneTransition(1.5, onMiddle, onEnded);
  }

  onKilled = (_customEvent: CustomEvent) => {
    if (this.isChangingScenes) return;
    this.changeScene('g');
  };

  onPlay = (_customEvent: CustomEvent) => {
    if (this.isChangingScenes) return;
    this.changeScene('l');
  };

  onWeb3 = (_customEvent: CustomEvent) => {
    if (this.isChangingScenes) return;
    this.changeScene('w');
  };

  update() {
    switch (this.currentScene) {
      case 'm':
        return this.mainMenu.update();
      case 'l':
        return this.level.update();
      case 'w':
        return this.web3Scene.update();
      case 'g':
        return this.gameOverScene.update();
    }
  }
  render(ctx) {
    switch (this.currentScene) {
      case 'm':
        return this.mainMenu.render(ctx);
      case 'l':
        return this.level.render(ctx);
      case 'w':
        return this.web3Scene.render(ctx);
      case 'g':
        return this.gameOverScene.render(ctx);
    }
  }
}
