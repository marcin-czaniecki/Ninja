import { createImage } from "./helpers.mjs";
// Constants
const root = document.getElementById("root");

const areaWidth = 800;
const areaHeight = 600;
const groundY = 540;
const backgroundWidth = 1000;

const ninjaWidth = 181;
const ninjaHeight = 229;
const ninjaXSpeed = 5;

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
const background = createImage("assets/images/background.png");

let ninjaX = areaWidth / 2;
let ninjaY = groundY - ninjaHeight;

let ninjaYAcceleration = 1;
let ninjaYSpeed = 0;

let spaceKeyIsPressed = false;
let ninjaJumpSpeed = 20;
let ninjaIsInTheAir = false;

let ninjaFrameNr = 0;
let gameFrameCounter = 0;

let cameraX = 0;
let cameraY = 0;

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

const update = () => {
  gameFrameCounter += 1;
  gravitation();
  move();
  runAnimation();
  jump();
};

const draw = () => {
  context.clearRect(0, 0, areaWidth, areaHeight);
  //sky
  context.fillStyle = "LightSkyBlue";
  context.fillRect(0, 0, areaWidth, groundY - 40);
  //background
  let backgroundX = -(cameraX % backgroundWidth);
  context.drawImage(background, backgroundX, -210);
  context.drawImage(background, backgroundX + backgroundWidth, -210);
  //ground
  context.fillStyle = "ForestGreen";
  context.fillRect(0, groundY - 40, areaWidth, areaHeight - groundY + 40);

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
      console.log("KeyDown-ArrowRight");
      break;
    case enumKeyName.ArrowLeft:
      console.log("KeyDown-ArrowLeft");
      break;
    case enumKeyName.ArrowUp:
      console.log("KeyDown-ArrowUp");
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
      console.log("KeyUp-ArrowRight");
      break;
    case enumKeyName.ArrowLeft:
      console.log("KeyUp-ArrowLeft");
      break;
    case enumKeyName.ArrowUp:
      console.log("KeyUp-ArrowUp");
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
