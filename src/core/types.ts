export type RollStartedPayload = {
  rollCount: number;
};

export type RollFinishedPayload = {
  rollCount: number;
  results: number[];
};

export type RollRequestedPayload = {
  source: "ui";
};

export type GameEventMap = {
  ROLL_STARTED: RollStartedPayload;
  ROLL_FINISHED: RollFinishedPayload;
  ROLL_REQUESTED: RollRequestedPayload;
};

export type GameState = {
  rollCount: number;
  results: number[];
  status: "idle" | "rolling";
};
