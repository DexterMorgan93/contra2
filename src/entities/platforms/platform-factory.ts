import { Platform } from "./platform";
import { World } from "../../world";
import { Graphics } from "pixi.js";
import { PlatformView } from "./platform-view";
import { EntityType } from "../entity-type";

export class PlatformFactory {
  private platformWidth = 128;
  private platformHeight = 24;
  private worldContainer;

  constructor(worldContainer: World) {
    this.worldContainer = worldContainer;
  }

  createPlatform(x: number, y: number): Platform {
    const skin = new Graphics();
    skin.setStrokeStyle({
      width: 2,
      color: 0x00ff00,
    });
    skin.rect(0, 0, this.platformWidth, this.platformHeight);
    skin.fill({ color: 0x00ff00 });
    skin.stroke();
    skin.setStrokeStyle({
      width: 1,
      color: 0x694216,
    });
    skin.rect(
      0,
      this.platformHeight,
      this.platformWidth,
      this.platformHeight * 20
    );
    skin.fill({ color: 0xaaaaaa, alpha: 0.5 });
    skin.stroke();

    const view = new PlatformView({
      width: this.platformWidth,
      height: this.platformHeight,
    });
    view.addChild(skin);

    const platform = new Platform(view);
    platform.x = x;
    platform.y = y;
    this.worldContainer.background.addChild(view);
    return platform;
  }

  createBox(x: number, y: number): Platform {
    const skin = new Graphics();
    skin.setStrokeStyle({
      width: 2,
      color: 0x00faff,
    });
    skin.rect(0, 0, this.platformWidth, this.platformHeight);
    skin.stroke();
    skin.setStrokeStyle({
      width: 1,
      color: 0x694216,
    });
    skin.rect(
      0,
      this.platformHeight,
      this.platformWidth,
      this.platformHeight * 20
    );
    skin.stroke();

    const view = new PlatformView({
      width: this.platformWidth,
      height: this.platformHeight,
    });
    view.addChild(skin);

    const platform = new Platform(view);
    platform.x = x;
    platform.y = y;
    platform.type = EntityType.box;
    this.worldContainer.background.addChild(view);
    return platform;
  }

  createStepBox(x: number, y: number): Platform {
    const box = this.createBox(x, y);

    box.isStep = true;
    return box;
  }

  createWater(x: number, y: number): Platform {
    const skin = new Graphics();
    skin.setStrokeStyle({
      width: 2,
      color: 0x0000ff,
    });
    skin.rect(0, -this.platformHeight, this.platformWidth, this.platformHeight);
    skin.fill({ color: 0x0000ff });
    skin.stroke();

    const view = new PlatformView({
      width: this.platformWidth,
      height: this.platformHeight,
    });
    view.addChild(skin);

    const platform = new Platform(view);
    platform.x = x;
    platform.y = y;
    platform.type = EntityType.box;
    this.worldContainer.foreground.addChild(view);
    return platform;
  }

  createBossWall(x: number, y: number): Platform {
    const skin = new Graphics();
    skin.setStrokeStyle({
      width: 2,
      color: 0x00aefe,
    });
    skin.rect(0, 0, this.platformWidth * 3, 600);
    skin.stroke();

    const view = new PlatformView({
      width: this.platformWidth * 3,
      height: 768,
    });
    view.addChild(skin);

    const platform = new Platform(view);
    platform.x = x;
    platform.y = y;
    platform.type = EntityType.box;
    this.worldContainer.background.addChild(view);
    return platform;
  }

  createBridge(x: number, y: number): Platform {
    const skin = new Graphics();
    skin.setStrokeStyle({
      width: 2,
      color: 0xffffff,
    });
    skin.rect(0, 0, this.platformWidth, this.platformHeight * 3);
    skin.stroke();

    const view = new PlatformView({
      width: this.platformWidth,
      height: this.platformHeight,
    });
    view.addChild(skin);

    const platform = new Platform(view);
    platform.x = x;
    platform.y = y;
    this.worldContainer.background.addChild(view);
    return platform;
  }
}
