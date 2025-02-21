import { Application } from "pixi.js";
import { Hero } from "./entities/hero";
import { Platform } from "./entities/platform";

class Game {
  public pixiApp;
  private hero;
  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    this.hero = new Hero();
    this.hero.x = 200;
    this.hero.y = 300;
    this.pixiApp.stage.addChild(this.hero);

    const platform = new Platform();
    platform.x = 300;
    platform.y = 500;
    this.pixiApp.stage.addChild(platform);
  }

  update() {
    this.hero.update();
  }
}

export { Game };
