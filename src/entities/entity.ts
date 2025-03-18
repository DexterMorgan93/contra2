import { HeroView } from "./hero/hero-view";
import { RunnerView } from "./enemies/runner/runner-view";
import { BulletView } from "./bullets/bullet-view";
import { TourelleView } from "./enemies/tourelle/tourelle-view";

export abstract class Entity<
  T extends HeroView | RunnerView | BulletView | TourelleView
> {
  protected view: T;
  isDead = false;

  constructor(view: T) {
    this.view = view;
  }

  get x() {
    return this.view.x;
  }
  set x(value: number) {
    this.view.x = value;
  }

  get y() {
    return this.view.y;
  }
  set y(value: number) {
    this.view.y = value;
  }

  get isDeadStatus() {
    return this.isDead;
  }
  dead() {
    this.isDead = true;
  }

  get collisionBox() {
    return this.view.getCollisionbox;
  }

  removeFromStage() {
    if (this.view.parent) {
      this.view.removeFromParent();
    }
  }
}
