import { Container } from "pixi.js";
import { RunnerView } from "./runner-view";

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

export class Runner {
  private gravityForce = 0.2;
  private jumpForce = 9;
  private speed = 3;
  private velocityX = 0;
  private velocityY = 0;
  private movement = {
    x: 0,
    y: 0,
  };
  private state = states.stay;

  private view: RunnerView;

  constructor(appStage: Container) {
    this.view = new RunnerView();
    appStage.addChild(this.view);

    this.state = states.jump;
    this.view.showJump();
  }

  private prevPoint = {
    y: 0,
    x: 0,
  }; // храним предыдущее знаение героя

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

  isJumpState() {
    return this.state === states.jump;
  }

  setView(buttonContext: IBulletContext) {
    this.view.flip(this.movement.x);

    if (this.isJumpState() || this.state === states.flyDown) {
      return;
    }

    if (buttonContext.leftMove || buttonContext.rightMove) {
      this.view.showRun();
    }
  }
}
