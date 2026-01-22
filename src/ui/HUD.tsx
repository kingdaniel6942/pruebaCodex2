import type { GameState } from "../core/types";

type HUDProps = {
  state: GameState;
};

export default function HUD({ state }: HUDProps) {
  return (
    <div className="hud">
      <h1>Tirada #{state.rollCount}</h1>
      <div className="status">Estado: {state.status === "rolling" ? "Tirando..." : "Listo"}</div>
      <ul>
        {state.results.length === 0 ? (
          <li>Haz click en la mesa para lanzar.</li>
        ) : (
          state.results.map((value, index) => (
            <li key={`dice-${index}`}>{`D${index + 1}: ${value}`}</li>
          ))
        )}
      </ul>
    </div>
  );
}
