import { Bullet } from "./bullet";

export interface BulletContext {
  x: number;
  y: number;
  angle: number;
}

export class BulletFactory {
  constructor() {}

  createBullet(bulletContext: BulletContext) {
    const bullet = new Bullet((bulletContext.angle * Math.PI) / 180);
    bullet.x = bulletContext.x;
    bullet.y = bulletContext.y;
    return bullet;
  }
}
