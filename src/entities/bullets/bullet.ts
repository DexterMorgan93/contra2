import { Container, Graphics } from "pixi.js";

export class Bullet extends Container {
  private speed = 10;
  private angleBullet: number;

  constructor(angleBullet: number) {
    super();
    this.angleBullet = (angleBullet * Math.PI) / 180;
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "0xffff00",
    });
    view.rect(0, 0, 5, 5);
    view.stroke();
    this.addChild(view);
  }

  update() {
    this.x += this.speed * Math.cos(this.angleBullet);
    this.y += this.speed * Math.sin(this.angleBullet);
  }
}
