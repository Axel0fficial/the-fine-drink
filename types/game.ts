import { PoolKey } from "@/data/pools";
export type Difficulty = "easy" | "normal" | "hard" | "brutal";

export type MinigameType = "fineDrink" | "quickChoice";

export type PlayerPreference = {
  nonDrinker: boolean;
};

export type TeamColor = "none" | "red" | "blue" | "green" | "yellow" | "purple";

export type SavedPlayer = {
  id: string;
  name: string;
  preferences: PlayerPreference;
};

export type Player = {
  id: string;
  name: string;
  score: number;
  statuses: PlayerStatus[];
  preferences: PlayerPreference;
  team: TeamColor;
};

export type PlayerStatus = {
  id: string;
  name: string;
  description: string;
  remainingRounds: number;
  sourceChallengeId?: string;
  nature?: "good" | "bad";
};

export type ChallengeType = "simple" | "status" | "minigame" | "custom";

export type FineDrinkData = {
  offerNature: "good" | "bad" | "random";
};
export type ChallengeTag = "drinking" | "nonDrinkerSafe" | "teams" | "custom";

export type Challenge = {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  difficulty: Difficulty;

  tags: ChallengeTag[];

  baseChance: number;
  minChance: number;
  enabled: boolean;
  maxChance: number;

  isFavorite: boolean;
  likes: number;
  dislikes: number;

  statusEffect?: PlayerStatus;
  variables?: ChallengeVariable[];

  minigameType?: MinigameType;
  fineDrinkData?: FineDrinkData;
  quickChoiceData?: QuickChoiceData;
};

export type QuickChoiceQuestion = {
  word: string;
  correctOptions: string[];
};

export type QuickChoiceData = {
  durationSeconds: number;
  questionSet: "default";
  wrongOptionPool: string[];
  rewards: string[];
  punishments: string[];
};
export type GameMode = "standard" | "custom";

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
    }
  | {
      type: "team";
      key: string;
    };

export type DrinkyEventType =
  | "nonsense"
  | "joke"
  | "flirt"
  | "challengeModifier"
  | "pushChallenge"
  | "secondChallenge"
  | "easierChallenge"
  | "grantStatus";

export type DrinkyEvent = {
  id: string;
  type: DrinkyEventType;
  text: string;
  tags: ChallengeTag[];
  image: any;

  statusEffect?: PlayerStatus;
  extraChallenge?: Challenge;
};
