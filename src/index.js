import {
  createImage,
  generateWorldElement,
  SpriteSheet,
  Area,
  enumKeyName,
} from "./helpers.mjs";

// Constants
const root = document.getElementById("root");
//width-height-groundY-backgroundWidth
const area = new Area(1024, 768, 540, 1000);

const player = {
  width: 181,
  height: 229,
  position: { x: area.width / 2, y: area.groundY - 229 },
  canNitro: true,
  activeNitro: false,
  jump: { active: false, height: 20, isInTheAir: false },
  image: createImage("../assets/images/animatedNanonaut.png"),
  animation: { speed: 3, frameNr: 0, framesPerRow: 5, frames: 7 },
  horizontal: { acceleration: 1, speed: 5 },
  vertical: { acceleration: 1, speed: 0 },
};

// Preparation
const canvas = document.createElement("canvas");
canvas.width = area.width;
canvas.height = area.height;

const context = canvas.getContext("2d");
const bush01Image = createImage("../assets/images/bush1.png");
const bush02Image = createImage("../assets/images/bush2.png");
const backgroundImage = createImage("../assets/images/background.png");

const bushData = generateWorldElement(area.width, bush01Image, bush02Image);

const gravitation = () => {
  player.position.y += player.vertical.speed;
  player.vertical.speed += player.vertical.acceleration;
  if (player.position.y > area.groundY - player.height) {
    player.position.y = area.groundY - player.height;
    player.vertical.speed = 0;
    player.jump.isInTheAir = false;
  }
};

const jump = () => {
  if (player.jump.active && !player.jump.isInTheAir) {
    player.vertical.speed = -player.jump.height;
    player.jump.isInTheAir = true;
  }
};

const move = () => {
  area.camera.x = player.position.x - 150;
  player.position.x += player.horizontal.speed;
};

const runAnimation = () => {
  if (area.frameCounter % player.animation.speed === 0) {
    player.animation.frameNr += 1;
    if (player.animation.frameNr >= player.animation.frames) {
      player.animation.frameNr = 0;
    }
  }
};

const nitro = () => {
  if (player.activeNitro) {
    player.horizontal.speed = 15;
    player.animation.speed = 2;
    setTimeout(() => {
      player.horizontal.speed = 3;
      player.animation.speed = 4;
    }, 5000);
    setTimeout(() => {
      player.animation.speed = 3;
      player.horizontal.speed = 5;
    }, 15000);
  }
};

const refreshBush = () => {
  for (const bush of bushData) {
    if (bush.x - area.camera.x < -area.width) {
      bush.x += 2 * area.width + 150;
    }
  }
};

const update = () => {
  area.frameCounter += 1;
  gravitation();
  move();
  runAnimation();
  nitro();
  jump();
  refreshBush();
};

const draw = () => {
  context.clearRect(0, 0, area.width, area.height);
  //World - sky - background - ground
  area.draw(context, backgroundImage);

  //World elements
  for (const bush of bushData) {
    context.drawImage(
      bush.image,
      bush.x - area.camera.x,
      area.groundY - bush.y - area.camera.y
    );
  }

  //ninja
  const ninjaSpriteSheet = new SpriteSheet(
    player.image,
    player.animation.frameNr,
    player.animation.framesPerRow,
    player.width,
    player.height
  );

  ninjaSpriteSheet.draw(
    context,
    player.position.x - area.camera.x,
    player.position.y - area.camera.y
  );
};

// Main loop
function mainLoop() {
  update();
  draw();
  window.requestAnimationFrame(mainLoop);
}

const start = () => {
  window.requestAnimationFrame(mainLoop);
};

//control
const useNitro = (canUse) => {
  if (canUse) {
    setTimeout(() => {
      canUse = true;
    }, 30000);
  }
  canUse = false;
  return true;
};

const onKeyDown = ({ key }) => {
  switch (key) {
    case enumKeyName.Space:
      player.jump.active = true;
      break;
    case enumKeyName.ArrowRight:
      player.activeNitro = useNitro(player.canNitro);
      break;
    case enumKeyName.ArrowUp:
      player.jump.active = true;
      break;
    default:
      break;
  }
};

const onKeyUp = ({ key }) => {
  switch (key) {
    case enumKeyName.Space:
      player.jump.active = false;
      break;
    case enumKeyName.ArrowRight:
      player.activeNitro = false;
      break;
    case enumKeyName.ArrowUp:
      player.jump.active = false;
      break;
    default:
      break;
  }
};

//events
window.addEventListener("keyup", onKeyUp);
window.addEventListener("keydown", onKeyDown);
window.addEventListener("load", start);

root.appendChild(canvas);
