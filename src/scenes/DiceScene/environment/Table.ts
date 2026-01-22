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
  table.isPickable = true;
  const material = new StandardMaterial("table-mat", scene);
  material.diffuseColor = new Color3(0.4, 0.46, 0.5);
  material.specularColor = new Color3(0.2, 0.2, 0.2);
  table.material = material;

  const aggregate = new PhysicsAggregate(
    table,
    PhysicsShapeType.BOX,
    { mass: 0, friction, restitution },
    scene
  );

  const wallThickness = 0.2;
  const wallHeight = 3.4;
  const wallOffsetY = wallHeight / 2;
  const ceilingHeight = wallHeight * 4;
  const enclosureHeight = ceilingHeight;
  const wallMaterial = material.clone("wall-mat");
  wallMaterial.alpha = 0.0;

  const walls = [
    MeshBuilder.CreateBox(
      "wall-north",
      { width: width + wallThickness * 2, height: enclosureHeight, depth: wallThickness },
      scene
    ),
    MeshBuilder.CreateBox(
      "wall-south",
      { width: width + wallThickness * 2, height: enclosureHeight, depth: wallThickness },
      scene
    ),
    MeshBuilder.CreateBox(
      "wall-east",
      { width: wallThickness, height: enclosureHeight, depth },
      scene
    ),
    MeshBuilder.CreateBox(
      "wall-west",
      { width: wallThickness, height: enclosureHeight, depth },
      scene
    )
  ];

  const enclosureOffsetY = enclosureHeight / 2;
  walls[0].position.set(0, enclosureOffsetY, depth / 2 + wallThickness / 2);
  walls[1].position.set(0, enclosureOffsetY, -depth / 2 - wallThickness / 2);
  walls[2].position.set(width / 2 + wallThickness / 2, enclosureOffsetY, 0);
  walls[3].position.set(-width / 2 - wallThickness / 2, enclosureOffsetY, 0);

  const ceiling = MeshBuilder.CreateBox(
    "wall-ceiling",
    { width: width + wallThickness * 2, height: wallThickness, depth: depth + wallThickness * 2 },
    scene
  );
  ceiling.position.set(0, ceilingHeight, 0);
  ceiling.isPickable = false;
  ceiling.material = wallMaterial;

  walls.forEach((wall) => {
    wall.isPickable = false;
    wall.material = wallMaterial;
    new PhysicsAggregate(
      wall,
      PhysicsShapeType.BOX,
      { mass: 0, friction, restitution },
      scene
    );
  });
  new PhysicsAggregate(
    ceiling,
    PhysicsShapeType.BOX,
    { mass: 0, friction, restitution },
    scene
  );

  return { table, aggregate, walls, ceiling };
}
