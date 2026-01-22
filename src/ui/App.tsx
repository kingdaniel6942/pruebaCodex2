import HUD from "./HUD";
import { createGameBindings, useGameState } from "./bindings";
import BabylonCanvas from "../babylon/BabylonCanvas";

const bindings = createGameBindings();

export default function App() {
  const state = useGameState(bindings.store);
  const handleRoll = () => {
    bindings.eventBus.emit("ROLL_REQUESTED", { source: "ui" });
  };

  return (
    <div className="app-root">
      <HUD state={state} onRoll={handleRoll} />
      <BabylonCanvas eventBus={bindings.eventBus} />
    </div>
  );
}
