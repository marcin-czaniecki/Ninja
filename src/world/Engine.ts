export class Engine {
  update: Function;
  draw: Function;
  engine: number;
  run: boolean;
  constructor(update: Function, draw: Function) {
    this.update = update;
    this.draw = draw;
    this.run = false;
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
    window.cancelAnimationFrame(this.engine);
    window.removeEventListener("load", () => this.start());
  }
  pause() {
    if (this.run) {
      this.start();
    } else {
      this.stop();
    }
    this.run = !this.run;
  }
}
