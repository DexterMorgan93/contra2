import { Container, Graphics } from "pixi.js";
import { EntityType } from "../entity-type";

class Box extends Container {
  public type = EntityType.box;
  public isStep = false;

  constructor() {
    super();
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: 0x00ff,
    });
    view.rect(0, 0, 128, 24);
    view.stroke();
    this.addChild(view);
  }
}

export { Box };
