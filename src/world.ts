import { Container } from "pixi.js";

export class World extends Container {
  #background: Container;
  #game: Container;
  #foreground: Container;

  constructor() {
    super();

    this.#background = new Container();
    this.addChild(this.#background);

    this.#game = new Container();
    this.addChild(this.#game);

    this.#foreground = new Container();
    this.addChild(this.#foreground);
  }

  get background() {
    return this.#background;
  }

  get game() {
    return this.#game;
  }

  get foreground() {
    return this.#foreground;
  }
}
