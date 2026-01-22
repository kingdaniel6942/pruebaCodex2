import HavokPhysics from "@babylonjs/havok";
import "@babylonjs/core/Physics/v2/physicsEngineComponent";
import { Scene } from "@babylonjs/core/scene";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import type { EventBus } from "../../core/EventBus";
import type { GameEventMap } from "../../core/types";
import { config } from "../../core/config";
import { Logger } from "../../core/Logger";
import type { BaseScene } from "../BaseScene";
import { createCamera } from "./environment/Camera";
import { createLights } from "./environment/Lights";
import { createTable } from "./environment/Table";
import { createDiceMesh } from "./dice/DiceFactory";
import { createDicePhysics } from "./dice/DicePhysics";
import { DiceController } from "./dice/DiceController";
import { resolveTopFace } from "./dice/DiceResultResolver";
import { DebugSystem } from "./systems/DebugSystem";

export class DiceScene implements BaseScene {
  scene: Scene;
  private dice: DiceController[] = [];
  private debugSystem?: DebugSystem;
  private unsubscribeRoll?: () => void;
  private rollInProgress = false;
  private rollCount = 0;

  constructor(private engine: Engine, private eventBus: EventBus<GameEventMap>) {
    this.scene = new Scene(engine);
  }

  async create() {
    await this.setupPhysics();
    this.scene.clearColor = new Color4(0.08, 0.1, 0.12, 1);
    createCamera(this.scene);
    createLights(this.scene);

    const { table } = createTable(this.scene);
    this.createDice();

    this.unsubscribeRoll = this.eventBus.on("ROLL_REQUESTED", () => this.startRoll());

    this.debugSystem = new DebugSystem(this.scene);
    this.debugSystem.attach();

    this.scene.onBeforeRenderObservable.add(() => this.update());
  }

  private async setupPhysics() {
    const havok = await HavokPhysics({
      locateFile: () => "/havok/HavokPhysics.wasm"
    });
    const plugin = new HavokPlugin(true, havok);
    this.scene.enablePhysics(
      new Vector3(config.gravity.x, config.gravity.y, config.gravity.z),
      plugin
    );
  }

  private createDice() {
    const spacing = config.dice.size * 1.4;
    const centerOffset = (config.dice.count - 1) / 2;
    for (let i = 0; i < config.dice.count; i += 1) {
      const mesh = createDiceMesh(this.scene, `dice-${i + 1}`);
      mesh.position = new Vector3((i - centerOffset) * spacing, 1.2, 0);
      const aggregate = createDicePhysics(this.scene, mesh);
      this.dice.push(new DiceController(mesh, aggregate));
    }
  }

  private startRoll() {
    if (this.rollInProgress) return;
    this.rollCount += 1;
    this.rollInProgress = true;
    this.eventBus.emit("ROLL_STARTED", { rollCount: this.rollCount });

    const spacing = config.dice.size * 1.2;
    const centerOffset = (config.dice.count - 1) / 2;
    this.dice.forEach((die, index) => {
      const position = new Vector3(
        (index - centerOffset) * spacing,
        1.5 + index * 0.2,
        0
      );
      die.reset(position);
      die.roll();
    });
  }

  private update() {
    if (!this.rollInProgress) return;

    const settled = this.dice.every((die) => die.update());
    if (!settled) return;

    this.rollInProgress = false;
    const results = this.dice.map((die) => resolveTopFace(die.mesh));
    Logger.info("Roll finished", results);
    this.eventBus.emit("ROLL_FINISHED", {
      rollCount: this.rollCount,
      results
    });
  }

  dispose() {
    this.debugSystem?.dispose();
    this.unsubscribeRoll?.();
    this.dice.forEach((die) => die.aggregate.dispose());
    this.scene.dispose();
  }
}
