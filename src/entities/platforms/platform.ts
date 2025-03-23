import { Entity } from "../entity";
import { PlatformView } from "./platform-view";

class Platform extends Entity<PlatformView> {
  public isStep = false;

  constructor(view: PlatformView) {
    super(view);
  }
}

export { Platform };
