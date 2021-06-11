export const createImage = (src, width, height) => {
  const image = new Image(width, height);
  image.src = src;
  return image;
};

class WorldElement {
  constructor(image, x, y) {
    this.image = image;
    this.x = x;
    this.y = y;
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

export class Area {
  constructor(width, height, groundY, backgroundWidth) {
    this.width = width;
    this.height = height;
    this.groundY = groundY;
    this.backgroundWidth = backgroundWidth;
    this.camera = { x: 0, y: 0 };
    this.frameCounter = 0;
  }
  drawSky(context) {
    context.fillStyle = "LightSkyBlue";
    context.fillRect(0, 0, this.width, this.groundY - 40);
  }
  drawBackground(context, backgroundImage) {
    let backgroundX = -(this.camera.x % this.backgroundWidth);
    context.drawImage(backgroundImage, backgroundX, -210);
    context.drawImage(
      backgroundImage,
      backgroundX + this.backgroundWidth,
      -210
    );
  }
  drawGround(context) {
    context.fillStyle = "ForestGreen";
    context.fillRect(
      0,
      this.groundY - 40,
      this.width,
      this.height - this.groundY + 40
    );
  }
  draw(context, backgroundImage) {
    this.drawSky(context);
    this.drawBackground(context, backgroundImage);
    this.drawGround(context);
  }
}

export const generateWorldElement = (areaWidth, ...images) => {
  const generatedWorldElementData = [];
  let bushX = 0;

  while (bushX < 2 * areaWidth) {
    generatedWorldElementData.push(
      new WorldElement(
        images[Math.random() >= 0.5 ? 1 : 0],
        bushX,
        80 + Math.random() * 20
      )
    );
    bushX += 150 + Math.random() * 200;
  }
  return generatedWorldElementData;
};

export const enumKeyName = {
  Space: " ",
  ArrowLeft: "ArrowLeft",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowRight: "ArrowRight",
};
