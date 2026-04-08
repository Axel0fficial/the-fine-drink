export type FineDrinkPromptTone = "good" | "bad";

export type FineDrinkPrompt = {
  id: string;
  text: string;
  tone: FineDrinkPromptTone;
};

export const FINE_DRINK_GOOD_PROMPTS: FineDrinkPrompt[] = [
  {
    id: "fd_good_1",
    tone: "good",
    text: "For the rest of the match, you may pass one challenge without penalty.",
  },
  {
    id: "fd_good_2",
    tone: "good",
    text: "For the rest of the match, gain +1 extra point whenever you complete a challenge.",
  },
  {
    id: "fd_good_3",
    tone: "good",
    text: "For the rest of the match, you may swap Challenge A and B one extra time each turn.",
  },
  {
    id: "fd_good_4",
    tone: "good",
    text: "For the rest of the match, if you lose a minigame, you may force a reroll once.",
  },
  {
    id: "fd_good_5",
    tone: "good",
    text: "For the rest of the match, the first bad effect against you each round is ignored.",
  },
];

export const FINE_DRINK_BAD_PROMPTS: FineDrinkPrompt[] = [
  {
    id: "fd_bad_1",
    tone: "bad",
    text: "For the rest of the match, you must speak in third person.",
  },
  {
    id: "fd_bad_2",
    tone: "bad",
    text: "For the rest of the match, every completed challenge gives you 1 fewer point, minimum 0.",
  },
  {
    id: "fd_bad_3",
    tone: "bad",
    text: "For the rest of the match, you cannot choose Challenge B.",
  },
  {
    id: "fd_bad_4",
    tone: "bad",
    text: "For the rest of the match, you must stand up before every turn starts.",
  },
  {
    id: "fd_bad_5",
    tone: "bad",
    text: "For the rest of the match, whenever you pass, the current leader gains 1 point.",
  },
];
