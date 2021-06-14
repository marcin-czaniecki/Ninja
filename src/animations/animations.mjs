export class Animation {
  constructor(speed, frameNr, framesPerRow, frames) {
    this.speed = speed;
    this.frameNr = frameNr;
    this.framesPerRow = framesPerRow;
    this.frames = frames;
  }
}

export class SpriteSheet {
  constructor(imageSheet, frameNumber, numberFramesPerRow, width, height) {
    this.imageSheet = imageSheet;
    this.width = width;
    this.height = height;
    this.spriteSheetRow = Math.floor(frameNumber / numberFramesPerRow);
    this.spriteSheetColumn = frameNumber % numberFramesPerRow;
    this.spriteSheetX = this.spriteSheetColumn * this.width;
    this.spriteSheetY = this.spriteSheetRow * this.height;
  }
  draw(context, screenX, screenY) {
    context.drawImage(
      this.imageSheet,
      this.spriteSheetX,
      this.spriteSheetY,
      this.width,
      this.height,
      screenX,
      screenY,
      this.width,
      this.height
    );
  }
}
