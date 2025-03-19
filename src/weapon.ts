import {
  BulletContext,
  BulletFactory,
} from "./entities/bullets/bullet-factory";

export class Weapon {
  private currentGun!: (bulletContext: BulletContext) => void;
  private bulletFactory: BulletFactory;

  constructor(bulletFactory: BulletFactory) {
    this.bulletFactory = bulletFactory;
  }

  fire(bulletContext: BulletContext) {
    this.currentGun(bulletContext);
  }

  setWeapon(type: number) {
    switch (type) {
      case 1:
        this.currentGun = this.defaultGun;
        break;
      case 2:
        this.currentGun = this.spreadGun;
        break;
    }
  }

  defaultGun(bulletContext: BulletContext) {
    this.bulletFactory.createBullet(bulletContext);
  }

  spreadGun(bulletContext: BulletContext) {
    console.log("spreadGun");
    let angleShift = -20;

    for (let i = 0; i < 5; i++) {
      const localBulletContext: BulletContext = {
        x: bulletContext.x,
        y: bulletContext.y,
        angle: bulletContext.angle + angleShift,
        type: bulletContext.type,
      };

      this.bulletFactory.createBullet(localBulletContext);
      angleShift += 10;
    }
  }
}
