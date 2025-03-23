import { Container, Graphics } from "pixi.js";
import { EntityView } from "../../entity-view";

type StateKeys = "run" | "jump" | "fall";

type StateMachine = {
  currentstate: StateKeys;
  states: Record<StateKeys, Graphics>;
};

export class RunnerView extends EntityView {
  private bounds = {
    width: 0,
    height: 0,
  };

  rootNode!: Container;

  stateMachine: StateMachine;

  constructor() {
    super();
    this.createNodeStructure();
    this.bounds.width = 20;
    this.bounds.height = 90;
    this.rootNode.pivot.x = 10;
    this.rootNode.x = 10;

    this.collisionBox.width = this.bounds.width;
    this.collisionBox.height = this.bounds.height;

    this.setHitboxWidth(this.collisionBox.width);
    this.setHitboxHeight(this.collisionBox.height);

    this.stateMachine = {
      currentstate: "default" as StateKeys,
      states: {
        run: this.getRunImage(),
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

  get isFlpped() {
    return this.rootNode.scale.x === -1;
  }

  showRun() {
    this.toState("run");
  }

  showJump() {
    this.toState("jump");
  }
  showFall() {
    this.toState("fall");
  }
  flip(direction: number) {
    switch (direction) {
      case 1:
      case -1:
        this.rootNode.scale.x = direction;
    }
  }

  private getRunImage() {
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "red",
    });
    view.rect(0, 0, 20, 90);
    view.stroke();
    view.skew.x = -0.1;
    return view;
  }

  private getJumpImage() {
    const view = new Graphics();
    view.setStrokeStyle({
      width: 2,
      color: "red",
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
      color: "red",
    });
    view.rect(0, 0, 20, 90);
    view.rect(10, 20, 5, 60);
    view.stroke();
    view.skew.x = -0.1;
    return view;
  }
}
