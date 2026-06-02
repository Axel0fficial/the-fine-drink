import { PlayerStatus } from "@/types/game";

export const fineDrinkGoodStatuses: PlayerStatus[] = [
  {
    id: "royal-treatment",
    name: "Royal Treatment",
    description: "Once per turn, you may reduce your punishment by 1 sip.",
    remainingRounds: 99,
    nature: "good",
  },
  {
    id: "second-chance",
    name: "Second Chance",
    description: "Once, you may refuse a challenge without drinking.",
    remainingRounds: 99,
    nature: "good",
  },
  {
    id: "gift-tax",
    name: "Gift Tax",
    description: "Once per turn, you may give 1 sip to another player.",
    remainingRounds: 99,
    nature: "good",
  },
];

export const fineDrinkBadStatuses: PlayerStatus[] = [
  {
    id: "glass-jaw",
    name: "Glass Jaw",
    description: "Whenever someone gives you a punishment, add 1 extra sip.",
    remainingRounds: 99,
    nature: "bad",
  },
  {
    id: "honest-mouth",
    name: "Honest Mouth",
    description: "You cannot skip truth challenges without drinking.",
    remainingRounds: 99,
    nature: "bad",
  },
  {
    id: "heavy-glass",
    name: "Heavy Glass",
    description: "Whenever you drink, add 1 extra sip.",
    remainingRounds: 99,
    nature: "bad",
  },
];
