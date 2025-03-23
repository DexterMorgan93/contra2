import { Container } from "pixi.js";
import { BulletFactory } from "../bullets/bullet-factory";
import { Hero } from "../hero/hero";
import { TourelleView } from "./tourelle/tourelle-view";
import { Tourelle } from "./tourelle/tourelle";
import { RunnerView } from "./runner/runner-view";
import { Runner } from "./runner/runner";
import { Entity } from "../entity";

export class EnemyFactory {
  private worldContainer;
  private target: Hero;
  private buletFactory: BulletFactory;
  private entities: Entity[] = [];

  constructor(
    worldContainer: Container,
    target: Hero,
    buletFactory: BulletFactory,
    entities: Entity[]
  ) {
    this.worldContainer = worldContainer;
    this.target = target;
    this.buletFactory = buletFactory;
    this.entities = entities;
  }

  createTourelles(x: number, y: number) {
    const view = new TourelleView();
    this.worldContainer.addChild(view);

    const tourelle = new Tourelle(view, this.target, this.buletFactory);
    tourelle.x = x;
    tourelle.y = y;

    this.entities.push(tourelle);

    return tourelle;
  }

  createRunners(x: number, y: number): Runner {
    const view = new RunnerView();
    this.worldContainer.addChild(view);
    const runner = new Runner(view, this.target);
    runner.x = x;
    runner.y = y;

    this.entities.push(runner);

    return runner;
  }
}
