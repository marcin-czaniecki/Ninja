export class Mob {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.frameNr = 0;
  }
  set nameMob(name) {
    this.name = name;
  }
  get nameMob() {
    return this.name;
  }
}
export class MobBasicParameter {
  constructor(width, height, animation, image) {
    this.width = width;
    this.height = height;
    this.animation = animation;
    this.image = image;
    this.horizontal = { acceleration: 1, speed: 5 };
    this.vertical = { acceleration: 1, speed: 0 };
    this.spawn = {
      maxMobs: 3,
      distance: {
        max: 1200,
        min: 400,
      },
    };
    this.collisionRectangle = {
      xOffset: 50,
      yOffset: 20,
      width: 50,
      height: 100,
    };
  }
}
