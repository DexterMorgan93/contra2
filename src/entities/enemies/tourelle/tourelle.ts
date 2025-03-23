import { BulletContext, BulletFactory } from "../../bullets/bullet-factory";
import { Entity } from "../../entity";
import { EntityType } from "../../entity-type";
import { Hero } from "../../hero/hero";
import { TourelleView } from "./tourelle-view";

export class Tourelle extends Entity<TourelleView> {
  private target: Hero;
  public type = EntityType.enemy;
  private buletFactory: BulletFactory;
  private counter = 0;
  private health = 5;

  constructor(view: TourelleView, target: Hero, buletFactory: BulletFactory) {
    super(view);
    this.target = target;
    this.buletFactory = buletFactory;

    this.isActive = false;
  }

  update() {
    if (this.target.isDead) {
      return;
    }

    if (!this.isActive) {
      // начинает действовать при приближении героя
      if (this.x - this.target.x < 512 + this.collisionBox.width * 2) {
        this.isActive = true;
      }
      return;
    }

    // вычисляем угол
    let angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
    this.view.rotation = angle;

    this.fire(angle);
  }

  damage() {
    this.health--;
    if (this.health < 1) {
      this.dead();
    }
  }

  private fire(angle: number) {
    this.counter++;
    if (this.counter < 50) {
      return;
    }
    const bulletContext: BulletContext = {
      x: this.x,
      y: this.y,
      angle: (angle / Math.PI) * 180,
      type: EntityType.enemyBullet,
    };

    this.buletFactory.createBullet(bulletContext);

    this.counter = 0;
  }
}
