export class WorldElement {
  constructor(image, x, y) {
    this.image = image;
    this.x = x;
    this.y = y;
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
  generateWorldElement(areaWidth, images, y = 80) {
    const generatedWorldElementData = [];
    let worldElementAxisHorizontalStart = 0;

    while (worldElementAxisHorizontalStart < 2 * areaWidth) {
      const whatTexture = images[Math.random() >= 0.5 ? 1 : 0];
      const verticalPosition = y + Math.random() * 20;
      generatedWorldElementData.push(
        new WorldElement(
          whatTexture,
          worldElementAxisHorizontalStart,
          verticalPosition
        )
      );
      worldElementAxisHorizontalStart += 150 + Math.random() * 200;
    }
    return generatedWorldElementData;
  }
}
