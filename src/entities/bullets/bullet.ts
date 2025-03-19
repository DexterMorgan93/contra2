import { Entity } from "../entity";
import { EntityType } from "../entity-type";
import { BulletView } from "./bullet-view";

export class Bullet extends Entity<BulletView> {
  private speed = 10;
  private angleBullet: number;
  declare type: EntityType;

  constructor(view: BulletView, angleBullet: number) {
    super(view);
    this.angleBullet = (angleBullet * Math.PI) / 180;
  }

  update() {
    this.x += this.speed * Math.cos(this.angleBullet);
    this.y += this.speed * Math.sin(this.angleBullet);
  }
}
