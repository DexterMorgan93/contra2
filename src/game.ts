import { Application, Container, ContainerChild, Rectangle } from "pixi.js";
import { Hero } from "./entities/hero/hero";
import { PlatformFactory } from "./entities/platforms/platform-factory";
import { KeyboardProcessor } from "./keyboard-processor";
import { Platform } from "./entities/platforms/platform";
import { Box } from "./entities/platforms/box";
import { Camera } from "./camera";
import { BulletFactory } from "./entities/bullets/bullet-factory";
import { Bullet } from "./entities/bullets/bullet";
import { Runner } from "./entities/enemies/runner/runner";
import { RunnerFactory } from "./entities/enemies/runner/runner-factory";
import { HeroFactory } from "./entities/hero/hero-factory";

export interface CameraSettings {
  target: Hero;
  world: Container<ContainerChild>;
  screenSize: Rectangle;
  maxWorldWidth: number;
  isBackScrollX: boolean;
}

class Game {
  private pixiApp;
  private hero;
  private platforms: (Platform | Box)[] = [];
  private camera: Camera;
  private worldContainer: Container;
  private bulletfactory: BulletFactory;
  private bullets: Bullet[] = [];
  private runnerFctory: RunnerFactory;
  private enemies: Runner[] = [];
  public keyboardProcessor: KeyboardProcessor;

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    this.worldContainer = new Container();
    this.pixiApp.stage.addChild(this.worldContainer);

    const herofactory = new HeroFactory(this.worldContainer);
    this.hero = herofactory.create(100, 100);

    const platformFactory = new PlatformFactory(this.worldContainer);

    this.platforms.push(platformFactory.createPlatform(100, 400));
    // this.platforms.push(platformFactory.createPlatform(290, 400));
    this.platforms.push(platformFactory.createPlatform(480, 400));
    this.platforms.push(platformFactory.createPlatform(670, 400));
    this.platforms.push(platformFactory.createPlatform(1060, 400));

    this.platforms.push(platformFactory.createPlatform(290, 550));

    this.platforms.push(platformFactory.createBox(0, 745));
    this.platforms.push(platformFactory.createBox(190, 745));
    this.platforms.push(platformFactory.createBox(590, 745));
    this.platforms.push(platformFactory.createBox(990, 745));

    const box = platformFactory.createBox(380, 725);
    box.isStep = true;
    this.platforms.push(box);

    this.keyboardProcessor = new KeyboardProcessor(this);
    this.setKeys();

    const cameraSettings: CameraSettings = {
      target: this.hero,
      world: this.worldContainer,
      screenSize: this.pixiApp.screen,
      maxWorldWidth: this.worldContainer.width,
      isBackScrollX: false,
    };

    this.camera = new Camera(cameraSettings);

    this.bulletfactory = new BulletFactory(this.worldContainer);

