import { Container } from "pixi.js";
import { Bullet } from "./bullet";
import { BulletView } from "./bullet-view";
import { EntityType } from "../entity-type";
import { Entity } from "../entity";

export interface BulletContext {
  x: number;
  y: number;
  angle: number;
  type: EntityType;
}

export class BulletFactory {
  private worldContainer;
  entities: Entity[];

  constructor(worldContainer: Container, entities: Entity[]) {
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
