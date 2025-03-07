import { Game } from "./game";

type KeyAction = {
  isDown: boolean;
  executeDown: () => void;
  executeUp: () => void;
};

export class KeyboardProcessor {
  private gameContext;

  private keyMap: Record<string, KeyAction> = {
    w: { isDown: false, executeDown: () => {}, executeUp: () => {} },
    s: { isDown: false, executeDown: () => {}, executeUp: () => {} },
    a: { isDown: false, executeDown: () => {}, executeUp: () => {} },
    d: { isDown: false, executeDown: () => {}, executeUp: () => {} },
    " ": { isDown: false, executeDown: () => {}, executeUp: () => {} },
  };

  constructor(gameContext: Game) {
    this.gameContext = gameContext;
  }

  getButton(keyName: string) {
    return this.keyMap[keyName];
  }

  onKeyDown(key: string): void {
    const button = this.keyMap[key];
    if (button !== undefined) {
      button.isDown = true;
      button.executeDown.call(this.gameContext);
    }
  }

  onKeyUp(key: string): void {
    const button = this.keyMap[key];
    if (button !== undefined) {
      button.isDown = false;
      button.executeUp.call(this.gameContext);
    }
  }

  isButtonPressed(key: string) {
    return this.keyMap[key].isDown;
  }
}
