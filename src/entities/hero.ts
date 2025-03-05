import { Container, Graphics } from "pixi.js";

const states = {
  stay: "stay",
  jump: "jump",
};

class Hero extends Container {
  private gravityForce = 0.1;
  private jumpForce = 5;
  private speed = 2;
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

  constructor() {
    super();
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: 0x00ff00,
    });
    view.rect(0, 0, 20, 60);
    view.stroke();
    this.addChild(view);
  }

  update() {
    // движение по горизонтали
    this.velocityX = this.speed * this.movement.x;
    this.x += this.velocityX;

    // движение вниз
    this.velocityY += this.gravityForce; // скорость становится больше
    this.y += this.velocityY;
  }

  stay() {
    this.state = states.stay;
    this.velocityY = 0;
  }

  jump() {
    if (this.state === "jump") {
      return;
    }
    this.state = states.jump;
    this.velocityY -= this.jumpForce;
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
