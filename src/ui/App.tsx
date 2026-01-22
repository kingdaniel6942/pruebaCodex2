import HUD from "./HUD";
import { createGameBindings, useGameState } from "./bindings";
import BabylonCanvas from "../babylon/BabylonCanvas";

const bindings = createGameBindings();

export default function App() {
  const state = useGameState(bindings.store);

  return (
    <div className="app-root">
      <HUD state={state} />
      <BabylonCanvas eventBus={bindings.eventBus} />
    </div>
  );
}
