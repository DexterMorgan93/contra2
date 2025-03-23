import { HeroView } from "./hero-view";
import { HeroWeaponUnit } from "./hero-weapon-unit";
import { Entity } from "../entity";
import { EntityType } from "../entity-type";

export interface IBulletContext {
  leftMove: boolean;
  rightMove: boolean;
  arrowUp: boolean;
  arrowDown: boolean;
}

const states = {
  stay: "stay",
  jump: "jump",
  flyDown: "flyDown",
};

class Hero extends Entity<HeroView> {
  private gravityForce = 0.2;
  private jumpForce = 9;
  private speed = 3;
  private velocityX = 0;
  private velocityY = 0;
  private movement = {
    x: 0,
    y: 0,
  };
  // надо запоминать контекст куда ты двигался, так как ты можешь зажать обе кнопки, при отпускании зажатая должна работать
  private directionContext = {
    left: 0,
    right: 0,
  };
  private state = states.stay;

  private isLay = false;
  private isStayUp = false;
  public isFall = false;

  private heroWeaponUnit: HeroWeaponUnit;

  public type = EntityType.hero;

  constructor(view: HeroView) {
    super(view);

    this.heroWeaponUnit = new HeroWeaponUnit(view);

    this.state = states.jump;
    this.view.showJump();

    this.isGravitable = true;
    this.isActive = true;
  }

  private prevPoint = {
    y: 0,
    x: 0,
  }; // храним предыдущее знаение героя

  get bulletContext() {
    return this.heroWeaponUnit.bulletContext;
  }

  get getPrevpont() {
    return this.prevPoint;
  }

  update() {
    this.prevPoint.x = this.x; // храним предыдущее знаение героя
    this.prevPoint.y = this.y; // храним предыдущее знаение героя

    // движение по горизонтали
    this.velocityX = this.speed * this.movement.x;
    this.x += this.velocityX;

    // проверяем, находится ли герой в прыжке и в падении
    if (this.velocityY > 0) {
      if (!(this.state === states.jump || this.state === states.flyDown)) {
        this.view.showFall();
        this.isFall = true;
      }
      this.state = states.flyDown;
    }

    // движение вниз
    this.velocityY += this.gravityForce; // скорость становится больше
    this.y += this.velocityY;
  }

  damage() {
    this.dead();
  }

  stay(platformY: number) {
    if (this.state === "jump" || this.state === states.flyDown) {
      const fakeButtonContext = {
        leftMove: false,
        rightMove: false,
        arrowUp: false,
        arrowDown: false,
      };
      fakeButtonContext.leftMove = this.movement.x === -1;
      fakeButtonContext.rightMove = this.movement.x === 1;
      fakeButtonContext.arrowUp = this.isLay;
      fakeButtonContext.arrowDown = this.isStayUp;
      this.state = states.stay;
      this.setView(fakeButtonContext);
      this.isFall = false;
    }

    this.state = states.stay;
    this.velocityY = 0;

    this.y = platformY - this.view.collisionBox.height;
  }

  jump() {
    if (this.state === "jump" || this.state === states.flyDown) {
      return;
    }
    this.state = states.jump;
    this.velocityY -= this.jumpForce;
    this.view.showJump();
  }
  throwDown() {
    // прыжок вниз
    this.state = states.jump;
    this.view.showFall();
    this.isFall = true;
  }

  isJumpState() {
    return this.state === states.jump;
  }

  startLeftMove() {
    this.movement.x = -1;

    // если зажаты обе кнопки, то останавливаем движение
    if (this.directionContext.right > 0) {
      this.movement.x = 0;
      return;
    }

    this.directionContext.left = -1;
  }

  startRightMove() {
    this.movement.x = 1;

    // если зажаты обе кнопки, то останавливаем движение
    if (this.directionContext.left < 0) {
      this.movement.x = 0;
      return;
    }

    this.directionContext.right = 1;
  }

  stopRightMove() {
    this.directionContext.right = 0;
    this.movement.x = this.directionContext.left;
  }

  stopLeftMove() {
    this.directionContext.left = 0;
    this.movement.x = this.directionContext.right;
  }

  setView(buttonContext: IBulletContext) {
    this.view.flip(this.movement.x);
    this.isLay = buttonContext.arrowDown;
    this.isStayUp = buttonContext.arrowUp;

    this.heroWeaponUnit.setBulletAngle(buttonContext, this.isJumpState());

    if (this.isJumpState() || this.state === states.flyDown) {
      return;
    }

    if (buttonContext.leftMove || buttonContext.rightMove) {
      if (buttonContext.arrowUp) {
        this.view.showRunUp();
      } else if (buttonContext.arrowDown) {
        this.view.showRunDown();
      } else {
        this.view.showRun();
      }
    } else {
      if (buttonContext.arrowUp) {
        this.view.showStayUp();
      } else if (buttonContext.arrowDown) {
        this.view.showLay();
      } else {
        this.view.showStay();
      }
    }
  }
}

export { Hero };
