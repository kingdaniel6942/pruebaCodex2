import type { GameState } from "../core/types";

export class GameStore {
  private state: GameState = {
    rollCount: 0,
    results: [],
    status: "idle"
  };
  private listeners = new Set<() => void>();

  getState() {
    return this.state;
  }

  setState(partial: Partial<GameState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
