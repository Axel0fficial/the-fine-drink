export type TeamColor = "none" | "red" | "blue" | "green" | "yellow";
export type Difficulty = "easy" | "normal" | "hard" | "brutal";
export type ModifierScope = "session" | "leader" | "last_place" | "player";

export type PlayerProfile = {
  id: string;
  name: string;
  totalPoints: number;
  totalWins: number;
};

export type GamePlayer = {
  id: string;
  profileId?: string;
  name: string;
  score: number;
  team: TeamColor;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;

  difficulty: Difficulty;
  categories: string[];
  points: number;

  baseChance: number;
  minChance: number;
  maxChance: number;

  cooldownTurns: number;
  isUnique: boolean;
  isFavorite: boolean;
  isCustom: boolean;
  enabled: boolean;

  logicType?:
    | "none"
    | "range"
    | "timer"
    | "random_player"
    | "vote"
    | "status_effect";

  logicConfig?: Record<string, any>;

  difficultyLogic?: {
    easy?: Record<string, any>;
    normal?: Record<string, any>;
    hard?: Record<string, any>;
    brutal?: Record<string, any>;
  };
};

export type GameMode = {
  id: string;
  name: string;
  description?: string;
  allowedCategories: string[];
  defaultRounds: number;
  teamMode: boolean;
  difficultyRules?: Record<string, any>;
  routeTarget?: "/game" | "/custom1";
};

export type LeaderboardEntry = {
  id: string;
  type: "solo" | "team";
  playerProfileId?: string;
  teamName?: string;
  score: number;
  wins?: number;
  gameModeId?: string;
  createdAt: string;
};

export type ModifierType =
  | "catch_up_bonus"
  | "leader_penalty"
  | "temporary_status"
  | "permanent_session_rule"
  | "difficulty_shift";

export type SessionModifier = {
  id: string;
  title: string;
  description: string;

  type: ModifierType;
  scope: ModifierScope;

  enabled: boolean;
  isCustom: boolean;

  duration?: "turn" | "round" | "session";
  pointsAdjustment?: number;

  logicConfig?: Record<string, any>;
};

export type ActiveEffect = {
  id: string;
  sourceModifierId?: string;
  sourceChallengeId?: string;

  playerId?: string;
  teamId?: string;

  effectType: string;
  description: string;

  expiresAfter?: "turn" | "round" | "session";
  expiresAtRound?: number;
  expiresAtTurn?: number;

  config?: Record<string, any>;
};