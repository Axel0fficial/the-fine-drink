import { PoolKey } from "@/data/pools";
export type Difficulty = "easy" | "normal" | "hard" | "brutal";
export type MinigameType = "fineDrink";

export type PlayerStatus = {
  id: string;
  name: string;
  description: string;
  remainingRounds: number;
  sourceChallengeId?: string;
  nature?: "good" | "bad";
};

export type Player = {
  id: string;
  name: string;
  score: number;
  statuses: PlayerStatus[];
};

export type ChallengeType = "simple" | "status" | "minigame" | "custom";

export type FineDrinkData = {
  offerNature: "good" | "bad" | "random";
};

export type Challenge = {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  difficulty: Difficulty;
  statusEffect?: PlayerStatus;
  variables?: ChallengeVariable[];

  minigameType?: MinigameType;
  fineDrinkData?: FineDrinkData;
};

export type ChallengeVariable =
  | {
      type: "number";
      key: string;
      min: number;
      max: number;
    }
  | {
      type: "pool";
      key: string;
      pools: PoolKey[];
    }
  | {
      type: "poolGroup";
      keys: string[];
      allowedPools: PoolKey[];
      allowRepeats?: boolean;
    };
