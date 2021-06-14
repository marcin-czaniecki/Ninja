export class Player {
  constructor(area, width, height, img, animation) {
    this.area = area;
    this.width = width;
    this.height = height;
    this.maxHp = 100;
    this.hp = this.maxHp;
    this.position = { x: area.width / 2, y: area.groundY - 229 };
    this.canNitro = true;
    this.activeNitro = false;
    this.jump = { active: false, height: 20, isInTheAir: false };
    this.image = img;
    this.animation = animation;
    this.horizontal = { acceleration: 1, speed: 5 };
    this.vertical = { acceleration: 1, speed: 0 };
    this.collisionRectangle = {
      xOffset: 60,
      yOffset: 20,
      width: 50,
      height: 200,
    };
  }
  gravitation() {
    this.position.y += this.vertical.speed;
    this.vertical.speed += this.vertical.acceleration;
    if (this.position.y > this.area.groundY - this.height) {
      this.position.y = this.area.groundY - this.height;
      this.vertical.speed = 0;
      this.jump.isInTheAir = false;
    }
  }
  hop() {
    if (this.jump.active && !this.jump.isInTheAir) {
      this.vertical.speed = -this.jump.height;
      this.jump.isInTheAir = true;
    }
  }
  move(leftPadding = 150) {
    this.area.camera.x = this.position.x - leftPadding;
    this.position.x += this.horizontal.speed;
  }
  runAnimation() {
    if (this.area.frameCounter % this.animation.speed === 0) {
      this.animation.frameNr += 1;
      if (this.animation.frameNr >= this.animation.frames) {
        this.animation.frameNr = 0;
      }
    }
  }
  update() {
    this.gravitation();
    this.hop();
    this.move();
    this.runAnimation();
  }
}
