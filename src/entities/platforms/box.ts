import { Container, Graphics } from "pixi.js";

class Box extends Container {
  public type = "box";
  constructor() {
    super();
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: 0x00ff,
    });
    view.rect(0, 0, 190, 20);
    view.stroke();
    this.addChild(view);
  }
}

export { Box };
