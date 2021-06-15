import { World } from "./world/world";
import { getRoot, createImage } from "./helpers/helpers";
import { Player } from "./player/player";

const world = new World(getRoot(), window.innerWidth, window.innerHeight);
const player = new Player(world, 363, 458);
player.setScale(0.5, 0.5);
player.y = world.height - world.ground;

const spriteSheetPlayerRun = createImage("./assets/ninja/run.png");
const spriteSheetPlayerJump = createImage("./assets/ninja/jump.png");
const ctx = world.context;

setInterval(() => {
  player.updateJump(true);
}, 3000);
let single = false;

const update = () => {
  if (!player.isAir) {
    single = false;
  } else if (player.isAir) {
    single = true;
  }
  player.updateGravitation();
  player.updateRun();
  player.updateAnimationRun(10, single);
  world.cameraObserveY(player.y);
  world.cameraObserveX(player.x, -150);
};

const draw = () => {
  ctx.clearRect(0, 0, world.width, world.height);
  if (!player.isAir) {
    player.drawAnimationRun(
      ctx,
      spriteSheetPlayerRun,
      10,
      player.x - world.camera.x,
      world.camera.y
    );
  } else if (player.isAir) {
    player.drawAnimationRun(
      ctx,
      spriteSheetPlayerJump,
      10,
      player.x - world.camera.x,
      world.camera.y
    );
  }
};

const mainLoop = () => {
  update();
  draw();
  window.requestAnimationFrame(mainLoop);
};

const start = () => {
  window.requestAnimationFrame(mainLoop);
};

window.addEventListener("load", start);
