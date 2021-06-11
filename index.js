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
const ninjaImage = createImage(
  "assets/images/nanonaut.png",
  widthNinja,
  heightNinja
);

let ninjaX = 50;
let ninjaY = 40;

const start = () => {
  window.requestAnimationFrame(mainLoop);
};

const update = () => {};

const draw = () => {
  context.clearRect(0, 0, areaWidth, areaHeight);
  //sky
  context.fillStyle = "LightSkyBlue";
  context.fillRect(0, 0, areaWidth, groundY);
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

window.addEventListener("load", start);

root.appendChild(canvas);
