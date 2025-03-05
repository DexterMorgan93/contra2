import { Application } from "pixi.js";
import { Platform } from "./platform";

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
}
