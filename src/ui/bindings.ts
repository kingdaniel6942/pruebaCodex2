import { useSyncExternalStore } from "react";
import { EventBus } from "../core/EventBus";
import type { GameEventMap, GameState } from "../core/types";
import { GameStore } from "../state/GameStore";

export type GameBindings = {
  eventBus: EventBus<GameEventMap>;
  store: GameStore;
};

let cached: GameBindings | null = null;

export function createGameBindings(): GameBindings {
  if (cached) return cached;
  const eventBus = new EventBus<GameEventMap>();
  const store = new GameStore();

  eventBus.on("ROLL_STARTED", ({ rollCount }) => {
    store.setState({ rollCount, status: "rolling" });
  });

  eventBus.on("ROLL_FINISHED", ({ rollCount, results }) => {
    store.setState({ rollCount, results, status: "idle" });
  });

  cached = { eventBus, store };
  return cached;
}

export function useGameState(store: GameStore): GameState {
  return useSyncExternalStore(
    (listener) => store.subscribe(listener),
    () => store.getState()
  );
}
