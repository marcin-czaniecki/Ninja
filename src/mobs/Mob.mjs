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
      maxMobs: Math.round(window.innerWidth / 400),
      distance: {
        max: window.innerWidth,
        min: window.innerWidth / 2,
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
