import type { EventBus } from "../core/EventBus";
import type { GameEventMap } from "../core/types";
import { EngineProvider } from "./EngineProvider";
import { SceneManager } from "../scenes/SceneManager";
import { DiceScene } from "../scenes/DiceScene";

export class GameApp {
  private engineProvider: EngineProvider | null = null;
  private sceneManager: SceneManager | null = null;
  private renderLoop?: () => void;

  constructor(private canvas: HTMLCanvasElement, private eventBus: EventBus<GameEventMap>) {}

  async start() {
    this.engineProvider = new EngineProvider(this.canvas);
    this.sceneManager = new SceneManager(this.engineProvider.engine);
    await this.sceneManager.switchScene(new DiceScene(this.engineProvider.engine, this.eventBus));

    this.renderLoop = () => {
      this.sceneManager?.render();
    };
    this.engineProvider.engine.runRenderLoop(this.renderLoop);
  }

  dispose() {
    if (this.engineProvider?.engine && this.renderLoop) {
      this.engineProvider.engine.stopRenderLoop(this.renderLoop);
    }
    this.sceneManager?.dispose();
    this.engineProvider?.dispose();
    this.sceneManager = null;
    this.engineProvider = null;
  }
}
