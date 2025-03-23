import { BaseTexture } from "@pixi/core";
import { Assets, Spritesheet, Texture } from "pixi.js";

export default class AssetsFactory {
  #spritesheet!: Spritesheet;

  // Асинхронный инициализатор
  async init(): Promise<void> {
    // Загружаем JSON с atlas-данными
    const atlasData = await Assets.load("./assets/atlas.json");

    // Создаём baseTexture
    const baseTexture = BaseTexture.from(atlasData.meta.image) as any;

    // Создаём и парсим спрайтшит
    this.#spritesheet = new Spritesheet(baseTexture, atlasData);
    await this.#spritesheet.parse();
  }

  getTexture(textureName: string): Texture {
    return this.#spritesheet.textures[textureName];
  }

  getAnimationTextures(animationName: string): Texture[] {
    return this.#spritesheet.animations[animationName];
  }
}
