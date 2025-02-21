import * as Pixi from "pixi.js";
import "./style.css";
import { Game } from "./game";
import { initDevtools } from "@pixi/devtools";

const app = new Pixi.Application();
await app.init({ width: 1024, height: 768, backgroundColor: 0x000000 });

initDevtools({
  app,
});
const game = new Game(app);
app.ticker.add(game.update, game);
document.body.appendChild(app.canvas);
