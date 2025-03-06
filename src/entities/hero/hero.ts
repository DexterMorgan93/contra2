import { Container } from "pixi.js";
import { HeroView } from "./hero-view";

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

  constructor(appStage: Container) {
    this.view = new HeroView();
    appStage.addChild(this.view);
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
    if (this.velocityY > 0 && this.isJumpState()) {
      this.state = states.flyDown;
    }

    // движение вниз
    this.velocityY += this.gravityForce; // скорость становится больше
    this.y += this.velocityY;
  }

  stay(platformY: number) {
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
  }
  throwDown() {
    // прыжок вниз
    this.state = states.jump;
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
}

export { Hero };
