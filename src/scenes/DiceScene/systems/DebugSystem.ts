import type { Scene } from "@babylonjs/core/scene";
import { config } from "../../../core/config";

export class DebugSystem {
  constructor(private scene: Scene) {}

  attach() {
    if (!config.debug) return;
    this.scene.debugLayer.show();
  }

  dispose() {
    if (this.scene.debugLayer.isVisible()) {
      this.scene.debugLayer.hide();
    }
  }
}
