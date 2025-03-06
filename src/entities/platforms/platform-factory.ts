import { Application } from "pixi.js";
import { Platform } from "./platform";
import { Box } from "./box";

export class PlatformFactory {
  private pixiApp;

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;
  }

  createPlatform(x: number, y: number): Platform {
    const platform = new Platform();
    platform.position.set(x, y);
    this.pixiApp.stage.addChild(platform);
    return platform;
  }

  createBox(x: number, y: number): Box {
    const box = new Box();
    box.position.set(x, y);
    this.pixiApp.stage.addChild(box);
    return box;
  }
}
