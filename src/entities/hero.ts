import { Container, Graphics } from "pixi.js";

class Hero extends Container {
  public gravityForce = 1;

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
    // движение вниз и направо
    this.y += this.gravityForce;
    this.x += this.gravityForce;
  }
}

export { Hero };
