import { Platform } from "./platform";
import { Box } from "./box";
import { World } from "../../world";

export class PlatformFactory {
  private worldContainer;

  constructor(worldContainer: World) {
    this.worldContainer = worldContainer;
  }

  createPlatform(x: number, y: number): Platform {
    const platform = new Platform();
    platform.position.set(x, y);
    this.worldContainer.background.addChild(platform);
    return platform;
  }

  createBox(x: number, y: number): Box {
    const box = new Box();
    box.position.set(x, y);
    this.worldContainer.background.addChild(box);
    return box;
  }

  createStepBox(x: number, y: number): Box {
    const box = new Box();
    box.position.set(x, y);
    box.isStep = true;
    this.worldContainer.background.addChild(box);
    return box;
  }

  createWater(x: number, y: number): Box {
    const box = new Box();
    box.position.set(x, y);
    this.worldContainer.foreground.addChild(box);
    return box;
  }

  createBossWall(x: number, y: number): Box {
    const box = new Box();
    box.position.set(x, y);
    this.worldContainer.background.addChild(box);
    return box;
  }
}
