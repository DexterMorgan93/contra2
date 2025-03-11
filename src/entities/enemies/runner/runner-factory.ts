import { Container } from "pixi.js";
import { Runner } from "./runner";
import { RunnerView } from "./runner-view";

export class RunnerFactory {
  private worldContainer;

  constructor(worldContainer: Container) {
    this.worldContainer = worldContainer;
  }

  create(x: number, y: number): Runner {
    const view = new RunnerView();
    this.worldContainer.addChild(view);
    const runner = new Runner(view);
    runner.x = x;
    runner.y = y;

    return runner;
  }
}
