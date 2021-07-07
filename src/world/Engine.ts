export default (() => {
  let instance = undefined;
  return class Engine {
    update: Function;
    draw: Function;
    engine: number;
    run: boolean;
    constructor(update: Function, draw: Function) {
      if (!instance) {
        instance = this;
      }
      this.update = update;
      this.draw = draw;
      this.run = false;
      this.init();
      return instance;
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
    setEventsKeyDown(keys: { key: string; fn: Function }[]) {
      window.addEventListener("keydown", (e) => {
        keys.forEach(({ key, fn }) => {
          if (key === e.key) {
            fn();
          }
        });
      });
    }
    setEventsKeyUp(keys: { key: string; fn: Function }[]) {
      window.addEventListener("keydown", (e) => {
        keys.forEach(({ key, fn }) => {
          if (key === e.key) {
            fn();
          }
        });
      });
    }
  };
})();
