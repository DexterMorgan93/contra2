import { Container, ContainerChild } from "pixi.js";
import { Hero } from "./entities/hero/hero";
import { CameraSettings } from "./game";

export class Camera {
  private target: Hero;
  private world: Container<ContainerChild>;
  private isbackScroll: boolean;
  private centerScreenPointX: number;
  private rightBorderWorldPointX: number;
  private lastTargetX = 0; // последняя позиция игрок, когда он начал скролить экран

  constructor(cameraSettings: CameraSettings) {
    this.target = cameraSettings.target;
    this.world = cameraSettings.world;
    this.isbackScroll = cameraSettings.isBackScrollX;

    this.centerScreenPointX = cameraSettings.screenSize.width / 2;
    this.rightBorderWorldPointX = this.world.width - this.centerScreenPointX;
  }

  update() {
    if (
      this.target.x > this.centerScreenPointX &&
      this.target.x < this.rightBorderWorldPointX &&
      (this.isbackScroll || this.target.x > this.lastTargetX)
    ) {
      this.world.x = this.centerScreenPointX - this.target.x;
      this.lastTargetX = this.target.x;
    }
  }
}
