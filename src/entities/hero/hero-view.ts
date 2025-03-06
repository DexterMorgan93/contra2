import { Container, Graphics } from "pixi.js";

export class HeroView extends Container {
  private bounds = {
    width: 0,
    height: 0,
  };

  private collisionBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  constructor() {
    super();

    this.bounds.width = 20;
    this.bounds.height = 90;
    this.collisionBox.width = this.bounds.width;
    this.collisionBox.height = this.bounds.height;

    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "yellow",
    });
    view.rect(0, 0, 20, 90);
    view.rect(0, 30, 60, 10);
    view.stroke();

    view.pivot.x = this.bounds.width / 2;
    view.x = this.bounds.width / 2;
    // view.scale.x *= -1;
    this.addChild(view);
  }

  get collisionbox() {
    this.collisionBox.x = this.x;
    this.collisionBox.y = this.y;
    return this.collisionBox;
  }
}
