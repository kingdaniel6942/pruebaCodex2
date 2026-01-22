import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import type { Scene } from "@babylonjs/core/scene";
import { config } from "../../../core/config";

export function createTable(scene: Scene) {
  const { width, depth, height, friction, restitution } = config.table;
  const table = MeshBuilder.CreateBox(
    "table",
    { width, depth, height },
    scene
  );
  table.position.y = -height / 2;
  const material = new StandardMaterial("table-mat", scene);
  material.diffuseColor = new Color3(0.2, 0.24, 0.28);
  material.specularColor = new Color3(0.1, 0.1, 0.1);
  table.material = material;

  const aggregate = new PhysicsAggregate(
    table,
    PhysicsShapeType.BOX,
    { mass: 0, friction, restitution },
    scene
  );

  return { table, aggregate };
}
