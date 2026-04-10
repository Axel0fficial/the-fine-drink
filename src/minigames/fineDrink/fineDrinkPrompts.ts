import type { FineDrinkEffect } from "../types";

export const FINE_DRINK_GOOD_EFFECTS: FineDrinkEffect[] = [
  {
    type: "action",
    text: "Give 6 away.",
    audience: "drinkers_only",
    tone: "good",
  },
  {
    type: "action",
    text: "Choose a player to lose 2 points.",
    audience: "all",
    tone: "good",
  },
  {
    type: "status",
    text: "For the rest of the match, gain +1 point whenever you complete a challenge.",
    audience: "all",
    tone: "good",
    scope: "player",
    remainingRounds: null,
  },
  {
    type: "status",
    text: "For 2 rounds, all players must compliment the current player before they act.",
    audience: "all",
    tone: "good",
    scope: "global",
    remainingRounds: 2,
  },
];

export const FINE_DRINK_BAD_EFFECTS: FineDrinkEffect[] = [
  {
    type: "action",
    text: "Drink 5.",
    audience: "drinkers_only",
    tone: "bad",
  },
  {
    type: "action",
    text: "Do 12 jumping jacks.",
    audience: "non_drinkers_only",
    tone: "bad",
  },
  {
    type: "action",
    text: "Lose 2 points immediately.",
    audience: "all",
    tone: "bad",
  },
  {
    type: "status",
    text: "For the rest of the match, you cannot choose Challenge B.",
    audience: "all",
    tone: "bad",
    scope: "player",
    remainingRounds: null,
  },
  {
    type: "status",
    text: "For 2 rounds, all players must cheer whenever they drink.",
    audience: "all",
    tone: "bad",
    scope: "global",
    remainingRounds: 2,
  },
];
