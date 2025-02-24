import { Application, Container } from "pixi.js";
import { Hero } from "./entities/hero";
import { Platform } from "./entities/platform";

class Game {
  private pixiApp;
  private hero;
  private platforms: Container[] = [];

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    this.hero = new Hero();
    this.hero.x = 200;
    this.hero.y = 100;
    this.pixiApp.stage.addChild(this.hero);

    const platform1 = new Platform();
    platform1.x = 150;
    platform1.y = 400;
    this.pixiApp.stage.addChild(platform1);

    const platform2 = new Platform();
    platform2.x = 300;
    platform2.y = 500;
    this.pixiApp.stage.addChild(platform2);

    const platform3 = new Platform();
    platform3.x = 500;
    platform3.y = 400;
    this.pixiApp.stage.addChild(platform3);

    this.platforms.push(platform1);
    this.platforms.push(platform2);
    this.platforms.push(platform3);
  }

  update() {
    const prevPoint = {
      y: this.hero.y,
      x: this.hero.x,
    }; // храним предыдущее знаение героя

    this.hero.update();

    // пробегаемся по всем платформам и останавливаем героя при коллизии
    /* Если столкновения больше нет: Это означает, что проблема была вызвана вертикальным перемещением героя.
         В этом случае вертикальное смещение отменяется (возвращается к прежнему значению), а горизонтальное перемещение остаётся.
         Если столкновение всё ещё обнаруживается:
         Это указывает на то, что именно горизонтальное движение привело к столкновению.
         огда герой возвращается по горизонтали, то есть его x откатывается до prevPoint.x, а значение y возвращается к currY. */

    for (let i = 0; i < this.platforms.length; i++) {
      if (!this.isCheckAABB(this.hero, this.platforms[i])) {
        continue;
      }

      const currY = this.hero.y;
      this.hero.y = prevPoint.y;
      if (!this.isCheckAABB(this.hero, this.platforms[i])) {
        this.hero.stay();
        continue;
      }

      this.hero.y = currY;
      this.hero.x = prevPoint.x;
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
