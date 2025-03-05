import * as Pixi from "pixi.js";
import "./style.css";
import { Game } from "./game";
import { initDevtools } from "@pixi/devtools";

const app = new Pixi.Application();

async function setup() {
  await app.init({ width: 1024, height: 768, backgroundColor: 0x000000 });
  document.body.appendChild(app.canvas);
}

(async () => {
  await setup();

  const game = new Game(app);
  app.ticker.add(game.update, game);

  document.addEventListener("keydown", e => {
    game.keyboardProcessor.onKeyDown(e.key);
  });
  document.addEventListener("keyup", e => {
    game.keyboardProcessor.onKeyUp(e.key);
  });
})();

initDevtools({
  app,
});
