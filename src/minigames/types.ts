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

export type MiniGameResult = {
  outcome: "completed" | "win" | "lose" | "tie" | "passed";
  pointsAwarded?: number;
  statusText?: string;
  appliedStatus?: MatchStatus;
  payload?: Record<string, any>;
};
