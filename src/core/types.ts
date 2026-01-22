export type RollStartedPayload = {
  rollCount: number;
};

export type RollFinishedPayload = {
  rollCount: number;
  results: number[];
};

export type GameEventMap = {
  ROLL_STARTED: RollStartedPayload;
  ROLL_FINISHED: RollFinishedPayload;
};

export type GameState = {
  rollCount: number;
  results: number[];
  status: "idle" | "rolling";
};
