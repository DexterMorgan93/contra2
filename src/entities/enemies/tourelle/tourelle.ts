import { Entity } from "../../entity";
import { Hero } from "../../hero/hero";
import { TourelleView } from "./tourelle-view";

export class Tourelle extends Entity<TourelleView> {
  private target: Hero;
  public type = "characterEnemy";

  constructor(view: TourelleView, target: Hero) {
    super(view);
    this.target = target;
  }

  update() {
    // вычисляем угол
    let angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
    this.view.rotation = angle;
  }
}
