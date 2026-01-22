import type { GameState } from "../core/types";

type HUDProps = {
  state: GameState;
  onRoll: () => void;
};

export default function HUD({ state, onRoll }: HUDProps) {
  return (
    <div className="hud">
      <h1>Tirada #{state.rollCount}</h1>
      <div className="status">Estado: {state.status === "rolling" ? "Tirando..." : "Listo"}</div>
      <button type="button" onClick={onRoll} disabled={state.status === "rolling"}>
        Lanzar
      </button>
      <ul>
        {state.results.length === 0 ? (
          <li>Presiona lanzar para tirar los dados.</li>
        ) : (
          state.results.map((value, index) => (
            <li key={`dice-${index}`}>{`D${index + 1}: ${value}`}</li>
          ))
        )}
      </ul>
    </div>
  );
}
