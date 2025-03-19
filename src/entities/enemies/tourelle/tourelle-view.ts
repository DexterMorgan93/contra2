import { Container, Graphics } from "pixi.js";
import { EntityView } from "../../entity-view";

export class TourelleView extends EntityView {
  private gunView: Graphics;

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

    this.collisionBox.width = 100;
    this.collisionBox.height = 100;
  }

  get gunRotation() {
    return this.gunView.rotation;
  }

  set gunRotation(value: number) {
    this.gunView.rotation = value;
  }
}
