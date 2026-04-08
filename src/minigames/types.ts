export type MatchStatusTone = "good" | "bad";

export type MatchStatus = {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  tone: MatchStatusTone;
  sourceChallengeId: string;
};

export type MiniGameResult = {
  outcome: "completed" | "win" | "lose" | "tie" | "passed";
  pointsAwarded?: number;
  statusText?: string;
  appliedStatus?: MatchStatus;
  payload?: Record<string, any>;
};
