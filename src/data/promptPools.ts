import type { PromptPoolItem } from "../types/game";

export const promptPools: Record<string, PromptPoolItem[]> = {
  charades_people: [
    { text: "Batman", audience: "all" },
    { text: "a dog", audience: "all" },
    { text: "a news anchor", audience: "all" },
  ],

  charades_actions: [
    { text: "doing dishes", audience: "all" },
    { text: "buying groceries", audience: "all" },
    { text: "opening a restaurant", audience: "all" },
  ],

  would_you_rather_romance: [
    { text: "Henry Cavill", audience: "all" },
    { text: "Keanu Reeves", audience: "all" },
    { text: "Leopold the Third", audience: "all" },
  ],

  drink_penalties: [
    { text: "take 2 sips", audience: "drinkers_only" },
    { text: "do 10 jumping jacks", audience: "non_drinkers_only" },
    { text: "lose 1 point", audience: "all" },
  ],
};
