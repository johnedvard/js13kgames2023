import { Level } from './Level';
import { MainMenu } from './MainMenu';
import { on } from './gameEvents';
import { startSceneTransition } from './startSceneTransition';

type SceneType = 'm' | 'l' | '';
export class SceneManager {
  currentScene: SceneType = 'm';
  mainMenu: MainMenu;
  level: Level;
  isChangingScenes = false;

  constructor() {
    // TODO (johnedvard) create level or main menu depending on current scene instead
    this.mainMenu = new MainMenu();
    this.level = new Level();
    on('play', this.onPlay);
  }

  onPlay = (customEvent: CustomEvent) => {
    if (this.isChangingScenes) return;
    console.log('on play: ', customEvent);
    this.isChangingScenes = true;
    // TODO (johnedvard) start an animation, and return a p
    const onMiddle = () => {
      console.log('onMiddle');
      this.currentScene = '';
    };
    const onEnded = () => {
      console.log('onEnded');
      this.level.start();
      this.currentScene = 'l';
    };
    startSceneTransition(1.5, onMiddle, onEnded);
  };

  update() {
    switch (this.currentScene) {
      case 'm':
        return this.mainMenu.update();
      case 'l':
        return this.level.update();
    }
  }
  render(ctx) {
    switch (this.currentScene) {
      case 'm':
        return this.mainMenu.render(ctx);
      case 'l':
        return this.level.render(ctx);
    }
  }
}
