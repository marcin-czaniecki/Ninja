export class Engine {
  update: Function;
  draw: Function;
  engine: number;
  constructor(update: Function, draw: Function) {
    this.update = update;
    this.draw = draw;
    this.init();
  }
  mainLoop() {
    this.update();
    this.draw();
    this.engine = window.requestAnimationFrame(() => this.mainLoop());
  }
  start() {
    window.requestAnimationFrame(() => this.mainLoop());
  }
  init() {
    window.addEventListener("load", () => this.start());
  }
  stop() {
    cancelAnimationFrame(this.engine);
    window.removeEventListener("load", () => this.start());
  }
}
