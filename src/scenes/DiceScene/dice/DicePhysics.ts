import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { Scene } from "@babylonjs/core/scene";
import { config } from "../../../core/config";

export function createDicePhysics(scene: Scene, mesh: Mesh) {
  const { mass, friction, restitution } = config.dice;
  return new PhysicsAggregate(
    mesh,
    PhysicsShapeType.BOX,
    { mass, friction, restitution },
    scene
  );
}
