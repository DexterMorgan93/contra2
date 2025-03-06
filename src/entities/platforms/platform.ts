import { Container, Graphics } from "pixi.js";

class Platform extends Container {
  public type = "platform";
  public isStep = false;

  constructor() {
    super();
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: 0x00ff00,
    });
    view.rect(0, 0, 190, 20);
    view.stroke();
    this.addChild(view);
  }
}

export { Platform };
