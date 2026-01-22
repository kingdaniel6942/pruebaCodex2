import type { Scene } from "@babylonjs/core/scene";

export interface BaseScene {
  scene: Scene;
  create(): Promise<void> | void;
  dispose(): void;
}
