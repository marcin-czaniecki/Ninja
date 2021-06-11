import { createImage } from "./helpers.mjs";
// Constants
const root = document.getElementById("root");

const areaWidth = 1024;
const areaHeight = 768;
const groundY = 540;
const backgroundWidth = 1000;

const ninjaWidth = 181;
const ninjaHeight = 229;

const ninjaNrFramesPerRow = 5;
const ninjaNrAnimationFrames = 7;
const ninjaAnimationSpeed = 3;

const enumKeyName = {
  Space: " ",
  ArrowLeft: "ArrowLeft",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowRight: "ArrowRight",
};

// Preparation
const canvas = document.createElement("canvas");
canvas.width = areaWidth;
canvas.height = areaHeight;

const context = canvas.getContext("2d");
const ninjaImage = createImage("assets/images/animatedNanonaut.png");
const bush01Image = createImage("assets/images/bush1.png");
const bush02Image = createImage("assets/images/bush2.png");
const backgroundImage = createImage("assets/images/background.png");

let ninjaX = areaWidth / 2;
let ninjaY = groundY - ninjaHeight;

let ninjaXSpeed = 5;
let ninjaYAcceleration = 1;
let ninjaYSpeed = 0;

let canUseNitro = true;
let ArrowRightKeyIsPressed = false;
let spaceKeyIsPressed = false;
let ninjaJumpSpeed = 20;
let ninjaIsInTheAir = false;

let ninjaFrameNr = 0;
let gameFrameCounter = 0;

let cameraX = 0;
let cameraY = 0;

let bushData = [
  {
    x: 550,
    y: 100,
    image: bush01Image,
  },
  {
    x: 850,
    y: 95,
    image: bush01Image,
  },
  {
    x: 750,
    y: 90,
    image: bush02Image,
  },
];

const gravitation = () => {
  ninjaY += ninjaYSpeed;
  ninjaYSpeed += ninjaYAcceleration;
  if (ninjaY > groundY - ninjaHeight) {
    ninjaY = groundY - ninjaHeight;
    ninjaYSpeed = 0;
    ninjaIsInTheAir = false;
  }
};

const jump = () => {
  if (spaceKeyIsPressed && !ninjaIsInTheAir) {
    ninjaYSpeed = -ninjaJumpSpeed;
    ninjaIsInTheAir = true;
  }
};

const move = () => {
  cameraX = ninjaX - 150;
  ninjaX += ninjaXSpeed;
};

const runAnimation = () => {
  if (gameFrameCounter % ninjaAnimationSpeed === 0) {
    ninjaFrameNr += 1;
    if (ninjaFrameNr >= ninjaNrAnimationFrames) {
      ninjaFrameNr = 0;
    }
  }
};

const nitro = () => {
  if (ArrowRightKeyIsPressed) {
    ninjaXSpeed = 15;
    setTimeout(() => {
      ninjaXSpeed = 3;
    }, 5000);
    setTimeout(() => {
      ninjaXSpeed = 5;
    }, 15000);
  }
};

const refreshBush = () => {
  for (const bush of bushData) {
    if (bush.x - cameraX < -areaWidth) {
      bush.x += 2 * areaWidth + 150;
    }
  }
};

const update = () => {
  gameFrameCounter += 1;
  gravitation();
  move();
  runAnimation();
  nitro();
  jump();
  refreshBush();
};

const draw = () => {
  context.clearRect(0, 0, areaWidth, areaHeight);
  //sky
  context.fillStyle = "LightSkyBlue";
  context.fillRect(0, 0, areaWidth, groundY - 40);
  //background
  let backgroundX = -(cameraX % backgroundWidth);
  context.drawImage(backgroundImage, backgroundX, -210);
  context.drawImage(backgroundImage, backgroundX + backgroundWidth, -210);
  //ground
  context.fillStyle = "ForestGreen";
  context.fillRect(0, groundY - 40, areaWidth, areaHeight - groundY + 40);
  //World elements
  for (const bush of bushData) {
    context.drawImage(bush.image, bush.x - cameraX, groundY - bush.y - cameraY);
  }

  //ninja
  let ninjaSpriteSheetRow = Math.floor(ninjaFrameNr / ninjaNrFramesPerRow);
  let ninjaSpriteSheetColumn = ninjaFrameNr % ninjaNrFramesPerRow;
  let ninjaSpriteSheetX = ninjaSpriteSheetColumn * ninjaWidth;
  let ninjaSpriteSheetY = ninjaSpriteSheetRow * ninjaHeight;
  context.drawImage(
    ninjaImage,
    ninjaSpriteSheetX,
    ninjaSpriteSheetY,
    ninjaWidth,
    ninjaHeight,
    ninjaX - cameraX,
    ninjaY - cameraY,
    ninjaWidth,
    ninjaHeight
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

const onKeyDown = ({ key }) => {
  switch (key) {
    case enumKeyName.Space:
      spaceKeyIsPressed = true;

      break;
    case enumKeyName.ArrowRight:
      if (canUseNitro) {
        ArrowRightKeyIsPressed = true;
        setTimeout(() => {
          canUseNitro = true;
        }, 30000);
      }
      canUseNitro = false;
      break;
    case enumKeyName.ArrowLeft:
      console.log("KeyDown-ArrowLeft");
      break;
    case enumKeyName.ArrowUp:
      spaceKeyIsPressed = true;
      break;
    case enumKeyName.ArrowDown:
      console.log("KeyDown-ArrowDown");
      break;
    default:
      break;
  }
};

const onKeyUp = ({ key }) => {
  switch (key) {
    case enumKeyName.Space:
      spaceKeyIsPressed = false;
      break;
    case enumKeyName.ArrowRight:
      ArrowRightKeyIsPressed = false;
      break;
    case enumKeyName.ArrowLeft:
      console.log("KeyUp-ArrowLeft");
      break;
    case enumKeyName.ArrowUp:
      spaceKeyIsPressed = false;
      break;
    case enumKeyName.ArrowDown:
      console.log("KeyUp-ArrowDown");
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
