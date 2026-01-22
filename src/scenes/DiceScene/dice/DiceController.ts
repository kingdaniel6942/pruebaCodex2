import { Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector";
import type { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import type { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { config } from "../../../core/config";
import { randomInRange } from "../../../utils/rng";

export class DiceController {
  private settleCounter = 0;

  constructor(public mesh: Mesh, public aggregate: PhysicsAggregate) {}

  reset(position: Vector3) {
    this.mesh.position.copyFrom(position);
    this.mesh.rotationQuaternion = Quaternion.Identity();
    this.mesh.computeWorldMatrix(true);
    this.aggregate.body.setLinearVelocity(Vector3.Zero());
    this.aggregate.body.setAngularVelocity(Vector3.Zero());
    const plugin = this.mesh.getScene().getPhysicsEngine()?.getPhysicsPlugin();
    if (plugin && "setPhysicsBodyTransformation" in plugin) {
      (plugin as HavokPlugin).setPhysicsBodyTransformation(this.aggregate.body, this.mesh);
    }
    this.settleCounter = 0;
  }

  roll() {
    const impulse = new Vector3(
      randomInRange(-0.6, 0.6),
      randomInRange(1.0, 1.4),
      randomInRange(-0.6, 0.6)
    ).normalize().scale(config.dice.impulseStrength);

    const torque = new Vector3(
      randomInRange(-1, 1),
      randomInRange(-1, 1),
      randomInRange(-1, 1)
    ).scale(config.dice.torqueStrength);

    this.aggregate.body.applyImpulse(impulse, this.mesh.getAbsolutePosition());
    this.aggregate.body.applyAngularImpulse(torque);
  }

  update(): boolean {
    const linear = this.aggregate.body.getLinearVelocity() ?? Vector3.Zero();
    const angular = this.aggregate.body.getAngularVelocity() ?? Vector3.Zero();
    const linearSpeed = linear.length();
    const angularSpeed = angular.length();

    if (
      linearSpeed < config.dice.linearSleepThreshold &&
      angularSpeed < config.dice.angularSleepThreshold
    ) {
      this.settleCounter += 1;
    } else {
      this.settleCounter = 0;
    }

    return this.settleCounter >= config.dice.settleFrames;
  }
}
