import { Container, Graphics } from "pixi.js";

class Hero extends Container {
  private gravityForce = 0.1;
  private velocityX = 0;
  private velocityY = 0;

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
    // движение вниз
    this.velocityY += this.gravityForce; // скорость становится больше
    this.y += this.velocityY;
  }

  stay() {
    this.velocityY = 0;
  }
}

export { Hero };
