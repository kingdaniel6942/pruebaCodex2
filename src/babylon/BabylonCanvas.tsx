import { useEffect, useRef } from "react";
import type { EventBus } from "../core/EventBus";
import type { GameEventMap } from "../core/types";
import { GameApp } from "../app/GameApp";

type BabylonCanvasProps = {
  eventBus: EventBus<GameEventMap>;
};

export default function BabylonCanvas({ eventBus }: BabylonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const app = new GameApp(canvasRef.current, eventBus);
    void app.start();

    return () => {
      app.dispose();
    };
  }, [eventBus]);

  return (
    <div className="canvas-host">
      <canvas ref={canvasRef} />
    </div>
  );
}
