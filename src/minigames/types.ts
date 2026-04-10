export type PromptAudience = "all" | "drinkers_only" | "non_drinkers_only";

export type MatchStatusTone = "good" | "bad";
export type MatchStatusScope = "global" | "player";

export type MatchStatus = {
  id: string;
  scope: MatchStatusScope;
  playerId?: string;
  playerName?: string;
  text: string;
  tone: MatchStatusTone;
  sourceChallengeId: string;
  remainingRounds?: number | null;
};

export type ImmediateAction = {
  type: "action";
  text: string;
  audience: PromptAudience;
  tone: MatchStatusTone;
};

export type PersistentStatusEffect = {
  type: "status";
  text: string;
  audience: PromptAudience;
  tone: MatchStatusTone;
  scope: MatchStatusScope;
  remainingRounds?: number | null;
};

export type FineDrinkEffect = ImmediateAction | PersistentStatusEffect;

export type MiniGameResult = {
  outcome: "completed" | "win" | "lose" | "tie" | "passed";
  pointsAwarded?: number;
  statusText?: string;
  appliedStatuses?: MatchStatus[];
  immediateEffects?: {
    text: string;
    tone: "good" | "bad";
  }[];
  payload?: Record<string, any>;
};
