import { Container } from "pixi.js";
import { TourelleView } from "./tourelle-view";
import { Tourelle } from "./tourelle";
import { Hero } from "../../hero/hero";
import { BulletFactory } from "../../bullets/bullet-factory";

export class TourellFactory {
  private worldContainer;
  private target: Hero;
  private buletFactory: BulletFactory;

  constructor(
    worldContainer: Container,
    target: Hero,
    buletFactory: BulletFactory
  ) {
    this.worldContainer = worldContainer;
    this.target = target;
    this.buletFactory = buletFactory;
  }

  create(x: number, y: number) {
    const view = new TourelleView();
    this.worldContainer.addChild(view);

    const tourelle = new Tourelle(view, this.target, this.buletFactory);
    tourelle.x = x;
    tourelle.y = y;

    return tourelle;
  }
}
