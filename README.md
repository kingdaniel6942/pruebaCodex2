# Babylon + Havok Dice Game

Juego web con Babylon.js + Havok Physics donde puedes lanzar dados 3D haciendo click sobre una mesa. La UI es un HUD React superpuesto al canvas.

## Stack
- TypeScript + Vite + React
- Babylon.js para render 3D
- Havok Physics via `@babylonjs/havok`

## Scripts
```bash
npm install
npm run dev
```

Build:
```bash
npm run build
npm run preview
```

## Arquitectura
```text
src/
  app/        Engine + GameApp
  core/       config, tipos, EventBus
  scenes/     escenas Babylon (DiceScene)
  state/      GameStore
  ui/         HUD React
  utils/      helpers
  babylon/    canvas React
```

## Notas sobre Havok
- El `.wasm` se sirve desde `public/havok/HavokPhysics.wasm` para evitar problemas de MIME.
- Si el navegador bloquea la carga del wasm, revisa la consola y asegúrate de correr con `npm run dev`.

## Controles
- Click sobre la mesa: reinicia y lanza los dados.
