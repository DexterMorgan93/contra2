import { Container } from "pixi.js";
import { Bullet } from "./bullet";
import { BulletView } from "./bullet-view";
import { Hero } from "../hero/hero";
import { Runner } from "../enemies/runner/runner";
import { Tourelle } from "../enemies/tourelle/tourelle";

export interface BulletContext {
  x: number;
  y: number;
  angle: number;
  type: string;
}

export class BulletFactory {
  private worldContainer;
  entities: (Bullet | Hero | Runner | Tourelle)[];

  constructor(
    worldContainer: Container,
    entities: (Bullet | Hero | Runner | Tourelle)[]
  ) {
    this.worldContainer = worldContainer;
    this.entities = entities;
  }

  createBullet(bulletContext: BulletContext) {
    const view = new BulletView();
    this.worldContainer.addChild(view);

    const bullet = new Bullet(view, bulletContext.angle);
    bullet.x = bulletContext.x;
    bullet.y = bulletContext.y;
    bullet.type = bulletContext.type;
    this.entities.push(bullet);
  }
}
