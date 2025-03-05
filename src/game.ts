import { Application, Container } from "pixi.js";
import { Hero } from "./entities/hero";
import { PlatformFactory } from "./entities/platforms/platform-factory";
import { KeyboardProcessor } from "./keyboard-processor";
import { Platform } from "./entities/platforms/platform";

class Game {
  private pixiApp;
  private hero;
  private platforms: Container[] = [];
  public keyboardProcessor: KeyboardProcessor;

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    this.hero = new Hero();
    this.hero.position.set(200, 100);
    this.pixiApp.stage.addChild(this.hero);

    const platformFactory = new PlatformFactory(this.pixiApp);

    this.platforms.push(platformFactory.createPlatform(150, 400));
    this.platforms.push(platformFactory.createPlatform(300, 500));
    this.platforms.push(platformFactory.createPlatform(500, 400));

    this.keyboardProcessor = new KeyboardProcessor(this);

    this.keyboardProcessor.getButton(" ").executeDown = () => {
      this.hero.jump();
    };
    this.keyboardProcessor.getButton("a").executeDown = () => {
      this.hero.startLeftMove();
    };
    this.keyboardProcessor.getButton("a").executeUp = () => {
      this.hero.stopLeftMove();
    };
    this.keyboardProcessor.getButton("d").executeDown = () => {
      this.hero.startRightMove();
    };
    this.keyboardProcessor.getButton("d").executeUp = () => {
      this.hero.stopRightMove();
    };
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
      const collisionResult = this.getPlatformCollisionResult(
        this.hero,
        this.platforms[i],
        prevPoint
      );
      if (collisionResult.vertical) {
        this.hero.stay();
      }
    }
  }

  getPlatformCollisionResult(
    character: Container,
    platform: Platform,
    prevPoint: {
      y: number;
      x: number;
    }
  ) {
    const collisionResult = {
      horizontal: false,
      vertical: false,
    };

    if (!this.isCheckAABB(character, platform)) {
      return collisionResult;
    }

    const currY = character.y;
    character.y = prevPoint.y;
    if (!this.isCheckAABB(character, platform)) {
      collisionResult.vertical = true;
      return collisionResult;
    }

    character.y = currY;
    character.x = prevPoint.x;
    collisionResult.horizontal = true;
    return collisionResult;
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
