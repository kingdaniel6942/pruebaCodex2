Eres Codex actuando como un ingeniero senior. Crea un proyecto de videojuego web con TypeScript, Vite, React, Babylon.js y Havok Physics usando una arquitectura en capas (layered) legible, escalable y flexible.

Objetivo del juego:
- Mostrar un tablero (mesa) y 2-3 dados 3D en el centro.
- Cada vez que el usuario haga click sobre el tablero, los dados deben “revolverse” y lanzarse con física realista sobre el tablero (aplicar impulso + torque aleatorios).
- Detectar cuando los dados se detienen (sleep / velocity baja por cierto tiempo) y mostrar el resultado (cara superior) en un HUD React.
- Mantener el código organizado por capas: app/core/scenes/domain/infra/ui/state/utils como se detalla abajo.

Stack y decisiones técnicas:
- TypeScript + Vite (React + TS).
- Babylon.js para render 3D.
- Havok Physics para físicas:
  - Instalar e integrar Havok via @babylonjs/havok (o el método recomendado por Babylon).
  - Activar physics engine en la escena y usar cuerpos físicos para dados y tablero.
- React solo para UI/HUD (overlay HTML), no para render 3D.
- Usa una sola escena principal "DiceScene" por ahora, pero implementa un SceneManager para escalar.

Arquitectura requerida (estructura de carpetas):
/src
  /app
    GameApp.ts              // punto de entrada: engine + scene manager + loop
    EngineProvider.ts       // crea Engine, maneja canvas y resize
  /core
    config.ts               // config global (debug, gravedad, parámetros dados)
    types.ts                // tipos e interfaces compartidas
    EventBus.ts             // pub/sub simple para desacoplar escenas, UI y store
    Logger.ts               // logger básico
  /scenes
    BaseScene.ts            // contrato común (create, dispose)
    SceneManager.ts         // cambiar escenas (aunque solo haya una)
    DiceScene/
      index.ts
      DiceScene.ts
      environment/
        Camera.ts
        Lights.ts
        Table.ts            // crea tablero mesh + collider/rigid body estático
      dice/
        DiceFactory.ts      // crea mesh/material del dado (con numeración simple o textura)
        DicePhysics.ts      // crea rigid body del dado con fricción/restitución
        DiceController.ts   // roll(): impulso + torque; settle detection; eventos
        DiceResultResolver.ts // cara superior a partir de rotación/orientación
      systems/
        InputSystem.ts      // click picking sobre tablero → dispara roll
        DebugSystem.ts      // opcional: axes, inspector en dev
  /state
    GameStore.ts            // estado simple: últimos resultados, contador de tiradas
  /ui
    App.tsx                 // UI React principal
    HUD.tsx                 // muestra resultados y botón opcional
    bindings.ts             // conecta EventBus/Store con React
  /utils
    disposables.ts
    rng.ts                  // random (opcional semilla)
    math.ts
  main.ts                   // arranque Vite/React y montaje
  babylon/
    BabylonCanvas.tsx       // componente React que renderiza el <canvas> y arranca GameApp

Requisitos funcionales:
1) Setup proyecto:
- Inicializa Vite + React + TS.
- Añade dependencias Babylon:
  - @babylonjs/core
  - @babylonjs/gui (opcional, pero HUD será React, no GUI)
  - @babylonjs/inspector (solo en dev opcional)
  - @babylonjs/havok (o equivalente recomendado)
- Configura Vite para servir assets.

2) Canvas y arranque:
- Crea un componente React BabylonCanvas.tsx que renderice un <canvas> full-screen.
- En useEffect, instancia GameApp pasando el canvas.
- GameApp debe:
  - inicializar EngineProvider (Babylon Engine),
  - inicializar SceneManager,
  - cargar DiceScene,
  - arrancar el render loop.
- Asegúrate de dispose correcto al desmontar el componente.

3) DiceScene:
- Crear escena Babylon, cámara orbital (ArcRotateCamera) apuntando al centro del tablero.
- Luz hemisférica + una direccional suave.
- Tablero: un plano o caja grande (mesa) centrada en (0,0,0). Debe ser estático con física (collider).
- Dados: crea 3 dados en el centro (pequeña separación). Deben tener rigid body dinámico.
- Paràmetros recomendados:
  - gravedad: (0, -9.81, 0)
  - fricción tablero moderada, restitución baja-media.
  - dados con masa ~1, fricción similar, restitución un poco mayor.
- Input:
  - Al hacer click sobre el tablero (picking), dispara una tirada:
    - primero “revolver”: resetear velocidades a 0 y reposicionar dados cerca del centro con una pequeña altura (y=1..2).
    - luego aplicar impulsos y torques aleatorios (diferentes para cada dado).
- Detectar fin de tirada:
  - Considera “settled” cuando la velocidad lineal y angular estén bajo umbral durante X frames, o usa sleep si Havok lo permite.
  - Cuando todos estén settled, resolver cara superior de cada dado (DiceResultResolver) y emitir evento.
- Emitir eventos:
  - EventBus: "ROLL_STARTED", "ROLL_FINISHED" con payload { results: number[], rollCount }.

4) Resolver cara superior:
- Implementa una forma robusta:
  - Define para el dado un mapeo de sus normales locales (up faces) a valores 1-6.
  - Calcula el vector "up" del dado en mundo (transform normal local).
  - Elige la cara cuya normal en mundo tenga mayor dot con Vector3.Up().
- Asegúrate que el dado tenga orientación consistente al crearlo (DiceFactory).

5) UI React (HUD):
- Overlay arriba del canvas mostrando:
  - “Tirada #N”
  - resultados de cada dado (e.g. D1: 4, D2: 1, D3: 6)
  - estado: “Tirando…” vs “Listo”
- Conecta HUD a GameStore o a EventBus:
  - bindings.ts suscribe a EventBus y actualiza GameStore.
  - Usa un hook simple para re-render.

6) Calidad y mantenimiento:
- No pongas lógica de juego en componentes React: React solo UI.
- Mantén Babylon en /scenes y /app.
- Añade comentarios breves en puntos clave.
- Asegura dispose de observers y meshes en dispose() de escenas/sistemas.

7) Scripts:
- package.json: dev/build/preview/lint (opcional).
- README.md con:
  - cómo instalar, correr, build.
  - descripción del juego y arquitectura.

8) Git y push al repo:
- Inicializa git y agrega remote:
  - git init
  - git remote add origin git@github.com:kingdaniel6942/pruebaCodex2.git
- Haz commit con mensaje claro.
- Push a la rama main (crea main si no existe):
  - git branch -M main
  - git add .
  - git commit -m "Initial commit: Babylon+Havok dice game with layered architecture"
  - git push -u origin main

Entrega:
- Debe compilar y correr con `npm install` y `npm run dev`.
- No dejes código incompleto.
- Si Havok requiere cargar wasm u otro archivo, documenta y configura correctamente (asegura que Vite lo sirva).
- Verifica que el click sobre el tablero siempre dispare una nueva tirada (aunque click en vacío no haga nada).

Ahora ejecuta todos los pasos, crea los archivos con la estructura indicada, implementa el juego y sube el proyecto al repositorio indicado.
