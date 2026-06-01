export type Difficulty = "easy" | "normal" | "hard" | "brutal";

export type PlayerStatus = {
  id: string;
  name: string;
  description: string;

  remainingRounds: number;

  sourceChallengeId?: string;
};

export type Player = {
  id: string;
  name: string;
  score: number;
  statuses: PlayerStatus[];
};

export type ChallengeType = "simple" | "status" | "minigame" | "custom";

export type Challenge = {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  difficulty: Difficulty;
  statusEffect?: PlayerStatus;
};
