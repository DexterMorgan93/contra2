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
    this.hero.position.set(200, 100);
    this.pixiApp.stage.addChild(this.hero);

    const platform1 = new Platform();
    platform1.position.set(150, 400);
    this.pixiApp.stage.addChild(platform1);

    const platform2 = new Platform();
    platform2.position.set(300, 500);
    this.pixiApp.stage.addChild(platform2);

    const platform3 = new Platform();
    platform3.position.set(500, 400);
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

  onKeyDown(key: string) {
    if (key === "a") {
      this.hero.startLeftMove();
    }
    if (key === "d") {
      this.hero.startRightMove();
    }
    if (key === " ") {
      this.hero.jump();
    }
  }

  onKeyUp(key: string) {
    if (key === "a") {
      this.hero.stopLeftMove();
    }
    if (key === "d") {
      this.hero.stopRightMove();
    }
  }
}

export { Game };
