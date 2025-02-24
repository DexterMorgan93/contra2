import { Application, Container } from "pixi.js";
import { Hero } from "./entities/hero";
import { Platform } from "./entities/platform";

class Game {
  private pixiApp;
  private hero;
  private platform;

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    this.hero = new Hero();
    this.hero.x = 200;
    this.hero.y = 300;
    this.pixiApp.stage.addChild(this.hero);

    this.platform = new Platform();
    this.platform.x = 150;
    this.platform.y = 500;
    this.pixiApp.stage.addChild(this.platform);
  }

  update() {
    const prevPoint = {
      y: this.hero.y,
      x: this.hero.x,
    }; // храним предыдущее знаение героя
    this.hero.update();

    if (this.isCheckAABB(this.hero, this.platform)) {
      this.hero.y = prevPoint.y;
    }
  }

  // коллизия
  isCheckAABB(entity: Container, area: Container) {
    return (
      entity.x < area.x + area.width &&
      entity.x + entity.width > area.x &&
      entity.y < area.y + area.height &&
      entity.y + entity.height > area.y
    );
  }
}

export { Game };
