import * as Pixi from "pixi.js";
import "./style.css";

const app = new Pixi.Application();
await app.init({ width: 1024, height: 768 });
document.body.appendChild(app.canvas);
