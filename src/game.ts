import { Application, Container } from "pixi.js";
import { Hero } from "./entities/hero";
import { PlatformFactory } from "./entities/platforms/platform-factory";
import { KeyboardProcessor } from "./keyboard-processor";
import { Platform } from "./entities/platforms/platform";
import { Box } from "./entities/platforms/box";

class Game {
  private pixiApp;
  private hero;
  private platforms: (Platform | Box)[] = [];
  public keyboardProcessor: KeyboardProcessor;

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    this.hero = new Hero();
    this.hero.position.set(200, 100);
    this.pixiApp.stage.addChild(this.hero);

    const platformFactory = new PlatformFactory(this.pixiApp);

    this.platforms.push(platformFactory.createPlatform(100, 400));
    this.platforms.push(platformFactory.createPlatform(290, 400));
    this.platforms.push(platformFactory.createPlatform(480, 400));
    this.platforms.push(platformFactory.createPlatform(670, 400));
    this.platforms.push(platformFactory.createPlatform(860, 400));

    this.platforms.push(platformFactory.createPlatform(290, 550));

    this.platforms.push(platformFactory.createBox(0, 745));
    this.platforms.push(platformFactory.createBox(190, 745));
    this.platforms.push(platformFactory.createBox(380, 725));

    this.keyboardProcessor = new KeyboardProcessor(this);

    this.setKeys();
  }

  update() {
    const prevPoint = {
      y: this.hero.y,
      x: this.hero.x,
    }; // храним предыдущее знаение героя

    this.hero.update();

    for (let i = 0; i < this.platforms.length; i++) {
      if (this.hero.isJumpState() && this.platforms[i].type !== "box") {
        continue;
      }

      const collisionResult = this.getPlatformCollisionResult(
        this.hero,
        this.platforms[i],
        prevPoint
      );
      if (collisionResult.vertical) {
        this.hero.stay(this.platforms[i].y);
      }
    }
  }

  /* пробегаемся по всем платформам и останавливаем персонажа при коллизии
       Если столкновения больше нет: Это означает, что проблема была вызвана вертикальным перемещением персонажа.
       В этом случае вертикальное смещение отменяется (возвращается к прежнему значению), а горизонтальное перемещение остаётся.
       Если столкновение всё ещё обнаруживается:
       Это указывает на то, что именно горизонтальное движение привело к столкновению.
       огда герой возвращается по горизонтали, то есть его x откатывается до prevPoint.x, а значение y возвращается к currY. */

  getPlatformCollisionResult(
    character: Hero,
    platform: Platform,
    prevPoint: {
      y: number;
      x: number;
    }
  ) {
    const collisionResult = this.getOrientCollisionResult(
      character.getRect(),
      platform,
      prevPoint
    );

    // делаем коллизии только по игреку, по горизонту не нужны
    if (collisionResult.vertical) {
      character.y = prevPoint.y;
    }
    if (collisionResult.horizontal && platform.type === "box") {
      character.x = prevPoint.x;
    }

    return collisionResult;
  }

  // абстрактный метод, который просто возвращает результат коллизии
  getOrientCollisionResult(
    aaRect: { x: number; y: number; width: number; height: number },
    bbRect: Container,
    aaPrevPoint: {
      y: number;
      x: number;
    }
  ) {
    const collisionResult = {
      horizontal: false,
      vertical: false,
    };

    if (!this.isCheckAABB(aaRect, bbRect)) {
      return collisionResult;
    }

    aaRect.y = aaPrevPoint.y;
    if (!this.isCheckAABB(aaRect, bbRect)) {
      collisionResult.vertical = true;
      return collisionResult;
    }

    collisionResult.horizontal = true;
    return collisionResult;
  }

  // коллизия
  isCheckAABB(
    entity: { x: number; y: number; width: number; height: number },
    area: Container
  ) {
    return (
      entity.x < area.x + area.width &&
      entity.x + entity.width > area.x &&
      entity.y < area.y + area.height &&
      entity.y + entity.height > area.y
    );
  }

  setKeys() {
    this.keyboardProcessor.getButton(" ").executeDown = () => {
      if (this.keyboardProcessor.isButtonPressed("s")) {
        this.hero.throwDown();
      } else {
        this.hero.jump();
      }
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
}

export { Game };
