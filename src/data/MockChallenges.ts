import type { Challenge } from "../types/game";

export const mockChallenges: Challenge[] = [
  {
    id: "c1",
    title: "Take a Sip",
    description: "Take {x} sips.",
    difficulty: "easy",
    categories: ["individual", "quantity"],
    points: 1,

    baseChance: 0.8,
    minChance: 0.6,
    maxChance: 1.0,

    cooldownTurns: 2,
    isUnique: false,
    isFavorite: false,
    isCustom: false,
    enabled: true,

    logicType: "range",
    logicConfig: {
      variable: "x",
      min: 1,
      max: 3,
    },

    difficultyLogic: {
      hard: { min: 3, max: 6 },
      brutal: { min: 5, max: 8 },
    },
  },

  {
    id: "c2",
    title: "Waterfall",
    description: "Everyone starts drinking, you can only stop when the player before you stops.",
    difficulty: "normal",
    categories: ["group"],
    points: 3,

    baseChance: 0.4,
    minChance: 0.2,
    maxChance: 0.6,

    cooldownTurns: 5,
    isUnique: false,
    isFavorite: false,
    isCustom: false,
    enabled: true,

    logicType: "none",
  },

  {
    id: "c3",
    title: "Speak in Questions",
    description: "You can only speak in questions for {rounds} rounds.",
    difficulty: "hard",
    categories: ["status"],
    points: 4,

    baseChance: 0.25,
    minChance: 0.15,
    maxChance: 0.4,

    cooldownTurns: 6,
    isUnique: false,
    isFavorite: false,
    isCustom: false,
    enabled: true,

    logicType: "status_effect",
    logicConfig: {
      effect: "questions_only",
      rounds: 2,
    },

    difficultyLogic: {
      brutal: { rounds: 3 },
    },
  },

  {
    id: "c4",
    title: "Pick Someone",
    description: "Choose someone to drink {x} sips.",
    difficulty: "easy",
    categories: ["individual"],
    points: 2,

    baseChance: 0.7,
    minChance: 0.5,
    maxChance: 0.9,

    cooldownTurns: 2,
    isUnique: false,
    isFavorite: false,
    isCustom: false,
    enabled: true,

    logicType: "range",
    logicConfig: {
      variable: "x",
      min: 1,
      max: 2,
    },
  },

  {
    id: "c5",
    title: "Last to React",
    description: "Last person to raise their hand drinks.",
    difficulty: "normal",
    categories: ["group", "reaction"],
    points: 2,

    baseChance: 0.5,
    minChance: 0.3,
    maxChance: 0.7,

    cooldownTurns: 3,
    isUnique: false,
    isFavorite: false,
    isCustom: false,
    enabled: true,

    logicType: "none",
  },

  {
    id: "c6",
    title: "Finish Your Drink",
    description: "Finish your drink in {seconds} seconds.",
    difficulty: "brutal",
    categories: ["individual", "timed"],
    points: 6,

    baseChance: 0.15,
    minChance: 0.05,
    maxChance: 0.25,

    cooldownTurns: 8,
    isUnique: true,
    isFavorite: false,
    isCustom: false,
    enabled: true,

    logicType: "timer",
    logicConfig: {
      seconds: 10,
    },

    difficultyLogic: {
      brutal: { seconds: 7 },
    },
  },

  {
    id: "c7",
    title: "Double Points",
    description: "Next challenge is worth double points.",
    difficulty: "hard",
    categories: ["status"],
    points: 0,

    baseChance: 0.2,
    minChance: 0.1,
    maxChance: 0.35,

    cooldownTurns: 6,
    isUnique: false,
    isFavorite: false,
    isCustom: false,
    enabled: true,

    logicType: "status_effect",
    logicConfig: {
      effect: "double_points_next",
    },
  },

  {
    id: "c8",
    title: "Truth or Drink",
    description: "Answer honestly or take {x} sips.",
    difficulty: "normal",
    categories: ["individual", "social"],
    points: 3,

    baseChance: 0.45,
    minChance: 0.25,
    maxChance: 0.65,

    cooldownTurns: 3,
    isUnique: false,
    isFavorite: false,
    isCustom: false,
    enabled: true,

    logicType: "range",
    logicConfig: {
      variable: "x",
      min: 2,
      max: 4,
    },
  },
];