import { Container, Graphics } from "pixi.js";

export class TourelleView extends Container {
  private gunView: Graphics;

  private collisionBox = {
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
      color: "0xff0000",
    });
    view.circle(0, 0, 50);
    view.stroke();
    this.addChild(view);

    this.gunView = new Graphics();
    this.gunView.setStrokeStyle({
      width: 2,
      color: "0xff0000",
    });
    view.rect(0, 0, 70, 10);
    this.gunView.pivot.set(5, 5);
    view.stroke();
    this.addChild(this.gunView);
  }

  get gunRotation() {
    return this.gunView.rotation;
  }

  set gunRotation(value: number) {
    this.gunView.rotation = value;
  }

  get getCollisionbox() {
    this.collisionBox.x = this.pivot.x;
    this.collisionBox.y = this.pivot.y;
    return this.collisionBox;
  }
}
