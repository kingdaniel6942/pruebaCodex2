import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";

export function createLights(scene: Scene) {
  const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
  hemi.intensity = 1.1;

  const dir = new DirectionalLight("dir", new Vector3(-0.3, -1, -0.4), scene);
  dir.position = new Vector3(6, 10, 6);
  dir.intensity = 1.0;

  return { hemi, dir };
}
