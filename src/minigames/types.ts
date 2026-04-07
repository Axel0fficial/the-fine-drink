export type MiniGameResult = {
  outcome: "completed" | "win" | "lose" | "tie";
  pointsAwarded?: number;
  statusText?: string;
  payload?: Record<string, any>;
};