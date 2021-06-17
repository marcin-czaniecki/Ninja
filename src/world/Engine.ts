export class Engine {
  update: Function;
  draw: Function;
  engine: number;
  constructor(update: Function, draw: Function) {
    this.update = update;
    this.draw = draw;
    window.addEventListener("load", () => this.start());
  }
  mainLoop() {
    this.update();
    this.draw();
    this.engine = window.requestAnimationFrame(() => this.mainLoop());
  }
  start() {
    window.requestAnimationFrame(() => this.mainLoop());
  }
  stop() {
    cancelAnimationFrame(this.engine);
  }
}
