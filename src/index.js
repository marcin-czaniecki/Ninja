import {
  createImage,
  generateWorldElement,
  SpriteSheet,
  enumKeyName,
  Mob,
} from "./helpers.mjs";
import { nitro, useNitro } from "./nitro.mjs";
import { area, player, robot } from "./data.mjs";
// Constants
const root = document.getElementById("root");

const playerCollisionRectangle = {
  xOffset: 60,
  yOffset: 20,
  width: 50,
  height: 200,
};
const robotCollisionRectangle = {
  xOffset: 50,
  yOffset: 20,
  width: 50,
  height: 100,
};
const screenShakeRadius = 16;
const robots = [];
// Preparation
const canvas = document.createElement("canvas");
canvas.width = area.width;
canvas.height = area.height;
let screenShake = false;

const context = canvas.getContext("2d");
const bush01Image = createImage("../assets/images/bush1.png");
const bush02Image = createImage("../assets/images/bush2.png");
const backgroundImage = createImage("../assets/images/background.png");

const bushData = generateWorldElement(area.width, [bush01Image, bush02Image]);
const bushData2 = generateWorldElement(
  area.width,
  [bush01Image, bush02Image],
  -100
);

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
const updateMobs = (mobBasicParameter, mobs, area) => {
  let playerTouchedAMob = false;
  for (const mob of mobs) {
    if (
      doesPlayerOverlapMob(
        player.position.x + playerCollisionRectangle.xOffset,
        player.position.y + playerCollisionRectangle.yOffset,
        playerCollisionRectangle.width,
        playerCollisionRectangle.height,
        mob.x + robotCollisionRectangle.xOffset,
        mob.y + robotCollisionRectangle.yOffset,
        robotCollisionRectangle.width,
        robotCollisionRectangle.height
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
  area.frameCounter += 1;
  screenShake = false;
  var nanonautTouchedARobot = updateMobs(robot, robots, area);
  if (nanonautTouchedARobot) {
    screenShake = true;
    if (player.hp > 0) {
      player.hp -= 1;
    }
  }

  gravitation();
  move();
  runAnimation();
  nitro(player, 15, 3, 5);
  jump();
  refreshBush(bushData);
  refreshBush(bushData2);
};

const draw = () => {
  context.clearRect(0, 0, area.width, area.height);

  let shakenCameraX = area.camera.x;
  let shakenCameraY = area.camera.y;
  if (screenShake) {
    shakenCameraX += (Math.random() - 0.5) * screenShakeRadius;
    shakenCameraY += (Math.random() - 0.5) * screenShakeRadius;
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
  context.fillStyle = "red";
  context.fillRect(400, 10, (player.hp / player.maxHp) * 380, 20);
  context.strokeStyle = "red";
  context.strokeRect(400, 10, 380, 20);
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

const onKeyDown = ({ key }) => {
  switch (key) {
    case enumKeyName.Space:
      player.jump.active = true;
      break;
    case enumKeyName.ArrowRight:
      useNitro(player);
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
