import type { GameMode } from "../types/game";

export const mockGameModes: GameMode[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Standard gameplay with balanced challenges.",
    allowedCategories: ["individual", "group", "quantity"],
    defaultRounds: 6,
    teamMode: false,
    routeTarget: "/game",
  },
  {
    id: "chaos",
    name: "Chaos",
    description: "Anything can happen.",
    allowedCategories: ["individual", "group", "status", "random"],
    defaultRounds: 8,
    teamMode: false,
    routeTarget: "/game",
  },
  {
    id: "team",
    name: "Team Battle",
    description: "Play in teams and compete together.",
    allowedCategories: ["group", "team", "quantity"],
    defaultRounds: 6,
    teamMode: true,
    routeTarget: "/game",
  },
  {
    id: "custom",
    name: "Custom Mode",
    description: "Build your own match settings step by step.",
    allowedCategories: [],
    defaultRounds: 6,
    teamMode: false,
    routeTarget: "/custom1",
  },
];