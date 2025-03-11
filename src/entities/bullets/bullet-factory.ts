import { Container } from "pixi.js";
import { Bullet } from "./bullet";
import { BulletView } from "./bullet-view";

export interface BulletContext {
  x: number;
  y: number;
  angle: number;
}

export class BulletFactory {
  private worldContainer;

  constructor(worldContainer: Container) {
    this.worldContainer = worldContainer;
  }

  createBullet(bulletContext: BulletContext) {
    const view = new BulletView();
    this.worldContainer.addChild(view);

    const bullet = new Bullet(view, bulletContext.angle);
    bullet.x = bulletContext.x;
    bullet.y = bulletContext.y;
    return bullet;
  }
}
