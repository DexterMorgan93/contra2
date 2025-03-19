import type { EntityType } from "./entity-type";
import { EntityView } from "./entity-view";

export class Entity<T extends EntityView = EntityView> {
  protected view;
  isDead = false;
  gravitable = false;
  type!: EntityType;

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

  get isGravitable() {
    return this.gravitable;
  }
  set isGravitable(value: boolean) {
    this.gravitable = value;
  }

  get collisionBox() {
    return this.view.collisionBox;
  }

  removeFromStage() {
    if (this.view.parent) {
      this.view.removeFromParent();
    }
  }

  update() {}
}
