import { Container, Graphics } from "pixi.js";

export class BulletView extends Container {
  private collisionBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  constructor() {
    super();

    this.collisionBox.x = 5;
    this.collisionBox.y = 5;

    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "0xffff00",
    });
    view.rect(0, 0, 5, 5);
    view.stroke();
    this.addChild(view);
  }

  get getCollisionbox() {
    this.collisionBox.x = this.x;
    this.collisionBox.y = this.y;
    return this.collisionBox;
  }
}
