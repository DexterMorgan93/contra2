import { Container, Graphics } from "pixi.js";
import { EntityView } from "../entity-view";

type StateKeys =
  | "stay"
  | "stayUp"
  | "run"
  | "runUp"
  | "runDown"
  | "lay"
  | "jump"
  | "fall";

type StateMachine = {
  currentstate: StateKeys;
  states: Record<StateKeys, Graphics>;
};

export class HeroView extends EntityView {
  private bounds = {
    width: 0,
    height: 0,
  };

  rootNode!: Container;

  stateMachine: StateMachine;

  private bulletPointShift = {
    x: 0,
    y: 0,
  };

  constructor() {
    super();
    this.createNodeStructure();
    this.bounds.width = 20;
    this.bounds.height = 90;
    this.rootNode.pivot.x = 10;
    this.rootNode.x = 10;

    this.collisionBox.width = this.bounds.width;
    this.collisionBox.height = this.bounds.height;

    this.stateMachine = {
      currentstate: "default" as StateKeys,
      states: {
        stay: this.getStayImage(),
        stayUp: this.getStayUpImage(),
        run: this.getRunImage(),
        runUp: this.getRunUpImage(),
        runDown: this.getRunDownImage(),
        lay: this.getLayImage(),
        jump: this.getJumpImage(),
        fall: this.getFallImage(),
      },
    };
    this.initializeStates();
  }

  createNodeStructure() {
    const rootNode = new Container();
    this.addChild(rootNode);
    this.rootNode = rootNode;
  }

  initializeStates() {
    Object.values(this.stateMachine.states).forEach((state) => {
      this.rootNode.addChild(state);
      state.visible = false;
    });
  }

  toState(key: StateKeys) {
    if (this.stateMachine.currentstate === key) {
      return;
    }
    Object.values(this.stateMachine.states).forEach((state) => {
      state.visible = false;
    });

    this.stateMachine.states[key].visible = true;
    this.stateMachine.currentstate = key;
  }

  get getBulletPointShift() {
    return this.bulletPointShift;
  }

  get isFlpped() {
    return this.rootNode.scale.x === -1;
  }

  showStay() {
    this.toState("stay");

    this.setBulletPointShift(65, 30);

    this.setHitboxWidth(20);
    this.setHitboxHeight(90);
    this.setHitboxShiftX(0);
    this.setHitboxShiftY(0);
  }
  showStayUp() {
    this.toState("stayUp");
    this.setBulletPointShift(-2, -40);

    this.setHitboxWidth(20);
    this.setHitboxHeight(90);
    this.setHitboxShiftX(0);
    this.setHitboxShiftY(0);
  }
  showRun() {
    this.toState("run");
    this.setBulletPointShift(65, 30);

    this.setHitboxWidth(20);
    this.setHitboxHeight(90);
    this.setHitboxShiftX(0);
    this.setHitboxShiftY(0);
  }
  showRunUp() {
    this.toState("runUp");
    this.setBulletPointShift(40, -20);

    this.setHitboxWidth(20);
    this.setHitboxHeight(90);
    this.setHitboxShiftX(0);
    this.setHitboxShiftY(0);
  }
  showRunDown() {
    this.toState("runDown");
    this.setBulletPointShift(20, 55);

    this.setHitboxWidth(20);
    this.setHitboxHeight(90);
    this.setHitboxShiftX(0);
    this.setHitboxShiftY(0);
  }
  showLay() {
    this.toState("lay");
    this.setBulletPointShift(65, 70);

    this.setHitboxWidth(90);
    this.setHitboxHeight(20);
    this.setHitboxShiftX(-45);
    this.setHitboxShiftY(70);
  }
  showJump() {
    this.toState("jump");
    this.setBulletPointShift(-2, 40);

    this.setHitboxWidth(40);
    this.setHitboxHeight(40);
    this.setHitboxShiftX(-10);
    this.setHitboxShiftY(25);
  }
  showFall() {
    this.toState("fall");
    this.setBulletPointShift(65, 30);

    this.setHitboxWidth(20);
    this.setHitboxHeight(90);
    this.setHitboxShiftX(0);
    this.setHitboxShiftY(0);
  }
  flip(direction: number) {
    switch (direction) {
      case 1:
      case -1:
        this.rootNode.scale.x = direction;
    }
  }

  setBulletPointShift(x: number, y: number) {
    this.bulletPointShift.x =
      (x + this.rootNode.pivot.x * this.rootNode.scale.x) *
      this.rootNode.scale.x;
    this.bulletPointShift.y = y;
  }

  private getStayImage() {
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "yellow",
    });
    view.rect(0, 0, 20, 90);
    view.rect(0, 30, 70, 5);
    view.stroke();
    return view;
  }
  private getStayUpImage() {
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "yellow",
    });
    view.rect(0, 0, 20, 90);
    view.rect(8, -40, 5, 40);
    view.stroke();
    return view;
  }
  private getRunImage() {
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "yellow",
    });
    view.rect(0, 0, 20, 90);
    view.rect(0, 30, 70, 5);
    view.stroke();
    view.skew.x = -0.1;
    return view;
  }
  private getRunUpImage() {
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "yellow",
    });

    view.rect(0, 0, 20, 90);

    view.moveTo(0, 30);
    view.lineTo(40, -20);
    view.lineTo(45, -15);
    view.lineTo(0, 40);

    view.stroke();
    view.skew.x = -0.1;
    return view;
  }

  private getRunDownImage() {
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "yellow",
    });

    view.rect(0, 0, 20, 90);

    view.moveTo(0, 20);
    view.lineTo(40, 60);
    view.lineTo(35, 65);
    view.lineTo(0, 30);

    view.stroke();
    view.skew.x = -0.1;
    return view;
  }

  private getLayImage() {
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "yellow",
    });
    view.rect(0, 0, 90, 20);
    view.rect(90, 0, 40, 5);
    view.stroke();
    view.x -= 45;
    view.y += 70;
    return view;
  }
  private getJumpImage() {
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "yellow",
    });
    view.rect(0, 0, 40, 40);
    view.stroke();
    view.x -= 10;
    view.y += 25;
    return view;
  }
  private getFallImage() {
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "yellow",
    });
    view.rect(0, 0, 20, 90);
    view.rect(10, 20, 5, 60);
    view.stroke();
    view.skew.x = -0.1;
    return view;
  }
}
