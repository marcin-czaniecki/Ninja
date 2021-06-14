export const nitro = (mob, ...speeds) => {
  if (mob.activeNitro) {
    mob.horizontal.speed = speeds[0];
    mob.animation.speed = 2;
    mob.jump.height = 25;
    setTimeout(() => {
      mob.horizontal.speed = speeds[1];
      mob.animation.speed = 4;
      mob.jump.height = 20;
    }, 5000);
    setTimeout(() => {
      mob.horizontal.speed = speeds[2];
      mob.animation.speed = 3;
    }, 15000);
  }
};

export const useNitro = (mob) => {
  if (mob.canNitro) {
    mob.activeNitro = true;
    setTimeout(() => {
      mob.canNitro = true;
    }, 30000);
  }
  mob.canNitro = false;
};
