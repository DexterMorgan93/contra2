import { Container } from "pixi.js";
import { Platform } from "./platform";
import { Box } from "./box";

export class PlatformFactory {
  private worldContainer;

  constructor(worldContainer: Container) {
    this.worldContainer = worldContainer;
  }

  createPlatform(x: number, y: number): Platform {
    const platform = new Platform();
    platform.position.set(x, y);
    this.worldContainer.addChild(platform);
    return platform;
  }

  createBox(x: number, y: number): Box {
    const box = new Box();
    box.position.set(x, y);
    this.worldContainer.addChild(box);
    return box;
  }
}
