import { World } from "../world/world";

export class Player {
  width: number;
  height: number;
  private position: { x: number; y: number };
  currentFrame: number;
  speed: number;
  speedAnimation: number;
  activeWorld: World;
  scale: { x: number; y: number };
  collisionRectangle: {
    xOffset: number;
    yOffset: number;
    width: number;
    height: number;
  };
  isAir: boolean;
  jump: { acceleration: number; speed: number; height: number };
  constructor(world: World, width: number, height: number) {
    this.activeWorld = world;
    this.width = width;
    this.height = height;
    this.scale = { x: 1, y: 1 };
    this.position = { x: 0, y: 0 };
    this.currentFrame = 0;
    this.speed = 5;
    this.jump = { acceleration: 1, speed: 0, height: this.height / 10 };
    this.speedAnimation = 4;
    this.isAir = false;
    this.collisionRectangle = {
      xOffset: 0,
      yOffset: 0,
      width: 0,
      height: 0,
    };
    this.updatePlayer();
  }
  updatePlayer() {
    this.collisionRectangle = {
      xOffset: this.width * this.scale.x * 0.2,
      yOffset: this.height * this.scale.y * 0.2,
      width: this.width * this.scale.x * 0.7,
      height: this.height * this.scale.x * 0.7,
    };
    this.jump.height = (this.height * this.scale.x) / 10;
  }
  set x(x: number) {
    this.position.x = x;
  }
  set y(y: number) {
    this.position.y = y;
  }
  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  setScale(x: number, y: number) {
    this.scale = { x, y };
    this.updatePlayer();
  }
  nextFrame() {
    this.currentFrame += 1;
  }
  divideSpriteSheet(framesPerRow: number) {
    const spriteSheetRow = Math.floor(this.currentFrame / framesPerRow);
    const spriteSheetColumn = this.currentFrame % framesPerRow;
    const spriteSheetX = spriteSheetColumn * this.width;
    const spriteSheetY = spriteSheetRow * this.height;

    return { spriteSheetX, spriteSheetY };
  }
  updateGravitation() {
    this.y += this.jump.speed;
    this.jump.speed += this.jump.acceleration;
    if (this.y > this.activeWorld.height - this.activeWorld.ground) {
      this.y = this.activeWorld.height - this.activeWorld.ground;
      this.jump.speed = 0;
      this.isAir = false;
    }
  }
  updateJump(hop: boolean) {
    if (hop && !this.isAir) {
      this.jump.speed = -this.jump.height;
      this.isAir = true;
    }
  }
  updateRun() {
    this.x += this.speed;
  }
  updateAnimation(maxFrame: number = 10, single: boolean) {
    this.activeWorld.nextFrame();
    if (this.activeWorld.currentFrame % this.speedAnimation === 0) {
      this.nextFrame();
      if (this.currentFrame >= maxFrame) {
        if (!single) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = maxFrame - 1;
        }
      }
    }
  }
  drawAnimation(
    context: CanvasRenderingContext2D,
    spriteSheet: HTMLImageElement,
    framesPerRow: number,
    screenX: number,
    screenY: number
  ) {
    const { spriteSheetX, spriteSheetY } = this.divideSpriteSheet(framesPerRow);
    context.drawImage(
      spriteSheet,
      spriteSheetX,
      spriteSheetY,
      this.width,
      this.height,
      screenX,
      screenY,
      this.width * this.scale.x,
      this.height * this.scale.y
    );
  }
}
