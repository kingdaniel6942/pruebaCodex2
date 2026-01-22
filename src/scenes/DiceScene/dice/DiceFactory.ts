import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import type { Scene } from "@babylonjs/core/scene";
import { config } from "../../../core/config";

const faceColors = [
  new Color4(0.95, 0.95, 0.95, 1),
  new Color4(0.9, 0.85, 0.85, 1),
  new Color4(0.85, 0.9, 0.85, 1),
  new Color4(0.85, 0.9, 0.95, 1),
  new Color4(0.95, 0.9, 0.85, 1),
  new Color4(0.9, 0.85, 0.95, 1)
];

export function createDiceMesh(scene: Scene, name: string) {
  const { size } = config.dice;
  const mesh = MeshBuilder.CreateBox(
    name,
    { size, faceColors },
    scene
  );

  const material = new StandardMaterial(`${name}-mat`, scene);
  material.diffuseColor = new Color3(0.95, 0.95, 0.95);
  material.specularColor = new Color3(0.4, 0.4, 0.4);
  mesh.material = material;

  return mesh;
}
