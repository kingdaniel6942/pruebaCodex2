import type { Engine } from "@babylonjs/core/Engines/engine";
import type { BaseScene } from "./BaseScene";

export class SceneManager {
  private currentScene: BaseScene | null = null;

  constructor(private engine: Engine) {}

  async switchScene(scene: BaseScene) {
    if (this.currentScene) {
      this.currentScene.dispose();
    }
    this.currentScene = scene;
    await scene.create();
  }

  render() {
    this.currentScene?.scene.render();
  }

  dispose() {
    this.currentScene?.dispose();
    this.currentScene = null;
  }
}
