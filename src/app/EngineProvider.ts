import { Engine } from "@babylonjs/core/Engines/engine";

export class EngineProvider {
  readonly engine: Engine;
  private resizeHandler: () => void;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.resizeHandler = () => this.engine.resize();
    window.addEventListener("resize", this.resizeHandler);
  }

  dispose() {
    window.removeEventListener("resize", this.resizeHandler);
    this.engine.dispose();
  }
}
