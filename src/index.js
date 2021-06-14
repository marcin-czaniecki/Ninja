import { createImage } from "./helpers/helpers.mjs";
import { SpriteSheet } from "./animations/animations.mjs";
import { onKeyUp, onKeyDown } from "./control/keyControl.mjs";
import { nitro } from "./control/nitro.mjs";
import { area, player, robot } from "./data.mjs";
import { Mob } from "./mobs/Mob.mjs";

// Constants
const root = document.getElementById("root");

const rules = {
  screenShakeRadius: 16,
  playGameMode: 0,
  gameOverGameMode: 1,
  screenShake: false,
};

const robots = [];
// Preparation
const canvas = document.createElement("canvas");
canvas.width = area.width;
canvas.height = area.height;

let gameMode = rules.playGameMode;

const context = canvas.getContext("2d");
const bush01Image = createImage("./assets/images/bush1.png");
const bush02Image = createImage("./assets/images/bush2.png");
const backgroundImage = createImage("./assets/images/background.png");

const bushData = area.generateWorldElement(area.width, [
  bush01Image,
  bush02Image,
]);

const bushData2 = area.generateWorldElement(
  area.width,
  [bush01Image, bush02Image],
  -100
);

const refreshBush = (bushData) => {
  for (const bush of bushData) {
    if (bush.x - area.camera.x < -area.width) {
      bush.x += 2 * area.width + 150;
    }
  }
};

const doesPlayerOverlapMobAlongOneAxis = (
  playerNearAxi,
  playerFarAxi,
  mobNearAxi,
  mobFarAxi
) => {
  const playerOverlapsNearMobEdge =
    playerFarAxi >= mobNearAxi && playerFarAxi <= mobFarAxi;
  const playerOverlapsFarMobEdge =
    playerNearAxi >= mobNearAxi && playerNearAxi <= mobFarAxi;
  const playerOverlapsEntireMob =
    playerNearAxi <= mobNearAxi && playerFarAxi >= mobFarAxi;
  return (
    playerOverlapsNearMobEdge ||
    playerOverlapsFarMobEdge ||
    playerOverlapsEntireMob
  );
};

function doesPlayerOverlapMob(
  playerX,
  playerY,
  playerWidth,
  playerHeight,
  mobX,
  mobY,
  mobWidth,
  mobHeight
) {
  var playerOverlapsMobOnXAxis = doesPlayerOverlapMobAlongOneAxis(
    playerX,
    playerX + playerWidth,
    mobX,
    mobX + mobWidth
  );
  var playerOverlapsMobOnYAxis = doesPlayerOverlapMobAlongOneAxis(
    playerY,
    playerY + playerHeight,
    mobY,
    mobY + mobHeight
  );
  return playerOverlapsMobOnXAxis && playerOverlapsMobOnYAxis;
}

const updateMobs = (mobBasicParameter, mobs, area, player) => {
  let playerTouchedAMob = false;
  for (const mob of mobs) {
    const playerHorizontal =
      player.position.x + player.collisionRectangle.xOffset;
    const playerVertical =
      player.position.y + player.collisionRectangle.yOffset;

    const mobHorizontal = mob.x + robot.collisionRectangle.xOffset;
    const mobVertical = mob.y + robot.collisionRectangle.yOffset;

    if (
      doesPlayerOverlapMob(
        playerHorizontal,
        playerVertical,
        player.collisionRectangle.width,
        player.collisionRectangle.height,
        mobHorizontal,
        mobVertical,
        robot.collisionRectangle.width,
        robot.collisionRectangle.height
      )
    ) {
      playerTouchedAMob = true;
    }
    mob.x -= mobBasicParameter.horizontal.speed;
    if (area.frameCounter % mobBasicParameter.animation.speed === 0) {
      mob.frameNr += 1;
      if (mob.frameNr >= mobBasicParameter.animation.frames) {
        mob.frameNr = 0;
      }
    }
  }
  let mobIndex = 0;

  while (mobIndex <= mobs.length) {
    const mobIsOutArea =
      mobs[mobIndex]?.x < area.camera.x - mobBasicParameter.width;
    if (mobIsOutArea) {
      mobs.splice(mobIndex, 1);
    } else {
      mobIndex += 1;
    }

    const isMaximumMuchMobs = mobs.length < mobBasicParameter.spawn.maxMobs;
    if (isMaximumMuchMobs) {
      let lastMobX = area.width;
      if (mobs.length > 0) {
        lastMobX = mobs[mobs.length - 1].x;
      }

      const maxDistance = mobBasicParameter.spawn.distance.max;
      const minDistance = mobBasicParameter.spawn.distance.min;
      const differenceDistance = Math.random() * (maxDistance - minDistance);
      const newMobPositionsX = lastMobX + minDistance + differenceDistance;

      mobs.push(
        new Mob(newMobPositionsX, area.groundY - mobBasicParameter.height)
      );
    }
  }
  return playerTouchedAMob;
};

const update = () => {
  if (gameMode != rules.playGameMode) return;
  area.frameCounter += 1;
  rules.screenShake = false;
  var nanonautTouchedARobot = updateMobs(robot, robots, area, player);
  if (nanonautTouchedARobot) {
    rules.screenShake = true;
    if (player.hp > 0) {
      player.hp -= 1;
    }
    if (player.hp <= 0) {
      gameMode = rules.gameOverGameMode;
      rules.screenShake = false;
    }
  }

  player.update();
  nitro(player, 15, 3, 5);

  refreshBush(bushData);
  refreshBush(bushData2);
};

const draw = () => {
  context.clearRect(0, 0, area.width, area.height);

  let shakenCameraX = area.camera.x;
  let shakenCameraY = area.camera.y;
  if (rules.screenShake) {
    shakenCameraX += (Math.random() - 0.5) * rules.screenShakeRadius;
    shakenCameraY += (Math.random() - 0.5) * rules.screenShakeRadius;
  }

  //World - sky - background - ground
  area.draw(context, backgroundImage);

  //World elements
  for (const bush of bushData) {
    context.drawImage(
      bush.image,
      bush.x - shakenCameraX,
      area.groundY - bush.y - shakenCameraY
    );
  }

  for (const position of robots) {
    const robotSpriteSheet = new SpriteSheet(
      robot.image,
      position.frameNr,
      robot.animation.framesPerRow,
      robot.width,
      robot.height
    );

    robotSpriteSheet.draw(context, position.x - shakenCameraX, 400);
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
    player.position.x - shakenCameraX,
    player.position.y
  );
  for (const bush of bushData2) {
    context.drawImage(
      bush.image,
      bush.x - shakenCameraX,
      area.groundY - bush.y - shakenCameraY
    );
  }

  const playerDistance = player.position.x / 100;
  context.fillStyle = "black";
  context.font = "48px sans-serif";
  context.fillText(playerDistance.toFixed(0) + "m", 20, 40);

  context.fillStyle = "red";
  context.fillRect(400, 10, (player.hp / player.maxHp) * 380, 20);
  context.strokeStyle = "red";
  context.strokeRect(400, 10, 380, 20);

  if (gameMode === rules.gameOverGameMode) {
    context.fillStyle = "black";
    context.font = "96px sans-serif";
    context.fillText("KONIEC GRY", 120, 300);
  }
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

//events
window.addEventListener("keyup", onKeyUp(player));
window.addEventListener("keydown", onKeyDown(player));
window.addEventListener("load", start);

root.appendChild(canvas);
