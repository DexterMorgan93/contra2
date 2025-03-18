import { Container } from "pixi.js";
import { TourelleView } from "./tourelle-view";
import { Tourelle } from "./tourelle";
import { Hero } from "../../hero/hero";

export class TourellFactory {
  private worldContainer;
  private target: Hero;

  constructor(worldContainer: Container, target: Hero) {
    this.worldContainer = worldContainer;
    this.target = target;
  }

  create(x: number, y: number) {
    const view = new TourelleView();
    this.worldContainer.addChild(view);

    const tourelle = new Tourelle(view, this.target);
    tourelle.x = x;
    tourelle.y = y;

    return tourelle;
  }
}
