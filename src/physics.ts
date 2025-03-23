interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Physics {
  // абстрактный метод, который просто возвращает результат коллизии
  static getOrientCollisionResult(
    aaRect: IRect,
    bbRect: IRect,
    aaPrevPoint: {
      y: number;
      x: number;
    }
  ) {
    const collisionResult = {
      horizontal: false,
      vertical: false,
    };

    if (!this.isCheckAABB(aaRect, bbRect)) {
      return collisionResult;
    }

    aaRect.y = aaPrevPoint.y;
    if (!this.isCheckAABB(aaRect, bbRect)) {
      collisionResult.vertical = true;
      return collisionResult;
    }

    collisionResult.horizontal = true;
    return collisionResult;
  }

  // коллизия
  static isCheckAABB(entity: IRect, area: IRect) {
    return (
      entity.x < area.x + area.width &&
      entity.x + entity.width > area.x &&
      entity.y < area.y + area.height &&
      entity.y + entity.height > area.y
    );
  }
}
