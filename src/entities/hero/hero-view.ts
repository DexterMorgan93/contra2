import { Container, Graphics } from "pixi.js";

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

export class HeroView extends Container {
  private bounds = {
    width: 0,
    height: 0,
  };

  private collisionBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  rootNode!: Container;

  stateMachine: StateMachine;

  constructor() {
    super();
    this.createNodeStructure();

    this.rootNode.pivot.x = this.bounds.width / 2;
    this.rootNode.x = this.bounds.width / 2;
    this.bounds.width = 20;
    this.bounds.height = 90;
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
    this.stateMachine.states[key].visible = true;
    this.stateMachine.currentstate = key;
  }

  get collisionbox() {
    this.collisionBox.x = this.x;
    this.collisionBox.y = this.y;
    return this.collisionBox;
  }

  showStay() {
    this.toState("stay");
  }
  showStayUp() {
    this.toState("stayUp");
  }
  showRun() {
    this.toState("run");
  }
  showRunUp() {
    this.toState("runUp");
  }
  showRunDown() {
    this.toState("runDown");
  }
  showLay() {
    this.toState("lay");
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
