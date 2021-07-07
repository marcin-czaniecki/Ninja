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
    this.ground = 310;
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
  drawSky() {
    this.context.fillStyle = "LightSkyBlue";
    this.context.fillRect(0, 0, this.width, this.ground);
  }
  drawBackground(image, width: number, height: number) {
    let backgroundX = -(this.camera.x % width) - 200;
    this.context.drawImage(image, backgroundX, this.height - height);
    this.context.drawImage(image, backgroundX + width, this.height - height);
    this.context.drawImage(
      image,
      backgroundX + width + width,
      this.height - height
    );
  }
  draw(image, width: number, height: number) {
    this.drawSky();
    this.drawBackground(image, width, height);
  }
}
