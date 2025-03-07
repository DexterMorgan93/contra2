import { Bullet } from "./bullet";

export class BulletFactory {
  constructor() {}

  createBullet(x: number, y: number) {
    const bullet = new Bullet();
    bullet.x = x;
    bullet.y = y;
    return bullet;
  }
}
