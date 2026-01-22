import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector4 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";
import { config } from "../../../core/config";

const faceOrder = [2, 5, 3, 4, 1, 6];

function createDiceTexture(scene: Scene) {
  const tileSize = 256;
  const columns = 3;
  const rows = 2;
  const texture = new DynamicTexture(
    "dice-atlas",
    { width: tileSize * columns, height: tileSize * rows },
    scene,
    false
  );
  const context = texture.getContext();
  context.fillStyle = "#f7f7f7";
  context.fillRect(0, 0, texture.getSize().width, texture.getSize().height);

  const pipColor = "#111111";
  const radius = tileSize * 0.08;
  const offset = tileSize * 0.22;
  const mid = tileSize / 2;

  const pipPositions: Record<number, Array<[number, number]>> = {
    1: [[mid, mid]],
    2: [[offset, offset], [tileSize - offset, tileSize - offset]],
    3: [[offset, offset], [mid, mid], [tileSize - offset, tileSize - offset]],
    4: [
      [offset, offset],
      [tileSize - offset, offset],
      [offset, tileSize - offset],
      [tileSize - offset, tileSize - offset]
    ],
    5: [
      [offset, offset],
      [tileSize - offset, offset],
      [mid, mid],
      [offset, tileSize - offset],
      [tileSize - offset, tileSize - offset]
    ],
    6: [
      [offset, offset],
      [tileSize - offset, offset],
      [offset, mid],
      [tileSize - offset, mid],
      [offset, tileSize - offset],
      [tileSize - offset, tileSize - offset]
    ]
  };

  faceOrder.forEach((value, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const originX = col * tileSize;
    const originY = row * tileSize;
    context.fillStyle = "#f7f7f7";
    context.fillRect(originX, originY, tileSize, tileSize);
    context.strokeStyle = "#d0d0d0";
    context.lineWidth = 6;
    context.strokeRect(originX + 6, originY + 6, tileSize - 12, tileSize - 12);

    context.fillStyle = pipColor;
    pipPositions[value].forEach(([x, y]) => {
      context.beginPath();
      context.arc(originX + x, originY + y, radius, 0, Math.PI * 2);
      context.fill();
    });
  });

  texture.update(false);
  texture.wrapU = Texture.CLAMP_ADDRESSMODE;
  texture.wrapV = Texture.CLAMP_ADDRESSMODE;
  return { texture, columns, rows };
}

function createFaceUVs(columns: number, rows: number) {
  const uvs: Vector4[] = [];
  const tileW = 1 / columns;
  const tileH = 1 / rows;
  for (let index = 0; index < 6; index += 1) {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const u0 = col * tileW;
    const v0 = row * tileH;
    const u1 = u0 + tileW;
    const v1 = v0 + tileH;
    uvs.push(new Vector4(u0, v0, u1, v1));
  }
  return uvs;
}

export function createDiceMesh(scene: Scene, name: string) {
  const { size } = config.dice;
  const { texture, columns, rows } = createDiceTexture(scene);
  const faceUV = createFaceUVs(columns, rows);
  const mesh = MeshBuilder.CreateBox(
    name,
    { size, faceUV },
    scene
  );

  const material = new StandardMaterial(`${name}-mat`, scene);
  material.diffuseTexture = texture;
  material.specularColor = new Color3(0.35, 0.35, 0.35);
  mesh.material = material;

  return mesh;
}
