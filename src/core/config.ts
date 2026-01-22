export const config = {
  debug: false,
  gravity: { x: 0, y: -9.81, z: 0 },
  dice: {
    count: 2,
    size: 0.9,
    mass: 1,
    restitution: 0.35,
    friction: 0.6,
    linearSleepThreshold: 0.08,
    angularSleepThreshold: 0.12,
    settleFrames: 35,
    impulseStrength: 4.2,
    torqueStrength: 4
  },
  table: {
    width: 8,
    depth: 6,
    height: 0.4,
    friction: 0.8,
    restitution: 0.15
  }
};
