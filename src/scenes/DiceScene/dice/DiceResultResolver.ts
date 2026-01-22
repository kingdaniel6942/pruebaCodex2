import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";

const faceNormals: Array<{ normal: Vector3; value: number }> = [
  { normal: Vector3.Up(), value: 1 },
  { normal: Vector3.Down(), value: 6 },
  { normal: Vector3.Forward(), value: 2 },
  { normal: Vector3.Backward(), value: 5 },
  { normal: Vector3.Right(), value: 3 },
  { normal: Vector3.Left(), value: 4 }
];

export function resolveTopFace(mesh: Mesh) {
  const world = mesh.getWorldMatrix();
  let bestDot = -Infinity;
  let bestValue = 1;

  for (const face of faceNormals) {
    const worldNormal = Vector3.TransformNormal(face.normal, world).normalize();
    const dot = Vector3.Dot(worldNormal, Vector3.Up());
    if (dot > bestDot) {
      bestDot = dot;
      bestValue = face.value;
    }
  }

  return bestValue;
}
