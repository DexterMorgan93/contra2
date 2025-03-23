import * as Pixi from "pixi.js";
import "./style.css";
import { Game } from "./game";
import { initDevtools } from "@pixi/devtools";
import AssetsFactory from "./load-assets";

const app = new Pixi.Application();

async function setup() {
  await app.init({ width: 1024, height: 768, backgroundColor: 0x000000 });
  document.body.appendChild(app.canvas);
}

async function loadAssets() {
  await Pixi.Assets.load("/assets/atlas.json");
}

(async () => {
  await setup();
  await loadAssets();

  const assets = new AssetsFactory();

  const game = new Game(app, assets);
  app.ticker.add(game.update, game);

  document.addEventListener("keydown", (e) => {
    game.keyboardProcessor.onKeyDown(e.key);
  });
  document.addEventListener("keyup", (e) => {
    game.keyboardProcessor.onKeyUp(e.key);
  });
})();

initDevtools({
  app,
});