    this.runnerFctory = new RunnerFactory(this.worldContainer);
    this.enemies.push(this.runnerFctory.create(800, 100));
    this.enemies.push(this.runnerFctory.create(1000, 100));
  }

  update() {
    this.hero.update();

    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update();

      let isDead = false;

      for (let bullet of this.bullets) {
        if (
          this.isCheckAABB(bullet.collisionBox, this.enemies[i].collisionBox)
        ) {
          isDead = true;
          bullet.isDead = true;
          break;
        }
      }

      this.checkEnemy(this.enemies[i], i, isDead);
    }

    for (let platform of this.platforms) {
      if (this.hero.isJumpState() && platform.type !== "box") {
        continue;
      }
      this.checkPlatformCollision(this.hero, platform);

      for (let enemy of this.enemies) {
        if (enemy.isJumpState() && platform.type !== "box") {
          continue;
        }
        this.checkPlatformCollision(enemy, platform);
      }
    }

    this.camera.update();

    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update();
      this.checkbullet(this.bullets[i], i);
    }
  }

  private checkbullet(bullet: Bullet, index: number) {
    if (
      bullet.isDead ||
      bullet.x > this.pixiApp.screen.width - this.worldContainer.x ||
      bullet.x < 0 ||
      bullet.y > this.pixiApp.screen.height - this.worldContainer.y ||
      bullet.y < 0
    ) {
      bullet.removeFromStage();
      this.bullets.splice(index, 1);
    }
  }

  private checkEnemy(enemy: Runner, index: number, isDead: boolean) {
    if (
      isDead ||
      enemy.x > this.pixiApp.screen.width - this.worldContainer.x ||
      enemy.x < 0 ||
      enemy.y > this.pixiApp.screen.height - this.worldContainer.y ||
      enemy.y < 0
    ) {
      enemy.removeFromParent();
      this.enemies.splice(index, 1);
    }
  }

  /* пробегаемся по всем платформам и останавливаем персонажа при коллизии
       Если столкновения больше нет: Это означает, что проблема была вызвана вертикальным перемещением персонажа.
       В этом случае вертикальное смещение отменяется (возвращается к прежнему значению), а горизонтальное перемещение остаётся.
       Если столкновение всё ещё обнаруживается:
       Это указывает на то, что именно горизонтальное движение привело к столкновению.
       огда герой возвращается по горизонтали, то есть его x откатывается до prevPoint.x, а значение y возвращается к currY. */

  checkPlatformCollision(character: Hero | Runner, platform: Platform) {
    const prevPoint = character.getPrevpont;
    const collisionResult = this.getOrientCollisionResult(
      character.collisionBox,
      platform,
      prevPoint
    );

    // делаем коллизии только по игреку, по горизонту не нужны
    if (collisionResult.vertical) {
      character.y = prevPoint.y;
      character.stay(platform.y);
    }
    if (collisionResult.horizontal && platform.type === "box") {
      if (platform.isStep) {
        // если персонаж сразу залазит на платформу, как ступенька
        character.stay(platform.y);
      } else {
        character.x = prevPoint.x;
      }
    }
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
    area: { x: number; y: number; width: number; height: number }
  ) {
    return (
      entity.x < area.x + area.width &&
      entity.x + entity.width > area.x &&
      entity.y < area.y + area.height &&
      entity.y + entity.height > area.y
    );
  }

  setKeys() {
    this.keyboardProcessor.getButton("Enter").executeDown = () => {
      const bullet = this.bulletfactory.createBullet(this.hero.bulletContext);
      this.bullets.push(bullet);
    };

    this.keyboardProcessor.getButton(" ").executeDown = () => {
      if (
        this.keyboardProcessor.isButtonPressed("s") &&
        !(
          this.keyboardProcessor.isButtonPressed("a") ||
          this.keyboardProcessor.isButtonPressed("d")
        )
      ) {
        this.hero.throwDown();
      } else {
        this.hero.jump();
      }
    };

    const leftMove = this.keyboardProcessor.getButton("a");
    leftMove.executeDown = () => {
      this.hero.startLeftMove();
      this.hero.setView(this.getMoveButtonContext());
    };
    leftMove.executeUp = () => {
      this.hero.stopLeftMove();
      this.hero.setView(this.getMoveButtonContext());
    };

    const rightMove = this.keyboardProcessor.getButton("d");
    rightMove.executeDown = () => {
      this.hero.startRightMove();
      this.hero.setView(this.getMoveButtonContext());
    };
    rightMove.executeUp = () => {
      this.hero.stopRightMove();
      this.hero.setView(this.getMoveButtonContext());
    };

    const arrowUp = this.keyboardProcessor.getButton("w");
    arrowUp.executeDown = () => {
      this.hero.setView(this.getMoveButtonContext());
    };
    arrowUp.executeUp = () => {
      this.hero.setView(this.getMoveButtonContext());
    };

    const arrowDown = this.keyboardProcessor.getButton("s");
    arrowDown.executeDown = () => {
      this.hero.setView(this.getMoveButtonContext());
    };
    arrowDown.executeUp = () => {
      this.hero.setView(this.getMoveButtonContext());
    };
  }

  getMoveButtonContext() {
    const buttonContext = {
      leftMove: false,
      rightMove: false,
      arrowUp: false,
      arrowDown: false,
    };
    buttonContext.leftMove = this.keyboardProcessor.isButtonPressed("a");
    buttonContext.rightMove = this.keyboardProcessor.isButtonPressed("d");
    buttonContext.arrowUp = this.keyboardProcessor.isButtonPressed("w");
    buttonContext.arrowDown = this.keyboardProcessor.isButtonPressed("s");

    return buttonContext;
  }
}

export { Game };
