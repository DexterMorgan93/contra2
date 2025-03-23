import { Platform } from "./entities/platforms/platform";
import { PlatformFactory } from "./entities/platforms/platform-factory";

export class SceneFactory {
  #platforms: Platform[];
  #platformFactory: PlatformFactory;
  #blockSize = 128;

  constructor(platforms: Platform[], platformFactory: PlatformFactory) {
    this.#platforms = platforms;
    this.#platformFactory = platformFactory;
  }

  createScene() {
    this.createPlatforms();
    this.createGround();
    this.createWater();
    this.createBossWall();
    this.createBridge();
  }

  private createPlatforms() {
    let xIndexes = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
    this.create(xIndexes, 276, this.#platformFactory.createPlatform);

    xIndexes = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25,
      34, 35, 36, 45, 46, 47, 48,
    ];
    this.create(xIndexes, 384, this.#platformFactory.createPlatform);

    xIndexes = [5, 6, 7, 13, 14, 31, 32, 49];
    this.create(xIndexes, 492, this.#platformFactory.createPlatform);

    xIndexes = [46, 47, 48];
    this.create(xIndexes, 578, this.#platformFactory.createPlatform);

    xIndexes = [8, 11, 28, 29, 30];
    this.create(xIndexes, 600, this.#platformFactory.createPlatform);

    xIndexes = [50];
    this.create(xIndexes, 624, this.#platformFactory.createPlatform);
  }

  private createGround() {
    let xIndexes = [9, 10, 25, 26, 27, 32, 33, 34];
    this.create(xIndexes, 720, this.#platformFactory.createStepBox);

    xIndexes = [36, 37, 39, 40];
    this.create(xIndexes, 600, this.#platformFactory.createBox);

    xIndexes = [42, 43];
    this.create(xIndexes, 492, this.#platformFactory.createBox);

    xIndexes = [35, 45, 46, 47, 48, 49, 50, 51, 52];
    this.create(xIndexes, 720, this.#platformFactory.createBox);
  }

  private createWater() {
    let xIndexes = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24, 2, 29, 30, 31,
    ];
    this.create(xIndexes, 768, this.#platformFactory.createWater);
  }

  private createBossWall() {
    let xIndexes = [52];
    this.create(xIndexes, 170, this.#platformFactory.createBossWall);
  }

  private createBridge() {
    let xIndexes = [16, 17, 18, 19];
    this.create(xIndexes, 384, this.#platformFactory.createBridge);
  }

  private create(
    xIndexes: number[],
    y: number,
    createFunc: (x: number, y: number) => Platform
  ) {
    for (let i of xIndexes) {
      this.#platforms.push(
        createFunc.call(this.#platformFactory, this.#blockSize * i, y)
      );
    }
  }
}
