import { Application, Container, ContainerChild, Rectangle } from "pixi.js";
import { Hero } from "./entities/hero/hero";
import { PlatformFactory } from "./entities/platforms/platform-factory";
import { KeyboardProcessor } from "./keyboard-processor";
import { Platform } from "./entities/platforms/platform";
import { Camera } from "./camera";
import { BulletFactory } from "./entities/bullets/bullet-factory";
import { Runner } from "./entities/enemies/runner/runner";
import { HeroFactory } from "./entities/hero/hero-factory";
import { Physics } from "./physics";
import { EntityType } from "./entities/entity-type";
import { Entity } from "./entities/entity";
import { Weapon } from "./weapon";
import { World } from "./world";
import { SceneFactory } from "./scene-factory";
import { EnemyFactory } from "./entities/enemies/enemy-factory";

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
  private platforms: Platform[] = [];
  private camera: Camera;
  private worldContainer: World;
  private bulletfactory: BulletFactory;
  private weapon: Weapon;
  public keyboardProcessor: KeyboardProcessor;

  private entities: Entity[] = [];

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    this.worldContainer = new World();
    this.pixiApp.stage.addChild(this.worldContainer);

    this.bulletfactory = new BulletFactory(
      this.worldContainer.game,
      this.entities
    );

    const herofactory = new HeroFactory(this.worldContainer.game);
    this.hero = herofactory.create(160, 100);

    this.entities.push(this.hero);

    const platformFactory = new PlatformFactory(this.worldContainer);

    const enemyFactory = new EnemyFactory(
      this.worldContainer.game,
      this.hero,
      this.bulletfactory,
      this.entities
    );

    const sceneFactory = new SceneFactory(
      this.platforms,
      platformFactory,
      enemyFactory
    );
    sceneFactory.createScene();

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

    this.weapon = new Weapon(this.bulletfactory);
    this.weapon.setWeapon(2);
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

  private isScreenOut(entity: Entity): boolean {
    if (
      entity.type === EntityType.heroBullet ||
      entity.type === EntityType.enemyBullet
    ) {
      return (
        entity.x > this.pixiApp.screen.width - this.worldContainer.x ||
        entity.x < -this.worldContainer.x ||
        entity.y > this.pixiApp.screen.height ||
        entity.y < 0
      );
    } else if (
      entity.type === EntityType.enemy ||
      entity.type === EntityType.hero
    ) {
      return (
        entity.x < -this.worldContainer.x ||
        entity.y > this.pixiApp.screen.height
      );
    }
    return false;
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

    if (
      character.type === EntityType.hero &&
      character.x < -this.worldContainer.x
    ) {
      character.x = character.getPrevpont.x;
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
      platform.collisionBox,
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
      if (!this.hero.isDead && !this.hero.isFall) {
        this.weapon.fire(this.hero.bulletContext);
      }
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
