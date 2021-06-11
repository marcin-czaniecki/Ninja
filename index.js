import { createImage } from "./helpers.mjs";
// Constants
const root = document.getElementById("root");

const areaWidth = 800;
const areaHeight = 600;
const widthNinja = 181;
const heightNinja = 229;
const groundY = 540;
const ninjaXSpeed = 5;

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
const ninjaImage = createImage("assets/images/nanonaut.png");
const background = createImage("assets/images/background.png");

let ninjaX = 50;
let ninjaY = 40;
let ninjaYAcceleration = 1;
let ninjaYSpeed = 0;
let spaceKeyIsPressed = false;
let ninjaJumpSpeed = 20;
let ninjaIsInTheAir = false;

const gravitation = () => {
  ninjaY += ninjaYSpeed;
  ninjaYSpeed += ninjaYAcceleration;
  if (ninjaY > groundY - heightNinja) {
    ninjaY = groundY - heightNinja;
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

const update = () => {
  gravitation();
  jump();
};

const draw = () => {
  context.clearRect(0, 0, areaWidth, areaHeight);
  //sky
  context.fillStyle = "LightSkyBlue";
  context.fillRect(0, 0, areaWidth, groundY - 40);
  //background
  context.drawImage(background, 0, -210);
  //ground
  context.fillStyle = "ForestGreen";
  context.fillRect(0, groundY - 40, areaWidth, areaHeight - groundY + 40);

  //ninja
  context.drawImage(ninjaImage, ninjaX, ninjaY);
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
