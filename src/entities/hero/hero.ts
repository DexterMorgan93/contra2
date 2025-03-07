import { Container } from "pixi.js";
import { HeroView } from "./hero-view";
import { BulletContext } from "../bullets/bullet-factory";

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

class Hero {
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

  private view: HeroView;

  private isLay = false;
  private isStayUp = false;

  private bulletContextP: BulletContext = {
    x: 0,
    y: 0,
    angle: 0,
  };
  private bulletAngle: number = 0;

  constructor(appStage: Container) {
    this.view = new HeroView();
    this.view.showStay();
    appStage.addChild(this.view);

    this.state = states.jump;
    this.view.showJump();
  }

  get bulletContext() {
    this.bulletContextP.x = this.x;
    this.bulletContextP.y = this.y;
    this.bulletContextP.angle = this.bulletAngle;
    return this.bulletContextP;
  }

  getCollisionBox() {
    return this.view.collisionbox;
  }

  get x() {
    return this.view.x;
  }
  set x(value: number) {
    this.view.x = value;
  }
  get y() {
    return this.view.y;
  }
  set y(value: number) {
    this.view.y = value;
  }

  update() {
    // движение по горизонтали
    this.velocityX = this.speed * this.movement.x;
    this.x += this.velocityX;

    // проверяем, находится ли герой в прыжке и в падении
    if (this.velocityY > 0) {
      if (!(this.state === states.jump || this.state === states.flyDown)) {
        this.view.showFall();
      }
      this.state = states.flyDown;
    }

    // движение вниз
    this.velocityY += this.gravityForce; // скорость становится больше
    this.y += this.velocityY;
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
    }

    this.state = states.stay;
    this.velocityY = 0;

    this.y = platformY - this.view.collisionbox.height;
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
    this.setBulletAngle(buttonContext);

    if (this.state === states.jump || this.state === states.flyDown) {
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
        console.log(buttonContext);
        this.view.showStayUp();
      } else if (buttonContext.arrowDown) {
        this.view.showLay();
      } else {
        this.view.showStay();
      }
    }
  }

  setBulletAngle(buttonContext: IBulletContext) {
    if (buttonContext.leftMove || buttonContext.rightMove) {
      if (buttonContext.arrowUp) {
        this.bulletAngle = -45;
      } else if (buttonContext.arrowDown) {
        this.bulletAngle = 45;
      } else {
        this.bulletAngle = 0;
      }
    } else {
      if (buttonContext.arrowUp) {
        this.bulletAngle = -90;
      } else if (buttonContext.arrowDown && this.state === states.jump) {
        this.bulletAngle = 90;
      } else {
        this.bulletAngle = 0;
      }
    }
  }
}

export { Hero };
