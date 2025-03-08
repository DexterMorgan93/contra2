import { BulletContext } from "../bullets/bullet-factory";
import { IBulletContext } from "./hero";
import { HeroView } from "./hero-view";

export class HeroWeaponUnit {
  private bulletAngle = 0;
  private bulletContextP: BulletContext = {
    x: 0,
    y: 0,
    angle: 0,
  };
  private heroView: HeroView;

  constructor(heroView: HeroView) {
    this.heroView = heroView;
  }

  get bulletContext() {
    this.bulletContextP.x =
      this.heroView.x + this.heroView.getBulletPointShift.x;
    this.bulletContextP.y =
      this.heroView.y + +this.heroView.getBulletPointShift.y;
    this.bulletContextP.angle = this.heroView.isFlpped
      ? this.bulletAngle * -1 + 180
      : this.bulletAngle;
    return this.bulletContextP;
  }

  setBulletAngle(buttonContext: IBulletContext, isJump: boolean) {
    if (buttonContext.leftMove || buttonContext.rightMove) {
      if (buttonContext.arrowUp) {
        this.bulletAngle = -45;
      } else if (buttonContext.arrowDown) {
        this.bulletAngle = 45;
      } else {
        this.bulletAngle = 0;
      }
    } else {
      if (buttonContext.arrowUp) {
        this.bulletAngle = -90;
      } else if (buttonContext.arrowDown && isJump) {
        this.bulletAngle = 90;
      } else {
        this.bulletAngle = 0;
      }
    }
  }
}
