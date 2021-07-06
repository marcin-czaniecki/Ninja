import { World } from "./world/world";
import { getRoot, createImage } from "./helpers/helpers";
import { Player } from "./player/player";
import { Engine } from "./world/Engine";

const world = new World(getRoot(), window.innerWidth, window.innerHeight);
const player = new Player(world, 363, 458);
player.setScale(0.5, 0.5);
player.y = world.height - world.ground;

const spriteSheetPlayerRun = createImage("./assets/ninja/run.png");
const spriteSheetPlayerJump = createImage("./assets/ninja/jump.png");
const ctx = world.context;

let single = false;

const singleAnimation = (...conditions: boolean[]): void => {
  for (const condition of conditions) {
    if (!condition) {
      single = false;
      break;
    }
    if (condition) {
      single = true;
    }
  }
};

const update = () => {
  singleAnimation(player.isAir);
  player.updateGravitation();
  player.updateRun();
  player.updateAnimation(10, single);
  world.cameraObserveY(player.y);
  world.cameraObserveX(player.x, -150);
};

const draw = () => {
  ctx.clearRect(0, 0, world.width, world.height);
  if (!player.isAir) {
    player.drawAnimation(
      ctx,
      spriteSheetPlayerRun,
      10,
      player.x - world.camera.x,
      world.camera.y
    );
  }
  if (player.isAir) {
    player.drawAnimation(
      ctx,
      spriteSheetPlayerJump,
      10,
      player.x - world.camera.x,
      world.camera.y
    );
  }
};

const engine = new Engine(update, draw);

enum keys {
  SPACE = " ",
  ENTER = "Enter",
}

window.addEventListener("keydown", (e) => {
  console.log(window.onload);
  console.log(e.key);
  switch (e.key) {
    case keys.SPACE:
      player.updateJump(true);
      break;
    case keys.ENTER:
      engine.pause();
      break;
    default:
      break;
  }
});
