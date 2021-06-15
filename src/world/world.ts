export class World {
  width: number;
  height: number;
  currentFrame: number;
  camera: { x: number; y: number };
  ground: number;
  private _area: HTMLCanvasElement;
  constructor(root: HTMLDivElement, width: number, height: number) {
    this.width = width;
    this.height = height;
    this._area = document.createElement("canvas");
    this.camera = { x: 0, y: 0 };
    this.currentFrame = 0;
    this.ground = height * 0.3;
    this.init(root);
  }
  get area() {
    return this._area;
  }
  get context() {
    return this._area.getContext("2d");
  }
  nextFrame() {
    this.currentFrame += 1;
  }
  cameraObserveX(x: number, padding: number = 0) {
    this.camera.x = x + padding;
  }
  cameraObserveY(y: number, padding: number = 0) {
    this.camera.y = y + padding;
  }
  init(root: HTMLDivElement) {
    this.area.width = this.width;
    this.area.height = this.height;
    root.append(this._area);
  }
}
