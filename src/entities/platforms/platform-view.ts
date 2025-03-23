import { EntityView } from "../entity-view";

interface IPlatformViewOptions {
  width: number;
  height: number;
}

export class PlatformView extends EntityView {
  constructor({ width, height }: IPlatformViewOptions) {
    super();

    this.setWidth(width);
    this.setHeight(height);
  }
}
