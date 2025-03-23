import { EnemyFactory } from "./entities/enemies/enemy-factory";
import { Platform } from "./entities/platforms/platform";
import { PlatformFactory } from "./entities/platforms/platform-factory";

export class SceneFactory {
  #platforms: Platform[];
  #platformFactory: PlatformFactory;
  #blockSize = 128;
  #enemyFactory: EnemyFactory;

  constructor(
    platforms: Platform[],
    platformFactory: PlatformFactory,
    enemyFactory: EnemyFactory
  ) {
    this.#platforms = platforms;
    this.#platformFactory = platformFactory;
    this.#enemyFactory = enemyFactory;
  }

  createScene() {
    this.createPlatforms();
    this.createGround();
    this.createWater();
    this.createBossWall();
    this.createBridge();
    this.createEnemies();
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

  private createEnemies() {
    this.#enemyFactory.createRunners(this.#blockSize * 9, 290);
    this.#enemyFactory.createRunners(this.#blockSize * 10, 290);
    this.#enemyFactory.createRunners(this.#blockSize * 11, 290);

    this.#enemyFactory.createRunners(this.#blockSize * 13, 290);
    this.#enemyFactory.createRunners(this.#blockSize * 13 + 50, 290);
    this.#enemyFactory.createRunners(this.#blockSize * 13 + 100, 290);

    this.#enemyFactory.createRunners(this.#blockSize * 16, 290);

    this.#enemyFactory.createRunners(this.#blockSize * 20, 290);
    this.#enemyFactory.createRunners(this.#blockSize * 21, 290);

    this.#enemyFactory.createRunners(this.#blockSize * 29, 290);
    this.#enemyFactory.createRunners(this.#blockSize * 30, 290);

    let runner = this.#enemyFactory.createRunners(this.#blockSize * 40, 400);
    runner.jumpBehaviorKoef = 1;
    runner = this.#enemyFactory.createRunners(this.#blockSize * 42, 400);
    runner.jumpBehaviorKoef = 1;

    this.#enemyFactory.createTourelles(this.#blockSize * 10, 670);
    this.#enemyFactory.createTourelles(this.#blockSize * 22 + 50, 500);
    this.#enemyFactory.createTourelles(this.#blockSize * 29 + 64, 550);
    this.#enemyFactory.createTourelles(this.#blockSize * 35 + 64, 550);
    this.#enemyFactory.createTourelles(this.#blockSize * 45 + 64, 670);
    this.#enemyFactory.createTourelles(this.#blockSize * 48 + 64, 670);
  }
}
