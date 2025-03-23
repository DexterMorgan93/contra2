import { Hero } from "../hero/hero";
import { Platform } from "./platform";
import { PlatformView } from "./platform-view";

export class BridgePlatform extends Platform {
  private target!: Hero;
  constructor(view: PlatformView) {
    super(view);
  }

  setTarget(target: Hero) {
    this.target = target;
  }

  update() {
    if (this.target !== null) {
      // начинает действовать при ходьбе героя по нему
      if (this.x - this.target.x < -50) {
        this.isActive = false;
        this.dead();
      }
      return;
    }
  }
}
