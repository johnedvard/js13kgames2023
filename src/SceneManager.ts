import { Level } from './Level';
import { MainMenu } from './MainMenu';
import { Web3Scene } from './Web3Scene';
import { on } from './gameEvents';
import { startSceneTransition } from './startSceneTransition';

type SceneType = 'm' | 'l' | 'w' | '';
export class SceneManager {
  currentScene: SceneType = 'm';
  mainMenu: MainMenu;
  level: Level;
  web3Scene: Web3Scene;
  isChangingScenes = false;

  constructor() {
    // TODO (johnedvard) create level or main menu depending on current scene instead
    this.mainMenu = new MainMenu();
    this.level = new Level();
    this.web3Scene = new Web3Scene();
    on('play', this.onPlay);
    on('web3', this.onWeb3);
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

  onPlay = (customEvent: CustomEvent) => {
    if (this.isChangingScenes) return;
    console.log('on play: ', customEvent);
    this.changeScene('l');
  };

  onWeb3 = (customEvent: CustomEvent) => {
    if (this.isChangingScenes) return;
    console.log('on web3: ', customEvent);
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
    }
  }
}
