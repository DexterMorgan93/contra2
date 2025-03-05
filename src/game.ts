import { Application, Container } from "pixi.js";
import { Hero } from "./entities/hero";
import { PlatformFactory } from "./entities/platforms/platform-factory";

class Game {
  private pixiApp;
  private hero;
  private platforms: Container[] = [];

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    this.hero = new Hero();
    this.hero.position.set(200, 100);
    this.pixiApp.stage.addChild(this.hero);

    const platformFactory = new PlatformFactory(this.pixiApp);

    this.platforms.push(platformFactory.createPlatform(150, 400));
    this.platforms.push(platformFactory.createPlatform(300, 500));
    this.platforms.push(platformFactory.createPlatform(500, 400));
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
