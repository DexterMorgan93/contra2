import { Container, Graphics } from "pixi.js";

const states = {
  stay: "stay",
  jump: "jump",
  flyDown: "flyDown",
};

class Hero extends Container {
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
  private rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  constructor() {
    super();
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "yellow",
    });
    view.rect(0, 0, 20, 90);
    view.stroke();
    this.addChild(view);
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

    this.y = platformY - this.height;
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

  getRect() {
    this.rect.x = this.x;
    this.rect.y = this.y;
    this.rect.width = this.width;
    this.rect.height = this.height;

    return this.rect;
  }
}

export { Hero };
