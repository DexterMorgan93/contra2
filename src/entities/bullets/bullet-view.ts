import { Graphics } from "pixi.js";
import { EntityView } from "../entity-view";

export class BulletView extends EntityView {
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

    this.setHitboxWidth(this.collisionBox.width);
    this.setHitboxHeight(this.collisionBox.height);
  }
}
