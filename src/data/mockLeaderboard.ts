import type { LeaderboardEntry } from "../types/game";

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "lb1",
    type: "solo",
    playerProfileId: "player_axel",
    score: 250,
    wins: 12,
    gameModeId: "classic",
    createdAt: "2026-01-10",
  },
  {
    id: "lb2",
    type: "solo",
    playerProfileId: "player_sofia",
    score: 210,
    wins: 9,
    gameModeId: "classic",
    createdAt: "2026-01-12",
  },
  {
    id: "lb3",
    type: "solo",
    playerProfileId: "player_valentina",
    score: 300,
    wins: 15,
    gameModeId: "chaos",
    createdAt: "2026-01-15",
  },
  {
    id: "lb4",
    type: "team",
    teamName: "Red Dragons",
    score: 400,
    wins: 6,
    gameModeId: "team",
    createdAt: "2026-01-18",
  },
];