import type { Scene } from "@babylonjs/core/scene";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";

export class InputSystem {
  private observer: ReturnType<Scene["onPointerObservable"]["add"]> | null = null;

  constructor(
    private scene: Scene,
    private table: Mesh,
    private onRollRequested: () => void
  ) {}

  attach() {
    this.observer = this.scene.onPointerObservable.add((event) => {
      if (event.type !== PointerEventTypes.POINTERDOWN) return;
      const pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
      if (pick?.hit && pick.pickedMesh && pick.pickedMesh === this.table) {
        this.onRollRequested();
      }
    });
  }

  dispose() {
    if (this.observer) {
      this.scene.onPointerObservable.remove(this.observer);
      this.observer = null;
    }
  }
}
