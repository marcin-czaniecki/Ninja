import { createImage } from "./helpers.mjs";
// Constants
const root = document.getElementById("root");

const areaWidth = 800;
const areaHeight = 600;
const widthNinja = 181;
const heightNinja = 229;
const groundY = 540;
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

const gravitation = () => {
  ninjaY += ninjaYSpeed;
  ninjaYSpeed += ninjaYAcceleration;
  if (ninjaY > groundY - heightNinja) {
    ninjaY = groundY - heightNinja;
    ninjaYSpeed = 0;
  }
};

const update = () => {
  gravitation();
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

window.addEventListener("load", start);

root.appendChild(canvas);
