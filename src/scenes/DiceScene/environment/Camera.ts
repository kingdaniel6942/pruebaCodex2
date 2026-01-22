import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";

export function createCamera(scene: Scene) {
  const camera = new ArcRotateCamera(
    "dice-camera",
    Math.PI / 4,
    Math.PI / 3,
    12,
    new Vector3(0, 0.5, 0),
    scene
  );
  camera.inputs.clear();
  camera.lowerRadiusLimit = 8;
  camera.upperRadiusLimit = 16;
  camera.wheelDeltaPercentage = 0.01;
  scene.activeCamera = camera;
  return camera;
}
