import { Container } from "pixi.js";
import { Runner } from "./runner";

export class RunnerFactory {
  private worldContainer;

  constructor(worldContainer: Container) {
    this.worldContainer = worldContainer;
  }

  create(x: number, y: number): Runner {
    const runner = new Runner(this.worldContainer);
    runner.x = x;
    runner.y = y;

    return runner;
  }
}
