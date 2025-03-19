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
import { Physics } from "./physics";
import { TourellFactory } from "./entities/enemies/tourelle/tourelle-factory";
import { Tourelle } from "./entities/enemies/tourelle/tourelle";
import { EntityType } from "./entities/entity-type";
import { Entity } from "./entities/entity";

export interface CameraSettings {
  target: Hero;
  world: Container<ContainerChild>;
  screenSize: Rectangle;
  maxWorldWidth: number;
  isBackScrollX: boolean;
}

type CharacterEntity = Hero | Runner;

class Game {
  private pixiApp;
  private hero;
  private platforms: (Platform | Box)[] = [];
  private camera: Camera;
  private worldContainer: Container;
  private bulletfactory: BulletFactory;
  private runnerFctory: RunnerFactory;
  public keyboardProcessor: KeyboardProcessor;

  private entities: Entity[] = [];

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    this.worldContainer = new Container();
    this.pixiApp.stage.addChild(this.worldContainer);

    const herofactory = new HeroFactory(this.worldContainer);
    this.hero = herofactory.create(100, 100);

    this.entities.push(this.hero);

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

    this.bulletfactory = new BulletFactory(this.worldContainer, this.entities);

    this.runnerFctory = new RunnerFactory(this.worldContainer);
    this.entities.push(this.runnerFctory.create(800, 100));
    this.entities.push(this.runnerFctory.create(1000, 100));

    const tourelle = new TourellFactory(
      this.worldContainer,
      this.hero,
      this.bulletfactory
    );
    this.entities.push(tourelle.create(500, 100));
  }

  update() {
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      entity.update();

      if (entity.type === EntityType.hero || entity.type === EntityType.enemy) {
        this.checkDamage(entity as CharacterEntity);
        this.checkPlatforms(entity as CharacterEntity);
      }

      this.checkEntityStatus(entity, i);
    }

    this.camera.update();
  }

  private checkDamage(entity: CharacterEntity) {
    const damagers = this.entities.filter(
      (damager) =>
        (entity.type === EntityType.enemy &&
          damager.type === EntityType.heroBullet) ||
        (entity.type === EntityType.hero &&
          (damager.type === EntityType.enemyBullet ||
            damager.type === EntityType.enemy))
    );

    for (const damager of damagers) {
      if (Physics.isCheckAABB(damager.collisionBox, entity.collisionBox)) {
        entity.damage();
        if (damager.type !== EntityType.enemy) {
          damager.dead();
        }
        break;
      }
    }
  }

  private checkEntityStatus(entity: Entity, i: number) {
    if (entity.isDead || this.isScreenOut(entity)) {
      entity.removeFromStage();
      this.entities.splice(i, 1);
    }
  }

  private isScreenOut(entity: Entity) {
    return (
      entity.x > this.pixiApp.screen.width - this.worldContainer.x ||
      entity.x < -this.worldContainer.x ||
      entity.y > this.pixiApp.screen.height ||
      entity.y < 0
    );
  }

  private checkPlatforms(character: CharacterEntity) {
    if (character.isDead || !character.isGravitable) {
      return;
    }

    for (let platform of this.platforms) {
      if (character instanceof Hero || character instanceof Runner) {
        if (character.isJumpState() && platform.type !== EntityType.box) {
          continue;
        }
        this.checkPlatformCollision(character, platform);
      }
    }
  }

  /* пробегаемся по всем платформам и останавливаем персонажа при коллизии
       Если столкновения больше нет: Это означает, что проблема была вызвана вертикальным перемещением персонажа.
       В этом случае вертикальное смещение отменяется (возвращается к прежнему значению), а горизонтальное перемещение остаётся.
       Если столкновение всё ещё обнаруживается:
       Это указывает на то, что именно горизонтальное движение привело к столкновению.
       огда герой возвращается по горизонтали, то есть его x откатывается до prevPoint.x, а значение y возвращается к currY. */

  checkPlatformCollision(character: CharacterEntity, platform: Platform) {
    const prevPoint = character.getPrevpont;
    const collisionResult = Physics.getOrientCollisionResult(
      character.collisionBox,
      platform,
      prevPoint
    );

    // делаем коллизии только по игреку, по горизонту не нужны
    if (collisionResult.vertical) {
      character.y = prevPoint.y;
      character.stay(platform.y);
    }
    if (collisionResult.horizontal && platform.type === EntityType.box) {
      if (platform.isStep) {
        // если персонаж сразу залазит на платформу, как ступенька
        character.stay(platform.y);
      } else {
        character.x = prevPoint.x;
      }
    }
  }

  setKeys() {
    this.keyboardProcessor.getButton("Enter").executeDown = () => {
      this.bulletfactory.createBullet(this.hero.bulletContext);
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
